# RUN94 — PRINT MY STORY AI

## Customer Truth
Don’t ask for a shipping address before the preview earns checkout.

## Creative Strategy
**Asset:** PMS-TXT-073 — Contact-Last Checkout

**Hook:** Don’t ask for a shipping address before the preview earns checkout.

**CTA:** Generate the preview. Edit it. Approve it. Continue to Stripe only when the story earns it.

The commercial thesis is that the personalized preview should do the persuasion first. Shipping and phone data should be requested only when the buyer has chosen to continue to a hosted payment session.

## Production Readiness
RUN94 changed the active Base44 checkout path and reconciled the matching GitHub source:
- removed pre-Stripe shipping-address and phone fields from `CheckoutStep.jsx`;
- removed shipping PII from Checkout Session metadata;
- enabled Stripe Checkout `shipping_address_collection` for US orders;
- enabled Stripe Checkout phone-number collection;
- read the shipping address from the completed Checkout Session webhook;
- read phone from `session.customer_details.phone`;
- persisted fulfillment contact data only after `checkout.session.completed`;
- kept payment confirmation separate from print, shipment, and delivery claims.

Base44 client build: **exit 0**.
Checkpoint: `6a9fb9e96361847234f9252d`
Base44 commit: `68fa84410b3d5478416614aaecb5cb9aa7b6eff6`

Base44 runtime did not expose a `deno` binary, so an independent `deno check` of the server functions could not be performed in this run. The client application build passed, and the TypeScript edits were reconciled into GitHub.

GitHub source commits:
- Checkout UI: `16a94118189c8f1aaf3a4a10e1fa4e3dda1dc647`
- Checkout Session function: `d167593be275e868e57d8228d9765cbe23642fa5`
- Stripe webhook: `a6b6ea85a4cc0e1c3ed2239047ccbd7b9cc6c486`

## Distribution Queue
PMS-TXT-073 is `ready` in the app's durable MarketingContent table. It has no post URL and was not published. No RUN94 video, image, or social post was rendered or published.

## Analytics / Evaluation
Verified RUN94 baseline:
- StoryGrowthEvent records: **0**;
- Book records: **3**, all `draft` / `pending` print state;
- verified ordered books in the queried records: **0**;
- Lulu print-job IDs in the queried records: **0**.

The new checkout boundary is therefore untested for conversion lift. The change is a friction/privacy architecture improvement, not a performance claim.

## Winner Library
No winner promoted. Promotion requires attributable StoryGrowthEvent evidence through checkout and payment, not an implementation change alone.

## Evidence / Provider Contract
Stripe's current Checkout documentation supports collecting shipping addresses with `shipping_address_collection` and includes collected shipping details in `checkout.session.completed`. Stripe also supports required phone-number collection and exposes the phone on the Checkout Session/customer details.
https://docs.stripe.com/payments/collect-addresses
https://docs.stripe.com/payments/checkout/phone-numbers

RUN94 does not claim that a live Stripe payment, Lulu print submission, shipment, or delivery occurred. Stripe/Lulu secrets and end-to-end production execution were not independently exercised in this run.
