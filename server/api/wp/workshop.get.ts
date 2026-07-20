interface WpRawPost {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string };
  acf?: { event_date?: string; event_end?: string; thumbnail_url?: string };
}

export default defineEventHandler(async () => {
  const user     = process.env.WP_BASIC_USER;
  const pass     = process.env.WP_BASIC_PASS;
  const category = process.env.WORKSHOP_CATEGORY;

  const headers: Record<string, string> = {};
  if (user && pass) headers["Authorization"] = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

  const posts = await $fetch<WpRawPost[]>("https://wp.movee.jp/wp-json/wp/v2/posts", {
    headers,
    query: {
      per_page: 20,
      _fields: "id,title,excerpt,date,slug,acf",
      ...(category ? { categories: category } : {}),
    },
  });

  return posts.map(p => ({
    id: p.id, slug: p.slug, date: p.date,
    title: p.title, excerpt: p.excerpt,
    featuredImage: p.acf?.thumbnail_url ?? null,
    eventDate: p.acf?.event_date ?? null,
    eventEnd: p.acf?.event_end ?? null,
  }));
});
