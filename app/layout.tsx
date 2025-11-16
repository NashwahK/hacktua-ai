import './globals.css';
import Footer from './components/Footer';
import { ReactNode } from 'react';

export const metadata = {
  title: 'hacktua',
  icons: { icon: '/assets/hacktua-white.png' },
};

// Correct place for viewport
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
        <html lang="en">
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
