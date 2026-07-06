<script setup lang="ts">
useHead({
  title: "flexpress — WordPressをAPI化してNext.jsで高速化するパッケージ",
});
</script>

<template>
  <div class="page">
    <header class="nav">
      <span class="nav-logo">flexpress</span>
      <a href="mailto:info@movee.jp" class="nav-cta">相談する →</a>
    </header>

    <!-- ヒーロー（インディゴ帯） -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">by movee</p>
        <h1 class="hero-title">
          WordPressはそのままで、<br />美しく、速く、安全に。
        </h1>
        <p class="hero-body">
          コンテンツもデータも移行しません。WordPressをAPIとして使い、
          Next.js製のフロントエンドを新しく作ります。
          表示速度・セキュリティ・レイアウトの自由度が、まとめて変わります。
        </p>
        <a href="mailto:info@movee.jp" class="hero-btn">相談・お問い合わせ</a>
      </div>
    </section>

    <!-- ボディ -->
    <main>
      <!-- 課題セクション（白） -->
      <section class="band band-white">
        <div class="inner">
          <p class="label">PROBLEM</p>
          <h2 class="heading">WordPressのままで起きていること</h2>
          <div class="cards">
            <div class="card">
              <span class="card-num">01</span>
              <p class="card-title">セキュリティリスクが残り続ける</p>
              <p class="card-body">
                WordPressの管理画面が外部に露出している限り、攻撃対象になります。Next.js化後は管理画面を外部から隠す構成にできます。
              </p>
            </div>
            <div class="card">
              <span class="card-num">02</span>
              <p class="card-title">表示速度がなかなか改善しない</p>
              <p class="card-body">
                テーマとプラグインが増えるほど重くなる構造です。最適化には限界があります。
              </p>
            </div>
            <div class="card">
              <span class="card-num">03</span>
              <p class="card-title">レイアウト変更にテーマの制約がかかる</p>
              <p class="card-body">
                デザインを自由に変えたくても、テーマの構造に縛られます。Next.jsでは制約がありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 仕組みセクション（グレー） -->
      <section class="band band-gray">
        <div class="inner">
          <p class="label">HOW IT WORKS</p>
          <h2 class="heading">仕組みとやること</h2>
          <p class="subhead">
            WordPressはそのまま動かし続けます。記事の編集・追加はこれまで通りです。
            変わるのはユーザーに見える画面だけです。
          </p>
          <div class="alert-box">
            WordPressのデータ・コンテンツ・投稿の移行作業は一切ありません
          </div>
          <div class="steps">
            <div class="step">
              <div class="step-head">
                <span class="step-tag">BUILD</span>
                <p class="step-title">
                  WordPress API化 + Next.js フロントエンド実装
                </p>
              </div>
              <p class="step-body">
                WordPress REST API
                経由でコンテンツを取得し、Next.jsで画面を作ります。レイアウトはゼロから設計するため、テーマの制約がありません。
              </p>
            </div>
            <div class="step">
              <div class="step-head">
                <span class="step-tag">DEPLOY</span>
                <p class="step-title">Cloudflare Pages へのデプロイ</p>
              </div>
              <p class="step-body">
                GitHub連携・ビルド設定・DNS切り替えまで行います。本番公開後、既存WordPressは管理画面のみに切り替えます。
              </p>
            </div>
            <div class="step">
              <div class="step-head">
                <span class="step-tag">CHECK</span>
                <p class="step-title">公開後の動作確認</p>
              </div>
              <p class="step-body">
                本番公開後1週間、表示崩れ・リンク切れ・フォームの動作確認をサポートします。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 対象・対象外（白） -->
      <section class="band band-white">
        <div class="inner">
          <p class="label">SCOPE</p>
          <h2 class="heading">対象・対象外について</h2>
          <div class="prereq">
            <p class="prereq-label">前提条件</p>
            <ul>
              <li>WordPressのパーマリンク設定が「投稿名」になっている、または変更できる</li>
              <li>テキスト・画像・動画を発信するWebサイト・ホームページであり、独自機能を持たない</li>
            </ul>
          </div>

          <div class="scope-grid">
            <div class="scope-box scope-ok">
              <p class="scope-label">対象ページ</p>
              <ul>
                <li>トップページ</li>
                <li>ブログ一覧・詳細ページ</li>
                <li>ニュース一覧・詳細ページ</li>
                <li>お問い合わせページ</li>
              </ul>
            </div>
            <div class="scope-box scope-ng">
              <p class="scope-label">対象外</p>
              <ul>
                <li>上記4種以外のページ</li>
                <li>ECサイト・会員機能・ログイン機能</li>
                <li>既存のWordPressデザインをそのまま再現する要件</li>
                <li>WordPressプラグインの動作保証・移植</li>
              </ul>
            </div>
          </div>
          <p class="scope-note">
            該当するか判断がつかない場合は、まずご相談ください。
            規模・構成によって対応できるかどうか個別に確認します。
          </p>
        </div>
      </section>

      <!-- 料金（アクセントストライプ） -->
      <section class="band band-accent">
        <div class="inner">
          <p class="label label-light">PRICING</p>
          <h2 class="heading heading-light">料金</h2>
          <div class="price-wrap">
            <div class="price-left">
              <p class="price-tag">パッケージ料金</p>
              <p class="price-num">¥500,000</p>
              <p class="price-tax">税抜</p>
            </div>
            <div class="price-right">
              <p>・納期の目安：契約から4週間</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA（白） -->
      <section class="band band-white">
        <div class="inner cta-inner">
          <h2 class="cta-title">まずは話だけでも</h2>
          <p class="cta-body">
            サイトのURLをメールで送っていただければ、
            対応できるかどうかと概算を2〜3営業日以内にお伝えします。
          </p>
          <a href="mailto:info@movee.jp" class="cta-btn">
            info@movee.jp に送る
          </a>
          <p class="cta-fine">見積もりは無料・返信はかならずします</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>flexpress by movee</p>
    </footer>
  </div>
</template>

<style scoped>
/* ── トークン ─────────────────────────────────────── */
.page {
  --indigo: #4338ca;
  --indigo-d: #3730a3;
  --amber: #d97706;
  --ink: #111827;
  --ink-2: #4b5563;
  --ink-3: #9ca3af;
  --white: #ffffff;
  --gray: #f3f4f6;
  --line: #e5e7eb;
  --ok: #059669;
  --ok-bg: #ecfdf5;
  --ng: #dc2626;
  --ng-bg: #fef2f2;

  background: var(--white);
  color: var(--ink);
  font-family:
    -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* dark mode */
@media (prefers-color-scheme: dark) {
  .page {
    --indigo: #6366f1;
    --indigo-d: #4f46e5;
    --white: #111827;
    --gray: #1f2937;
    --ink: #f9fafb;
    --ink-2: #9ca3af;
    --ink-3: #6b7280;
    --line: #374151;
    --ok: #10b981;
    --ok-bg: #064e3b;
    --ng: #f87171;
    --ng-bg: #7f1d1d;
  }
}
:root[data-theme="dark"] .page {
  --indigo: #6366f1;
  --indigo-d: #4f46e5;
  --white: #111827;
  --gray: #1f2937;
  --ink: #f9fafb;
  --ink-2: #9ca3af;
  --ink-3: #6b7280;
  --line: #374151;
  --ok: #10b981;
  --ok-bg: #064e3b;
  --ng: #f87171;
  --ng-bg: #7f1d1d;
}
:root[data-theme="light"] .page {
  --indigo: #4338ca;
  --indigo-d: #3730a3;
  --white: #ffffff;
  --gray: #f3f4f6;
  --ink: #111827;
  --ink-2: #4b5563;
  --ink-3: #9ca3af;
  --line: #e5e7eb;
  --ok: #059669;
  --ok-bg: #ecfdf5;
  --ng: #dc2626;
  --ng-bg: #fef2f2;
}

/* ── ナビ ─────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  background: var(--white);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-logo {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: var(--indigo);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}

.nav-cta {
  font-size: 13px;
  color: var(--indigo);
  text-decoration: none;
  font-weight: 600;
  padding: 7px 16px;
  border: 1.5px solid var(--indigo);
  border-radius: 20px;
  transition:
    background 0.15s,
    color 0.15s;
}
.nav-cta:hover {
  background: var(--indigo);
  color: #fff;
}

/* ── ヒーロー（インディゴ帯） ─────────────────────── */
.hero {
  background: var(--indigo);
  padding: 72px 40px 80px;
}

.hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.hero-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #a5b4fc;
  margin: 0 0 20px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}

.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.1;
  text-wrap: balance;
  margin: 0 0 24px;
  color: #fff;
}

.hero-body {
  font-size: 15px;
  line-height: 1.85;
  color: #c7d2fe;
  margin: 0 0 36px;
  max-width: 520px;
}

.hero-btn {
  display: inline-block;
  background: var(--amber);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 13px 28px;
  border-radius: 4px;
  letter-spacing: 0.02em;
  transition: opacity 0.15s;
}
.hero-btn:hover {
  opacity: 0.88;
}

/* ── バンド共通 ───────────────────────────────────── */
.band {
  padding: 64px 40px;
}
.band-white {
  background: var(--white);
}
.band-gray {
  background: var(--gray);
}
.band-accent {
  background: var(--indigo);
}

.inner {
  max-width: 640px;
  margin: 0 auto;
}

/* ── ラベル・見出し ───────────────────────────────── */
.label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--indigo);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  margin: 0 0 12px;
}
.label-light {
  color: #a5b4fc;
}

.heading {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 28px;
  color: var(--ink);
  text-wrap: balance;
}
.heading-light {
  color: #fff;
}

.subhead {
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1.8;
  margin: 0 0 24px;
  max-width: 520px;
}

/* ── カード（課題） ───────────────────────────────── */
.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  padding: 20px 22px;
  background: var(--gray);
  border-radius: 8px;
  border-top: 3px solid var(--indigo);
}

.card-num {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--indigo);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  display: block;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 6px;
}

.card-body {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0;
  line-height: 1.7;
}

/* ── アラートボックス ─────────────────────────────── */
.alert-box {
  font-size: 12px;
  font-weight: 700;
  padding: 11px 18px;
  background: var(--white);
  border: 2px solid var(--amber);
  border-radius: 4px;
  color: var(--amber);
  margin-bottom: 28px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  letter-spacing: 0.01em;
}

/* ── ステップ ─────────────────────────────────────── */
.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}
.step:last-child {
  border-bottom: none;
}

.step-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.step-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #fff;
  background: var(--indigo);
  padding: 2px 7px;
  border-radius: 3px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  flex-shrink: 0;
}

.step-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.step-body {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0;
  line-height: 1.75;
  padding-left: calc(9px * 2 + 12px + 7px);
}

/* ── 前提条件 ─────────────────────────────────────── */
.prereq {
  background: var(--gray);
  border-left: 3px solid var(--indigo);
  border-radius: 0 6px 6px 0;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.prereq-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--indigo);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  margin: 0 0 10px;
}

.prereq ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prereq li {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.6;
  padding-left: 16px;
  position: relative;
}

.prereq li::before {
  content: "·";
  position: absolute;
  left: 4px;
  color: var(--indigo);
  font-size: 16px;
  line-height: 1.3;
}

/* ── スコープ ─────────────────────────────────────── */
.scope-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 540px) {
  .scope-grid {
    grid-template-columns: 1fr;
  }
}

.scope-box {
  border-radius: 8px;
  padding: 18px 20px;
}
.scope-ok {
  background: var(--ok-bg);
}
.scope-ng {
  background: var(--ng-bg);
}

.scope-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 12px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}
.scope-ok .scope-label {
  color: var(--ok);
}
.scope-ng .scope-label {
  color: var(--ng);
}

.scope-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scope-box li {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.6;
  padding-left: 14px;
  position: relative;
}
.scope-ok li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--ok);
  font-size: 10px;
}
.scope-ng li::before {
  content: "✕";
  position: absolute;
  left: 0;
  color: var(--ng);
  font-size: 10px;
}

.scope-note {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.75;
  margin: 0;
}

/* ── 料金 ─────────────────────────────────────────── */
.price-wrap {
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

@media (max-width: 480px) {
  .price-wrap {
    flex-direction: column;
    gap: 20px;
  }
}

.price-left {
  flex-shrink: 0;
}

.price-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a5b4fc;
  margin: 0 0 6px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}

.price-num {
  font-size: 44px;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: #fff;
  margin: 0;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.price-tax {
  font-size: 12px;
  color: #a5b4fc;
  margin: 4px 0 0;
}

.price-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}
.price-right p {
  font-size: 13px;
  color: #c7d2fe;
  margin: 0;
  line-height: 1.6;
}

/* ── CTA ──────────────────────────────────────────── */
.cta-inner {
  text-align: left;
}

.cta-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 14px;
}

.cta-body {
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1.8;
  margin: 0 0 28px;
  max-width: 440px;
}

.cta-btn {
  display: inline-block;
  background: var(--indigo);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 13px 28px;
  border-radius: 4px;
  letter-spacing: 0.01em;
  transition: background 0.15s;
}
.cta-btn:hover {
  background: var(--indigo-d);
}

.cta-fine {
  font-size: 11px;
  color: var(--ink-3);
  margin: 12px 0 0;
}

/* ── フッター ──────────────────────────────────────── */
.footer {
  background: var(--gray);
  border-top: 1px solid var(--line);
  padding: 24px 40px;
  font-size: 12px;
  color: var(--ink-3);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}

/* ── レスポンシブ ──────────────────────────────────── */
@media (max-width: 600px) {
  .hero {
    padding: 48px 20px 60px;
  }
  .band {
    padding: 48px 20px;
  }
  .nav {
    padding: 14px 20px;
  }
  .footer {
    padding: 20px;
  }
}
</style>
