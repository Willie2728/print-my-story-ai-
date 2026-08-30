import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEO_URL =
  "https://media.base44.com/videos/public/6a6316ea30227e128778687f/6e666e5b8_Christmas_Commercial.mp4";
const NARRATION_URL =
  "https://media.base44.com/files/public/6a6316ea30227e128778687f/79e16604d_speech.mp3";

export default function Commercial() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);

  // Keep the short visual clip looping in sync with the longer narration.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => {
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [started]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => setFinished(true);
    a.addEventListener("ended", onEnded);
    return () => a.removeEventListener("ended", onEnded);
  }, [started]);

  const start = async () => {
    setStarted(true);
    setFinished(false);
    const v = videoRef.current;
    const a = audioRef.current;
    try {
      v.muted = false;
      await v.play();
      await a.play();
    } catch {
      // Autoplay restrictions: fall back to muted video, try audio again on user gesture.
      v.muted = true;
      await v.play();
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (a) a.muted = next;
    if (v) v.muted = next;
  };

  const replay = () => {
    const v = videoRef.current;
    const a = audioRef.current;
    setFinished(false);
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
    if (a) { a.currentTime = 0; a.play().catch(() => {}); }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="relative w-full max-w-6xl mx-auto flex-1 flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted={muted}
            loop={false}
            preload="auto"
          />
          <audio ref={audioRef} src={NARRATION_URL} preload="auto" />

          {/* Cinematic gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Start overlay */}
          {!started && (
            <button
              onClick={start}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm transition hover:bg-black/30"
            >
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 text-stone-900 shadow-xl">
                <Play className="w-9 h-9 ml-1" fill="currentColor" />
              </span>
              <span className="text-white font-display text-xl font-semibold drop-shadow">
                Play the Story
              </span>
              <span className="text-white/80 text-sm drop-shadow">
                A holiday keepsake, worth cherishing forever
              </span>
            </button>
          )}

          {/* Brand + CTA overlay */}
          {started && (
            <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-10 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: finished ? 1 : 0.9, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="pointer-events-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
              >
                <div>
                  <p className="text-amber-300 text-xs tracking-[0.25em] uppercase mb-2 drop-shadow">
                    Print A Story
                  </p>
                  <h1 className="text-white font-display text-3xl sm:text-5xl font-bold leading-tight drop-shadow-lg max-w-xl">
                    Give a story they'll cherish forever.
                  </h1>
                  <p className="text-white/85 mt-3 max-w-md drop-shadow">
                    Personalized books where your family become the characters — a keepsake for the
                    holidays and for years to come.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {finished && (
                    <Button
                      onClick={replay}
                      variant="outline"
                      className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" /> Replay
                    </Button>
                  )}
                  <Button
                    asChild
                    className="rounded-full bg-amber-500 hover:bg-amber-400 text-stone-900 h-11 px-6"
                  >
                    <a href="/create">
                      Create Yours <ArrowRight className="w-4 h-4 ml-1.5" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Mute toggle */}
          {started && (
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
        </motion.div>
      </div>

      {/* Caption strip */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-8 text-center">
        <p className="text-stone-400 text-sm">
          No cartoon — every page printed on demand, made for the names you love.
        </p>
      </div>
    </div>
  );
}