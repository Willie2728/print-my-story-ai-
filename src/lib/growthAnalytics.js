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
  return { sessionId, source: params.get("utm_source") || "direct", campaign: params.get("utm_campaign") || "organic", contentVariant: params.get("utm_content") || "default" };
}

export function trackStoryGrowth(eventType, fields = {}) {
  if (isPreviewRuntime()) return Promise.resolve(null);
  const { sessionId, source, campaign, contentVariant } = getStoryAttribution();
  return base44.entities.StoryGrowthEvent.create({ event_type: eventType, session_id: sessionId, path: window.location.pathname, source, campaign, content_variant: contentVariant, relationship_category: fields.relationshipCategory || "", tone: fields.tone || "", occurred_at: new Date().toISOString(), metadata: fields.metadata || {} }).catch(() => null);
}

export function storyCheckoutAttribution() {
  const { sessionId, source, campaign, contentVariant } = getStoryAttribution();
  return { growth_session_id: sessionId, growth_source: source, growth_campaign: campaign, growth_content_variant: contentVariant };
}
