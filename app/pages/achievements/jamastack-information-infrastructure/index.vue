<script setup lang="ts">
const issues = [
  "WordPressは便利だが、頻繁に更新する企業サイトでは保守・セキュリティ・表示速度の課題が出やすい",
  "コーポレートサイト、ブログ、ニュース、実績などを柔軟に出し分けたい",
  "WordPressを直接公開せず、安全性を高めた構成にしたい",
  "Next.jsとWordPressを組み合わせた実用的なスターターが必要だった",
];

const proposals = [
  "WordPressをCMSとして使い、フロントエンドはNext.jsで構築",
  "WordPressを管理画面・記事管理に集中させ、表示側を分離",
  "Docker構成でローカル開発しやすいスターターとして整備",
  "頻繁に更新する企業サイト向けのOSSとして公開",
];

const works = [
  "Next.js App Routerをベースにしたフロントエンド構成を設計",
  "WordPress REST APIから投稿・カテゴリ情報を取得する仕組みを実装",
  "Docker Composeによるローカル開発環境を整備",
  "README、利用用途、セットアップ手順を整理",
  "GitHubでOSSとして公開できる形に整備",
];

const results = [
  "WordPressの更新性とNext.jsの表示性能を両立",
  "企業サイト向けの再利用可能なスターターを作成",
  "セキュリティを意識したHeadless WordPress構成を実現",
  "今後の自社サービス・受託開発の土台として活用可能に",
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
          Next.js × Headless WordPress スターター開発
        </h1>

        <p class="text-gray-600 leading-relaxed">
          頻繁に情報発信・更新を行う企業向けに、WordPressの管理しやすさと
          Next.jsの表示性能を組み合わせたHeadless
          WordPressスターターを開発しました。
        </p>

        <div class="grid gap-4 sm:grid-cols-3 pt-2">
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">区分</p>
            <p class="mt-1 font-semibold text-gray-900">自社OSS</p>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">開発構成</p>
            <p class="mt-1 font-semibold text-gray-900">Next.js + WordPress</p>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">目的</p>
            <p class="mt-1 font-semibold text-gray-900">
              高速・安全・更新しやすい
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">課題</h2>
          <p class="mt-1 text-gray-500">
            WordPress単体運用で起きやすい課題を整理しました。
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
            WordPressを捨てるのではなく、役割を分離する構成にしました。
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
            OSSとして使いやすいよう、構成・README・開発体験を整えました。
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
