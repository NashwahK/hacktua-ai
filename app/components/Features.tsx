"use client";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "bridging self-assessment and care",
    description: "connecting evidence-based tools with certified mental healthcare provisions.",
    icon: "/assets/brain-w.png",
    className: "md:col-span-2",
  },
  {
    title: "probabilistic profiling",
    description: "heuristic bayesian networks informed by the DSM-5.",
    icon: "/assets/ai-w.png",
    className: "md:col-span-1",
  },
  {
    title: "gearing up for global certification",
    description: "designed for international medical certification and practice.",
    icon: "/assets/globe-w.png",
    className: "md:col-span-3",
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full py-24 bg-transparent">
      <h2 className="font-london text-4xl text-white text-center mb-16 tracking-tight">
        features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`
              glass-panel group relative p-8 flex flex-col items-start 
              transition-all duration-500 hover:bg-white/10
              ${feature.className}
            `}
          >
            {/* Icon - Restored & Artsy */}
            <div className="w-12 h-12 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-full h-full object-contain brightness-0 invert" // Ensures white icons pop on the light bg
              />
            </div>

            <div className="mt-auto">
              <h3 className="font-london text-2xl text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80 text-base leading-relaxed max-w-md">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}