<template>
  <div class="w-full rounded-2xl overflow-hidden shadow bg-white">
    <div ref="mapEl" class="w-full h-[360px]" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'

const mapEl = ref<HTMLDivElement | null>(null)

let map: L.Map | null = null

// ※ 例：福岡中心（好きな場所に変えてOK）
const center: [number, number] = [33.5902, 130.4017]

// 目立つヒート用の「適当データ」
// [lat, lng, intensity] intensityは 0〜1 くらい
const heatPoints: Array<[number, number, number]> = [
  [33.5902, 130.4017, 1.0],
  [33.5950, 130.3950, 0.9],
  [33.5850, 130.4100, 0.85],
  [33.6000, 130.4200, 0.75],
  [33.5750, 130.3950, 0.7],
  [33.6050, 130.3900, 0.8],
  [33.5650, 130.4300, 0.65],

  // 密度を増やして「目立たせる」
  [33.5920, 130.4020, 1.0],
  [33.5910, 130.4040, 0.95],
  [33.5890, 130.3990, 0.92],
  [33.5880, 130.4010, 0.9],
  [33.5930, 130.3980, 0.88],
]

// ピン（例：店舗）適当データ
const stores = [
  { name: '店舗A（サンプル）', lat: 33.5902, lng: 130.4017 },
  { name: '店舗B（サンプル）', lat: 33.5985, lng: 130.4120 },
  { name: '店舗C（サンプル）', lat: 33.5780, lng: 130.3920 },
]

onMounted(() => {
  if (!mapEl.value) return

  map = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: false, // LPっぽくする（誤操作防止）
  }).setView(center, 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // --- ✅ 目立つヒートマップ ---
  // ポイント数 + intensity を増やし、radius/blur を強めると “見える”
  ;(L as any).heatLayer(heatPoints, {
    radius: 40,   // 大きく
    blur: 25,     // ぼかし強め
    maxZoom: 17,
    minOpacity: 0.5, // 最低透明度を上げて目立たせる
    // gradient を指定するとさらに目立つ（好みで調整）
    gradient: {
      0.2: '#3b82f6', // blue
      0.4: '#22c55e', // green
      0.6: '#eab308', // yellow
      0.8: '#f97316', // orange
      1.0: '#ef4444', // red
    },
  }).addTo(map)

  // --- ✅ ピン（店舗） ---
  const markerGroup = L.layerGroup().addTo(map)

  stores.forEach((s) => {
    L.marker([s.lat, s.lng])
      .addTo(markerGroup)
      .bindPopup(`<b>${s.name}</b><br/>(${s.lat.toFixed(4)}, ${s.lng.toFixed(4)})`)
  })

  // --- ✅ 商圏サークル（例：2km） ---
  // radius はメートル
  L.circle(center, {
    radius: 2000,
    color: '#2563eb',
    weight: 2,
    fillColor: '#2563eb',
    fillOpacity: 0.08,
  })
    .addTo(map)
    .bindTooltip('商圏（2km）', { direction: 'center' })

  // 表示をピン群にフィットさせたい場合
  // const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng] as [number, number]))
  // map.fitBounds(bounds.pad(0.2))
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>
