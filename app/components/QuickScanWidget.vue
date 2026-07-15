<script setup lang="ts">
withDefaults(defineProps<{
  title?:   string;
  compact?: boolean;
}>(), {
  title:   "あなたのサイト、本当に大丈夫ですか？",
  compact: false,
});

const TOOLS = [
  { id: "ogp",     label: "OGPプレビュー",   toolPath: "/lp/ogp-preview", color: "#8B5CF6",
    desc: "TwitterやLINEでシェアしたときのカード表示を確認。OGPタグの設定漏れもチェックできます。",
    needsEmail: false, needsBase: false },
  { id: "wp",      label: "WordPress診断",  toolPath: "/wp-hikinou",     color: "#3B82F6",
    desc: "表示速度・セキュリティ・使いやすさをまとめて診断。PageSpeed・ヘッダー設定・SSLを一括チェック。",
    needsEmail: true,  needsBase: false },
  { id: "ai",      label: "AI開発診断",      toolPath: "/ai-hikinou",     color: "#06B6D4",
    desc: "Next.js/Nuxtのenv漏洩・セキュリティヘッダー・LCP・API露出状況をまとめて診断します。",
    needsEmail: true,  needsBase: false },
  { id: "api",     label: "APIセキュリティ", toolPath: "/api-security",   color: "#EF4444",
    desc: "Swagger自動探索・GraphQLイントロスペクション・ソースマップ漏洩・エンドポイント認証を確認。",
    needsEmail: true,  needsBase: true  },
  { id: "site",    label: "まるごとチェック", toolPath: "/site-check",     color: "#F59E0B",
    desc: "速度・セキュリティ・OGP・Cookieバナーを1つのURLで全部まとめて診断します。",
    needsEmail: true,  needsBase: false },
  { id: "email",   label: "メール到達性",    toolPath: "/email-check",    color: "#10B981",
    desc: "ドメインのSPF・DMARC・DKIMを確認。お問い合わせメールがスパム判定されていないかチェック。",
    needsEmail: true,  needsBase: false },
  { id: "cookie",  label: "Cookieバナー",   toolPath: "/cookie-check",   color: "#A855F7",
    desc: "GA・GTM・広告タグが入っているのに同意バナーがないサイトを検出。個人情報保護法対応の確認に。",
    needsEmail: true,  needsBase: false },
  { id: "aicheck", label: "AI安全診断",      toolPath: "/ai-check",       color: "#7C3AED",
    desc: "コンテンツがAIに無断学習されていないかrobots.txt設定を確認。APIキー漏洩も検出します。",
    needsEmail: true,  needsBase: false },
] as const;

type ToolId = typeof TOOLS[number]["id"];

const selectedTool = ref<ToolId>("ogp");
const scanUrl      = ref("");
const scanEmail    = ref("");
const scanBase     = ref("/api");

const currentTool = computed(() => TOOLS.find(t => t.id === selectedTool.value)!);

function startScan() {
  const tool = currentTool.value;
  const query: Record<string, string> = {};
  const urlKey = tool.id === "email" ? "domain" : "url";
  if (scanUrl.value)                        query[urlKey]   = scanUrl.value;
  if (tool.needsEmail && scanEmail.value)   query.email     = scanEmail.value;
  if (tool.needsBase  && scanBase.value)    query.basePath  = scanBase.value;
  navigateTo({ path: tool.toolPath, query });
}
</script>

<template>
  <section class="qsw">
    <div class="qsw-inner">
      <p class="qsw-kicker">FREE TOOLS · 登録不要</p>
      <h2 class="qsw-title" :class="{ compact }">{{ title }}</h2>

      <div class="qsw-card">
        <div class="qsw-tabs">
          <button
            v-for="t in TOOLS"
            :key="t.id"
            :class="['qsw-tab', { active: selectedTool === t.id }]"
            :style="selectedTool === t.id ? `--tc:${t.color}` : ''"
            @click="selectedTool = t.id"
          >{{ t.label }}</button>
        </div>

        <p class="qsw-desc">{{ currentTool.desc }}</p>

        <div class="qsw-fields">
          <div class="qsw-field-wrap">
            <input
              v-model="scanUrl"
              :type="currentTool.id === 'email' ? 'text' : 'url'"
              :placeholder="currentTool.id === 'email' ? 'example.com またはメールアドレス' : 'https://example.com'"
              class="qsw-input"
              @keydown.enter="startScan"
            />
            <span v-if="scanUrl" class="qsw-check">✓</span>
          </div>
          <div v-if="currentTool.needsBase" class="qsw-field-wrap">
            <input v-model="scanBase" type="text" placeholder="APIベースパス（例: /api）" class="qsw-input" />
            <span v-if="scanBase" class="qsw-check">✓</span>
          </div>
          <div v-if="currentTool.needsEmail" class="qsw-field-wrap">
            <input v-model="scanEmail" type="email" placeholder="結果をメールで受け取る" class="qsw-input" />
            <span v-if="scanEmail" class="qsw-check">✓</span>
          </div>
        </div>

        <button class="qsw-btn" @click="startScan">診断スタート</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.qsw {
  background: #080F1E;
  padding: 64px 24px;
  text-align: center;
}
.qsw-inner {
  max-width: 640px;
  margin: 0 auto;
}

.qsw-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #06B6D4;
  font-family: ui-monospace, monospace;
  margin: 0 0 16px;
}

.qsw-title {
  font-size: clamp(22px, 3.5vw, 36px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.2;
  margin: 0 0 28px;
  text-wrap: balance;
  color: #F1F5F9;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif;
}
.qsw-title.compact {
  font-size: clamp(18px, 2.5vw, 26px);
  margin-bottom: 20px;
}

.qsw-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 20px 24px 16px;
  text-align: left;
}

.qsw-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.qsw-tab {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: #94A3B8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: ui-monospace, monospace;
}
.qsw-tab:hover { color: #F1F5F9; border-color: rgba(255,255,255,0.3); }
.qsw-tab.active {
  background: color-mix(in srgb, var(--tc) 15%, transparent);
  border-color: var(--tc);
  color: var(--tc);
}

.qsw-desc {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 14px;
  line-height: 1.6;
  min-height: 2.6em;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif;
}

.qsw-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.qsw-field-wrap { position: relative; }

.qsw-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 10px 36px 10px 14px;
  font-size: 14px;
  color: #F1F5F9;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif;
}
.qsw-input::placeholder { color: #475569; }
.qsw-input:focus        { border-color: rgba(255,255,255,0.3); }

.qsw-check {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #22c55e;
  font-size: 14px;
  font-weight: 700;
  pointer-events: none;
}

.qsw-btn {
  width: 100%;
  background: #06B6D4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 2px;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif;
}
.qsw-btn:hover { background: #0891B2; }
</style>
