<template>
    <!-- <Button label="modo noche" @click="toggleLight" /> -->
    <div class="px-4 py-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <input
            class="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-sm w-full px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar..." />
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mapa</span>
                <div class="flex items-center space-x-2">
                    <div v-if="ubicacionActual && watchId"
                        class="flex items-center text-xs text-green-600 dark:text-green-400">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Ubicación en seguimiento
                    </div>
                    <div v-else-if="ubicacionActual" class="flex items-center text-xs text-blue-600 dark:text-blue-400">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        Ubicación detectada
                    </div>
                    <div v-else-if="errorUbicacion" class="flex items-center text-xs text-red-600 dark:text-red-400">
                        <div class="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        Error de ubicación
                    </div>
                    <div v-else class="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                        <div class="w-2 h-2 bg-zinc-400 rounded-full mr-1 animate-pulse"></div>
                        Obteniendo ubicación...
                    </div>
                </div>
            </div>
            <GMapMap :center="mapCenter" :zoom="mapZoom" style="width: 100%; height: 192px"
                class="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden" :options="mapOptions">
                <GMapMarker v-if="ubicacionActual" :position="ubicacionActual" :icon="{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 48 48'><g fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'><path fill='#2f88ff' fill-rule='evenodd' stroke='#000' d='M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z' clip-rule='evenodd'/><path fill='#43ccf8' stroke='#fff' d='M24 13L17 34L24 29L31 34L24 13Z'/></g></svg>
                        `),
                    scaledSize: { width: 24, height: 24 }
                }" />
            </GMapMap>
        </div>
        <!-- <div v-if="sitios.length > 0" class="space-y-4">
            <div v-for="sitio in sitios" :key="sitio.id"
                class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-xl">📍</span>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-2">
                            {{ sitio.nombre }}
                        </h2>
                        <p class="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed line-clamp-3">
                            {{ sitio.descripcion }}
                        </p>
                        <div class="mt-4 flex items-center justify-between">
                            <span
                                class="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                Ver más
                            </span>
                            <button class="text-zinc-400 hover:text-red-500 transition-colors duration-200">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-zinc-600 dark:text-zinc-300 text-lg font-medium">
                Cargando sitios turísticos...
            </p>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                Esto solo tomará un momento
            </p>
        </div>-->
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { supabase } from '@/services/supabase/supabase';
import useHome from '../hooks/useHome';

const {
    iniciarSeguimientoUbicacion,
    detenerSeguimientoUbicacion,
    sitios,
    ubicacionActual,
    errorUbicacion,
    watchId,
    mapCenter,
    mapZoom,
    mapOptions,
    obtenerUbicacion
} = useHome()

onMounted(async () => {
    await obtenerUbicacion()
    await iniciarSeguimientoUbicacion()
})

// Limpiar seguimiento al desmontar el componente
onUnmounted(async () => {
    await detenerSeguimientoUbicacion()
})


</script>