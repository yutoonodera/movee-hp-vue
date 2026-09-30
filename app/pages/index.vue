<script setup lang="ts">
useHead({ title: "株式会社movee — 商談・営業の業務システム開発" });
useSeoMeta({
  ogTitle: "株式会社movee — 商談・営業の業務システム開発",
  ogDescription:
    "名刺交換からアポ・商談まで、営業プロセスに特化した業務システムの開発会社。自社クラウド「Fumi」「Fumi DSR」のドメイン知識を活かした受託開発。福岡市拠点。",
  ogType: "website",
  ogImage: "https://www.movee.jp/og-default.png",
  twitterCard: "summary_large_image",
  twitterTitle: "ヒャク開発 — movee",
  twitterDescription: "100点の商談・営業システムを100万円で作る。",
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

interface Achievement {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  customer: string | null;
  location: string | null;
  featuredImage: string | null;
}

const { data: achievements } = await useFetch<Achievement[]>("/api/wp/achievements");
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
        <a href="https://fumi.lol/" target="_blank" rel="noopener" class="nav-product">Fumi</a>
        <a href="https://sdr.fumi.lol/" target="_blank" rel="noopener" class="nav-product">Fumi DSR</a>
        <span class="nav-sep">|</span>
        <a href="#hyaku" class="nav-hyaku">ヒャク開発</a>
        <a href="#works">実績</a>
        <a href="#contact">お問い合わせ</a>
      </nav>
      <button class="nav-hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="メニュー">
        <span /><span /><span />
      </button>
    </header>
    <div class="nav-drawer" :class="{ open: menuOpen }" @click="menuOpen = false">
      <a href="https://fumi.lol/" target="_blank" rel="noopener" class="drawer-product">Fumi</a>
      <a href="https://sdr.fumi.lol/" target="_blank" rel="noopener" class="drawer-product">Fumi DSR</a>
      <a href="#hyaku" @click="menuOpen = false" class="drawer-hyaku">ヒャク開発</a>
      <a href="#works" @click="menuOpen = false">実績</a>
      <a href="#contact" @click="menuOpen = false">お問い合わせ</a>
    </div>

      <!-- ヒーロー -->
      <section class="hero">
        <div class="hero-inner">
          <p class="hero-kicker">株式会社movee</p>
          <h1 class="hero-title">
            商談・営業の業務システムを<br />専門に作る会社です
          </h1>
          <p class="hero-lead">
            名刺交換からアポ・商談・見積もりまで、営業プロセスに特化した業務システムの開発会社です。<br class="br-pc" />
            自社でも「Fumi」「Fumi DSR」を開発・運営しています。
          </p>
          <div class="hero-actions">
            <a href="#contact" class="hero-cta">開発を相談する</a>
            <a href="#hyaku" class="hero-sub">ヒャク開発について →</a>
          </div>
        </div>
      </section>

      <!-- 商談・営業クラウドサービス -->
      <section class="cloud-band">
        <div class="inner">
          <p class="label gold-label">商談・営業クラウドサービス</p>
          <h2 class="heading light-heading">営業プロセスをカバーする2つのサービス</h2>

          <!-- タイムライン -->
          <div class="timeline-wrap">
            <div class="timeline-row">
              <div class="stage active">
                <div class="stage-box">
                  <span class="stage-num">01</span>
                  <span class="stage-name">出会い</span>
                </div>
              </div>
              <div class="tl-arrow active">→</div>
              <div class="stage active">
                <div class="stage-box">
                  <span class="stage-num">02</span>
                  <span class="stage-name">アポ取得</span>
                </div>
              </div>
              <div class="tl-arrow active">→</div>
              <div class="stage active">
                <div class="stage-box">
                  <span class="stage-num">03</span>
                  <span class="stage-name">アポ・商談</span>
                </div>
              </div>
              <div class="tl-arrow active">→</div>
              <div class="stage active">
                <div class="stage-box">
                  <span class="stage-num">04</span>
                  <span class="stage-name">見積もり</span>
                </div>
              </div>
              <div class="tl-arrow muted">→</div>
              <div class="stage muted">
                <div class="stage-box">
                  <span class="stage-num">05</span>
                  <span class="stage-name">契約</span>
                </div>
              </div>
            </div>
            <div class="coverage-row">
              <div class="coverage-active" style="flex: 4">
                <div class="coverage-line"></div>
                <span class="coverage-label">movee クラウドサービスがカバー</span>
              </div>
              <div class="coverage-out" style="flex: 1">
                <div class="coverage-out-line"></div>
                <span class="coverage-out-label">他社ツール・手動対応</span>
              </div>
            </div>
          </div>

          <!-- 製品カード -->
          <div class="products">
            <a href="https://fumi.lol/" target="_blank" rel="noopener" class="product-card">
              <div class="product-head">
                <p class="product-name">Fumi</p>
                <div class="product-scope">
                  <span class="scope-dot"></span>出会い → アポ取得
                </div>
              </div>
              <p class="product-desc">名刺交換後のフォローアップを自動化。出会いを次のアポイントへつなげます。</p>
              <ul class="product-features">
                <li>名刺の自動読み取り・連絡先登録</li>
                <li>会話内容からお礼メールを自動生成</li>
                <li>アポ依頼メールの自動生成</li>
              </ul>
              <span class="product-link">fumi.lol →</span>
            </a>
            <a href="https://sdr.fumi.lol/" target="_blank" rel="noopener" class="product-card">
              <div class="product-head">
                <p class="product-name">Fumi DSR</p>
                <div class="product-scope">
                  <span class="scope-dot"></span>アポ・商談〜見積もり
                </div>
                <span class="product-free">いつでも無料</span>
              </div>
              <p class="product-desc">営業資料をクラウドで管理・共有。商談の場でそのまま使えるプレゼンツール。</p>
              <ul class="product-features">
                <li>資料をフォルダ管理・取引先ごとにカスタマイズ</li>
                <li>商談中にスライド全画面表示・レーザーポインター対応</li>
                <li>開封・ダウンロード通知付きの資料リンク共有</li>
              </ul>
              <span class="product-link">sdr.fumi.lol →</span>
            </a>
          </div>
        </div>
      </section>

    <!-- ヒャク開発 -->
    <section id="hyaku" class="band hyaku-band">
      <div class="inner">
        <p class="label">HYAKU</p>
        <div class="hyaku-head">
          <h2 class="hyaku-title">ヒャク開発</h2>
          <div class="hyaku-price">¥1,000,000</div>
        </div>
        <p class="hyaku-catch">100点の商談・営業システムを100万円で開発する</p>
        <p class="hyaku-desc">
          お客様の業務システムや Fumi・Fumi DSR の開発・運営で培った商談・営業領域の知見を活かし、
          貴社の営業フローに合ったシステムをスピーディーに開発します。
          要件定義から設計・開発・納品まで、固定価格でお受けします。
        </p>
        <a href="#contact" class="hyaku-cta">詳細を問い合わせる</a>
      </div>
    </section>

    <!-- 主な機能 -->
    <section class="band band-alt features-band">
      <div class="inner">
        <p class="label">FEATURES</p>
        <h2 class="heading">商談・営業システムの主な機能</h2>
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-num">01</span>
            <div>
              <p class="feature-name">顧客・取引先管理</p>
              <p class="feature-desc">名刺情報・商談履歴を一元管理</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">02</span>
            <div>
              <p class="feature-name">アポイント管理</p>
              <p class="feature-desc">スケジュール・訪問履歴の自動記録</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">03</span>
            <div>
              <p class="feature-name">商談進捗管理</p>
              <p class="feature-desc">案件フェーズ・確度・金額を可視化</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">04</span>
            <div>
              <p class="feature-name">資料管理・共有</p>
              <p class="feature-desc">商談資料のクラウド管理とリンク共有</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">05</span>
            <div>
              <p class="feature-name">メール・通知自動化</p>
              <p class="feature-desc">お礼・フォローアップメールの自動送信</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">06</span>
            <div>
              <p class="feature-name">見積書・提案書作成</p>
              <p class="feature-desc">テンプレートから素早く作成・送付</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">07</span>
            <div>
              <p class="feature-name">ダッシュボード</p>
              <p class="feature-desc">営業数字のリアルタイム可視化</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">08</span>
            <div>
              <p class="feature-name">外部連携</p>
              <p class="feature-desc">Slack・CRM・カレンダーとの連携</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主な実績 -->
    <section v-if="achievements?.length" id="works" class="band works-band">
      <div class="inner">
        <p class="label">WORKS</p>
        <h2 class="heading" style="margin-bottom: 8px">実績</h2>
        <p class="works-note">お客様プライバシー保護のため、社名や画像の公開は控えさせていただいております。</p>
      </div>
      <div class="works-marquee-outer">
        <div class="works-marquee-track">
          <!-- オリジナル -->
          <NuxtLink v-for="item in achievements" :key="item.id" :to="`/achievements/${item.slug}`" class="work-card">
            <p class="work-name" v-html="item.title.rendered"></p>
            <div v-if="item.customer || item.location" class="work-meta">
              <div v-if="item.customer">
                <p class="work-meta-label">お客様</p>
                <p class="work-meta-value">{{ item.customer }}</p>
              </div>
              <div v-if="item.location">
                <p class="work-meta-label">お客様所在地</p>
                <p class="work-meta-value">{{ item.location }}</p>
              </div>
            </div>
            <div class="work-excerpt" v-html="item.excerpt.rendered"></div>
          </NuxtLink>
          <!-- ループ用コピー -->
          <NuxtLink v-for="item in achievements" :key="`copy-${item.id}`" :to="`/achievements/${item.slug}`" class="work-card" aria-hidden="true">
            <p class="work-name" v-html="item.title.rendered"></p>
            <div v-if="item.customer || item.location" class="work-meta">
              <div v-if="item.customer">
                <p class="work-meta-label">お客様</p>
                <p class="work-meta-value">{{ item.customer }}</p>
              </div>
              <div v-if="item.location">
                <p class="work-meta-label">お客様所在地</p>
                <p class="work-meta-value">{{ item.location }}</p>
              </div>
            </div>
            <div class="work-excerpt" v-html="item.excerpt.rendered"></div>
          </NuxtLink>
        </div>
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
.nav-product { color: #b07d1a !important; font-family: ui-monospace, monospace; }
.nav-product:hover { color: var(--gold) !important; }
.nav-hyaku { font-weight: 700 !important; color: var(--accent) !important; }

/* ── ヒーロー ── */
.hero { padding: 80px 48px 72px; border-bottom: 1px solid var(--line); background: var(--bg); }
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
.hero-lead { font-size: 15px; line-height: 2; color: var(--ink-2); margin: 0 0 36px; max-width: 580px; }
.hero-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.hero-cta { display: inline-block; background: var(--accent); color: #fff; font-size: 14px; font-weight: 800; padding: 13px 28px; border-radius: 6px; text-decoration: none; transition: background 0.15s; }
.hero-cta:hover { background: #1e40af; }
.hero-sub { font-size: 13px; color: var(--ink-3); text-decoration: none; font-family: ui-monospace, monospace; transition: color 0.15s; }
.hero-sub:hover { color: var(--ink-2); }
.br-pc { display: inline; }
@media (max-width: 520px) { .br-pc { display: none; } .hero { padding: 56px 24px 56px; } }

/* ── クラウドサービスセクション ── */
.cloud-band { padding: 64px 48px; background: var(--bg-alt); }
.gold-label { color: #b07d1a !important; }
.light-heading { color: var(--ink) !important; }

/* タイムライン */
.timeline-wrap { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
.timeline-row { display: flex; align-items: center; overflow-x: auto; scrollbar-width: none; padding-block: 4px; }
.timeline-row::-webkit-scrollbar { display: none; }
.stage { display: flex; align-items: center; flex-shrink: 0; }
.stage-box { padding: 10px 16px; border-radius: 8px; border: 1.5px solid; text-align: center; display: flex; flex-direction: column; gap: 3px; min-width: 84px; }
.stage.active .stage-box { background: #fffbf0; border-color: var(--gold); }
.stage.muted .stage-box { background: var(--bg); border-color: var(--line); }
.stage-num { font-family: ui-monospace, monospace; font-size: 9px; font-weight: 500; display: block; }
.stage.active .stage-num { color: #b07d1a; }
.stage.muted .stage-num { color: var(--ink-3); }
.stage-name { font-size: 12px; font-weight: 700; display: block; white-space: nowrap; }
.stage.active .stage-name { color: var(--ink); }
.stage.muted .stage-name { color: var(--ink-3); }
.tl-arrow { flex-shrink: 0; padding: 0 8px; font-size: 14px; margin-bottom: 2px; }
.tl-arrow.active { color: var(--gold); }
.tl-arrow.muted { color: var(--line); }

/* カバレッジバー */
.coverage-row { display: flex; align-items: center; overflow-x: auto; scrollbar-width: none; }
.coverage-row::-webkit-scrollbar { display: none; }
.coverage-active { display: flex; flex-direction: column; gap: 5px; flex: 3; min-width: 0; }
.coverage-line { height: 2px; background: var(--gold); border-radius: 2px; position: relative; }
.coverage-line::before, .coverage-line::after { content: ""; position: absolute; top: 50%; transform: translateY(-50%); width: 2px; height: 8px; background: var(--gold); border-radius: 1px; }
.coverage-line::before { left: 0; }
.coverage-line::after { right: 0; }
.coverage-label { font-family: ui-monospace, monospace; font-size: 10px; font-weight: 500; color: #b07d1a; letter-spacing: 0.06em; white-space: nowrap; }
.coverage-out { display: flex; align-items: center; gap: 8px; flex: 2; padding-left: 16px; }
.coverage-out-line { height: 1px; background: var(--line); flex: 1; }
.coverage-out-label { font-family: ui-monospace, monospace; font-size: 10px; color: var(--ink-3); white-space: nowrap; }

/* 製品カード */
.products { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .products { grid-template-columns: 1fr; } }
.product-card { border: 1px solid #e9d89a; border-radius: 12px; padding: 24px; background: #fffbf0; display: flex; flex-direction: column; gap: 14px; text-decoration: none; transition: box-shadow 0.15s, border-color 0.15s; }
.product-card:hover { border-color: var(--gold); box-shadow: 0 4px 16px rgba(212,168,67,0.2); }
.product-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.product-name { font-family: ui-monospace, monospace; font-size: 16px; font-weight: 600; color: #b07d1a; }
.product-scope { display: inline-flex; align-items: center; gap: 5px; background: #fef3c7; border: 1px solid #e9d89a; border-radius: 100px; padding: 3px 10px; font-size: 11px; font-weight: 600; color: #b07d1a; }
.scope-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
.product-desc { font-size: 13.5px; color: var(--ink-2); line-height: 1.7; }
.product-features { list-style: none; display: flex; flex-direction: column; gap: 7px; padding-top: 12px; border-top: 1px solid #e9d89a; }
.product-features li { font-size: 13px; color: var(--ink-2); padding-left: 14px; position: relative; }
.product-features li::before { content: ""; position: absolute; left: 0; top: 8px; width: 4px; height: 4px; border-radius: 50%; background: var(--gold); }
.product-link { font-size: 12px; font-weight: 600; color: #b07d1a; text-decoration: none; font-family: ui-monospace, monospace; transition: color 0.15s; margin-top: auto; }
.product-link:hover { color: var(--gold); }
.product-free {
  display: inline-block;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  background: #16a34a;
  border-radius: 6px;
  padding: 4px 12px;
  letter-spacing: 0.02em;
}

/* ── ヒャク開発 ── */
.hyaku-band { background: var(--bg); scroll-margin-top: 64px; }
.hyaku-head { display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap; margin-bottom: 12px; }
.hyaku-title { font-size: 36px; font-weight: 900; letter-spacing: -0.04em; color: var(--ink); }
.hyaku-price {
  font-size: 22px;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  color: var(--accent);
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  border-radius: 8px;
  padding: 4px 16px;
  letter-spacing: -0.02em;
}
.hyaku-catch { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 16px; letter-spacing: -0.02em; }
.hyaku-desc { font-size: 15px; line-height: 1.9; color: var(--ink-2); max-width: 60ch; margin-bottom: 32px; }
.hyaku-cta { display: inline-block; background: var(--ink); color: #fff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 6px; text-decoration: none; transition: background 0.15s; }
.hyaku-cta:hover { background: #1e293b; }

/* ── 共通バンド ── */
.band { padding: 72px 48px; background: var(--bg); }
.band-alt { background: var(--bg-alt); }
.inner { max-width: 900px; margin: 0 auto; }
.label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 10px; }
.heading { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 40px; color: var(--ink); }

/* ── セクションヘッダー ── */
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 0; }
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

/* ── 主な機能 ── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 24px 20px;
  background: var(--bg-alt);
  transition: background 0.15s;
}
.feature-item:hover { background: var(--bg); }
.feature-num {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  background: #eff6ff;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
  margin-top: 2px;
}
.feature-name { font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 4px; }
.feature-desc { font-size: 12px; color: var(--ink-2); margin: 0; line-height: 1.6; }
@media (max-width: 700px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 400px) {
  .features-grid { grid-template-columns: 1fr; }
}

.works-note { font-size: 12px; color: var(--ink-3); margin: 0 0 0; }

/* ── 実績マーキー ── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.works-band { padding-bottom: 72px; scroll-margin-top: 64px; }
.works-band .inner { margin-bottom: 0; }
.works-marquee-outer {
  overflow: hidden;
  padding: 32px 0 8px;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
}
.works-marquee-track {
  display: flex;
  gap: 16px;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.work-card {
  width: 280px;
  flex-shrink: 0;
  border: 1.5px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  background: var(--bg);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.work-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.work-name { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0; line-height: 1.5; }
.work-meta { background: var(--bg-alt); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.work-meta-label { font-size: 11px; color: var(--ink-3); margin: 0 0 2px; }
.work-meta-value { font-size: 13px; font-weight: 700; color: var(--ink); margin: 0; }
.work-excerpt { font-size: 12px; color: var(--ink-2); line-height: 1.65; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.work-excerpt :deep(p) { margin: 0; }
.post-thumb-sm { width: 100%; aspect-ratio: 16/9; border-radius: 6px; overflow: hidden; background: var(--line); margin-bottom: 4px; }
.post-thumb-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
.post-date-sm { font-size: 11px; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0 0 6px; }
@media (prefers-reduced-motion: reduce) {
  .works-marquee-track { animation: none; }
}

/* ── フッター ── */
.footer { border-top: 1px solid var(--line); padding: 24px 48px; font-size: 14px; color: var(--ink-3); background: var(--bg); }

/* ── ハンバーガー ── */
.nav-hamburger { display: none; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; }
.nav-hamburger span { display: block; width: 22px; height: 2px; background: #94a3b8; border-radius: 2px; transition: transform 0.2s, opacity 0.2s; }
.nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.nav-drawer { display: none; flex-direction: column; background: var(--bg); border-bottom: 1px solid var(--line); padding: 8px 0; position: sticky; top: 57px; z-index: 9; }
.nav-drawer a { padding: 12px 20px; color: var(--ink-2); text-decoration: none; font-size: 15px; font-weight: 500; border-bottom: 1px solid var(--line); transition: color 0.15s; }
.nav-drawer a:last-child { border-bottom: none; }
.nav-drawer a:hover { color: var(--ink); }
.drawer-product { color: #b07d1a !important; }
.drawer-hyaku { color: var(--accent) !important; font-weight: 700 !important; }

@media (max-width: 600px) and (orientation: portrait) {
  .nav-links { display: none; }
  .nav-hamburger { display: flex; }
  .nav-drawer.open { display: flex; }
}
@media (max-width: 600px) {
  .nav { padding: 12px 16px; gap: 12px; }
  .band { padding: 56px 20px; }
  .cloud-band { padding: 48px 24px; }
  .footer { padding: 20px; }
  .profile-row { grid-template-columns: 80px 1fr; font-size: 14px; }
}
</style>
