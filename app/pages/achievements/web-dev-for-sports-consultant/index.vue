<script setup lang="ts">
const issues = [
  "お名前.com関連サイトからセキュリティ警告が表示されていた",
  "既存サイトがWordPressで構成されており、保守負荷とリスクがあった",
  "今後は別事業へ注力するため、サイト運用コストを下げたかった",
  "必要機能は問い合わせのみで、複雑なCMS機能は不要だった",
];

const proposals = [
  "WordPressを廃止し、軽量な構成へ移行",
  "HTTPS化を含む最低限のセキュリティ強化",
  "更新不要な構成のため、静的寄りかつフォーム付きのNext.js構成を採用",
  "Vercel運用を基本とし、必要に応じてVPS移行可能な構成にした",
];

const works = [
  "既存構成・サーバ契約・ドメイン状況の調査",
  "静的HTML / CMS / 動的開発の3パターン比較",
  "Next.js（TypeScript + React）でサイト再構築",
  "問い合わせフォーム実装",
  "Vercelデプロイ・テスト環境構築",
  "DNS切替準備、本番移行手順の整理",
];

const results = [
  "WordPress依存から脱却",
  "高速表示・軽量サイトへ刷新",
  "HTTPS対応による信頼性向上",
  "今後の運用負荷を大幅削減",
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-5xl px-4 py-14 space-y-12">
      <!-- Hero -->
      <section class="rounded-2xl bg-white p-8 shadow-sm border space-y-5">
        <p
          class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
        >
          Case Study
        </p>

        <h1 class="text-3xl font-bold text-gray-900 leading-tight">
          スポーツコンサルティング会社様の<br />
          Webサイト刷新支援
        </h1>

        <p class="text-gray-600 leading-relaxed">
          セキュリティ警告が出ていた既存サイトを見直し、
          WordPress依存を解消。今後の本業に集中できるよう、
          運用負荷の少ない構成へ再設計しました。
        </p>

        <div class="grid gap-4 sm:grid-cols-3 pt-2">
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">期間</p>
            <p class="mt-1 font-semibold text-gray-900">約2ヶ月</p>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">開発構成</p>
            <p class="mt-1 font-semibold text-gray-900">Next.js + Vercel</p>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">目的</p>
            <p class="mt-1 font-semibold text-gray-900">安全・軽量・低保守</p>
          </div>
        </div>
      </section>

      <!-- 課題 -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">課題</h2>
          <p class="mt-1 text-gray-500">
            現状を整理し、本当に必要な機能だけを見極めました。
          </p>
        </div>

        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <div
            v-for="(item, index) in issues"
            :key="item"
            class="flex gap-4 py-5 border-b last:border-b-0"
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-red-600"
            >
              {{ index + 1 }}
            </div>

            <p class="pt-1 leading-relaxed text-gray-700">
              {{ item }}
            </p>
          </div>
        </div>
      </section>

      <!-- 提案 -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">提案</h2>
          <p class="mt-1 text-gray-500">
            要件に対して、過不足のない構成を提案しました。
          </p>
        </div>

        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <div
            v-for="(item, index) in proposals"
            :key="item"
            class="flex gap-4 py-5 border-b last:border-b-0"
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600"
            >
              {{ index + 1 }}
            </div>

            <p class="pt-1 leading-relaxed text-gray-700">
              {{ item }}
            </p>
          </div>
        </div>
      </section>

      <!-- 実施内容 -->
      <section class="space-y-5">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">実施内容</h2>
          <p class="text-gray-500 mt-1">
            単なる制作ではなく、調査・設計・移行まで対応しました。
          </p>
        </div>

        <div class="rounded-2xl border bg-white p-6 shadow-sm">
          <div
            v-for="(item, index) in works"
            :key="item"
            class="flex gap-4 py-4 border-b last:border-b-0"
          >
            <div
              class="h-8 w-8 shrink-0 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center"
            >
              {{ index + 1 }}
            </div>

            <p class="text-gray-700 leading-relaxed pt-1">
              {{ item }}
            </p>
          </div>
        </div>
      </section>

      <!-- 成果 -->
      <section class="rounded-2xl bg-blue-600 p-8 text-white space-y-5">
        <h2 class="text-2xl font-bold">成果</h2>

        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="item in results"
            :key="item"
            class="rounded-xl bg-white/10 p-5"
          >
            {{ item }}
          </div>
        </div>
      </section>

      <!-- 戻る -->
      <div>
        <NuxtLink
          to="/achievements"
          class="text-sm text-gray-600 underline hover:text-gray-900"
        >
          実績一覧へ戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
