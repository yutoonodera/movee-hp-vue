<script setup lang="ts">
import MapHeat from '~/components/MapHeat.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div class="p-6 sm:p-8 rounded-2xl shadow bg-white space-y-8">
        <!-- Concept -->
        <div class="space-y-4 text-gray-700 leading-relaxed">
          <p>
            弊社は、
            <span class="font-semibold text-gray-900">ソフトウェアと意思決定を育てる</span>
            というコンセプトのソフトウェア開発会社です。
          </p>
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