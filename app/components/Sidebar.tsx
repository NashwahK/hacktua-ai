"use client";

import { useEffect, useState } from "react";
import { Menu, Close } from "@mui/icons-material";
import Link from "next/link";

const sections = ["hero", "features", "mission", "cta"];

export default function Sidebar() {
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  // Track scroll position for active section (desktop)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop) {
          setActive(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Change navbar style on scroll (mobile)
  useEffect(() => {
    const navbar = document.getElementById("mobile-navbar");
    const handleScroll = () => {
      if (!navbar) return;
      const scrollY = window.scrollY;
      if (scrollY > 10) {
        navbar.style.backgroundColor = "rgba(255,255,255,0.1)";
        navbar.style.backdropFilter = "blur(8px)";
      } else {
        navbar.style.backgroundColor = "rgba(255,255,255,0)";
        navbar.style.backdropFilter = "blur(0px)";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-8 top-1/2 transform -translate-y-1/2 flex-col justify-between z-20 pointer-events-auto bg-transparent">
        <div className="space-y-8">
          <img src="/assets/Hacktua White.png" alt="Hacktua" className="w-32" />
          <nav className="flex flex-col gap-6 text-white font-semibold text-lg">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`transition-colors hover:text-[#7BADE2] ${
                  active === section
                    ? "font-bold text-[#7BADE2]"
                    : "font-normal text-white/80"
                }`}
              >
                {section === "hero"
                  ? "hacktua"
                  : section === "cta"
                  ? "join us"
                  : section.charAt(0) + section.slice(1)}
              </a>
            ))}
            {/* PoC / Interest Check link */}
            <Link
              href="/interest-check"
              className="transition-colors hover:text-[#7BADE2] font-normal text-white/80"
            >
              interest check
            </Link>
          </nav>
        </div>
        <div className="text-white/50 text-sm mt-6">&copy; 2025 hacktua</div>
      </aside>

      {/* Mobile Top Bar */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-30 transition-colors duration-300`}
        style={{
          backgroundColor: `rgba(255,255,255,0)`,
          backdropFilter: "blur(0px)",
        }}
        id="mobile-navbar"
      >
        <div className="flex justify-between items-center w-full px-6 py-4">
          <img src="/assets/Hacktua White.png" alt="Hacktua" className="w-20 max-w-full" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 text-2xl focus:outline-none"
          >
            {menuOpen ? <Close fontSize="large" /> : <Menu fontSize="large" />}
          </button>
        </div>
      </div>

      {/* Dimmed overlay when menu open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 overflow-hidden transition-max-h duration-300 z-30 ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-white backdrop-blur-xl flex flex-col items-start py-12 px-6 gap-6 rounded-b-3xl">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={() => setMenuOpen(false)}
              className={`text-lg font-semibold transition-colors ${
                active === section
                  ? "text-[#7BADE2]"
                  : "text-black/80 hover:text-[#7BADE2]"
              }`}
            >
              {section === "hero"
                ? "hacktua"
                : section === "cta"
                ? "join us"
                : section.charAt(0) + section.slice(1)}
            </a>
          ))}
          {/* Mobile PoC / Interest Check link */}
          <Link
            href="/interest-check"
            onClick={() => setMenuOpen(false)}
            className="text-lg font-semibold text-black/80 hover:text-[#7BADE2]"
          >
            interest check
          </Link>
        </div>
      </div>
    </>
  );
}
