<script setup lang="ts">
useHead({ title: "株式会社movee — ソフトウェア開発・データ活用" });
useSeoMeta({
  ogTitle:            "株式会社movee",
  ogDescription:      "ソフトウェア開発とデータ活用で事業の成長を支える会社です。福岡市を拠点に、Webサービスの開発・データ分析・可視化の支援を行っています。",
  ogType:             "website",
  ogImage:            "https://www.movee.jp/og-default.png",
  twitterCard:        "summary_large_image",
  twitterTitle:       "株式会社movee",
  twitterDescription: "ソフトウェア開発とデータ活用で事業の成長を支える会社です。福岡市を拠点に、Webサービスの開発・データ分析・可視化の支援を行っています。",
  twitterImage:       "https://www.movee.jp/og-default.png",
});

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featuredImage: string | null;
}

const { data: news } = await useFetch<WpPost[]>("/api/wp/news");
const { data: posts } = await useFetch<WpPost[]>("/api/wp/posts", {
  query: { categories_exclude: 3 },
});

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};
</script>

<template>
  <div class="page">

    <!-- ナビ -->
    <header class="nav">
      <span class="nav-logo">movee</span>
      <nav class="nav-links">
        <NuxtLink to="/achievements">実績</NuxtLink>
        <a href="#contact">お問い合わせ</a>
      </nav>
    </header>

    <!-- ヒーロー -->
    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">SOFTWARE DEVELOPMENT &amp; DATA UTILIZATION</p>
        <h1 class="hero-title">ソフトウェアで、<br />データで、課題を解く。</h1>
        <p class="hero-lead">
          ソフトウェア開発とデータ活用で、事業の成長を支える会社です。<br class="br-pc" />
          福岡市を拠点に、Webサービスの開発・データ分析・可視化の支援を行っています。
        </p>
        <div class="hero-actions">
          <NuxtLink to="/achievements" class="btn-primary">実績を見る</NuxtLink>
          <a href="mailto:info@movee.jp" class="btn-ghost">お問い合わせ</a>
        </div>
      </div>
    </section>

    <!-- ニュース -->
    <section v-if="news?.length" class="band">
      <div class="inner">
        <p class="label">NEWS</p>
        <h2 class="heading">ニュース</h2>
        <div class="news-list">
          <NuxtLink
            v-for="item in news"
            :key="item.id"
            :to="`/blog/${item.slug}`"
            class="news-row"
          >
            <p class="news-date">{{ formatDate(item.date) }}</p>
            <p class="news-title" v-html="item.title.rendered"></p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ブログ -->
    <section v-if="posts?.length" class="band band-alt">
      <div class="inner">
        <p class="label">BLOG</p>
        <h2 class="heading">ブログ</h2>
        <div class="posts-grid">
          <NuxtLink
            v-for="post in posts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="post-card"
          >
            <div v-if="post.featuredImage" class="post-thumb">
              <img :src="post.featuredImage" :alt="post.title.rendered" loading="lazy" />
            </div>
            <div class="post-body">
              <p class="post-date">{{ formatDate(post.date) }}</p>
              <p class="post-title" v-html="post.title.rendered"></p>
              <p class="post-excerpt" v-html="post.excerpt.rendered"></p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- パッケージ -->
    <section class="band band-alt">
      <div class="inner">
        <p class="label">PACKAGES</p>
        <h2 class="heading">パッケージサービス</h2>
        <div class="pkg-grid">
          <NuxtLink to="/lp/flexpress" class="pkg-card">
            <div class="pkg-accent" style="background:#4338CA"></div>
            <div class="pkg-body">
              <p class="pkg-name">FlexPress</p>
              <p class="pkg-desc">WordPressはそのままで、フロントエンドをNext.jsに刷新。表示速度・セキュリティ・デザイン自由度をまとめて改善します。</p>
              <span class="pkg-arrow">詳しく見る →</span>
            </div>
          </NuxtLink>
          <NuxtLink to="/lp/flutterflow" class="pkg-card">
            <div class="pkg-accent" style="background:#EA580C"></div>
            <div class="pkg-body">
              <p class="pkg-name">FlutterFlowで爆速スマホアプリ</p>
              <p class="pkg-desc">iOS・Android両対応のスマホアプリを、FlutterFlowを使って短期間・低コストで開発します。</p>
              <span class="pkg-arrow">詳しく見る →</span>
            </div>
          </NuxtLink>
          <NuxtLink to="/lp/saas-starter" class="pkg-card">
            <div class="pkg-accent" style="background:#059669"></div>
            <div class="pkg-body">
              <p class="pkg-name">サブスクスタータープラン</p>
              <p class="pkg-desc">決まった仕様でSaaSを2週間で立ち上げる定額パッケージ。Stripe・Googleログイン・WordPress連携を含みます。</p>
              <span class="pkg-arrow">詳しく見る →</span>
            </div>
          </NuxtLink>
          <NuxtLink to="/lp/content-site" class="pkg-card">
            <div class="pkg-accent" style="background:#166534"></div>
            <div class="pkg-body">
              <p class="pkg-name">育てるホームページ</p>
              <p class="pkg-desc">コンテンツを積み上げる仕組みを最初から備えたWebサイトをまるごと作ります。書けば書くほど育ちます。</p>
              <span class="pkg-arrow">詳しく見る →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 冒頭ツール導線 -->
    <section class="band band-alt tool-strip">
      <div class="inner">
        <p class="label">FREE TOOLS</p>
        <div class="strip-list">
          <NuxtLink to="/lp/wp-hikinou" class="strip-row">
            <span class="strip-accent" style="background:#2563EB"></span>
            <span class="strip-name">Wordpressの非機能診断くん</span>
            <span class="strip-desc">表示速度・セキュリティ・使いやすさをURLを入れるだけで確認</span>
            <span class="strip-arrow">→</span>
          </NuxtLink>
          <NuxtLink to="/lp/ai-hikinou" class="strip-row">
            <span class="strip-accent" style="background:#0891B2"></span>
            <span class="strip-name">AI開発の非機能診断くん</span>
            <span class="strip-desc">Next.js / Nuxt.jsのenv漏洩・セキュリティヘッダー・LCPを診断</span>
            <span class="strip-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 事業内容 -->
    <section class="band">
      <div class="inner">
        <p class="label">SERVICES</p>
        <h2 class="heading">事業内容</h2>
        <div class="service-grid">
          <div class="service-card">
            <p class="service-icon">_</p>
            <h3 class="service-title">ソフトウェア開発</h3>
            <p class="service-body">
              WebサービスやSaaSの企画・開発・運用。Next.js・Nuxt.js・React・TypeScriptを中心としたモダンスタックで、品質と保守性を重視した開発を行います。要件定義から設計・実装まで一貫して対応します。
            </p>
          </div>
          <div class="service-card">
            <p class="service-icon">_</p>
            <h3 class="service-title">データ活用・可視化</h3>
            <p class="service-body">
              地図データ・センサーデータ・業務データを活用した分析とダッシュボード開発。意思決定に直結する形に整理・可視化し、データを「使える資産」にする支援をします。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- プロダクト -->
    <section class="band band-alt">
      <div class="inner">
        <p class="label">PRODUCTS</p>
        <h2 class="heading">プロダクト・無料ツール</h2>
        <div class="tools-grid">
          <NuxtLink to="/lp/wp-hikinou" class="tool-card">
            <div class="tool-top">
              <p class="tool-tag" style="color:#2563EB">無料診断ツール</p>
              <span class="tool-arrow">→</span>
            </div>
            <p class="tool-name">Wordpressの非機能診断くん</p>
            <p class="tool-desc">表示速度・セキュリティ・使いやすさをURLを入れるだけで確認</p>
          </NuxtLink>

          <NuxtLink to="/lp/ai-hikinou" class="tool-card">
            <div class="tool-top">
              <p class="tool-tag" style="color:#0891B2">無料診断ツール</p>
              <span class="tool-arrow">→</span>
            </div>
            <p class="tool-name">AI開発の非機能診断くん</p>
            <p class="tool-desc">Next.js / Nuxt.jsのenv漏洩・セキュリティヘッダー・LCPを診断</p>
          </NuxtLink>

          <a href="https://lp.fumi.lol" target="_blank" rel="noopener noreferrer" class="tool-card">
            <div class="tool-top">
              <p class="tool-tag" style="color:#D97706">β版公開中 · 今なら2ヶ月無料</p>
              <span class="tool-arrow">→</span>
            </div>
            <p class="tool-name">Fumi</p>
            <p class="tool-desc">挨拶文を3分で作る</p>
          </a>
        </div>
      </div>
    </section>


    <!-- 会社概要 -->
    <section class="band band-alt" id="contact">
      <div class="inner">
        <p class="label">COMPANY</p>
        <h2 class="heading">会社概要</h2>
        <dl class="profile">
          <div class="profile-row">
            <dt>会社名</dt>
            <dd>株式会社movee</dd>
          </div>
          <div class="profile-row">
            <dt>所在地</dt>
            <dd>福岡県福岡市中央区天神2丁目3-10 天神パインクレスト716</dd>
          </div>
          <div class="profile-row">
            <dt>代表</dt>
            <dd>小野寺 祐人</dd>
          </div>
          <div class="profile-row">
            <dt>お問い合わせ</dt>
            <dd><a href="mailto:info@movee.jp" class="link">info@movee.jp</a></dd>
          </div>
        </dl>
      </div>
    </section>

    <footer class="footer">
      <p>© 株式会社movee</p>
    </footer>

  </div>
</template>

<style scoped>
/* ── トークン ──────────────────────────────── */
.page {
  --bg:      #FFFFFF;
  --bg-alt:  #F8FAFC;
  --ink:     #0F172A;
  --ink-2:   #475569;
  --ink-3:   #94A3B8;
  --accent:  #1D4ED8;
  --accent-h:#1E40AF;
  --line:    #E2E8F0;

  background: var(--bg);
  color: var(--ink);
  font-family:
    -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}


/* ── ナビ ───────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--ink);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  font-size: 15px;
  color: var(--ink-2);
  text-decoration: none;
  font-weight: 500;
}
.nav-links a:hover { color: var(--accent); }

/* ── ヒーロー ────────────────────────────────── */
.hero {
  padding: 96px 48px 100px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}

.hero-inner {
  max-width: 720px;
}

.kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  margin: 0 0 24px;
}

.hero-title {
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
  margin: 0 0 28px;
  text-wrap: balance;
  color: var(--ink);
}

.hero-lead {
  font-size: 18px;
  line-height: 1.85;
  color: var(--ink-2);
  margin: 0 0 40px;
  max-width: 580px;
}

.br-pc { display: inline; }
@media (max-width: 520px) { .br-pc { display: none; } }

.hero-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 4px;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--accent-h); }

.btn-ghost {
  display: inline-block;
  color: var(--ink-2);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  transition: color 0.15s, border-color 0.15s;
}
.btn-ghost:hover { color: var(--accent); border-color: var(--accent); }

/* ── バンド共通 ──────────────────────────────── */
.band { padding: 72px 48px; background: var(--bg); }
.band-alt { background: var(--bg-alt); }

.inner { max-width: 900px; margin: 0 auto; }

.label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  margin: 0 0 10px;
}

.heading {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 40px;
  color: var(--ink);
}

/* ── 事業内容 ────────────────────────────────── */
.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .service-grid { grid-template-columns: 1fr; }
}

.service-card {
  padding: 32px 28px;
  background: var(--bg);
}
.band-alt .service-card { background: var(--bg); }

.service-icon {
  font-size: 0;
  width: 32px;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
  margin-bottom: 20px;
}

.service-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  color: var(--ink);
}

.service-body {
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-2);
  margin: 0;
}

/* ── ツール ──────────────────────────────────── */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .tools-grid { grid-template-columns: 1fr; }
}

.tool-card {
  display: block;
  text-decoration: none;
  padding: 22px 20px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
a.tool-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29,78,216,0.08);
}

.tool-inactive { cursor: default; opacity: 0.75; }

.tool-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tool-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0;
}

.tool-arrow {
  font-size: 14px;
  color: var(--ink-3);
  transition: color 0.15s, transform 0.15s;
}
a.tool-card:hover .tool-arrow {
  color: var(--accent);
  transform: translateX(3px);
}

.tool-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 6px;
  line-height: 1.4;
}

.tool-desc {
  font-size: 14px;
  color: var(--ink-3);
  margin: 0;
  line-height: 1.6;
}

/* ── 会社概要 ────────────────────────────────── */
.profile {
  border-top: 1px solid var(--line);
  max-width: 600px;
}

.profile-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
  font-size: 16px;
}

dt { color: var(--ink-3); font-weight: 500; }
dd { color: var(--ink); margin: 0; }

.link { color: var(--accent); text-decoration: none; }
.link:hover { text-decoration: underline; }

/* ── パッケージ ──────────────────────────────── */
.pkg-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 600px) { .pkg-grid { grid-template-columns: 1fr; } }

.pkg-card {
  display: flex;
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.pkg-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29,78,216,0.08);
}

.pkg-accent {
  width: 5px;
  flex-shrink: 0;
}

.pkg-body {
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pkg-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.02em;
}

.pkg-desc {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0;
  line-height: 1.7;
  flex: 1;
}

.pkg-arrow {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
  margin-top: 4px;
}

/* ── ニュース ────────────────────────────────── */
.news-list {
  border-top: 1px solid var(--line);
}

.news-row {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: color 0.15s;
}
.news-row:hover .news-title { color: var(--accent); }

.news-date {
  font-size: 12px;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  flex-shrink: 0;
  margin: 0;
}

.news-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  margin: 0;
  line-height: 1.5;
  transition: color 0.15s;
}

.section-lead {
  font-size: 15px;
  color: var(--ink-2);
  line-height: 1.85;
  margin: -24px 0 32px;
  max-width: 640px;
}

/* ── ブログ記事 ──────────────────────────────── */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .posts-grid { grid-template-columns: 1fr; }
}

.post-card {
  display: block;
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-alt);
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.post-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29,78,216,0.08);
}

.post-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--line);
}
.post-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.post-card:hover .post-thumb img { transform: scale(1.03); }

.post-body { padding: 20px; }

.post-date {
  font-size: 11px;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  margin: 0 0 8px;
}

.post-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 8px;
  line-height: 1.5;
}

.post-excerpt {
  font-size: 13px;
  color: var(--ink-3);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── ツールストリップ（リスト型） ─────────────── */
.tool-strip { padding-top: 40px; padding-bottom: 40px; }

.strip-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.strip-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: background 0.15s;
}
.strip-row:hover .strip-name { color: var(--accent); }
.strip-row:hover .strip-arrow { color: var(--accent); transform: translateX(4px); }

.strip-accent {
  width: 4px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.strip-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  flex-shrink: 0;
  min-width: 220px;
  transition: color 0.15s;
}

.strip-desc {
  font-size: 14px;
  color: var(--ink-3);
  flex: 1;
  line-height: 1.5;
}

.strip-arrow {
  font-size: 18px;
  color: var(--ink-3);
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}

@media (max-width: 600px) {
  .strip-name { min-width: unset; font-size: 15px; }
  .strip-desc { display: none; }
}

/* ── フッター ────────────────────────────────── */
.footer {
  border-top: 1px solid var(--line);
  padding: 24px 48px;
  font-size: 14px;
  color: var(--ink-3);
  background: var(--bg);
}

/* ── レスポンシブ ────────────────────────────── */
@media (max-width: 600px) {
  .nav    { padding: 16px 20px; }
  .hero   { padding: 60px 20px 72px; }
  .band   { padding: 56px 20px; }
  .footer { padding: 20px; }
  .profile-row { grid-template-columns: 90px 1fr; }
}
</style>
