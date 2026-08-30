import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Square, Heart, ArrowRight, Volume2, Gem } from "lucide-react";

const VIDEO_URL = "https://media.base44.com/videos/public/6a6316ea30227e128778687f/4053016e9_Proposal_Scene.mp4";

// Narration script: alternating narrator / man / woman parts, spoken in sequence.
const SCRIPT = [
  { who: "narrator", text: "In a room aglow with sparkling chandeliers and dim golden light, a man and his new fiancée celebrate the moment they became engaged." },
  { who: "man", text: "I wanted to commemorate this moment with a precious keepsake, dedicated to our love. This book is titled Our Love Story. It tells the story of our relationship — our first date, and all the wonderful moments that led up to this engagement." },
  { who: "man", text: "I love you, and I look forward to us writing our love story together, one day at a time." },
  { who: "woman", text: "Thank you, honey. This is absolutely perfect. I can't wait to show everyone." },
  { who: "narrator", text: "And as romantic music begins to play, gold and silver confetti swirls around the couple." },
];

const VOICE_PROFILE = {
  narrator: { pitch: 1.0, rate: 0.95 },
  man: { pitch: 0.7, rate: 0.95 },
  woman: { pitch: 1.35, rate: 1.0 },
};

export default function ProposalScene({ createLink = "/create" }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) setSupported(false);
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const pick = (who) => {
        if (who === "man") return voices.find((x) => /male|david|mark|daniel|alex|fred/i.test(x.name));
        if (who === "woman") return voices.find((x) => /female|samantha|zira|victoria|google us english/i.test(x.name));
        return voices.find((x) => /samantha|google us english/i.test(x.name));
      };
      SCRIPT.forEach((line) => {
        const u = new SpeechSynthesisUtterance(line.text);
        const prof = VOICE_PROFILE[line.who];
        u.pitch = prof.pitch;
        u.rate = prof.rate;
        const v2 = pick(line.who);
        if (v2) u.voice = v2;
        u.onend = () => {};
        window.speechSynthesis.speak(u);
      });
      // stop video + state when the last line finishes (approx)
      const totalMs = SCRIPT.reduce((a, l) => a + l.text.length, 0) * 55;
      setTimeout(() => {
        setPlaying(false);
        if (videoRef.current) videoRef.current.pause();
      }, totalMs);
    }
    setPlaying(true);
  };

  const stop = () => {
    if (videoRef.current) videoRef.current.pause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
          <Gem className="w-4 h-4" /> Our Love Story
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">The keepsake that says "us"</h2>
        <p className="mt-3 text-stone-600 max-w-2xl mx-auto">
          A cinematic proposal, narrated scene by scene — the moment he hands her a book written only for the two of them.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-amber-200/60"
      >
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-amber-950/30 to-transparent" />
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="w-full aspect-video object-cover"
          playsInline
          loop
          muted
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center gap-3">
          {!playing ? (
            <Button onClick={play} className="bg-amber-600 hover:bg-amber-700 text-white rounded-full">
              <Play className="w-4 h-4 mr-1" /> Play scene with narration
            </Button>
          ) : (
            <Button onClick={stop} className="bg-white text-stone-900 hover:bg-stone-100 rounded-full">
              <Square className="w-4 h-4 mr-1" /> Stop
            </Button>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-white/90 bg-black/30 px-2 py-1 rounded-full">
            <Volume2 className="w-3.5 h-3.5" /> {supported ? "Narrated aloud with voices" : "Narration unavailable"}
          </span>
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <Link to={createLink}>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full text-base px-8 h-12">
            Write your love story <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}