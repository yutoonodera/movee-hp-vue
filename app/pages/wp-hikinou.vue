<script setup lang="ts">
type Grade = "A" | "B" | "C";

interface ScoreItem {
  score: number;
  grade: Grade;
}
interface AuditDetail {
  auditTitle: string;
  items: string[];
}
interface SecurityFinding {
  level: "critical" | "warning" | "info";
  message: string;
}
interface SecurityResult {
  score: number;
  grade: Grade;
  isHttps: boolean;
  headers: { name: string; present: boolean }[];
  findings: SecurityFinding[];
}
interface PageResult {
  url: string;
  performance: ScoreItem | null;
  accessibility: ScoreItem | null;
  auditDetails: AuditDetail[];
  psError: string | null;
}
interface MultiResult {
  rootUrl: string;
  pages: PageResult[];
  security: SecurityResult | null;
  email: string;
  crawledCount: number;
}

const url = ref("");
const email = ref("");
const loading = ref(false);
const result = ref<MultiResult | null>(null);
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
  if (grade === "A") return "text-green-600";
  if (grade === "B") return "text-yellow-500";
  return "text-red-500";
};

const gradeBg = (grade: Grade) => {
  if (grade === "A") return "bg-green-50 border-green-200";
  if (grade === "B") return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};

const shortPath = (fullUrl: string) => {
  try {
    return new URL(fullUrl).pathname || "/";
  } catch {
    return fullUrl;
  }
};

// サイト全体の最低スコアをサマリーとして表示（データなし=null）
const worstGrade = (items: (ScoreItem | null)[]): Grade | null => {
  const grades = items.filter(Boolean).map((i) => i!.grade);
  if (!grades.length) return null;
  if (grades.includes("C")) return "C";
  if (grades.includes("B")) return "B";
  return "A";
};

const summary = computed(() => {
  if (!result.value) return null;
  const { pages, security } = result.value;
  return {
    performance: worstGrade(pages.map((p) => p.performance)),
    accessibility: worstGrade(pages.map((p) => p.accessibility)),
    security: security?.grade ?? null,
  };
});

const psErrorCount = computed(
  () => result.value?.pages.filter((p) => p.psError).length ?? 0,
);

async function analyze() {
  apiError.value = null;
  result.value = null;
  elapsedSec.value = 0;
  totalSec.value = 0;
  loading.value = true;
  _timer = setInterval(() => {
    elapsedSec.value++;
  }, 1000);
  try {
    const data = await $fetch<MultiResult>("/api/analyze-wp", {
      method: "POST",
      body: { url: url.value, email: email.value },
      timeout: 420000,
    });
    result.value = data;
    totalSec.value = elapsedSec.value;
  } catch (e: any) {
    apiError.value =
      e?.data?.message ?? e?.message ?? "分析中にエラーが発生しました";
  } finally {
    if (_timer) {
      clearInterval(_timer);
      _timer = null;
    }
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <!-- Header -->
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-gray-900">Wordpressの非機能診断くん</h1>
        <p class="text-sm text-gray-500">
          WordPressサイトの表示速度・セキュリティ・使いやすさを診断します。指定したURLのみを診断します。
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow p-6 space-y-4">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700"
            >診断するURL</label
          >
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700"
            >メールアドレス</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-400">詳細レポートをメールで送信します</p>
        </div>
        <button
          :disabled="loading || !url || !email"
          class="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="analyze"
        >
          <svg
            v-if="loading"
            class="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span v-if="loading">分析中… {{ elapsedLabel(elapsedSec) }}</span>
          <span v-else>分析する</span>
        </button>
        <p class="text-xs text-gray-400">
          分析には30秒から1分ほどかかります。指定したURLのみを診断します。
        </p>
        <p v-if="apiError" class="text-xs text-red-600">{{ apiError }}</p>
      </div>

      <!-- Results -->
      <div v-if="result" class="space-y-4">
        <p class="text-xs text-gray-400">
          {{ result.rootUrl }} —
          {{ result.crawledCount }}ページを分析しました（{{
            elapsedLabel(totalSec)
          }}）
        </p>

        <!-- サイト全体のサマリーカード -->
        <div class="grid grid-cols-3 gap-3">
          <template
            v-for="item in [
              { label: '表示速度', grade: summary?.performance },
              { label: '使いやすさ', grade: summary?.accessibility },
              { label: 'セキュリティ', grade: summary?.security ?? null },
            ]"
            :key="item.label"
          >
            <div
              v-if="item.grade"
              :class="[
                'rounded-2xl border p-4 flex flex-col items-center gap-1',
                gradeBg(item.grade),
              ]"
            >
              <p class="text-xs font-semibold text-gray-500 tracking-wide">
                {{ item.label }}
              </p>
              <span :class="['text-5xl font-black', gradeColor(item.grade)]">{{
                item.grade
              }}</span>
              <p class="text-xs text-gray-400">サイト全体の最低評価</p>
            </div>
            <div
              v-else
              class="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center gap-1"
            >
              <p class="text-xs font-semibold text-gray-400 tracking-wide">
                {{ item.label }}
              </p>
              <span class="text-5xl font-black text-gray-300">–</span>
            </div>
          </template>
        </div>

        <!-- PageSpeed エラーバナー -->
        <div
          v-if="psErrorCount > 0"
          class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1"
        >
          <p class="font-semibold">
            {{ psErrorCount }}ページの表示速度・使いやすさの取得に失敗しました
          </p>
          <p class="text-amber-600">
            {{ result!.pages.find((p) => p.psError)?.psError }}
          </p>
        </div>

        <!-- ページ別一覧テーブル -->
        <div class="bg-white rounded-2xl shadow overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-800">ページ別スコア</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="text-left px-5 py-3 text-xs font-semibold text-gray-500"
                  >
                    ページ
                  </th>
                  <th
                    class="text-center px-4 py-3 text-xs font-semibold text-gray-500"
                  >
                    表示速度
                  </th>
                  <th
                    class="text-center px-4 py-3 text-xs font-semibold text-gray-500"
                  >
                    使いやすさ
                  </th>
                  <th
                    class="text-center px-4 py-3 text-xs font-semibold text-gray-500"
                  >
                    セキュリティ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="page in result.pages"
                  :key="page.url"
                  class="border-t border-gray-50 hover:bg-gray-50 transition"
                >
                  <td
                    class="px-5 py-3 text-gray-700 font-mono text-xs max-w-xs truncate"
                    :title="page.url"
                  >
                    {{ shortPath(page.url) }}
                  </td>
                  <!-- Performance -->
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="page.performance"
                      :class="[
                        'font-bold text-sm',
                        gradeColor(page.performance.grade),
                      ]"
                    >
                      {{ page.performance.grade }}
                      <span class="text-xs font-normal text-gray-400 ml-1">{{
                        page.performance.score
                      }}</span>
                    </span>
                    <span
                      v-else-if="page.psError"
                      class="text-xs text-amber-500"
                      title="取得失敗"
                      >ERR</span
                    >
                    <span v-else class="text-gray-300 text-sm">–</span>
                  </td>
                  <!-- Accessibility -->
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="page.accessibility"
                      :class="[
                        'font-bold text-sm',
                        gradeColor(page.accessibility.grade),
                      ]"
                    >
                      {{ page.accessibility.grade }}
                      <span class="text-xs font-normal text-gray-400 ml-1">{{
                        page.accessibility.score
                      }}</span>
                    </span>
                    <span
                      v-else-if="page.psError"
                      class="text-xs text-amber-500"
                      title="取得失敗"
                      >ERR</span
                    >
                    <span v-else class="text-gray-300 text-sm">–</span>
                  </td>
                  <!-- Security (共通) -->
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="result.security"
                      :class="[
                        'font-bold text-sm',
                        gradeColor(result.security.grade),
                      ]"
                    >
                      {{ result.security.grade }}
                      <span class="text-xs font-normal text-gray-400 ml-1">{{
                        result.security.score
                      }}</span>
                    </span>
                    <span v-else class="text-gray-300 text-sm">–</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-gray-400 px-5 py-2 border-t border-gray-50">
            ※ セキュリティはドメイン共通のため全ページ同一スコアです
          </p>
        </div>

        <!-- 主な問題一覧 -->
        <div
          v-if="result.pages.some((p) => p.auditDetails?.length)"
          class="bg-white rounded-2xl shadow overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-800">主な問題点</h2>
            <p class="text-xs text-gray-400 mt-0.5">
              詳細はメールでお送りしたレポートをご確認ください
            </p>
          </div>
          <div class="divide-y divide-gray-50">
            <div
              v-for="page in result.pages.filter((p) => p.auditDetails?.length)"
              :key="page.url"
              class="px-5 py-4"
            >
              <p class="text-xs font-mono text-gray-500 mb-2">
                {{ shortPath(page.url) }}
              </p>
              <ul class="space-y-2">
                <li
                  v-for="d in page.auditDetails"
                  :key="d.auditTitle"
                  class="text-xs"
                >
                  <span class="font-semibold text-gray-700">{{
                    d.auditTitle
                  }}</span>
                  <ul class="mt-1 ml-3 space-y-0.5">
                    <li
                      v-for="(item, i) in d.items.slice(0, 3)"
                      :key="i"
                      class="text-gray-400"
                    >
                      — {{ item }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- セキュリティ診断結果 -->
        <div
          v-if="result.security?.findings?.length"
          class="bg-white rounded-2xl shadow overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-800">
              セキュリティ診断
            </h2>
          </div>
          <ul class="divide-y divide-gray-50">
            <li
              v-for="(f, i) in result.security.findings"
              :key="i"
              class="px-5 py-3 flex items-start gap-3 text-xs"
            >
              <span
                :class="[
                  'mt-0.5 shrink-0 inline-block px-2 py-0.5 rounded font-semibold',
                  f.level === 'critical'
                    ? 'bg-red-100 text-red-700'
                    : f.level === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-600',
                ]"
              >
                {{
                  f.level === "critical"
                    ? "重大"
                    : f.level === "warning"
                      ? "警告"
                      : "情報"
                }}
              </span>
              <span class="text-gray-700">{{ f.message }}</span>
            </li>
          </ul>
        </div>

        <!-- Email notice -->
        <div
          class="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          詳細レポートを
          <span class="font-semibold mx-1">{{ result.email }}</span>
          に送信しました
        </div>

        <!-- Grade Legend -->
        <div class="flex gap-4 text-xs text-gray-400 justify-center">
          <span><span class="text-green-600 font-bold">A</span> 90点以上</span>
          <span><span class="text-yellow-500 font-bold">B</span> 50〜89点</span>
          <span><span class="text-red-500 font-bold">C</span> 50点未満</span>
        </div>
      </div>
    </div>
  </div>
</template>
