<script setup lang="ts">
interface OgpResult {
  url: string;
  hostname: string;
  siteName: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

useHead({ title: "OGP・SNSカードプレビュー — movee" });
useSeoMeta({ description: "URLを入力するとTwitter・Facebook・LINEでシェアしたときの見え方を確認できる無料ツールです。" });

const route    = useRoute();
const inputUrl = ref((route.query.url as string) ?? "");
const result   = ref<OgpResult | null>(null);
const loading  = ref(false);
const errorMsg = ref<string | null>(null);

onMounted(() => { if (inputUrl.value) check(); });

async function check() {
  const u = inputUrl.value.trim();
  if (!u) return;
  loading.value = true;
  errorMsg.value = null;
  result.value = null;
  try {
    result.value = await $fetch<OgpResult>("/api/ogp", { query: { url: u } });
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? "取得できませんでした";
  } finally {
    loading.value = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") check();
}

const checks = computed(() => {
  if (!result.value) return [];
  const r = result.value;
  return [
    { label: "og:title",       ok: !!r.ogTitle,       value: r.ogTitle },
    { label: "og:description", ok: !!r.ogDescription, value: r.ogDescription },
    { label: "og:image",       ok: !!r.ogImage,       value: r.ogImage },
    { label: "twitter:card",   ok: !!r.twitterCard,   value: r.twitterCard },
    { label: "twitter:image",  ok: !!r.twitterImage,  value: r.twitterImage },
    { label: "meta description", ok: !!r.metaDescription, value: r.metaDescription },
  ];
});
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-logo">movee</NuxtLink>
      <span class="nav-title">OGP・SNSカードプレビュー</span>
    </header>

    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">FREE TOOL</p>
        <h1 class="hero-title">SNSでシェアしたとき、<br />どう見える？</h1>
        <p class="hero-lead">URLを入力するとTwitter・Facebook・LINEのカード表示をプレビューできます。</p>

        <div class="input-row">
          <input
            v-model="inputUrl"
            type="url"
            placeholder="https://example.com"
            class="url-input"
            @keydown="onKeydown"
          />
          <button class="check-btn" :disabled="loading" @click="check">
            {{ loading ? "取得中…" : "チェック" }}
          </button>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>
    </section>

    <main v-if="result" class="main">

      <!-- カードプレビュー -->
      <section class="section-cards">
        <div class="inner">
          <div class="cards-grid">

            <!-- Twitter -->
            <div class="card-wrap">
              <p class="platform-label tw">𝕏 / Twitter</p>
              <div class="card card-tw">
                <div v-if="result.twitterImage" class="card-img-wrap card-img-large">
                  <img :src="result.twitterImage" alt="" @error="($event.target as HTMLImageElement).style.display='none'" />
                </div>
                <div v-else class="card-img-wrap card-img-large card-img-empty">
                  <span>画像なし</span>
                </div>
                <div class="card-body">
                  <p class="card-domain">{{ result.hostname }}</p>
                  <p class="card-title">{{ result.twitterTitle ?? "(タイトルなし)" }}</p>
                  <p class="card-desc">{{ result.twitterDescription ?? "" }}</p>
                </div>
              </div>
            </div>

            <!-- Facebook -->
            <div class="card-wrap">
              <p class="platform-label fb">Facebook</p>
              <div class="card card-fb">
                <div v-if="result.ogImage" class="card-img-wrap card-img-large">
                  <img :src="result.ogImage" alt="" @error="($event.target as HTMLImageElement).style.display='none'" />
                </div>
                <div v-else class="card-img-wrap card-img-large card-img-empty">
                  <span>画像なし</span>
                </div>
                <div class="card-body card-body-fb">
                  <p class="card-domain card-domain-upper">{{ result.hostname }}</p>
                  <p class="card-title">{{ result.ogTitle ?? result.metaTitle ?? "(タイトルなし)" }}</p>
                  <p class="card-desc">{{ result.ogDescription ?? result.metaDescription ?? "" }}</p>
                </div>
              </div>
            </div>

            <!-- LINE -->
            <div class="card-wrap">
              <p class="platform-label line">LINE</p>
              <div class="card card-line">
                <div class="card-line-inner">
                  <div class="card-line-text">
                    <p class="card-title card-title-line">{{ result.ogTitle ?? result.metaTitle ?? "(タイトルなし)" }}</p>
                    <p class="card-desc card-desc-line">{{ result.ogDescription ?? result.metaDescription ?? "" }}</p>
                    <p class="card-domain card-domain-line">{{ result.hostname }}</p>
                  </div>
                  <div v-if="result.ogImage" class="card-line-thumb">
                    <img :src="result.ogImage" alt="" @error="($event.target as HTMLImageElement).style.display='none'" />
                  </div>
                  <div v-else class="card-line-thumb card-img-empty">
                    <span>—</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- タグチェック -->
      <section class="section-check">
        <div class="inner">
          <p class="check-heading">タグの設定状況</p>
          <div class="check-list">
            <div v-for="item in checks" :key="item.label" class="check-row">
              <span class="check-icon" :class="item.ok ? 'ok' : 'ng'">{{ item.ok ? "✓" : "✗" }}</span>
              <span class="check-label">{{ item.label }}</span>
              <span class="check-value">{{ item.value ?? "未設定" }}</span>
            </div>
          </div>
        </div>
      </section>

    </main>

    <footer class="footer">
      <p>OGP・SNSカードプレビュー by <a href="/">movee</a></p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  --ink:    #0F172A;
  --ink-2:  #475569;
  --ink-3:  #94A3B8;
  --line:   #E2E8F0;
  --bg:     #F8FAFC;
  --white:  #FFFFFF;
  --accent: #1D4ED8;
  --ok:     #16A34A;
  --ng:     #DC2626;

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* ── ナビ ─── */
.nav {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 40px;
  background: var(--white);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-logo  { font-size: 16px; font-weight: 800; color: var(--ink); text-decoration: none; }
.nav-title { font-size: 13px; color: var(--ink-3); }

/* ── ヒーロー ─── */
.hero { padding: 64px 40px 56px; background: var(--white); border-bottom: 1px solid var(--line); }
.hero-inner { max-width: 640px; }

.kicker {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
  color: var(--accent); font-family: ui-monospace, monospace; margin: 0 0 16px;
}
.hero-title {
  font-size: clamp(28px, 5vw, 44px); font-weight: 900;
  letter-spacing: -0.04em; line-height: 1.1; margin: 0 0 16px; text-wrap: balance;
}
.hero-lead { font-size: 15px; color: var(--ink-2); margin: 0 0 32px; }

.input-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.url-input {
  flex: 1;
  min-width: 240px;
  padding: 12px 16px;
  font-size: 15px;
  border: 1.5px solid var(--line);
  border-radius: 6px;
  outline: none;
  background: var(--white);
  color: var(--ink);
  transition: border-color 0.15s;
}
.url-input:focus { border-color: var(--accent); }

.check-btn {
  padding: 12px 28px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;
}
.check-btn:disabled { opacity: 0.6; cursor: default; }
.check-btn:not(:disabled):hover { opacity: 0.85; }

.error-msg { margin: 12px 0 0; font-size: 14px; color: var(--ng); }

/* ── 共通 ─── */
.main  { padding-bottom: 80px; }
.inner { max-width: 960px; margin: 0 auto; padding: 0 40px; }

/* ── カード ─── */
.section-cards { padding: 48px 0; }

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 760px) { .cards-grid { grid-template-columns: 1fr; } }

.card-wrap {}

.platform-label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  font-family: ui-monospace, monospace; margin: 0 0 10px;
}
.tw   { color: #000; }
.fb   { color: #1877F2; }
.line { color: #06C755; }

.card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--white);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.card-img-wrap {
  width: 100%;
  overflow: hidden;
  background: var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-img-large { aspect-ratio: 1.91 / 1; }
.card-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-img-empty { color: var(--ink-3); font-size: 13px; }

.card-body { padding: 12px 14px; }
.card-body-fb { background: #F0F2F5; }

.card-domain {
  font-size: 11px; color: var(--ink-3); margin: 0 0 4px;
}
.card-domain-upper { text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; color: #606770; }

.card-title {
  font-size: 14px; font-weight: 700; color: var(--ink);
  margin: 0 0 4px; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.card-desc {
  font-size: 12px; color: var(--ink-2); margin: 0; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* LINE */
.card-line-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}
.card-line-text { flex: 1; min-width: 0; }
.card-title-line { -webkit-line-clamp: 2; font-size: 13px; }
.card-desc-line  { display: none; }
.card-domain-line { font-size: 10px; color: var(--ink-3); margin: 4px 0 0; }
.card-line-thumb {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--ink-3);
}
.card-line-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* ── タグチェック ─── */
.section-check { padding: 0 0 16px; }

.check-heading {
  font-size: 13px; font-weight: 700; color: var(--ink);
  margin: 0 0 16px; letter-spacing: 0.02em;
}

.check-list {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: var(--white);
}

.check-row {
  display: grid;
  grid-template-columns: 24px 180px 1fr;
  align-items: baseline;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
.check-row:last-child { border-bottom: none; }

.check-icon { font-size: 12px; font-weight: 700; }
.check-icon.ok { color: var(--ok); }
.check-icon.ng { color: var(--ng); }

.check-label { font-family: ui-monospace, monospace; color: var(--ink-2); font-size: 12px; }

.check-value {
  color: var(--ink-3); font-size: 12px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ── フッター ─── */
.footer {
  border-top: 1px solid var(--line);
  padding: 20px 40px;
  font-size: 12px;
  color: var(--ink-3);
  background: var(--white);
}
.footer a { color: var(--accent); text-decoration: none; }

@media (max-width: 600px) {
  .nav    { padding: 14px 20px; }
  .hero   { padding: 48px 20px 40px; }
  .inner  { padding: 0 20px; }
  .footer { padding: 18px 20px; }
  .check-row { grid-template-columns: 20px 120px 1fr; }
}
</style>
