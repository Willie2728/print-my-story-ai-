import { base44 } from "@/api/base44Client";

const isPreviewRuntime = () => {
  const hostname = window.location.hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("preview");
};

export function getStoryAttribution() {
  const params = new URLSearchParams(window.location.search);
  let sessionId = sessionStorage.getItem("print_my_story_growth_session");
  if (!sessionId) {
    sessionId = window.crypto?.randomUUID?.() || `pms-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("print_my_story_growth_session", sessionId);
  }

  const attributionKey = "print_my_story_growth_attribution";
  let stored = null;
  try {
    stored = JSON.parse(sessionStorage.getItem(attributionKey) || "null");
  } catch {
    stored = null;
  }

  const incoming = {
    source: params.get("utm_source"),
    campaign: params.get("utm_campaign"),
    contentVariant: params.get("utm_content"),
  };
  const hasIncomingAttribution = Boolean(incoming.source || incoming.campaign || incoming.contentVariant);
  const attribution = hasIncomingAttribution
    ? {
        source: incoming.source || stored?.source || "direct",
        campaign: incoming.campaign || stored?.campaign || "organic",
        contentVariant: incoming.contentVariant || stored?.contentVariant || "default",
      }
    : (stored || { source: "direct", campaign: "organic", contentVariant: "default" });

  sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
  return { sessionId, ...attribution };
}

export function trackStoryGrowth(eventType, fields = {}) {
  if (isPreviewRuntime()) return Promise.resolve(null);
  const { sessionId, source, campaign, contentVariant } = getStoryAttribution();
  return base44.entities.StoryGrowthEvent.create({
    event_type: eventType,
    session_id: sessionId,
    path: window.location.pathname,
    source,
    campaign,
    content_variant: contentVariant,
    relationship_category: fields.relationshipCategory || "",
    tone: fields.tone || "",
    occurred_at: new Date().toISOString(),
    environment: "production",
    measurement_eligible: true,
    metadata: fields.metadata || {},
  }).catch(() => null);
}

export function storyCheckoutAttribution() {
  const { sessionId, source, campaign, contentVariant } = getStoryAttribution();
  return {
    growth_session_id: sessionId,
    growth_source: source,
    growth_campaign: campaign,
    growth_content_variant: contentVariant,
  };
}