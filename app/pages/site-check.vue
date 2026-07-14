<script setup lang="ts">
useHead({ title: "サイトまるごとチェッカー — movee" });

type Grade = "A" | "B" | "C";
type Risk  = "high" | "medium" | "low";

interface SpeedItem { score: number; grade: Grade; lcp: string|null; cls: string|null; fcp: string|null; tbt: string|null; accessibility: number|null; seo: number|null; bestPractices: number|null }
interface DesignItem { key: string; ok: boolean; label: string; desc: string }
interface SecurityItem { key: string; ok: boolean; label: string; desc: string }
interface OgpField    { key: string; value: string|null; label: string; critical: boolean }
interface Result {
  url: string;
  overall: Grade;
  speed: { mobile: SpeedItem|null; desktop: SpeedItem|null; grade: Grade } | null;
  security: { items: SecurityItem[]; passed: number; total: number; grade: Grade };
  ogp: { fields: OgpField[]; grade: Grade };
  cookie: { trackers: {name:string;type:string}[]; consent: {name:string}[]; hasPrivacy: boolean; risk: Risk };
  design: { items: DesignItem[]; passed: number; total: number; grade: Grade };
  email: string;
}

const route   = useRoute();
const url     = ref((route.query.url as string) ?? "");
const email   = ref((route.query.email as string) ?? "");
const loading = ref(false);
const result  = ref<Result | null>(null);
const apiError = ref<string | null>(null);
const elapsed  = ref(0);
let _timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => { if (url.value && email.value) check(); });

async function check() {
  if (!url.value || !email.value) return;
  loading.value = true; result.value = null; apiError.value = null; elapsed.value = 0;
  _timer = setInterval(() => elapsed.value++, 1000);
  try {
    result.value = await $fetch<Result>("/api/site-check", {
      method: "POST",
      body: { url: url.value, email: email.value },
      timeout: 90000,
    });
  } catch (e: any) {
    apiError.value = e?.data?.message ?? e?.message ?? "チェックに失敗しました";
  } finally {
    if (_timer) { clearInterval(_timer); _timer = null; }
    loading.value = false;
  }
}

const gradeColor = (g: Grade) => g === "A" ? "text-green-400" : g === "B" ? "text-yellow-400" : "text-red-400";
const gradeBg    = (g: Grade) => g === "A" ? "bg-green-950 border-green-800" : g === "B" ? "bg-yellow-950 border-yellow-800" : "bg-red-950 border-red-800";
const scoreColor = (s: number) => s >= 90 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400";
const riskColor  = (r: Risk)  => r === "high" ? "text-red-400" : r === "medium" ? "text-yellow-400" : "text-green-400";
const riskLabel  = (r: Risk)  => r === "high" ? "要対応" : r === "medium" ? "確認推奨" : "問題なし";
const typeBadge  = (t: string) => t === "advertising" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400";
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-950 z-10">
      <NuxtLink to="/" class="font-mono font-bold text-white text-lg">movee</NuxtLink>
      <span class="text-xs font-mono text-slate-500">サイトまるごとチェッカー</span>
    </header>

    <div class="max-w-2xl mx-auto px-4 py-10 space-y-6">

      <!-- ヘッダー -->
      <div class="space-y-1">
        <p class="text-xs font-mono text-cyan-500 tracking-widest uppercase">Site Check · by movee</p>
        <h1 class="text-2xl font-bold text-white">サイトまるごとチェッカー</h1>
        <p class="text-sm text-slate-400">URLを1つ入れるだけで、表示速度・セキュリティ・OGP・Cookieバナーを一括診断します。</p>
      </div>

      <!-- フォーム -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">診断するURL</label>
          <input v-model="url" type="url" placeholder="https://example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">メールアドレス</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <p class="text-xs text-slate-600">詳細レポートをメールで送信します</p>
        </div>
        <button :disabled="!url || !email || loading" @click="check"
          class="w-full bg-cyan-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span>{{ loading ? `診断中… ${elapsed}秒` : '診断スタート' }}</span>
        </button>
        <p v-if="apiError" class="text-xs text-red-400">{{ apiError }}</p>
      </div>

      <!-- 結果 -->
      <template v-if="result">

        <!-- 総合スコア -->
        <div :class="['rounded-xl border p-5', gradeBg(result.overall)]">
          <div class="flex items-center gap-6">
            <span :class="['text-7xl font-black leading-none', gradeColor(result.overall)]">{{ result.overall }}</span>
            <div class="min-w-0">
              <p class="text-sm font-bold text-white truncate">{{ result.url }}</p>
              <p class="text-xs text-slate-400 mt-1">
                {{ result.overall === 'A' ? '全体的に良好な状態です' : result.overall === 'B' ? '一部に改善の余地があります' : '重要な問題が見つかりました' }}
              </p>
              <!-- カテゴリバッジ行 -->
              <div class="flex gap-2 mt-3 flex-wrap">
                <span v-if="result.speed" :class="['text-xs font-bold px-2 py-0.5 rounded', gradeColor(result.speed.grade)]">
                  速度 {{ result.speed.grade }}
                </span>
                <span :class="['text-xs font-bold px-2 py-0.5 rounded', gradeColor(result.security.grade)]">
                  セキュリティ {{ result.security.grade }}
                </span>
                <span :class="['text-xs font-bold px-2 py-0.5 rounded', gradeColor(result.ogp.grade)]">
                  OGP {{ result.ogp.grade }}
                </span>
                <span :class="['text-xs font-bold px-2 py-0.5 rounded', riskColor(result.cookie.risk)]">
                  Cookie {{ riskLabel(result.cookie.risk) }}
                </span>
                <span :class="['text-xs font-bold px-2 py-0.5 rounded', gradeColor(result.design.grade)]">
                  デザイン {{ result.design.grade }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 表示速度 -->
        <div v-if="result.speed" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">表示速度</p>
            <span :class="['text-xs font-bold', gradeColor(result.speed.grade)]">{{ result.speed.grade }}</span>
          </div>
          <!-- 速度：モバイル/PC -->
          <div class="grid grid-cols-2 divide-x divide-slate-800">
            <div class="px-5 py-4">
              <p class="text-xs text-slate-500 mb-2">モバイル · 表示速度</p>
              <p v-if="result.speed.mobile" :class="['text-3xl font-black', scoreColor(result.speed.mobile.score)]">
                {{ result.speed.mobile.score }}
              </p>
              <p v-else class="text-3xl font-black text-slate-600">—</p>
              <div v-if="result.speed.mobile" class="mt-2 space-y-1">
                <p v-if="result.speed.mobile.lcp" class="text-xs text-slate-500">LCP: {{ result.speed.mobile.lcp }}</p>
                <p v-if="result.speed.mobile.cls" class="text-xs text-slate-500">CLS: {{ result.speed.mobile.cls }}</p>
              </div>
            </div>
            <div class="px-5 py-4">
              <p class="text-xs text-slate-500 mb-2">デスクトップ · 表示速度</p>
              <p v-if="result.speed.desktop" :class="['text-3xl font-black', scoreColor(result.speed.desktop.score)]">
                {{ result.speed.desktop.score }}
              </p>
              <p v-else class="text-3xl font-black text-slate-600">—</p>
              <div v-if="result.speed.desktop" class="mt-2 space-y-1">
                <p v-if="result.speed.desktop.lcp" class="text-xs text-slate-500">LCP: {{ result.speed.desktop.lcp }}</p>
                <p v-if="result.speed.desktop.cls" class="text-xs text-slate-500">CLS: {{ result.speed.desktop.cls }}</p>
              </div>
            </div>
          </div>
          <!-- Lighthouse その他スコア -->
          <div v-if="result.speed.mobile?.accessibility != null || result.speed.mobile?.seo != null"
            class="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800">
            <div class="px-5 py-3 text-center">
              <p class="text-xs text-slate-500 mb-1">アクセシビリティ</p>
              <p :class="['text-xl font-black', scoreColor(result.speed.mobile?.accessibility ?? 0)]">
                {{ result.speed.mobile?.accessibility ?? '—' }}
              </p>
            </div>
            <div class="px-5 py-3 text-center">
              <p class="text-xs text-slate-500 mb-1">SEO</p>
              <p :class="['text-xl font-black', scoreColor(result.speed.mobile?.seo ?? 0)]">
                {{ result.speed.mobile?.seo ?? '—' }}
              </p>
            </div>
            <div class="px-5 py-3 text-center">
              <p class="text-xs text-slate-500 mb-1">ベストプラクティス</p>
              <p :class="['text-xl font-black', scoreColor(result.speed.mobile?.bestPractices ?? 0)]">
                {{ result.speed.mobile?.bestPractices ?? '—' }}
              </p>
            </div>
          </div>
        </div>

        <!-- セキュリティ -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">セキュリティヘッダー</p>
            <span :class="['text-xs font-bold', gradeColor(result.security.grade)]">
              {{ result.security.grade }} · {{ result.security.passed }}/{{ result.security.total }}
            </span>
          </div>
          <div class="divide-y divide-slate-800">
            <div v-for="item in result.security.items" :key="item.key"
              class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="text-sm text-white font-mono">{{ item.label }}</p>
                <p class="text-xs text-slate-500">{{ item.desc }}</p>
              </div>
              <span :class="['text-xs font-bold shrink-0', item.ok ? 'text-green-400' : 'text-red-400']">
                {{ item.ok ? '✓ あり' : '✗ なし' }}
              </span>
            </div>
          </div>
        </div>

        <!-- OGP -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">OGP / SNSメタタグ</p>
            <span :class="['text-xs font-bold', gradeColor(result.ogp.grade)]">{{ result.ogp.grade }}</span>
          </div>
          <div class="divide-y divide-slate-800">
            <div v-for="field in result.ogp.fields" :key="field.key"
              class="px-5 py-3 flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm text-white font-mono flex items-center gap-2">
                  {{ field.label }}
                  <span v-if="field.critical" class="text-xs text-slate-600">必須</span>
                </p>
                <p v-if="field.value" class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ field.value }}</p>
              </div>
              <span :class="['text-xs font-bold shrink-0', field.value ? 'text-green-400' : (field.critical ? 'text-red-400' : 'text-slate-600')]">
                {{ field.value ? '✓ あり' : '✗ なし' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cookie -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Cookieバナー</p>
            <span :class="['text-xs font-bold', riskColor(result.cookie.risk)]">{{ riskLabel(result.cookie.risk) }}</span>
          </div>
          <div class="divide-y divide-slate-800">
            <div class="px-5 py-3">
              <p class="text-xs text-slate-500 mb-2">検出されたトラッカー（{{ result.cookie.trackers.length }}件）</p>
              <div v-if="result.cookie.trackers.length" class="space-y-1">
                <div v-for="t in result.cookie.trackers" :key="t.name" class="flex items-center justify-between">
                  <span class="text-sm text-slate-300">{{ t.name }}</span>
                  <span :class="['text-xs font-bold px-1.5 py-0.5 rounded', typeBadge(t.type)]">{{ t.type === 'advertising' ? '広告' : '解析' }}</span>
                </div>
              </div>
              <p v-else class="text-xs text-green-400">トラッカーは検出されませんでした</p>
            </div>
            <div class="px-5 py-3 flex items-center justify-between">
              <p class="text-sm text-white">同意バナー</p>
              <span :class="['text-xs font-bold', result.cookie.consent.length ? 'text-green-400' : 'text-red-400']">
                {{ result.cookie.consent.length ? '✓ ' + result.cookie.consent.map(c => c.name).join(', ') : '✗ 未検出' }}
              </span>
            </div>
            <div class="px-5 py-3 flex items-center justify-between">
              <p class="text-sm text-white">プライバシーポリシー</p>
              <span :class="['text-xs font-bold', result.cookie.hasPrivacy ? 'text-green-400' : 'text-yellow-400']">
                {{ result.cookie.hasPrivacy ? '✓ あり' : '△ 未検出' }}
              </span>
            </div>
          </div>
        </div>

        <!-- デザイン・HTML品質 -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">デザイン・HTML品質</p>
            <span :class="['text-xs font-bold', gradeColor(result.design.grade)]">
              {{ result.design.grade }} · {{ result.design.passed }}/{{ result.design.total }}
            </span>
          </div>
          <div class="divide-y divide-slate-800">
            <div v-for="item in result.design.items" :key="item.key"
              class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="text-sm text-white">{{ item.label }}</p>
                <p class="text-xs text-slate-500">{{ item.desc }}</p>
              </div>
              <span :class="['text-xs font-bold shrink-0', item.ok ? 'text-green-400' : 'text-yellow-400']">
                {{ item.ok ? '✓ OK' : '△ 要確認' }}
              </span>
            </div>
          </div>
        </div>

        <!-- メール -->
        <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          詳細レポートを <span class="font-semibold text-slate-300 mx-1">{{ result.email }}</span> に送信しました
        </div>

      </template>
    </div>
  </div>
</template>
