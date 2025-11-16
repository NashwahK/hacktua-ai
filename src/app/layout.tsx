import './globals.css';
import Footer from './components/Footer';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';

export const metadata = {
  title: 'hacktua',
  icons: { icon: '/assets/hacktua-white.png' },
};

// Load Poppins correctly for all browsers (Safari included)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins text-white flex flex-col min-h-screen">
        <div className="flex flex-1 w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
