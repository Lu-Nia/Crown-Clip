import Link from 'next/link';
import { ServiceCards } from '@/components/ServiceCards';
export default function Services(){return <>
  <div className="container page-hero"><span className="eyebrow">Straightforward pricing</span><h1>Services built around<br/>the finished look.</h1><p>From a clean everyday cut to the full executive package, every service is timed properly and finished with the same attention to detail.</p></div>
  <section className="section" style={{paddingTop:30}}><div className="container"><ServiceCards/></div></section>
  <section className="section" style={{paddingTop:0}}><div className="container"><div className="cta-band"><div><h3>Ready for the chair?</h3><p>Live availability is shown during booking, so you can choose a time that is actually open.</p></div><Link className="btn" href="/booking" style={{borderColor:'#19140e'}}>Book now →</Link></div></div></section>
</>}
