import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'Crown & Clip Barbers | Kimberley',
  description: 'Premium cuts, fades and beard work in Kimberley. Book your chair online.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="topbar"><div className="container"><span>Kimberley • Northern Cape</span><span>Tue–Sat · 09:00–18:00</span></div></div>
        <Nav />
        <main>{children}</main>
        <Analytics/>
        <Footer />
      </body>
    </html>
  );
}
