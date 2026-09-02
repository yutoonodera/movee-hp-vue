interface WpMediaSize { source_url: string; }
interface WpEmbeddedMedia {
  source_url: string;
  media_details?: { sizes?: Record<string, WpMediaSize> };
}
interface WpRawPost {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string };
  acf?: { customer?: string; location?: string };
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

export default defineEventHandler(async () => {
  const user     = process.env.WP_BASIC_USER;
  const pass     = process.env.WP_BASIC_PASS;
  const category = process.env.ACHIEVEMENTS_CATEGORY;

  const headers: Record<string, string> = {};
  if (user && pass) headers["Authorization"] = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

  const posts = await $fetch<WpRawPost[]>("https://wp.movee.jp/wp-json/wp/v2/posts", {
    headers,
    query: {
      per_page: 50,
      _embed: "wp:featuredmedia",
      _fields: "id,title,excerpt,date,slug,acf,_links,_embedded",
      ...(category ? { categories: category } : {}),
    },
  });

  return posts.map(p => ({
    id:           p.id,
    slug:         p.slug,
    date:         p.date,
    title:        p.title,
    excerpt:      p.excerpt,
    customer:     p.acf?.customer ?? null,
    location:     p.acf?.location ?? null,
    featuredImage: featuredImageUrl(p)
      ?.replace("https://wp.movee.jp/wp-content/", "/api/wp-media/") ?? null,
  }));
});
