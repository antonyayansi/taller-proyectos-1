import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isMapFullscreen = ref(false)

  function toggleMapFullscreen() {
    isMapFullscreen.value = !isMapFullscreen.value
    console.log('Map fullscreen state:', isMapFullscreen.value)
  }

  return {
    isMapFullscreen,
    toggleMapFullscreen,
  }
})
