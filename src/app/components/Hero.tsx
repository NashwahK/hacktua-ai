"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 py-32"
    >
      <div className="absolute inset-0"></div>

      <div className="relative max-w-4xl z-10 flex flex-col items-start gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="font-london text-5xl md:text-6xl mb-4 text-white leading-tight"
        >
          psych tech for all
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white/90 text-lg md:text-xl leading-relaxed"
        >
          a healthcare AI startup determined to redefining how mental health is understood, measured, and supported globally.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex gap-4 mt-4"
        >
          {/* Join Waitlist */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 rounded-xl bg-[#7BADE2] text-white font-semibold"
            onClick={() => {
              const el = document.getElementById("cta");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            join waitlist
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 rounded-xl bg-white text-[#336699] font-semibold border-2 border-[#7BADE2] hover:border-gradient-to-r hover:from-[#336666] hover:via-[#7BADE2] hover:to-[#336699] transition-all"
            onClick={() => {
              // Navigate to chatbot page
              window.location.href = "/interest-check"; 
            }}
          >
            interest check
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
