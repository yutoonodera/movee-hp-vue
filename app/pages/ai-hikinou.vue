<script setup lang="ts">
type Grade = "A" | "B" | "C";

interface SecurityFinding {
  level: "critical" | "warning" | "info";
  message: string;
}
interface SecurityResult {
  score: number;
  grade: Grade;
  isHttps: boolean;
  headers: { name: string; label: string; present: boolean }[];
  findings: SecurityFinding[];
}
interface PerformanceResult {
  score: number;
  grade: Grade;
  lcp: string | null;
}
interface ApiEndpointCheck {
  path: string;
  label: string;
  status: number | null;
  exposed: boolean;
  critical: boolean;
}
interface ApiExposureResult {
  endpoints: ApiEndpointCheck[];
  graphqlIntrospection: boolean;
  exposedCount: number;
  grade: Grade;
}
interface AiResult {
  url: string;
  security: SecurityResult;
  performance: PerformanceResult | null;
  apiExposure: ApiExposureResult;
  psError: string | null;
  email: string;
}

const url = ref("");
const email = ref("");
const loading = ref(false);
const result = ref<AiResult | null>(null);
const apiError = ref<string | null>(null);
const elapsedSec = ref(0);
const totalSec = ref(0);
let _timer: ReturnType<typeof setInterval> | null = null;

const elapsedLabel = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
};

const gradeColor = (grade: Grade) => {
  if (grade === "A") return "text-green-500";
  if (grade === "B") return "text-yellow-500";
  return "text-red-500";
};

const gradeBg = (grade: Grade) => {
  if (grade === "A") return "bg-green-950 border-green-800";
  if (grade === "B") return "bg-yellow-950 border-yellow-800";
  return "bg-red-950 border-red-900";
};

const findingStyle = (level: SecurityFinding["level"]) => {
  if (level === "critical")
    return { badge: "bg-red-500/20 text-red-400", label: "重大", border: "border-red-900/60" };
  if (level === "warning")
    return { badge: "bg-yellow-500/20 text-yellow-400", label: "警告", border: "border-yellow-900/60" };
  return { badge: "bg-blue-500/20 text-blue-400", label: "情報", border: "border-blue-900/60" };
};

async function analyze() {
  apiError.value = null;
  result.value = null;
  elapsedSec.value = 0;
  totalSec.value = 0;
  loading.value = true;
  _timer = setInterval(() => { elapsedSec.value++; }, 1000);
  try {
    const data = await $fetch<AiResult>("/api/analyze-ai", {
      method: "POST",
      body: { url: url.value, email: email.value },
      timeout: 300000,
    });
    result.value = data;
    totalSec.value = elapsedSec.value;
  } catch (e: any) {
    apiError.value = e?.data?.message ?? e?.message ?? "分析中にエラーが発生しました";
  } finally {
    if (_timer) { clearInterval(_timer); _timer = null; }
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="max-w-2xl mx-auto px-4 py-12 space-y-8">

      <!-- Header -->
      <div class="space-y-1">
        <p class="text-xs font-mono text-cyan-500 tracking-widest uppercase">Next.js / Nuxt.js 向け</p>
        <h1 class="text-2xl font-bold text-white">AI開発の非機能診断くん</h1>
        <p class="text-sm text-slate-400">
          Next.js・Nuxt.jsで開発されたサイトのenv漏洩・セキュリティヘッダー・LCP・SQLインジェクションリスクを診断します
        </p>
      </div>

      <!-- Form -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">診断するURL</label>
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">メールアドレス</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <p class="text-xs text-slate-600">詳細レポートをメールで送信します</p>
        </div>
        <button
          :disabled="loading || !url || !email"
          class="w-full bg-cyan-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="analyze"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span v-if="loading">診断中… {{ elapsedLabel(elapsedSec) }}</span>
          <span v-else>診断する</span>
        </button>
        <p class="text-xs text-slate-600">診断には30秒から1分ほどかかります。指定したURLのみを診断します。</p>
        <p v-if="apiError" class="text-xs text-red-400">{{ apiError }}</p>
      </div>

      <!-- Results -->
      <div v-if="result" class="space-y-4">
        <p class="text-xs font-mono text-slate-500">
          {{ result.url }} — {{ elapsedLabel(totalSec) }}
        </p>

        <!-- スコアカード -->
        <div class="grid grid-cols-2 gap-3">
          <div :class="['rounded-xl border p-4 flex flex-col items-center gap-1', gradeBg(result.security.grade)]">
            <p class="text-xs font-mono text-slate-400 tracking-wider uppercase">Security</p>
            <span :class="['text-5xl font-black', gradeColor(result.security.grade)]">{{ result.security.grade }}</span>
            <p class="text-xs text-slate-500">{{ result.security.score }}点</p>
          </div>
          <div v-if="result.performance" :class="['rounded-xl border p-4 flex flex-col items-center gap-1', gradeBg(result.performance.grade)]">
            <p class="text-xs font-mono text-slate-400 tracking-wider uppercase">Performance</p>
            <span :class="['text-5xl font-black', gradeColor(result.performance.grade)]">{{ result.performance.grade }}</span>
            <p class="text-xs text-slate-500">{{ result.performance.score }}点{{ result.performance.lcp ? ` / LCP ${result.performance.lcp}` : '' }}</p>
          </div>
          <div v-else class="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col items-center gap-1">
            <p class="text-xs font-mono text-slate-600 tracking-wider uppercase">Performance</p>
            <span class="text-5xl font-black text-slate-700">–</span>
            <p v-if="result.psError" class="text-xs text-red-500 text-center">取得失敗</p>
          </div>
        </div>

        <!-- Findings -->
        <div v-if="result.security.findings.length" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800">
            <h2 class="text-xs font-mono text-slate-400 uppercase tracking-wider">診断結果</h2>
          </div>
          <ul class="divide-y divide-slate-800">
            <li
              v-for="(f, i) in result.security.findings"
              :key="i"
              :class="['px-5 py-3 flex items-start gap-3 border-l-2', findingStyle(f.level).border]"
            >
              <span :class="['mt-0.5 shrink-0 inline-block px-2 py-0.5 rounded text-xs font-bold', findingStyle(f.level).badge]">
                {{ findingStyle(f.level).label }}
              </span>
              <span class="text-sm text-slate-300 leading-relaxed">{{ f.message }}</span>
            </li>
          </ul>
        </div>
        <div v-else class="flex items-center gap-2 text-sm text-green-400 bg-green-950 border border-green-900 rounded-xl px-5 py-3">
          <span class="font-bold">✓</span> 重大なセキュリティ問題は検出されませんでした
        </div>

        <!-- API Exposure -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <h2 class="text-xs font-mono text-slate-400 uppercase tracking-wider">API露出チェック</h2>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded', result.apiExposure.grade === 'A' ? 'bg-green-950 text-green-400' : result.apiExposure.grade === 'B' ? 'bg-yellow-950 text-yellow-400' : 'bg-red-950 text-red-400']">
              {{ result.apiExposure.grade }} — {{ result.apiExposure.exposedCount === 0 ? '問題なし' : `${result.apiExposure.exposedCount}件露出` }}
            </span>
          </div>
          <ul class="divide-y divide-slate-800">
            <li
              v-for="ep in result.apiExposure.endpoints"
              :key="ep.path"
              class="px-5 py-2.5 flex items-center justify-between gap-3"
            >
              <span class="text-xs font-mono text-slate-400">{{ ep.label }}</span>
              <span v-if="ep.exposed" :class="['text-xs font-bold', ep.critical ? 'text-red-400' : 'text-yellow-400']">
                {{ ep.status }} {{ ep.critical ? '⚠ 要確認' : '△ 公開中' }}
              </span>
              <span v-else class="text-xs text-slate-600">
                {{ ep.status === null ? '—' : ep.status === 404 ? '404 未使用' : `${ep.status} 保護済み` }}
              </span>
            </li>
            <li v-if="result.apiExposure.graphqlIntrospection" class="px-5 py-2.5 flex items-center justify-between gap-3">
              <span class="text-xs font-mono text-slate-400">/graphql（GraphQLイントロスペクション）</span>
              <span class="text-xs font-bold text-red-400">⚠ 有効（スキーマ公開）</span>
            </li>
          </ul>
        </div>

        <!-- Security Headers -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800">
            <h2 class="text-xs font-mono text-slate-400 uppercase tracking-wider">セキュリティヘッダー</h2>
          </div>
          <ul class="divide-y divide-slate-800">
            <li
              v-for="h in result.security.headers"
              :key="h.name"
              class="px-5 py-2.5 flex items-center justify-between"
            >
              <span class="text-xs font-mono text-slate-400">{{ h.label }}</span>
              <span :class="['text-xs font-semibold', h.present ? 'text-green-500' : 'text-red-500']">
                {{ h.present ? '✓ 設定済み' : '✕ 未設定' }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Email notice -->
        <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          詳細レポートを <span class="font-semibold text-slate-300 mx-1">{{ result.email }}</span> に送信しました
        </div>

        <!-- Grade Legend -->
        <div class="flex gap-4 text-xs text-slate-600 justify-center font-mono">
          <span><span class="text-green-500 font-bold">A</span> 90点以上</span>
          <span><span class="text-yellow-500 font-bold">B</span> 50〜89点</span>
          <span><span class="text-red-500 font-bold">C</span> 50点未満</span>
        </div>
      </div>
    </div>
  </div>
</template>
