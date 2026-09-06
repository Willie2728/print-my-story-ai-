import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Laugh, PenLine, Truck, ArrowRight, Star } from "lucide-react";
import EnjoyScenes from "@/components/entrance/EnjoyScenes";
import HolidayBanner from "@/components/entrance/HolidayBanner";

const relationships = [
  { label: "Best Friend", emoji: "🫂" },
  { label: "Partner", emoji: "💑" },
  { label: "Boss", emoji: "💼" },
  { label: "Sibling", emoji: "👫" },
  { label: "Coworker", emoji: "🧑‍💼" },
  { label: "Parent", emoji: "👪" },
];

const steps = [
  { icon: PenLine, title: "Share the scoop", desc: "Answer a fun 10-question quiz about your person — quirks, inside jokes, the works." },
  { icon: Sparkles, title: "AI writes the book", desc: "Our comedy engine crafts a multi-chapter manuscript tailored to your answers." },
  { icon: Laugh, title: "Preview & tweak", desc: "Flip through a live book preview and edit any joke until it lands perfectly." },
  { icon: Truck, title: "Checkout & fulfillment", desc: "Continue to checkout when you're ready. Print fulfillment and shipping depend on the configured payment and fulfillment services being available." },
];

const giftIdeas = [
  { title: "Birthday roast", text: "Turn inside jokes, habits, and favorite stories into a playful personalized paperback." },
  { title: "Family keepsake", text: "Build a story around a parent, sibling, partner, child, or pet using details you choose." },
  { title: "Coworker or team gift", text: "Create a lighthearted book around workplace moments without pretending it came from a real customer review." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Print My Story</span>
        </div>
        <Link to="/create">
          <Button className="bg-stone-900 hover:bg-stone-800 rounded-full">Create Your Book <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-12 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6"><Sparkles className="w-4 h-4" /> AI-assisted personalized book studio</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-4xl mx-auto">A real book about your favorite person, people or pets — customized by you.</h1>
          <p className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">Answer a few questions and our AI drafts a personalized book you can preview and edit page by page before checkout. Print fulfillment and shipping depend on the connected payment and fulfillment services being configured and available.</p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/create"><Button size="lg" className="bg-stone-900 hover:bg-stone-800 rounded-full text-base px-8 h-12">Create Your Book <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            <span className="text-sm text-stone-500">Preview before checkout · Shipping timing shown during ordering</span>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {relationships.map((r) => <span key={r.label} className="px-4 py-2 rounded-full bg-white border border-stone-200 text-sm text-stone-700 shadow-sm">{r.emoji} {r.label}</span>)}
          </div>
        </motion.div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-stone-900 flex items-center justify-center mb-4"><s.icon className="w-5 h-5 text-amber-300" /></div>
              <div className="text-xs font-mono text-stone-400 mb-1">STEP {i + 1}</div><h3 className="font-display font-bold text-lg mb-1">{s.title}</h3><p className="text-sm text-stone-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-stone-900 text-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-sm font-medium mb-4"><Star className="w-4 h-4" /> Sample chapter</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Chapter 3: The Coffee Incident</h2>
            <p className="text-stone-300 leading-relaxed">It was a Tuesday — the day Marcus decided one espresso wasn't enough. By 9:14 AM he had consumed four, spoken exclusively in haiku, and renamed the office printer "Gregory." Nobody asked why. By noon, Gregory had its own email signature...</p>
            <p className="mt-4 text-sm text-amber-300 italic">— Footer joke: He still blames Gregory for the Q3 numbers.</p>
          </div>
          <div className="relative"><div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-stone-100 rounded-r-2xl rounded-l-md shadow-2xl p-8 rotate-2"><div className="text-xs font-mono text-stone-400">CHAPTER THREE</div><div className="font-display text-2xl font-bold mt-2 mb-4 text-stone-900">The Coffee Incident</div><div className="space-y-3 text-sm text-stone-700 leading-relaxed"><p>It was a Tuesday — the day Marcus decided one espresso wasn't enough.</p><p>By 9:14 AM he had consumed four, spoken exclusively in haiku...</p><p className="text-stone-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.</p></div></div></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Three easy ways to make it personal</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {giftIdeas.map((idea) => <div key={idea.title} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm"><div className="flex gap-0.5 mb-3"><Star className="w-5 h-5 text-amber-400" /></div><h3 className="font-display font-bold text-lg mb-2">{idea.title}</h3><p className="text-stone-700 leading-relaxed">{idea.text}</p></div>)}
        </div>
      </section>

      <EnjoyScenes />
      <HolidayBanner createLink="/create" />

      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Ready to make them laugh?</h2>
        <p className="text-stone-600 mb-8 text-lg">Answer the guided questions, review the draft, and edit the pages before you decide whether to continue to checkout.</p>
        <Link to="/create"><Button size="lg" className="bg-stone-900 hover:bg-stone-800 rounded-full text-base px-8 h-12">Start Creating <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-400">Print My Story · Personalized book studio · preview before checkout</footer>
    </div>
  );
}
