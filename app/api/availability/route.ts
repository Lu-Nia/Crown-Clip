import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
function toMinutes(t: string) { const [h,m] = t.slice(0,5).split(':').map(Number); return h*60+m; }
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const barberId = request.nextUrl.searchParams.get('barberId');
  if (!date) return NextResponse.json({ error: 'A date is required.' }, { status: 400 });
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ booked: [], configured: false });

  let query = supabase.from('bookings').select('barber_id,time,service_name,start_at,end_at').eq('booking_date', date).eq('status', 'confirmed');
  if (barberId) query = query.eq('barber_id', barberId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Could not load availability.' }, { status: 500 });

  return NextResponse.json({
    configured: true,
    booked: (data ?? []).map((item) => ({ barberId: item.barber_id, time: item.time.slice(0,5), serviceName: item.service_name, startAt: item.start_at, endAt: item.end_at })),
    bookedStartMinutes: (data ?? []).map((item) => toMinutes(item.time))
  });
}
