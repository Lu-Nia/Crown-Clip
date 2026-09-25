'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

function Logo() {
  return <Link href="/" className="brand" aria-label="Crown and Clip home">
    <span className="logo-mark"><svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 15v34M46 15v34M18 22h28M24 15l8 12 8-12M24 49l8-12 8 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 28h36" stroke="var(--gold)" strokeWidth="3"/></svg></span>
    <span className="brand-name">Crown & Clip<small>Barbers</small></span>
  </Link>
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [['/','Home'],['/services','Services'],['/about','About'],['/contact','Contact']];
  return <header className="site-header">
    <div className="container nav">
      <Logo />
      <nav className="nav-links" aria-label="Primary navigation">{links.map(([href,label]) => <Link className={pathname===href ? 'active':''} key={href} href={href}>{label}</Link>)}</nav>
      <Link className="btn btn-primary btn-small" href="/booking">Book Now</Link>
      <button className="mobile-toggle" aria-label="Toggle mobile navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open ? '×' : '☰'}</button>
    </div>
    <div className={`mobile-menu ${open?'open':''}`}>
      {links.map(([href,label]) => <Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
      <Link className="btn btn-primary" href="/booking" onClick={()=>setOpen(false)} style={{marginTop:12}}>Book Now</Link>
    </div>
  </header>
}
