<template>
    <!-- <Button label="modo noche" @click="toggleLight" /> -->
    <div class="px-4 py-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <input
            class="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-sm w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar..." />
        <div class="my-4">
            <div class="flex items-center justify-between space-x-2">
                <label class="font-light text-sm">Tu ubicación actual</label>
                <button class="text-blue-500 text-sm font-medium" @click="obtenerUbicacion()">Actualizar</button>
            </div>
            <div class="h-42 rounded-lg mt-2" ref="mapContainer">

            </div>
        </div>
        <div v-if="sitios.length > 0" class="space-y-4">
            <button class="text-green-500 text-sm font-medium" @click="addSitesToMap()">Importar sitios a mapa</button>
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
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useHome from '../hooks/useHome';
import useSitios from '../hooks/useSitios';

const mapContainer = ref(null);

const {
    obtenerUbicacion,
    setMapContainer,
} = useHome()

const {
    sitios,
    getSitios,
    addSitesToMap
} = useSitios()

onMounted(async () => {
    // Set the map container element
    setMapContainer(mapContainer.value);

    obtenerUbicacion()
    getSitios()
})
</script>