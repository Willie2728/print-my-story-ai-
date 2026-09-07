import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { BookOpen, ArrowRight, Sparkles, Wand2, ExternalLink } from "lucide-react";
import BookFlip from "@/components/entrance/BookFlip";
import CategoryGrid from "@/components/entrance/CategoryGrid";
import EnjoyScenes from "@/components/entrance/EnjoyScenes";
import HolidayBanner from "@/components/entrance/HolidayBanner";
import ValentineScene from "@/components/entrance/ValentineScene";
import ProposalScene from "@/components/entrance/ProposalScene";
import { categories } from "@/data/categories";

// ---- Page content renderers for the storybook ----

function CoverPage({ edition }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
      <div className="absolute inset-3 rounded-r-xl border border-amber-400/40" />
      <div className="absolute inset-5 rounded-r-xl border border-amber-400/20" />
      <BookOpen className="w-10 h-10 text-amber-300 mb-5" />
      <div className="font-serif text-amber-200 tracking-[0.3em] text-xs mb-3">EST. 2026</div>
      <h1 className="font-display text-4xl font-bold text-amber-100 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
        Print My Story
      </h1>
      {edition === "companion" && (
        <div className="mt-2 text-amber-300/80 text-[10px] tracking-[0.3em] uppercase">Companion Edition</div>
      )}
      <div className="mt-4 mx-auto w-24 h-px bg-amber-400/50" />
      <p className="mt-4 text-amber-200/80 text-sm italic" style={{ fontFamily: "Georgia, serif" }}>
        A personalized book, written for you,<br />about the ones you love.
      </p>
      <div className="absolute bottom-6 left-0 right-0 text-center text-amber-200/60 text-[10px] tracking-widest uppercase">
        Open the book →
      </div>
    </div>
  );
}

function IntroPage({ eyebrow, heading, body, pageNum }) {
  return (
    <div className="absolute inset-0 flex flex-col px-9 py-10 text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
      <div className="text-[10px] tracking-[0.3em] uppercase text-amber-700/70 mb-4">{eyebrow}</div>
      <h2 className="font-display text-2xl font-bold mb-4 leading-snug">{heading}</h2>
      <p className="text-sm leading-relaxed text-stone-700">{body}</p>
      <div className="mt-auto text-right text-[10px] text-stone-400 tracking-widest uppercase">{pageNum}</div>
    </div>
  );
}

function CategoryPage({ pair, pageNum }) {
  return (
    <div className="absolute inset-0 flex flex-col px-8 py-8 text-stone-800">
      <div className="text-[10px] tracking-[0.3em] uppercase text-amber-700/70 mb-3" style={{ fontFamily: "Georgia, serif" }}>Choose a genre</div>
      <div className="flex-1 grid grid-cols-1 gap-4">
        {pair.map((c) => (
          <div key={c.id} className="flex gap-3 items-stretch">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
              <Image src={c.image} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-display font-bold text-stone-900 text-sm leading-tight">{c.name}</div>
              <div className="text-xs text-stone-600 leading-snug mt-0.5" style={{ fontFamily: "Georgia, serif" }}>{c.blurb}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-right text-[10px] text-stone-400 tracking-widest uppercase">{pageNum}</div>
    </div>
  );
}

function FinalPage({ createLink }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" style={{ fontFamily: "Georgia, serif" }}>
      <Sparkles className="w-8 h-8 text-amber-600 mb-3" />
      <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">Your story awaits</h2>
      <p className="text-sm text-stone-600 mb-6 leading-relaxed">
        Pick a genre, answer a few questions, and our AI drafts and lays out a personalized book you can preview and tweak before checkout — about your favorite person, people, or pets.
      </p>
      <Link to={createLink}>
        <Button className="bg-stone-900 hover:bg-stone-800 rounded-full text-sm">
          Create your free preview <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
      <p className="mt-4 text-[10px] text-stone-400 tracking-widest uppercase">No charge to preview</p>
    </div>
  );
}

/**
 * Shared storybook landing page used by both the main Entrance and the
 * Companion Edition entrance. Pass links + edition to control branding/nav.
 */
export default function StorybookEntrance({
  edition = "main",
  createLink = "/create",
  classicLink = null,
  mainSiteLink = null,
}) {
  const isCompanion = edition === "companion";

  const categoryLeaves = [];
  for (let i = 0; i < categories.length; i += 2) {
    const pair = categories.slice(i, i + 2);
    const pageNum = `Page ${i / 2 + 4}`;
    categoryLeaves.push(<CategoryPage key={i} pair={pair} pageNum={pageNum} />);
  }

  const pages = [
    <CoverPage key="cover" edition={edition} />,
    <IntroPage key="i1" eyebrow="Chapter One" heading="Once upon a time…" body="There lived a person worth a whole book. Maybe it's your best friend, your partner, your dad, or a dog named Kevin. Someone whose quirks and inside jokes deserve to be bound in real paper, with a spine and a dedication page." pageNum="Page 1" />,
    <IntroPage key="i2" eyebrow="Chapter Two" heading="A studio built for story & print" body="Print My Story is being built as a print-on-demand book studio. You answer a few playful questions, our AI writes a multi-chapter manuscript, and you preview and tweak every page before checkout. Print fulfillment and shipping depend on the connected fulfillment service being configured and available." pageNum="Page 2" />,
    <IntroPage key="i3" eyebrow="Chapter Three" heading="Every genre, one book" body="From bedtime adventures for children to roasts for your boss, from Roman empires to wild safaris — there's a story for every occasion and every kind of hero. Turn the page to glimpse a few." pageNum="Page 3" />,
    ...categoryLeaves,
    <FinalPage key="final" createLink={createLink} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-amber-50 text-stone-900">
      {/* Top nav */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight">Print My Story</span>
            {isCompanion && (
              <span className="text-[10px] uppercase tracking-widest text-amber-700 font-medium">Companion Edition</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {mainSiteLink && (
            <Link to={mainSiteLink} className="text-sm text-stone-500 hover:text-stone-900 inline-flex items-center gap-1">
              Main site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          {classicLink && (
            <Link to={classicLink} className="text-sm text-stone-500 hover:text-stone-900">Classic home</Link>
          )}
          <Link to={createLink}>
            <Button className="bg-stone-900 hover:bg-stone-800 rounded-full text-sm">
              Preview your story <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Storybook hero */}
      <header className="max-w-6xl mx-auto px-6 pt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-5">
            <Wand2 className="w-4 h-4" /> {isCompanion ? "An enchanted entrance · Companion" : "An enchanted entrance"}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl mx-auto">
            Open the book. Begin a story.
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-xl mx-auto">
            Turn the pages of our storybook to explore the available genres — then draft and preview your own before checkout.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <BookFlip pages={pages} width={340} height={460} />
          </motion.div>
        </div>
      </header>

      {/* All categories showcase */}
      <section id="categories" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold">Every kind of story</h2>
          <p className="mt-3 text-stone-600 max-w-2xl mx-auto">
            Photoreal glimpses of the genres we offer. Each one can guide a personalized book draft you preview before checkout; print fulfillment depends on the connected service being configured and available.
          </p>
        </motion.div>
        <CategoryGrid createLink={createLink} />
      </section>

      {/* Scenes & holiday */}
      <EnjoyScenes />
      <HolidayBanner createLink={createLink} />
      <ValentineScene createLink={createLink} />
      <ProposalScene createLink={createLink} />

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Ready to write theirs?</h2>
        <p className="text-stone-600 mb-8 text-lg">Answer the guided questions, review the draft, and edit every page before checkout.</p>
        <Link to={createLink}>
          <Button size="lg" className="bg-stone-900 hover:bg-stone-800 rounded-full text-base px-8 h-12">
            Create your free preview <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-400">
        {isCompanion ? "Print My Story · Companion Edition · Personalized book studio · preview before checkout" : "Print My Story · Personalized book studio · preview before checkout"}
      </footer>
    </div>
  );
}