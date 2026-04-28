<script setup lang="ts">
const issues = [
  "事業会社側で自由に編集したい情報と、システム側で厳密に管理するデータを分ける必要があった",
  "更新性を保ちながら、業務データとして扱う情報は安定して保存・管理する必要があった",
];

const proposals = [
  "OctoberCMSをベースに、管理しやすく拡張しやすいWebシステムとして設計",
  "事業会社が自由に編集したい情報はkintoneで管理",
  "システムのCRUD対象となるデータはMySQLで管理",
  "マッチングしやすい情報設計・画面設計を検討しながら実装",
];

const works = [
  "マッチングを成立させるために必要な情報項目を整理",
  "kintoneで管理するデータとMySQLで管理するデータを切り分け",
  "OctoberCMS / PHP / MySQL を用いたシステム構成を設計",
  "事業会社が情報を更新しやすい管理フローを設計",
  "検索・閲覧・問い合わせにつながる導線を意識して画面を実装",
];

const results = [
  "kintoneとMySQLを役割分担し、更新性とシステム安定性を両立",
  "事業会社が自分たちで情報を更新しやすい運用に対応",
  "業務に合わせて拡張しやすい構成を実現",
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-5xl px-4 py-14 space-y-12">
      <section class="rounded-2xl bg-white p-8 shadow-sm border space-y-5">
        <p
          class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
        >
          Case Study
        </p>

        <h1 class="text-3xl font-bold text-gray-900 leading-tight">
          営業マッチングソフトウェア開発
        </h1>

        <p class="text-gray-600 leading-relaxed">
          商品の作り手と売り手をつなぐ営業マッチングサービスにおいて、
          マッチングしやすい情報設計・機能設計から支援しました。
          事業会社が自由に編集したい情報はkintoneで管理し、
          システム側でCRUDするデータはMySQLで管理する構成としました。
        </p>

        <div class="grid gap-4 sm:grid-cols-3 pt-2">
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">期間</p>
            <p class="mt-1 font-semibold text-gray-900">約12ヶ月</p>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">開発構成</p>
            <p class="mt-1 font-semibold text-gray-900">
              PHP + OctoberCMS + MySQL
            </p>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">連携</p>
            <p class="mt-1 font-semibold text-gray-900">kintone</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">課題</h2>
          <p class="mt-1 text-gray-500">
            マッチングサービスとして成立させるため、情報設計から整理しました。
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

      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">提案</h2>
          <p class="mt-1 text-gray-500">
            更新性とシステム管理のしやすさを両立する構成を提案しました。
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

      <section class="space-y-5">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">実施内容</h2>
          <p class="text-gray-500 mt-1">
            技術実装だけでなく、マッチングしやすい機能設計から対応しました。
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
