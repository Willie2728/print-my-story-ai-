import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function CompanionOrderSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("book");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) {
      setLoading(false);
      return;
    }
    base44.entities.Book.get(bookId)
      .then((b) => setBook(b))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookId]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        {loading ? (
          <Loader2 className="w-6 h-6 mx-auto animate-spin text-stone-400" />
        ) : book ? (
          <>
            <div className="text-xs uppercase tracking-widest text-amber-700 font-medium mb-2">Companion Edition</div>
            <h1 className="font-display text-3xl font-bold mb-2">Order placed! 🎉</h1>
            <p className="text-stone-500 max-w-md mx-auto mb-6">
              "{book.book_title}" for {book.recipient_name} is heading to the printer. You'll get a tracking email once it ships in 5–7 days.
            </p>
            <div className="inline-block bg-stone-100 rounded-xl px-5 py-3 text-sm text-stone-600 mb-8">
              Order #PAS-{String(book.id).slice(-6).toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs uppercase tracking-widest text-amber-700 font-medium mb-2">Companion Edition</div>
            <h1 className="font-display text-3xl font-bold mb-2">Thanks for your order! 🎉</h1>
          </>
        )}
        <div>
          <Link to="/companion">
            <Button className="bg-stone-900 hover:bg-stone-800 rounded-full">
              Back to companion home <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}