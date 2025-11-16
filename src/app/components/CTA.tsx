"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CTA() {
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  useEffect(() => setLoaded(true), []);

  const handleSubmit = async () => {
    if (!email) {
      showSnackbar("brevity is the soul of wit but we need your entry to have your email in it :/", "error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
        showSnackbar("you're in!", "success");
      } else {
        setStatus("error");
        showSnackbar(data.message || "something's off...", "error");
      }
    } catch {
      setStatus("error");
      showSnackbar("network error. try again?", "error");
    }
  };

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showSnackbar = (msg: string, type: "success" | "error") => {
    setSnackbar({ msg, type });
    setTimeout(() => setSnackbar(null), 4000); // auto hide after 4s
  };

  return (
    <section
      id="cta"
      className="px-6 sm:px-20 py-16 md:py-32 flex flex-col items-center gap-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass-panel p-12 flex flex-col items-center text-center max-w-3xl w-full"
      >
        <h2 className="font-london text-4xl md:text-5xl text-white mb-6">
          join the waitlist
        </h2>
        <p className="text-white/90 mb-8 text-base md:text-lg leading-relaxed">
          be among the first to experience hacktua’s AI-powered mental health
          platform. sign up now to get early access and updates.
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada.lovelace@gmail.com"
            className="flex-1 px-6 py-4 rounded-full bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className={`
              relative px-8 py-4 rounded-full bg-white text-[#1063B1] font-semibold
              overflow-hidden transition-transform
              ${status === "loading" ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            `}
          >
            {/* Gradient border effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#336666] via-[#7BADE2] to-[#336699] opacity-0 hover:opacity-100 transition-opacity blur-lg"></span>

            {/* Inner content */}
            <span className="relative z-10">
              {status === "loading" ? "Sending..." : "count me in!"}
            </span>
          </button>
        </div>

        <p className="text-white/60 text-xs mt-4 text-center">
          we do not spam. like, ever. 
        </p>
      </motion.div>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-semibold shadow-lg z-50
              ${snackbar.type === "success" ? "bg-green-500" : "bg-red-500"}
            `}
          >
            {snackbar.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
