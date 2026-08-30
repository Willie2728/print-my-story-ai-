import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tones = [
  { value: "lighthearted", label: "Lighthearted", desc: "Warm & playful" },
  { value: "roast", label: "Full Roast", desc: "No mercy, all love" },
  { value: "satirical", label: "Satirical", desc: "Deadpan & dry" },
  { value: "affectionate", label: "Affectionate", desc: "Sweet & sincere" },
];

export default function DetailsStep({ data, onChange, onNext, onBack }) {
  const valid = data.recipient_name.trim() && data.author_name.trim();
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="font-display text-3xl font-bold mb-2">The basics</h2>
      <p className="text-stone-500 mb-8">Names will appear on the cover and dedication.</p>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div>
          <Label className="mb-1.5">Recipient's name</Label>
          <Input
            value={data.recipient_name}
            onChange={(e) => onChange({ ...data, recipient_name: e.target.value })}
            placeholder="e.g. Marcus"
            className="rounded-xl h-11"
          />
        </div>
        <div>
          <Label className="mb-1.5">Your name (the author)</Label>
          <Input
            value={data.author_name}
            onChange={(e) => onChange({ ...data, author_name: e.target.value })}
            placeholder="e.g. Jamie"
            className="rounded-xl h-11"
          />
        </div>
      </div>

      <Label className="mb-2 block">Tone of the book</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tones.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange({ ...data, tone: t.value })}
            className={[
              "p-4 rounded-xl border-2 text-left transition-all hover:border-stone-900",
              data.tone === t.value ? "border-stone-900 bg-stone-50" : "border-stone-200 bg-white",
            ].join(" ")}
          >
            <div className="font-semibold text-sm text-stone-900">{t.label}</div>
            <div className="text-xs text-stone-500">{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button disabled={!valid} onClick={onNext} className="bg-stone-900 hover:bg-stone-800 rounded-full px-6">
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}