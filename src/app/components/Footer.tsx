"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [snackbar, setSnackbar] = useState<{ msg: string; type: "info" } | null>(null);

  const showSnackbar = (msg: string) => {
    setSnackbar({ msg, type: "info" });
    setTimeout(() => setSnackbar(null), 4000);
  };

  return (
    <>
      <footer className="w-full flex flex-col md:flex-row justify-between items-center gap-6 py-12 px-6 md:px-0 glass-panel border-t border-white/20">
      <div className="text-2xl font-london text-white">hacktua</div>

      <div className="flex gap-8 text-sm text-white/60">
        {["privacy", "terms", "contact"].map((link) => (
          <button
            key={link}
            onClick={() => showSnackbar("road work ahead? let's hope it does...")}
            className="hover:text-white transition-colors"
          >
            {link}
          </button>
        ))}
      </div>

      <div className="text-white/40 text-sm text-center md:text-right">
        © 2025 hacktua. built with caffeine and code.
      </div>
    </footer>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow-lg z-50"
          >
            {snackbar.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
