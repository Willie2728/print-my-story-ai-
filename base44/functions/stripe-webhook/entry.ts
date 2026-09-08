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
      const shippingDetails = session.shipping_details;
      const shippingAddress = shippingDetails?.address;
      const customerPhone = session.customer_details?.phone || '';
      const shipping = shippingAddress
        ? [
            [shippingAddress.line1, shippingAddress.line2].filter(Boolean).join(' '),
            shippingAddress.city || '',
            shippingAddress.state || '',
            shippingAddress.postal_code || '',
            shippingAddress.country || 'US',
            customerPhone,
          ].join(', ')
        : '';
      const customerEmail = session.customer_details?.email || session.customer_email || '';
      if (bookId) {
        await base44.asServiceRole.entities.Book.update(bookId, {
          status: 'ordered',
          print_status: 'received',
          shipping_address: shipping,
          customer_email: customerEmail,
        });
      }
      await base44.asServiceRole.entities.StoryGrowthEvent.create({
        event_type: 'payment_confirmed',
        session_id: session.metadata?.growth_session_id || '',
        path: '/order-success',
        source: session.metadata?.growth_source || 'direct',
        campaign: session.metadata?.growth_campaign || 'organic',
        content_variant: session.metadata?.growth_content_variant || 'default',
        relationship_category: session.metadata?.relationship_category || '',
        tone: session.metadata?.book_tone || '',
        occurred_at: new Date().toISOString(),
        metadata: {
          payment_provider: 'stripe',
          checkout_session_completed: true,
          book_record_linked: Boolean(bookId),
          shipping_address_received: Boolean(shippingAddress),
          phone_received: Boolean(customerPhone),
        },
      }).catch((analyticsError) => console.error('StoryGrowthEvent payment_confirmed write failed:', analyticsError));
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('stripe-webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});