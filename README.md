# Crown & Clip Barbers — WebMax Practical Assessment

A client-ready barber shop website built for the Talent Forge Junior Full-Stack Developer practical assessment.

## Included
- Home, Services, About, Contact/Booking and Terms & Conditions pages
- Responsive mobile navigation
- Custom Crown & Clip visual identity
- Purposeful first-visit promotion modal
- Full service/barber/date/time booking flow
- Live availability endpoint
- Server-side booking validation
- PostgreSQL exclusion constraint that blocks overlapping appointments per barber
- Google Calendar event link with the selected appointment details
- Apple Calendar-compatible `.ics` download with the selected appointment details

## Supabase setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase.sql`.
3. Copy `.env.example` to `.env.local`.
4. Set:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (preferred)
   - `SUPABASE_SERVICE_ROLE_KEY` (legacy fallback)
5. Run `npm install` then `npm run dev`.

For deployment, add the same environment variables to the hosting platform. The Supabase secret/service-role key is used only inside server routes and must never be exposed to client-side code. Supabase currently recommends the newer secret key for server-side use; the legacy service_role variable remains supported here as a fallback.

## Booking integrity
Appointments are stored with a South Africa (+02:00) start/end range. PostgreSQL `EXCLUDE USING gist` prevents overlapping confirmed appointments for the same barber. This is stronger than simply checking for identical start times, because a 60-minute booking also blocks a 09:30 start after a 09:00 booking.

## Calendar behavior
- Google Calendar uses a dynamic event URL containing the chosen date/time, service, barber and duration.
- Apple Calendar and compatible clients use a dynamically generated `.ics` event.
