# Print My Story AI — Run 37 — The Buyer Is the Editor

## Customer truth

**AI can draft the story. The buyer still edits the gift.**

The strongest connected conversion path is not an unverified printing promise. It is the buyer-controlled sequence already present in the app:

`relationship + details → guided questions → AI-generated draft → page-by-page preview → edit dedication / chapter content → decide whether to continue to checkout`

That creates a cleaner risk-reversal proposition for a personalized gift: the buyer can inspect and change the actual story before deciding whether to pay.

## Campaign

**Hook:** Don't buy the concept. Turn the pages first.

A personalized gift should not become a blind AI purchase. Build the draft around the person you know, flip through the pages, change the dedication, rewrite the joke that misses, and decide whether it feels personal before you continue to checkout.

**CTA:** Start with the person. Edit the pages before checkout.

Exact campaign state: **production-ready text only; no new media rendered; nothing published**.

## Run 37 product-truth correction

Connected Base44 source was reviewed together with the payment/fulfillment backend. The app contains a Stripe Checkout function, a Stripe webhook, an Auto Print Orders workflow, and a Lulu submission function. However, current sandbox environment checks during this run showed the Stripe secret, Stripe webhook secret, Lulu client key, and Lulu client secret are not present. All three current Book records are `draft` / `pending` and none has a `lulu_job_id`.

Therefore Run 37 removed or conditioned public claims that the app currently prints/ships every book, guarantees 5–7 day shipping, automatically has a book 'heading to the printer', or makes the book 'write itself'. Home, Companion Home, the Story guide, and both order-return pages now describe payment/fulfillment as provider-dependent and only show printing/shipping language when the order record actually confirms a fulfillment state.

A targeted post-edit source scan found zero matches for the reviewed risky phrases, and `cd /app && npm run build` completed with exit code 0.

## Source drift

The connected GitHub `src/pages/Home.jsx` remains older than the current Base44 source and still contains legacy `Print A Story` branding, fabricated review/testimonial content, a 5–7 day shipping claim, and stronger print/ship language. The newer Base44 source was preserved rather than overwritten from the stale GitHub file. Reconciliation remains a Build Liaison item.
