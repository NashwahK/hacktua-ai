"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createSession, submitResponse,
  type Report, type ConditionScore,
} from "../../src/lib/assessmentApi";
import {
  QUESTION_TEXTS, OPEN_TEXT_QUESTIONS, BINARY_QUESTIONS, SI_QUESTIONS,
  DURATION_QUESTIONS, DURATION_LABELS, DEFAULT_DURATION_LABELS,
  ROUTING_QUESTIONS, ROUTING_OPTIONS, CONDITION_AXIS_LABELS, AXIS_ORDER,
} from "../../src/lib/assessmentQuestions";

type Phase = "seed" | "question" | "si_followup" | "safety" | "results" | "error";

interface ChatEntry {
  question: string;
  answerLabel: string;
}

// Bot bubbles: a pale teal-tinted surface (not stark white, not gray) --
// ties to the brand teal family instead of a generic chat-UI default.
// Dark text color reused verbatim from the mobile app's theme.js
// (tealDeep) so the two products share the exact same ink.
const BOT_BUBBLE = "self-start bg-[#EAF4F1] text-[#134B45] p-3 rounded-lg max-w-[85%] text-sm";
const USER_BUBBLE = "self-end bg-brand-5 text-white p-3 rounded-lg max-w-[85%] text-sm";
const SECONDARY_BTN = "px-5 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors";

// ── Bloom chart — ported from the mobile app's BloomChart.js SVG logic ────────
// Same axis math and the same label-clipping fix (side labels anchor inward
// instead of centering past the canvas edge).
function BloomChart({ conditions, size = 240 }: { conditions: ConditionScore[]; size?: number }) {
  const center = size / 2;
  const maxRadius = size * 0.34;
  const labelRadius = size * 0.41;
  const angleStep = (2 * Math.PI) / AXIS_ORDER.length;

  const scoreFor = (axis: string) =>
    conditions.find(c => c.condition_id === axis)?.confidence_score ?? 0;

  const pointAt = (index: number, radius: number) => {
    const angle = angleStep * index - Math.PI / 2;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  };

  const anchorFor = (index: number) => {
    const cos = Math.cos(angleStep * index - Math.PI / 2);
    if (cos > 0.3) return "end";
    if (cos < -0.3) return "start";
    return "middle";
  };

  const shapePoints = AXIS_ORDER.map((axis, i) => pointAt(i, maxRadius * Math.max(0.12, scoreFor(axis))))
    .map(p => `${p.x},${p.y}`)
    .join(" ");

  const ringRadii = [0.33, 0.66, 1].map(f => maxRadius * f);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {ringRadii.map(r => (
        <circle key={r} cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      ))}
      {AXIS_ORDER.map((_, i) => {
        const p = pointAt(i, maxRadius);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />;
      })}
      <polygon points={shapePoints} fill="rgba(123,173,226,0.35)" stroke="#7BADE2" strokeWidth={2} />
      {AXIS_ORDER.map((axis, i) => {
        const p = pointAt(i, labelRadius);
        return (
          <text
            key={axis}
            x={p.x}
            y={p.y}
            fill="rgba(255,255,255,0.75)"
            fontSize={11}
            fontWeight={500}
            textAnchor={anchorFor(i) as "start" | "middle" | "end"}
            dominantBaseline="middle"
          >
            {CONDITION_AXIS_LABELS[axis]}
          </text>
        );
      })}
    </svg>
  );
}

export default function AssessmentDemo() {
  const [phase, setPhase] = useState<Phase>("seed");
  const [seedText, setSeedText] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [openText, setOpenText] = useState("");
  const [likertVal, setLikertVal] = useState(1);
  const [siSeverity, setSiSeverity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [history, phase, submitting]);

  const isBinary = questionId ? BINARY_QUESTIONS.has(questionId) : false;
  const isSI = questionId ? SI_QUESTIONS.has(questionId) : false;
  const isOpen = questionId ? OPEN_TEXT_QUESTIONS.has(questionId) : false;
  const isDuration = questionId ? DURATION_QUESTIONS.has(questionId) : false;
  const isRouting = questionId ? ROUTING_QUESTIONS.has(questionId) : false;
  const qText = questionId ? QUESTION_TEXTS[questionId] ?? questionId : "";

  // ── Advance to whatever the backend says is next ──────────────────────────
  // `submitting` stays true continuously from the moment a question is
  // answered until the next thing is actually ready to show -- that's
  // what keeps the old question from sitting there frozen during the
  // network wait. Each branch below is responsible for flipping it back
  // off itself, right as it reveals whatever comes next.
  function applyResult(result: {
    next_question_id: string | null;
    session_complete: boolean;
    report: Report;
  }) {
    setReport(result.report);
    if (result.next_question_id === "SAFETY_PROTOCOL") {
      setPhase("safety");
      setSubmitting(false);
      return;
    }
    if (result.session_complete || !result.next_question_id) {
      setPhase("results");
      setSubmitting(false);
      return;
    }
    // Hold the typing indicator a little past when the real response
    // actually arrived -- reveals the next question like a reply being
    // composed, instead of an instant swap.
    setTimeout(() => {
      setQuestionId(result.next_question_id);
      setOpenText("");
      setLikertVal(1);
      setPhase("question");
      setSubmitting(false);
    }, 450);
  }

  async function handleSeedSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await createSession(seedText);
      setSessionId(res.session_id);
      setTimeout(() => {
        setQuestionId(res.first_question_id);
        setPhase("question");
        setSubmitting(false);
      }, 450);
    } catch (e) {
      console.error("createSession failed:", e);
      setErrorMsg("Couldn't start the assessment. Please try again in a moment.");
      setPhase("error");
      setSubmitting(false);
    }
  }

  async function submit(rawValue: string, responseType: string, answerLabel: string) {
    if (!sessionId || !questionId || submitting) return;
    setSubmitting(true);
    setHistory(h => [...h, { question: qText, answerLabel }]);
    try {
      const result = await submitResponse({ sessionId, questionId, rawValue, responseType });
      applyResult(result); // manages its own setSubmitting(false) timing
    } catch (e) {
      console.error("submitResponse failed:", e);
      // An ideation "yes" failing to submit should fail safe to the
      // safety screen, not silently continue -- same rule the mobile
      // app's SI follow-up uses.
      if (isSI) setPhase("safety");
      else {
        setErrorMsg("Something went wrong submitting that. Please try again.");
        setPhase("error");
      }
      setSubmitting(false);
    }
  }

  function resetAll() {
    setPhase("seed");
    setSeedText("");
    setSessionId(null);
    setQuestionId(null);
    setHistory([]);
    setSubmitting(false);
    setOpenText("");
    setLikertVal(1);
    setSiSeverity(1);
    setErrorMsg("");
    setReport(null);
  }

  async function submitSiFollowup() {
    if (!sessionId || !questionId) return;
    // Best-effort severity log, separate from the main answer -- doesn't
    // block the flow if the backend doesn't recognise the extra field.
    submitResponse({
      sessionId, questionId: `${questionId}_severity`,
      rawValue: String(siSeverity), responseType: "likert_0_3",
    }).catch(() => {});
    await submit("yes", "binary", "yes");
  }

  return (
    <div className="glass-panel bg-[#0E2430]/70 max-w-xl mx-auto p-6 flex flex-col gap-4 rounded-glass shadow-glass shadow-[0_0_70px_-20px_rgba(62,207,190,0.4)] relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ECFBE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ECFBE]" />
          </span>
          <h2 className="font-london text-2xl text-white">step[0] — try it</h2>
        </div>
        {phase !== "seed" && (
          <button onClick={resetAll} className="text-xs text-white/50 hover:text-white underline">
            start over
          </button>
        )}
      </div>
      <p className="text-white/50 text-xs text-center -mt-2 mb-2">
        this is the real assessment engine, not a simulation. responses aren&apos;t saved to your profile.
      </p>

      <div ref={containerRef} className="flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
        <AnimatePresence initial={false}>
          {history.map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1"
            >
              <div className={BOT_BUBBLE}>{h.question}</div>
              <div className={USER_BUBBLE}>{h.answerLabel}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {submitting && (phase === "seed" || phase === "question" || phase === "si_followup") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="self-start flex items-center gap-2 bg-[#EAF4F1] p-3 rounded-lg max-w-[40%]"
          >
            <span className="w-2 h-2 rounded-full bg-[#134B45] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#134B45] animate-bounce delay-200" />
            <span className="w-2 h-2 rounded-full bg-[#134B45] animate-bounce delay-400" />
          </motion.div>
        )}

        {/* ── Seed ── */}
        {phase === "seed" && !submitting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
            <div className={BOT_BUBBLE}>what&apos;s been bothering you?</div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={seedText}
                onChange={e => setSeedText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSeedSubmit(); }}
                placeholder="share what comes to mind..."
                className="flex-1 p-3 rounded-lg text-black text-sm border border-black/10"
                autoFocus
              />
              <button
                onClick={handleSeedSubmit}
                disabled={submitting}
                className="bg-brand-5 text-white px-5 py-3 rounded-full text-sm font-medium disabled:opacity-40 hover:scale-105 transition-transform"
              >
                {submitting ? "···" : "start"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Question ── */}
        {phase === "question" && !submitting && questionId && (
          <motion.div key={questionId} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3">
            <div className={BOT_BUBBLE}>{qText}</div>

            {isBinary && !isSI && (
              <div className="flex gap-2">
                <button onClick={() => submit("yes", "binary", "yes")} disabled={submitting} className="px-5 py-2 rounded-lg bg-brand-5 text-white font-medium hover:scale-105 transition-transform">yes</button>
                <button onClick={() => submit("no", "binary", "no")} disabled={submitting} className={SECONDARY_BTN}>no</button>
              </div>
            )}

            {isBinary && isSI && (
              <div className="flex gap-2">
                <button onClick={() => setPhase("si_followup")} disabled={submitting} className="px-5 py-2 rounded-lg bg-brand-5 text-white font-medium hover:scale-105 transition-transform">yes</button>
                <button onClick={() => submit("no", "binary", "no")} disabled={submitting} className={SECONDARY_BTN}>no</button>
              </div>
            )}

            {isDuration && (() => {
              const d = DURATION_LABELS[questionId] ?? DEFAULT_DURATION_LABELS;
              return (
                <div className="flex gap-2">
                  <button onClick={() => submit(d.yesValue, "duration_probe", d.yesLabel)} disabled={submitting} className="px-5 py-2 rounded-lg bg-brand-5 text-white font-medium hover:scale-105 transition-transform">{d.yesLabel}</button>
                  <button onClick={() => submit(d.noValue, "duration_probe", d.noLabel)} disabled={submitting} className={SECONDARY_BTN}>{d.noLabel}</button>
                </div>
              );
            })()}

            {isRouting && (
              <div className="flex flex-col gap-2">
                {ROUTING_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => submit(opt.value, "routing", opt.label)} disabled={submitting} className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-left hover:bg-white/20 transition-colors">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {isOpen && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={openText}
                  onChange={e => setOpenText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && openText.trim()) submit(openText, "open_text", openText); }}
                  placeholder="share what comes to mind..."
                  className="flex-1 p-3 rounded-lg text-black text-sm border border-black/10"
                  autoFocus
                />
                <button
                  onClick={() => submit(openText, "open_text", openText)}
                  disabled={!openText.trim() || submitting}
                  className="bg-brand-5 text-white px-5 py-3 rounded-full text-sm font-medium disabled:opacity-40 hover:scale-105 transition-transform"
                >
                  →
                </button>
              </div>
            )}

            {!isBinary && !isOpen && !isDuration && !isRouting && (
              <div className="flex flex-col gap-3">
                <input
                  type="range" min={0} max={3} step={1} value={likertVal}
                  onChange={e => setLikertVal(Number(e.target.value))}
                  className="w-full accent-brand-5"
                />
                <div className="flex justify-between text-[11px] text-white/50">
                  <span>not at all</span>
                  <span>all the time</span>
                </div>
                <button
                  onClick={() => submit(String(likertVal), "likert_0_3", ["not at all", "a little", "quite a bit", "all the time"][likertVal])}
                  disabled={submitting}
                  className="bg-brand-5 text-white px-5 py-2.5 rounded-full text-sm font-medium self-start hover:scale-105 transition-transform"
                >
                  {submitting ? "saving..." : "next"}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── SI severity follow-up ── */}
        {phase === "si_followup" && !submitting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            <div className={BOT_BUBBLE}>how often would you say these thoughts come up?</div>
            <input type="range" min={0} max={3} step={1} value={siSeverity} onChange={e => setSiSeverity(Number(e.target.value))} className="w-full accent-brand-5" />
            <div className="flex justify-between text-[11px] text-white/50">
              <span>passing, rare</span>
              <span>frequent, hard to shake</span>
            </div>
            <button onClick={submitSiFollowup} disabled={submitting} className="bg-brand-5 text-white px-5 py-2.5 rounded-full text-sm font-medium self-start hover:scale-105 transition-transform">
              {submitting ? "saving..." : "continue"}
            </button>
          </motion.div>
        )}

        {/* ── Safety ── */}
        {phase === "safety" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1a2b33] border border-white/15 rounded-xl p-5 flex flex-col gap-3">
            <h3 className="text-white font-semibold text-lg">you&apos;re not alone in this</h3>
            <p className="text-white/70 text-sm leading-relaxed">what you&apos;re feeling is real. reaching out is one of the bravest things a person can do.</p>
            <p className="text-white text-xs bg-white/10 border border-white/15 rounded-lg p-3 leading-relaxed">
              step[0] isn&apos;t built for emergencies. if you&apos;re in immediate danger, please call your local emergency services or a crisis line right now.
            </p>
            <div className="bg-white/5 rounded-lg p-3 text-sm text-white/80">
              <div className="font-medium text-white mb-1">Pakistan — Umang helpline</div>
              <div>0311-7786264</div>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {phase === "results" && report && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 pt-2">
            <p className="text-white/60 text-xs uppercase tracking-widest">your shape</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <BloomChart conditions={report.conditions} />
            </div>
            <p className="text-white/50 text-[11px] text-center leading-relaxed max-w-sm">
              this is a confidence estimate based on patterns in what you shared — not a clinical diagnosis. a licensed professional can give you the full picture.
            </p>
            <p className="text-white/40 text-[10px] text-center">
              liked what you saw? this is a small slice of step[0] — the full app adds therapist matching, progress tracking and more.
            </p>
          </motion.div>
        )}

        {/* ── Error ── */}
        {phase === "error" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/15 border border-red-400/30 rounded-lg p-4 text-center">
            <p className="text-red-200 text-sm">{errorMsg}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}