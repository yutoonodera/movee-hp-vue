<script setup lang="ts">
useHead({ title: "AI開発の非機能診断くん — Next.js / Nuxt.jsのセキュリティを診断する" });
</script>

<template>
  <div class="page">

    <!-- nav -->
    <header class="nav">
      <span class="nav-logo">AI開発の非機能診断くん</span>
      <NuxtLink to="/ai-hikinou" class="nav-cta">無料で診断する →</NuxtLink>
    </header>

    <!-- ヒーロー（フルワイドダーク） -->
    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">Next.js / Nuxt.js 向け · by movee</p>
        <h1 class="hero-title">
          コードはAIが書いてくれる。<br />
          <span class="hero-accent">セキュリティは、誰が確認している？</span>
        </h1>
        <p class="hero-lead">
          AI開発は機能の実装スピードを大きく上げます。でも、セキュリティヘッダー・
          環境変数の漏洩・SQLインジェクションリスクは、AIが自動で担保してくれるわけではありません。
        </p>
        <NuxtLink to="/ai-hikinou" class="hero-btn">無料で診断する</NuxtLink>
      </div>
    </section>

    <!-- 問題（ダーク帯・4カード） -->
    <section class="band band-dark">
      <div class="inner">
        <p class="label">PROBLEM</p>
        <h2 class="heading">Next.js / Nuxt.js開発で見落とされやすいこと</h2>
        <div class="problem-grid">
          <div class="problem-card">
            <span class="problem-icon">🔓</span>
            <p class="problem-title">.envファイルの公開</p>
            <p class="problem-body">ビルド設定の誤りで.envがそのまま外部から取得できる状態になっているケースがあります。</p>
          </div>
          <div class="problem-card">
            <span class="problem-icon">📄</span>
            <p class="problem-title">HTMLへの環境変数漏洩</p>
            <p class="problem-body">NEXT_PUBLIC_やビルド変数がHTMLソースに含まれ、APIキーが公開されていることがあります。</p>
          </div>
          <div class="problem-card">
            <span class="problem-icon">🛡</span>
            <p class="problem-title">セキュリティヘッダー未設定</p>
            <p class="problem-body">CSP・HSTS・X-Frame-Optionsなど6項目がデフォルトのまま未設定で運用されています。</p>
          </div>
          <div class="problem-card">
            <span class="problem-icon">⚡</span>
            <p class="problem-title">LCPを一度も計測していない</p>
            <p class="problem-body">リリース後に表示速度を確認したことがなく、ユーザー体験に問題が残っている場合があります。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 診断内容（ミッドナイト帯・2カラム） -->
    <section class="band band-mid">
      <div class="inner">
        <p class="label">WHAT WE CHECK</p>
        <h2 class="heading">診断でわかること</h2>
        <div class="check-cols">
          <div class="check-col">
            <p class="check-col-label">セキュリティ</p>
            <ul class="check-list">
              <li><span class="check-dot critical"></span>.envファイルの外部公開チェック</li>
              <li><span class="check-dot critical"></span>HTMLソースの環境変数漏洩チェック</li>
              <li><span class="check-dot warning"></span>セキュリティヘッダー6項目の確認</li>
              <li><span class="check-dot warning"></span>PHP / SQLインジェクションリスクの検出</li>
              <li><span class="check-dot info"></span>HTTPS通信の確認</li>
            </ul>
          </div>
          <div class="check-col">
            <p class="check-col-label">表示速度（LCP）</p>
            <ul class="check-list">
              <li><span class="check-dot info"></span>Lighthouseでモバイル表示速度を計測</li>
              <li><span class="check-dot info"></span>LCP（最大コンテンツ描画）の値を確認</li>
              <li><span class="check-dot info"></span>パフォーマンススコアをA/B/Cで評価</li>
            </ul>
            <div class="check-note">
              セキュリティと表示速度の計測を並列実行。30秒〜1分で完了します。
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使い方（白帯・横3ステップ） -->
    <section class="band band-light">
      <div class="inner">
        <p class="label label-dark">HOW IT WORKS</p>
        <h2 class="heading heading-dark">使い方</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">01</div>
            <p class="step-title">URLを入力する</p>
            <p class="step-body">診断したいページのURLとメールアドレスを入力します。指定した1ページのみを診断します。</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">02</div>
            <p class="step-title">30秒〜1分待つ</p>
            <p class="step-body">セキュリティチェックとLCP計測を並列で実行します。ページを閉じずにお待ちください。</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">03</div>
            <p class="step-title">結果を確認する</p>
            <p class="step-body">画面に診断結果とセキュリティヘッダー一覧を表示します。詳細レポートはメールでお送りします。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 料金（シアン帯） -->
    <section class="band band-accent">
      <div class="inner">
        <p class="label label-light">PRICING</p>
        <h2 class="heading heading-light">料金</h2>
        <p class="price-num">無料</p>
        <p class="price-desc" style="color:rgba(255,255,255,0.8)">URLを入力するだけ。何度でも使えます。</p>
      </div>
    </section>

    <!-- CTA（ダーク帯） -->
    <section class="band band-dark">
      <div class="inner cta-inner">
        <h2 class="cta-title">Next.js / Nuxt.jsのサイト、<br />一度確認してみませんか</h2>
        <p class="cta-sub">問題があるかどうかだけでも知っておくと、後の判断が変わります。</p>
        <NuxtLink to="/ai-hikinou" class="hero-btn">無料診断を始める</NuxtLink>
        <p class="cta-fine">登録不要・クレジットカード不要</p>
      </div>
    </section>

    <footer class="footer">
      <p>AI開発の非機能診断くん by movee</p>
    </footer>
  </div>
</template>

<style scoped>
/* ── トークン ─────────────────────────────────────── */
.page {
  --dark:    #020817;
  --mid:     #0a1628;
  --slate:   #0f172a;
  --light:   #f8fafc;
  --ink:     #f1f5f9;
  --ink-2:   #94a3b8;
  --ink-3:   #475569;
  --accent:  #06b6d4;
  --accent-d:#0891b2;
  --line:    #1e293b;

  background: var(--dark);
  color: var(--ink);
  font-family:
    -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── ナビ ─────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  background: var(--dark);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-logo {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  letter-spacing: 0.02em;
}

.nav-cta {
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}
.nav-cta:hover { text-decoration: underline; }

/* ── ヒーロー ─────────────────────────────────────── */
.hero {
  background: var(--dark);
  padding: 88px 40px 96px;
  text-align: center;
}

.hero-inner {
  max-width: 680px;
  margin: 0 auto;
}

.kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  margin: 0 0 24px;
}

.hero-title {
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
  text-wrap: balance;
  margin: 0 0 28px;
  color: #fff;
}

.hero-accent {
  color: var(--accent);
}

.hero-lead {
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-2);
  margin: 0 0 40px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.hero-btn {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 4px;
  letter-spacing: 0.02em;
  transition: background 0.15s;
}
.hero-btn:hover { background: var(--accent-d); }

/* ── バンド共通 ───────────────────────────────────── */
.band { padding: 72px 40px; }
.band-dark  { background: var(--mid); }
.band-mid   { background: var(--slate); }
.band-light { background: var(--light); }
.band-accent { background: var(--accent); }

.inner {
  max-width: 800px;
  margin: 0 auto;
}

/* ── ラベル・見出し ───────────────────────────────── */
.label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  margin: 0 0 12px;
}
.label-dark  { color: var(--ink-3); }
.label-light { color: rgba(255,255,255,0.7); }

.heading {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 36px;
  color: var(--ink);
  text-wrap: balance;
}
.heading-dark  { color: #0f172a; }
.heading-light { color: #fff; }

/* ── 問題カードグリッド ───────────────────────────── */
.problem-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 560px) {
  .problem-grid { grid-template-columns: 1fr; }
}

.problem-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 22px 20px;
}

.problem-icon {
  font-size: 22px;
  display: block;
  margin-bottom: 10px;
}

.problem-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.problem-body {
  font-size: 12px;
  color: var(--ink-2);
  margin: 0;
  line-height: 1.7;
}

/* ── チェック2カラム ──────────────────────────────── */
.check-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 560px) {
  .check-cols { grid-template-columns: 1fr; gap: 24px; }
}

.check-col-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  margin: 0 0 14px;
}

.check-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--ink-2);
}

.check-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.check-dot.critical { background: #ef4444; }
.check-dot.warning  { background: #f59e0b; }
.check-dot.info     { background: var(--accent); }

.check-note {
  margin-top: 20px;
  padding: 12px 14px;
  background: rgba(6,182,212,0.08);
  border-left: 3px solid var(--accent);
  border-radius: 0 4px 4px 0;
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.7;
}

/* ── ステップ横並び ───────────────────────────────── */
.steps {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.step {
  flex: 1;
  padding: 0 24px;
}
.step:first-child { padding-left: 0; }
.step:last-child  { padding-right: 0; }

.step-arrow {
  flex-shrink: 0;
  font-size: 18px;
  color: #94a3b8;
  padding-top: 18px;
}

.step-num {
  font-size: 32px;
  font-weight: 900;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 12px;
}

.step-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.step-body {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.7;
}

@media (max-width: 600px) {
  .steps {
    flex-direction: column;
    gap: 24px;
  }
  .step { padding: 0; }
  .step-arrow { display: none; }
}

/* ── 料金 ─────────────────────────────────────────── */
.price-row {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

@media (max-width: 520px) {
  .price-row { flex-direction: column; gap: 20px; }
  .price-plus { display: none; }
}

.price-box { flex: 1; }

.price-plus {
  font-size: 24px;
  color: rgba(255,255,255,0.5);
  flex-shrink: 0;
  padding-top: 28px;
}

.price-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  font-family: ui-monospace, monospace;
  margin: 0 0 8px;
}

.price-num {
  font-size: 40px;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: #fff;
  line-height: 1;
  margin: 0 0 10px;
  font-variant-numeric: tabular-nums;
}

.price-tax {
  font-size: 12px;
  font-weight: 400;
  margin-left: 4px;
  vertical-align: middle;
  opacity: 0.7;
}

.price-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin: 0;
  line-height: 1.7;
}

/* ── CTA ──────────────────────────────────────────── */
.cta-inner { text-align: center; }

.cta-title {
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 16px;
  text-wrap: balance;
  line-height: 1.3;
}

.cta-sub {
  font-size: 14px;
  color: var(--ink-2);
  margin: 0 0 32px;
}

.cta-fine {
  font-size: 11px;
  color: var(--ink-3);
  margin: 14px 0 0;
}

/* ── フッター ──────────────────────────────────────── */
.footer {
  background: var(--dark);
  border-top: 1px solid var(--line);
  padding: 24px 40px;
  font-size: 11px;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
}

/* ── レスポンシブ ──────────────────────────────────── */
@media (max-width: 600px) {
  .hero   { padding: 60px 20px 72px; }
  .band   { padding: 56px 20px; }
  .nav    { padding: 14px 20px; }
  .footer { padding: 20px; }
}
</style>
