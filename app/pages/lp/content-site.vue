<script setup lang="ts">
useHead({ title: "育つWebサイト — コンテンツを積み上げる仕組みが最初から入ったWebサイト" });
useSeoMeta({ description: "公開して終わりではなく、記事を書くたびに育っていく仕組みを最初から備えたWebサイト構築パッケージ。CMS・コンテンツ管理・お知らせ投稿をセットで提供します。" });
</script>

<template>
  <div class="page">

    <!-- ナビ -->
    <header class="nav">
      <span class="nav-logo">育つWebサイト</span>
      <a href="mailto:info@movee.jp" class="nav-cta">相談する →</a>
    </header>

    <!-- ヒーロー: 左ダークパネル / 右テキスト -->
    <section class="hero">
      <div class="hero-panel">
        <span class="panel-label">CONTENT SITE</span>
        <span class="panel-byline">by movee</span>
      </div>
      <div class="hero-main">
        <h1 class="hero-title">
          書くたびに、<br />資産になる。
        </h1>
        <p class="hero-lead">
          コンテンツを積み上げる仕組みを、最初から。<br />
          記事やお知らせを自分で投稿できるWebサイトを<br />
          まるごと作ります。
        </p>
        <a href="mailto:info@movee.jp" class="hero-btn">無料相談はこちら</a>
      </div>
    </section>

    <main>

      <!-- 問題: プルクォートスタイル -->
      <section class="section-problem">
        <div class="inner">
          <p class="eyebrow">PROBLEM</p>
          <div class="problem-quotes">
            <p class="problem-q">サイトを作ったまま、ほぼ更新していない。</p>
            <p class="problem-q">記事を追加するのに、制作会社に頼む必要がある。</p>
            <p class="problem-q">SNSで発信しているのに、サイトに資産として残らない。</p>
          </div>
          <p class="problem-note">
            更新しにくいサイトは、作った瞬間から古くなっていきます。
            このパッケージは「書き続けられる仕組み」を、立ち上げ時から組み込みます。
          </p>
        </div>
      </section>

      <!-- 特徴: ルール区切りの縦並び -->
      <section class="section-features">
        <div class="inner">
          <p class="eyebrow">WHAT YOU GET</p>
          <div class="feature-list">
            <div class="feature-row">
              <div class="feature-label">
                <span class="feature-num">01</span>
                <span class="feature-name">自分で更新できる</span>
              </div>
              <p class="feature-body">
                使い慣れた管理画面から、コードなしで記事・お知らせを投稿できます。
                制作会社への依頼は不要。書きたいときに、すぐ書けます。
              </p>
            </div>
            <div class="feature-row">
              <div class="feature-label">
                <span class="feature-num">02</span>
                <span class="feature-name">書いた記事が資産になる</span>
              </div>
              <p class="feature-body">
                投稿した記事はサイトに蓄積され、検索エンジンにインデックスされます。
                SNSのように流れることなく、時間が経つほど価値が増します。
              </p>
            </div>
            <div class="feature-row">
              <div class="feature-label">
                <span class="feature-num">03</span>
                <span class="feature-name">表示が速い</span>
              </div>
              <p class="feature-body">
                WordPress REST API + Next.js の構成で作るため、WordPressテーマ型のサイトより表示が速く、
                SEOにも有利です。デザインの制約もありません。
              </p>
            </div>
            <div class="feature-row">
              <div class="feature-label">
                <span class="feature-num">04</span>
                <span class="feature-name">後から拡張できる</span>
              </div>
              <p class="feature-body">
                予約フォーム・会員機能・ECカートなど、事業の成長に合わせて
                機能を追加できる設計で作ります。作り直しは不要です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 比較表 -->
      <section class="section-compare">
        <div class="inner">
          <p class="eyebrow">COMPARISON</p>
          <div class="compare-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th class="col-label"></th>
                  <th class="col-other">Wix / Squarespace</th>
                  <th class="col-other">WordPressテーマ型</th>
                  <th class="col-this">育つWebサイト</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="row-label">デザイン自由度</td>
                  <td>テンプレート制限あり</td>
                  <td>テーマに依存</td>
                  <td class="td-this">完全カスタム</td>
                </tr>
                <tr>
                  <td class="row-label">表示速度</td>
                  <td>普通〜遅い</td>
                  <td>プラグインで重くなりやすい</td>
                  <td class="td-this">速い（Next.js）</td>
                </tr>
                <tr>
                  <td class="row-label">コンテンツ管理</td>
                  <td>あり</td>
                  <td>あり</td>
                  <td class="td-this">あり（WordPress管理画面）</td>
                </tr>
                <tr>
                  <td class="row-label">機能拡張</td>
                  <td>プラットフォーム依存</td>
                  <td>プラグイン依存</td>
                  <td class="td-this">制限なし</td>
                </tr>
                <tr>
                  <td class="row-label">月額ランニング</td>
                  <td>月額プランが必要</td>
                  <td>サーバー代のみ</td>
                  <td class="td-this">サーバー代のみ</td>
                </tr>
                <tr>
                  <td class="row-label">サービス終了リスク</td>
                  <td>プラットフォーム依存</td>
                  <td>低い</td>
                  <td class="td-this">低い</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- おすすめ/おすすめできない -->
      <section class="section-fit">
        <div class="inner">
          <p class="eyebrow">FOR WHOM</p>
          <div class="fit-grid">
            <div class="fit-col fit-yes">
              <p class="fit-heading">こんな方におすすめ</p>
              <ul class="fit-list">
                <li>ブログ・事例・お知らせを定期的に発信していきたい</li>
                <li>制作会社に頼まず、自分でサイトを更新したい</li>
                <li>SEOや検索流入を長期的に育てていきたい</li>
                <li>テンプレートに縛られず、ブランドに合ったデザインにしたい</li>
                <li>事業の成長に合わせて機能を追加していく予定がある</li>
              </ul>
            </div>
            <div class="fit-col fit-no">
              <p class="fit-heading">おすすめできない方</p>
              <ul class="fit-list">
                <li>サイトを作ったらほぼ更新しない予定（シンプルな静的サイトで十分です）</li>
                <li>数日以内に公開したい（制作期間3週間が必要です）</li>
                <li>コンテンツを誰が書くかまだ決まっていない</li>
                <li>とにかく安ければいい（Wix等の月額サービスの方が初期費用は抑えられます）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 含まれるもの: スペックシート -->
      <section class="section-spec">
        <div class="inner">
          <p class="eyebrow">WHAT'S INCLUDED</p>
          <h2 class="spec-heading">含まれるもの</h2>
          <div class="spec-cols">
            <ul class="spec-list">
              <li>トップページ</li>
              <li>会社概要・サービスページ</li>
              <li>お問い合わせフォーム</li>
              <li>ブログ・お知らせ一覧ページ</li>
              <li>ブログ・お知らせ詳細ページ</li>
              <li>レスポンシブ対応（PC・スマートフォン）</li>
            </ul>
            <ul class="spec-list">
              <li>記事投稿・編集・削除</li>
              <li>カテゴリー・タグ管理</li>
              <li>アイキャッチ画像設定</li>
              <li>お知らせ・ニュース投稿</li>
              <li>独自ドメイン設定サポート</li>
            </ul>
          </div>
          <p class="spec-tech">技術構成: WordPress REST API + Next.js</p>
        </div>
      </section>

      <!-- 料金: ダーク・大きな数字のみ -->
      <section class="section-price">
        <div class="price-inner">
          <p class="price-eyebrow">PRICE</p>
          <p class="price-amount">¥400,000</p>
          <p class="price-tax">税抜 · 納期の目安3週間</p>
          <p class="price-note">ドメイン・サーバー費用は別途 / 追加機能は別途見積もり</p>
        </div>
      </section>

      <!-- CTA -->
      <section class="section-cta">
        <div class="inner cta-inner">
          <p class="cta-lead">まずは、どんなサイトを作りたいか聞かせてください。</p>
          <a href="mailto:info@movee.jp" class="cta-email">info@movee.jp</a>
          <p class="cta-note">返信は営業日2日以内を目安にしています</p>
        </div>
      </section>

    </main>

    <footer class="footer">
      <span>育つWebサイト by movee</span>
    </footer>

  </div>
</template>

<style scoped>
/* ── トークン ───────────────────────────── */
.page {
  --paper:    #F4F0E8;
  --ink:      #1A1A14;
  --ink-2:    #5A5648;
  --ink-3:    #8C8878;
  --forest:   #2E6B3E;
  --forest-d: #1E4A2A;
  --lime:     #C8E63C;
  --rule:     #D4CEC0;
  --dark:     #1A1A14;

  background: var(--paper);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── ナビ ───────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
  position: sticky;
  top: 0;
  z-index: 20;
}
.nav-logo {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.nav-cta {
  font-size: 13px;
  color: var(--forest);
  font-weight: 600;
  text-decoration: none;
}
.nav-cta:hover { text-decoration: underline; }

/* ── ヒーロー ───────────────────────────── */
.hero {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 88svh;
  min-height: 88vh;
}
@media (max-width: 640px) {
  .hero { grid-template-columns: 56px 1fr; min-height: auto; }
}

.hero-panel {
  background: var(--dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 48px 0;
}

.panel-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--lime);
  font-family: ui-monospace, monospace;
}

.panel-byline {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 10px;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.3);
  font-family: ui-monospace, monospace;
}

@media (max-width: 640px) {
  .panel-label  { font-size: 8px; letter-spacing: 0.15em; }
  .panel-byline { display: none; }
}

.hero-main {
  background: var(--paper);
  padding: 80px 72px 80px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 640px) {
  .hero-main { padding: 56px 28px 60px 24px; }
}

.hero-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1.05;
  color: var(--ink);
  margin: 0 0 32px;
  text-wrap: balance;
}

.hero-lead {
  font-size: 17px;
  line-height: 2;
  color: var(--ink-2);
  margin: 0 0 44px;
  max-width: 480px;
}

.hero-btn {
  display: inline-block;
  background: var(--forest);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 13px 28px;
  letter-spacing: 0.02em;
  transition: background 0.15s;
  align-self: flex-start;
}
.hero-btn:hover { background: var(--forest-d); }

/* ── 共通 ───────────────────────────────── */
.inner { max-width: 860px; margin: 0 auto; padding: 0 40px; }
@media (max-width: 600px) { .inner { padding: 0 20px; } }

.eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  margin: 0 0 32px;
}

/* ── 問題 ───────────────────────────────── */
.section-problem {
  padding: 80px 0 72px;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
}

.problem-quotes {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 40px;
}

.problem-q {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(19px, 2.8vw, 24px);
  font-weight: 400;
  font-style: italic;
  color: var(--ink);
  margin: 0;
  padding: 20px 0 20px 24px;
  border-left: 2px solid var(--forest);
  border-bottom: 1px solid var(--rule);
  line-height: 1.45;
}
.problem-q:last-child { border-bottom: none; }

.problem-note {
  font-size: 14px;
  line-height: 1.9;
  color: var(--ink-3);
  margin: 0;
  max-width: 560px;
  padding-left: 24px;
}

/* ── 特徴 ───────────────────────────────── */
.section-features {
  padding: 80px 0;
  border-bottom: 1px solid var(--rule);
}

.feature-list {
  display: flex;
  flex-direction: column;
}

.feature-row {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  padding: 36px 0;
  border-bottom: 1px solid var(--rule);
  align-items: start;
}
.feature-row:first-child { border-top: 1px solid var(--rule); }

@media (max-width: 640px) {
  .feature-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 28px 0;
  }
}

.feature-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-num {
  font-size: 11px;
  font-weight: 700;
  color: var(--forest);
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em;
}

.feature-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.feature-body {
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-2);
  margin: 0;
  padding-top: 4px;
}

/* ── スペックシート ──────────────────────── */
.section-spec {
  padding: 80px 0;
  border-bottom: 1px solid var(--rule);
  background: #EDEAE0;
}

.spec-heading {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  margin: -16px 0 32px;
  letter-spacing: -0.02em;
}

.spec-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;
  border-top: 1px solid var(--rule);
  padding-top: 0;
}
@media (max-width: 560px) { .spec-cols { grid-template-columns: 1fr; } }

.spec-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.spec-list li {
  font-size: 14px;
  color: var(--ink-2);
  padding: 11px 0;
  border-bottom: 1px solid var(--rule);
  padding-left: 16px;
  position: relative;
  line-height: 1.5;
}
.spec-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--forest);
  font-size: 11px;
  font-weight: 700;
  top: 14px;
}

/* ── 比較表 ─────────────────────────────── */
.section-compare {
  padding: 80px 0;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
}

.compare-wrap {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 560px;
}

.compare-table thead th {
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-family: ui-monospace, monospace;
  border-bottom: 2px solid var(--ink);
  white-space: nowrap;
}

.col-label { width: 140px; color: var(--ink-3); }
.col-other { color: var(--ink-3); font-weight: 400; }
.col-this  { color: var(--forest); }

.compare-table tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-2);
  line-height: 1.5;
  vertical-align: top;
}

.row-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink) !important;
}

.td-this {
  color: var(--forest) !important;
  font-weight: 700;
}

.compare-table tbody tr:last-child td { border-bottom: none; }

/* ── おすすめ ────────────────────────────── */
.section-fit {
  padding: 80px 0;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
}

.fit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-top: 1px solid var(--rule);
}
@media (max-width: 640px) { .fit-grid { grid-template-columns: 1fr; } }

.fit-col {
  padding: 32px 0;
}
.fit-col + .fit-col {
  padding-left: 40px;
  border-left: 1px solid var(--rule);
}
@media (max-width: 640px) {
  .fit-col + .fit-col { padding-left: 0; border-left: none; border-top: 1px solid var(--rule); }
}

.fit-heading {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.03em;
  margin: 0 0 20px;
}
.fit-yes .fit-heading { color: var(--forest); }
.fit-no  .fit-heading { color: var(--ink-3); }

.fit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.fit-list li {
  font-size: 14px;
  line-height: 1.65;
  padding: 10px 0 10px 20px;
  border-bottom: 1px solid var(--rule);
  position: relative;
  color: var(--ink-2);
}
.fit-list li:last-child { border-bottom: none; }
.fit-list li::before {
  position: absolute;
  left: 0;
  top: 12px;
  font-size: 11px;
  font-weight: 700;
}
.fit-yes .fit-list li::before { content: "○"; color: var(--forest); }
.fit-no  .fit-list li::before { content: "×"; color: var(--ink-3); }

/* ── スペック ────────────────────────────── */
.spec-tech {
  margin: 24px 0 0;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: var(--ink-3);
  letter-spacing: 0.05em;
}

/* ── 料金 ───────────────────────────────── */
.section-price {
  background: var(--dark);
  padding: 0;
}

.price-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 80px 40px 72px;
}

.price-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: rgba(255,255,255,0.3);
  font-family: ui-monospace, monospace;
  margin: 0 0 20px;
}

.price-amount {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(56px, 10vw, 100px);
  font-weight: 700;
  letter-spacing: -0.05em;
  color: var(--lime);
  margin: 0 0 12px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.price-tax {
  font-size: 15px;
  color: rgba(255,255,255,0.55);
  margin: 0 0 12px;
}

.price-note {
  font-size: 13px;
  color: rgba(255,255,255,0.3);
  margin: 0;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.02em;
}

/* ── CTA ────────────────────────────────── */
.section-cta {
  padding: 88px 0 80px;
  border-top: 1px solid var(--rule);
}

.cta-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cta-lead {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 24px;
  line-height: 1.5;
  text-wrap: balance;
}

.cta-email {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(22px, 4vw, 36px);
  font-weight: 700;
  color: var(--forest);
  text-decoration: none;
  letter-spacing: -0.01em;
  border-bottom: 2px solid var(--forest);
  padding-bottom: 2px;
  transition: opacity 0.15s;
}
.cta-email:hover { opacity: 0.7; }

.cta-note {
  font-size: 12px;
  color: var(--ink-3);
  margin: 14px 0 0;
  font-family: ui-monospace, monospace;
}

/* ── フッター ───────────────────────────── */
.footer {
  border-top: 1px solid var(--rule);
  padding: 20px 40px;
  font-size: 11px;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  letter-spacing: 0.05em;
  background: var(--paper);
}
@media (max-width: 600px) { .footer { padding: 18px 20px; } }
</style>
