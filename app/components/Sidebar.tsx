"use client";

import { useEffect, useState } from "react";
import { Menu, Close } from "@mui/icons-material";
import Link from "next/link";

const sections = ["hero", "features", "mission", "cta"];

export default function Sidebar() {
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for active section and navbar styling
  useEffect(() => {
    const handleScroll = () => {
      // 1. Update Active Section
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop) {
          setActive(section);
        }
      }

      // 2. Modern Navbar Transformation
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sidebar (Left side) */}
      <aside className="hidden md:flex fixed left-12 top-1/2 transform -translate-y-1/2 flex-col justify-between h-[70vh] z-40 pointer-events-auto bg-transparent">
        <div className="space-y-12">
          <img src="/assets/Hacktua White.png" alt="hacktua" className="w-24" />
          <nav className="flex flex-col gap-8 font-london lowercase tracking-tighter text-xl">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`transition-all duration-300 hover:text-[#7BADE2] ${
                  active === section ? "text-[#7BADE2] scale-110 origin-left" : "text-white/40"
                }`}
              >
                {section === "hero" ? "hacktua" : section === "cta" ? "join us" : section}
              </a>
            ))}
            <Link href="/interest-check" className="text-white/40 transition-colors hover:text-[#7BADE2]">
              interest check
            </Link>
          </nav>
        </div>
        <div className="text-white/20 text-[10px] tracking-[0.3em] lowercase">&copy; 2025 hacktua</div>
      </aside>

      {/* Modern Floating Mobile Navbar */}
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
            className="text-white focus:outline-none p-1"
          >
            {menuOpen ? <Close fontSize="medium" /> : <Menu fontSize="medium" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown - Glossy Glass */}
      <div
        className={`md:hidden fixed inset-0 z-[90] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl flex flex-col items-center justify-center gap-10 border-b border-white/10">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={() => setMenuOpen(false)}
              className={`text-3xl font-london lowercase tracking-tighter transition-colors ${
                active === section ? "text-[#7BADE2]" : "text-white"
              }`}
            >
              {section === "hero" ? "hacktua" : section === "cta" ? "join us" : section}
            </a>
          ))}
          <Link
            href="/interest-check"
            onClick={() => setMenuOpen(false)}
            className="text-3xl font-london lowercase tracking-tighter text-white/60 pt-4 border-t border-white/10 w-40 text-center"
          >
            interest check
          </Link>
        </div>
      </div>
    </>
  );
}