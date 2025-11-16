"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatStep = {
  key: string;
  question: string;
  type: "text" | "checkbox";
};

const steps: ChatStep[] = [
  { key: "email", question: "hi! please drop in your email?", type: "text" },
  {
    key: "willing_conversation",
    question:
      "would you be willing to have a conversation with a professionally trained bot to determine if you need therapy?",
    type: "checkbox",
  },
  { key: "bothering_you", question: "what's been bothering you?", type: "text" },
  {
    key: "affecting_daily_life",
    question: "is it affecting your daily life?",
    type: "text",
  },
  {
    key: "better_or_worse",
    question: "what's making it better or worse?",
    type: "text",
  },
  {
    key: "consent",
    question:
      "do you consent to storing this conversation and relaying it to the therapist?",
    type: "checkbox",
  },
];

export default function InterestCheckChatbot() {
  const [responses, setResponses] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showTyping, setShowTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleNext = (value?: any) => {
    if (value !== undefined) handleChange(value);

    // Move to next step only if not last
    if (currentStep < steps.length - 1) {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setCurrentStep(currentStep + 1);
      }, 600);
    }
    // If last step, stay on it and show submit button
  };

  const handleChange = (value: any) => {
    setResponses({ ...responses, [step.key]: value });
  };

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/interest-check", {
        method: "POST",
        body: JSON.stringify(responses),
      });
      const data = await res.json();
      if (data.success) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  useEffect(scrollToBottom, [currentStep, showTyping, status, started]);

  if (!started) {
    return (
      <div className="glass-panel bg-[#EBF5FF] max-w-md mx-auto p-6 flex flex-col gap-4 rounded-xl shadow-lg cursor-pointer text-center">
        <h2 className="text-black text-xl font-semibold">disclaimer!</h2>
        <p className="text-black text-md">
          this is a proof-of-concept simulation of what you’d expect in 'Step Zero'.
        </p>
        <button
          onClick={handleStart}
          className="mt-4 bg-[#7BADE2] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform"
        >
          start chat
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="glass-panel bg-[#EBF5FF] max-w-md mx-auto p-6 flex flex-col gap-4 rounded-xl shadow-lg overflow-y-auto max-h-[80vh] relative"
      style={{ boxShadow: "0 -4px 10px rgba(0,0,0,0.15)" }}
    >
      <h2 className="font-london text-2xl text-white mb-4 text-center">
        interest check chat
      </h2>

      <div className="flex flex-col gap-4">
        {/* Render previous steps */}
        <AnimatePresence initial={false}>
          {steps.slice(0, currentStep).map((s, idx) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-1"
            >
              <div className="self-start bg-[#336699] text-white p-3 rounded-lg max-w-[80%]">
                {s.question}
              </div>
              <div className="self-end bg-[#C5DCF1] text-black p-3 rounded-lg max-w-[80%]">
                {s.type === "checkbox"
                  ? responses[s.key]
                    ? "Yes"
                    : responses[s.key] === false
                    ? "No"
                    : ""
                  : String(responses[s.key])}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing animation */}
        {showTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start flex items-center gap-2 bg-[#336699] p-3 rounded-lg max-w-[40%]"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-200"></span>
            <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-400"></span>
          </motion.div>
        )}

        {/* Current step input */}
        {!showTyping && status === "idle" && (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <div className="self-start bg-[#336699] text-white p-3 rounded-lg max-w-[80%]">
              {step.question}
            </div>

            <div className="flex items-center gap-2 mt-2">
              {step.type === "text" && (
                <motion.input
                  type="text"
                  value={responses[step.key] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement;
                      handleNext(target.value);
                    }
                  }}
                  className="flex-1 p-2 rounded-lg text-black"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {step.type === "checkbox" && (
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      responses[step.key] === true
                        ? "bg-[#7BADE2] text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handleChange(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      responses[step.key] === false
                        ? "bg-[#7BADE2] text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handleChange(false)}
                  >
                    No
                  </button>
                </div>
              )}
            </div>

            {/* Show Next button for non-checkbox last step or Submit button for last step */}
            {currentStep < steps.length - 1 && (
              <motion.button
                onClick={() => handleNext()}
                className="bg-[#7BADE2] p-3 rounded-full flex items-center justify-center hover:scale-110 transition-transform mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            )}

            {currentStep === steps.length - 1 && (
              <motion.button
                onClick={handleSubmit}
                className="bg-[#7BADE2] p-3 rounded-full flex items-center justify-center hover:scale-110 transition-transform mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Snackbar messages */}
        {status === "loading" && (
          <p className="text-white text-center mt-4">Submitting...</p>
        )}
        {status === "success" && (
          <p className="bg-green-500 text-white text-center font-semibold rounded-lg py-2 mt-4">
            Thanks! Your responses were submitted.
          </p>
        )}
        {status === "error" && (
          <p className="bg-red-500 text-white text-center font-semibold rounded-lg py-2 mt-4">
            Oops! Something went wrong.
          </p>
        )}
      </div>
    </div>
  );
}
