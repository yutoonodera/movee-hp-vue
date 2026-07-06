<script setup lang="ts">
useHead({ title: "Wordpressの非機能診断くん — WordPressサイトの問題を確認する" });
useSeoMeta({ description: "WordPressサイトのURLを入力するだけで、表示速度・セキュリティ・使いやすさをA/B/Cで診断。プラグインの影響・セキュリティヘッダー未設定・管理画面の露出などを無料で確認できます。" });
</script>

<template>
  <div class="page">
    <!-- nav -->
    <header class="nav">
      <span class="nav-logo">Wordpressの非機能診断くん</span>
      <NuxtLink to="/wp-hikinou" class="nav-cta">無料で診断する →</NuxtLink>
    </header>

    <main class="content">

      <!-- hero -->
      <section class="hero">
        <p class="eyebrow">Wordpressの非機能診断くん</p>
        <h1 class="headline">
          WordPressサイトの<br>
          見えない問題を確認する。
        </h1>
        <p class="lead">
          表示速度・セキュリティ・使いやすさ。どれも目に見えない部分です。
          WordPressサイトのURLを入れるだけで、現状をA/B/Cで確認できます。
        </p>
        <NuxtLink to="/wp-hikinou" class="btn-primary">無料診断を試してみる</NuxtLink>
      </section>

      <hr class="divider" />

      <!-- problem -->
      <section class="section">
        <h2 class="section-title">WordPressで起きやすいこと</h2>
        <ul class="problem-list">
          <li>
            <span class="problem-mark">—</span>
            <span>プラグインとテーマが増えるほど、表示が遅くなっていく</span>
          </li>
          <li>
            <span class="problem-mark">—</span>
            <span>セキュリティヘッダーが設定されておらず、攻撃の対象になりやすい</span>
          </li>
          <li>
            <span class="problem-mark">—</span>
            <span>管理画面（/wp-admin）が外部に露出したままになっている</span>
          </li>
          <li>
            <span class="problem-mark">—</span>
            <span>プラグイン経由のSQLインジェクションリスクが放置されている</span>
          </li>
        </ul>
        <p class="note">
          これらはすべて、WordPressの構造上起きやすい非機能の問題です。
          URLを入れるだけで、今どのくらい問題があるかをA/B/Cで確認できます。
        </p>
      </section>

      <hr class="divider" />

      <!-- what you get -->
      <section class="section">
        <h2 class="section-title">診断でわかること</h2>
        <div class="check-grid">
          <div class="check-item">
            <div class="check-header">
              <span class="check-label">表示速度</span>
              <span class="grade grade-b">B</span>
            </div>
            <p class="check-desc">
              GoogleのLighthouseでモバイル表示速度を計測します。
              プラグインやテーマの影響でどのくらい遅くなっているかを確認します。
            </p>
          </div>
          <div class="check-item">
            <div class="check-header">
              <span class="check-label">セキュリティ</span>
              <span class="grade grade-c">C</span>
            </div>
            <p class="check-desc">
              セキュリティヘッダーの設定・管理画面の露出・SQLインジェクションリスクを確認します。
              WordPressに特有のリスクに絞っています。
            </p>
          </div>
          <div class="check-item">
            <div class="check-header">
              <span class="check-label">使いやすさ</span>
              <span class="grade grade-b">B</span>
            </div>
            <p class="check-desc">
              コントラスト比・ラベル設定・スクリーンリーダー対応などを確認します。
              テーマ由来のアクセシビリティ問題は見落とされがちです。
            </p>
          </div>
        </div>
      </section>

      <hr class="divider" />

      <!-- how -->
      <section class="section">
        <h2 class="section-title">使い方</h2>
        <div class="steps">
          <div class="step">
            <span class="step-num">1</span>
            <div>
              <p class="step-title">URLとメールアドレスを入力する</p>
              <p class="step-desc">診断したいページのURLを直接入力してください。指定したページのみを診断します。</p>
            </div>
          </div>
          <div class="step">
            <span class="step-num">2</span>
            <div>
              <p class="step-title">30秒〜1分待つ</p>
              <p class="step-desc">指定した1ページを分析します。複数ページの一括収集はしません。</p>
            </div>
          </div>
          <div class="step">
            <span class="step-num">3</span>
            <div>
              <p class="step-title">結果をページとメールで確認する</p>
              <p class="step-desc">画面にはA/B/Cの評価と主な問題点を表示します。詳細な対策内容はメールでお送りします。</p>
            </div>
          </div>
        </div>
      </section>

      <hr class="divider" />

      <!-- pricing -->
      <section class="section">
        <h2 class="section-title">料金について</h2>
        <div class="pricing-wrap">
          <p class="price-name">診断</p>
          <p class="price-amount">無料</p>
          <p class="price-detail">URLを入力するだけ。何度でも使えます。</p>
        </div>
      </section>

      <hr class="divider" />

      <!-- cta -->
      <section class="section cta-section">
        <h2 class="cta-title">WordPressサイト、一度確認してみませんか</h2>
        <p class="cta-sub">
          問題があるかどうかだけでも知っておくと、後の判断が変わります。
        </p>
        <NuxtLink to="/wp-hikinou" class="btn-primary">無料診断を始める</NuxtLink>
        <p class="cta-fine">登録不要・クレジットカード不要</p>
      </section>

    </main>

    <footer class="footer">
      <p>© movee</p>
    </footer>
  </div>
</template>

<style scoped>
/* ── トークン ─────────────────────────────────── */
.page {
  --bg:        #ECEAE5;
  --bg-alt:    #F7F6F3;
  --ink:       #18180E;
  --ink-2:     #6B6860;
  --ink-3:     #B2AFA9;
  --accent:    #1B4F72;
  --line:      #D4D1CA;
  --grade-a:   #2E7D32;
  --grade-b:   #E65100;
  --grade-c:   #B71C1C;
  --step-bg:   #F0EDE8;

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN",
               "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-color-scheme: dark) {
  .page {
    --bg:     #141410;
    --bg-alt: #1C1C18;
    --ink:    #E8E5DF;
    --ink-2:  #8A877F;
    --ink-3:  #4A4844;
    --accent: #5BA3CC;
    --line:   #2C2C28;
    --step-bg:#1E1E1A;
  }
}

:root[data-theme="dark"] .page {
  --bg:     #141410;
  --bg-alt: #1C1C18;
  --ink:    #E8E5DF;
  --ink-2:  #8A877F;
  --ink-3:  #4A4844;
  --accent: #5BA3CC;
  --line:   #2C2C28;
  --step-bg:#1E1E1A;
}

:root[data-theme="light"] .page {
  --bg:        #ECEAE5;
  --bg-alt:    #F7F6F3;
  --ink:       #18180E;
  --ink-2:     #6B6860;
  --ink-3:     #B2AFA9;
  --accent:    #1B4F72;
  --line:      #D4D1CA;
  --step-bg:   #F0EDE8;
}

/* ── レイアウト ────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-bottom: 1px solid var(--line);
}

.nav-logo {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--ink);
}

.nav-cta {
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}
.nav-cta:hover { text-decoration: underline; }

.content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

.divider {
  border: none;
  border-top: 1px solid var(--line);
  margin: 56px 0;
}

.section {
  margin: 0;
}

/* ── ヒーロー ──────────────────────────────────── */
.hero {
  padding: 72px 0 0;
}

.eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-2);
  margin: 0 0 20px;
}

.headline {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.25;
  text-wrap: balance;
  margin: 0 0 24px;
  color: var(--ink);
}

.lead {
  font-size: 16px;
  color: var(--ink-2);
  line-height: 1.8;
  margin: 0 0 36px;
  max-width: 480px;
}

/* ── ボタン ────────────────────────────────────── */
.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 13px 28px;
  border-radius: 4px;
  letter-spacing: 0.01em;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }

/* ── セクションタイトル ──────────────────────────── */
.section-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 28px;
  color: var(--ink);
}

/* ── 問題リスト ────────────────────────────────── */
.problem-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.problem-list li {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: var(--ink);
}

.problem-mark {
  color: var(--ink-3);
  flex-shrink: 0;
  width: 16px;
}

.note {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.8;
  margin: 0;
  padding: 16px 20px;
  background: var(--bg-alt);
  border-left: 3px solid var(--line);
}

/* ── チェック項目 ──────────────────────────────── */
.check-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.check-item {
  padding: 20px 22px;
  background: var(--bg-alt);
  border-radius: 6px;
}

.check-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.check-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ink-2);
}

.grade {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
}
.grade-a { color: var(--grade-a); }
.grade-b { color: var(--grade-b); }
.grade-c { color: var(--grade-c); }

.check-desc {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.75;
  margin: 0;
}

/* ── ステップ ──────────────────────────────────── */
.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}
.step:last-child { border-bottom: none; }

.step-num {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-3);
  flex-shrink: 0;
  width: 20px;
  padding-top: 3px;
  font-variant-numeric: tabular-nums;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--ink);
}

.step-desc {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0;
  line-height: 1.7;
}

/* ── 料金 ──────────────────────────────────────── */
.pricing-wrap {
  background: var(--bg-alt);
  border-radius: 8px;
  padding: 28px 24px;
}

.price-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.price-item {
  flex: 1;
}

.price-divider {
  font-size: 20px;
  color: var(--ink-3);
  flex-shrink: 0;
  padding-top: 18px;
}

.price-name {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-2);
  margin: 0 0 8px;
}

.price-amount {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin: 0 0 10px;
  line-height: 1.1;
}

.tax {
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-3);
  margin-left: 4px;
  vertical-align: middle;
}

.price-detail {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 480px) {
  .price-row { flex-direction: column; }
  .price-divider { padding: 0; align-self: center; }
}

/* ── CTA ────────────────────────────────────────── */
.cta-section {
  text-align: left;
}

.cta-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  text-wrap: balance;
}

.cta-sub {
  font-size: 14px;
  color: var(--ink-2);
  margin: 0 0 28px;
}

.cta-fine {
  font-size: 11px;
  color: var(--ink-3);
  margin: 12px 0 0;
}

/* ── フッター ──────────────────────────────────── */
.footer {
  border-top: 1px solid var(--line);
  padding: 24px 32px;
  font-size: 12px;
  color: var(--ink-3);
}

/* ── レスポンシブ ───────────────────────────────── */
@media (max-width: 600px) {
  .content { padding: 0 20px 60px; }
  .nav { padding: 16px 20px; }
  .hero { padding-top: 48px; }
}
</style>
