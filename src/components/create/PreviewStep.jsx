import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PreviewStep({ book, onEditChapter, onEditDedication, onNext, onBack }) {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  // Pages: 0 = cover, 1 = dedication, 2..n = chapters, last = back note
  const totalPages = 2 + book.chapters.length + 1;

  const startEdit = (key, value) => {
    setEditing(key);
    setDraft(value);
  };
  const saveDedication = () => {
    onEditDedication(draft);
    setEditing(null);
  };

  const renderPage = () => {
    if (page === 0) {
      return (
        <div className="h-full flex flex-col justify-between bg-gradient-to-br from-stone-900 to-stone-700 text-stone-100 p-8">
          <div className="text-xs font-mono text-amber-300 tracking-widest">A PRINT A STORY ORIGINAL</div>
          <div>
            <div className="text-amber-300 text-sm mb-2">for</div>
            <h2 className="font-display text-4xl font-bold leading-tight">{book.book_title}</h2>
            <p className="mt-4 text-stone-300 text-sm">All about {book.recipient_name}</p>
          </div>
          <div className="text-xs text-stone-400">Written by {book.author_name}</div>
        </div>
      );
    }
    if (page === 1) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-amber-50 p-8 text-center">
          <div className="text-xs font-mono text-stone-400 mb-6">DEDICATION</div>
          {editing === "dedication" ? (
            <div className="w-full">
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} className="bg-white" />
              <div className="flex justify-center gap-2 mt-3">
                <Button size="sm" onClick={saveDedication} className="rounded-full bg-stone-900">
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="group relative">
              <p className="font-display text-xl italic text-stone-700 leading-relaxed">"{book.dedication}"</p>
              <button
                onClick={() => startEdit("dedication", book.dedication)}
                className="mt-4 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-900"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>
          )}
        </div>
      );
    }
    if (page === totalPages - 1) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
          <Sparkle className="w-8 h-8 text-amber-500 mb-4" />
          <p className="font-display text-lg text-stone-700">The End.</p>
          <p className="text-sm text-stone-400 mt-2">{book.chapters.length} chapters · just for {book.recipient_name}</p>
        </div>
      );
    }
    const chapter = book.chapters[page - 2];
    const cKey = `chapter-${page - 2}`;
    return (
      <div className="h-full flex flex-col bg-white p-7">
        <div className="text-xs font-mono text-stone-400">CHAPTER {page - 1}</div>
        {editing === `${cKey}-title` ? (
          <div className="mt-2">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={1} className="bg-stone-50 font-display text-xl font-bold" />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => { onEditChapter(page - 2, { chapterTitle: draft }); setEditing(null); }} className="rounded-full bg-stone-900"><Check className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-full"><X className="w-4 h-4" /></Button>
            </div>
          </div>
        ) : (
          <button onClick={() => startEdit(`${cKey}-title`, chapter.chapterTitle)} className="text-left group mt-1">
            <h3 className="font-display text-2xl font-bold text-stone-900">{chapter.chapterTitle}</h3>
            <span className="text-xs text-stone-300 group-hover:text-stone-600 inline-flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit title</span>
          </button>
        )}

        <div className="mt-4 flex-1 overflow-hidden text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
          {editing === `${cKey}-content` ? (
            <div>
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={8} className="bg-stone-50 text-sm" />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => { onEditChapter(page - 2, { content: draft }); setEditing(null); }} className="rounded-full bg-stone-900"><Check className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-full"><X className="w-4 h-4" /></Button>
              </div>
            </div>
          ) : (
            <button onClick={() => startEdit(`${cKey}-content`, chapter.content)} className="text-left h-full w-full group">
              <p className="whitespace-pre-wrap">{chapter.content}</p>
              <span className="text-xs text-stone-300 group-hover:text-stone-600 inline-flex items-center gap-1 mt-3"><Pencil className="w-3 h-3" /> Edit text</span>
            </button>
          )}
        </div>

        {chapter.footerJoke && (
          <div className="mt-4 pt-4 border-t border-stone-100 text-xs italic text-amber-700">— {chapter.footerJoke}</div>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="font-display text-3xl font-bold mb-2 text-center">Your book is ready</h2>
      <p className="text-stone-500 mb-8 text-center">Tap any text to edit. Flip through the pages.</p>

      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="relative w-[300px] sm:w-[360px]">
          <motion.div
            key={page}
            initial={{ rotateY: -15, opacity: 0.5 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="aspect-[3/4] rounded-r-2xl rounded-l-md shadow-2xl border border-stone-200 overflow-hidden"
          >
            {renderPage()}
          </motion.div>
          <div className="text-center text-xs text-stone-400 mt-3 font-mono">
            page {page + 1} / {totalPages}
          </div>
        </div>

        <Button variant="ghost" size="icon" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} className="rounded-full">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="mt-8 flex justify-between max-w-md mx-auto">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button onClick={onNext} className="bg-stone-900 hover:bg-stone-800 rounded-full px-6">
          Looks great — Checkout <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

function Sparkle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}