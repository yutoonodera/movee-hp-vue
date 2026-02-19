import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// heat plugin
import 'leaflet.heat'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      L,
    },
  }
})
