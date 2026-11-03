// Hashing Helper for CAPI (SHA-256 with Meta & TikTok normalizations)

export async function sha256(value) {
  if (!value || typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";

  const msgUint8 = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPhone(phone) {
  if (!phone) return "";
  // Strip all non-digit characters
  const cleaned = String(phone).replace(/\D/g, "");
  return await sha256(cleaned);
}

export async function hashEmail(email) {
  if (!email) return "";
  return await sha256(String(email).trim().toLowerCase());
}

