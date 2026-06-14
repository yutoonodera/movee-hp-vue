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
                class="inline-block text-sm px-5 py-2.5 rounded-md bg-gray-900 text-white font-medium shadow-sm hover:bg-gray-800 hover:shadow transition"
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
              株式会社moveeは、福岡市を拠点に、業務システム・Webアプリケーションの開発、
              地図やデータを活用した分析・可視化の支援を行っています。
            </p>

            <p>
              ソフトウェアへの投資は、発注者にとって大きな意思決定です。
              期待した成果が出るか、運用に乗るか、投資に見合う効果があるか。
              そこには少なからずリスクがあります。
            </p>
          </div>

          <!-- Message -->
          <div class="rounded-2xl bg-gray-900 text-white p-6 sm:p-8 space-y-4">
            <p class="text-xl sm:text-2xl font-semibold">
              発注者だけに、リスクを負わせない。
            </p>

            <p class="text-sm sm:text-base leading-relaxed text-gray-200">
              私たちは、そのリスクを発注者だけに負わせるのではなく、
              できる限り一緒に引き受けながら開発を進めたいと考えています。
              だからこそ、プロジェクトの性質や事業フェーズに応じて、
              柔軟な料金体系をご用意しています。
            </p>
          </div>

          <!-- Pricing -->
          <div class="space-y-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">料金体系の例</h2>
              <p class="mt-1 text-sm text-gray-500">
                事業の状況や検証段階に合わせて、無理のない進め方を設計します。
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div
                class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
              >
                <p class="font-semibold text-gray-900">完全成果報酬型</p>
                <p class="text-sm text-gray-600 leading-relaxed">
                  成果が出た場合にお支払いいただく形です。
                  初期投資の負担を抑えて始めたい場合に適しています。
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
              >
                <p class="font-semibold text-gray-900">一部費用＋成果報酬型</p>
                <p class="text-sm text-gray-600 leading-relaxed">
                  初期費用を抑えつつ、成果に応じた報酬を組み合わせる形です。
                  双方でリスクと成果を分け合います。
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
              >
                <p class="font-semibold text-gray-900">一括受託型</p>
                <p class="text-sm text-gray-600 leading-relaxed">
                  要件を定めて、開発範囲と費用を明確にしたうえで進める形です。
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
              >
                <p class="font-semibold text-gray-900">
                  段階的な開発・改善支援
                </p>
                <p class="text-sm text-gray-600 leading-relaxed">
                  小さく検証しながら、必要な機能や改善を段階的に進めていきます。
                </p>
              </div>
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
