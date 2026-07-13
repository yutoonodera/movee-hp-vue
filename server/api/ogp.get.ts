function extractMeta(html: string, ...keys: string[]): string | null {
  for (const key of keys) {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, "i"),
      new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, "i"),
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) return m[1].trim();
    }
  }
  return null;
}

function resolveUrl(base: string, url: string | null): string | null {
  if (!url) return null;
  try { return new URL(url, base).toString(); } catch { return url; }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const raw = typeof query.url === "string" ? query.url.trim() : "";
  if (!raw) throw createError({ statusCode: 400, message: "URLを入力してください" });

  const targetUrl = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  try { new URL(targetUrl); } catch {
    throw createError({ statusCode: 400, message: "有効なURLを入力してください" });
  }

  let html: string;
  try {
    html = await $fetch<string>(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Twitterbot/1.0)" },
      responseType: "text",
      timeout: 8000,
    });
  } catch (e: any) {
    throw createError({ statusCode: 502, message: `ページを取得できませんでした（${e?.message ?? "timeout or blocked"}）` });
  }

  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
  const hostname = new URL(targetUrl).hostname;

  const ogTitle       = extractMeta(html, "og:title");
  const ogDesc        = extractMeta(html, "og:description");
  const ogImage       = resolveUrl(targetUrl, extractMeta(html, "og:image"));
  const ogSiteName    = extractMeta(html, "og:site_name") ?? hostname;
  const twCard        = extractMeta(html, "twitter:card") ?? (ogImage ? "summary_large_image" : "summary");
  const twTitle       = extractMeta(html, "twitter:title") ?? ogTitle;
  const twDesc        = extractMeta(html, "twitter:description") ?? ogDesc;
  const twImage       = resolveUrl(targetUrl, extractMeta(html, "twitter:image") ?? extractMeta(html, "og:image"));
  const metaDesc      = extractMeta(html, "description");

  return {
    url: targetUrl,
    hostname,
    siteName: ogSiteName,
    ogTitle,
    ogDescription: ogDesc,
    ogImage,
    twitterCard: twCard,
    twitterTitle: twTitle,
    twitterDescription: twDesc,
    twitterImage: twImage,
    metaTitle: titleTag,
    metaDescription: metaDesc,
  };
});
