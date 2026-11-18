const API_BASE = "https://api.themoviedb.org/3";
const ALLOWED_ROOTS = new Set(["discover","search","trending","watch","movie","tv","genre","configuration"]);
exports.handler = async function(event) {
  if (event.httpMethod !== "GET") return { statusCode: 405, headers: { Allow: "GET", "Cache-Control": "no-store" }, body: JSON.stringify({ error: "Method not allowed" }) };
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { statusCode: 500, headers: { "Cache-Control": "no-store" }, body: JSON.stringify({ error: "TMDB_API_KEY is not configured in Netlify." }) };
  const params = event.queryStringParameters || {};
  const path = params.path || "";
  const segments = path.split("/").filter(Boolean);
  if (!path.startsWith("/") || path.includes("..") || path.includes("?") || !segments.length || !ALLOWED_ROOTS.has(segments[0])) return { statusCode: 400, headers: { "Cache-Control": "no-store" }, body: JSON.stringify({ error: "Unsupported TMDB endpoint." }) };
  const target = new URL(API_BASE + path);
  for (const [key, value] of Object.entries(params)) if (key !== "path" && key !== "api_key" && typeof value === "string" && value.length <= 500) target.searchParams.set(key, value);
  target.searchParams.set("api_key", apiKey);
  try {
    const upstream = await fetch(target.toString(), { headers: { Accept: "application/json" } });
    const body = await upstream.text();
    return { statusCode: upstream.status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": upstream.ok ? "public, max-age=60, s-maxage=300, stale-while-revalidate=600" : "no-store" }, body };
  } catch (_) {
    return { statusCode: 502, headers: { "Cache-Control": "no-store" }, body: JSON.stringify({ error: "TMDB is temporarily unavailable." }) };
  }
};