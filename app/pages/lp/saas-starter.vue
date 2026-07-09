<script setup lang="ts">
useHead({ title: "サブスクスタータープラン — 決まった仕様で、SaaSを2週間で立ち上げる" });
useSeoMeta({ description: "サブスク1商品・Googleログイン・Stripe決済・メール通知・WordPressブログ連携をセットにした定額パッケージ。技術選定不要、¥600,000税抜で2週間納品。" });
</script>

<template>
  <div class="page">
    <header class="nav">
      <span class="nav-logo">サブスクスタータープラン</span>
      <a href="mailto:info@movee.jp" class="nav-cta">相談する →</a>
    </header>

    <!-- ヒーロー -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">by movee · SaaS Starter Plan</p>
        <h1 class="hero-title">
          決まった仕様で、<br />SaaSを2週間で立ち上げる。
        </h1>
        <p class="hero-body">
          技術選定・設計・開発・インフラ構築まで、仕様が決まったパッケージで提供します。
          何を作るかだけ決めれば、あとはお任せください。
        </p>
        <div class="hero-meta">
          <span class="hero-price">¥600,000<span class="hero-tax">税抜</span></span>
          <span class="hero-slash">/</span>
          <span class="hero-period">2週間</span>
        </div>
        <a href="mailto:info@movee.jp" class="hero-btn">相談・お問い合わせ</a>
      </div>
    </section>

    <main>
      <!-- 含まれるもの -->
      <section class="band band-white">
        <div class="inner">
          <p class="label">WHAT'S INCLUDED</p>
          <h2 class="heading">含まれる機能</h2>
          <div class="feature-list">

            <div class="feature-item">
              <div class="feature-check">✓</div>
              <div>
                <p class="feature-title">サブスク商品（1プラン）</p>
                <p class="feature-body">月額または年額の単一プランを実装します。Stripeと連携し、請求・更新・解約をシステムで処理します。</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-check">✓</div>
              <div>
                <p class="feature-title">Googleログイン</p>
                <p class="feature-body">Google OAuthによる会員登録・ログインを実装します。パスワード管理が不要で、ユーザーの離脱を減らします。</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-check">✓</div>
              <div>
                <p class="feature-title">Stripe決済</p>
                <p class="feature-body">サブスク請求・Webhookによる状態管理・解約処理を実装します。カード情報はStripe管理のためPCI DSS対応も不要です。</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-check">✓</div>
              <div>
                <p class="feature-title">メール通知</p>
                <p class="feature-body">会員登録確認・決済完了・解約完了など、主要なトランザクションメールを実装します。</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-check">✓</div>
              <div>
                <p class="feature-title">WordPressブログ連携</p>
                <p class="feature-body">WordPressをCMSとして使い、記事をAPIで取得してサイトに表示します。SEO集客のための記事をWordPress管理画面から投稿できます。</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-check">✓</div>
              <div>
                <p class="feature-title">利用規約・プライバシーポリシーページ</p>
                <p class="feature-body">サービス運営に必要な利用規約・プライバシーポリシーのページを作成します。内容のたたき台もご提供します。</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 技術スタック -->
      <section class="band band-gray">
        <div class="inner">
          <p class="label">TECH STACK</p>
          <h2 class="heading">技術スタック</h2>
          <p class="stack-note">技術選定は決まっています。スターターでは変更を受け付けていません。</p>
          <div class="stack-grid">
            <div class="stack-item">
              <p class="stack-layer">フロントエンド</p>
              <p class="stack-tech">Next.js</p>
            </div>
            <div class="stack-item">
              <p class="stack-layer">データベース</p>
              <p class="stack-tech">PostgreSQL</p>
            </div>
            <div class="stack-item">
              <p class="stack-layer">インフラ</p>
              <p class="stack-tech">GCP</p>
            </div>
            <div class="stack-item">
              <p class="stack-layer">決済</p>
              <p class="stack-tech">Stripe</p>
            </div>
            <div class="stack-item">
              <p class="stack-layer">CMS</p>
              <p class="stack-tech">WordPress API</p>
            </div>
            <div class="stack-item">
              <p class="stack-layer">認証</p>
              <p class="stack-tech">Google OAuth</p>
            </div>
          </div>
        </div>
      </section>

      <!-- やらないこと -->
      <section class="band band-white">
        <div class="inner">
          <p class="label">OUT OF SCOPE</p>
          <h2 class="heading">スターターに含まれないもの</h2>
          <p class="oos-lead">明確にしておくことで、開発をスムーズに進められます。</p>
          <div class="oos-list">
            <div class="oos-item">
              <span class="oos-x">✕</span>
              <div>
                <p class="oos-title">技術選定</p>
                <p class="oos-body">使用する技術はすべて決まっています。「Railsで作りたい」「AWSがいい」などのご要望には対応していません。</p>
              </div>
            </div>
            <div class="oos-item">
              <span class="oos-x">✕</span>
              <div>
                <p class="oos-title">サブスク商品の複数プラン</p>
                <p class="oos-body">スターターは1プランのみです。将来的な追加は可能ですが、スコープ外となります。</p>
              </div>
            </div>
            <div class="oos-item">
              <span class="oos-x">✕</span>
              <div>
                <p class="oos-title">追加機能の実装</p>
                <p class="oos-body">決まった機能以外はスターターには含まれません。チャット・API公開・管理画面の高度な機能などは別途ご相談ください。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 料金 -->
      <section class="band band-accent">
        <div class="inner price-inner">
          <p class="label label-light">PRICING</p>
          <h2 class="heading heading-light">料金</h2>
          <div class="price-block">
            <p class="price-main">¥600,000<span class="price-tax">税抜</span></p>
            <p class="price-period">2週間 / 一式</p>
            <p class="price-desc">追加費用なし。上記スコープの機能をすべて含みます。</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="band band-white cta-section">
        <div class="inner">
          <h2 class="cta-title">まずは相談だけでも、お気軽にどうぞ。</h2>
          <p class="cta-body">「こんなサービスを作りたい」というアイデアの段階からお話しします。</p>
          <a href="mailto:info@movee.jp" class="cta-btn">info@movee.jp に相談する</a>
          <p class="cta-fine">返信は営業日2日以内を目安にしています</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>サブスクスタータープラン by movee</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  --accent:   #059669;
  --accent-h: #047857;
  --ink:      #0F172A;
  --ink-2:    #475569;
  --ink-3:    #94A3B8;
  --line:     #E2E8F0;
  --bg-gray:  #F8FAFC;

  background: #fff;
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── ナビ ─────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  border-bottom: 1px solid var(--line);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-logo { font-size: 14px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink); }
.nav-cta  { font-size: 13px; color: var(--accent); text-decoration: none; font-weight: 600; }
.nav-cta:hover { text-decoration: underline; }

/* ── ヒーロー ─────────────────────────────── */
.hero {
  background: var(--ink);
  padding: 88px 48px 96px;
  color: #fff;
}
.hero-inner { max-width: 680px; margin: 0 auto; }

.hero-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  margin: 0 0 24px;
}

.hero-title {
  font-size: clamp(34px, 5vw, 58px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
  margin: 0 0 24px;
  text-wrap: balance;
}

.hero-body {
  font-size: 16px;
  line-height: 1.85;
  color: #94a3b8;
  margin: 0 0 32px;
  max-width: 520px;
}

.hero-meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 36px;
}
.hero-price  { font-size: 44px; font-weight: 900; letter-spacing: -0.05em; color: var(--accent); font-variant-numeric: tabular-nums; }
.hero-tax    { font-size: 13px; font-weight: 400; color: #64748b; margin-left: 4px; vertical-align: middle; }
.hero-slash  { font-size: 20px; color: #475569; }
.hero-period { font-size: 18px; color: #94a3b8; }

.hero-btn {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 4px;
  transition: background 0.15s;
}
.hero-btn:hover { background: var(--accent-h); }

/* ── バンド共通 ───────────────────────────── */
.band       { padding: 72px 48px; }
.band-white { background: #fff; }
.band-gray  { background: var(--bg-gray); }
.band-accent { background: var(--accent); }

.inner { max-width: 720px; margin: 0 auto; }

.label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--ink-3);
  font-family: ui-monospace, monospace; margin: 0 0 10px;
}
.label-light { color: rgba(255,255,255,0.6); }
.heading { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 36px; color: var(--ink); text-wrap: balance; }
.heading-light { color: #fff; }

/* ── 機能リスト ───────────────────────────── */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--line);
}

.feature-item {
  display: flex;
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;
}

.feature-check {
  width: 24px;
  height: 24px;
  background: var(--accent);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

.feature-title { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 6px; }
.feature-body  { font-size: 13px; color: var(--ink-2); margin: 0; line-height: 1.75; }

/* ── 技術スタック ─────────────────────────── */
.stack-note {
  font-size: 13px;
  color: var(--ink-3);
  margin: -20px 0 28px;
  padding: 12px 14px;
  background: #fff;
  border-left: 3px solid var(--line);
  border-radius: 0 4px 4px 0;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 560px) { .stack-grid { grid-template-columns: repeat(2, 1fr); } }

.stack-item {
  padding: 18px 16px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 8px;
}
.stack-layer { font-size: 10px; font-weight: 700; color: var(--ink-3); font-family: ui-monospace, monospace; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px; }
.stack-tech  { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0; }

/* ── やらないこと ─────────────────────────── */
.oos-lead {
  font-size: 14px;
  color: var(--ink-3);
  margin: -20px 0 28px;
}

.oos-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.oos-item {
  display: flex;
  gap: 20px;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;
}

.oos-x {
  width: 24px;
  height: 24px;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

.oos-title { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 6px; }
.oos-body  { font-size: 13px; color: var(--ink-2); margin: 0; line-height: 1.75; }

/* ── 料金 ─────────────────────────────────── */
.price-inner { text-align: center; }
.price-block { display: inline-block; }
.price-main   { font-size: 56px; font-weight: 900; letter-spacing: -0.05em; color: #fff; margin: 0 0 4px; font-variant-numeric: tabular-nums; line-height: 1; }
.price-tax    { font-size: 14px; font-weight: 400; opacity: 0.7; margin-left: 6px; vertical-align: middle; }
.price-period { font-size: 16px; color: rgba(255,255,255,0.7); margin: 0 0 16px; }
.price-desc   { font-size: 14px; color: rgba(255,255,255,0.75); margin: 0; }

/* ── CTA ──────────────────────────────────── */
.cta-section .inner { text-align: center; }
.cta-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 14px; text-wrap: balance; }
.cta-body  { font-size: 15px; color: var(--ink-2); margin: 0 0 32px; }
.cta-btn {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  padding: 15px 36px;
  border-radius: 4px;
  transition: background 0.15s;
}
.cta-btn:hover { background: var(--accent-h); }
.cta-fine { font-size: 12px; color: var(--ink-3); margin: 14px 0 0; }

/* ── フッター ─────────────────────────────── */
.footer {
  border-top: 1px solid var(--line);
  padding: 24px 48px;
  font-size: 12px;
  color: var(--ink-3);
  background: #fff;
  font-family: ui-monospace, monospace;
}

@media (max-width: 600px) {
  .nav    { padding: 14px 20px; }
  .hero   { padding: 60px 20px 72px; }
  .band   { padding: 56px 20px; }
  .footer { padding: 20px; }
}
</style>
