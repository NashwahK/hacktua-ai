"use client";

import React from "react";
import InterestSidebar from "../components/InterestSidebar";
import AssessmentDemo from "../components/AssessmentDemo";
import { motion } from "framer-motion";

export default function InterestCheckPage() {
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

        {/* The real assessment engine — same backend as the mobile app,
            not a Figma prototype or a scripted simulation. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AssessmentDemo />
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