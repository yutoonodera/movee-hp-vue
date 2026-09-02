<script setup lang="ts">
interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featuredImage: string | null;
  customer: string | null;
  location: string | null;
}

interface Achievement {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  customer: string | null;
  location: string | null;
  featuredImage: string | null;
}

const route = useRoute();
const { data: post, error } = await useFetch<WpPost>(
  `/api/wp/post/${route.params.slug}`,
);
const { data: allAchievements } = await useFetch<Achievement[]>(
  "/api/wp/achievements",
);
const others = computed(
  () =>
    allAchievements.value?.filter((a) => a.slug !== route.params.slug) ?? [],
);

useHead(() => ({
  title: post.value
    ? `${post.value.title.rendered} — movee 実績`
    : "実績 — movee",
}));

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();
const encodeImageUrl = (url: string) => {
  try {
    return encodeURI(decodeURIComponent(url));
  } catch {
    return encodeURI(url);
  }
};

if (post.value) {
  const desc = stripHtml(post.value.excerpt.rendered).slice(0, 120);
  const toAbsolute = (url: string) =>
    url.startsWith("/") ? `https://www.movee.jp${url}` : url;
  const image = post.value.featuredImage
    ? encodeImageUrl(toAbsolute(post.value.featuredImage))
    : "https://www.movee.jp/og-default.png";
  useSeoMeta({
    ogTitle: post.value.title.rendered,
    ogDescription: desc,
    ogType: "article",
    ogImage: image,
    twitterCard: "summary_large_image",
    twitterTitle: post.value.title.rendered,
    twitterDescription: desc,
    twitterImage: image,
  });
}

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
        <NuxtLink to="/achievements">実績一覧</NuxtLink>
        <a href="/#contact">お問い合わせ</a>
      </nav>
    </header>

    <div v-if="error" class="error-wrap">
      <p>記事が見つかりませんでした。</p>
      <NuxtLink to="/achievements">実績一覧へ戻る</NuxtLink>
    </div>

    <main v-else-if="post" class="main">
      <div class="inner">
        <NuxtLink to="/achievements" class="breadcrumb">← 実績一覧</NuxtLink>

        <div v-if="post.featuredImage" class="hero-img-wrap">
          <img
            :src="post.featuredImage"
            :alt="post.title.rendered"
            class="hero-img"
          />
        </div>

        <time class="date">{{ formatDate(post.date) }}</time>
        <h1 class="title" v-html="post.title.rendered" />

        <div v-if="post.customer || post.location" class="meta-box">
          <div v-if="post.customer" class="meta-item">
            <p class="meta-label">お客様</p>
            <p class="meta-value">{{ post.customer }}</p>
          </div>
          <div v-if="post.location" class="meta-item">
            <p class="meta-label">お客様所在地</p>
            <p class="meta-value">{{ post.location }}</p>
          </div>
        </div>

        <div class="content wp-content" v-html="post.content.rendered" />
      </div>
    </main>

    <section v-if="others.length" class="others">
      <div class="others-inner">
        <h2 class="others-title">他の実績</h2>
        <div class="others-grid">
          <NuxtLink
            v-for="item in others"
            :key="item.id"
            :to="`/achievements/${item.slug}`"
            class="other-card"
          >
            <h3 class="other-name" v-html="item.title.rendered" />
            <div v-if="item.customer || item.location" class="other-meta">
              <div v-if="item.customer">
                <p class="om-label">お客様</p>
                <p class="om-value">{{ item.customer }}</p>
              </div>
              <div v-if="item.location">
                <p class="om-label">お客様所在地</p>
                <p class="om-value">{{ item.location }}</p>
              </div>
            </div>
            <div class="other-excerpt" v-html="item.excerpt.rendered" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="cta-inner">
        <p class="cta-text">
          業務に課題を抱えている個人事業主様や企業様はお気軽にご連絡ください。<br />最適なシステム導入・定着支援をご提案いたします。
        </p>
        <a href="/#contact" class="cta-btn">無料で相談する</a>
      </div>
    </section>

    <footer class="footer">
      <NuxtLink to="/achievements" class="back">← 実績一覧へ戻る</NuxtLink>
      <p class="copy">© 2024 株式会社movee</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.page {
  font-family: -apple-system, "Hiragino Sans", sans-serif;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-logo {
  font-weight: 900;
  font-size: 18px;
  color: #0f172a;
  text-decoration: none;
  letter-spacing: -0.04em;
}
.nav-links {
  display: flex;
  gap: 20px;
}
.nav-links a {
  font-size: 13px;
  color: #475569;
  text-decoration: none;
}
.nav-links a:hover {
  color: #0f172a;
}
.error-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 20px;
  font-size: 14px;
  color: #64748b;
}
.error-wrap a {
  color: #3b82f6;
  text-decoration: none;
}
.main {
  flex: 1;
  padding: 48px 48px 80px;
}
.inner {
  max-width: 720px;
  margin: 0 auto;
}
.breadcrumb {
  display: inline-block;
  font-size: 12px;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 28px;
  font-family: ui-monospace, monospace;
}
.breadcrumb:hover {
  color: #0f172a;
}
.hero-img-wrap {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 28px;
  background: #f1f5f9;
}
.hero-img {
  width: 100%;
  height: auto;
  display: block;
}
.date {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
  margin-bottom: 12px;
}
.title {
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.3;
  margin-bottom: 32px;
}
.meta-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 32px;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.meta-label {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.04em;
}
.meta-value {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.wp-content :deep(p) {
  font-size: 16px;
  line-height: 1.9;
  color: #334155;
  margin-bottom: 20px;
}
.wp-content :deep(h2) {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 40px 0 16px;
}
.wp-content :deep(h3) {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 32px 0 12px;
}
.wp-content :deep(ul) {
  list-style-type: disc;
  padding-left: 24px;
  margin-bottom: 20px;
}
.wp-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 24px;
  margin-bottom: 20px;
}
.wp-content :deep(li) {
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
  margin-bottom: 4px;
}
.wp-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 24px 0;
}
.wp-content :deep(a) {
  color: #3b82f6;
}
.wp-content :deep(blockquote) {
  border-left: 3px solid #e2e8f0;
  padding-left: 16px;
  color: #64748b;
  margin: 24px 0;
}
.wp-content :deep(pre),
.wp-content :deep(code) {
  font-family: ui-monospace, monospace;
  font-size: 14px;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 2px 6px;
}
.wp-content :deep(pre) {
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 20px;
}
.wp-content :deep(pre code) {
  background: none;
  padding: 0;
}
.footer {
  padding: 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e2e8f0;
}
.back {
  font-size: 12px;
  color: #64748b;
  text-decoration: none;
}
.back:hover {
  color: #0f172a;
}
.copy {
  font-size: 12px;
  color: #94a3b8;
}
.others {
  padding: 48px 48px 64px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
.others-inner {
  max-width: 960px;
  margin: 0 auto;
}
.others-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}
.others-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.other-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.other-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.other-name {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #111827;
}
.other-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}
.other-excerpt :deep(p) {
  margin: 0;
}
.other-meta {
  display: grid;
  gap: 12px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
}
.om-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}
.om-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-top: 4px;
}
.cta-band {
  background: #EFF6FF;
  border-top: 1px solid #BFDBFE;
  padding: 56px 48px;
  text-align: center;
}
.cta-inner {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.cta-text {
  font-size: 17px;
  line-height: 1.8;
  color: #1E3A5F;
}
.cta-btn {
  display: inline-block;
  background: #3b82f6;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
}
.cta-btn:hover {
  background: #2563eb;
}
@media (max-width: 640px) {
  .nav,
  .main,
  .footer,
  .others,
  .cta-band {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
