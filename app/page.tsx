import Hero from './components/Hero';
import Features from './components/Features';
import Mission from './components/Mission';
import CTA from './components/CTA';
import Sidebar from './components/Sidebar';

export default function Home() {
  return (
    <div className="flex flex-1 w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-72 w-full">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
          <Hero />
          <Features />
          <Mission />
          <CTA />
        </div>
      </main>
    </div>
  );
}