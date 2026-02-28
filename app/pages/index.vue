<script setup lang="ts">
import MapHeat from '~/components/MapHeat.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div class="p-6 sm:p-8 rounded-2xl shadow bg-white space-y-8">
        <!-- Hero -->
        <div class="text-center space-y-4">
          <h1 class="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            ソフトウェアと意思決定を、ともに育てる。
          </h1>
          <p class="text-gray-600 leading-relaxed">
            小さな開発と継続的なデータ活用で、変化に強い業務基盤をつくります。
          </p>
        </div>

        <!-- Concept -->
        <div class="space-y-4 text-gray-700 leading-relaxed">
          <p>
            ソフトウェア開発を長らく続けてきた中で、要求や要件は途中で変わるということ、
            そしてソフトウェアに蓄積されたデータが業務判断（意思決定）に十分活用されていない、
            という2つの課題を感じてきました。
          </p>

          <p>
            そのため弊社では、業務成長のために
            <span class="font-semibold text-gray-900">ソフトウェアと意思決定を育てる</span>
            というコンセプトのソフトウェア開発会社を目指しています。
          </p>
        </div>

        <!-- How -->
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-gray-900">この考えを実現するために</h2>

          <div class="grid gap-4">
            <div class="rounded-xl border bg-gray-50 p-4 sm:p-5">
              <div class="flex items-start gap-3">
                <div class="space-y-1">
                  <p class="font-semibold text-gray-900">小さな開発を連続的に</p>
                  <p class="text-gray-700">
                    変化を前提に、改善を細かく積み上げます。大きく作ってから直すのではなく、
                    使われ方に合わせて育てていきます。
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border bg-gray-50 p-4 sm:p-5">
              <div class="flex items-start gap-3">
                <div class="space-y-1">
                  <p class="font-semibold text-gray-900">定期的なデータ解析</p>
                  <p class="text-gray-700">
                    溜まったデータを定期的に分析し、業務判断に活かせる形に整えます。
                    GIS（地図）やオープンデータも組み合わせ、見落としを減らします。
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border bg-gray-50 p-4 sm:p-5">
              <div class="flex items-start gap-3">
                <div class="space-y-1">
                  <p class="font-semibold text-gray-900">頻繁な打ち合わせ</p>
                  <p class="text-gray-700">
                    前提のズレを早期に解消し、優先順位を更新し続けます。
                    「次に何を育てるか」を一緒に決めていきます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 text-sm text-gray-600">
          株式会社movee
        </div>
        <!-- CTA -->
        <div class="pt-4 space-y-3">
          <NuxtLink
            to="/achievements"
            class="inline-block text-sm px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            実績はこちら
          </NuxtLink>

          <p class="text-sm text-gray-600">
            ご相談・お問い合わせ：
            <a href="mailto:info@movee.jp" class="text-blue-600 hover:underline">
              info@movee.jp
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>