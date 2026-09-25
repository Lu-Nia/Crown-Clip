import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SLOT_TIMES = new Set(['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00']);
const SERVICES: Record<string, { name: string; minutes: number }> = {
  cut: { name: 'Signature Cut', minutes: 45 },
  fade: { name: 'Skin Fade', minutes: 60 },
  beard: { name: 'Beard Sculpt', minutes: 30 },
  combo: { name: 'Cut + Beard', minutes: 75 },
  kids: { name: 'Kids Cut', minutes: 40 },
  executive: { name: 'Executive Package', minutes: 90 }
};
const BARBERS = new Set(['themba','jayden','sipho']);
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 18 * 60;
function timeToMinutes(t: string) { const [h,m] = t.split(':').map(Number); return h * 60 + m; }

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
function toIsoSA(date: string, time: string) { return `${date}T${time}:00+02:00`; }
function addMinutes(date: string, time: string, minutes: number) {
  const start = new Date(toIsoSA(date, time));
  start.setMinutes(start.getMinutes() + minutes);
  return start.toISOString();
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const required = ['serviceId','barberId','date','time','name','phone','email'];
  if (!body || required.some((key) => !body[key])) return NextResponse.json({ error: 'Please complete all required booking fields.' }, { status: 400 });
  if (!SERVICES[body.serviceId] || !BARBERS.has(body.barberId) || !SLOT_TIMES.has(body.time)) return NextResponse.json({ error: 'That booking option is not available.' }, { status: 400 });
  const [dateY, dateM, dateD] = String(body.date).split('-').map(Number);
  const weekday = new Date(Date.UTC(dateY, dateM - 1, dateD)).getUTCDay();
  if (!dateY || !dateM || !dateD || [0,1].includes(weekday)) return NextResponse.json({ error: 'The shop is closed on that day.' }, { status: 400 });
  const startMinutes = timeToMinutes(body.time);
  if (startMinutes < OPEN_MINUTES || startMinutes + SERVICES[body.serviceId].minutes > CLOSE_MINUTES) return NextResponse.json({ error: 'That service does not fit inside the shop opening hours. Please choose an earlier slot.' }, { status: 400 });
  const requested = new Date(`${body.date}T${body.time}:00+02:00`);
  if (Number.isNaN(requested.getTime()) || requested <= new Date()) return NextResponse.json({ error: 'Please choose a future appointment time.' }, { status: 400 });
  if (!/^\+?[0-9\s()-]{10,}$/.test(String(body.phone))) return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(body.email))) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  const service = SERVICES[body.serviceId];
  const startAt = toIsoSA(body.date, body.time);
  const endAt = addMinutes(body.date, body.time, service.minutes);
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Booking database is not configured. Add Supabase environment variables before deploying.' }, { status: 503 });

  const booking = {
    service_id: body.serviceId,
    service_name: service.name,
    barber_id: body.barberId,
    booking_date: body.date,
    time: body.time,
    start_at: startAt,
    end_at: endAt,
    customer_name: String(body.name).trim().slice(0, 100),
    customer_phone: String(body.phone).trim().slice(0, 40),
    customer_email: String(body.email).trim().toLowerCase().slice(0, 160),
    notes: String(body.notes ?? '').trim().slice(0, 500),
    status: 'confirmed'
  };

  const { data, error } = await supabase.from('bookings').insert(booking).select('id').single();
  if (error) {
    if (error.code === '23P01' || error.code === '23505') return NextResponse.json({ error: 'That time overlaps an existing booking with this barber. Please choose another slot.' }, { status: 409 });
    return NextResponse.json({ error: 'We could not create the booking. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ bookingId: data.id, serviceName: service.name, barberId: booking.barber_id, date: booking.booking_date, time: booking.time, durationMinutes: service.minutes, shopName: 'Crown & Clip Barbers', location: 'Kimberley, Northern Cape' }, { status: 201 });
}
