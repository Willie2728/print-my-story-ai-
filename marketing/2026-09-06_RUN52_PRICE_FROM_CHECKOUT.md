# Print My Story — Run 52

## Customer Truth
Displayed order totals should come from the actual checkout session, not hard-coded UI numbers that can drift from provider configuration.

## Creative Strategy
**Hook:** Preview the story. Let checkout confirm the price.

Print My Story should sell the experience it can demonstrate first: guided personalization, AI-assisted drafting, page-by-page preview, and editing. When a customer is ready to buy, the published app hands off to Stripe. The final item, shipping, tax, and total amounts should be reviewed in that live checkout session rather than promised earlier from static frontend constants.

## Production Readiness
The connected Base44 checkout UI no longer displays hard-coded book, shipping, or total amounts. The Story guide is also instructed not to quote a price unless the connected checkout presents it. The underlying checkout function still creates a Stripe Checkout session using configured Stripe price IDs.

## Distribution Queue
Use this message in product-led acquisition and gift-intent creative:

> Build the story first. Preview every page. Edit it until it feels right. When you decide to order, review the actual item, shipping, tax, and total in Stripe before paying.

**CTA:** Start Your Preview.

## Analytics / Evaluation
Prioritize preview starts, completed previews, checkout-session creation, and confirmed orders when those events are verified. Do not treat a click toward checkout as a completed purchase.

## Winner Library
Untested. Do not promote this campaign as a winner until attributable traffic and verified conversion data support it.

## Claims Boundary
Do not promise a fixed book price, fixed shipping charge, Apple Pay/Google Pay availability, shipping time, printing, tracking, or fulfillment unless the connected provider flow verifies the relevant state. No Run 52 post is claimed published and no Run 52 video is claimed rendered.
