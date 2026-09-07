import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@17.0.0';

const BOOK_PRICE = 'price_1TwfQHDIaqwppLWuK6GF38G3';
const SHIPPING_PRICE = 'price_1TwfQHDIaqwppLWuK1CMLk8c';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { book, shipping_address, success_path = '/order-success', cancel_path = '/create', growth_session_id = '', growth_source = 'direct', growth_campaign = 'organic', growth_content_variant = 'default' } = body || {};
    if (!book || !book.book_title || !book.recipient_name) return Response.json({ error: 'Missing book details' }, { status: 400 });

    const created = await base44.asServiceRole.entities.Book.create({ book_title: book.book_title, recipient_name: book.recipient_name, author_name: book.author_name, relationship: book.relationship, tone: book.tone, answers: book.answers, dedication: book.dedication, chapters: book.chapters, status: 'draft', shipping_address: shipping_address || '' });
    const origin = new URL(req.url).origin;
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: BOOK_PRICE, quantity: 1 }, { price: SHIPPING_PRICE, quantity: 1 }],
      success_url: `${origin}${success_path}?book=${created.id}`,
      cancel_url: `${origin}${cancel_path}`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'), book_id: created.id, shipping_address: shipping_address || '',
        growth_session_id: growth_session_id || '', growth_source: growth_source || 'direct', growth_campaign: growth_campaign || 'organic', growth_content_variant: growth_content_variant || 'default',
        relationship_category: book.relationship || '', book_tone: book.tone || '',
      },
    });
    return Response.json({ url: session.url, book_id: created.id });
  } catch (error) {
    console.error('create-checkout-session error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});