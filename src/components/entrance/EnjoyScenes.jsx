import React from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { enjoyScenes } from "@/data/scenes";

// Reusable gallery of photorealistic scenes showing people enjoying their books.
export default function EnjoyScenes() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold">See it in their hands</h2>
        <p className="mt-3 text-stone-600 max-w-2xl mx-auto">
          Real moments, real books — from cozy nights to holiday mornings.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {enjoyScenes.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative rounded-2xl overflow-hidden shadow-sm border border-stone-200 aspect-[4/5]"
          >
            <Image
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display font-bold text-white text-lg leading-tight">{s.title}</h3>
              <p className="text-white/80 text-xs mt-0.5">{s.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}