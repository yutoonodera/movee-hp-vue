<script setup lang="ts">
import MapHeat from "~/components/MapHeat.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div class="p-6 sm:p-8 rounded-2xl shadow bg-white space-y-8">
        <!-- Concept -->
        <div class="space-y-10 text-gray-700 leading-relaxed">
          <!-- Hero -->
          <div class="space-y-4">
            <p
              class="text-xs sm:text-sm font-semibold tracking-[0.25em] text-blue-600"
            >
              SOFTWARE DEVELOPMENT & DATA UTILIZATION
            </p>
            <h1
              class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight"
            >
              リスクを共に、成長を共に
            </h1>
            <div class="flex gap-6">
              <NuxtLink
                to="/achievements"
                class="inline-block text-sm px-5 py-2.5 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 hover:shadow transition"
              >
                実績はこちら
              </NuxtLink>
            </div>

            <p class="text-lg sm:text-xl text-gray-800 leading-relaxed">
              ソフトウェア開発とデータ活用で、事業の成長を支える会社です。
            </p>
          </div>

          <!-- Intro -->
          <div class="space-y-5 text-base sm:text-lg leading-relaxed">
            <p>
              株式会社moveeは、福岡市を拠点に、Webサービスの開発、
              地図やデータを活用した分析・可視化の支援を行っています。
            </p>

            <p>
              ソフトウェアへの投資は、発注者にとって大きな意思決定です。
              期待した成果が出るか、運用に乗るか、投資に見合う効果があるか。
              そこには少なからずリスクがあります。
            </p>
          </div>

          <!-- Message -->
          <div
            class="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 sm:p-8 space-y-4 shadow-sm"
          >
            <p class="text-xl sm:text-2xl font-semibold text-blue-900">
              発注者だけに、リスクを負わせない。
            </p>

            <p class="text-sm sm:text-base leading-relaxed text-gray-700">
              私たちは、そのリスクを発注者だけに負わせるのではなく、
              できる限り一緒に引き受けながら開発を進めたいと考えています。
              だからこそ、プロジェクトの性質や事業フェーズに応じて、
              柔軟な料金体系をご用意しています。
            </p>
          </div>
          <!-- Pricing -->
          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-gray-900">
              ご相談内容に合わせた進め方
            </h2>
            <p class="text-sm text-gray-500 leading-relaxed">
              事業の状況や検証段階に合わせて、無理のない料金体系をご提案します。
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
            >
              <p class="font-semibold text-gray-900">完全成果報酬プラン</p>
              <p class="text-sm text-gray-600 leading-relaxed">
                成果が出た場合にお支払いいただく形です。
                初期投資の負担を抑えて始めたい場合に適しています。
                成果につながるまで、改善を繰り返しながら伴走します。
              </p>
            </div>

            <div
              class="relative rounded-xl border-2 border-blue-300 bg-blue-50/60 p-5 space-y-2 shadow-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="font-semibold text-blue-900">
                  初期費用＋成果報酬プラン
                </p>

                <span
                  class="shrink-0 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white"
                >
                  おすすめ
                </span>
              </div>

              <p class="text-sm text-gray-700 leading-relaxed">
                初期費用を抑えつつ、成果に応じた報酬を組み合わせる形です。
                双方でリスクと成果を分け合いながら、成果を上げるために改善を繰り返します。
                継続的に事業を伸ばしたい場合におすすめです。
              </p>
            </div>

            <div
              class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
            >
              <p class="font-semibold text-gray-900">一括開発プラン</p>
              <p class="text-sm text-gray-600 leading-relaxed">
                要件を定めて、開発範囲と費用を明確にしたうえで進める形です。
                納期や予算を決めて進めたい場合に適しています。
              </p>
            </div>

            <div
              class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
            >
              <p class="font-semibold text-gray-900">
                時間単価プラン（準委任）
              </p>
              <p class="text-sm text-gray-600 leading-relaxed">
                時間単価、作業時間を決めて進める形です。
                必要な作業量に応じて柔軟に対応します。
                小さな改善、調査、既存システムの修正などに適しています。
              </p>
            </div>
          </div>

          <!-- Closing -->
          <div class="border-l-4 border-blue-600 pl-5">
            <p class="text-base sm:text-lg text-gray-800 leading-relaxed">
              最初から大きく作るのではなく、必要な範囲を見極めながら、
              事業にとって意味のあるソフトウェアとデータ活用を一緒に育てていきます。
            </p>
          </div>
        </div>
        <!-- CTA -->
        <div class="pt-6 space-y-4">
          <p class="text-sm text-gray-600">
            ご相談・お問い合わせ：
            <a
              href="mailto:info@movee.jp"
              class="text-blue-600 hover:underline"
            >
              info@movee.jp
            </a>
          </p>
        </div>
        <!-- Company Profile -->
        <div class="pt-8 border-t border-gray-200">
          <h2 class="text-base font-semibold text-gray-900 mb-4">会社概要</h2>

          <dl class="divide-y divide-gray-200 text-sm">
            <div class="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt class="font-medium text-gray-600">会社名</dt>
              <dd class="mt-1 text-gray-800 sm:col-span-3 sm:mt-0">
                株式会社movee
              </dd>
            </div>

            <div class="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt class="font-medium text-gray-600">所在地</dt>
              <dd class="mt-1 text-gray-800 sm:col-span-3 sm:mt-0">
                福岡県福岡市中央区天神2丁目3-10 天神パインクレスト716
              </dd>
            </div>

            <div class="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt class="font-medium text-gray-600">代表</dt>
              <dd class="mt-1 text-gray-800 sm:col-span-3 sm:mt-0">
                小野寺 祐人
              </dd>
            </div>

            <div class="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt class="font-medium text-gray-600">社員数</dt>
              <dd class="mt-1 text-gray-800 sm:col-span-3 sm:mt-0">2名</dd>
            </div>

            <div class="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt class="font-medium text-gray-600">資本金</dt>
              <dd class="mt-1 text-gray-800 sm:col-span-3 sm:mt-0">150万円</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
