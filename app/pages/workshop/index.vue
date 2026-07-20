<script setup lang="ts">
interface WpPost {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string };
  featuredImage: string | null;
  eventDate?: string | null;
  eventEnd?: string | null;
}

const { data: posts, error } = await useFetch<WpPost[]>("/api/wp/workshop");

useHead({ title: "勉強会 — movee" });
useSeoMeta({
  ogTitle: "勉強会 — movee",
  ogDescription: "moveeが開催するウェブ・デジタルマーケティング勉強会の一覧です。",
  ogType: "website",
});

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const formatEventDate = (dt: string) => {
  const [datePart, timePart] = dt.replace("T", " ").split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const day = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const base = `${y}年${m}月${d}日（${day}）`;
  if (!timePart || timePart === "00:00") return base;
  const [h, min] = timePart.split(":");
  return `${base} ${parseInt(h)}:${min}`;
};
const formatEventDateOnly = (dt: string) => {
  const [datePart] = dt.replace("T", " ").split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const day = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${y}年${m}月${d}日（${day}）`;
};
const formatEventTimeRange = (dt: string, end?: string | null) => {
  const timePart = dt.replace("T", " ").split(" ")[1];
  if (!timePart || timePart === "00:00") return "";
  const [h, min] = timePart.split(":");
  const start = `${parseInt(h)}:${min}`;
  return end ? `${start}〜${end.slice(0, 5)}` : start;
};
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-back">← movee</NuxtLink>
    </header>

    <div class="hero">
      <p class="hero-label">WORKSHOP</p>
      <h1 class="hero-title">勉強会</h1>
      <p class="hero-desc">ウェブ制作・デジタルマーケティングに関する勉強会を開催しています。<br>参加をご希望の方は各ページからお申し込みください。</p>
    </div>

    <main class="main">
      <div v-if="error" class="empty">
        <p>現在、開催予定の勉強会はありません。</p>
        <NuxtLink to="/">トップへ戻る</NuxtLink>
      </div>
      <div v-else-if="!posts?.length" class="empty">
        <p>現在、開催予定の勉強会はありません。</p>
        <NuxtLink to="/">トップへ戻る</NuxtLink>
      </div>
      <div v-else class="grid">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/workshop/${post.slug}`"
          class="card"
        >
          <div v-if="post.featuredImage" class="card-thumb">
            <img :src="post.featuredImage" :alt="post.title.rendered" />
          </div>
          <div class="card-no-thumb" v-else></div>
          <div class="card-body">
            <div class="card-date">
              <template v-if="post.eventDate">
                <span>{{ formatEventDateOnly(post.eventDate) }}</span>
                <span v-if="formatEventTimeRange(post.eventDate, post.eventEnd)" class="card-time">{{ formatEventTimeRange(post.eventDate, post.eventEnd) }}</span>
              </template>
              <span v-else>{{ formatDate(post.date) }}</span>
            </div>
            <h2 class="card-title" v-html="post.title.rendered"></h2>
            <p class="card-excerpt">{{ stripHtml(post.excerpt.rendered).slice(0, 100) }}</p>
            <span class="card-cta">詳細・申し込み →</span>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  --bg:     #FFFFFF;
  --ink:    #0F172A;
  --ink-2:  #475569;
  --ink-3:  #94A3B8;
  --accent: #1D4ED8;
  --line:   #E2E8F0;
  --bg-hero:#F0F7FF;

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.nav {
  padding: 18px 48px;
  border-bottom: 1px solid var(--line);
}
.nav-back {
  font-size: 14px; color: var(--ink-2); text-decoration: none; font-weight: 500;
}
.nav-back:hover { color: var(--accent); }

.hero {
  background: var(--bg-hero);
  padding: 72px 48px 64px;
  text-align: center;
}
.hero-label {
  margin: 0 0 12px;
  font-size: 11px; font-family: ui-monospace, monospace;
  letter-spacing: .12em; color: var(--accent); text-transform: uppercase;
}
.hero-title {
  margin: 0 0 16px;
  font-size: clamp(36px, 6vw, 56px); font-weight: 900;
  letter-spacing: -0.04em; color: var(--ink); line-height: 1.1;
}
.hero-desc {
  margin: 0; font-size: 15px; line-height: 1.8; color: var(--ink-2);
  text-wrap: balance;
}

.main {
  max-width: 960px;
  margin: 0 auto;
  padding: 64px 48px 96px;
}

.empty {
  text-align: center; padding: 64px 0; color: var(--ink-2);
}
.empty a { color: var(--accent); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.card {
  display: flex; flex-direction: column;
  background: var(--bg); border: 1px solid var(--line);
  border-radius: 12px; overflow: hidden;
  text-decoration: none; color: inherit;
  transition: box-shadow .2s, transform .2s;
}
.card:hover {
  box-shadow: 0 8px 32px rgba(29,78,216,.12);
  transform: translateY(-2px);
}

.card-thumb {
  aspect-ratio: 16 / 9; overflow: hidden;
  background: #F1F5F9;
}
.card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-no-thumb {
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%);
}

.card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.card-date {
  font-size: 13px; font-weight: 700; color: var(--accent);
  background: var(--accent-light); border-radius: 6px;
  padding: 8px 12px; margin: 0; display: flex;
  flex-direction: column; gap: 2px;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
}
.card-time {
  font-size: 15px; letter-spacing: 0.01em;
}
.card-title {
  font-size: 17px; font-weight: 700; margin: 0;
  letter-spacing: -0.02em; line-height: 1.45;
  color: var(--ink);
}
.card-excerpt {
  font-size: 13px; color: var(--ink-2); line-height: 1.7;
  margin: 0; flex: 1;
}
.card-cta {
  font-size: 13px; font-weight: 700; color: #fff;
  background: var(--accent); border-radius: 8px;
  padding: 10px 16px; margin-top: 12px; display: block;
  text-align: center; transition: background .15s;
}
.card:hover .card-cta { background: #1e40af; }

@media (max-width: 640px) {
  .nav  { padding: 14px 20px; }
  .hero { padding: 48px 20px 40px; }
  .main { padding: 40px 20px 72px; }
  .grid { grid-template-columns: 1fr; }
}
</style>
