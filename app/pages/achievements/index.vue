<script setup lang="ts">
import { NuxtLink } from "#components";

type Achievement = {
  title: string;
  description: string;
  customer: string;
  location: string;
  url?: string;
};

const achievements: Achievement[] = [
  {
    title: "X（旧Twitter）投稿管理サービス開発",
    description: "X（旧Twitter）の投稿管理サービスを開発ました",
    customer: "ブランディング会社様",
    location: "福岡県福岡市",
    url: "/achievements/branding-x-management",
  },
  {
    title: "Webサイト開発",
    description: "スポーツ用品コンサルタント様のWebサイトを再構築しました",
    customer: "スポーツ用品コンサルタント様",
    location: "愛知県東浦町",
    url: "/achievements/web-dev-for-sports-consultant",
  },
  {
    title: "地図アプリケーション開発",
    description:
      "パッケージとして活用できる地図アプリケーション開発を支援しました。",
    customer: "地図会社様",
    location: "福岡県福岡市",
  },
  {
    title: "JamStack情報発信基盤構築",
    description:
      "継続的に拡張可能なWeb基盤を構築し、コンテンツ更新の効率化とSEO強化を実現しました。",
    customer: "自社サービス",
    location: "福岡県福岡市",
    url: "/achievements/jamastack-information-infrastructure",
  },
  {
    title: "コースセンターシステムのAPI開発",
    description: "SalesForceとホストを繋ぐAPIソフトウェアを支援しました。",
    customer: "エネルギー会社様",
    location: "福岡県福岡市",
  },
  {
    title: "顧客データMAP可視化ソフトウェア",
    description:
      "CSVでアップロードした顧客データを地図にマッピングして、顧客属性の可視化を実現しました。",
    customer: "自社サービス",
    location: "福岡県福岡市",
  },
  {
    title: "ブログソフトウェア開発",
    description: "NotionをAPIとしたブログソフトウェア開発を実施しました。",
    customer: "自社サービス",
    location: "福岡県福岡市",
  },
  {
    title: "営業マッチングソフトウェア開発",
    description: "商品の作り手と売り手をつなぐソフトウェア開発を支援しました。",
    customer: "マーケティング会社様",
    location: "東京都渋谷区",
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

          <div class="grid gap-3 rounded-lg bg-gray-50 p-4 text-sm">
            <div>
              <p class="text-xs font-medium text-gray-500">お客様</p>
              <p class="mt-1 font-semibold text-gray-900">
                {{ item.customer }}
              </p>
            </div>

            <div>
              <p class="text-xs font-medium text-gray-500">お客様所在地</p>
              <p class="mt-1 font-semibold text-gray-900">
                {{ item.location }}
              </p>
            </div>
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
