import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Square, Heart, ArrowRight, Volume2 } from "lucide-react";

const VIDEO_URL = "https://media.base44.com/videos/public/6a6316ea30227e128778687f/ae6bc47bf_Valentine_Scene.mp4";
const NARRATION =
  "On a quiet Valentine's evening, candlelight fills the room. She lifts a Tiffany-blue book-box, tied with a crystal-encrusted satin bow. Inside lies a story written only for her — a real book about the love they share. And for a moment, everything else disappears.";

export default function ValentineScene({ createLink = "/create" }) {
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
      const u = new SpeechSynthesisUtterance(NARRATION);
      u.rate = 0.92;
      u.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find((x) => /female|samantha|zira|google us english/i.test(x.name));
      if (pref) u.voice = pref;
      u.onend = () => {
        setPlaying(false);
        if (videoRef.current) videoRef.current.pause();
      };
      window.speechSynthesis.speak(u);
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
          <Heart className="w-4 h-4" /> A Valentine's Story
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">A gift that says everything</h2>
        <p className="mt-3 text-stone-600 max-w-2xl mx-auto">
          Press play for a cinematic peek — with voiceover narration — of the moment she opens a book written only for her.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-rose-200/60"
      >
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-rose-950/30 to-transparent" />
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
            <Button onClick={play} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full">
              <Play className="w-4 h-4 mr-1" /> Play scene with narration
            </Button>
          ) : (
            <Button onClick={stop} className="bg-white text-stone-900 hover:bg-stone-100 rounded-full">
              <Square className="w-4 h-4 mr-1" /> Stop
            </Button>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-white/90 bg-black/30 px-2 py-1 rounded-full">
            <Volume2 className="w-3.5 h-3.5" /> {supported ? "Narration plays aloud" : "Narration unavailable"}
          </span>
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <Link to={createLink}>
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white rounded-full text-base px-8 h-12">
            Write a love story <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}