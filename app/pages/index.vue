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

const { data: news }  = await useFetch<WpPost[]>("/api/wp/news");
const { data: posts } = await useFetch<WpPost[]>("/api/wp/posts", {
  query: { categories_exclude: 3 },
});

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const TOOLS = [
  {
    id: "ogp", label: "OGPプレビュー", toolPath: "/lp/ogp-preview", color: "#8B5CF6",
    desc: "TwitterやLINEでシェアしたときのカード表示を確認。OGPタグの設定漏れもチェックできます。",
    needsEmail: false, needsBase: false,
  },
  {
    id: "wp",  label: "WordPress診断",   toolPath: "/wp-hikinou",   color: "#3B82F6",
    desc: "表示速度・セキュリティ・使いやすさをまとめて診断。PageSpeed・ヘッダー設定・SSLを一括チェック。",
    needsEmail: true,  needsBase: false,
  },
  {
    id: "ai",  label: "AI開発診断",       toolPath: "/ai-hikinou",   color: "#06B6D4",
    desc: "Next.js/Nuxtのenv漏洩・セキュリティヘッダー・LCP・API露出状況をまとめて診断します。",
    needsEmail: true,  needsBase: false,
  },
  {
    id: "api", label: "APIセキュリティ", toolPath: "/api-security", color: "#EF4444",
    desc: "Swagger自動探索・GraphQLイントロスペクション・ソースマップ漏洩・エンドポイント認証を確認。",
    needsEmail: true,  needsBase: true,
  },
] as const;

type ToolId = typeof TOOLS[number]["id"];

const selectedTool = ref<ToolId>("ogp");
const scanUrl      = ref("");
const scanEmail    = ref("");
const scanBase     = ref("/api");

const currentTool = computed(() => TOOLS.find(t => t.id === selectedTool.value)!);

function startScan() {
  const tool = currentTool.value;
  const query: Record<string, string> = {};
  if (scanUrl.value) query.url = scanUrl.value;
  if (tool.needsEmail && scanEmail.value) query.email = scanEmail.value;
  if (tool.needsBase && scanBase.value) query.basePath = scanBase.value;
  navigateTo({ path: tool.toolPath, query });
}
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

    <!-- ダークゾーン（クイックスキャン + 会社紹介 + ツール） -->
    <div class="dark-zone">

      <!-- クイックスキャン（ヒーロー） -->
      <section class="scan-hero">
        <div class="scan-hero-inner">
          <p class="kicker">FREE TOOLS · 登録不要</p>
          <h1 class="scan-title">あなたのサイト、<br />本当に大丈夫ですか？</h1>
          <div class="quick-scan">
            <!-- ツール選択タブ -->
            <div class="scan-tabs">
              <button
                v-for="t in TOOLS"
                :key="t.id"
                :class="['scan-tab', { active: selectedTool === t.id }]"
                :style="selectedTool === t.id ? `--tc:${t.color}` : ''"
                @click="selectedTool = t.id"
              >{{ t.label }}</button>
            </div>

            <!-- ツールの説明（選択中のものだけ表示） -->
            <p class="scan-tool-desc">{{ currentTool.desc }}</p>

            <!-- 入力フォーム -->
            <div class="scan-fields">
              <input
                v-model="scanUrl"
                type="url"
                placeholder="https://example.com"
                class="scan-input"
                @keydown.enter="startScan"
              />
              <input
                v-if="currentTool.needsBase"
                v-model="scanBase"
                type="text"
                placeholder="APIベースパス（例: /api）"
                class="scan-input"
              />
              <input
                v-if="currentTool.needsEmail"
                v-model="scanEmail"
                type="email"
                placeholder="結果をメールで受け取る"
                class="scan-input"
              />
            </div>

            <button class="scan-btn" @click="startScan">
              {{ currentTool.id === 'ogp' ? 'プレビュースタート' : '診断スタート' }}
            </button>
          </div>
        </div>
      </section>

      <!-- 会社コピー -->
      <section class="company-intro">
        <div class="ci-inner">
          <p class="ci-kicker">SOFTWARE DEVELOPMENT &amp; DATA UTILIZATION</p>
          <h2 class="ci-title">ソフトウェアで、<br />データで、課題を解く。</h2>
          <p class="ci-lead">
            ソフトウェア開発とデータ活用で、事業の成長を支える会社です。<br class="br-pc" />
            福岡市を拠点に、Webサービスの開発・データ分析・可視化の支援を行っています。
          </p>
        </div>
      </section>

    </div><!-- /dark-zone -->

    <!-- 事業内容 -->
    <section class="band">
      <div class="inner">
        <p class="label">SERVICES</p>
        <h2 class="heading">事業内容</h2>
        <div class="service-grid">
          <div class="service-card">
            <div class="service-bar" style="background:#1D4ED8"></div>
            <h3 class="service-title">ソフトウェア開発</h3>
            <p class="service-body">WebサービスやSaaSの企画・開発・運用。Next.js・Nuxt.js・React・TypeScriptを中心としたモダンスタックで、品質と保守性を重視した開発を行います。要件定義から設計・実装まで一貫して対応します。</p>
          </div>
          <div class="service-card">
            <div class="service-bar" style="background:#0891B2"></div>
            <h3 class="service-title">データ活用・可視化</h3>
            <p class="service-body">地図データ・センサーデータ・業務データを活用した分析とダッシュボード開発。意思決定に直結する形に整理・可視化し、データを「使える資産」にする支援をします。</p>
          </div>
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

    <!-- 無料ツール -->
    <section id="tools" class="band band-tools">
      <div class="inner">
        <div class="tools-header">
          <div>
            <p class="label">FREE TOOLS</p>
            <h2 class="heading" style="margin-bottom:0">無料で使える診断ツール</h2>
          </div>
          <p class="tools-sub-light">登録不要・クレジットカード不要</p>
        </div>
        <div class="tgrid">

          <NuxtLink to="/lp/ogp-preview" class="tcard" style="--tc:#8B5CF6">
            <div class="tcard-stripe" style="background:#8B5CF6"></div>
            <div class="tcard-body">
              <span class="tcard-badge" style="color:#8B5CF6; border-color:rgba(139,92,246,0.35)">OGP / SNS</span>
              <p class="tcard-title">SNSカードプレビュー</p>
              <p class="tcard-desc">URLを入力するだけでTwitter・Facebook・LINEのカード表示を確認。OGPタグの設定漏れもすぐわかります。</p>
              <p class="tcard-cta">プレビューする <span class="arrow">→</span></p>
            </div>
          </NuxtLink>

          <NuxtLink to="/lp/wp-hikinou" class="tcard" style="--tc:#3B82F6">
            <div class="tcard-stripe" style="background:#3B82F6"></div>
            <div class="tcard-body">
              <span class="tcard-badge" style="color:#3B82F6; border-color:rgba(59,130,246,0.35)">WordPress</span>
              <p class="tcard-title">非機能診断くん</p>
              <p class="tcard-desc">表示速度・セキュリティ・使いやすさをURLを入れるだけで確認。PageSpeed・ヘッダー設定・SSL状態を一括チェック。</p>
              <p class="tcard-cta">診断を始める <span class="arrow">→</span></p>
            </div>
          </NuxtLink>

          <NuxtLink to="/lp/ai-hikinou" class="tcard" style="--tc:#06B6D4">
            <div class="tcard-stripe" style="background:#06B6D4"></div>
            <div class="tcard-body">
              <span class="tcard-badge" style="color:#06B6D4; border-color:rgba(6,182,212,0.35)">AI開発 / Next.js · Nuxt</span>
              <p class="tcard-title">非機能診断くん</p>
              <p class="tcard-desc">env漏洩・セキュリティヘッダー・LCP・API露出状況をまとめて診断。本番前のチェックリストとして使えます。</p>
              <p class="tcard-cta">診断を始める <span class="arrow">→</span></p>
            </div>
          </NuxtLink>

          <NuxtLink to="/lp/api-security" class="tcard" style="--tc:#EF4444">
            <div class="tcard-stripe" style="background:#EF4444"></div>
            <div class="tcard-body">
              <span class="tcard-badge" style="color:#EF4444; border-color:rgba(239,68,68,0.35)">API Security</span>
              <p class="tcard-title">APIセキュリティ診断くん</p>
              <p class="tcard-desc">Swagger自動探索・GraphQLイントロスペクション・ソースマップ漏洩・エンドポイント認証をまとめて確認。</p>
              <p class="tcard-cta">診断を始める <span class="arrow">→</span></p>
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
          <NuxtLink v-for="item in news" :key="item.id" :to="`/blog/${item.slug}`" class="news-row">
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
          <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`" class="post-card">
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
/* ── トークン ──────────────────────────────────── */
.page {
  --bg:     #FFFFFF;
  --bg-alt: #F8FAFC;
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
}

/* ── ナビ ─────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: #070B11;
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #F1F5F9;
  font-family: ui-monospace, monospace;
}
.nav-links { display: flex; gap: 28px; }
.nav-links a {
  font-size: 14px;
  color: #94A3B8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.nav-links a:hover { color: #F1F5F9; }

/* ── ダークゾーン（ヒーロー + ツール） ─────────── */
.dark-zone {
  background: #070B11;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* ── クイックスキャン（ヒーロー） ─────────────── */
.scan-hero {
  padding: 80px 48px 56px;
  text-align: center;
}
.scan-hero-inner { max-width: 640px; margin: 0 auto; }

.kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #06B6D4;
  font-family: ui-monospace, monospace;
  margin: 0 0 20px;
}

.scan-title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0 0 36px;
  text-wrap: balance;
  color: #F1F5F9;
}

/* ── 会社コピー ────────────────────────────────── */
.company-intro {
  padding: 48px 48px 56px;
  border-top: 1px solid rgba(255,255,255,0.07);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.ci-inner { max-width: 720px; margin: 0 auto; }

.ci-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #334155;
  font-family: ui-monospace, monospace;
  margin: 0 0 16px;
}

.ci-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
  margin: 0 0 20px;
  text-wrap: balance;
  color: #F1F5F9;
}

.ci-lead {
  font-size: 16px;
  line-height: 1.9;
  color: #64748B;
  margin: 0;
  max-width: 560px;
}
.br-pc { display: inline; }
@media (max-width: 520px) { .br-pc { display: none; } }

/* ── クイックスキャン ──────────────────────────── */
.quick-scan {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
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
  border: 1px solid rgba(255,255,255,0.12);
  color: #94A3B8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: ui-monospace, monospace;
}
.scan-tab:hover { color: #F1F5F9; border-color: rgba(255,255,255,0.3); }
.scan-tab.active {
  background: color-mix(in srgb, var(--tc) 15%, transparent);
  border-color: var(--tc);
  color: var(--tc);
}

.scan-tool-desc {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 14px;
  line-height: 1.6;
  min-height: 2.6em;
}

.scan-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.scan-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #F1F5F9;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.scan-input::placeholder { color: #475569; }
.scan-input:focus { border-color: rgba(255,255,255,0.3); }

.scan-btn {
  width: 100%;
  background: #06B6D4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 2px;
}
.scan-btn:hover { background: #0891B2; }


/* ── ツールカードグリッド ──────────────────────── */
.tgrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 28px;
}
@media (max-width: 640px) { .tgrid { grid-template-columns: 1fr; } }

/* ダークゾーン内のカード（現在は未使用、念のため残す） */
.dark-zone .tcard {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.08);
}
.dark-zone .tcard-title { color: #F1F5F9; }
.dark-zone .tcard-desc  { color: #64748B; }
.dark-zone .tcard-cta   { color: #94A3B8; }
.dark-zone .tcard:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px var(--tc);
}

/* ライトゾーン内のカード（tools section） */
.tcard {
  display: block;
  text-decoration: none;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.tcard:hover {
  border-color: var(--tc);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px var(--tc);
  transform: translateY(-2px);
}

.tcard-stripe { height: 3px; }

.tcard-body { padding: 24px 24px 20px; }

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
.tcard:hover .tcard-cta { color: var(--tc); }
.tcard-cta .arrow { transition: transform 0.15s; }
.tcard:hover .tcard-cta .arrow { transform: translateX(4px); }

/* ── ツールセクション（ライト） ──────────────── */
.band-tools { background: var(--bg-alt); }

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

/* ── 事業内容 ──────────────────────────────────── */
.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 600px) { .service-grid { grid-template-columns: 1fr; } }

.service-card {
  padding: 32px 28px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
}
.band-alt .service-card { background: var(--bg); }

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

/* ── パッケージ ────────────────────────────────── */
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
.pkg-accent { width: 5px; flex-shrink: 0; }
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

/* ── ニュース ──────────────────────────────────── */
.news-list { border-top: 1px solid var(--line); }
.news-row {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
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

/* ── ブログ ────────────────────────────────────── */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 700px) { .posts-grid { grid-template-columns: 1fr; } }

.post-card {
  display: block;
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg);
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.post-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29,78,216,0.08);
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

/* ── 会社概要 ──────────────────────────────────── */
.profile { border-top: 1px solid var(--line); max-width: 600px; }
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
  .nav          { padding: 16px 20px; }
  .scan-hero    { padding: 56px 20px 40px; }
  .company-intro{ padding: 36px 20px 44px; }
  .tools-header { flex-direction: column; align-items: flex-start; gap: 6px; }
  .band        { padding: 56px 20px; }
  .footer      { padding: 20px; }
  .profile-row { grid-template-columns: 80px 1fr; font-size: 14px; }
  .tools-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .scan-row    { flex-direction: column; }
  .scan-btn    { width: 100%; }
}
</style>
