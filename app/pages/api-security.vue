<script setup lang="ts">
useHead({ title: "APIセキュリティ診断くん — movee" });

type Risk  = "critical" | "warning" | "safe";
type Grade = "A" | "B" | "C";

interface EndpointResult {
  path: string;
  method: string;
  status: number | null;
  exposed: boolean;
  risk: Risk;
}

interface ApiSecurityResult {
  url: string;
  basePath: string;
  swagger: {
    found: boolean;
    specUrl: string | null;
    title: string | null;
    version: string | null;
    totalEndpoints: number;
  };
  graphql: { endpoint: boolean; introspectionEnabled: boolean };
  nuxt:    { sourceMapsExposed: boolean; exposedUrl: string | null };
  endpoints: EndpointResult[];
  summary: { checked: number; exposed: number; grade: Grade };
  email: string;
}

const url      = ref("");
const basePath = ref("/api");
const email    = ref("");
const loading  = ref(false);
const result   = ref<ApiSecurityResult | null>(null);
const apiError = ref<string | null>(null);
const elapsed  = ref(0);
let _timer: ReturnType<typeof setInterval> | null = null;

const gradeColor = (g: Grade) =>
  g === "A" ? "text-green-400" : g === "B" ? "text-yellow-400" : "text-red-400";
const gradeBg = (g: Grade) =>
  g === "A" ? "bg-green-950 border-green-800" : g === "B" ? "bg-yellow-950 border-yellow-800" : "bg-red-950 border-red-800";

const riskBadge = (r: Risk) =>
  r === "critical"
    ? "bg-red-500/20 text-red-400"
    : "bg-yellow-500/20 text-yellow-400";

const statusColor = (s: number | null, exposed: boolean) => {
  if (s === null) return "text-slate-600";
  if (exposed)    return "text-red-400 font-bold";
  if (s === 401 || s === 403) return "text-green-500";
  return "text-slate-500";
};
const statusLabel = (s: number | null, exposed: boolean) => {
  if (s === null) return "— timeout";
  if (exposed)    return `${s} 公開中`;
  if (s === 401 || s === 403) return `${s} 認証あり`;
  if (s === 404)  return `${s} 未使用`;
  return `${s}`;
};

const exposedEndpoints   = computed(() => result.value?.endpoints.filter(e => e.exposed) ?? []);
const protectedEndpoints = computed(() => result.value?.endpoints.filter(e => !e.exposed && e.status !== null) ?? []);
const canSubmit          = computed(() => !!url.value && !!email.value && !loading.value);

async function analyze() {
  apiError.value = null;
  result.value   = null;
  elapsed.value  = 0;
  loading.value  = true;
  _timer = setInterval(() => elapsed.value++, 1000);
  try {
    result.value = await $fetch<ApiSecurityResult>("/api/analyze-api-security", {
      method: "POST",
      body: { url: url.value, basePath: basePath.value, email: email.value },
      timeout: 120000,
    });
  } catch (e: any) {
    apiError.value = e?.data?.message ?? e?.message ?? "診断中にエラーが発生しました";
  } finally {
    if (_timer) { clearInterval(_timer); _timer = null; }
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="max-w-2xl mx-auto px-4 py-12 space-y-8">

      <!-- ヘッダー -->
      <div class="space-y-1">
        <p class="text-xs font-mono text-cyan-500 tracking-widest uppercase">API Security · by movee</p>
        <h1 class="text-2xl font-bold text-white">APIセキュリティ診断くん</h1>
        <p class="text-sm text-slate-400">
          URLとAPIのベースパスを入力するとSwagger/OpenAPIを自動探索し、エンドポイントが認証なしで公開されていないか診断します。
        </p>
      </div>

      <!-- フォーム -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">診断するURL</label>
          <input v-model="url" type="url" placeholder="https://example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">APIベースパス</label>
          <input v-model="basePath" type="text" placeholder="/api"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <p class="text-xs text-slate-600">例: /api・/v1・/api/v1 など</p>
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">メールアドレス</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <p class="text-xs text-slate-600">詳細レポートをメールで送信します</p>
        </div>
        <button :disabled="!canSubmit" @click="analyze"
          class="w-full bg-cyan-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span v-if="loading">診断中… {{ elapsed }}秒</span>
          <span v-else>診断する</span>
        </button>
        <p v-if="apiError" class="text-xs text-red-400">{{ apiError }}</p>
      </div>

      <!-- 結果 -->
      <div v-if="result" class="space-y-4">
        <p class="text-xs font-mono text-slate-500">{{ result.url }} {{ result.basePath }}</p>

        <!-- スコア -->
        <div :class="['rounded-xl border p-5 flex items-center gap-6', gradeBg(result.summary.grade)]">
          <span :class="['text-6xl font-black', gradeColor(result.summary.grade)]">{{ result.summary.grade }}</span>
          <div>
            <p class="text-sm font-semibold text-white">
              {{ result.summary.exposed === 0 && !result.graphql.introspectionEnabled && !result.nuxt.sourceMapsExposed && !result.swagger.found
                ? '問題は検出されませんでした'
                : '問題が検出されました' }}
            </p>
            <p class="text-xs text-slate-400 mt-1">{{ result.summary.checked }}件のエンドポイントをチェック</p>
          </div>
        </div>

        <!-- Swagger -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Swagger / OpenAPI</p>
          <div v-if="result.swagger.found">
            <p class="text-xs font-bold text-yellow-400">⚠ API仕様書が外部公開されています</p>
            <p class="text-xs font-mono text-slate-500 break-all mt-1">{{ result.swagger.specUrl }}</p>
            <p v-if="result.swagger.title" class="text-xs text-slate-500 mt-1">
              {{ result.swagger.title }} {{ result.swagger.version ? `v${result.swagger.version}` : "" }} — {{ result.swagger.totalEndpoints }}エンドポイント定義
            </p>
          </div>
          <p v-else class="text-xs text-green-400">✓ 仕様書は見つかりませんでした</p>
        </div>

        <!-- GraphQL -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">GraphQL</p>
          <p v-if="result.graphql.introspectionEnabled" class="text-xs font-bold text-red-400">
            ⚠ イントロスペクションが有効です（スキーマ全体が外部から取得可能な状態）
          </p>
          <p v-else-if="result.graphql.endpoint" class="text-xs text-green-400">
            ✓ /graphql は存在しますがイントロスペクションは無効です
          </p>
          <p v-else class="text-xs text-slate-500">
            — /graphql エンドポイントは見つかりませんでした
          </p>
        </div>

        <!-- Nuxt ソースマップ -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Nuxt.js ソースマップ</p>
          <div v-if="result.nuxt.sourceMapsExposed">
            <p class="text-xs font-bold text-red-400">⚠ ソースマップが公開されています（元のソースコードが閲覧可能）</p>
            <p class="text-xs font-mono text-slate-500 break-all mt-1">{{ result.nuxt.exposedUrl }}</p>
          </div>
          <p v-else class="text-xs text-green-400">✓ ソースマップの公開は確認されませんでした</p>
        </div>

        <!-- 公開中エンドポイント -->
        <div v-if="exposedEndpoints.length" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800">
            <h2 class="text-xs font-mono text-slate-400 uppercase tracking-wider">
              公開中のエンドポイント（{{ exposedEndpoints.length }}件）
            </h2>
          </div>
          <ul class="divide-y divide-slate-800">
            <li v-for="ep in exposedEndpoints" :key="ep.path"
              class="px-5 py-3 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span :class="['shrink-0 text-xs font-bold px-1.5 py-0.5 rounded', riskBadge(ep.risk)]">
                  {{ ep.risk === "critical" ? "要対応" : "確認推奨" }}
                </span>
                <span class="text-xs font-mono text-slate-300 truncate">{{ ep.path }}</span>
              </div>
              <span :class="['text-xs shrink-0', statusColor(ep.status, ep.exposed)]">
                {{ statusLabel(ep.status, ep.exposed) }}
              </span>
            </li>
          </ul>
        </div>

        <!-- 保護済み・未使用 -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800">
            <h2 class="text-xs font-mono text-slate-400 uppercase tracking-wider">
              その他のチェック結果（{{ protectedEndpoints.length }}件）
            </h2>
          </div>
          <ul class="divide-y divide-slate-800 max-h-64 overflow-y-auto">
            <li v-for="ep in protectedEndpoints" :key="ep.path"
              class="px-5 py-2.5 flex items-center justify-between gap-3">
              <span class="text-xs font-mono text-slate-500 truncate">{{ ep.path }}</span>
              <span :class="['text-xs shrink-0', statusColor(ep.status, ep.exposed)]">
                {{ statusLabel(ep.status, ep.exposed) }}
              </span>
            </li>
          </ul>
        </div>

        <!-- メール通知 -->
        <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          詳細レポートを <span class="font-semibold text-slate-300 mx-1">{{ result.email }}</span> に送信しました
        </div>

        <div class="flex gap-4 text-xs text-slate-600 justify-center font-mono">
          <span><span class="text-green-500 font-bold">A</span> 問題なし</span>
          <span><span class="text-yellow-500 font-bold">B</span> 要確認</span>
          <span><span class="text-red-500 font-bold">C</span> 要対応</span>
        </div>
      </div>

    </div>
  </div>
</template>
