# PRINT MY STORY AI — RUN76

## Customer Truth
AI can produce the first draft, but the buyer needs to decide whether the story actually sounds like the person they know. The highest-trust value exchange is the editable preview before checkout, not an unverified unboxing, shipping promise, or purchase claim.

## Creative Strategy
**Asset:** PMS-TXT-071 — Human-Approved Personalization

**Hook:** AI can write the first draft. You decide whether it actually sounds like your person.

**Script:** Show the name field, then three true details going in: the catchphrase, the coffee habit, the family joke. Cut to the draft appearing page by page. “Print My Story can turn the details you know into a personalized draft. Then you read it, change the joke that misses, keep the line that sounds exactly like them, and only then decide whether you want the book.” End on the editable preview, not a fake unboxing.

**CTA:** Start Your Preview.

## Production Readiness
Status: READY / NOT RENDERED.

Visual sequence: three personal details → AI draft → identify one generic line → human edit → preview flip-through → CTA. Do not depict a completed customer purchase, printed shipment, delivery, or recipient reaction as real unless there is a verified underlying receipt.

## Distribution Queue
Approved for organic creative testing when an authenticated publishing path is available. No post is claimed scheduled or live in RUN76.

## Analytics / Evaluation
RUN76 adds a privacy-safe `preview_cta_click` event between `landing_view` and `preview_start`, with the CTA surface recorded as nav, hero, or final CTA. This lets the funnel evaluate:

`landing_view → preview_cta_click → preview_start → relationship_selected → questionnaire_complete → generation_success → checkout_view → checkout_session_created → payment_confirmed`

Current StoryGrowthEvent baseline at the time of RUN76: 0 events. Three existing Book records are draft/pending test or QA records; none is treated as a verified purchase. A purchase is only evidenced by `payment_confirmed` from the payment webhook.

## Winner Library
No winner is declared from an empty production event baseline. PMS-TXT-071 should only be compared after attributable traffic reaches a meaningful sample and downstream preview quality can be evaluated, not on impressions alone.

## Claims Boundary
The app may describe the editable draft/preview workflow that exists. Do not claim a paid order, successful print fulfillment, shipment, delivery, customer satisfaction, revenue, ROAS, or conversion lift without an independent receipt.
