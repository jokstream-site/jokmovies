// JOK VidSrc availability verifier. Only explicit 200 responses count as available.
exports.handler = async function(event) {
  if (event.httpMethod !== "GET") return { statusCode: 405, headers: { Allow: "GET", "Cache-Control": "no-store" }, body: JSON.stringify({ error: "Method not allowed" }) };
  const params = event.queryStringParameters || {};
  const type = params.type;
  if (type !== "movie" && type !== "tv") return { statusCode: 400, headers: { "Cache-Control": "no-store" }, body: JSON.stringify({ error: "type must be movie or tv" }) };
  const ids = [...new Set(String(params.ids || "").split(",").filter(id => /^\d{1,12}$/.test(id)))].slice(0, 60);
  if (!ids.length) return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=120, s-maxage=300" }, body: JSON.stringify({ provider: "VidSrc", type, available: [] }) };
  const available = [];
  const check = async id => {
    try {
      const response = await fetch("https://vidsrc.sh/info/" + type + "/" + id + ".json", { headers: { Accept: "application/json" } });
      if (!response.ok) return;
      const data = await response.json();
      if (data && data.status_code === 200 && String(data.tmdb_id || id) === id) available.push(id);
    } catch (_) {}
  };
  for (let i = 0; i < ids.length; i += 10) await Promise.all(ids.slice(i, i + 10).map(check));
  return { statusCode: 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=120, s-maxage=300" }, body: JSON.stringify({ provider: "VidSrc", type, checked: ids.length, available }) };
};
