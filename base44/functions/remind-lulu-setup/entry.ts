import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

/**
 * Daily nudge: if the Lulu API credentials are not yet configured, email the
 * app admins a reminder with setup steps. Once LULU_CLIENT_KEY and
 * LULU_CLIENT_SECRET are set, this is a no-op (so it self-disables the nudges).
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const installed = !!(
      Deno.env.get("LULU_CLIENT_KEY") && Deno.env.get("LULU_CLIENT_SECRET")
    );
    if (installed) {
      return Response.json({ installed: true, reminded: 0 });
    }

    const users = await base44.asServiceRole.entities.User.list();
    const recipients = (users || [])
      .filter((u) => (u.role === "admin" || u.role === "owner") && u.email)
      .map((u) => u.email);
    const toList = recipients.length ? recipients : (users || []).map((u) => u.email).filter(Boolean);

    let reminded = 0;
    for (const email of toList) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: "⏰ Reminder: add your Lulu API credentials",
        body: [
          "Hi,",
          "",
          "This is your daily reminder that your Lulu print-on-demand credentials are not yet set up.",
          "Until they're added, paid book orders won't be sent to Lulu for printing.",
          "",
          "To finish setup:",
          "1. Create / log into your Lulu account and generate API keys:",
          "   https://developers.sandbox.lulu.com/user-profile/api-keys",
          "2. In your Base44 dashboard go to Settings → Environment Variables.",
          "3. Add two secrets:",
          "   - LULU_CLIENT_KEY  (your client key)",
          "   - LULU_CLIENT_SECRET (your client secret)",
          "",
          "Once both are saved, the daily reminders stop automatically and the",
          "\"Auto Print Orders\" workflow will fulfill new orders on its own.",
          "",
          "— Print A Story",
        ].join("\n"),
      });
      reminded += 1;
    }

    return Response.json({ installed: false, reminded });
  } catch (error) {
    console.error("remind-lulu-setup error:", error?.message || error);
    return Response.json({ error: error?.message || "reminder failed" }, { status: 500 });
  }
});