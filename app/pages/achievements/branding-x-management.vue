<script setup lang="ts">
const issues = [
  "X（旧Twitter）の投稿案を複数人で管理する必要があった",
  "投稿文・投稿日時・画像・確認状況が分散し、管理が煩雑になっていた",
  "担当者ごとに確認・編集できる範囲を分ける必要があった",
  "スプレッドシート運用では、投稿プレビューや画像管理に限界があった",
];

const proposals = [
  "投稿案を一覧で管理できるWebサービスを開発",
  "投稿文・日時・画像・ステータスを一元管理できる構成を提案",
  "権限に応じて編集可能な項目を制御",
  "X投稿に近い見た目でプレビューできる画面を用意",
];

const works = [
  "要件整理・画面構成の設計",
  "Next.jsによるWebアプリケーション開発",
  "ログイン機能・ルーム管理機能の実装",
  "投稿文・日時・画像・確認ステータスの管理機能を実装",
  "権限ごとの編集制御を実装",
  "画像アップロード・投稿プレビュー機能を実装",
  "VPS環境へのデプロイ・ドメイン設定・SSL対応",
];

const results = [
  "投稿管理を一画面で確認できるようになった",
  "複数人での確認・編集フローを整理",
  "投稿前のイメージ確認がしやすくなった",
  "スプレッドシートでは難しかった画像付き投稿管理を実現",
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
          ブランディング会社様向け<br />
          X（旧Twitter）投稿管理サービス開発
        </h1>

        <p class="text-gray-600 leading-relaxed">
          X（旧Twitter）の投稿案を、複数人で管理・確認できるWebサービスを開発。
          投稿文、投稿日時、画像、確認ステータスを一元管理し、
          チームでの投稿運用をスムーズに進められる環境を整えました。
        </p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">お客様所在地</p>
            <p class="mt-1 font-semibold text-gray-900">福岡県福岡市</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">期間</p>
            <p class="mt-1 font-semibold text-gray-900">継続開発</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">開発構成</p>
            <p class="mt-1 font-semibold text-gray-900">Next.js + PostgreSQL</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">目的</p>
            <p class="mt-1 font-semibold text-gray-900">投稿管理の効率化</p>
          </div>
        </div>
      </section>

      <!-- 課題 -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">課題</h2>
          <p class="mt-1 text-gray-500">
            投稿運用に必要な情報が分散し、確認・編集の流れが複雑になっていました。
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
            投稿管理に必要な情報を一元化し、チームで扱いやすい構成を提案しました。
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
            投稿作成から確認、画像管理、権限制御まで、運用に必要な機能を実装しました。
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
