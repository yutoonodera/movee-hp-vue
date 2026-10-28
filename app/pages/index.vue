<script setup lang="ts">
useHead({ title: "株式会社movee — 営業・商談向けBtoBサービス" });
useSeoMeta({
  ogTitle: "株式会社movee",
  ogDescription:
    "営業・商談向けBtoBクラウドサービスを開発・運営する会社。AIが資料を学習して問い合わせに自動対応する「LeadVoice」、PDF共有・閲覧分析の「Share」を提供。",
  ogType: "website",
  ogImage: "https://www.movee.jp/og-default.png",
  twitterCard: "summary_large_image",
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

const menuOpen = ref(false);

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
        <a href="https://leadvoice.movee.jp/" target="_blank" rel="noopener" class="nav-product">LeadVoice</a>
        <a href="https://share.movee.jp/" target="_blank" rel="noopener" class="nav-product">Share</a>
        <span class="nav-sep">|</span>
        <a href="#contact">お問い合わせ</a>
      </nav>
      <button class="nav-hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="メニュー">
        <span /><span /><span />
      </button>
    </header>
    <div class="nav-drawer" :class="{ open: menuOpen }" @click="menuOpen = false">
      <a href="https://leadvoice.movee.jp/" target="_blank" rel="noopener" class="drawer-product">LeadVoice</a>
      <a href="https://share.movee.jp/" target="_blank" rel="noopener" class="drawer-product">Share</a>
      <a href="#contact" @click="menuOpen = false">お問い合わせ</a>
    </div>

    <!-- ヒーロー -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">株式会社movee</p>
        <h1 class="hero-title">
          営業・商談を前に進める<br />BtoBサービスを作っています
        </h1>
        <p class="hero-lead">
          問い合わせ対応の自動化から、資料共有・閲覧分析まで。<br class="br-pc" />
          営業活動の一つひとつを仕組み化するクラウドサービスを提供しています。
        </p>
        <div class="hero-actions">
          <a href="https://leadvoice.movee.jp/" target="_blank" rel="noopener" class="hero-cta">LeadVoiceを見る</a>
          <a href="https://share.movee.jp/" target="_blank" rel="noopener" class="hero-cta hero-cta--sub">Shareを見る</a>
        </div>
      </div>
    </section>

    <!-- サービス -->
    <section class="band band-alt services-band">
      <div class="inner">
        <p class="label">SERVICES</p>
        <h2 class="heading">自社クラウドサービス</h2>
        <div class="services-grid">

          <!-- LeadVoice -->
          <a href="https://leadvoice.movee.jp/" target="_blank" rel="noopener" class="service-card">
            <div class="service-head">
              <div>
                <p class="service-name">LeadVoice</p>
                <p class="service-url">leadvoice.movee.jp</p>
              </div>
              <span class="service-badge service-badge--paid">月額1,500円〜</span>
            </div>
            <p class="service-tagline">AIが資料を学習して、営業問い合わせに自動対応</p>
            <p class="service-desc">
              自社の製品資料・FAQ・提案書をAIキャラクターに学習させると、
              見込み顧客からの問い合わせに24時間自動で対応します。
              会話が商談・資料請求などの目的に近づいたタイミングで連絡先フォームを表示し、リードを獲得します。
            </p>
            <ul class="service-features">
              <li>資料を根拠にした信頼性の高い回答</li>
              <li>公開URLまたはサイトへの埋め込みで設置</li>
              <li>問い合わせリストをキャラクターごとに管理</li>
              <li>ログイン不要で利用開始</li>
            </ul>
            <span class="service-link">詳しく見る →</span>
          </a>

          <!-- share -->
          <a href="https://share.movee.jp/" target="_blank" rel="noopener" class="service-card">
            <div class="service-head">
              <div>
                <p class="service-name">Share</p>
                <p class="service-url">share.movee.jp</p>
              </div>
              <span class="service-badge service-badge--free">いつまでも無料</span>
            </div>
            <p class="service-tagline">PDF資料を共有して、閲覧状況をページ単位で把握</p>
            <p class="service-desc">
              提案書・カタログ・資料をアップロードしてURLを発行。
              相手がどのページをどれだけ読んだかを日別グラフで確認できます。
              「刺さったページ」がわかるので、次の商談の準備に活かせます。
            </p>
            <ul class="service-features">
              <li>ドラッグ&ドロップで即アップロード・URL発行</li>
              <li>ページごとの閲覧時間を日別グラフで可視化</li>
              <li>メールアドレス認証の設定も可能</li>
              <li>閲覧者・送り手ともにログイン不要</li>
            </ul>
            <span class="service-link">いつまでも無料ではじめる →</span>
          </a>

        </div>
        <p class="services-contact">自社クラウドサービスに関するお問い合わせは<a href="mailto:info@movee.jp" class="services-contact-link">info@movee.jp</a>まで。</p>
      </div>
    </section>

    <!-- 代表メッセージ -->
    <section class="band greeting-band">
      <div class="inner greeting-inner">
        <p class="label">MESSAGE</p>
        <h2 class="heading" style="margin-bottom: 20px">営業こそ、会社の屋台骨だと思っています</h2>
        <p class="greeting-body">
          私はエンジニアになる前、不動産・医薬品・指紋認証鍵の営業を経験しました。
          毎日アポを取り、商談資料を作り、お客様の前に立つ。その経験から、営業は単に「売る仕事」ではなく、出会いを商談につなげ、商談を次の行動につなげていく仕事だと考えています。
        </p>
        <p class="greeting-body">
          名刺交換後の連絡、アポの獲得、商談前の準備、提案、商談後のフォロー。
          こうした一つひとつの営業活動を仕組み化することで、営業機会を逃さず、次の行動につなげやすくなります。
        </p>
        <p class="greeting-body">
          ただし、営業システムは高機能であることより、現場で使われることが重要です。
          日々の営業活動の中で自然に使え、次の行動につながる。
          moveeは、現場に定着し、営業活動を前に進めるサービスを目指しています。
        </p>
        <p class="greeting-sig">株式会社movee 代表 小野寺 祐人</p>
      </div>
    </section>

    <!-- ブログ -->
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

    <!-- 会社概要 -->
    <section class="band band-alt" id="contact">
      <div class="inner">
        <p class="label">COMPANY</p>
        <h2 class="heading">会社概要</h2>
        <dl class="profile">
          <div class="profile-row"><dt>会社名</dt><dd>株式会社movee</dd></div>
          <div class="profile-row"><dt>所在地</dt><dd>福岡県福岡市中央区天神2丁目3-10 天神パインクレスト716</dd></div>
          <div class="profile-row"><dt>代表</dt><dd>小野寺 祐人</dd></div>
          <div class="profile-row"><dt>お問い合わせ</dt><dd><a href="mailto:info@movee.jp" class="link">info@movee.jp</a></dd></div>
        </dl>
      </div>
    </section>

    <footer class="footer">
      <p>© 株式会社movee</p>
    </footer>
  </div>
</template>

<style scoped>
/* ── トークン ── */
.page {
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --ink: #0f172a;
  --ink-2: #475569;
  --ink-3: #94a3b8;
  --accent: #1d4ed8;
  --line: #e2e8f0;
  --gold: #d4a843;

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── ナビ ── */
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
.nav-logo { font-size: 18px; font-weight: 800; letter-spacing: -0.04em; color: var(--ink); font-family: ui-monospace, monospace; }
.nav-links { display: flex; gap: 24px; align-items: center; }
.nav-links a { font-size: 14px; color: var(--ink-2); text-decoration: none; font-weight: 500; transition: color 0.15s; }
.nav-links a:hover { color: var(--ink); }
.nav-sep { color: var(--line); font-size: 12px; user-select: none; }
.nav-product { color: var(--accent) !important; font-weight: 700 !important; }
.nav-product:hover { color: #1e40af !important; }

/* ── ヒーロー ── */
.hero { padding: 88px 48px 80px; border-bottom: 1px solid var(--line); }
.hero-inner { max-width: 760px; margin: 0 auto; }
.hero-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 20px; }
.hero-title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 24px;
  text-wrap: balance;
  color: var(--ink);
}
.hero-lead { font-size: 15px; line-height: 2; color: var(--ink-2); margin: 0 0 36px; max-width: 560px; }
.hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.hero-cta { display: inline-block; background: var(--accent); color: #fff; font-size: 14px; font-weight: 700; padding: 13px 28px; border-radius: 6px; text-decoration: none; transition: background 0.15s; }
.hero-cta:hover { background: #1e40af; }
.hero-cta--sub { background: var(--bg); color: var(--accent); border: 1.5px solid var(--accent); }
.hero-cta--sub:hover { background: #eff6ff; }
.br-pc { display: inline; }

/* ── サービス ── */
.services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 640px) { .services-grid { grid-template-columns: 1fr; } }
.service-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 28px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.service-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(29,78,216,0.08); }
.service-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.service-name { font-size: 20px; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; margin: 0 0 2px; font-family: ui-monospace, monospace; }
.service-url { font-size: 11px; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0; }
.service-badge { display: inline-block; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 4px 10px; white-space: nowrap; flex-shrink: 0; }
.service-badge--paid { background: #eff6ff; color: var(--accent); border: 1px solid #bfdbfe; }
.service-badge--free { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.service-tagline { font-size: 15px; font-weight: 700; color: var(--ink); line-height: 1.5; margin: 0; }
.service-desc { font-size: 13.5px; color: var(--ink-2); line-height: 1.8; margin: 0; }
.service-features { list-style: none; display: flex; flex-direction: column; gap: 8px; padding-top: 14px; border-top: 1px solid var(--line); }
.service-features li { font-size: 13px; color: var(--ink-2); padding-left: 16px; position: relative; }
.service-features li::before { content: ""; position: absolute; left: 0; top: 8px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
.service-link { font-size: 13px; font-weight: 700; color: var(--accent); margin-top: auto; }

.services-contact { margin-top: 20px; font-size: 13px; color: var(--ink-3); }
.services-contact-link { color: var(--accent); text-decoration: none; }
.services-contact-link:hover { text-decoration: underline; }

/* ── 代表挨拶 ── */
.greeting-band { border-top: 1px solid var(--line); }
.greeting-inner { max-width: 680px; }
.greeting-body { font-size: 15px; line-height: 2; color: var(--ink-2); margin: 0 0 20px; }
.greeting-sig { font-size: 14px; font-weight: 700; color: var(--ink); margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--line); }

/* ── 共通バンド ── */
.band { padding: 72px 48px; background: var(--bg); }
.band-alt { background: var(--bg-alt); }
.inner { max-width: 900px; margin: 0 auto; }
.label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 10px; }
.heading { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 40px; color: var(--ink); }

/* ── セクションヘッダー ── */
.section-header { display: flex; align-items: flex-end; justify-content: space-between; }
.section-more { font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; padding-bottom: 4px; }
.section-more:hover { text-decoration: underline; }

/* ── ニュース ── */
.news-list { border-top: 1px solid var(--line); }
.news-row { display: flex; align-items: baseline; gap: 24px; padding: 16px 0; border-bottom: 1px solid var(--line); text-decoration: none; }
.news-row:hover .news-title { color: var(--accent); }
.news-date { font-size: 12px; color: var(--ink-3); font-family: ui-monospace, monospace; flex-shrink: 0; margin: 0; }
.news-title { font-size: 15px; font-weight: 500; color: var(--ink); margin: 0; line-height: 1.5; transition: color 0.15s; }

/* ── ブログ・勉強会 ── */
.posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 700px) { .posts-grid { grid-template-columns: 1fr; } }
.post-card { display: block; text-decoration: none; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); overflow: hidden; transition: border-color 0.15s, box-shadow 0.15s; }
.post-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(29,78,216,0.08); }
.post-thumb { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--line); }
.post-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
.post-card:hover .post-thumb img { transform: scale(1.03); }
.post-body { padding: 20px; }
.post-date { font-size: 11px; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 8px; }
.post-title { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 8px; line-height: 1.5; }
.post-excerpt { font-size: 13px; color: var(--ink-3); margin: 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.workshop-card { border-color: rgba(29,78,216,0.15); }
.workshop-card:hover { border-color: var(--accent); }
.workshop-card .ws-date { font-size: 13px; font-weight: 700; color: var(--accent); background: #dbeafe; border-radius: 6px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; }
.ws-time { font-size: 15px; }
.ws-no-thumb { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%); }
.ws-cta { display: block; font-size: 13px; font-weight: 700; color: #fff; background: var(--accent); border-radius: 8px; padding: 10px 16px; margin-top: 12px; text-align: center; transition: background 0.15s; }
.workshop-card:hover .ws-cta { background: #1e40af; }

/* ── 会社概要 ── */
.profile { border-top: 1px solid var(--line); max-width: 600px; }
.profile-row { display: grid; grid-template-columns: 120px 1fr; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--line); font-size: 16px; }
dt { color: var(--ink-3); font-weight: 500; }
dd { color: var(--ink); margin: 0; }
.link { color: var(--accent); text-decoration: none; }
.link:hover { text-decoration: underline; }

/* ── フッター ── */
.footer { border-top: 1px solid var(--line); padding: 24px 48px; font-size: 14px; color: var(--ink-3); background: var(--bg); }

/* ── ハンバーガー ── */
.nav-hamburger { display: none; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; }
.nav-hamburger span { display: block; width: 22px; height: 2px; background: var(--ink-2); border-radius: 2px; transition: transform 0.2s, opacity 0.2s; }
.nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.nav-drawer { display: none; flex-direction: column; background: var(--bg); border-bottom: 1px solid var(--line); padding: 8px 0; position: sticky; top: 57px; z-index: 9; }
.nav-drawer a { padding: 12px 20px; color: var(--ink-2); text-decoration: none; font-size: 15px; font-weight: 500; border-bottom: 1px solid var(--line); transition: color 0.15s; }
.nav-drawer a:last-child { border-bottom: none; }
.nav-drawer a:hover { color: var(--ink); }
.drawer-product { color: var(--accent) !important; font-weight: 700 !important; }

@media (max-width: 600px) and (orientation: portrait) {
  .nav-links { display: none; }
  .nav-hamburger { display: flex; }
  .nav-drawer.open { display: flex; }
}
@media (max-width: 600px) {
  .nav { padding: 12px 16px; }
  .hero { padding: 56px 20px; }
  .band { padding: 56px 20px; }
  .footer { padding: 20px; }
  .profile-row { grid-template-columns: 80px 1fr; font-size: 14px; }
  .br-pc { display: none; }
}
</style>
