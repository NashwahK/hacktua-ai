"use client";

import React from "react";
import InterestSidebar from "../components/InterestSidebar";
import { motion } from "framer-motion";

export default function InterestCheckPage() {
  const embedUrl = "https://embed.figma.com/proto/AlGmA9PoCRQs4Y0IpKqSNV/step-zero-ui-ux?page-id=0%3A1&node-id=91-1852&p=f&viewport=243%2C93%2C0.07&scaling=scale-down&content-scaling=fixed&starting-point-node-id=7%3A2&embed-host=share";

  return (
    /* flex-col for mobile, flex-row for desktop to get the side-by-side look */
    <div className="relative flex flex-col md:flex-row w-full min-h-screen bg-transparent">
      
      {/* 1. Sidebar Container: Set a fixed width on desktop so it doesn't collapse */}
      <div className="md:w-72 shrink-0">
        <InterestSidebar />
      </div>

      {/* 2. Main Content: 
          - pt-24 on mobile to clear the floating navbar.
          - md:pt-12 on desktop for a clean top margin.
          - md:pr-12 to keep some breathing room on the right.
      */}
      <main className="flex-1 w-full pt-24 md:pt-12 px-6 md:px-12 pb-20">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="font-london text-3xl md:text-6xl text-white tracking-tighter">
            step[0]
          </h1>
          <p className="text-[#7BADE2] font-london text-lg tracking-widest mt-2">
            mental health triage and assessment module
          </p>
        </motion.div>

        {/* The Figma Component Wrapper */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-panel overflow-hidden relative shadow-2xl border border-white/10 rounded-[2.5rem]"
        >
        <div className="glass-panel overflow-hidden relative shadow-2xl border border-white/10 rounded-[2.5rem] bg-[#050505]">
  {/* 1. THE WRAPPER: Limits the height.
      2. THE SCALER: This div is actually 125% bigger than the container, 
         then scaled down to 80% (which creates the 'zoom out' effect).
  */}
  <div className="h-[600px] md:h-[750px] w-full overflow-hidden relative">
    <iframe
      title="hacktua prototype"
      className="absolute top-0 left-0 w-[125%] h-[125%] border-none origin-top-left"
      style={{ 
        transform: 'scale(0.8)', // Adjust this (0.7, 0.6) to zoom out further
        width: '125%',           // Must be 1/scale (e.g., 1 / 0.8 = 1.25)
        height: '125%' 
      }}
      src="https://embed.figma.com/proto/AlGmA9PoCRQs4Y0IpKqSNV/step-zero-ui-ux?page-id=0%3A1&node-id=91-1852&p=f&viewport=243%2C93%2C0.07&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=7%3A2&embed-host=share"
      allowFullScreen
    />
  </div>
      </div>
        </motion.div>
        <div className="mt-8 align-center text-center opacity-30">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white">v1.0.2 // build_stable</span>
        </div>
      </main>

      {/* Background Decorative Glow (Matches your blue-green theme) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7BADE2]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#336666]/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}