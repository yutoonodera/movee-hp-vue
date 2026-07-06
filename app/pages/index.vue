<script setup lang="ts">
useHead({ title: "株式会社movee — ソフトウェア開発・データ活用" });
</script>

<template>
  <div class="page">

    <!-- ナビ -->
    <header class="nav">
      <span class="nav-logo">movee</span>
      <nav class="nav-links">
        <NuxtLink to="/achievements">実績</NuxtLink>
        <a href="#contact">お問い合わせ</a>
      </nav>
    </header>

    <!-- ヒーロー -->
    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">SOFTWARE DEVELOPMENT &amp; DATA UTILIZATION</p>
        <h1 class="hero-title">ソフトウェアで、<br />データで、課題を解く。</h1>
        <p class="hero-lead">
          ソフトウェア開発とデータ活用で、事業の成長を支える会社です。<br class="br-pc" />
          福岡市を拠点に、Webサービスの開発・データ分析・可視化の支援を行っています。
        </p>
        <div class="hero-actions">
          <NuxtLink to="/achievements" class="btn-primary">実績を見る</NuxtLink>
          <a href="mailto:info@movee.jp" class="btn-ghost">お問い合わせ</a>
        </div>
      </div>
    </section>

    <!-- 冒頭ツール導線 -->
    <section class="band band-alt tool-strip">
      <div class="inner">
        <p class="label">FREE TOOLS</p>
        <div class="strip-list">
          <NuxtLink to="/lp/wp-hikinou" class="strip-row">
            <span class="strip-accent" style="background:#2563EB"></span>
            <span class="strip-name">Wordpressの非機能診断くん</span>
            <span class="strip-desc">表示速度・セキュリティ・使いやすさをURLを入れるだけで確認</span>
            <span class="strip-arrow">→</span>
          </NuxtLink>
          <NuxtLink to="/lp/ai-hikinou" class="strip-row">
            <span class="strip-accent" style="background:#0891B2"></span>
            <span class="strip-name">AI開発の非機能診断くん</span>
            <span class="strip-desc">Next.js / Nuxt.jsのenv漏洩・セキュリティヘッダー・LCPを診断</span>
            <span class="strip-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 事業内容 -->
    <section class="band">
      <div class="inner">
        <p class="label">SERVICES</p>
        <h2 class="heading">事業内容</h2>
        <div class="service-grid">
          <div class="service-card">
            <p class="service-icon">_</p>
            <h3 class="service-title">ソフトウェア開発</h3>
            <p class="service-body">
              WebサービスやSaaSの企画・開発・運用。Next.js・Nuxt.js・React・TypeScriptを中心としたモダンスタックで、品質と保守性を重視した開発を行います。要件定義から設計・実装まで一貫して対応します。
            </p>
          </div>
          <div class="service-card">
            <p class="service-icon">_</p>
            <h3 class="service-title">データ活用・可視化</h3>
            <p class="service-body">
              地図データ・センサーデータ・業務データを活用した分析とダッシュボード開発。意思決定に直結する形に整理・可視化し、データを「使える資産」にする支援をします。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- プロダクト -->
    <section class="band band-alt">
      <div class="inner">
        <p class="label">PRODUCTS</p>
        <h2 class="heading">プロダクト・無料ツール</h2>
        <div class="tools-grid">
          <NuxtLink to="/lp/wp-hikinou" class="tool-card">
            <div class="tool-top">
              <p class="tool-tag" style="color:#2563EB">無料診断ツール</p>
              <span class="tool-arrow">→</span>
            </div>
            <p class="tool-name">Wordpressの非機能診断くん</p>
            <p class="tool-desc">表示速度・セキュリティ・使いやすさをURLを入れるだけで確認</p>
          </NuxtLink>

          <NuxtLink to="/lp/ai-hikinou" class="tool-card">
            <div class="tool-top">
              <p class="tool-tag" style="color:#0891B2">無料診断ツール</p>
              <span class="tool-arrow">→</span>
            </div>
            <p class="tool-name">AI開発の非機能診断くん</p>
            <p class="tool-desc">Next.js / Nuxt.jsのenv漏洩・セキュリティヘッダー・LCPを診断</p>
          </NuxtLink>

          <div class="tool-card tool-inactive">
            <div class="tool-top">
              <p class="tool-tag" style="color:#D97706">β版公開中 · 今なら2ヶ月無料</p>
            </div>
            <p class="tool-name">TETSU-ATSU</p>
            <p class="tool-desc">詳細は近日公開予定</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 会社概要 -->
    <section class="band" id="contact">
      <div class="inner">
        <p class="label">COMPANY</p>
        <h2 class="heading">会社概要</h2>
        <dl class="profile">
          <div class="profile-row">
            <dt>会社名</dt>
            <dd>株式会社movee</dd>
          </div>
          <div class="profile-row">
            <dt>所在地</dt>
            <dd>福岡県福岡市中央区天神2丁目3-10 天神パインクレスト716</dd>
          </div>
          <div class="profile-row">
            <dt>代表</dt>
            <dd>小野寺 祐人</dd>
          </div>
          <div class="profile-row">
            <dt>お問い合わせ</dt>
            <dd><a href="mailto:info@movee.jp" class="link">info@movee.jp</a></dd>
          </div>
        </dl>
      </div>
    </section>

    <footer class="footer">
      <p>© 株式会社movee</p>
    </footer>

  </div>
</template>

<style scoped>
/* ── トークン ──────────────────────────────── */
.page {
  --bg:      #FFFFFF;
  --bg-alt:  #F8FAFC;
  --ink:     #0F172A;
  --ink-2:   #475569;
  --ink-3:   #94A3B8;
  --accent:  #1D4ED8;
  --accent-h:#1E40AF;
  --line:    #E2E8F0;

  background: var(--bg);
  color: var(--ink);
  font-family:
    -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-color-scheme: dark) {
  .page {
    --bg:     #0F172A;
    --bg-alt: #1E293B;
    --ink:    #F1F5F9;
    --ink-2:  #94A3B8;
    --ink-3:  #475569;
    --accent: #60A5FA;
    --accent-h:#93C5FD;
    --line:   #1E293B;
  }
}
:root[data-theme="dark"] .page {
  --bg:     #0F172A;
  --bg-alt: #1E293B;
  --ink:    #F1F5F9;
  --ink-2:  #94A3B8;
  --ink-3:  #475569;
  --accent: #60A5FA;
  --accent-h:#93C5FD;
  --line:   #1E293B;
}
:root[data-theme="light"] .page {
  --bg:      #FFFFFF;
  --bg-alt:  #F8FAFC;
  --ink:     #0F172A;
  --ink-2:   #475569;
  --ink-3:   #94A3B8;
  --accent:  #1D4ED8;
  --accent-h:#1E40AF;
  --line:    #E2E8F0;
}

/* ── ナビ ───────────────────────────────────── */
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

.nav-logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--ink);
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  font-size: 15px;
  color: var(--ink-2);
  text-decoration: none;
  font-weight: 500;
}
.nav-links a:hover { color: var(--accent); }

/* ── ヒーロー ────────────────────────────────── */
.hero {
  padding: 96px 48px 100px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}

.hero-inner {
  max-width: 720px;
}

.kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  margin: 0 0 24px;
}

.hero-title {
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
  margin: 0 0 28px;
  text-wrap: balance;
  color: var(--ink);
}

.hero-lead {
  font-size: 18px;
  line-height: 1.85;
  color: var(--ink-2);
  margin: 0 0 40px;
  max-width: 580px;
}

.br-pc { display: inline; }
@media (max-width: 520px) { .br-pc { display: none; } }

.hero-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 4px;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--accent-h); }

.btn-ghost {
  display: inline-block;
  color: var(--ink-2);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  transition: color 0.15s, border-color 0.15s;
}
.btn-ghost:hover { color: var(--accent); border-color: var(--accent); }

/* ── バンド共通 ──────────────────────────────── */
.band { padding: 72px 48px; background: var(--bg); }
.band-alt { background: var(--bg-alt); }

.inner { max-width: 900px; margin: 0 auto; }

.label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--ink-3);
  font-family: ui-monospace, monospace;
  margin: 0 0 10px;
}

.heading {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 40px;
  color: var(--ink);
}

/* ── 事業内容 ────────────────────────────────── */
.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .service-grid { grid-template-columns: 1fr; }
}

.service-card {
  padding: 32px 28px;
  background: var(--bg);
}
.band-alt .service-card { background: var(--bg); }

.service-icon {
  font-size: 0;
  width: 32px;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
  margin-bottom: 20px;
}

.service-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  color: var(--ink);
}

.service-body {
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-2);
  margin: 0;
}

/* ── ツール ──────────────────────────────────── */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .tools-grid { grid-template-columns: 1fr; }
}

.tool-card {
  display: block;
  text-decoration: none;
  padding: 22px 20px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
a.tool-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(29,78,216,0.08);
}

.tool-inactive { cursor: default; opacity: 0.75; }

.tool-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tool-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0;
}

.tool-arrow {
  font-size: 14px;
  color: var(--ink-3);
  transition: color 0.15s, transform 0.15s;
}
a.tool-card:hover .tool-arrow {
  color: var(--accent);
  transform: translateX(3px);
}

.tool-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 6px;
  line-height: 1.4;
}

.tool-desc {
  font-size: 14px;
  color: var(--ink-3);
  margin: 0;
  line-height: 1.6;
}

/* ── 会社概要 ────────────────────────────────── */
.profile {
  border-top: 1px solid var(--line);
  max-width: 600px;
}

.profile-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
  font-size: 16px;
}

dt { color: var(--ink-3); font-weight: 500; }
dd { color: var(--ink); margin: 0; }

.link { color: var(--accent); text-decoration: none; }
.link:hover { text-decoration: underline; }

/* ── ツールストリップ（リスト型） ─────────────── */
.tool-strip { padding-top: 40px; padding-bottom: 40px; }

.strip-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.strip-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: background 0.15s;
}
.strip-row:hover .strip-name { color: var(--accent); }
.strip-row:hover .strip-arrow { color: var(--accent); transform: translateX(4px); }

.strip-accent {
  width: 4px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.strip-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  flex-shrink: 0;
  min-width: 220px;
  transition: color 0.15s;
}

.strip-desc {
  font-size: 14px;
  color: var(--ink-3);
  flex: 1;
  line-height: 1.5;
}

.strip-arrow {
  font-size: 18px;
  color: var(--ink-3);
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}

@media (max-width: 600px) {
  .strip-name { min-width: unset; font-size: 15px; }
  .strip-desc { display: none; }
}

/* ── フッター ────────────────────────────────── */
.footer {
  border-top: 1px solid var(--line);
  padding: 24px 48px;
  font-size: 14px;
  color: var(--ink-3);
  background: var(--bg);
}

/* ── レスポンシブ ────────────────────────────── */
@media (max-width: 600px) {
  .nav    { padding: 16px 20px; }
  .hero   { padding: 60px 20px 72px; }
  .band   { padding: 56px 20px; }
  .footer { padding: 20px; }
  .profile-row { grid-template-columns: 90px 1fr; }
}
</style>
