# RUN119 — PRINT MY STORY AI: Personalization Without Oversharing

## Customer Truth

**Personalization should not require oversharing.**

The creation flow asked ten intimate personalization questions and previously required an answer to each current prompt before moving forward. That created unnecessary friction and could pressure a buyer to disclose an embarrassing moment, fear, health-adjacent detail, confidential work detail or other information that does not belong in a printed gift.

## Creative Strategy

### PMS-TXT-077 — Personalization Without Oversharing

Hook: **The best personalized gift is not the one with the most private details. It is the one with the right specific details.**

CTA: Start a preview using only details you would be comfortable putting in the finished gift.

### PMS-DOC-001 — Gift-Safe Personalization Card

The no-contact card separates useful personalization inputs from details that should be skipped or rewritten and adds a buyer-side gift-ready test: recognizable, tone-fit, specific and comfortable to read aloud.

## Production Readiness

- Every questionnaire prompt now has a visible `Skip this one` action.
- The questionnaire explicitly says passwords, API keys, financial account data, government IDs, health details, employer/client confidential information and other sensitive material are not needed.
- The Home page now says every story prompt is skippable and sensitive details are not needed.
- Preview fit checks expanded from 3 to 4 with `gift_safe = I would be comfortable reading this aloud to them`.
- Static no-contact aid: `public/marketing/PMS-DOC-001-gift-safe-personalization-card.html`.
- Native MarketingContent PMS-TXT-077: `6aa10a37fce9135e34d211ec`.
- Native MarketingContent PMS-DOC-001: `6aa10a37fce9135e34d211ed`.
- Final Base44 build exited 0.
- Base44 checkpoint: `6aa10a513a773120154f1b82`.
- Base44 commit: `827ed17f3cf0213c78ead7b2b8674ac6df1286bd`.
- Build warning only: stale Browserslist/caniuse-lite data.

## GitHub Source Parity

Touched application source was synchronized to the connected repository:
- `src/components/create/QuestionnaireStep.jsx` — commit `2a83feb9dfd1d7c48e7db94a48667816f7715d86`
- `src/components/create/PreviewStep.jsx` — commit `5aebb6764e61580bf24a62d8f4b9e72434357400`
- `src/pages/Home.jsx` — commit `60eb8a6c9548d8779e7d4ee6b8262b06a50f5d76`
- `public/marketing/PMS-DOC-001-gift-safe-personalization-card.html` — commit `d6d2a656f9a7f194277f6d390015fdb2be760509`

## Analytics / Winner Library

- StoryGrowthEvent records: **0**.
- Ordered Book records: **0**.
- No preview completion, checkout, payment, printing, shipment, purchase, revenue, ROI or conversion lift is inferred.
- PMS-TXT-077 and PMS-DOC-001 are ready content only; no social publication is claimed.

## Claims Boundary

Making prompts optional and adding a gift-safe self-check improves buyer control in the current product flow. It does not by itself establish privacy-law compliance, child-safety certification, print quality, delivery reliability or customer satisfaction.
