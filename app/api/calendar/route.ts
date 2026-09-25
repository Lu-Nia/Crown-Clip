import { NextRequest, NextResponse } from 'next/server';

function escapeICS(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}
function pad(n: number) { return String(n).padStart(2, '0'); }
function localToUtcStamp(date: string, time: string, minutes: number) {
  const [y,m,d] = date.split('-').map(Number);
  const [hh,mm] = time.split(':').map(Number);
  // Booking hours are South Africa Standard Time (UTC+2).
  const dt = new Date(Date.UTC(y, m - 1, d, hh - 2, mm));
  dt.setUTCMinutes(dt.getUTCMinutes() + minutes);
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
}

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const date = p.get('date');
  const time = p.get('time');
  const service = p.get('service');
  const barber = p.get('barber');
  const duration = Number(p.get('duration') || '45');
  const location = p.get('location') || 'Kimberley, Northern Cape';
  if (!date || !time || !service || !barber) return NextResponse.json({ error: 'Missing calendar information.' }, { status: 400 });

  const dtStart = localToUtcStamp(date, time, 0);
  const dtEnd = localToUtcStamp(date, time, duration);
  const uid = `crown-clip-${date}-${time}-${barber}@crownclip.local`;
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Crown & Clip Barbers//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z')}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICS(`Crown & Clip — ${service}`)}`,
    `DESCRIPTION:${escapeICS(`Appointment with ${barber} at Crown & Clip Barbers. Please arrive 5 minutes early.`)}`,
    `LOCATION:${escapeICS(location)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="crown-clip-${date}-${time.replace(':','')}.ics"`,
      'Cache-Control': 'no-store'
    }
  });
}
