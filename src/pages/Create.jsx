import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
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

export default function Create() {
  const [step, setStep] = useState(0);
  const [relationship, setRelationship] = useState("");
  const [details, setDetails] = useState({ recipient_name: "", author_name: "", tone: "lighthearted" });
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const key = "print_my_story_preview_start_tracked";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    trackStoryGrowth("preview_start", { metadata: { measurement_version: "run70-v1" } });
  }, []);

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
      trackStoryGrowth("generation_success", {
        relationshipCategory: relationship,
        tone: details.tone,
        metadata: { chapter_count: Array.isArray(res.chapters) ? res.chapters.length : 0 },
      });
      setStep(4);
    } catch (e) {
      trackStoryGrowth("generation_failed", {
        relationshipCategory: relationship,
        tone: details.tone,
        metadata: { failure_stage: "book_generation" },
      });
      setError("Something went wrong generating your book. Please try again.");
      setStep(2);
    }
  };

  const editChapter = (idx, patch) => {
    setBook({ ...book, chapters: book.chapters.map((c, i) => (i === idx ? { ...c, ...patch } : c)) });
    trackStoryGrowth("preview_edit", {
      relationshipCategory: relationship,
      tone: details.tone,
      metadata: { edit_type: "chapter", chapter_index: idx, changed_fields: Object.keys(patch || {}).sort() },
    });
  };
  const editDedication = (value) => {
    setBook({ ...book, dedication: value });
    trackStoryGrowth("preview_edit", {
      relationshipCategory: relationship,
      tone: details.tone,
      metadata: { edit_type: "dedication" },
    });
  };

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
        <Link to="/" className="inline-flex items-center text-sm text-stone-400 hover:text-stone-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Home
        </Link>

        {step !== 3 && step !== 5 && <StepIndicator current={step} />}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        {step === 0 && (
          <RelationshipStep value={relationship} onSelect={setRelationship} onNext={() => { trackStoryGrowth("relationship_selected", { relationshipCategory: relationship }); setStep(1); }} />
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
            onNext={() => { trackStoryGrowth("questionnaire_complete", { relationshipCategory: relationship, tone: details.tone, metadata: { answered_count: Object.values(answers).filter((v) => typeof v === "string" && v.trim()).length } }); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && <GenerationStep onComplete={generateBook} />}
        {step === 4 && book && (
          <PreviewStep
            book={book}
            onEditChapter={editChapter}
            onEditDedication={editDedication}
            onNext={() => {
              trackStoryGrowth("preview_approved", { relationshipCategory: relationship, tone: details.tone, metadata: { approval_surface: "book_preview", measurement_version: "run80-v1" } });
              trackStoryGrowth("checkout_view", { relationshipCategory: relationship, tone: details.tone });
              setStep(5);
            }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 5 && book && (
          <CheckoutStep book={book} onComplete={saveAndComplete} onBack={() => setStep(4)} />
        )}
      </div>
    </div>
  );
}