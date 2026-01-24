"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Close } from "@mui/icons-material";
import Link from "next/link";

export default function InterestSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pinnedAboveFooter, setPinnedAboveFooter] = useState(false);
  const [absTop, setAbsTop] = useState<number | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);

  // Scroll logic for navbar morphing and desktop pinning
  useEffect(() => {
    const handleScroll = () => {
      // 1. Mobile Navbar Morphing
      setIsScrolled(window.scrollY > 20);

      // 2. Desktop Sidebar Pinning
      const footer = document.querySelector("footer");
      const aside = asideRef.current;
      if (!footer || !aside) return;

      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      const sidebarHeight = aside.getBoundingClientRect().height;
      const viewportBottom = window.scrollY + window.innerHeight;

      if (viewportBottom >= footerTop) {
        setPinnedAboveFooter(true);
        setAbsTop(footerTop - sidebarHeight - 40);
      } else {
        setPinnedAboveFooter(false);
        setAbsTop(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar (Left side) */}
      <aside
        ref={(el) => { asideRef.current = el; }}
        className="hidden md:flex flex-col justify-between pointer-events-auto z-40"
        style={
          pinnedAboveFooter
            ? { position: "absolute", left: 48, top: absTop ?? undefined }
            : { position: "fixed", left: 48, top: "50%", transform: "translateY(-50%)" }
        }
      >
        <div className="space-y-12">
          <Link href="/">
            <img src="/assets/Hacktua White.png" alt="hacktua" className="w-24 hover:opacity-70 transition-opacity" />
          </Link>
          <nav className="flex flex-col gap-8 font-london lowercase tracking-tighter text-xl">
            <span className="text-[#7BADE2] tracking-[0.2em] text-sm">proof of concept</span>
            <Link
              href="/"
              className="text-white/40 hover:text-white transition-colors"
            >
              ← back
            </Link>
          </nav>
        </div>
        <div className="text-white/20 text-[10px] tracking-[0.3em] lowercase">&copy; 2026 hacktua</div>
      </aside>

      {/* Modern Floating Mobile Navbar (Interest Check Version) */}
      <div
        id="mobile-navbar"
        className={`md:hidden fixed left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-6
          ${isScrolled 
            ? "top-4 mx-4 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg" 
            : "top-0 h-20 bg-transparent border-transparent"
          }`}
      >
        <div className="flex justify-between items-center h-full w-full">
          <img src="/assets/Hacktua White.png" alt="hacktua" className="h-4 w-auto" />
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <Close fontSize="medium" /> : <Menu fontSize="medium" />}
          </button>
        </div>
      </div>

      {/* Glossy Dropdown Menu */}
      <div
        className={`md:hidden fixed inset-0 z-[90] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl flex flex-col items-center justify-center gap-12 border-b border-white/10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#7BADE2] font-london text-sm tracking-[0.4em] lowercase">status</span>
            <span className="text-white font-london text-2xl tracking-widest lowercase">proof of concept</span>
          </div>

          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-white font-london text-4xl tracking-tighter hover:opacity-50 transition-opacity lowercase"
          >
            back to home
          </Link>

          <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-20">
             <img src="/assets/Hacktua White.png" alt="hacktua" className="h-4" />
          </div>
        </div>
      </div>

      {/* Background Dimmer */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[80] md:hidden backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}