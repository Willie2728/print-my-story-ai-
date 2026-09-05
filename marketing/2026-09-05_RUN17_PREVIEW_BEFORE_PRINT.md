# Print My Story — Growth Run 17

Date: 2026-09-05
Campaign concept: **Preview the punchline before it becomes paper**
Status: Prompt Ready; not rendered; not published.

## Product Truth Reviewed

Connected Base44 source confirms the working customer path is:

`relationship/details → questions → AI manuscript generation → page-by-page preview/edit → checkout`

The preview experience allows customers to inspect the generated book and edit text before checkout. Checkout is implemented through the app’s Stripe checkout function, and the codebase includes Lulu Direct print-job plumbing plus an Auto Print Orders workflow. Current Book records are only drafts/pending; no shipped or delivered order was used as a marketing proof point.

## Customer Truth

A personalized gift can feel risky when the buyer cannot see what the AI created until after purchase. Print My Story has a better story to tell: **the book is not a mystery box.** The customer answers questions, sees the manuscript, edits it, and only then proceeds toward checkout.

## Creative

### Hook

> A personalized book should surprise them — not you.

### Short Social Copy

You already know the stories, habits, inside jokes, and little details that make them *them*.

Print My Story turns those answers into a personalized multi-chapter book — then lets **you preview and tweak the pages before checkout.**

So the gift can still be a surprise for them without being a mystery for you.

**Answer the questions. Preview the story. Edit what needs editing. Then decide if it belongs in print.**

### 15–20 Second Video Prompt

Open on a blank gift box with text: “AI gift… but what did it actually write?”
Cut to the Print My Story questionnaire filling with personal details.
Cut to the manuscript generation screen.
Cut to the page-by-page preview with one line being edited.
End on a clean paperback mockup and the line:

**“Surprise them. Preview it first.”**

CTA: **Create your story**

## Live Trust Cleanup Completed in Run 17

The connected Base44 app still contained legacy `Print A Story` branding and an unsupported fixed `5 to 7 days` shipping statement on the storybook entrance. Run 17 corrected those surfaces to `Print My Story` and changed shipping language to `Shipping timing is shown during ordering.`

A final source grep returned zero matches for `Print A Story` or the targeted 5–7 day shipping wording in JSX files.

## Guardrails

- Do not claim a specific delivery window unless the live ordering system supplies it for that order.
- Do not claim orders have shipped unless a real Book record has a verified shipped/delivered status and tracking evidence.
- Do not claim the preview is human-edited automatically; the customer is the editor.
- Do not call the video rendered or posted until a playable media file and publication ID/URL are verified.
