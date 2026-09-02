<script setup lang="ts">
useHead({ title: "実績 — 株式会社movee" });

interface Achievement {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string };
  customer: string | null; location: string | null;
  featuredImage: string | null;
}

const { data: achievements, status } = await useFetch<Achievement[]>("/api/wp/achievements");
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-14 space-y-10">

      <section class="text-center space-y-3">
        <p class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">WORKS</p>
        <h1 class="text-3xl font-bold text-gray-900">実績</h1>
        <p class="text-gray-600">開発支援・自社サービスを中心に、一部実績をご紹介します。</p>
      </section>

      <div v-if="status === 'pending'" class="text-center text-gray-400 py-20">読み込み中…</div>
      <div v-else-if="!achievements?.length" class="text-center text-gray-400 py-20">実績が見つかりませんでした。</div>

      <section v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="item in achievements"
          :key="item.id"
          :to="`/achievements/${item.slug}`"
          class="group rounded-xl border bg-white p-6 space-y-4 transition-all duration-200 cursor-pointer border-blue-200 shadow-md hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 class="text-lg font-semibold leading-snug text-gray-900" v-html="item.title.rendered" />

          <div v-if="item.customer || item.location" class="grid gap-3 rounded-lg bg-gray-50 p-4 text-sm">
            <div v-if="item.customer">
              <p class="text-xs font-medium text-gray-500">お客様</p>
              <p class="mt-1 font-semibold text-gray-900">{{ item.customer }}</p>
            </div>
            <div v-if="item.location">
              <p class="text-xs font-medium text-gray-500">お客様所在地</p>
              <p class="mt-1 font-semibold text-gray-900">{{ item.location }}</p>
            </div>
          </div>

          <p class="text-sm leading-relaxed text-gray-700" v-html="item.excerpt.rendered" />
        </NuxtLink>
      </section>

    </div>
  </div>
</template>
