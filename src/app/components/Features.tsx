"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "bridging self-assessment and care",
    description:
      "connecting evidence-based self-assessment tools with certified mental healthcare provisions.",
    icon: "/assets/brain-w.png",
  },
  {
    title: "LLM-powered user profiling",
    description:
      "developing an LLM informed by DSM-5 criteria and personality models for accurate user profiling.",
    icon: "/assets/ai-w.png",
  },
  {
    title: "gearing up for global certification",
    description:
      "designed to meet standards for international medical certification and practice.",
    icon: "/assets/globe-w.png",
  },
];

export default function Features() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section
    id="features"
    className="w-full flex flex-col gap-16 py-16 md:py-32 px-6 md:px-0 items-center"
  >
    <h2 className="font-london text-4xl md:text-5xl text-white text-center mb-12">
      features
    </h2>

    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl items-center md:justify-center">
      {features.map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 * idx, duration: 0.6 }}
          className="glass-panel flex flex-col items-center text-center p-6 gap-4 w-full md:w-[30%]"
        >
          <div className="w-20 h-20 mb-4">
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-full h-full object-contain"
            />
          </div>

          <h3 className="font-london text-2xl text-white">{feature.title}</h3>
          <p className="text-white/90 text-base">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </section>

  );
}
