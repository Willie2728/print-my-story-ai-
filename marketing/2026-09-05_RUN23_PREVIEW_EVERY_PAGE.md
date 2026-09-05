# Print My Story AI — Run 23: Preview Every Page Before Checkout

Date: 2026-09-05

## Product truth reviewed

Connected Base44 source currently says customers can pick a genre, answer questions, receive an AI-generated multi-chapter manuscript, preview and tweak every page, and then continue to checkout. The entrance also states **No charge to preview**.

The codebase contains Stripe checkout and Lulu Direct print-job plumbing, including an Auto Print Orders workflow. The Lulu submission function requires `LULU_CLIENT_KEY` and `LULU_CLIENT_SECRET`; Run 23 did not verify deployed credential state, so this campaign does not claim end-to-end fulfillment is currently operating.

## Deployable campaign

**Hook:** The surprise should be who the book is about — not what arrives in the mail.

**Production-ready copy:**

A personalized book should still give you editorial control.

With Print My Story, the intended flow is simple:

1. Pick the kind of story you want.
2. Answer a few questions about the person, people, or pets in it.
3. Generate the manuscript.
4. Preview and tweak every page.
5. Continue to checkout only when the story feels right.

No charge to preview.

That makes the preview the trust moment: personalization first, buyer review before print.

**CTA:** Start your story and preview it before checkout.

Status: **production-ready text / Prompt Ready. Not published. No new video rendered.**

Claim boundary: do not promise shipping dates, successful Lulu submission, or printed-book delivery until live fulfillment and credential state are verified.
