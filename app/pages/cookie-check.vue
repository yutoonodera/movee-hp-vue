<script setup lang="ts">
useHead({ title: "Cookieバナー診断 — movee" });

type Risk = "high" | "medium" | "low";
interface Result {
  url: string;
  trackers:  { name: string; type: string }[];
  consent:   { name: string }[];
  hasPrivacyPolicy: boolean;
  email: string;
  summary: { trackerCount: number; consentCount: number; hasTrackers: boolean; hasConsent: boolean; risk: Risk };
}

const route   = useRoute();
const url     = ref((route.query.url as string) ?? "");
const email   = ref((route.query.email as string) ?? "");
const loading = ref(false);
const result  = ref<Result | null>(null);
const apiError = ref<string | null>(null);

onMounted(() => { if (url.value && email.value) check(); });

async function check() {
  if (!url.value || !email.value) return;
  loading.value = true; result.value = null; apiError.value = null;
  try {
    result.value = await $fetch<Result>("/api/check-cookie-banner", {
      method: "POST",
      body: { url: url.value, email: email.value },
    });
  } catch (e: any) {
    apiError.value = e?.data?.message ?? e?.message ?? "チェックに失敗しました";
  } finally { loading.value = false; }
}

const riskLabel = (r: Risk) => r === "high" ? "要対応" : r === "medium" ? "確認推奨" : "問題なし";
const riskBg    = (r: Risk) => r === "high" ? "bg-red-950 border-red-800" : r === "medium" ? "bg-yellow-950 border-yellow-800" : "bg-green-950 border-green-800";
const riskText  = (r: Risk) => r === "high" ? "text-red-400" : r === "medium" ? "text-yellow-400" : "text-green-400";
const typeBadge = (t: string) => t === "advertising" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400";
const typeLabel = (t: string) => t === "advertising" ? "広告" : "解析";
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <NuxtLink to="/" class="font-mono font-bold text-white text-lg">movee</NuxtLink>
      <span class="text-xs font-mono text-slate-500">Cookieバナー診断</span>
    </header>

    <div class="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div class="space-y-1">
        <p class="text-xs font-mono text-purple-400 tracking-widest uppercase">Cookie Banner · by movee</p>
        <h1 class="text-2xl font-bold text-white">Cookieバナー診断</h1>
        <p class="text-sm text-slate-400">GA・GTM・広告タグを埋め込んでいるのに同意バナーがないサイトは個人情報保護法上リスクがあります。URLを入れてすぐ確認できます。</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">診断するURL</label>
          <input v-model="url" type="url" placeholder="https://example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">メールアドレス</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p class="text-xs text-slate-600">詳細レポートをメールで送信します</p>
        </div>
        <button :disabled="!url || !email || loading" @click="check"
          class="w-full bg-purple-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-purple-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ loading ? "診断中…" : "診断する" }}
        </button>
        <p v-if="apiError" class="text-xs text-red-400">{{ apiError }}</p>
      </div>

      <div v-if="result" class="space-y-4">
        <!-- リスク判定 -->
        <div :class="['rounded-xl border p-5', riskBg(result.summary.risk)]">
          <p :class="['text-2xl font-black mb-1', riskText(result.summary.risk)]">{{ riskLabel(result.summary.risk) }}</p>
          <p class="text-xs text-slate-400">{{ result.url }}</p>
          <p class="text-sm text-slate-300 mt-2">
            <template v-if="result.summary.risk === 'high'">広告トラッカーが検出されましたが、同意バナーが見つかりません。早急な対応が必要です。</template>
            <template v-else-if="result.summary.risk === 'medium'">トラッカーが検出されましたが、同意バナーが見つかりません。設置を検討してください。</template>
            <template v-else>同意管理の設定が確認できました。</template>
          </p>
        </div>

        <!-- トラッカー -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800">
            <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">検出されたトラッカー（{{ result.trackers.length }}件）</p>
          </div>
          <div v-if="result.trackers.length" class="divide-y divide-slate-800">
            <div v-for="t in result.trackers" :key="t.name" class="px-5 py-3 flex items-center justify-between">
              <span class="text-sm text-slate-300">{{ t.name }}</span>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded', typeBadge(t.type)]">{{ typeLabel(t.type) }}</span>
            </div>
          </div>
          <p v-else class="px-5 py-3 text-xs text-green-400">トラッカーは検出されませんでした</p>
        </div>

        <!-- 同意・プライバシー -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          <div class="px-5 py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-white">同意バナー</p>
              <p class="text-xs text-slate-500 mt-0.5">Cookie同意管理ツール</p>
            </div>
            <div class="text-right">
              <span v-if="result.consent.length" class="text-xs text-green-400 font-bold">✓ {{ result.consent.map(c => c.name).join(', ') }}</span>
              <span v-else class="text-xs text-red-400 font-bold">✗ 未検出</span>
            </div>
          </div>
          <div class="px-5 py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-white">プライバシーポリシー</p>
              <p class="text-xs text-slate-500 mt-0.5">ページ内でのリンク確認</p>
            </div>
            <span :class="['text-xs font-bold', result.hasPrivacyPolicy ? 'text-green-400' : 'text-yellow-400']">
              {{ result.hasPrivacyPolicy ? '✓ あり' : '△ 未検出' }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          詳細レポートを <span class="font-semibold text-slate-300 mx-1">{{ result.email }}</span> に送信しました
        </div>
      </div>
    </div>
  </div>
</template>
