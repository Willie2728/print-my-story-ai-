import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, PenLine, Laugh } from "lucide-react";

const STAGES = [
  { icon: PenLine, label: "Reading your answers...", color: "text-blue-500" },
  { icon: BookOpen, label: "Outlining the chapters...", color: "text-amber-500" },
  { icon: Sparkles, label: "Writing the manuscript...", color: "text-purple-500" },
  { icon: Laugh, label: "Polishing the punchlines...", color: "text-emerald-500" },
];

export default function GenerationStep({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage < STAGES.length - 1) {
      const t = setTimeout(() => setStage(stage + 1), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onComplete, 1200);
    return () => clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-amber-500" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -inset-2 rounded-full bg-amber-300/20 blur-xl"
        />
      </div>

      <h2 className="font-display text-2xl font-bold mb-2">Writing your book</h2>
      <p className="text-stone-500 mb-10">This usually takes a few seconds. Hang tight.</p>

      <div className="w-full max-w-sm space-y-3 text-left">
        {STAGES.map((s, i) => (
          <AnimatePresence key={i}>
            {i <= stage && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <s.icon className={["w-5 h-5", i < stage ? "text-stone-900" : s.color].join(" ")} />
                <span className={["text-sm", i < stage ? "text-stone-400 line-through" : "text-stone-900 font-medium"].join(" ")}>
                  {s.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}