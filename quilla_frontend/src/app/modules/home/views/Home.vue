<template>
    <!-- <Button label="modo noche" @click="toggleLight" /> -->
    <div class="px-4 py-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <InputText class="" placeholder="Buscar..." fluid="" />
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
            <router-link v-for="sitio in sitios" :key="sitio.id" :to="{ name: 'home.sitio', params: { id: sitio.id } }">
                <div
                    class="my-2 bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-shadow duration-300">
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
                                <Button label="Ver más" size="small" severity="primary" variant="text" />
                                <!-- <Button icon="pi pi-heart" size="small" severity="secondary" /> -->
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
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
import { onMounted, onBeforeUnmount, ref } from 'vue'
import useHome from '../hooks/useHome';
import useSitios from '../hooks/useSitios';
import {
    InputText,
    Button
} from 'primevue';

const mapContainer = ref(null);

const {
    obtenerUbicacion,
    setMapContainer,
    startWatchingPosition,
    stopWatchingPosition,
} = useHome()

const {
    sitios,
    getSitios,
    addSitesToMap,
    searchSitios
} = useSitios()

onMounted(async () => {
    // Set the map container element
    setMapContainer(mapContainer.value);

    // Iniciar seguimiento en tiempo real de la ubicación
    await startWatchingPosition()
    await getSitios()
})

// Detener el seguimiento cuando el componente se desmonte
onBeforeUnmount(async () => {
    await stopWatchingPosition()
})
</script>