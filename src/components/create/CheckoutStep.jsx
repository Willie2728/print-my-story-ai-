import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";

export default function CheckoutStep({ book, onBack, successPath = "/order-success", cancelPath = "/create" }) {
  const [form, setForm] = useState({ address: "", city: "", state: "", zip: "", country: "United States", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const valid = form.address.trim() && form.city.trim() && form.state.trim() && form.zip.trim() && form.phone.trim();

  const handleCheckout = async () => {
    setError("");
    // Stripe Checkout must run in the top-level window, not the preview iframe
    if (window.self !== window.top) {
      setError("Checkout works only from the published app. Open the app in a new tab to complete your order.");
      return;
    }
    setSubmitting(true);
    try {
      const shipping_address = `${form.address}, ${form.city}, ${form.state}, ${form.zip}, ${form.country}, ${form.phone}`;
      const res = await base44.functions.invoke("create-checkout-session", { book, shipping_address, success_path: successPath, cancel_path: cancelPath });
      const url = res.data?.url;
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Could not start checkout. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="font-display text-3xl font-bold mb-2">Checkout</h2>
      <p className="text-stone-500 mb-8">Almost there — one last step to make {book.recipient_name} laugh.</p>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">Shipping address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" className="rounded-xl h-11 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded-xl h-11" />
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="ZIP" className="rounded-xl h-11" />
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (for shipping)" className="rounded-xl h-11" />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Payment</Label>
            <div className="rounded-xl border-2 border-dashed border-stone-200 p-4 text-center text-sm text-stone-400">
              <CreditCard className="w-5 h-5 mx-auto mb-1.5 text-stone-300" />
              Stripe Checkout is used when the published app and payment configuration are available. Final item, shipping, tax, and total amounts are confirmed in the Stripe session.
            </div>
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
            <p className="text-xs text-stone-500 leading-relaxed pt-1">The app does not promise a hard-coded total before the live Stripe session is created. Review the item, shipping, tax, and total amounts in Stripe before paying.</p>
          </div>
          <Button
            disabled={!valid || submitting}
            onClick={handleCheckout}
            className="w-full mt-5 bg-stone-900 hover:bg-stone-800 rounded-full h-11"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Redirecting to Stripe…</>
            ) : (
              <><Lock className="w-4 h-4 mr-1.5" /> Continue to Stripe</>
            )}
          </Button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-stone-400">
            <Truck className="w-3.5 h-3.5" /> Shipping availability and timing are confirmed by the configured fulfillment flow after a successful order.
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