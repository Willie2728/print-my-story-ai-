import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const QUESTIONS = [
  { key: "pronouns", q: "What are their pronouns?", placeholder: "e.g. she/her, he/him, they/them" },
  { key: "quirks", q: "Top 3 quirky habits or obsessions?", placeholder: "e.g. obsessively refills the ice tray, talks to plants..." },
  { key: "inside_jokes", q: "Any inside jokes only you two get?", placeholder: "e.g. The 'Gregory' printer incident, banana phone..." },
  { key: "embarrassing", q: "An embarrassing moment worth immortalizing?", placeholder: "e.g. Texted the boss 'love you' by accident..." },
  { key: "catchphrases", q: "Their catchphrases or verbal tics?", placeholder: "e.g. 'Literally though', 'Make it make sense'..." },
  { key: "hobbies", q: "Hobbies they take way too seriously?", placeholder: "e.g. Competitive sourdough, spreadsheets for fun..." },
  { key: "pet_peeves", q: "Small things that set them off?", placeholder: "e.g. Slow walkers, untuned guitars..." },
  { key: "achievement", q: "An achievement they won't shut up about?", placeholder: "e.g. Won a hotdog contest in 2014..." },
  { key: "fear", q: "A funny / irrational fear?", placeholder: "e.g. Pigeons, calling instead of texting..." },
  { key: "secret", q: "One sweet thing you'd want the book to say?", placeholder: "e.g. They showed up for me when I moved cities." },
];

export default function QuestionnaireStep({ answers, onChange, onNext, onBack }) {
  const [idx, setIdx] = useState(0);
  const current = QUESTIONS[idx];
  const value = answers[current.key] || "";
  const answeredCount = QUESTIONS.filter((q) => (answers[q.key] || "").trim()).length;
  const isLast = idx === QUESTIONS.length - 1;

  const next = () => {
    onChange({ ...answers, [current.key]: value });
    if (isLast) {
      onNext();
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl font-bold">The fun part</h2>
        <span className="text-sm text-stone-400 font-mono">{answeredCount}/{QUESTIONS.length} answered</span>
      </div>

      <div className="h-1 bg-stone-100 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-stone-900 rounded-full"
          animate={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="text-xs font-mono text-stone-400 mb-2">QUESTION {idx + 1}</div>
        <label className="font-display text-xl font-semibold text-stone-900 mb-4 block">{current.q}</label>
        <Textarea
          key={current.key}
          autoFocus
          value={value}
          onChange={(e) => onChange({ ...answers, [current.key]: e.target.value })}
          placeholder={current.placeholder}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Button variant="ghost" onClick={() => (idx === 0 ? onBack() : setIdx(idx - 1))} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-1" /> {idx === 0 ? "Back" : "Previous"}
        </Button>
        <Button onClick={next} disabled={!value.trim()} className="bg-stone-900 hover:bg-stone-800 rounded-full px-6">
          {isLast ? "Generate my book" : "Next"} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}