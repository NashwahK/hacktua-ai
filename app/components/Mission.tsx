"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const missionCards = [
  {
    title: "our current goal",
    description:
      'we are currently developing our first commercial app, "Step Zero", a mental health triage tool for careful guidance and facilitation toward seeking actual professional help.',
  },
  {
    title: "our mission",
    description:
      "we are developing a Large Language Model (LLM) specialised for mental health support. our long-term mission is to empower therapists, patients, and caregivers with intelligent tools that improve outcomes while maintaining privacy, trust, and human-centred care.",
  },
];

export default function Mission() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="mission" className="px-6 md:px-32 py-16 md:py-32 flex flex-col gap-6">
      {missionCards.map((card, idx) => (
        <motion.div
          key={card.title}
          className="glass-panel rounded-3xl shadow-xl overflow-hidden cursor-pointer"
          onClick={() => toggle(idx)}
        >
          {/* Header */}
          <div className="p-6 flex justify-between items-center">
            <h3 className="font-london text-2xl text-white">{card.title}</h3>
            <span className="text-white text-2xl">{openIndex === idx ? "−" : "+"}</span>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6 text-white/90 text-base"
              >
                {card.description}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </section>
  );
}
