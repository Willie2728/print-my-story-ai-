import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StepIndicator from "@/components/create/StepIndicator";
import RelationshipStep from "@/components/create/RelationshipStep";
import DetailsStep from "@/components/create/DetailsStep";
import QuestionnaireStep from "@/components/create/QuestionnaireStep";
import GenerationStep from "@/components/create/GenerationStep";
import PreviewStep from "@/components/create/PreviewStep";
import CheckoutStep from "@/components/create/CheckoutStep";
import { trackStoryGrowth } from "@/lib/growthAnalytics";

const DEFAULT_ANSWERS = {
  pronouns: "",
  quirks: "",
  inside_jokes: "",
  embarrassing: "",
  catchphrases: "",
  hobbies: "",
  pet_peeves: "",
  achievement: "",
  fear: "",
  secret: "",
};

export default function CompanionCreate() {
  const [step, setStep] = useState(0);
  const [relationship, setRelationship] = useState("");
  const [details, setDetails] = useState({ recipient_name: "", author_name: "", tone: "lighthearted" });
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  const generateBook = async () => {
    setError("");
    const context = Object.entries(answers)
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `- ${k.replace(/_/g, " ")}: ${v}`)
      .join("\n");

    const toneGuide = {
      lighthearted: "warm, playful, good-natured — poke fun but keep it affectionate",
      roast: "a full roast — sharp, no mercy, but never cruel or mean-spirited",
      satirical: "deadpan and satirical — dry humor, mock-serious tone",
      affectionate: "sweet and sincere with gentle humor — mostly heartfelt",
    }[details.tone];

    const prompt = `You are a comedy ghostwriter creating a personalized comedy book about a real person.
Recipient name: ${details.recipient_name}
Author (the person gifting the book): ${details.author_name}
Relationship: ${relationship}
Tone: ${toneGuide}

Here are real details about the recipient provided by the author:
${context}

Write a short personalized comedy book with:
1. A witty book title (short, punchy, can be a pun).
2. A one-sentence dedication to ${details.recipient_name} from ${details.author_name}.
3. Exactly 5 chapters. Each chapter must have:
   - chapterTitle: a funny, creative title
   - content: 2-3 short paragraphs of comedic prose weaving in the recipient's real details. Use ${details.recipient_name} by name. Keep it SFW.
   - footerJoke: a one-line punchline / running joke for the bottom of the page.

Return ONLY JSON matching the schema. Be specific and personal — reference the real quirks, jokes, and details above.`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            book_title: { type: "string" },
            dedication: { type: "string" },
            chapters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  chapterTitle: { type: "string" },
                  content: { type: "string" },
                  footerJoke: { type: "string" },
                },
                required: ["chapterTitle", "content", "footerJoke"],
              },
            },
          },
          required: ["book_title", "dedication", "chapters"],
        },
      });
      setBook({
        book_title: res.book_title,
        recipient_name: details.recipient_name,
        author_name: details.author_name,
        relationship,
        tone: details.tone,
        answers,
        dedication: res.dedication,
        chapters: res.chapters,
      });
      setStep(4);
    } catch (e) {
      setError("Something went wrong generating your book. Please try again.");
      setStep(2);
    }
  };

  const editChapter = (idx, patch) => {
    setBook({ ...book, chapters: book.chapters.map((c, i) => (i === idx ? { ...c, ...patch } : c)) });
  };
  const editDedication = (value) => setBook({ ...book, dedication: value });

  const saveAndComplete = async () => {
    try {
      await base44.entities.Book.create({
        book_title: book.book_title,
        recipient_name: book.recipient_name,
        author_name: book.author_name,
        relationship: book.relationship,
        tone: book.tone,
        answers: book.answers,
        dedication: book.dedication,
        chapters: book.chapters,
        status: "ordered",
      });
    } catch (e) {
      // non-blocking; order still "placed" in UI
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/companion" className="inline-flex items-center text-sm text-stone-400 hover:text-stone-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Companion Home
        </Link>

        {step !== 3 && step !== 5 && <StepIndicator current={step} />}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        {step === 0 && (
          <RelationshipStep value={relationship} onSelect={setRelationship} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <DetailsStep
            data={details}
            onChange={setDetails}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <QuestionnaireStep
            answers={answers}
            onChange={setAnswers}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && <GenerationStep onComplete={generateBook} />}
        {step === 4 && book && (
          <PreviewStep
            book={book}
            onEditChapter={editChapter}
            onEditDedication={editDedication}
            onNext={({ fitSignals = [] } = {}) => {
              trackStoryGrowth("preview_approved", {
                relationshipCategory: relationship,
                tone: details.tone,
                dedupeKey: "preview_approved",
                metadata: {
                  approval_surface: "companion_book_preview",
                  measurement_version: "run98-v1",
                  buyer_fit_signal_count: fitSignals.length,
                  buyer_fit_signals: fitSignals,
                  checkout_gated_on_fit_signal: false,
                },
              });
              trackStoryGrowth("checkout_view", {
                relationshipCategory: relationship,
                tone: details.tone,
                dedupeKey: "checkout_view",
                metadata: {
                  buyer_fit_signal_count: fitSignals.length,
                  buyer_fit_signals: fitSignals,
                  companion_edition: true,
                  measurement_version: "run98-v1",
                },
              });
              setStep(5);
            }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 5 && book && (
          <CheckoutStep book={book} onComplete={saveAndComplete} onBack={() => setStep(4)} successPath="/companion/order-success" cancelPath="/companion/create" />
        )}
      </div>
    </div>
  );
}