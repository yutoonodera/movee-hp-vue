<script setup lang="ts">
import { NuxtLink } from "#components";

type Achievement = {
  title: string;
  description: string;
  tags: string[];
  url?: string;
};

const achievements: Achievement[] = [
  {
    title: "Webサイト開発",
    description: "スポーツ用品コンサルタント様のWebサイトを再構築しました",
    tags: ["TypeScript", "Next.js", "Vercel", "React", "Resend"],
    // url: "/achievements/web-dev-for-sports-consultant",
  },
  {
    title: "地図アプリケーション開発",
    description:
      "パッケージとして活用できる地図アプリケーション開発を支援しました。",
    tags: ["TypeScript", "GIS", "Nest.js", "Vue.js", "PostgreSQL"],
  },
  {
    title: "JamStack情報発信基盤構築",
    description:
      "継続的に拡張可能なWeb基盤を構築し、コンテンツ更新の効率化とSEO強化を実現しました。",
    tags: [
      "自社サービス",
      "CMS",
      "SEO",
      "Next.js",
      "React",
      "Cloudflare",
      "Docker",
      "MySQL",
    ],
    url: "/achievements/jamastack-information-infrastructure",
  },
  {
    title: "コースセンターシステムのAPI開発",
    description: "SalesForceとホストを繋ぐAPIソフトウェアを支援しました。",
    tags: ["Java", "Spring Boot"],
  },
  {
    title: "顧客データMAP可視化ソフトウェア",
    description:
      "CSVでアップロードした顧客データを地図にマッピングして、顧客属性の可視化を実現しました。",
    tags: ["自社サービス", "leaflet", "Nuxt.js", "Vue.js", "GIS"],
  },
  {
    title: "ブログソフトウェア開発",
    description: "NotionをAPIとしたブログソフトウェア開発を実施しました。",
    tags: ["自社サービス", "NotionAPI", "Next.js", "React"],
  },
  {
    title: "営業マッチングソフトウェア開発",
    description: "商品の作り手と売り手をつなぐソフトウェア開発を支援しました。",
    tags: ["OctoberCMS", "PHP", "kintone", "MySQL"],
    url: "/achievements/sales-manegement-software",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-14 space-y-10">
      <!-- 上部タイトル -->
      <section class="text-center space-y-3">
        <p
          class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
        >
          WORKS
        </p>

        <h1 class="text-3xl font-bold text-gray-900">実績</h1>

        <p class="text-gray-600">
          開発支援・自社サービスを中心に、一部実績をご紹介します。
        </p>
      </section>

      <!-- 実績一覧 -->
      <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <component
          v-for="(item, index) in achievements"
          :key="index"
          :is="item.url ? NuxtLink : 'div'"
          :to="item.url"
          class="group rounded-xl border bg-white p-6 space-y-4 transition-all duration-200"
          :class="
            item.url
              ? 'cursor-pointer border-blue-200 shadow-md hover:-translate-y-1 hover:shadow-xl'
              : 'border-gray-200 shadow-sm'
          "
        >
          <div class="flex items-start justify-between gap-3">
            <h2 class="text-lg font-semibold leading-snug text-gray-900">
              {{ item.title }}
            </h2>

            <span
              v-if="item.url"
              class="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600"
            >
              詳細あり
            </span>
          </div>

          <p class="text-sm leading-relaxed text-gray-700">
            {{ item.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              {{ tag }}
            </span>
          </div>

          <div
            v-if="item.url"
            class="pt-2 text-sm font-medium text-blue-600 opacity-80 transition group-hover:opacity-100"
          >
            詳細を見る →
          </div>
        </component>
      </section>

      <!-- 下部リンク -->
      <section class="border-t pt-8">
        <div
          class="flex flex-col items-center gap-4 text-sm sm:flex-row sm:justify-center"
        >
          <a
            href="https://movee.jp"
            class="text-gray-600 underline hover:text-gray-900"
          >
            movee.jp
          </a>
        </div>
      </section>
    </div>
  </div>
</template>
