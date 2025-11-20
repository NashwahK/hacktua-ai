"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatStep = {
  key: string;
  question: string;
  type: "text" | "checkbox";
  keywords?: string[];
};

// Keyword-specific question paths (5-6 questions each)
const keywordPaths: Record<string, ChatStep[]> = {
  anxiety: [
    { key: "anxiety_frequency", question: "how often do you feel anxious?", type: "text" },
    { key: "anxiety_physical", question: "do you experience physical symptoms like rapid heartbeat, sweating, or trembling?", type: "checkbox" },
    { key: "anxiety_triggers", question: "what situations or thoughts trigger your anxiety?", type: "text" },
    { key: "anxiety_duration", question: "how long do these anxious episodes typically last?", type: "text" },
    { key: "anxiety_avoidance", question: "are you avoiding certain places or situations because of anxiety?", type: "checkbox" },
    { key: "anxiety_impact", question: "how is this affecting your daily activities or relationships?", type: "text" },
  ],
  stress: [
    { key: "stress_source", question: "what are the main sources of your stress?", type: "text" },
    { key: "stress_duration", question: "how long have you been experiencing this level of stress?", type: "text" },
    { key: "stress_physical", question: "are you experiencing physical symptoms like headaches or muscle tension?", type: "checkbox" },
    { key: "stress_overwhelm", question: "do you feel overwhelmed by daily tasks?", type: "checkbox" },
    { key: "stress_coping", question: "what methods have you tried to manage your stress?", type: "text" },
    { key: "stress_sleep", question: "is stress affecting your sleep or appetite?", type: "checkbox" },
  ],
  depression: [
    { key: "depression_duration", question: "how long have you been feeling this way?", type: "text" },
    { key: "depression_activities", question: "have you lost interest in activities you used to enjoy?", type: "checkbox" },
    { key: "depression_energy", question: "how would you describe your energy levels throughout the day?", type: "text" },
    { key: "depression_feelings", question: "do you experience feelings of emptiness or numbness?", type: "checkbox" },
    { key: "depression_future", question: "how do you feel when you think about the future?", type: "text" },
    { key: "depression_social", question: "have you been withdrawing from friends or family?", type: "checkbox" },
  ],
  mood: [
    { key: "mood_frequency", question: "how often do your moods shift?", type: "text" },
    { key: "mood_intensity", question: "how intense are these mood changes?", type: "text" },
    { key: "mood_triggers", question: "can you identify what triggers these mood swings?", type: "text" },
    { key: "mood_predictable", question: "do your mood changes follow any pattern or are they unpredictable?", type: "checkbox" },
    { key: "mood_relationships", question: "are these mood swings affecting your relationships?", type: "checkbox" },
    { key: "mood_control", question: "do you feel like you have control over these mood changes?", type: "text" },
  ],
  insomnia: [
    { key: "insomnia_type", question: "do you have trouble falling asleep, staying asleep, or both?", type: "text" },
    { key: "insomnia_hours", question: "how many hours of sleep are you getting per night?", type: "text" },
    { key: "insomnia_duration", question: "how long have you been experiencing sleep difficulties?", type: "text" },
    { key: "insomnia_racing", question: "do racing thoughts keep you awake?", type: "checkbox" },
    { key: "insomnia_daytime", question: "how is poor sleep affecting your daytime functioning?", type: "text" },
    { key: "insomnia_routine", question: "what does your bedtime routine look like?", type: "text" },
  ],
  energy: [
    { key: "energy_duration", question: "how long have you been feeling low on energy?", type: "text" },
    { key: "energy_morning", question: "do you wake up feeling tired even after a full night's sleep?", type: "checkbox" },
    { key: "energy_tasks", question: "what daily tasks feel exhausting to you?", type: "text" },
    { key: "energy_physical", question: "is this affecting your ability to exercise or do physical activities?", type: "checkbox" },
    { key: "energy_mental", question: "do you also feel mentally drained or foggy?", type: "checkbox" },
    { key: "energy_changes", question: "have there been any changes in your diet, sleep, or health?", type: "text" },
  ],
  irritable: [
    { key: "irritable_frequency", question: "how often do you feel irritable or easily annoyed?", type: "text" },
    { key: "irritable_triggers", question: "what situations or people tend to trigger your irritability?", type: "text" },
    { key: "irritable_intensity", question: "on a scale of mild annoyance to intense rage, where do your reactions fall?", type: "text" },
    { key: "irritable_control", question: "do you find it hard to control your reactions when irritated?", type: "checkbox" },
    { key: "irritable_regret", question: "do you regret how you've acted when feeling irritable?", type: "checkbox" },
    { key: "irritable_baseline", question: "is this a change from how you normally are, or have you always been easily irritated?", type: "text" },
  ],
  concentration: [
    { key: "concentration_when", question: "when did you first notice difficulties with concentration?", type: "text" },
    { key: "concentration_tasks", question: "which tasks or activities are hardest to focus on?", type: "text" },
    { key: "concentration_distraction", question: "do you get easily distracted by external things or internal thoughts?", type: "text" },
    { key: "concentration_complete", question: "are you able to complete tasks or do they remain unfinished?", type: "checkbox" },
    { key: "concentration_work", question: "is this affecting your work, school, or daily responsibilities?", type: "checkbox" },
    { key: "concentration_memory", question: "are you also experiencing memory issues?", type: "checkbox" },
  ],
  anger: [
    { key: "anger_frequency", question: "how often do you feel angry?", type: "text" },
    { key: "anger_intensity", question: "how intense does your anger get?", type: "text" },
    { key: "anger_triggers", question: "what typically triggers your anger?", type: "text" },
    { key: "anger_expression", question: "how do you usually express your anger?", type: "text" },
    { key: "anger_aftermath", question: "do you feel regret or guilt after angry outbursts?", type: "checkbox" },
    { key: "anger_impact", question: "has your anger damaged relationships or caused other problems?", type: "checkbox" },
  ],
  memory: [
    { key: "memory_type", question: "what types of things are you forgetting?", type: "text" },
    { key: "memory_frequency", question: "how often does this happen?", type: "text" },
    { key: "memory_recent", question: "are you forgetting recent events or long-term memories?", type: "text" },
    { key: "memory_others", question: "have others noticed or mentioned your forgetfulness?", type: "checkbox" },
    { key: "memory_words", question: "do you have trouble finding words or completing thoughts?", type: "checkbox" },
    { key: "memory_concern", question: "how concerned are you about these memory issues?", type: "text" },
  ],
  panic: [
    { key: "panic_frequency", question: "how often do you experience panic attacks?", type: "text" },
    { key: "panic_symptoms", question: "what symptoms do you experience during these episodes?", type: "text" },
    { key: "panic_duration", question: "how long do these panic attacks typically last?", type: "text" },
    { key: "panic_triggers", question: "can you identify triggers for your panic attacks?", type: "text" },
    { key: "panic_avoidance", question: "are you avoiding places or situations due to fear of panic?", type: "checkbox" },
    { key: "panic_fear", question: "do you worry about having another panic attack?", type: "checkbox" },
  ],
  hopeless: [
    { key: "hopeless_duration", question: "how long have you been feeling hopeless?", type: "text" },
    { key: "hopeless_about", question: "what aspects of life feel most hopeless to you?", type: "text" },
    { key: "hopeless_future", question: "how do you envision your future?", type: "text" },
    { key: "hopeless_moments", question: "are there moments when you feel any hope or relief?", type: "checkbox" },
    { key: "hopeless_tried", question: "have you tried anything that temporarily helped with these feelings?", type: "text" },
    { key: "hopeless_support", question: "do you have people in your life you can talk to about this?", type: "checkbox" },
  ],
  guilt: [
    { key: "guilt_about", question: "what are you feeling guilty about?", type: "text" },
    { key: "guilt_duration", question: "how long have you been carrying this guilt?", type: "text" },
    { key: "guilt_intensity", question: "how strongly does this guilt affect you daily?", type: "text" },
    { key: "guilt_rational", question: "do others agree that you should feel guilty about this?", type: "checkbox" },
    { key: "guilt_activities", question: "is this guilt preventing you from doing things or enjoying life?", type: "checkbox" },
    { key: "guilt_self", question: "how do you talk to yourself about this guilt?", type: "text" },
  ],
  appetite: [
    { key: "appetite_change", question: "have you been eating more or less than usual?", type: "text" },
    { key: "appetite_when", question: "when did you notice this change in appetite?", type: "text" },
    { key: "appetite_weight", question: "have you noticed changes in your weight?", type: "checkbox" },
    { key: "appetite_enjoyment", question: "do you still enjoy food or has eating become a chore?", type: "text" },
    { key: "appetite_intentional", question: "is this change intentional or are you not in control of it?", type: "text" },
    { key: "appetite_emotional", question: "do you notice connections between your emotions and eating patterns?", type: "checkbox" },
  ],
  suicidal: [
    { key: "suicidal_thoughts", question: "are you currently having thoughts of ending your life?", type: "checkbox" },
    { key: "suicidal_frequency", question: "how often do these thoughts occur?", type: "text" },
    { key: "suicidal_plan", question: "have you thought about or made any specific plans?", type: "checkbox" },
    { key: "suicidal_means", question: "do you have access to means to harm yourself?", type: "checkbox" },
    { key: "suicidal_told", question: "have you told anyone about these thoughts?", type: "checkbox" },
    { key: "suicidal_support", question: "this is very serious. would you like immediate crisis support resources? you are not alone.", type: "checkbox" },
  ],
  harm: [
    { key: "harm_frequency", question: "how often do you think about self-harm?", type: "text" },
    { key: "harm_actions", question: "have you acted on these thoughts?", type: "checkbox" },
    { key: "harm_when", question: "when did you first start thinking about self-harm?", type: "text" },
    { key: "harm_why", question: "what do you feel right before you think about harming yourself?", type: "text" },
    { key: "harm_after", question: "if you have self-harmed, how do you feel afterward?", type: "text" },
    { key: "harm_help", question: "would you like information about crisis support and healthier coping strategies?", type: "checkbox" },
  ],
};

// Initial questions (Q1, Q2, Q3 stay the same)
const initialSteps: ChatStep[] = [
  { key: "email", question: "hi! please drop in your email?", type: "text" },
  {
    key: "willing_conversation",
    question: "would you be willing to have a conversation with a professionally trained bot to determine if you need therapy?",
    type: "checkbox",
  },
  { key: "bothering_you", question: "what's been bothering you?", type: "text", keywords: ["anxiety", "stress", "depression", "mood", "insomnia", "energy", "irritable", "concentration", "anger", "memory", "panic", "hopeless", "guilt", "appetite", "suicidal", "harm"] },
];

// Final question after keyword-specific branch
const finalStep: ChatStep[] = [
  {
    key: "consent",
    question: "do you consent to storing this conversation and relaying it to the therapist?",
    type: "checkbox",
  },
];

export default function InterestCheckChatbot() {
  const [responses, setResponses] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showTyping, setShowTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionPath, setQuestionPath] = useState<ChatStep[]>(initialSteps);
  const [detectedKeyword, setDetectedKeyword] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const step = questionPath[currentStep];

  const detectKeywords = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const detected: string[] = [];
    
    // Check for each keyword pattern (root word consideration)
    // Priority order: most severe first
    if (lowerText.match(/\b(suicid|suicide|suicidal|kill myself)\b/)) detected.push("suicidal");
    if (lowerText.match(/\b(self harm|self-harm|harm myself|cut|cutting)\b/)) detected.push("harm");
    if (lowerText.match(/\b(depress|depressed|depression|depressing)\b/)) detected.push("depression");
    if (lowerText.match(/\b(panic|panick|panicking)\b/)) detected.push("panic");
    if (lowerText.match(/\b(hopeless|helpless|despair)\b/)) detected.push("hopeless");
    if (lowerText.match(/\b(anxious|anxiety|anxieties)\b/)) detected.push("anxiety");
    if (lowerText.match(/\b(stress|stressed|stressful)\b/)) detected.push("stress");
    if (lowerText.match(/\b(mood swing|mood|moody|moods)\b/)) detected.push("mood");
    if (lowerText.match(/\b(insomnia|sleep|sleeping|sleepless)\b/)) detected.push("insomnia");
    if (lowerText.match(/\b(energy|letharg|lethargy|tired|fatigue|exhaust)\b/)) detected.push("energy");
    if (lowerText.match(/\b(irritab|irritable|irritated|irritating)\b/)) detected.push("irritable");
    if (lowerText.match(/\b(concentrat|concentrate|concentration|focus|focusing)\b/)) detected.push("concentration");
    if (lowerText.match(/\b(anger|angry|rage|furious)\b/)) detected.push("anger");
    if (lowerText.match(/\b(memory|forget|forgetful|forgetting)\b/)) detected.push("memory");
    if (lowerText.match(/\b(guilt|guilty|ashamed|shame)\b/)) detected.push("guilt");
    if (lowerText.match(/\b(appetite|eating|hunger|hungry)\b/)) detected.push("appetite");
    
    return detected;
  };

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

    // Check for keywords in "bothering_you" response (Q3)
    if (step.key === "bothering_you" && detectedKeyword.length === 0) {
      const keywords = detectKeywords(value || responses[step.key] || "");
      if (keywords.length > 0) {
        setDetectedKeyword(keywords);
        // Build path: Q1, Q2, Q3, then all detected keyword questions, then final consent
        const allKeywordQuestions: ChatStep[] = [];
        keywords.forEach((keyword: string) => {
          if (keywordPaths[keyword]) {
            allKeywordQuestions.push(...keywordPaths[keyword]);
          }
        });
        const newPath = [
          ...initialSteps,
          ...allKeywordQuestions,
          ...finalStep,
        ];
        setQuestionPath(newPath);
      } else {
        // No keyword detected, just go to final consent question
        setQuestionPath([...initialSteps, ...finalStep]);
      }
    }

    // Move to next step
    if (currentStep < questionPath.length - 1) {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setCurrentStep(currentStep + 1);
      }, 600);
    }
  };

  const handleChange = (value: any) => {
    setResponses({ ...responses, [step.key]: value });
  };

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/interest-check", {
        method: "POST",
        body: JSON.stringify({ ...responses, detectedKeyword }),
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
        <h2 className="text-white text-xl font-semibold">disclaimer!</h2>
        <p className="text-white text-md">
          this is a proof-of-concept simulation of what you'd expect in 'Step Zero'.
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
          {questionPath.slice(0, currentStep).map((s, idx) => (
            <motion.div
              key={`${s.key}-${idx}`}
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
        {!showTyping && status === "idle" && step && (
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
                    onClick={() => {
                      handleChange(true);
                      handleNext(true);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      responses[step.key] === false
                        ? "bg-[#7BADE2] text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => {
                      handleChange(false);
                      handleNext(false);
                    }}
                  >
                    No
                  </button>
                </div>
              )}
            </div>

            {/* Show Next button for text inputs only */}
            {step.type === "text" && currentStep < questionPath.length - 1 && (
              <motion.button
                onClick={() => handleNext()}
                className="bg-[#7BADE2] text-white p-3 rounded-full flex items-center justify-center hover:scale-110 transition-transform mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            )}

            {/* Submit button on last step */}
            {currentStep === questionPath.length - 1 && (
              <motion.button
                onClick={handleSubmit}
                className="bg-[#7BADE2] text-white p-3 rounded-full flex items-center justify-center hover:scale-110 transition-transform mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Status messages */}
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