<script setup lang="ts">
useHead({ title: "APIセキュリティ診断くん — APIの公開状況を診断する無料ツール" });
useSeoMeta({ description: "URLとAPIのベースパスを入力するだけで、Swagger/OpenAPIを自動探索してエンドポイントが認証なしで公開されていないか診断する無料ツールです。" });
</script>

<template>
  <div class="page">
    <header class="nav">
      <span class="nav-logo">APIセキュリティ診断くん</span>
      <NuxtLink to="/api-security" class="nav-cta">無料で診断する →</NuxtLink>
    </header>

    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">API Security · by movee</p>
        <h1 class="hero-title">
          そのAPIエンドポイント、<br />
          <span class="hero-accent">誰でも叩ける状態になっていませんか。</span>
        </h1>
        <p class="hero-lead">
          URLとAPIのベースパスを入力するだけで、Swagger/OpenAPIを自動探索。
          エンドポイントが認証なしで外部から実行できる状態になっていないか診断します。
        </p>
        <NuxtLink to="/api-security" class="hero-btn">無料で診断する</NuxtLink>
      </div>
    </section>

    <section class="band band-dark">
      <div class="inner">
        <p class="label">PROBLEM</p>
        <h2 class="heading">こういうケースが実際にあります</h2>
        <div class="problem-grid">
          <div class="problem-card">
            <p class="problem-title">/api/users が認証なしで全件返る</p>
            <p class="problem-body">ユーザー一覧APIに認証ガードをつけ忘れたまま本番にデプロイされていることがあります。</p>
          </div>
          <div class="problem-card">
            <p class="problem-title">Swagger UIが本番に残ったまま</p>
            <p class="problem-body">開発用に設定したAPIドキュメントが本番環境で外部公開され、全エンドポイントの仕様が丸見えになります。</p>
          </div>
          <div class="problem-card">
            <p class="problem-title">GraphQLイントロスペクションが有効</p>
            <p class="problem-body">GraphQLのスキーマ探索機能が有効なままだと、APIの全構造を外部から取得できます。</p>
          </div>
          <div class="problem-card">
            <p class="problem-title">/api/admin が404ではなく200を返す</p>
            <p class="problem-body">管理者向けAPIが認証なしで正常レスポンスを返している状態は、情報漏洩・操作リスクがあります。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band band-mid">
      <div class="inner">
        <p class="label">HOW IT WORKS</p>
        <h2 class="heading">診断の流れ</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">01</div>
            <p class="step-title">URLとベースパスを入力</p>
            <p class="step-body">診断したいサイトのURLと、APIのベースパス（/api・/v1 など）を入力します。</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">02</div>
            <p class="step-title">Swagger/OpenAPIを自動探索</p>
            <p class="step-body">ベースパス配下の13パターンを自動チェックし、API仕様書が公開されていないか確認します。</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">03</div>
            <p class="step-title">エンドポイントを診断</p>
            <p class="step-body">仕様書が見つかればそこから全エンドポイントを取得。なければ典型的なパスを当てて公開状況を確認します。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="band band-accent">
      <div class="inner">
        <p class="label label-light">PRICING</p>
        <h2 class="heading heading-light">料金</h2>
        <p class="price-num">無料</p>
        <p class="price-desc">URLとメールアドレスを入力するだけで、詳細レポートが届きます。</p>
      </div>
    </section>

    <section class="band band-dark">
      <div class="inner cta-inner">
        <h2 class="cta-title">自社APIの公開状況、<br />一度確認してみませんか。</h2>
        <NuxtLink to="/api-security" class="hero-btn">無料診断を始める</NuxtLink>
        <p class="cta-fine">登録不要・クレジットカード不要</p>
      </div>
    </section>

    <footer class="footer">
      <p>APIセキュリティ診断くん by movee</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  --dark:   #020817;
  --mid:    #0a1628;
  --light:  #f8fafc;
  --ink:    #f1f5f9;
  --ink-2:  #94a3b8;
  --ink-3:  #475569;
  --accent: #06b6d4;
  --accent-d:#0891b2;
  --line:   #1e293b;

  background: var(--dark);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 40px; background: var(--dark);
  border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 10;
}
.nav-logo { font-size: 13px; font-weight: 700; color: var(--ink); font-family: ui-monospace, monospace; }
.nav-cta  { font-size: 13px; color: var(--accent); text-decoration: none; font-weight: 600; }
.nav-cta:hover { text-decoration: underline; }

.hero       { background: var(--dark); padding: 88px 40px 96px; text-align: center; }
.hero-inner { max-width: 680px; margin: 0 auto; }

.kicker {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--accent);
  font-family: ui-monospace, monospace; margin: 0 0 24px;
}

.hero-title {
  font-size: clamp(28px, 5vw, 48px); font-weight: 900;
  letter-spacing: -0.04em; line-height: 1.15; text-wrap: balance;
  margin: 0 0 28px; color: #fff;
}
.hero-accent { color: var(--accent); }

.hero-lead {
  font-size: 15px; line-height: 1.85; color: var(--ink-2);
  margin: 0 auto 40px; max-width: 520px;
}

.hero-btn {
  display: inline-block; background: var(--accent); color: #fff;
  text-decoration: none; font-size: 14px; font-weight: 700;
  padding: 14px 32px; border-radius: 4px; transition: background 0.15s;
}
.hero-btn:hover { background: var(--accent-d); }

.band       { padding: 72px 40px; }
.band-dark  { background: var(--mid); }
.band-mid   { background: #0f172a; }
.band-accent { background: var(--accent); }

.inner { max-width: 800px; margin: 0 auto; }

.label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--accent);
  font-family: ui-monospace, monospace; margin: 0 0 12px;
}
.label-light { color: rgba(255,255,255,0.7); }

.heading { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 36px; text-wrap: balance; }
.heading-light { color: #fff; }

.problem-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 560px) { .problem-grid { grid-template-columns: 1fr; } }

.problem-card {
  background: rgba(255,255,255,0.04); border: 1px solid var(--line);
  border-radius: 10px; padding: 22px 20px;
}
.problem-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.problem-body  { font-size: 12px; color: var(--ink-2); margin: 0; line-height: 1.7; }

.steps { display: flex; align-items: flex-start; }
.step  { flex: 1; padding: 0 24px; }
.step:first-child { padding-left: 0; }
.step:last-child  { padding-right: 0; }
.step-arrow { flex-shrink: 0; font-size: 18px; color: #94a3b8; padding-top: 18px; }
.step-num   { font-size: 32px; font-weight: 900; color: var(--accent); font-family: ui-monospace, monospace; line-height: 1; margin-bottom: 12px; }
.step-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 6px; }
.step-body  { font-size: 12px; color: var(--ink-2); margin: 0; line-height: 1.7; }
@media (max-width: 600px) {
  .steps { flex-direction: column; gap: 24px; }
  .step  { padding: 0; }
  .step-arrow { display: none; }
}

.price-num  { font-size: 40px; font-weight: 900; color: #fff; line-height: 1; margin: 0 0 10px; }
.price-desc { font-size: 13px; color: rgba(255,255,255,0.75); margin: 0; }

.cta-inner { text-align: center; }
.cta-title { font-size: clamp(20px, 3vw, 28px); font-weight: 800; letter-spacing: -0.03em; color: #fff; margin: 0 0 32px; text-wrap: balance; line-height: 1.3; }
.cta-fine  { font-size: 11px; color: var(--ink-3); margin: 14px 0 0; }

.footer { background: var(--dark); border-top: 1px solid var(--line); padding: 24px 40px; font-size: 11px; color: var(--ink-3); font-family: ui-monospace, monospace; }

@media (max-width: 600px) {
  .hero { padding: 60px 20px 72px; }
  .band { padding: 56px 20px; }
  .nav  { padding: 14px 20px; }
  .footer { padding: 20px; }
}
</style>
