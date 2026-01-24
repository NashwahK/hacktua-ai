import './globals.css';
import Footer from './components/Footer';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';

export const metadata = {
  title: 'hacktua',
  icons: { icon: '/assets/hacktua-white.png' },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins text-white min-h-screen flex flex-col bg-[#000]">
        {/* Sidebar/Navbar MUST be outside the flex-1 div to stay fixed correctly */}
        {children}
        <Footer />
      </body>
    </html>
  );
}