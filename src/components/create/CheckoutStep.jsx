import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Lock, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { storyCheckoutAttribution, trackStoryGrowth } from "@/lib/growthAnalytics";

export default function CheckoutStep({ book, onBack, successPath = "/order-success", cancelPath = "/create" }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setError("");
    // Stripe Checkout must run in the top-level window, not the preview iframe.
    if (window.self !== window.top) {
      setError("Checkout works only from the published app. Open the app in a new tab to complete your order.");
      return;
    }
    setSubmitting(true);
    try {
      const growth = storyCheckoutAttribution();
      const res = await base44.functions.invoke("create-checkout-session", { book, success_path: successPath, cancel_path: cancelPath, ...growth });
      const url = res.data?.url;
      if (!url) throw new Error("No checkout URL returned");
      await trackStoryGrowth("checkout_session_created", {
        relationshipCategory: book.relationship || "",
        tone: book.tone || "",
        metadata: {
          checkout_provider: "stripe",
          book_record_created: Boolean(res.data?.book_id),
          shipping_collection_surface: "stripe_checkout",
          phone_collection_surface: "stripe_checkout",
          precheckout_shipping_pii_collected: false,
        },
      });
      window.location.href = url;
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Could not start checkout. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="font-display text-3xl font-bold mb-2">Checkout</h2>
      <p className="text-stone-500 mb-8">Your preview earned the checkout. Shipping and phone details stay out of the story studio and are collected only inside Stripe when you continue.</p>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-stone-700" />
              <h3 className="font-semibold text-stone-900">Contact-last checkout</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-600">
              Print My Story does not ask for your shipping address or phone number before a Stripe Checkout Session exists. Stripe collects the shipping information required for a paid order; the fulfillment record is updated only after the payment webhook confirms the completed session.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-stone-700" />
              <h3 className="font-semibold text-stone-900">Payment and shipping confirmation</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-600">
              Final item, shipping, tax, address eligibility, and total amounts are confirmed in Stripe. A redirect is not treated as payment, printing, shipment, or delivery.
            </p>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl p-6 h-fit">
          <h3 className="font-display font-bold text-lg mb-4">Order summary</h3>
          <div className="flex gap-3 mb-4">
            <div className="w-14 h-20 rounded-md bg-gradient-to-br from-stone-900 to-stone-600 flex items-center justify-center text-amber-300 text-[8px] font-mono px-1 text-center rotate-2">
              {book.recipient_name}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm leading-tight">{book.book_title}</div>
              <div className="text-xs text-stone-500">Paperback · {book.chapters.length} chapters</div>
              <div className="text-xs text-stone-500">For {book.recipient_name}</div>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-stone-200 pt-3">
            <Row label="Format" value="Paperback" />
            <Row label="Pricing" value="Confirmed in Stripe" />
            <Row label="Shipping details" value="Collected in Stripe" />
            <p className="text-xs text-stone-500 leading-relaxed pt-1">Review the item, shipping, tax, address, phone, and total amounts in Stripe before paying.</p>
          </div>
          <Button
            disabled={submitting}
            onClick={handleCheckout}
            className="w-full mt-5 bg-stone-900 hover:bg-stone-800 rounded-full h-11"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Creating secure checkout…</>
            ) : (
              <><Lock className="w-4 h-4 mr-1.5" /> Continue to Stripe</>
            )}
          </Button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-stone-400">
            <Truck className="w-3.5 h-3.5" /> Shipping availability and timing are confirmed only by the configured fulfillment flow after payment.
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to preview
        </Button>
      </div>
    </motion.div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-stone-600">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}