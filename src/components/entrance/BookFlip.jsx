import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// A 3D, page-turning storybook. Each "leaf" shows its content on the front
// and decorative cream paper on the back. Pages flip around the left spine.
export default function BookFlip({ pages, width = 340, height = 460 }) {
  const [flippedCount, setFlippedCount] = useState(0);
  const [flipping, setFlipping] = useState(null); // { index } | null
  const n = pages.length;

  const next = useCallback(() => {
    if (flippedCount >= n) return;
    setFlipping({ index: flippedCount });
    setFlippedCount((c) => c + 1);
  }, [flippedCount, n]);

  const back = useCallback(() => {
    if (flippedCount <= 0) return;
    const idx = flippedCount - 1;
    setFlipping({ index: idx });
    setFlippedCount((c) => c - 1);
  }, [flippedCount]);

  const zOf = (i) => {
    if (flipping && flipping.index === i) return 999;
    return i < flippedCount ? i : n - i + n;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ perspective: 2200, width, height }}
      >
        {/* Book base / cover shadow */}
        <div
          className="absolute inset-0 rounded-l-[6px] rounded-r-[14px] shadow-2xl"
          style={{ background: "linear-gradient(135deg,#3a2a1a,#1c130a)" }}
        />

        {/* Gold fore-edge (right side of the page block) */}
        <div
          className="absolute top-1 bottom-1 right-0 w-2 rounded-r-[10px] pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(201,166,92,0.15), #d4af6a 30%, #f6e3a1 55%, #c9a65c 80%, #8a6a2e 100%)",
            boxShadow: "inset -1px 0 2px rgba(0,0,0,0.25)",
          }}
        />
        {/* Spine shadow (left) */}
        <div
          className="absolute top-0 bottom-0 left-0 w-3 rounded-l-[6px] pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0))" }}
        />

        {/* Pages */}
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {pages.map((content, i) => {
            const flipped = i < flippedCount;
            const isCover = i === 0;
            const isLast = i === n - 1;
            return (
              <motion.div
                key={i}
                className="absolute inset-0 origin-left"
                style={{
                  zIndex: zOf(i),
                  transformStyle: "preserve-3d",
                  borderRadius: "0 12px 12px 0",
                }}
                animate={{ rotateY: flipped ? -180 : 0 }}
                transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
                onAnimationComplete={() => setFlipping((f) => (f && f.index === i ? null : f))}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: "0 12px 12px 0",
                    background: isCover
                      ? "linear-gradient(135deg,#4a3420,#241608)"
                      : "linear-gradient(120deg,#fbf6e9,#f3ead2)",
                    boxShadow: isCover
                      ? "inset 0 0 0 2px rgba(212,175,106,0.5), 0 8px 30px rgba(0,0,0,0.35)"
                      : "inset 0 0 0 1px rgba(201,166,92,0.25), 0 4px 14px rgba(0,0,0,0.12)",
                  }}
                >
                  {content}
                </div>

                {/* Back face (decorative paper) */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "0 12px 12px 0",
                    background: "linear-gradient(120deg,#f3ead2,#fbf6e9)",
                  }}
                >
                  <div className="text-center text-stone-300 select-none">
                    <div className="font-serif italic text-sm">~ Print A Story ~</div>
                    <div className="mt-2 text-[10px] tracking-widest uppercase">{isLast ? "Fin" : `Page ${i + 1}`}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Page hint arrow */}
        {flippedCount < n && (
          <motion.div
            className="absolute top-1/2 right-2 -translate-y-1/2 z-[900] text-amber-200/70"
            animate={{ x: [0, 4, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={back}
          disabled={flippedCount === 0}
          className="w-10 h-10 rounded-full bg-white border border-stone-300 flex items-center justify-center disabled:opacity-30 hover:border-stone-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-stone-700" />
        </button>
        <div className="flex gap-1.5">
          {pages.map((_, i) => (
            <span
              key={i}
              className={["w-1.5 h-1.5 rounded-full transition-all", i < flippedCount ? "bg-amber-500" : "bg-stone-300"].join(" ")}
            />
          ))}
        </div>
        <button
          onClick={next}
          disabled={flippedCount >= n}
          className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center disabled:opacity-30 hover:bg-stone-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-xs text-stone-400">Turn the pages →</p>
    </div>
  );
}