<script setup lang="ts">
useHead({ title: "データ分析サブスク — 毎月の定点分析とレポートで意思決定を支える by movee" });
useSeoMeta({ description: "毎月同じ切り口でデータを分析し、意思決定に使えるレポートを届けます。初期設定後は自動で回り続ける仕組みを構築します。" });
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-logo">movee</NuxtLink>
      <a href="mailto:info@movee.jp" class="nav-cta">相談する →</a>
    </header>

    <!-- ヒーロー -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">by movee · データ分析サブスク</p>
        <h1 class="hero-title">
          データを、<br />判断に変える。
        </h1>
        <p class="hero-body">
          毎月同じ切り口でデータを分析し、意思決定に使えるレポートを届けます。<br />
          感覚に頼らず、数字で動ける会社にする仕組みを、まるごと構築します。
        </p>
        <div class="hero-phases">
          <div class="hero-phase">
            <span class="phase-num">01</span>
            <span class="phase-label">設計・構築</span>
            <span class="phase-sub">分析基盤を整える</span>
          </div>
          <div class="hero-arrow">→</div>
          <div class="hero-phase">
            <span class="phase-num">02</span>
            <span class="phase-label">定点分析</span>
            <span class="phase-sub">毎月レポートを届ける</span>
          </div>
        </div>
        <a href="mailto:info@movee.jp" class="hero-btn">相談・お問い合わせ</a>
      </div>
    </section>

    <main>

      <!-- PHASE 01 -->
      <section class="band band-white">
        <div class="inner">
          <p class="phase-tag phase-tag-1">PHASE 01 · 設計・構築</p>
          <h2 class="heading">分析の土台を、最初に作る。</h2>
          <p class="section-lead">どのデータを使い、何を毎月見るかを設計します。ツール設定・データ接続・ダッシュボード構築まで対応し、翌月から自動でレポートが届く仕組みにします。</p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div>
                <p class="feature-title">分析設計</p>
                <p class="feature-desc">「何を知りたいか」から逆算して、KPIと分析軸を定義します。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔗</div>
              <div>
                <p class="feature-title">データソース接続</p>
                <p class="feature-desc">スプレッドシート・CRM・GA4・POSなど、既存のデータを接続します。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🖥️</div>
              <div>
                <p class="feature-title">ダッシュボード構築</p>
                <p class="feature-desc">いつでも最新データを確認できるダッシュボードを設計・構築します。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📝</div>
              <div>
                <p class="feature-title">初回レポート作成</p>
                <p class="feature-desc">運用開始に向けて、フォーマットを確定した第一回レポートを納品します。</p>
              </div>
            </div>
          </div>

          <div class="price-box">
            <p class="price-label">PHASE 01 · PRICE</p>
            <p class="price-amount">¥150,000 <span class="price-unit">（税抜・一括）</span></p>
            <p class="price-note">内容によって変動する場合があります。まずはご相談ください。</p>
          </div>
        </div>
      </section>

      <!-- PHASE 02 -->
      <section class="band band-alt">
        <div class="inner">
          <p class="phase-tag phase-tag-2">PHASE 02 · 定点分析</p>
          <h2 class="heading">毎月、同じ目で数字を見る。</h2>
          <p class="section-lead">毎月決まった分析を実行し、変化・異常・傾向をまとめたレポートを届けます。担当者が変わっても、判断の軸がブレない仕組みになります。</p>

          <div class="phase2-items">
            <div class="phase2-item">
              <p class="phase2-item-title">📈 定点レポート</p>
              <p class="phase2-item-desc">毎月同じ指標を集計・可視化したレポートを納品。売上・集客・顧客動向など、業種に合わせた切り口で分析します。</p>
            </div>
            <div class="phase2-item">
              <p class="phase2-item-title">🔍 変化の読み取り</p>
              <p class="phase2-item-desc">先月比・前年同期比・目標対比で異常値や傾向を発見。「何が起きているか」を読み解いてコメントします。</p>
            </div>
            <div class="phase2-item">
              <p class="phase2-item-title">💡 アクション提言</p>
              <p class="phase2-item-desc">数字の読み取りに加え、次のアクションの提案もセットで届けます。分析で終わらず、経営判断につなげます。</p>
            </div>
          </div>

          <div class="price-box price-box-alt">
            <p class="price-label">PHASE 02 · PRICE</p>
            <p class="price-amount">¥50,000 <span class="price-unit">税抜 / 月</span></p>
            <p class="price-note">最低契約期間 6ヶ月。以降は月次更新。PHASE 01と独立して契約可。</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="band band-white">
        <div class="inner inner-narrow">
          <h2 class="heading">よくある質問</h2>
          <div class="faq-list">
            <div class="faq-item">
              <p class="faq-q">どんなデータが必要ですか？</p>
              <p class="faq-a">Excelやスプレッドシートで管理している売上データ、GA4などのWebアクセスデータ、POSや在庫データなど、すでに持っているものから始められます。まずご相談ください。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">レポートの形式は？</p>
              <p class="faq-a">PDF・スプレッドシート・ダッシュボード共有など、使いやすい形式で納品します。毎月のミーティングで説明する形にも対応できます。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">PHASE 01なしで月次だけ依頼できますか？</p>
              <p class="faq-a">既にデータ基盤が整っている場合はPHASE 02のみの契約も可能です。まず現状をヒアリングさせてください。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-band">
        <div class="inner">
          <h2 class="cta-title">まずは、現状のデータを見せてください。</h2>
          <p class="cta-body">何が分析できるか、どう活用できるかを一緒に考えます。</p>
          <a href="mailto:info@movee.jp" class="cta-btn">相談・問い合わせ</a>
        </div>
      </section>

    </main>

    <LpPackageNav current="data-analytics" />

    <footer class="footer">
      <p>© 株式会社movee</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  color: #0F172A;
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

/* Nav */
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 48px; border-bottom: 1px solid #E2E8F0; position: sticky; top: 0;
  background: #fff; z-index: 10;
}
.nav-logo {
  font-size: 18px; font-weight: 800; letter-spacing: -0.04em;
  color: #0F172A; font-family: ui-monospace, monospace; text-decoration: none;
}
.nav-cta {
  font-size: 14px; font-weight: 700; color: #0891B2; text-decoration: none;
}
.nav-cta:hover { text-decoration: underline; }

/* Hero */
.hero {
  background: linear-gradient(160deg, #F0FDFF 0%, #E0F2FE 60%, #F8FAFC 100%);
  padding: 80px 48px 72px;
}
.hero-inner { max-width: 640px; margin: 0 auto; }
.hero-kicker {
  font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
  color: #0891B2; font-family: ui-monospace, monospace;
  text-transform: uppercase; margin: 0 0 20px;
}
.hero-title {
  font-size: clamp(40px, 7vw, 72px); font-weight: 900;
  letter-spacing: -0.05em; line-height: 1.05;
  color: #0F172A; margin: 0 0 24px; text-wrap: balance;
}
.hero-body {
  font-size: 16px; line-height: 1.85; color: #475569;
  margin: 0 0 40px; max-width: 520px;
}
.hero-phases {
  display: flex; align-items: center; gap: 16px; margin-bottom: 40px; flex-wrap: wrap;
}
.hero-phase {
  display: flex; flex-direction: column; gap: 4px;
  background: #fff; border: 1px solid #BAE6FD; border-radius: 10px; padding: 16px 20px;
}
.phase-num { font-size: 11px; font-weight: 700; color: #0891B2; font-family: ui-monospace, monospace; }
.phase-label { font-size: 15px; font-weight: 800; color: #0F172A; }
.phase-sub { font-size: 12px; color: #64748B; }
.hero-arrow { font-size: 20px; color: #BAE6FD; font-weight: 300; }
.hero-btn {
  display: inline-block; background: #0891B2; color: #fff;
  font-size: 15px; font-weight: 700; padding: 14px 32px;
  border-radius: 10px; text-decoration: none; transition: background .15s;
}
.hero-btn:hover { background: #0E7490; }

/* Bands */
.band { padding: 72px 48px; }
.band-white { background: #fff; }
.band-alt { background: #F0FDFF; }
.inner { max-width: 840px; margin: 0 auto; }
.inner-narrow { max-width: 640px; margin: 0 auto; }

.phase-tag {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
  font-family: ui-monospace, monospace; text-transform: uppercase;
  margin: 0 0 12px; padding: 4px 10px; border-radius: 4px; display: inline-block;
}
.phase-tag-1 { color: #0891B2; background: #E0F2FE; }
.phase-tag-2 { color: #0E7490; background: #CFFAFE; }

.heading {
  font-size: clamp(24px, 4vw, 36px); font-weight: 800;
  letter-spacing: -0.03em; margin: 0 0 16px; color: #0F172A;
}
.section-lead {
  font-size: 15px; color: #475569; line-height: 1.85;
  margin: 0 0 40px; max-width: 640px;
}

/* Feature list */
.feature-list { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px; }
@media (max-width: 600px) { .feature-list { grid-template-columns: 1fr; } }

.feature-item {
  display: flex; gap: 16px; padding: 24px;
  border: 1px solid #E2E8F0; border-radius: 10px; background: #F8FAFC;
}
.feature-icon { font-size: 24px; flex-shrink: 0; line-height: 1; }
.feature-title { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 6px; }
.feature-desc { font-size: 13px; color: #475569; margin: 0; line-height: 1.7; }

/* Phase 2 items */
.phase2-items { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 48px; }
@media (max-width: 640px) { .phase2-items { grid-template-columns: 1fr; } }

.phase2-item { padding: 24px; background: #fff; border: 1px solid #BAE6FD; border-radius: 10px; }
.phase2-item-title { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 10px; }
.phase2-item-desc { font-size: 13px; color: #475569; line-height: 1.75; margin: 0; }

/* Price box */
.price-box {
  background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 28px 32px;
}
.price-box-alt { background: #fff; }
.price-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
  color: #0891B2; font-family: ui-monospace, monospace;
  text-transform: uppercase; margin: 0 0 8px;
}
.price-amount {
  font-size: 32px; font-weight: 900; letter-spacing: -0.03em;
  color: #0F172A; margin: 0 0 8px; font-variant-numeric: tabular-nums;
}
.price-unit { font-size: 16px; font-weight: 400; color: #64748B; }
.price-note { font-size: 13px; color: #64748B; margin: 0; }

/* FAQ */
.faq-list { display: flex; flex-direction: column; gap: 0; }
.faq-item { padding: 24px 0; border-bottom: 1px solid #E2E8F0; }
.faq-item:first-child { border-top: 1px solid #E2E8F0; }
.faq-q { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 10px; }
.faq-a { font-size: 14px; color: #475569; margin: 0; line-height: 1.8; }

/* CTA */
.cta-band { background: #0891B2; padding: 72px 48px; text-align: center; }
.cta-title {
  font-size: clamp(22px, 4vw, 32px); font-weight: 800;
  color: #fff; margin: 0 0 16px; letter-spacing: -0.03em; text-wrap: balance;
}
.cta-body { font-size: 15px; color: rgba(255,255,255,.8); margin: 0 0 32px; }
.cta-btn {
  display: inline-block; background: #fff; color: #0891B2;
  font-size: 15px; font-weight: 700; padding: 14px 40px;
  border-radius: 10px; text-decoration: none; transition: opacity .15s;
}
.cta-btn:hover { opacity: .9; }

/* Footer */
.footer {
  border-top: 1px solid #E2E8F0; padding: 24px 48px;
  font-size: 14px; color: #94A3B8;
}

@media (max-width: 640px) {
  .nav    { padding: 14px 20px; }
  .hero   { padding: 56px 20px 48px; }
  .band   { padding: 56px 20px; }
  .footer { padding: 20px; }
  .hero-phases { gap: 10px; }
  .price-box { padding: 20px; }
}
</style>
