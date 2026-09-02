<script setup lang="ts">
useHead({ title: "Fumi — 人との関係と発信を、まるごと任せる" });
useSeoMeta({
  ogTitle: "Fumi",
  ogDescription: "顧客・人脈の管理から、コンテンツ発信まで。あなたの代わりにFumiが動きます。",
  ogType: "website",
  ogImage: "https://www.movee.jp/og-default.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Fumi",
  twitterDescription: "顧客・人脈の管理から、コンテンツ発信まで。あなたの代わりにFumiが動きます。",
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

    <!-- ヒーロー -->
    <div class="dark-zone">
      <section class="hero">
        <div class="hero-inner">
          <p class="hero-kicker">Fumi</p>
          <h1 class="hero-title">人との関係と、発信を。<br />まるごと、Fumiに。</h1>
          <p class="hero-lead">
            フォロー漏れなし。発信も途切れない。<br class="br-pc" />
            あなたに代わって、Fumiが動きます。
          </p>
          <div class="hero-actions">
            <a href="#contact" class="hero-cta">無料で相談する</a>
            <a href="#services" class="hero-sub">サービスを見る →</a>
          </div>
        </div>
      </section>
    </div>

    <!-- Fumiの2本柱 -->
    <section class="band band-alt">
      <div class="inner">
        <p class="label">WHAT IS FUMI</p>
        <h2 class="heading">Fumiがカバーする2つの領域</h2>
        <div class="pillar-grid">
          <div class="pillar">
            <div class="pillar-icon">🤝</div>
            <h3 class="pillar-title">顧客・関係管理</h3>
            <p class="pillar-body">誰と会ったか、何を話したか、いつ連絡したか、次にどうするかを管理する。人との関係を途切れさせません。</p>
          </div>
          <div class="pillar">
            <div class="pillar-icon">✍️</div>
            <h3 class="pillar-title">コンテンツ投稿支援</h3>
            <p class="pillar-body">SNSなどで「自分が何をしている人なのか」を継続的に知ってもらうための発信を支援する。あなたの存在を届け続けます。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- サービス -->
    <section id="services" class="band">
      <div class="inner">
        <p class="label">SERVICES</p>
        <h2 class="heading">サービス</h2>
        <p class="svc-lead">自社サービス「Fumi」は、顧客管理、コンテンツ支援、オフライン交流機会調査ができます。Fumiを活用して、これら業務を代行します。</p>
        <div class="svc-grid">

          <div class="svc-card">
            <div class="svc-accent" style="background: #7C3AED"></div>
            <h3 class="svc-name">Fumi 顧客管理代行</h3>
            <p class="svc-body">顧客・人脈情報の整理、フォロー対象の抽出、次のアクション整理など、人との関係を維持するための業務を代行します。</p>
            <ul class="svc-list">
              <li>顧客・人脈情報の整理</li>
              <li>フォロー対象の抽出</li>
              <li>次のアクション整理</li>
            </ul>
          </div>

          <div class="svc-card">
            <div class="svc-accent" style="background: #7C3AED"></div>
            <h3 class="svc-name">Fumi コンテンツ支援代行</h3>
            <p class="svc-body">投稿テーマの企画から、投稿案の作成、スケジュール管理まで。継続的な発信をサポートします。</p>
            <ul class="svc-list">
              <li>投稿テーマの企画</li>
              <li>投稿案の作成</li>
              <li>投稿スケジュール作成</li>
            </ul>
          </div>

          <div class="svc-card">
            <div class="svc-accent" style="background: #7C3AED"></div>
            <h3 class="svc-name">Fumi オフライン交流調査代行</h3>
            <p class="svc-body">参加すべき交流会・イベントのリサーチや情報整理を代行します。オフラインでの接点づくりを後押しします。</p>
            <ul class="svc-list">
              <li>交流会・イベントのリサーチ</li>
              <li>参加候補の整理・提案</li>
              <li>スケジュール調整サポート</li>
            </ul>
          </div>

          <div class="svc-card svc-card-featured">
            <div class="svc-accent" style="background: #5B21B6"></div>
            <div class="svc-badge">まとめてお任せ</div>
            <h3 class="svc-name">Fumi まるっと運用代行</h3>
            <p class="svc-body">「人との関係」と「発信」をまとめて運用します。顧客管理代行とコンテンツ支援代行を統合した上位サービスです。</p>
            <ul class="svc-list">
              <li>顧客管理代行の全内容</li>
              <li>コンテンツ支援代行の全内容</li>
              <li>オフライン交流調査代行の全内容</li>
              <li>これらを連携した一元運用</li>
            </ul>
          </div>

        </div>
        <div class="svc-price">
          <p class="svc-price-label">PRICING</p>
          <p class="svc-price-text">料金はすべてご相談</p>
          <a href="#contact" class="svc-price-cta">まずは無料でご相談ください</a>
        </div>
      </div>
    </section>

    <!-- Web サービス開発 -->
    <section class="band band-alt">
      <div class="inner">
        <p class="label">DEVELOPMENT</p>
        <h2 class="heading">Webサービス開発</h2>
        <p class="dev-lead">既存のツールや代行サービスでは解決できない課題に対して、要件に合ったWebサービスをゼロから開発します。</p>
        <div class="dev-card">
          <div class="dev-bar"></div>
          <div class="dev-body">
            <h3 class="dev-title">要件定義 → 設計 → 開発 → 運用</h3>
            <p class="dev-desc">業務課題のヒアリングから始め、必要な機能だけをシンプルに構築します。既製品では対応できない独自の業務フローや仕組みを、一から作り上げます。</p>
            <a href="#contact" class="dev-cta">開発について相談する</a>
          </div>
        </div>
      </div>
    </section>

    <!-- データ活用事例 -->
    <section v-if="posts?.length" class="band band-alt">
      <div class="inner">
        <div class="section-header">
          <div>
            <p class="label">BLOG</p>
            <h2 class="heading" style="margin-bottom: 0">ブログ</h2>
          </div>
          <NuxtLink to="/blog" class="section-more">すべて見る →</NuxtLink>
        </div>
        <div class="posts-grid" style="margin-top: 40px">
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

    <!-- 勉強会 -->
    <section v-if="workshops?.length" class="band band-alt">
      <div class="inner">
        <div class="section-header">
          <div>
            <p class="label">WORKSHOP</p>
            <h2 class="heading" style="margin-bottom: 0">勉強会</h2>
          </div>
          <NuxtLink to="/workshop" class="section-more">すべて見る →</NuxtLink>
        </div>
        <div class="posts-grid" style="margin-top: 40px">
          <NuxtLink v-for="ws in workshops" :key="ws.id" :to="`/workshop/${ws.slug}`" class="post-card workshop-card">
            <div v-if="ws.featuredImage" class="post-thumb">
              <img :src="ws.featuredImage" :alt="ws.title.rendered" loading="lazy" />
            </div>
            <div class="ws-no-thumb" v-else></div>
            <div class="post-body">
              <div class="post-date ws-date">
                <template v-if="ws.eventDate">
                  <span>{{ formatEventDateOnly(ws.eventDate) }}</span>
                  <span v-if="formatEventTimeRange(ws.eventDate, ws.eventEnd)" class="ws-time">{{ formatEventTimeRange(ws.eventDate, ws.eventEnd) }}</span>
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

    <!-- 会社概要 / お問い合わせ -->
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
.page {
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --ink: #0f172a;
  --ink-2: #475569;
  --ink-3: #94a3b8;
  --accent: #7C3AED;
  --line: #e2e8f0;

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── ナビ ─── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
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
.nav-links { display: flex; gap: 28px; }
.nav-links a { font-size: 14px; color: #94a3b8; text-decoration: none; font-weight: 500; transition: color .15s; }
.nav-links a:hover { color: #f1f5f9; }

/* ── ダークゾーン ─── */
.dark-zone {
  background: #070b11;
  background-image: radial-gradient(rgba(124,58,237,.15) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* ── ヒーロー ─── */
.hero { padding: 88px 48px 96px; }
.hero-inner { max-width: 720px; margin: 0 auto; }
.hero-kicker {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #7C3AED;
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
.hero-lead { font-size: 16px; line-height: 2; color: #64748b; margin: 0 0 36px; max-width: 560px; }
.hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.hero-cta {
  display: inline-block;
  background: #7C3AED;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 6px;
  text-decoration: none;
  transition: background .15s;
}
.hero-cta:hover { background: #6D28D9; }
.hero-sub { font-size: 13px; color: #475569; text-decoration: none; font-family: ui-monospace, monospace; transition: color .15s; }
.hero-sub:hover { color: #94a3b8; }
.br-pc { display: inline; }
@media (max-width: 520px) {
  .br-pc { display: none; }
  .hero { padding: 56px 24px 64px; }
}

/* ── 共通バンド ─── */
.band { padding: 72px 48px; background: var(--bg); }
.band-alt { background: var(--bg-alt); }
.inner { max-width: 900px; margin: 0 auto; }
.label { font-size: 10px; font-weight: 700; letter-spacing: .2em; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 10px; }
.heading { font-size: 28px; font-weight: 800; letter-spacing: -.03em; margin: 0 0 40px; color: var(--ink); }

/* ── 2本柱 ─── */
.pillar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 600px) { .pillar-grid { grid-template-columns: 1fr; } }
.pillar { padding: 32px 28px; border: 1px solid var(--line); border-radius: 12px; background: var(--bg); }
.band-alt .pillar { background: #fff; }
.pillar-icon { font-size: 32px; margin-bottom: 16px; }
.pillar-title { font-size: 18px; font-weight: 700; color: var(--ink); margin: 0 0 12px; }
.pillar-body { font-size: 15px; line-height: 1.85; color: var(--ink-2); margin: 0; }

/* ── サービス ─── */
.svc-lead { font-size: 15px; color: var(--ink-2); margin: -24px 0 32px; line-height: 1.8; }
.svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 700px) { .svc-grid { grid-template-columns: 1fr; } }
.svc-card {
  position: relative;
  padding: 32px 28px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.svc-card-featured {
  border-color: #7C3AED;
  box-shadow: 0 0 0 3px rgba(124,58,237,.08);
}
.svc-accent { width: 32px; height: 3px; border-radius: 2px; }
.svc-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 11px;
  font-weight: 700;
  background: #7C3AED;
  color: #fff;
  padding: 3px 10px;
  border-radius: 100px;
}
.svc-name { font-size: 17px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin: 0; }
.svc-body { font-size: 14px; line-height: 1.85; color: var(--ink-2); margin: 0; }
.svc-list { padding-left: 18px; margin: 0; display: flex; flex-direction: column; gap: 6px; list-style-type: disc; }
.svc-list li { font-size: 13px; color: var(--ink-2); line-height: 1.6; }
.svc-cta {
  display: inline-block;
  margin-top: 8px;
  background: #7C3AED;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  transition: background .15s;
}
.svc-cta:hover { background: #6D28D9; }

.svc-price { margin-top: 48px; text-align: center; padding: 40px 32px; border: 1px solid #DDD6FE; border-radius: 16px; background: #FAFAFF; }
.svc-price-label { font-size: 10px; font-weight: 700; letter-spacing: .2em; color: #A78BFA; font-family: ui-monospace, monospace; margin: 0 0 12px; }
.svc-price-text { font-size: clamp(28px, 5vw, 48px); font-weight: 900; letter-spacing: -.04em; color: var(--ink); margin: 0 0 24px; }
.svc-price-cta { display: inline-block; background: #7C3AED; color: #fff; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: background .15s; }
.svc-price-cta:hover { background: #6D28D9; }

/* ── Web開発 ─── */
.dev-lead { font-size: 15px; color: var(--ink-2); margin: -24px 0 32px; line-height: 1.8; }
.dev-card { display: flex; gap: 0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; }
.dev-bar { width: 5px; flex-shrink: 0; background: #1D4ED8; }
.dev-body { padding: 32px 28px; display: flex; flex-direction: column; gap: 12px; }
.dev-title { font-size: 17px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin: 0; }
.dev-desc { font-size: 15px; line-height: 1.85; color: var(--ink-2); margin: 0; max-width: 640px; }
.dev-cta { display: inline-block; background: #1D4ED8; color: #fff; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 6px; text-decoration: none; transition: background .15s; align-self: flex-start; margin-top: 4px; }
.dev-cta:hover { background: #1E40AF; }

/* ── セクションヘッダー ─── */
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 0; }
.section-more { font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; padding-bottom: 4px; }
.section-more:hover { text-decoration: underline; }

/* ── ブログ / 勉強会 ─── */
.posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 700px) { .posts-grid { grid-template-columns: 1fr; } }
.post-card { display: block; text-decoration: none; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); overflow: hidden; transition: border-color .15s, box-shadow .15s; }
.post-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,58,237,.08); }
.post-thumb { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--line); }
.post-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }
.post-card:hover .post-thumb img { transform: scale(1.03); }
.post-body { padding: 20px; }
.post-date { font-size: 11px; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 8px; }
.post-title { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 8px; line-height: 1.5; }
.post-excerpt { font-size: 13px; color: var(--ink-3); margin: 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* ── 勉強会固有 ─── */
.workshop-card { border-color: rgba(124,58,237,.15); }
.workshop-card:hover { border-color: var(--accent); }
.workshop-card .ws-date { font-size: 13px; font-weight: 700; color: var(--accent); background: #ede9fe; border-radius: 6px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; }
.ws-time { font-size: 15px; }
.ws-no-thumb { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); }
.ws-cta { display: block; font-size: 13px; font-weight: 700; color: #fff; background: var(--accent); border-radius: 8px; padding: 10px 16px; margin-top: 12px; text-align: center; transition: background .15s; }
.workshop-card:hover .ws-cta { background: #6D28D9; }

/* ── ニュース ─── */
.news-list { border-top: 1px solid var(--line); }
.news-row { display: flex; align-items: baseline; gap: 24px; padding: 16px 0; border-bottom: 1px solid var(--line); text-decoration: none; }
.news-row:hover .news-title { color: var(--accent); }
.news-date { font-size: 12px; color: var(--ink-3); font-family: ui-monospace, monospace; flex-shrink: 0; margin: 0; }
.news-title { font-size: 15px; font-weight: 500; color: var(--ink); margin: 0; line-height: 1.5; transition: color .15s; }

/* ── 会社概要 ─── */
.profile { border-top: 1px solid var(--line); max-width: 600px; }
.profile-row { display: grid; grid-template-columns: 120px 1fr; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--line); font-size: 16px; }
dt { color: var(--ink-3); font-weight: 500; }
dd { color: var(--ink); margin: 0; }
.link { color: var(--accent); text-decoration: none; }
.link:hover { text-decoration: underline; }

/* ── フッター ─── */
.footer { border-top: 1px solid var(--line); padding: 24px 48px; font-size: 14px; color: var(--ink-3); background: var(--bg); }

/* ── レスポンシブ ─── */
@media (max-width: 600px) {
  .nav { padding: 16px 20px; }
  .band { padding: 56px 20px; }
  .footer { padding: 20px; }
  .profile-row { grid-template-columns: 80px 1fr; font-size: 14px; }
}
</style>
