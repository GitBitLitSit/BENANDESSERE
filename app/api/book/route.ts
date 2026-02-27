import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateICS, generateGoogleCalendarUrl } from '@/lib/ics-generator';
import { generateClientEmail, generateTherapistEmail } from '@/lib/email-template';

const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  notes: z.string().optional().default(''),
  service: z.string().min(1),
  serviceName: z.string().min(1),
  duration: z.number().positive(),
  price: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  locale: z.string().default('it'),
});

async function sendZeptoMail(
  to: string,
  subject: string,
  html: string,
  icsContent?: string
) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;

  if (!token || !fromEmail) {
    console.log('ZeptoMail not configured. Would have sent email to:', to);
    console.log('Subject:', subject);
    return { success: true, mock: true };
  }

  const attachments = icsContent
    ? [
        {
          content: Buffer.from(icsContent).toString('base64'),
          mime_type: 'text/calendar',
          name: 'booking.ics',
        },
      ]
    : [];

  const response = await fetch('https://api.zeptomail.com/v1.1/email', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-enczapikey ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { address: fromEmail, name: 'BEN&ESSERE' },
      to: [{ email_address: { address: to } }],
      subject,
      htmlbody: html,
      ...(attachments.length > 0 ? { attachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('ZeptoMail error:', errorText);
    throw new Error(`ZeptoMail API error: ${response.status}`);
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Generate .ics file
    const icsContent = generateICS({
      title: `BEN&ESSERE: ${data.serviceName}`,
      description: `Massage appointment with Larissa\n${data.serviceName} - ${data.duration} min\nClient: ${data.name}\nPhone: ${data.phone}`,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: 'BEN&ESSERE Studio',
    });

    // Generate Google Calendar URL
    const googleCalendarUrl = generateGoogleCalendarUrl({
      title: `BEN&ESSERE: ${data.serviceName}`,
      description: `Massage appointment with Larissa - ${data.serviceName} (${data.duration} min)`,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: 'BEN&ESSERE Studio',
    });

    // Generate email content
    const clientEmail = generateClientEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceName: data.serviceName,
      duration: data.duration,
      date: data.date,
      time: data.time,
      price: data.price,
      notes: data.notes,
      googleCalendarUrl,
      locale: data.locale,
    });

    const therapistEmail = generateTherapistEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceName: data.serviceName,
      duration: data.duration,
      date: data.date,
      time: data.time,
      price: data.price,
      notes: data.notes,
      googleCalendarUrl,
      locale: data.locale,
    });

    // Send confirmation email to client (with .ics attachment)
    await sendZeptoMail(data.email, clientEmail.subject, clientEmail.html, icsContent);

    // Send notification email to therapist
    const therapistEmailAddr = process.env.THERAPIST_EMAIL;
    if (therapistEmailAddr) {
      await sendZeptoMail(
        therapistEmailAddr,
        therapistEmail.subject,
        therapistEmail.html,
        icsContent
      );
    }

    return NextResponse.json({
      success: true,
      googleCalendarUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
