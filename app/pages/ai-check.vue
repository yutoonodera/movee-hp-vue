<script setup lang="ts">
useHead({ title: "AI安全診断 — movee" });

type Grade = "A" | "B" | "C";

interface BotEntry {
  ua: string;
  desc: string;
  priority: boolean;
  blocked: boolean;
}

interface Result {
  url: string;
  grade: Grade;
  robots: {
    found: boolean;
    bots: BotEntry[];
    priorityBlocked: number;
    priorityTotal: number;
  };
  leaks: { name: string; snippet: string }[];
  email: string;
}

const route    = useRoute();
const url      = ref((route.query.url as string) ?? "");
const email    = ref((route.query.email as string) ?? "");
const loading  = ref(false);
const result   = ref<Result | null>(null);
const apiError = ref<string | null>(null);

onMounted(() => { if (url.value && email.value) check(); });

async function check() {
  if (!url.value || !email.value) return;
  loading.value = true; result.value = null; apiError.value = null;
  try {
    result.value = await $fetch<Result>("/api/check-ai", {
      method: "POST",
      body: { url: url.value, email: email.value },
    });
  } catch (e: any) {
    apiError.value = e?.data?.message ?? e?.message ?? "診断に失敗しました";
  } finally { loading.value = false; }
}

const gradeColor = (g: Grade) => g === "A" ? "text-green-400" : g === "B" ? "text-yellow-400" : "text-red-400";
const gradeBg    = (g: Grade) => g === "A" ? "bg-green-950 border-green-800" : g === "B" ? "bg-yellow-950 border-yellow-800" : "bg-red-950 border-red-800";
const gradeDesc  = (g: Grade) => g === "A" ? "AIへの学習利用対策が適切に設定されています" : g === "B" ? "一部のAIクローラーが許可されています" : "APIキーの漏洩が検出されました。至急対応が必要です";
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <NuxtLink to="/" class="font-mono font-bold text-white text-lg">movee</NuxtLink>
      <span class="text-xs font-mono text-slate-500">AI安全診断</span>
    </header>

    <div class="max-w-xl mx-auto px-4 py-10 space-y-6">

      <div class="space-y-1">
        <p class="text-xs font-mono text-violet-400 tracking-widest uppercase">AI Security · by movee</p>
        <h1 class="text-2xl font-bold text-white">AI安全診断</h1>
        <p class="text-sm text-slate-400">サイトのコンテンツがAIに無断学習されていないか確認。またHTMLやJSにAIサービスのAPIキーが露出していないかを診断します。</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">診断するURL</label>
          <input v-model="url" type="url" placeholder="https://example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider">メールアドレス</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <p class="text-xs text-slate-600">詳細レポートをメールで送信します</p>
        </div>
        <button :disabled="!url || !email || loading" @click="check"
          class="w-full bg-violet-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-violet-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ loading ? "診断中…" : "診断スタート" }}
        </button>
        <p v-if="apiError" class="text-xs text-red-400">{{ apiError }}</p>
      </div>

      <div v-if="result" class="space-y-4">

        <!-- 総合グレード -->
        <div :class="['rounded-xl border p-5 flex items-center gap-6', gradeBg(result.grade)]">
          <span :class="['text-6xl font-black leading-none', gradeColor(result.grade)]">{{ result.grade }}</span>
          <div>
            <p class="text-sm font-semibold text-white">{{ result.url }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ gradeDesc(result.grade) }}</p>
            <div class="flex gap-3 mt-2 text-xs text-slate-500">
              <span>AIクローラー: {{ result.robots.priorityBlocked }}/{{ result.robots.priorityTotal }} ブロック</span>
              <span>APIキー漏洩: {{ result.leaks.length }}件</span>
            </div>
          </div>
        </div>

        <!-- AIクローラーブロック -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">AIクローラーブロック</p>
              <p class="text-xs text-slate-600 mt-0.5">robots.txt の設定確認</p>
            </div>
            <span :class="['text-xs font-bold', result.robots.found ? 'text-slate-300' : 'text-red-400']">
              {{ result.robots.found ? `${result.robots.priorityBlocked}/${result.robots.priorityTotal} ブロック済` : 'robots.txt なし' }}
            </span>
          </div>

          <!-- 主要ボット -->
          <div class="divide-y divide-slate-800">
            <template v-for="bot in result.robots.bots" :key="bot.ua">
              <div class="px-5 py-3 flex items-center justify-between">
                <div>
                  <p class="text-sm font-mono text-white flex items-center gap-2">
                    {{ bot.ua }}
                    <span v-if="bot.priority" class="text-xs bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded">主要</span>
                  </p>
                  <p class="text-xs text-slate-500">{{ bot.desc }}</p>
                </div>
                <span :class="['text-xs font-bold shrink-0', bot.blocked ? 'text-green-400' : 'text-slate-500']">
                  {{ bot.blocked ? '🚫 ブロック' : '✓ 許可中' }}
                </span>
              </div>
            </template>
          </div>

          <div v-if="!result.robots.found" class="px-5 py-3 bg-red-950/40 border-t border-red-900">
            <p class="text-xs text-red-300">robots.txt が見つかりませんでした。AIクローラーのブロック設定を追加することをお勧めします。</p>
          </div>
        </div>

        <!-- APIキー漏洩 -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">APIキー漏洩チェック</p>
              <p class="text-xs text-slate-600 mt-0.5">HTML・JS ソースのスキャン</p>
            </div>
            <span :class="['text-xs font-bold', result.leaks.length ? 'text-red-400' : 'text-green-400']">
              {{ result.leaks.length ? `⚠ ${result.leaks.length}件検出` : '✓ クリーン' }}
            </span>
          </div>

          <div v-if="result.leaks.length" class="divide-y divide-slate-800">
            <div v-for="(leak, i) in result.leaks" :key="i"
              class="px-5 py-3 flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-bold text-red-400">{{ leak.name }}</p>
                <p class="text-xs font-mono text-slate-500 mt-0.5 break-all">{{ leak.snippet }}</p>
              </div>
              <span class="text-xs text-red-400 shrink-0 font-bold">要対応</span>
            </div>
          </div>
          <div v-else class="px-5 py-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-xs text-green-400">OpenAI・Anthropic・Google AI などのAPIキーは検出されませんでした。</p>
          </div>
        </div>

        <!-- メール送信済 -->
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
