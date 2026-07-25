<script setup lang="ts">
useHead({ title: "接点顧客アプローチ分析 — 眠っている接点を、売上に変える by movee" });
useSeoMeta({ description: "名刺・SNS・LINE・イベント参加者など、接点はあるのにアプローチできていない顧客を毎月可視化。優先リストを届けるサブスクサービスです。" });
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
        <p class="hero-kicker">by movee · 接点顧客アプローチ分析</p>
        <h1 class="hero-title">
          顧客は、<br />もうそこにいる。
        </h1>
        <p class="hero-body">
          名刺・SNS・LINE・イベント参加者・過去の見積り先——<br />
          接点はあるのに、アプローチできていない人が必ずいます。<br />
          毎月「この人たちに連絡してください」というリストを届けます。
        </p>
        <div class="hero-stats">
          <div class="hero-stat">
            <p class="stat-num">多くの企業</p>
            <p class="stat-label">が接点顧客の<br />半数以上に未アプローチ</p>
          </div>
          <div class="hero-stat-div"></div>
          <div class="hero-stat">
            <p class="stat-num">休眠期間</p>
            <p class="stat-label">6ヶ月以上の接点が<br />最も受注確度が高い</p>
          </div>
        </div>
        <a href="mailto:info@movee.jp" class="hero-btn">相談・お問い合わせ</a>
      </div>
    </section>

    <main>

      <!-- 課題提示 -->
      <section class="band band-white">
        <div class="inner">
          <p class="eyebrow">PROBLEM</p>
          <h2 class="heading">「見込み客がいない」のではなく、<br />「動けていない」だけかもしれない。</h2>
          <div class="problem-grid">
            <div class="problem-item">
              <p class="problem-icon">📇</p>
              <p class="problem-text">展示会で集めた名刺が<br />Sansan やスプレッドシートに眠っている</p>
            </div>
            <div class="problem-item">
              <p class="problem-icon">📱</p>
              <p class="problem-text">SNS でつながっているのに<br />何ヶ月も連絡していない人がいる</p>
            </div>
            <div class="problem-item">
              <p class="problem-icon">📄</p>
              <p class="problem-text">過去に見積りを出したけれど<br />その後フォローしていない案件がある</p>
            </div>
            <div class="problem-item">
              <p class="problem-icon">🎤</p>
              <p class="problem-text">セミナーや勉強会に来てくれた人に<br />一度も連絡していない</p>
            </div>
          </div>
          <p class="problem-summary">
            これらは全部「接点資産」です。新規開拓より受注確度が高いのに、<br />
            多くの会社が可視化できず、動けないまま機会を失っています。
          </p>
        </div>
      </section>

      <!-- PHASE 01 -->
      <section class="band band-alt">
        <div class="inner">
          <p class="phase-tag phase-tag-1">PHASE 01 · 接点データの整理と設計</p>
          <h2 class="heading">まず、接点を「資産」として整える。</h2>
          <p class="section-lead">散らばっている接点データを一ヶ所に集め、「誰に・いつ・どのチャネルで接触したか」を追える状態にします。難しいツールは不要。今あるデータから始めます。</p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">🗂️</div>
              <div>
                <p class="feature-title">接点チャネルの棚卸し</p>
                <p class="feature-desc">名刺・SNS・LINE・メール・イベントリストなど、どこに誰がいるかを整理します。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔧</div>
              <div>
                <p class="feature-title">データ統合と整形</p>
                <p class="feature-desc">スプレッドシート・Sansan・CRM など、既存ツールのデータを分析可能な形に整えます。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📐</div>
              <div>
                <p class="feature-title">アプローチ基準の設計</p>
                <p class="feature-desc">「○ヶ月以上未接触＝優先」など、毎月のレポートで使う判定ロジックを設計します。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div>
                <p class="feature-title">初回レポートの作成</p>
                <p class="feature-desc">現時点でのアプローチ状況を可視化した第一回レポートを納品し、運用を開始します。</p>
              </div>
            </div>
          </div>

          <div class="price-box">
            <p class="price-label">PHASE 01 · PRICE</p>
            <p class="price-amount">¥150,000 <span class="price-unit">（税抜・一括）</span></p>
            <p class="price-note">接点データの量・チャネル数により変動する場合があります。まずご相談ください。</p>
          </div>
        </div>
      </section>

      <!-- PHASE 02 -->
      <section class="band band-white">
        <div class="inner">
          <p class="phase-tag phase-tag-2">PHASE 02 · 月次アプローチ分析</p>
          <h2 class="heading">毎月、「動くべき人」が届く。</h2>
          <p class="section-lead">毎月、未アプローチ・長期未接触の接点を自動で抽出し、「今月連絡すべきリスト」として届けます。誰に連絡するか迷わなくなります。</p>

          <div class="phase2-items">
            <div class="phase2-item">
              <p class="phase2-item-title">📋 未アプローチリスト</p>
              <p class="phase2-item-desc">新たに接点が生まれた人・一定期間アプローチできていない人を毎月抽出して届けます。</p>
            </div>
            <div class="phase2-item">
              <p class="phase2-item-title">📈 アプローチ率の推移</p>
              <p class="phase2-item-desc">全接点のうち何割にアプローチできているか。カバレッジが上がると受注も上がります。</p>
            </div>
            <div class="phase2-item">
              <p class="phase2-item-title">🎯 優先度スコアリング</p>
              <p class="phase2-item-desc">休眠期間・接触チャネル・過去のやりとりをもとに、連絡の優先順位をつけてお渡しします。</p>
            </div>
          </div>

          <div class="report-image">
            <div class="report-mock">
              <div class="mock-header">
                <span class="mock-dot red"></span>
                <span class="mock-dot yellow"></span>
                <span class="mock-dot green"></span>
                <span class="mock-title">今月のアプローチレポート</span>
              </div>
              <div class="mock-body">
                <div class="mock-row header-row">
                  <span>氏名 / 会社</span>
                  <span>最終接触</span>
                  <span>チャネル</span>
                  <span>優先度</span>
                </div>
                <div class="mock-row">
                  <span>山田 太郎 / 株式会社○○</span>
                  <span class="red-text">8ヶ月前</span>
                  <span>展示会</span>
                  <span class="badge high">高</span>
                </div>
                <div class="mock-row">
                  <span>鈴木 花子 / △△商事</span>
                  <span class="orange-text">5ヶ月前</span>
                  <span>SNS</span>
                  <span class="badge mid">中</span>
                </div>
                <div class="mock-row">
                  <span>田中 一郎 / □□工業</span>
                  <span class="orange-text">4ヶ月前</span>
                  <span>見積り</span>
                  <span class="badge mid">中</span>
                </div>
                <div class="mock-row faded">
                  <span>・・・ 計 24名</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="price-box price-box-white">
            <p class="price-label">PHASE 02 · PRICE</p>
            <p class="price-amount">¥50,000 <span class="price-unit">税抜 / 月</span></p>
            <p class="price-note">最低契約期間 6ヶ月。以降は月次更新。PHASE 01と独立して契約可。</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="band band-alt">
        <div class="inner inner-narrow">
          <h2 class="heading">よくある質問</h2>
          <div class="faq-list">
            <div class="faq-item">
              <p class="faq-q">どんなデータがあれば始められますか？</p>
              <p class="faq-a">Excelや Google スプレッドシートの連絡先リストがあれば始められます。Sansan・kintone・HubSpot などのエクスポートデータも対応します。「整っていない」状態でもまずご相談ください。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">SNS のつながりはどうやってデータにしますか？</p>
              <p class="faq-a">SNS はエクスポート機能やスプレッドシートへの手動記録を組み合わせて対応します。すべて自動化する必要はなく、「毎月更新できる仕組み」を一緒に設計します。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">レポートはどんな形式で届きますか？</p>
              <p class="faq-a">スプレッドシート・PDF・ダッシュボード共有など、使いやすい形式で納品します。月次ミーティングでの説明にも対応します。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">PHASE 01 なしで月次だけ依頼できますか？</p>
              <p class="faq-a">接点データが整理されている場合は PHASE 02 のみも可能です。まず現状をヒアリングさせてください。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-band">
        <div class="inner">
          <h2 class="cta-title">まず、接点リストを見せてください。</h2>
          <p class="cta-body">どれだけ「眠っている接点」があるか、一緒に確認するところから始めます。</p>
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
  padding: 18px 48px; border-bottom: 1px solid #E2E8F0;
  position: sticky; top: 0; background: #fff; z-index: 10;
}
.nav-logo {
  font-size: 18px; font-weight: 800; letter-spacing: -0.04em;
  color: #0F172A; font-family: ui-monospace, monospace; text-decoration: none;
}
.nav-cta { font-size: 14px; font-weight: 700; color: #0891B2; text-decoration: none; }
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
.hero-stats {
  display: flex; align-items: center; gap: 24px; margin-bottom: 40px;
  background: #fff; border: 1px solid #BAE6FD; border-radius: 12px; padding: 24px 28px;
}
.hero-stat { flex: 1; }
.stat-num {
  font-size: 15px; font-weight: 800; color: #0891B2;
  margin: 0 0 4px; letter-spacing: -0.02em;
}
.stat-label { font-size: 12px; color: #64748B; margin: 0; line-height: 1.5; }
.hero-stat-div { width: 1px; height: 40px; background: #E0F2FE; flex-shrink: 0; }
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

.eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
  color: #0891B2; font-family: ui-monospace, monospace;
  text-transform: uppercase; margin: 0 0 16px;
}
.phase-tag {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
  font-family: ui-monospace, monospace; text-transform: uppercase;
  margin: 0 0 12px; padding: 4px 10px; border-radius: 4px; display: inline-block;
}
.phase-tag-1 { color: #0891B2; background: #E0F2FE; }
.phase-tag-2 { color: #0E7490; background: #CFFAFE; }

.heading {
  font-size: clamp(22px, 4vw, 34px); font-weight: 800;
  letter-spacing: -0.03em; margin: 0 0 16px; color: #0F172A; text-wrap: balance;
}
.section-lead {
  font-size: 15px; color: #475569; line-height: 1.85;
  margin: 0 0 40px; max-width: 640px;
}

/* Problem */
.problem-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;
}
@media (max-width: 600px) { .problem-grid { grid-template-columns: 1fr; } }
.problem-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 20px; background: #F8FAFC;
  border: 1px solid #E2E8F0; border-radius: 10px;
}
.problem-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
.problem-text { font-size: 14px; color: #334155; line-height: 1.7; margin: 0; }
.problem-summary {
  font-size: 15px; color: #475569; line-height: 1.85;
  text-align: center; margin: 0; padding: 24px;
  background: #EFF6FF; border-radius: 10px; border: 1px solid #BFDBFE;
}

/* Feature list */
.feature-list { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px; }
@media (max-width: 600px) { .feature-list { grid-template-columns: 1fr; } }
.feature-item {
  display: flex; gap: 16px; padding: 24px;
  border: 1px solid #E2E8F0; border-radius: 10px; background: #fff;
}
.feature-icon { font-size: 24px; flex-shrink: 0; line-height: 1; }
.feature-title { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 6px; }
.feature-desc { font-size: 13px; color: #475569; margin: 0; line-height: 1.7; }

/* Phase 2 items */
.phase2-items { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 40px; }
@media (max-width: 640px) { .phase2-items { grid-template-columns: 1fr; } }
.phase2-item { padding: 24px; background: #F0FDFF; border: 1px solid #BAE6FD; border-radius: 10px; }
.phase2-item-title { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 10px; }
.phase2-item-desc { font-size: 13px; color: #475569; line-height: 1.75; margin: 0; }

/* Report mock */
.report-image { margin-bottom: 48px; }
.report-mock {
  border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,.06);
}
.mock-header {
  background: #F8FAFC; padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
  display: flex; align-items: center; gap: 8px;
}
.mock-dot { width: 10px; height: 10px; border-radius: 50%; }
.mock-dot.red    { background: #FC8181; }
.mock-dot.yellow { background: #F6E05E; }
.mock-dot.green  { background: #68D391; }
.mock-title { font-size: 12px; color: #64748B; margin-left: 8px; font-weight: 600; }
.mock-body { padding: 0; }
.mock-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 20px; border-bottom: 1px solid #F1F5F9;
  font-size: 13px; color: #334155; align-items: center; gap: 8px;
}
.mock-row.header-row {
  background: #F8FAFC; font-weight: 700;
  font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;
}
.mock-row.faded { color: #94A3B8; }
.red-text    { color: #DC2626; font-weight: 700; }
.orange-text { color: #D97706; font-weight: 700; }
.badge {
  display: inline-block; font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 100px;
}
.badge.high { background: #FEE2E2; color: #DC2626; }
.badge.mid  { background: #FEF3C7; color: #D97706; }

/* Price box */
.price-box {
  background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 28px 32px;
}
.price-box-white { background: #fff; }
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
.faq-list { display: flex; flex-direction: column; }
.faq-item { padding: 24px 0; border-bottom: 1px solid #BAE6FD; }
.faq-item:first-child { border-top: 1px solid #BAE6FD; }
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
.footer { border-top: 1px solid #E2E8F0; padding: 24px 48px; font-size: 14px; color: #94A3B8; }

@media (max-width: 640px) {
  .nav    { padding: 14px 20px; }
  .hero   { padding: 56px 20px 48px; }
  .band   { padding: 56px 20px; }
  .footer { padding: 20px; }
  .hero-stats { flex-direction: column; gap: 16px; }
  .hero-stat-div { width: 100%; height: 1px; }
  .price-box { padding: 20px; }
  .mock-row { grid-template-columns: 1.5fr 1fr 1fr 1fr; font-size: 11px; padding: 10px 12px; }
}
</style>
