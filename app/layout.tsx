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
  variable: '--font-poppins', // creates CSS variable for Tailwind
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins text-white min-h-screen flex flex-col bg-[#000]">
        <div className="flex-1 w-full flex justify-center">
          <div className="w-full max-w-[1440px]">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
