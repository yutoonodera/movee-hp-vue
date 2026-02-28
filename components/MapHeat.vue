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

const center: [number, number] = [33.5902, 130.4017]

const heatPoints: Array<[number, number, number]> = [
  [33.5902, 130.4017, 1.0],
  [33.5950, 130.3950, 0.9],
  [33.5850, 130.4100, 0.85],
  [33.6000, 130.4200, 0.75],
  [33.5750, 130.3950, 0.7],
  [33.6050, 130.3900, 0.8],
  [33.5650, 130.4300, 0.65],
  [33.5920, 130.4020, 1.0],
  [33.5910, 130.4040, 0.95],
  [33.5890, 130.3990, 0.92],
  [33.5880, 130.4010, 0.9],
  [33.5930, 130.3980, 0.88],
]

const stores = [
  { name: '店舗A（サンプル）', lat: 33.5902, lng: 130.4017 },
  { name: '店舗B（サンプル）', lat: 33.5985, lng: 130.4120 },
  { name: '店舗C（サンプル）', lat: 33.5780, lng: 130.3920 },
]

onMounted(() => {
  if (!mapEl.value) return

  map = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView(center, 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // --- ✅ ヒートマップ（より目立つ） ---
  ;(L as any).heatLayer(heatPoints, {
    radius: 55,      // ←大きくして目立たせる
    blur: 30,
    maxZoom: 17,
    minOpacity: 0.6, // ←濃く
    gradient: {
      0.15: '#60a5fa',
      0.35: '#34d399',
      0.55: '#fde047',
      0.75: '#fb923c',
      1.0: '#ef4444',
    },
  }).addTo(map)

  // --- ✅ ピン（画像依存しないので本番でも崩れない） ---
  const markerGroup = L.layerGroup().addTo(map)

  // “SaaSっぽい” ドットマーカー（白枠＋影）
  const dotIcon = (label: string) =>
    L.divIcon({
      className: '',
      html: `
        <div style="
          position: relative;
          width: 16px; height: 16px;
          border-radius: 9999px;
          background: #2563eb;
          border: 3px solid #ffffff;
          box-shadow: 0 8px 18px rgba(0,0,0,.25);
        ">
          <div style="
            position:absolute;
            top:-28px; left:50%;
            transform: translateX(-50%);
            background: rgba(17,24,39,.85);
            color: white;
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 9999px;
            white-space: nowrap;
            pointer-events: none;
          ">${label}</div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

  stores.forEach((s) => {
    L.marker([s.lat, s.lng], { icon: dotIcon(s.name.replace('（サンプル）', '')) })
      .addTo(markerGroup)
      .bindPopup(`<b>${s.name}</b><br/>(${s.lat.toFixed(4)}, ${s.lng.toFixed(4)})`)
  })

  // --- ✅ 商圏サークル（2km） ---
  L.circle(center, {
    radius: 2000,
    color: '#2563eb',
    weight: 2,
    fillColor: '#2563eb',
    fillOpacity: 0.10,
  })
    .addTo(map)
    .bindTooltip('商圏（2km）', { direction: 'center' })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>
