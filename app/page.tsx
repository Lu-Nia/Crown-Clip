import Link from 'next/link';
import { PromoModal } from '@/components/PromoModal';
import { ServiceCards } from '@/components/ServiceCards';

export default function Home() {
  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Kimberley · Northern Cape</span>
          <h1 className="display">Sharp cuts.<br/><em>Proper craft.</em></h1>
          <p>Crown & Clip is a modern neighbourhood barbershop built around excellent cuts, clean fades and an easy booking experience. Walk out looking considered, not overdone.</p>
          <div className="hero-actions"><Link href="/booking" className="btn btn-primary">Book a chair <span>→</span></Link><Link href="/services" className="btn btn-ghost">View services</Link></div>
          <div className="hero-meta"><span>★ 4.9 client rating</span><span>3 experienced barbers</span><span>Walk-ins subject to availability</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-photo"><img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1100&q=85" alt="Barber working with clippers in a barbershop" /></div>
          <div className="hero-stamp"><strong>09–18</strong><span>Tue — Sat</span></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-head"><div><span className="eyebrow">The chair list</span><h2>Popular services</h2></div><Link className="btn btn-ghost btn-small" href="/services">See all services →</Link></div>
        <ServiceCards compact />
      </div>
    </section>

    <section className="section" style={{paddingTop:0}}>
      <div className="container split">
        <div className="card story-card"><span className="eyebrow">Why Crown & Clip</span><h3>Good grooming is a small ritual.</h3><p>We keep the shop relaxed, the consultation simple and the standard high. Whether it is your regular fade or the one appointment before a big day, you get a proper finish every time.</p><div className="stat-row"><div className="stat"><strong>45–90</strong><span>minutes per service</span></div><div className="stat"><strong>6</strong><span>core services</span></div><div className="stat"><strong>1</strong><span>easy booking flow</span></div></div></div>
        <div className="card story-card" style={{background:'var(--cream)',color:'#1b140c'}}><span className="eyebrow" style={{color:'#7b5b25'}}>New around here?</span><h3>Your first visit should be easy.</h3><p style={{color:'#5d4d3b'}}>Choose a service, pick your barber, select a real available slot and add the appointment straight to your calendar. No phone tag required.</p><Link className="btn" href="/booking" style={{borderColor:'#1b140c'}}>Check availability →</Link></div>
      </div>
    </section>
    <PromoModal />
  </>;
}
