import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceInput } from "@/components/ui/voice-input";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import { Image } from "@/components/ui/image";

const AVATAR_URL = "https://media.base44.com/images/public/6a6316ea30227e128778687f/c7c2d973f_generated_image.png";

const COMPANY_CONTEXT = `You are "Story", the friendly AI guide for Print My Story, a print-on-demand personalized book studio.

About the company:
- Print My Story is an AI-assisted personalized book studio. Customers can generate, preview, and edit a book draft about a specific person, people, or pet before deciding whether to continue to checkout.
- Tagline: "A real book about your favorite person, people or pets — customized by you. Now they can be the star of the story."
- Intended fulfillment model: print-on-demand. Payment and print fulfillment require the connected Stripe and Lulu services to be configured and available; do not promise fulfillment when those integrations are not verified.
- Flagship genre is comedy/roast books, but the platform supports other personalized genres (tribute, adventure, pet stories). Comedy is one sector, not the whole business.

How it works (the process):
1. Customer picks the relationship (Best Friend, Partner, Boss, Sibling, Coworker, Parent, etc.).
2. Enters recipient name, their own name, and a tone (lighthearted, full roast, satirical, affectionate).
3. Answers a fun ~10 question quiz (quirks, inside jokes, embarrassing moments, catchphrases, hobbies, pet peeves, achievements, fears, etc.).
4. Our AI writes a multi-chapter manuscript (a title, a dedication, and 5 chapters, each with a footer joke).
5. Customer previews the book page-by-page and can edit any text inline.
6. Checkout can collect a shipping address and hand off to Stripe when the published app and payment configuration are available.
7. After a confirmed payment, the configured workflow is designed to submit the order to Lulu Direct when Lulu credentials are present. Shipping timing and tracking depend on the fulfillment provider and should not be promised before provider confirmation.

Checkout pricing is confirmed inside the live Stripe session rather than promised from hard-coded UI amounts. Do not quote a book, shipping, tax, or total price unless the connected checkout flow presents it to the customer.

When helping, be warm, concise, and enthusiastic. Suggest concrete gift ideas and occasions (birthdays, retirement, weddings, work farewells, Father's/Mother's Day, pet memorials, anniversaries). If asked about order status, describe only the status shown in the app and do not claim printing, shipment, delivery, or tracking unless the order record confirms it. Keep answers short unless asked for detail. Never invent prices, integration status, shipping dates, or features.`;

const SUGGESTIONS = [
  "What kind of books can I make?",
  "How does the process work?",
  "What's a good occasion for this?",
  "How much does a book cost?",
  "Can I edit the book before ordering?",
];

export default function SiteGuide() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm Story, your guide to Print My Story. Ask me anything about how it works, gift ideas, or our books — or try one of the suggestions below. 📖" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const ask = async (prompt) => {
    if (!prompt.trim() || loading) return;
    const history = [...messages, { role: "user", text: prompt }];
    setMessages(history);
    setInput("");
    setLoading(true);

    const convo = history
      .map((m) => `${m.role === "user" ? "Customer" : "Story"}: ${m.text}`)
      .join("\n");

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${COMPANY_CONTEXT}\n\nConversation so far:\n${convo}\n\nStory (reply as the guide, friendly and concise):`,
      });
      setMessages([...history, { role: "assistant", text: typeof res === "string" ? res : JSON.stringify(res) }]);
    } catch (e) {
      setMessages([...history, { role: "assistant", text: "Sorry, I had trouble answering that. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-stone-900 text-white shadow-2xl shadow-stone-900/30"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-300">
          <Image src={AVATAR_URL} alt="Story guide" className="w-full h-full object-cover" />
        </div>
        <span className="font-medium text-sm hidden sm:block">{open ? "Close" : "Ask Story"}</span>
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-stone-900" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-sm bg-white rounded-3xl shadow-2xl shadow-stone-900/20 border border-stone-200 overflow-hidden flex flex-col"
            style={{ maxHeight: "70vh", opacity }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-stone-900 text-white">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-amber-300">
                <Image src={AVATAR_URL} alt="Story" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold flex items-center gap-1.5">
                  Story <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="text-xs text-stone-300">Your Print My Story guide</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0.6}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-16 accent-amber-300"
                  title="Adjust widget opacity"
                  aria-label="Adjust widget opacity"
                />
                <button onClick={() => setOpen(false)} className="text-stone-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="flex gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-amber-300">
                      <Image src={AVATAR_URL} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-stone-800 shadow-sm border border-stone-100 leading-relaxed whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="bg-stone-900 text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm max-w-[85%] shadow-sm whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-amber-300">
                    <Image src={AVATAR_URL} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white rounded-2xl px-3.5 py-2.5 shadow-sm border border-stone-100">
                    <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-stone-900 hover:bg-stone-50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-stone-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Story anything…"
                  className="rounded-full h-10"
                />
                <VoiceInput value={input} onChange={setInput} className="h-10 w-10" />
                <Button type="submit" disabled={loading || !input.trim()} className="rounded-full h-10 w-10 p-0 bg-stone-900 hover:bg-stone-800">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}