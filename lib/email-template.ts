interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  duration: number;
  date: string;
  time: string;
  price: number;
  notes?: string;
  googleCalendarUrl: string;
  locale: string;
}

const translations: Record<string, Record<string, string>> = {
  it: {
    subject: 'Conferma Prenotazione - BEN&ESSERE',
    greeting: 'Ciao',
    confirmation: 'La tua prenotazione è stata confermata!',
    service: 'Servizio',
    duration: 'Durata',
    date: 'Data',
    time: 'Orario',
    price: 'Prezzo',
    notes: 'Note',
    minutes: 'Minuti',
    addToCalendar: 'Aggiungi al Calendario',
    footer: 'Grazie per aver scelto BEN&ESSERE. Non vediamo l\'ora di vederti!',
    notifySubject: 'Nuova Prenotazione',
    notifyMessage: 'Hai una nuova prenotazione:',
    client: 'Cliente',
    phone: 'Telefono',
  },
  de: {
    subject: 'Buchungsbestätigung - BEN&ESSERE',
    greeting: 'Hallo',
    confirmation: 'Ihre Buchung wurde bestätigt!',
    service: 'Leistung',
    duration: 'Dauer',
    date: 'Datum',
    time: 'Uhrzeit',
    price: 'Preis',
    notes: 'Anmerkungen',
    minutes: 'Minuten',
    addToCalendar: 'Zum Kalender hinzufügen',
    footer: 'Vielen Dank, dass Sie sich für BEN&ESSERE entschieden haben. Wir freuen uns auf Sie!',
    notifySubject: 'Neue Buchung',
    notifyMessage: 'Sie haben eine neue Buchung:',
    client: 'Kunde',
    phone: 'Telefon',
  },
  en: {
    subject: 'Booking Confirmation - BEN&ESSERE',
    greeting: 'Hello',
    confirmation: 'Your booking has been confirmed!',
    service: 'Service',
    duration: 'Duration',
    date: 'Date',
    time: 'Time',
    price: 'Price',
    notes: 'Notes',
    minutes: 'Minutes',
    addToCalendar: 'Add to Calendar',
    footer: 'Thank you for choosing BEN&ESSERE. We look forward to seeing you!',
    notifySubject: 'New Booking',
    notifyMessage: 'You have a new booking:',
    client: 'Client',
    phone: 'Phone',
  },
};

function getT(locale: string) {
  return translations[locale] || translations.en;
}

export function generateClientEmail(booking: BookingDetails): { subject: string; html: string } {
  const t = getT(booking.locale);
  return {
    subject: t.subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#faf6f3;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:Georgia,serif;font-size:28px;color:#3d2c2c;margin:0;">BEN&amp;ESSERE</h1>
      <p style="font-size:12px;color:#8a7a72;letter-spacing:3px;margin:4px 0 0;">by Larissa</p>
    </div>
    <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e8ddd6;">
      <p style="font-size:16px;color:#3d2c2c;margin:0 0 8px;">${t.greeting} ${booking.name},</p>
      <p style="font-size:15px;color:#8a7a72;margin:0 0 24px;">${t.confirmation}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:13px;color:#8a7a72;">${t.service}</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:14px;color:#3d2c2c;font-weight:600;text-align:right;">${booking.serviceName}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:13px;color:#8a7a72;">${t.duration}</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:14px;color:#3d2c2c;font-weight:600;text-align:right;">${booking.duration} ${t.minutes}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:13px;color:#8a7a72;">${t.date}</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:14px;color:#3d2c2c;font-weight:600;text-align:right;">${booking.date}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:13px;color:#8a7a72;">${t.time}</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e2;font-size:14px;color:#3d2c2c;font-weight:600;text-align:right;">${booking.time}</td></tr>
        <tr><td style="padding:10px 0;font-size:13px;color:#8a7a72;">${t.price}</td><td style="padding:10px 0;font-size:18px;color:#b5735f;font-weight:700;text-align:right;">${booking.price}&euro;</td></tr>
      </table>
      ${booking.notes ? `<p style="margin:16px 0 0;padding:12px;background:#faf6f3;border-radius:8px;font-size:13px;color:#8a7a72;"><strong>${t.notes}:</strong> ${booking.notes}</p>` : ''}
      <div style="text-align:center;margin-top:28px;">
        <a href="${booking.googleCalendarUrl}" target="_blank" style="display:inline-block;padding:12px 28px;background-color:#b5735f;color:#ffffff;text-decoration:none;border-radius:24px;font-size:14px;font-weight:600;">${t.addToCalendar}</a>
      </div>
    </div>
    <p style="text-align:center;font-size:13px;color:#8a7a72;margin:24px 0 0;">${t.footer}</p>
  </div>
</body>
</html>`,
  };
}

export function generateTherapistEmail(booking: BookingDetails): { subject: string; html: string } {
  const t = getT(booking.locale);
  return {
    subject: `${t.notifySubject}: ${booking.name} - ${booking.serviceName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#faf6f3;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-family:Georgia,serif;font-size:24px;color:#3d2c2c;margin:0;">BEN&amp;ESSERE</h1>
    </div>
    <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e8ddd6;">
      <p style="font-size:16px;color:#3d2c2c;font-weight:600;margin:0 0 16px;">${t.notifyMessage}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.client}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.name}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">Email</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.email}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.phone}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.phone}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.service}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.serviceName}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.duration}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.duration} ${t.minutes}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.date}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.date}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.time}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.time}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.price}</td><td style="padding:8px 0;font-size:14px;color:#b5735f;font-weight:700;text-align:right;">${booking.price}&euro;</td></tr>
        ${booking.notes ? `<tr><td style="padding:8px 0;font-size:13px;color:#8a7a72;">${t.notes}</td><td style="padding:8px 0;font-size:14px;color:#3d2c2c;text-align:right;">${booking.notes}</td></tr>` : ''}
      </table>
    </div>
  </div>
</body>
</html>`,
  };
}
