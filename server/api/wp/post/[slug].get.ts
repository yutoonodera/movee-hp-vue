interface WpMediaSize {
  source_url: string;
}
interface WpEmbeddedMedia {
  source_url: string;
  media_details?: { sizes?: Record<string, WpMediaSize> };
}
interface WpRawPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  acf?: { event_date?: string; event_end?: string; thumbnail_url?: string };
  _embedded?: { "wp:featuredmedia"?: WpEmbeddedMedia[] };
}

function featuredImageUrl(post: WpRawPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.large?.source_url
    ?? media.media_details?.sizes?.full?.source_url
    ?? media.source_url
    ?? null;
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) throw createError({ statusCode: 400, message: "slug is required" });

  const user = process.env.WP_BASIC_USER;
  const pass = process.env.WP_BASIC_PASS;

  const headers: Record<string, string> = {};
  if (user && pass) {
    headers["Authorization"] = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  }

  const posts = await $fetch<WpRawPost[]>("https://wp.movee.jp/wp-json/wp/v2/posts", {
    headers,
    query: { slug, _embed: "wp:featuredmedia", _fields: "id,title,content,excerpt,date,slug,acf,_links,_embedded" },
  });

  if (!posts.length) throw createError({ statusCode: 404, message: "記事が見つかりません" });

  const p = posts[0];
  return {
    id: p.id,
    slug: p.slug,
    date: p.date,
    title: p.title,
    content: p.content,
    excerpt: p.excerpt,
    featuredImage: p.acf?.thumbnail_url ?? featuredImageUrl(p),
    eventDate: p.acf?.event_date ?? null,
    eventEnd: p.acf?.event_end ?? null,
  };
});
