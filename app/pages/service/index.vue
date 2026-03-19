<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'お問い合わせ',
    body: 'まずはDMまたはメールでご相談ください。作りたいサイトやシステムの方向性を簡単にお聞きします。',
  },
  {
    number: '02',
    title: 'サイトの土台を無料で作成',
    body: '最初の一歩として、Webサイト・システムの土台をフルスクラッチでスピーディーに構築します。',
  },
  {
    number: '03',
    title: 'サーバに公開',
    body: '構築したサイトをサーバに公開し、実際に見られる状態まで持っていきます。',
  },
  {
    number: '04',
    title: '月1回の打ち合わせ',
    body: '公開後も月1回の打ち合わせを行い、今後どう育てていくかを一緒に整理します。',
  },
]

const freeItems = [
  'お問い合わせ・初回相談',
  'サイト・システムの土台づくり',
  'サーバへの公開',
  '月1回の打ち合わせ',
]

const paidItems = [
  '業務に合わせた追加機能の開発',
  '会員機能、予約機能、検索機能などの実装',
  'データ連携や管理画面の開発',
  '運用に合わせた改善・拡張',
]

const paymentOptions = [
  '通常の受託開発としてのお支払い',
  '成果報酬型でのお支払い',
  '御社サービス・商材のご提供など、柔軟な形でのご相談',
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Hero -->
      <section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <div class="max-w-3xl space-y-6">
          <p class="text-sm tracking-[0.18em] uppercase text-gray-500">
            Service
          </p>

          <h1 class="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
            Webサイト・システムの<br class="hidden sm:block" />
            最初の一歩を、無料でつくります。
          </h1>

          <p class="text-base sm:text-lg leading-8 text-gray-700">
            私たちは、Webサイト・システムの最初の一歩を無料でつくります。
            まずは「サイトの土台」をフルスクラッチで、スピーディーに構築し、
            サーバに公開します。そこから先は、御社の業務に合わせて機能も価値も育てていきます。
          </p>

          <div class="flex flex-wrap gap-3 pt-2">
            <a
              href="mailto:info@movee.jp"
              class="inline-flex items-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              info@movee.jp に問い合わせる
            </a>

            <NuxtLink
              to="/achievements"
              class="inline-flex items-center rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              実績を見る
            </NuxtLink>
          </div>

          <p class="text-sm text-gray-500 leading-7">
            新規でWebサイトやシステムを作りたい方は、お気軽にDMまたは
            <a href="mailto:info@movee.jp" class="underline hover:text-gray-700">
              info@movee.jp
            </a>
            までご連絡ください。
          </p>
        </div>
      </section>

      <!-- Flow -->
      <section class="mt-14">
        <div class="max-w-3xl">
          <p class="text-sm tracking-[0.18em] uppercase text-gray-500">
            Free Flow
          </p>
          <h2 class="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
            無料で進める、最初の4ステップ
          </h2>
          <p class="mt-4 text-base leading-8 text-gray-600">
            まずは小さく始めて、公開し、話しながら育てていく。
            最初の流れを、分かりやすく4つのステップに整理しました。
          </p>
        </div>

        <div class="mt-10 max-w-4xl mx-auto">
          <div
            v-for="(step, i) in steps"
            :key="step.number"
            class="relative"
          >
            <div class="relative bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <!-- 無料タグ -->
              <div class="absolute top-5 right-5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-100">
                無料
              </div>

              <!-- Header -->
              <div class="flex items-start gap-4 sm:gap-5">
                <div class="shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white text-lg font-bold shadow-sm">
                  {{ step.number }}
                </div>

                <div class="min-w-0 pt-1">
                  <div class="text-xs tracking-[0.28em] text-gray-400 font-semibold">
                    STEP
                  </div>
                  <h3 class="mt-2 text-2xl font-bold text-gray-900 leading-tight">
                    {{ step.title }}
                  </h3>
                </div>
              </div>

              <p class="mt-6 pl-0 sm:pl-[4.75rem] text-base leading-8 text-gray-600">
                {{ step.body }}
              </p>
            </div>

            <!-- Arrow -->
            <div
              v-if="i !== steps.length - 1"
              class="flex justify-center py-4"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 text-2xl">
                ↓
              </div>
            </div>
          </div>
        </div>

        <!-- Flow summary -->
        <div class="mt-8 max-w-4xl mx-auto">
          <div class="rounded-2xl border border-green-100 bg-green-50 px-5 py-4">
            <p class="text-sm sm:text-base font-medium text-green-800 leading-7">
              ここまでを無料で進めます。まずは「作って、公開する」ことから始めます。
            </p>
          </div>
        </div>

        <!-- CTA under flow -->
        <div class="mt-8 text-center">
          <a
            href="mailto:info@movee.jp"
            class="inline-flex items-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            無料で相談する
          </a>
        </div>
      </section>

      <!-- Free / Paid -->
      <section class="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
            無料の範囲
          </div>

          <h2 class="mt-4 text-2xl font-bold text-gray-900">
            第1フェーズは無料
          </h2>

          <p class="mt-4 text-gray-600 leading-8">
            「まず作って、まず公開する」ところまでを、無料で進めます。
            机上の相談だけで終わらず、実際に動くサイトの土台をつくることを重視しています。
          </p>

          <ul class="mt-6 space-y-3">
            <li
              v-for="item in freeItems"
              :key="item"
              class="flex items-start gap-3 text-gray-700"
            >
              <span class="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            第2フェーズ
          </div>

          <h2 class="mt-4 text-2xl font-bold text-gray-900">
            機能追加・改善は有料
          </h2>

          <p class="mt-4 text-gray-600 leading-8">
            サイト公開後、御社の業務に合わせて必要な機能を追加していきます。
            予約、会員、検索、管理画面、外部サービス連携など、
            実際の運用に合わせて少しずつ育てていく形です。
          </p>

          <ul class="mt-6 space-y-3">
            <li
              v-for="item in paidItems"
              :key="item"
              class="flex items-start gap-3 text-gray-700"
            >
              <span class="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-gray-500" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Payment -->
      <section class="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
          お支払い方法は柔軟にご相談できます
        </h2>

        <p class="mt-4 text-gray-600 leading-8 max-w-3xl">
          第2フェーズ以降の開発費用については、一般的な受託開発としてのお支払いだけでなく、
          成果報酬型や、御社サービスのご提供なども含めて柔軟にご相談可能です。
          まずは一緒に、続けやすい形を考えます。
        </p>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="item in paymentOptions"
            :key="item"
            class="rounded-2xl border border-gray-200 bg-gray-50 p-5"
          >
            <p class="text-sm leading-7 text-gray-700">
              {{ item }}
            </p>
          </div>
        </div>
      </section>

      <!-- Message -->
      <section class="mt-12 bg-black rounded-3xl p-6 sm:p-10 text-white">
        <div class="max-w-3xl space-y-5">
          <h2 class="text-2xl sm:text-3xl font-bold leading-tight">
            最初から大きく作るのではなく、<br class="hidden sm:block" />
            まず公開し、育てていく。
          </h2>

          <p class="text-white/80 leading-8">
            私たちは、最初からすべてを決め切るよりも、
            まずは土台をつくって公開し、運用しながら必要な機能を育てていく進め方を大切にしています。
            Webサイトもシステムも、使われながら価値が育つものだと考えています。
          </p>

          <div class="flex flex-wrap gap-3 pt-2">
            <a
              href="mailto:info@movee.jp"
              class="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-medium text-black hover:bg-gray-200 transition"
            >
              info@movee.jp に相談する
            </a>

            <NuxtLink
              to="/"
              class="inline-flex items-center rounded-md border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              トップへ戻る
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>