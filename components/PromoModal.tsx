'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export function PromoModal() {
  const [open,setOpen] = useState(false);
  useEffect(()=>{
    const seen = sessionStorage.getItem('cc-promo-seen');
    if (!seen) {
      const timer = window.setTimeout(()=>setOpen(true), 1600);
      return ()=>window.clearTimeout(timer);
    }
  },[]);
  const close=()=>{ sessionStorage.setItem('cc-promo-seen','1'); setOpen(false); };
  if(!open) return null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="promo-title">
    <div className="modal">
      <div className="modal-top"><h3 id="promo-title">First chair, on us.</h3><button className="close" onClick={close} aria-label="Close promotion">×</button></div>
      <p>New around Kimberley? Book your first full-service appointment and get a complimentary hot-towel finish.</p>
      <div className="discount">FIRST VISIT · HOT-TOWEL FINISH INCLUDED</div>
      <div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}><Link href="/booking" className="btn btn-primary" onClick={close}>Book your chair</Link><button className="btn btn-ghost" onClick={close}>Maybe later</button></div>
    </div>
  </div>
}
