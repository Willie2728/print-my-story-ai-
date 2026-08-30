import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

export default function CategoryGrid({ createLink = "/create" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          className="group rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-xl transition-shadow"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={c.image}
              alt={c.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/55 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="font-display text-lg font-bold text-white drop-shadow">{c.name}</h3>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <p className="text-sm text-stone-600 leading-snug">{c.blurb}</p>
            <Link
              to={createLink}
              className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-stone-900 hover:text-amber-700 transition-colors"
            >
              Create <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}