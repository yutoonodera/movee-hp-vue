<script setup lang="ts">
type Achievement = {
  title: string
  description: string
  tags: string[]
}

const achievements: Achievement[] = [
  {
    title: "地図アプリケーション開発",
    description:
      "パッケージとして活用できる地図アプリケーション開発を支援しました。",
    tags: ["TypeScript", "GIS", "Next.js", "React"],
  },
  {
    title: "JamStack情報発信基盤構築",
    description:
      "継続的に拡張可能なWeb基盤を構築し、コンテンツ更新の効率化とSEO強化を実現しました。",
    tags: ["自社サービス", "CMS", "SEO", "Cloudflare", "Docker"],
  },
  {
    title: "コースセンターシステムのAPI開発",
    description:
      "SalesForceとホストを繋ぐAPIソフトウェアを支援しました。",
    tags: ["Java", "Spring Boot"],
  },
  {
    title: "顧客データMAP可視化ソフトウェア",
    description:
      "CSVでアップロードした顧客データを地図にマッピングして、顧客属性の可視化を実現しました。",
    tags: ["自社サービス", "leaflet", "Nuxt.js", "GIS"],
  },
  {
    title: "ブログソフトウェア開発",
    description:
      "NotionをAPIとしたブログソフトウェア開発を実施しました。",
    tags: ["自社サービス", "NotionAPI", "Next.js"],
  },
    {
    title: "営業マッチングソフトウェア開発",
    description:
      "商品の作り手と売り手をつなぐソフトウェア開発を支援しました",
    tags: ["OctoberCMS", "PHP", "kintone"],
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <!-- ヘッダー -->
      <div class="text-center space-y-3">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
          実績一覧
        </h1>
        <p class="text-gray-600">
          取り組みを一部ご紹介します。
        </p>
      </div>

      <!-- カード一覧 -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in achievements"
          :key="index"
          class="bg-white rounded-xl shadow-sm border p-6 space-y-4"
        >
          <h2 class="font-semibold text-lg text-gray-900">
            {{ item.title }}
          </h2>

          <p class="text-gray-700 text-sm leading-relaxed">
            {{ item.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      <div class="pt-6">
        <NuxtLink to="/" class="text-sm text-gray-600 underline hover:text-gray-900">
          株式会社movee
        </NuxtLink>
      </div>
    </div>
  </div>
</template>