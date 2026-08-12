<script setup lang="ts">
useHead({ title: "ブログ — 株式会社movee" });

interface WpPost {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string };
  featuredImage: string | null;
}

const { data: posts, status } = await useFetch<WpPost[]>("/api/wp/posts");

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};
</script>

<template>
  <div class="page">

    <header class="nav">
      <NuxtLink to="/" class="nav-logo">movee</NuxtLink>
      <nav class="nav-links">
        <NuxtLink to="/achievements">実績</NuxtLink>
        <NuxtLink to="/blog">ブログ</NuxtLink>
        <a href="/#contact">お問い合わせ</a>
      </nav>
    </header>

    <main class="main">
      <div class="inner">
        <p class="label">BLOG</p>
        <h1 class="heading">ブログ</h1>

        <div v-if="status === 'pending'" class="empty">読み込み中…</div>
        <div v-else-if="!posts?.length" class="empty">記事がありません。</div>

        <div v-else class="grid">
          <NuxtLink
            v-for="post in posts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="card"
          >
            <div v-if="post.featuredImage" class="card-img-wrap">
              <img :src="post.featuredImage" :alt="post.title.rendered" class="card-img" loading="lazy" />
            </div>
            <div class="card-body">
              <p class="card-date">{{ formatDate(post.date) }}</p>
              <h2 class="card-title" v-html="post.title.rendered" />
              <p class="card-excerpt">{{ stripHtml(post.excerpt.rendered).slice(0, 80) }}{{ stripHtml(post.excerpt.rendered).length > 80 ? '…' : '' }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <footer class="footer">
      <NuxtLink to="/" class="back">← トップへ戻る</NuxtLink>
      <p class="copy">© 2024 株式会社movee</p>
    </footer>

  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.page { font-family: -apple-system, 'Hiragino Sans', sans-serif; background: #F8FAFC; min-height: 100vh; display: flex; flex-direction: column; }

.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 48px; background: #fff;
  border-bottom: 1px solid #E2E8F0;
  position: sticky; top: 0; z-index: 100;
}
.nav-logo { font-weight: 900; font-size: 18px; color: #0F172A; text-decoration: none; letter-spacing: -0.04em; }
.nav-links { display: flex; gap: 24px; }
.nav-links a { font-size: 13px; color: #475569; text-decoration: none; }
.nav-links a:hover { color: #0F172A; }

.main { flex: 1; padding: 64px 48px; }
.inner { max-width: 960px; margin: 0 auto; }

.label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: #94A3B8; font-family: ui-monospace, monospace; margin: 0 0 10px; }
.heading { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: #0F172A; margin: 0 0 40px; }

.empty { font-size: 14px; color: #94A3B8; padding: 40px 0; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 10px;
  text-decoration: none; overflow: hidden; display: flex; flex-direction: column;
  transition: box-shadow 0.15s, transform 0.15s;
}
.card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }

.card-img-wrap { aspect-ratio: 16/9; overflow: hidden; background: #F1F5F9; }
.card-img { width: 100%; height: 100%; object-fit: cover; }

.card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.card-date { font-size: 11px; color: #94A3B8; font-family: ui-monospace, monospace; }
.card-title { font-size: 15px; font-weight: 700; color: #0F172A; line-height: 1.4; }
.card-excerpt { font-size: 13px; color: #64748B; line-height: 1.6; }

.footer {
  padding: 20px 48px; display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid #E2E8F0; background: #fff;
}
.back { font-size: 12px; color: #64748B; text-decoration: none; }
.back:hover { color: #0F172A; }
.copy { font-size: 12px; color: #94A3B8; }

@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } .nav, .main, .footer { padding-left: 20px; padding-right: 20px; } }
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
</style>
