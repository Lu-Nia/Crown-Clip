import Link from 'next/link';
export function Footer() {
  return <footer>
    <div className="container">
      <div className="footer-grid">
        <div><div className="brand"><span className="logo-mark"><span style={{fontFamily:'Georgia',fontWeight:900}}>C</span></span><span className="brand-name">Crown & Clip<small>Barbers</small></span></div><p style={{maxWidth:340}}>Sharp work, proper conversation and a chair worth making time for. Premium grooming without the fuss.</p></div>
        <div><h4>Explore</h4><ul><li><Link href="/">Home</Link></li><li><Link href="/services">Services</Link></li><li><Link href="/about">About the shop</Link></li><li><Link href="/booking">Book a chair</Link></li></ul></div>
        <div><h4>Visit</h4><ul><li>Kimberley, Northern Cape</li><li>Tue–Sat, 09:00–18:00</li><li><a href="tel:0710902591">071 090 2591</a></li><li><a href="mailto:reinerstumelo@gmail.com">reinerstumelo@gmail.com</a></li></ul></div>
        <div><h4>Legal & Social</h4><ul><li><Link href="/terms">Terms & Conditions</Link></li><li><a href="https://www.instagram.com/faith_lunia/" target="_blank" rel="noreferrer">Instagram ↗</a></li><li><a href="https://web.facebook.com/tumelo.reiners.1" target="_blank" rel="noreferrer">Facebook ↗</a></li><li><Link href="/contact">Contact & support</Link></li></ul></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Crown & Clip Barbers.</span><span>Built for a real-world customer journey.</span></div>
    </div>
  </footer>
}
