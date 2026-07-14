<script setup lang="ts">
useHead({ title: "メール到達性チェッカー — movee" });

type Grade = "A" | "B" | "C";
interface Result {
  domain: string;
  spf:   { found: boolean; record: string | null; strict: boolean; softFail: boolean };
  dmarc: { found: boolean; record: string | null; policy: string | null };
  dkim:  { found: boolean; selector: string | null };
  mx:    { found: boolean; records: string[] };
  grade: Grade;
  email: string;
}

const route   = useRoute();
const domain  = ref((route.query.domain as string) ?? "");
const email   = ref((route.query.email as string) ?? "");
const loading = ref(false);
const result  = ref<Result | null>(null);
const apiError = ref<string | null>(null);

onMounted(() => { if (domain.value && email.value) check(); });

async function check() {
  if (!domain.value || !email.value) return;
  loading.value = true; result.value = null; apiError.value = null;
  try {
    result.value = await $fetch<Result>("/api/check-email-deliverability", {
      method: "POST",
      body: { domain: domain.value, email: email.value },
    });
  } catch (e: any) {
    apiError.value = e?.data?.message ?? e?.message ?? "チェックに失敗しました";
  } finally { loading.value = false; }
}

const gradeColor = (g: Grade) => g === "A" ? "text-green-400" : g === "B" ? "text-yellow-400" : "text-red-400";
const gradeBg    = (g: Grade) => g === "A" ? "bg-green-950 border-green-800" : g === "B" ? "bg-yellow-950 border-yellow-800" : "bg-red-950 border-red-800";
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <NuxtLink to="/" class="font-mono font-bold text-white text-lg">movee</NuxtLink>
      <span class="text-xs font-mono text-slate-500">メール到達性チェッカー</span>
    </header>

    <div class="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div class="space-y-1">
        <p class="text-xs font-mono text-cyan-500 tracking-widest uppercase">Email Deliverability · by movee</p>
        <h1 class="text-2xl font-bold text-white">メール到達性チェッカー</h1>
        <p class="text-sm text-slate-400">ドメインのSPF・DMARC・DKIMを確認して、メールがスパム判定されやすい状態になっていないかチェックします。</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">ドメイン または メールアドレス</label>
          <input v-model="domain" type="text" placeholder="example.com または user@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">メールアドレス</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <p class="text-xs text-slate-600">詳細レポートをメールで送信します</p>
        </div>
        <button :disabled="!domain || !email || loading" @click="check"
          class="w-full bg-cyan-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ loading ? "チェック中…" : "チェックする" }}
        </button>
        <p v-if="apiError" class="text-xs text-red-400">{{ apiError }}</p>
      </div>

      <div v-if="result" class="space-y-4">
        <!-- グレード -->
        <div :class="['rounded-xl border p-5 flex items-center gap-6', gradeBg(result.grade)]">
          <span :class="['text-6xl font-black', gradeColor(result.grade)]">{{ result.grade }}</span>
          <div>
            <p class="text-sm font-semibold text-white">{{ result.domain }}</p>
            <p class="text-xs text-slate-400 mt-1">
              {{ result.grade === 'A' ? 'メール認証が適切に設定されています' : result.grade === 'B' ? '一部の設定に改善の余地があります' : '重要な設定が不足しています' }}
            </p>
          </div>
        </div>

        <!-- チェック項目 -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="divide-y divide-slate-800">

            <div class="px-5 py-4">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-white">SPF</p>
                <span :class="['text-xs font-bold', result.spf.found ? 'text-green-400' : 'text-red-400']">
                  {{ result.spf.found ? (result.spf.strict ? '✓ 設定済み（厳格）' : result.spf.softFail ? '△ 設定済み（ソフト）' : '△ 設定済み') : '✗ 未設定' }}
                </span>
              </div>
              <p class="text-xs text-slate-600">送信元IPの正当性を証明するレコード</p>
              <p v-if="result.spf.record" class="text-xs font-mono text-slate-500 mt-1 break-all">{{ result.spf.record }}</p>
            </div>

            <div class="px-5 py-4">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-white">DMARC</p>
                <span :class="['text-xs font-bold', result.dmarc.found && result.dmarc.policy !== 'none' ? 'text-green-400' : result.dmarc.found ? 'text-yellow-400' : 'text-red-400']">
                  {{ result.dmarc.found ? `△ p=${result.dmarc.policy}` : '✗ 未設定' }}
                  {{ result.dmarc.policy === 'reject' ? '（✓ 最強）' : result.dmarc.policy === 'quarantine' ? '（推奨）' : '' }}
                </span>
              </div>
              <p class="text-xs text-slate-600">なりすましメールへのポリシー設定</p>
              <p v-if="result.dmarc.record" class="text-xs font-mono text-slate-500 mt-1 break-all">{{ result.dmarc.record }}</p>
            </div>

            <div class="px-5 py-4">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-white">DKIM</p>
                <span :class="['text-xs font-bold', result.dkim.found ? 'text-green-400' : 'text-yellow-400']">
                  {{ result.dkim.found ? `✓ 検出 (selector: ${result.dkim.selector})` : '— セレクタ不明' }}
                </span>
              </div>
              <p class="text-xs text-slate-600">メール署名による改ざん防止</p>
            </div>

            <div class="px-5 py-4">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-white">MXレコード</p>
                <span :class="['text-xs font-bold', result.mx.found ? 'text-green-400' : 'text-red-400']">
                  {{ result.mx.found ? `✓ ${result.mx.records.length}件` : '✗ 未設定' }}
                </span>
              </div>
              <p class="text-xs text-slate-600">メール受信サーバーの設定</p>
              <p v-if="result.mx.records.length" class="text-xs font-mono text-slate-500 mt-1">{{ result.mx.records.join(' / ') }}</p>
            </div>

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
