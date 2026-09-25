'use client';
import { useEffect, useMemo, useState } from 'react';

const SLOT_TIMES=['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];
const SERVICES = [
  {id:'cut',name:'Signature Cut',price:220,minutes:45}, {id:'fade',name:'Skin Fade',price:260,minutes:60},
  {id:'beard',name:'Beard Sculpt',price:120,minutes:30}, {id:'combo',name:'Cut + Beard',price:320,minutes:75},
  {id:'kids',name:'Kids Cut',price:170,minutes:40}, {id:'executive',name:'Executive Package',price:390,minutes:90}
];
const BARBERS=[{id:'themba',name:'Themba Mokoena'},{id:'jayden',name:'Jayden Jacobs'},{id:'sipho',name:'Sipho Dlamini'}];
const WEEKDAY_CLOSED=[0,1];

function formatDate(date: Date){return date.toLocaleDateString('en-ZA',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
function ymd(date: Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function slotStart(date:string,time:string){return new Date(`${date}T${time}:00+02:00`);}
function slotEnd(date:string,time:string,minutes:number){const d=slotStart(date,time);d.setMinutes(d.getMinutes()+minutes);return d;}
function overlaps(start: Date,end: Date,bStart:string,bEnd:string){const bs=new Date(bStart);const be=new Date(bEnd);return start < be && end > bs;}
function validDate(d:Date){return !WEEKDAY_CLOSED.includes(d.getDay()) && d>=todayForPicker();}
function todayForPicker(){const d=new Date();d.setHours(0,0,0,0);return d;}

export function BookingExperience(){
  const today=todayForPicker();
  const [month,setMonth]=useState(new Date(today.getFullYear(),today.getMonth(),1));
  const [selectedDate,setSelectedDate]=useState(ymd(today));
  const [serviceId,setServiceId]=useState('fade');
  const [barberId,setBarberId]=useState('themba');
  const [selectedTime,setSelectedTime]=useState('');
  const [bookings,setBookings]=useState<any[]>([]);
  const [loadingSlots,setLoadingSlots]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState<any>(null);
  const [form,setForm]=useState({name:'',phone:'',email:'',notes:''});

  const service=SERVICES.find(x=>x.id===serviceId)!;

  async function loadAvailability(){
    setLoadingSlots(true); setError(''); setSelectedTime('');
    try{
      const res=await fetch(`/api/availability?date=${selectedDate}&barberId=${barberId}`,{cache:'no-store'});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || 'Could not load availability.');
      setBookings(data.booked||[]);
      if(data.configured===false) setError('Booking database is not connected yet. Add the Supabase settings before deploying this assessment.');
    }catch(e:any){setError(e.message || 'Could not load availability.'); setBookings([]);}
    finally{setLoadingSlots(false);}
  }
  useEffect(()=>{loadAvailability();},[selectedDate,barberId]);

  const days=useMemo(()=>{
    const first=new Date(month.getFullYear(),month.getMonth(),1); const last=new Date(month.getFullYear(),month.getMonth()+1,0);
    const cells:number[]=[]; for(let i=0;i<first.getDay();i++) cells.push(0); for(let d=1;d<=last.getDate();d++) cells.push(d); return cells;
  },[month]);

  const canGoPrev=month.getFullYear()>today.getFullYear() || month.getMonth()>today.getMonth();
  function selectDay(d:number){
    const date=new Date(month.getFullYear(),month.getMonth(),d); if(date<today || !validDate(date)) return; setSelectedDate(ymd(date));
  }
  function isSlotBooked(time:string){
    const start=slotStart(selectedDate,time); const end=slotEnd(selectedDate,time,service.minutes);
    const mins=start.getHours()*60+start.getMinutes();
    if(mins + service.minutes > 18*60) return true;
    if(start.getTime() <= Date.now()) return true;
    return bookings.some(b=>overlaps(start,end,b.startAt,b.endAt));
  }
  function selectedDayLabel(){return formatDate(slotStart(selectedDate,'09:00'));}

  function updateField(key:string,value:string){setForm(prev=>({...prev,[key]:value}));}

  async function submit(e:React.FormEvent){
    e.preventDefault(); setError('');
    if(!selectedTime){setError('Choose an available time before confirming your booking.'); return;}
    if(isSlotBooked(selectedTime)){setError('That slot is no longer available. Please choose another time.'); await loadAvailability(); return;}
    setSubmitting(true);
    try{
      const res=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,serviceId,barberId,date:selectedDate,time:selectedTime})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || 'Booking could not be completed.');
      setSuccess(data); setForm({name:'',phone:'',email:'',notes:''}); setSelectedTime(''); await loadAvailability();
    }catch(e:any){setError(e.message || 'Booking could not be completed.'); await loadAvailability();}
    finally{setSubmitting(false);}
  }

  const start=selectedTime?slotStart(selectedDate,selectedTime):null;
  const end=selectedTime?slotEnd(selectedDate,selectedTime,service.minutes):null;
  function googleCalendarUrl(){
    if(!start || !end) return '#';
    const compact=(d:Date)=>`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Crown & Clip — ${service.name}`)}&dates=${compact(start)}/${compact(end)}&ctz=Africa%2FJohannesburg&details=${encodeURIComponent(`Appointment with ${BARBERS.find(b=>b.id===barberId)?.name}. Please arrive 5 minutes early.`)}&location=${encodeURIComponent('Kimberley, Northern Cape')}`;
  }
  function icsUrl(){
    return `/api/calendar?date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&service=${encodeURIComponent(service.name)}&barber=${encodeURIComponent(BARBERS.find(b=>b.id===barberId)?.name||'Barber')}&duration=${service.minutes}&location=${encodeURIComponent('Kimberley, Northern Cape')}`;
  }

  return <div className="booking-shell">
    <div className="card booking-card">
      <div className="booking-stepper"><span className="step-pill active">1 · Service</span><span className="step-pill active">2 · Barber</span><span className="step-pill active">3 · Date & time</span><span className="step-pill">4 · Details</span></div>

      <div className="form-grid">
        <div className="field"><label htmlFor="service">Service</label><select id="service" value={serviceId} onChange={e=>setServiceId(e.target.value)}>{SERVICES.map(s=><option value={s.id} key={s.id}>{s.name} — R{s.price}</option>)}</select></div>
        <div className="field"><label htmlFor="barber">Barber</label><select id="barber" value={barberId} onChange={e=>setBarberId(e.target.value)}>{BARBERS.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select></div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-box">
          <div className="month-head"><button className="icon-btn" disabled={!canGoPrev} aria-label="Previous month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}>‹</button><strong>{month.toLocaleDateString('en-ZA',{month:'long',year:'numeric'})}</strong><button className="icon-btn" aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}>›</button></div>
          <div className="weekdays">{['S','M','T','W','T','F','S'].map((x,i)=><span key={i}>{x}</span>)}</div>
          <div className="month-grid">
            {days.map((day,i)=> day===0 ? <span key={`blank-${i}`} /> : <button key={day} className={`date-cell ${selectedDate===ymd(new Date(month.getFullYear(),month.getMonth(),day))?'selected':''}`} disabled={new Date(month.getFullYear(),month.getMonth(),day)<today || !validDate(new Date(month.getFullYear(),month.getMonth(),day))} onClick={()=>selectDay(day)}>{day}</button>)}
          </div>
          <p className="muted" style={{fontSize:'.74rem',lineHeight:1.6,marginBottom:0,marginTop:14}}>Closed Sundays & Mondays. Select a date to see live chair availability.</p>
        </div>

        <div className="slot-box">
          <div className="slots-head"><h4>{selectedDayLabel()}</h4><div className="legend"><span><i className="dot"/> Available</span><span><i className="dot booked"/> Booked</span></div></div>
          {loadingSlots ? <div className="notice">Checking live availability…</div> : <div className="slot-grid">{SLOT_TIMES.map(t=>{
            const booked=isSlotBooked(t); const isSelected=selectedTime===t;
            return <button key={t} className={`slot ${booked?'booked':''} ${isSelected?'selected':''}`} disabled={booked} onClick={()=>setSelectedTime(t)}>{t}<small>{booked?'Booked':`${service.minutes} min`}</small></button>
          })}</div>}
          {bookings.length>0 && <p className="muted" style={{fontSize:'.76rem',lineHeight:1.6,marginBottom:0,marginTop:14}}>Booked times are greyed out. Longer services also block every overlapping start time, so two appointments cannot overlap for the same barber.</p>}
        </div>
      </div>

      {error && <div className="notice error" style={{marginTop:16}}>{error}</div>}

      <form onSubmit={submit} style={{marginTop:22}}>
        <div className="form-grid">
          <div className="field"><label htmlFor="name">Full name *</label><input id="name" required value={form.name} onChange={e=>updateField('name',e.target.value)} placeholder="e.g. Kabelo Molefe" /></div>
          <div className="field"><label htmlFor="phone">Phone *</label><input id="phone" type="tel" required value={form.phone} onChange={e=>updateField('phone',e.target.value)} placeholder="e.g. 071 234 5678" /></div>
          <div className="field"><label htmlFor="email">Email *</label><input id="email" type="email" required value={form.email} onChange={e=>updateField('email',e.target.value)} placeholder="you@example.com" /></div>
          <div className="field"><label htmlFor="notes">Notes</label><input id="notes" value={form.notes} onChange={e=>updateField('notes',e.target.value)} placeholder="Anything we should know?" /></div>
        </div>
        <div className="notice" style={{marginTop:14}}>By confirming, you agree to our <a href="/terms" style={{color:'var(--gold-strong)',fontWeight:800}}>Terms & Conditions</a>. Your appointment is only confirmed after the booking is accepted by the server.</div>
        <button className="btn btn-primary" type="submit" disabled={submitting || loadingSlots || !selectedTime} style={{width:'100%',marginTop:14}}>{submitting?'Confirming…':selectedTime?`Confirm ${service.name} at ${selectedTime} · R${service.price}`:'Select an available time'}</button>
      </form>
    </div>

    <aside className="card booking-summary">
      <div className="summary-top"><h3>Your appointment</h3><span className="eyebrow">Live</span></div>
      <div className="summary-list">
        <div className="summary-row"><span>Service</span><strong>{service.name}</strong></div>
        <div className="summary-row"><span>Barber</span><strong>{BARBERS.find(b=>b.id===barberId)?.name}</strong></div>
        <div className="summary-row"><span>Date</span><strong>{selectedDayLabel()}</strong></div>
        <div className="summary-row"><span>Time</span><strong>{selectedTime||'Choose a slot'}</strong></div>
        <div className="summary-row"><span>Duration</span><strong>{service.minutes} min</strong></div>
      </div>
      <div className="summary-total"><span>Total</span><span>R{service.price}</span></div>
      <p className="muted" style={{fontSize:'.76rem',lineHeight:1.65}}>After confirmation, you’ll get direct calendar actions for Google Calendar and an Apple-compatible calendar file.</p>
    </aside>

    {success && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <div className="modal-top"><h3 id="confirm-title">You’re booked.</h3><button className="close" onClick={()=>setSuccess(null)} aria-label="Close confirmation">×</button></div>
        <p>Your appointment is confirmed for <strong style={{color:'var(--text)'}}>{formatDate(slotStart(success.date,success.time))}</strong> at <strong style={{color:'var(--text)'}}>{success.time}</strong>.</p>
        <div className="summary-list"><div className="summary-row"><span>Service</span><strong>{success.serviceName}</strong></div><div className="summary-row"><span>Barber</span><strong>{BARBERS.find(b=>b.id===success.barberId)?.name}</strong></div><div className="summary-row"><span>Location</span><strong>{success.location}</strong></div></div>
        <div className="discount">ADD TO YOUR CALENDAR</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:16}}><a className="btn btn-primary" href={googleCalendarUrl()} target="_blank" rel="noreferrer">Google Calendar ↗</a><a className="btn btn-ghost" href={icsUrl()}>Apple / .ics ↓</a></div>
        <p style={{fontSize:'.78rem',marginBottom:0}}>Save it now so the appointment is not forgotten. The calendar event uses the exact selected date, time, service and barber.</p>
      </div>
    </div>}
  </div>
}
