<script setup lang="ts">
interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featuredImage: string | null;
}

const route = useRoute();
const { data: post, error } = await useFetch<WpPost>(`/api/wp/post/${route.params.slug}`);

useHead(() => ({
  title: post.value ? `${post.value.title.rendered} — movee` : "記事 — movee",
}));

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-back">← movee</NuxtLink>
    </header>

    <div v-if="error" class="error-state">
      <p>記事が見つかりませんでした。</p>
      <NuxtLink to="/">トップへ戻る</NuxtLink>
    </div>

    <article v-else-if="post" class="article">
      <div v-if="post.featuredImage" class="article-hero">
        <img :src="post.featuredImage" :alt="post.title.rendered" />
      </div>
      <div class="article-header">
        <p class="article-date">{{ formatDate(post.date) }}</p>
        <h1 class="article-title" v-html="post.title.rendered"></h1>
      </div>
      <div class="article-body" v-html="post.content.rendered"></div>
    </article>
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

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  .page {
    --bg:    #0F172A;
    --ink:   #F1F5F9;
    --ink-2: #94A3B8;
    --ink-3: #475569;
    --line:  #1E293B;
  }
}

.nav {
  padding: 18px 48px;
  border-bottom: 1px solid var(--line);
}

.nav-back {
  font-size: 14px;
  color: var(--ink-2);
  text-decoration: none;
  font-weight: 500;
}
.nav-back:hover { color: var(--accent); }

.article {
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 48px 96px;
}

.article-hero {
  margin-bottom: 40px;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}
.article-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--line);
}

.article-date {
  font-size: 12px;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  margin: 0 0 16px;
}

.article-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.3;
  margin: 0;
  text-wrap: balance;
}

/* WordPressのコンテンツスタイル */
.article-body :deep(p)          { margin: 0 0 1.5em; font-size: 16px; line-height: 1.85; color: var(--ink-2); }
.article-body :deep(h2)         { font-size: 22px; font-weight: 700; margin: 2em 0 0.75em; letter-spacing: -0.02em; color: var(--ink); }
.article-body :deep(h3)         { font-size: 18px; font-weight: 700; margin: 1.75em 0 0.5em; color: var(--ink); }
.article-body :deep(ul)         { padding-left: 1.5em; margin: 0 0 1.5em; }
.article-body :deep(li)         { margin-bottom: 0.4em; font-size: 16px; color: var(--ink-2); }
.article-body :deep(a)          { color: var(--accent); text-decoration: underline; }
.article-body :deep(img)        { max-width: 100%; border-radius: 6px; margin: 1em 0; }
.article-body :deep(blockquote) { border-left: 3px solid var(--line); padding-left: 1em; margin: 1.5em 0; color: var(--ink-3); }
.article-body :deep(pre)        { background: #0F172A; color: #e2e8f0; padding: 1em 1.25em; border-radius: 6px; overflow-x: auto; font-size: 14px; line-height: 1.6; }
.article-body :deep(code)       { font-family: ui-monospace, monospace; font-size: 0.9em; background: var(--line); padding: 0.15em 0.4em; border-radius: 3px; }
.article-body :deep(pre code)   { background: none; padding: 0; }

.error-state {
  text-align: center;
  padding: 96px 24px;
  color: var(--ink-2);
}
.error-state a { color: var(--accent); }

@media (max-width: 600px) {
  .nav     { padding: 14px 20px; }
  .article { padding: 40px 20px 72px; }
}
</style>
