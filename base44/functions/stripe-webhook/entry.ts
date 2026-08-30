import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@17.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const event = await stripe.webhooks.constructEventAsync(body, signature, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookId = session.metadata?.book_id;
      const shipping = session.metadata?.shipping_address || '';
      const customerEmail = session.customer_details?.email || session.customer_email || '';
      if (bookId) {
        await base44.asServiceRole.entities.Book.update(bookId, {
          status: 'ordered',
          print_status: 'received',
          shipping_address: shipping,
          customer_email: customerEmail,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('stripe-webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});