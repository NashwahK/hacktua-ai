import Hero from './components/Hero';
import Features from './components/Features';
import Mission from './components/Mission';
import CTA from './components/CTA';
import Sidebar from './components/Sidebar';

export default function Home() {
  return (
    <div className="relative flex flex-col md:flex-row w-full min-h-screen overflow-x-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col w-full md:pl-0 
                       pt-[env(safe-area-inset-top)] 
                       pb-[env(safe-area-inset-bottom)]">
        
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-20 md:gap-32">
          <Hero />
          <Features />
          <Mission />
          <CTA />
        </div>
      </main>

      <div className="absolute inset-0 -z-10 bg-[url('/assets/web-bg.png')] bg-cover bg-center" />
    </div>
  );
}