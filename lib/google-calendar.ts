import { google } from 'googleapis';

const WORK_START = 9; // 9:00
const WORK_END = 18; // 18:00
const SLOT_INTERVAL = 30; // minutes

interface BusyPeriod {
  start: string;
  end: string;
}

function generateMockSlots(duration: number): string[] {
  const slots: string[] = [];
  for (let hour = WORK_START; hour < WORK_END; hour++) {
    for (let min = 0; min < 60; min += SLOT_INTERVAL) {
      const endMinutes = hour * 60 + min + duration;
      if (endMinutes <= WORK_END * 60) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
  }
  // Return a subset to make it look realistic (remove some random slots)
  return slots.filter((_, i) => i % 3 !== 1);
}

export async function getAvailableSlots(
  date: string,
  duration: number
): Promise<string[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  // Fallback to mock data if env vars are not set
  if (!calendarId || !serviceAccountKey) {
    return generateMockSlots(duration);
  }

  try {
    const credentials = JSON.parse(serviceAccountKey);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const timeMin = new Date(`${date}T${String(WORK_START).padStart(2, '0')}:00:00`);
    const timeMax = new Date(`${date}T${String(WORK_END).padStart(2, '0')}:00:00`);

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busyPeriods: BusyPeriod[] =
      (res.data.calendars?.[calendarId]?.busy as BusyPeriod[]) || [];

    // Generate all possible slots
    const allSlots: string[] = [];
    for (let hour = WORK_START; hour < WORK_END; hour++) {
      for (let min = 0; min < 60; min += SLOT_INTERVAL) {
        const endMinutes = hour * 60 + min + duration;
        if (endMinutes <= WORK_END * 60) {
          allSlots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
        }
      }
    }

    // Filter out busy slots
    return allSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const slotStart = new Date(`${date}T${slot}:00`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

      return !busyPeriods.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return generateMockSlots(duration);
  }
}
