import { BookingExperience } from '@/components/BookingExperience';
export default function Booking(){return <>
  <div className="container page-hero"><span className="eyebrow">Book your chair</span><h1>Choose a real opening.<br/>Leave with a plan.</h1><p>Select your service, barber, date and time. Already-booked time is automatically blocked, including overlapping slots for longer services.</p></div>
  <section className="section" style={{paddingTop:30}}><div className="container"><BookingExperience/></div></section>
</>}
