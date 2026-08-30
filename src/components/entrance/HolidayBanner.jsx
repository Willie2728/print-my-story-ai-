import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { holidayScene } from "@/data/scenes";

// Full-width holiday/Christmas banner with the photorealistic festive scene.
export default function HolidayBanner({ createLink = "/create" }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/10] md:aspect-[21/9] w-full">
        <Image
          src={holidayScene.image}
          alt="Family enjoying personalized books on Christmas morning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl px-6 md:px-16 text-white"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-sm font-medium mb-4">
              {holidayScene.eyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
              {holidayScene.title}
            </h2>
            <p className="text-white/85 text-lg max-w-xl mb-7">{holidayScene.copy}</p>
            <Link to={createLink}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full text-base px-8 h-12">
                Gift a story <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}