import './globals.css';
import Footer from './components/Footer';
import { ReactNode } from 'react';

export const metadata = {
  title: 'hacktua',
  icons: { icon: '/assets/hacktua-white.png' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-poppins text-white flex flex-col min-h-screen">
        <div className="flex flex-1 w-full">
          {/* Children could include client components like Sidebar */}
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
