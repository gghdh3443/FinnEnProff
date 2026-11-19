// Normalizes NEXT_PUBLIC_SITE_URL so a bare host like "example.netlify.app" still works.
export function siteUrl(fallback = "https://example.no"): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (!raw) return fallback;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}
