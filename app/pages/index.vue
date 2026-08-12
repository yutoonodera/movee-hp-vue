<script setup lang="ts">
useHead({ title: "株式会社movee — 1人法人・個人事業主のDX支援" });
useSeoMeta({
  ogTitle: "株式会社movee",
  ogDescription:
    "ツール選びから、ホームページ、データ分析まで。1人法人・個人事業主のIT周りをまるごと支える会社です。福岡市を拠点に活動しています。",
  ogType: "website",
  ogImage: "https://www.movee.jp/og-default.png",
  twitterCard: "summary_large_image",
  twitterTitle: "株式会社movee",
  twitterDescription:
    "ツール選びから、ホームページ、データ分析まで。1人法人・個人事業主のIT周りをまるごと支える会社です。",
  twitterImage: "https://www.movee.jp/og-default.png",
});

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featuredImage: string | null;
  eventDate?: string | null;
  eventEnd?: string | null;
}

const { data: news } = await useFetch<WpPost[]>("/api/wp/news");
const { data: workshops } = await useFetch<WpPost[]>("/api/wp/workshop");
const { data: posts } = await useFetch<WpPost[]>("/api/wp/posts", {
  query: { categories_exclude: 3 },
});

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
    <!-- ナビ -->
    <header class="nav">
      <span class="nav-logo">movee</span>
      <nav class="nav-links">
        <NuxtLink to="/achievements">実績</NuxtLink>
        <NuxtLink to="/blog">ブログ</NuxtLink>
        <a href="#contact">お問い合わせ</a>
      </nav>
    </header>

    <!-- ダークゾーン（クイックスキャン + 会社紹介 + ツール） -->
    <div class="dark-zone">
      <!-- ヒーロー -->
      <section class="hero">
        <div class="hero-inner">
          <p class="hero-kicker">DIGITAL TRANSFORMATION</p>
          <h1 class="hero-title">
            1人法人・個人事業主の<br />DXをまるごと支えます
          </h1>
          <p class="hero-lead">
            ツール選びから、ホームページ、データ分析まで。<br class="br-pc" />
            社内にIT担当がいなくても、事業を前に動かせる仕組みを整えます。
          </p>
          <div class="hero-actions">
            <a href="#contact" class="hero-cta">相談してみる</a>
            <a href="#services" class="hero-sub">サービスを見る →</a>
          </div>
        </div>
      </section>
    </div>
    <!-- /dark-zone -->

    <!-- 事業内容 -->
    <section id="services" class="band">
      <div class="inner">
        <p class="label">SERVICES</p>
        <h2 class="heading">事業内容</h2>
        <p class="services-target">1人法人・個人事業主向け</p>
        <div class="service-grid">
          <div class="service-card">
            <div class="service-bar" style="background: #0891b2"></div>
            <h3 class="service-title">顧客関係管理システム（CRM）導入・定着支援</h3>
            <p class="service-body">
              G2・Capteraだけで1,000種類以上が登録されるほど、世界中にCRMがあります。国内でも様々な選択肢があります。その中で御社要件に最適なCRMを選定し、導入いたします。また必要に応じて定着支援も行います。
            </p>
          </div>
          <div class="service-card">
            <div class="service-bar" style="background: #1D4ED8"></div>
            <h3 class="service-title">システム導入・定着支援</h3>
            <p class="service-body">
              社内にIT担当がいない1人法人・個人事業主のために、業務課題をヒアリングして、実際に使いこなせるツールを選びます。導入後も定着するまでサポートします。候補のリストアップまでは無料です。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- システム導入・定着の流れ -->
    <section class="band band-alt">
      <div class="inner">
        <p class="label">HOW IT WORKS</p>
        <h2 class="heading">システム導入・定着の流れ</h2>
        <div class="flow-list">
          <div class="flow-item">
            <div class="flow-left">
              <span class="flow-num">01</span>
              <div class="flow-line"></div>
            </div>
            <div class="flow-right">
              <p class="flow-title">お問い合わせ</p>
              <p class="flow-desc">
                現在の業務課題や使っているツールを教えてください。
              </p>
              <span class="flow-badge free">無料</span>
            </div>
          </div>
          <div class="flow-item">
            <div class="flow-left">
              <span class="flow-num">02</span>
              <div class="flow-line"></div>
            </div>
            <div class="flow-right">
              <p class="flow-title">候補ツールをリストアップ</p>
              <p class="flow-desc">
                課題に合いそうなソフトウェアの候補案をまとめてお渡しします。
              </p>
              <span class="flow-badge free">無料</span>
            </div>
          </div>
          <div class="flow-divider">
            <span class="flow-divider-label">ここまで無料</span>
          </div>
          <div class="flow-item">
            <div class="flow-left">
              <span class="flow-num">03</span>
              <div class="flow-line"></div>
            </div>
            <div class="flow-right">
              <p class="flow-title">設定・導入手順書の作成 → 導入</p>
              <p class="flow-desc">
                選定したツールの設定、導入手順書の作成、実際の導入まで対応します。
              </p>
              <span class="flow-badge paid">¥50,000（税抜）</span>
            </div>
          </div>
          <div class="flow-item flow-item-last">
            <div class="flow-left">
              <span class="flow-num">04</span>
            </div>
            <div class="flow-right">
              <p class="flow-title">定着支援</p>
              <p class="flow-desc">
                使いこなせるまで継続サポートします。いつでも解約できます。
              </p>
              <span class="flow-badge paid">¥10,000 / 月（税抜）</span>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- データ活用事例 -->
    <section v-if="posts?.length" class="band">
      <div class="inner">
        <div class="section-header">
          <div>
            <p class="label">CASE STUDIES</p>
            <h2 class="heading" style="margin-bottom: 0">データ活用事例</h2>
          </div>
          <NuxtLink to="/blog" class="section-more">すべて見る →</NuxtLink>
        </div>
        <div class="posts-grid" style="margin-top: 40px">
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

    <!-- 勉強会 -->
    <section v-if="workshops?.length" class="band">
      <div class="inner">
        <div class="section-header">
          <div>
            <p class="label">WORKSHOP</p>
            <h2 class="heading" style="margin-bottom: 0">勉強会</h2>
          </div>
          <NuxtLink to="/workshop" class="section-more">すべて見る →</NuxtLink>
        </div>
        <div class="posts-grid" style="margin-top: 40px">
          <NuxtLink
            v-for="ws in workshops"
            :key="ws.id"
            :to="`/workshop/${ws.slug}`"
            class="post-card workshop-card"
          >
            <div v-if="ws.featuredImage" class="post-thumb">
              <img
                :src="ws.featuredImage"
                :alt="ws.title.rendered"
                loading="lazy"
              />
            </div>
            <div class="ws-no-thumb" v-else></div>
            <div class="post-body">
              <div class="post-date ws-date">
                <template v-if="ws.eventDate">
                  <span>{{ formatEventDateOnly(ws.eventDate) }}</span>
                  <span
                    v-if="formatEventTimeRange(ws.eventDate, ws.eventEnd)"
                    class="ws-time"
                    >{{ formatEventTimeRange(ws.eventDate, ws.eventEnd) }}</span
                  >
                </template>
                <span v-else>{{ formatDate(ws.date) }}</span>
              </div>
              <p class="post-title" v-html="ws.title.rendered"></p>
              <p class="post-excerpt" v-html="ws.excerpt.rendered"></p>
              <span class="ws-cta">詳細・申し込み →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>


    <!-- 会社概要 -->
    <section class="band" id="contact">
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
            <dd>
              <a href="mailto:info@movee.jp" class="link">info@movee.jp</a>
            </dd>
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
/* ── トークン ──────────────────────────────────── */
.page {
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --ink: #0f172a;
  --ink-2: #475569;
  --ink-3: #94a3b8;
  --accent: #1d4ed8;
  --line: #e2e8f0;

  background: var(--bg);
  color: var(--ink);
  font-family:
    -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── ナビ ─────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #070b11;
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #f1f5f9;
  font-family: ui-monospace, monospace;
}
.nav-links {
  display: flex;
  gap: 28px;
}
.nav-links a {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.nav-links a:hover {
  color: #f1f5f9;
}

/* ── ダークゾーン（ヒーロー + ツール） ─────────── */
.dark-zone {
  background: #070b11;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.04) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
}

/* ── ヒーロー ───────────────────────────────────── */
.hero {
  padding: 80px 48px 88px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.hero-inner {
  max-width: 720px;
  margin: 0 auto;
}

.hero-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #334155;
  font-family: ui-monospace, monospace;
  margin: 0 0 20px;
}

.hero-title {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
  margin: 0 0 24px;
  text-wrap: balance;
  color: #f1f5f9;
}

.hero-lead {
  font-size: 16px;
  line-height: 2;
  color: #64748b;
  margin: 0 0 36px;
  max-width: 560px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.hero-cta {
  display: inline-block;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  padding: 13px 28px;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.15s;
}
.hero-cta:hover {
  background: #e2e8f0;
}

.hero-sub {
  font-size: 13px;
  color: #475569;
  text-decoration: none;
  font-family: ui-monospace, monospace;
  transition: color 0.15s;
}
.hero-sub:hover {
  color: #94a3b8;
}

.br-pc {
  display: inline;
}
@media (max-width: 520px) {
  .br-pc {
    display: none;
  }
  .hero {
    padding: 56px 24px 64px;
  }
}

/* ── クイックスキャン ──────────────────────────── */
.quick-scan {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  padding: 20px 24px 16px;
  max-width: 600px;
}

.scan-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.scan-tab {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: ui-monospace, monospace;
}
.scan-tab:hover {
  color: #f1f5f9;
  border-color: rgba(255, 255, 255, 0.3);
}
.scan-tab.active {
  background: color-mix(in srgb, var(--tc) 15%, transparent);
  border-color: var(--tc);
  color: var(--tc);
}

/* ── ツールカードグリッド ──────────────────────── */
.tgrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 28px;
}
@media (max-width: 640px) {
  .tgrid {
    grid-template-columns: 1fr;
  }
}

/* ダークゾーン内のカード（現在は未使用、念のため残す） */
.dark-zone .tcard {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}
.dark-zone .tcard-title {
  color: #f1f5f9;
}
.dark-zone .tcard-desc {
  color: #64748b;
}
.dark-zone .tcard-cta {
  color: #94a3b8;
}
.dark-zone .tcard:hover {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px var(--tc);
}

/* ライトゾーン内のカード（tools section） */
.tcard {
  display: block;
  text-decoration: none;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
}
.tcard:hover {
  border-color: var(--tc);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px var(--tc);
  transform: translateY(-2px);
}

.tcard-stripe {
  height: 3px;
}

.tcard-body {
  padding: 24px 24px 20px;
}

.tcard-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: ui-monospace, monospace;
  border: 1px solid;
  padding: 2px 8px;
  border-radius: 3px;
  margin-bottom: 14px;
}

.tcard-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.03em;
  margin: 0 0 10px;
  line-height: 1.25;
}

.tcard-desc {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.75;
  margin: 0 0 20px;
}

.tcard-cta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-3);
  margin: 0;
  transition: color 0.15s;
}
.tcard:hover .tcard-cta {
  color: var(--tc);
}
.tcard-cta .arrow {
  transition: transform 0.15s;
}
.tcard:hover .tcard-cta .arrow {
  transform: translateX(4px);
}

/* featured カード（2列幅） */
.tcard-wide {
  grid-column: span 2;
}
.tcard-featured {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.tcard-featured .tcard-title {
  margin-bottom: 0;
}
.tcard-featured .tcard-desc {
  flex: 1;
  min-width: 200px;
  margin-bottom: 0;
}
.tcard-featured .tcard-cta {
  flex-shrink: 0;
  margin: 0;
}
@media (max-width: 640px) {
  .tcard-wide {
    grid-column: span 1;
  }
  .tcard-featured {
    flex-direction: column;
    align-items: flex-start;
  }
  .tcard-featured .tcard-title {
    margin-bottom: 10px;
  }
  .tcard-featured .tcard-desc {
    min-width: unset;
    flex: none;
    margin-bottom: 0;
  }
  .tcard-featured .tcard-cta {
    margin-top: 16px;
  }
}

/* ── ツールセクション（ライト） ──────────────── */
.band-tools {
  background: var(--bg-alt);
}

.tools-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.tools-sub-light {
  font-size: 12px;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  margin: 0;
}

/* ── 共通バンド ────────────────────────────────── */
.band {
  padding: 72px 48px;
  background: var(--bg);
}
.band-alt {
  background: var(--bg-alt);
}
.inner {
  max-width: 900px;
  margin: 0 auto;
}

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

/* ── 事業内容 ──────────────────────────────────── */
.services-target {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #0891b2;
  background: #ecfeff;
  border: 1px solid #a5f3fc;
  border-radius: 4px;
  padding: 3px 10px;
  margin: -24px 0 28px;
}

.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.service-card-solo {
  max-width: 600px;
}
@media (max-width: 600px) {
  .service-grid {
    grid-template-columns: 1fr;
  }
}

.service-card {
  padding: 32px 28px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
}
.band-alt .service-card {
  background: var(--bg);
}

.service-bar {
  width: 32px;
  height: 3px;
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

/* ── ソフトウェア導入・定着の流れ ───────────────── */
.flow-list {
  display: flex;
  flex-direction: column;
}

.flow-item {
  display: flex;
  gap: 20px;
}

.flow-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
  flex-shrink: 0;
}

.flow-num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  line-height: 1;
  padding-top: 2px;
}

.flow-line {
  width: 1px;
  flex: 1;
  background: var(--line);
  margin: 8px 0;
  min-height: 20px;
}

.flow-right {
  padding-bottom: 28px;
  flex: 1;
}
.flow-item-last .flow-right {
  padding-bottom: 0;
}

.flow-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 4px;
  line-height: 1.3;
}

.flow-desc {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.7;
  margin: 0 0 10px;
}

.flow-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
}
.flow-badge.free {
  background: #dcfce7;
  color: #166534;
}
.flow-badge.paid {
  background: #eff6ff;
  color: #1d4ed8;
}

.flow-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 24px 52px;
}
.flow-divider::before,
.flow-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--line);
}
.flow-divider::before {
  max-width: 20px;
}
.flow-divider-label {
  font-size: 11px;
  font-weight: 700;
  color: #166534;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

/* ── パッケージ ────────────────────────────────── */
.pkg-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 600px) {
  .pkg-grid {
    grid-template-columns: 1fr;
  }
}

.pkg-card {
  display: flex;
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.pkg-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
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

/* ── セクションヘッダー ────────────────────────── */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0;
}
.section-more {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  padding-bottom: 4px;
}
.section-more:hover {
  text-decoration: underline;
}

/* ── 勉強会 ────────────────────────────────────── */
.workshop-card {
  border-color: rgba(29, 78, 216, 0.15);
}
.workshop-card:hover {
  border-color: var(--accent);
}

.workshop-card .ws-date {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  background: #dbeafe;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: inherit;
}
.ws-time {
  font-size: 15px;
}

.ws-no-thumb {
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
}

.ws-cta {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: var(--accent);
  border-radius: 8px;
  padding: 10px 16px;
  margin-top: 12px;
  text-align: center;
  transition: background 0.15s;
}
.workshop-card:hover .ws-cta {
  background: #1e40af;
}

/* ── ニュース ──────────────────────────────────── */
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
}
.news-row:hover .news-title {
  color: var(--accent);
}
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

/* ── ブログ ────────────────────────────────────── */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 700px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}

.post-card {
  display: block;
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg);
  overflow: hidden;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.post-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
}
.post-thumb {
  width: 100%;
  aspect-ratio: 16/9;
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
.post-card:hover .post-thumb img {
  transform: scale(1.03);
}
.post-body {
  padding: 20px;
}
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

/* ── 会社概要 ──────────────────────────────────── */
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
dt {
  color: var(--ink-3);
  font-weight: 500;
}
dd {
  color: var(--ink);
  margin: 0;
}
.link {
  color: var(--accent);
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}

/* ── フッター ──────────────────────────────────── */
.footer {
  border-top: 1px solid var(--line);
  padding: 24px 48px;
  font-size: 14px;
  color: var(--ink-3);
  background: var(--bg);
}

/* ── レスポンシブ ────────────────────────────────── */
@media (max-width: 600px) {
  .nav {
    padding: 16px 20px;
  }
  .scan-hero {
    padding: 56px 20px 40px;
  }
  .tools-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .band {
    padding: 56px 20px;
  }
  .footer {
    padding: 20px;
  }
  .profile-row {
    grid-template-columns: 80px 1fr;
    font-size: 14px;
  }
  .tools-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .scan-row {
    flex-direction: column;
  }
  .scan-btn {
    width: 100%;
  }
}
</style>
