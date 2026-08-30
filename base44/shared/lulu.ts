// Lulu Direct (Print API) helpers — OAuth2 client-credentials auth,
// cover-dimension calculation, and print-job creation.
// Docs: https://api.lulu.com/docs/  · Sandbox keys: https://developers.sandbox.lulu.com/user-profile/api-keys

export const LULU_BASE =
  Deno.env.get("LULU_BASE_URL") || "https://api.sandbox.lulu.com";

// 6"x9" black-and-white standard paperback, 60# white paper, matte cover.
// (Legacy non-dotted pod_package_id, still accepted by the API.)
export const POD_PACKAGE_ID = "0600X0900BWSTDPB060UW444MXX";

const TOKEN_URL = `${LULU_BASE}/auth/realms/glasstree/protocol/openid-connect/token`;

/** Exchange client_key/secret for a bearer access_token (valid ~1h). */
export async function getLuluToken(clientKey, clientSecret) {
  const basic = btoa(`${clientKey}:${clientSecret}`);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Lulu auth failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Lulu auth: no access_token in response");
  }
  return data.access_token;
}

/** Get the exact one-piece cover dimensions (in points) for a page count. */
export async function calculateCoverDimensions(token, podPackageId, pageCount) {
  const res = await fetch(`${LULU_BASE}/calculate-cover-dimensions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pod_package_id: podPackageId,
      page_count: pageCount,
      unit: "PT",
    }),
  });
  if (!res.ok) {
    throw new Error(`Lulu cover-dimensions failed (${res.status}): ${await res.text()}`);
  }
  return await res.json(); // { width, height, ... }
}

/**
 * Create a Lulu print job.
 * @param {object} p
 * @param {string} p.title
 * @param {string} p.podPackageId
 * @param {string} p.interiorUrl  publicly fetchable interior PDF URL
 * @param {string} p.coverUrl     publicly fetchable one-piece cover PDF URL
 * @param {string} p.recipientName
 * @param {object} p.address      { street1, city, state_code, postcode, country_code, phone_number }
 */
export async function createPrintJob(token, p) {
  const body = {
    external_id: p.externalId,
    line_items: [
      {
        printable_normalization: {
          pod_package_id: p.podPackageId,
          interior: { source_url: p.interiorUrl },
          cover: { source_url: p.coverUrl },
        },
        quantity: 1,
        title: p.title,
      },
    ],
    shipping_address: {
      name: p.recipientName,
      street1: p.address.street1,
      city: p.address.city,
      state_code: p.address.state_code,
      postcode: p.address.postcode,
      country_code: p.address.country_code,
      phone_number: p.address.phone_number,
      email: p.address.email || "noreply@print-a-story.com",
    },
    shipping_level: "MAIL",
  };

  const res = await fetch(`${LULU_BASE}/print-jobs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Lulu create-print-job failed (${res.status}): ${text}`);
  }
  return JSON.parse(text); // { id, status, ... }
}

/** Map a few common country names to ISO-3166-1 alpha-2; pass through 2-letter codes. */
export function countryToCode(name) {
  if (!name) return "US";
  const n = name.trim();
  if (/^[A-Za-z]{2}$/.test(n)) return n.toUpperCase();
  const map = {
    "united states": "US",
    "usa": "US",
    "canada": "CA",
    "united kingdom": "GB",
    "uk": "GB",
    "australia": "AU",
    "germany": "DE",
    "france": "FR",
    "ireland": "IE",
  };
  return map[n.toLowerCase()] || "US";
}