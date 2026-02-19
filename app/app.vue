<script setup lang="ts">
import MapHeat from '~/components/MapHeat.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <ClientOnly>
        <MapHeat />
      </ClientOnly>

      <!-- あなたのカード -->
      <div class="p-6 rounded-2xl shadow bg-white space-y-4">
        <div>
          <h3 class="font-bold text-lg">マップ活用のソフトウェア開発</h3>
          <p class="text-gray-700">GISなどを有効活用するソフトウェアを開発いたします。</p>
        </div>

        <div>
          <h3 class="font-bold text-lg">マップ導入サイト制作</h3>
          <p class="text-gray-700">お客様のご要望に合わせてWebサイトを制作します。
            <span class="text-sm text-gray-500">※Googleビジネスプロフィール登録、簡易な店舗データ分析は無料</span>
          </p>
        </div>

        <div>
          <h3 class="font-bold text-lg">日用品小売のデータ分析</h3>
          <p class="text-gray-700">マップやオープンデータ、御社データを組み合わせて、データ分析を行います。</p>
        </div>

        <p class="pt-2 text-gray-600">株式会社movee</p>

        <div class="pt-2 flex flex-col sm:flex-row gap-3">
          <NuxtLink to="/demo" class="px-5 py-3 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700">
            デモを見る
          </NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-lg border text-center hover:bg-gray-100">
            商品説明を聞きたい方はこちら
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
