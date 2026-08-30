import React from "react";
import { Check } from "lucide-react";

const labels = ["Relationship", "Details", "Questions", "Generating", "Preview", "Checkout"];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10">
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  done ? "bg-stone-900 text-amber-300" : active ? "bg-amber-400 text-stone-900" : "bg-stone-200 text-stone-400",
                ].join(" ")}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={["text-[10px] sm:text-xs hidden sm:block", active ? "text-stone-900 font-medium" : "text-stone-400"].join(" ")}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && <div className={["h-px w-4 sm:w-8", done ? "bg-stone-900" : "bg-stone-200"].join(" ")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}