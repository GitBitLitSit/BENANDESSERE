import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/google-calendar';

//export const dynamic = 'force-static';

/*export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const duration = parseInt(searchParams.get('duration') || '50', 10);

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date, duration);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}*/
