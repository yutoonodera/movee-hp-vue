<script setup lang="ts">
const ALL = [
  { slug: 'content-site', path: '/lp/content-site', name: '育てるホームページ', desc: '書くたびに資産になるWebサイト。月次コンテンツ支援つき。' },
  { slug: 'saas-starter', path: '/lp/saas-starter', name: '育てるサブスク',     desc: 'SaaSを2週間で構築して、月次コンテンツ支援で育てる。' },
  { slug: 'flexpress',    path: '/lp/flexpress',    name: 'FlexPress',          desc: 'WordPressをAPIにして、Next.jsで高速・安全に。' },
]

const props = defineProps<{ current: string }>()
const others = computed(() => ALL.filter(p => p.slug !== props.current))
</script>

<template>
  <section class="lpnav">
    <div class="lpnav-inner">
      <NuxtLink to="/" class="lpnav-back">← movee トップへ</NuxtLink>
      <div class="lpnav-divider"></div>
      <p class="lpnav-label">OTHER PACKAGES</p>
      <div class="lpnav-cards">
        <NuxtLink v-for="p in others" :key="p.slug" :to="p.path" class="lpnav-card">
          <p class="lpnav-name">{{ p.name }}</p>
          <p class="lpnav-desc">{{ p.desc }}</p>
          <span class="lpnav-arrow">詳しく見る →</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lpnav {
  background: #0F172A;
  padding: 48px 40px;
}
.lpnav-inner {
  max-width: 720px;
  margin: 0 auto;
}
.lpnav-back {
  font-size: 12px;
  color: #64748B;
  text-decoration: none;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.03em;
  transition: color 0.15s;
}
.lpnav-back:hover { color: #94A3B8; }

.lpnav-divider {
  border-top: 1px solid #1E293B;
  margin: 20px 0;
}

.lpnav-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #334155;
  font-family: ui-monospace, monospace;
  margin: 0 0 16px;
}

.lpnav-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 540px) { .lpnav-cards { grid-template-columns: 1fr; } }

.lpnav-card {
  display: block;
  text-decoration: none;
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 18px 20px;
  transition: border-color 0.15s;
}
.lpnav-card:hover { border-color: #64748B; }

.lpnav-name  { font-size: 14px; font-weight: 700; color: #F1F5F9; margin: 0 0 6px; }
.lpnav-desc  { font-size: 12px; color: #64748B; margin: 0 0 12px; line-height: 1.6; }
.lpnav-arrow { font-size: 11px; color: #475569; font-family: ui-monospace, monospace; }
</style>
