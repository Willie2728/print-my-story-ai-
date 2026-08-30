import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const options = [
  { value: "Best Friend", emoji: "🫂", desc: "Partner in crime" },
  { value: "Partner", emoji: "💑", desc: "Your favorite person" },
  { value: "Boss", emoji: "💼", desc: "Loving corporate chaos" },
  { value: "Sibling", emoji: "👫", desc: "Built-in nemesis" },
  { value: "Coworker", emoji: "🧑‍💼", desc: "Desk neighbor" },
  { value: "Parent", emoji: "👪", desc: "Family legend" },
];

export default function RelationshipStep({ value, onSelect, onNext }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="font-display text-3xl font-bold mb-2">Who is this book about?</h2>
      <p className="text-stone-500 mb-8">We'll tailor the humor to the relationship.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onSelect(o.value)}
            className={[
              "text-left p-5 rounded-2xl border-2 transition-all hover:border-stone-900 hover:shadow-md",
              value === o.value ? "border-stone-900 bg-stone-50 shadow-md" : "border-stone-200 bg-white",
            ].join(" ")}
          >
            <div className="text-3xl mb-2">{o.emoji}</div>
            <div className="font-semibold text-stone-900">{o.value}</div>
            <div className="text-xs text-stone-500">{o.desc}</div>
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button disabled={!value} onClick={onNext} className="bg-stone-900 hover:bg-stone-800 rounded-full px-6">
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}