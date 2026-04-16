<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950 pb-20">
        <!-- Search bar -->
        <div class="p-5 pb-3 sticky top-0 z-10 bg-indigo-50/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-indigo-500/10 dark:border-indigo-500/20">
            <div class="relative flex items-center">
                <i class="pi pi-search absolute left-3.5 text-indigo-500 text-[15px] z-[1]"></i>
                <InputText
                    @keyup="searchSitios($event.target.value)"
                    placeholder="Buscar sitios turísticos..."
                    fluid
                    class="w-full pl-[42px] h-[46px] rounded-[14px] border-[1.5px] border-indigo-500/20 text-[15px] bg-white dark:bg-zinc-900 shadow-lg shadow-indigo-500/10 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                />
            </div>
        </div>

        <!-- Map section -->
        <div class="mx-4 mt-3">
            <div class="flex items-center justify-between mb-2.5">
                <div class="flex items-center gap-2.5">
                    <span class="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
                        <i class="pi pi-map-marker text-indigo-500"></i>
                        Tu ubicación actual
                    </span>
                    <span v-if="isMapLoaded" class="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-green-600 bg-green-500/10 border border-green-500/30 rounded-full px-2 py-0.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> EN VIVO
                    </span>
                </div>
                <button class="flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 rounded-[10px] px-3 py-1.5 cursor-pointer transition-all hover:bg-indigo-500/20 hover:scale-[1.02]" @click="obtenerUbicacion()">
                    <i class="pi pi-refresh text-xs"></i>
                    Actualizar
                </button>
            </div>

            <!-- Map container -->
            <div class="relative rounded-[18px] overflow-hidden h-[200px] shadow-2xl shadow-indigo-500/20 border-2 border-indigo-500/15" :class="{ 'opacity-50': !isMapLoaded }">
                <div ref="mapContainer" class="w-full h-full"></div>
                <!-- Loading overlay -->
                <div v-if="!isMapLoaded" class="absolute inset-0 flex items-center justify-center bg-indigo-50/85 dark:bg-zinc-950/85 backdrop-blur-sm">
                    <div class="flex flex-col items-center gap-2.5 text-indigo-600">
                        <i class="pi pi-spin pi-spinner text-[28px]"></i>
                        <span class="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">Cargando mapa...</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sites list -->
        <div class="mx-4 mt-5">
            <div v-if="sitios.length > 0">
                <div class="flex items-center justify-between mb-3.5">
                    <h2 class="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <i class="pi pi-globe text-indigo-500"></i>
                        Sitios Turísticos
                    </h2>
                    <span class="text-xs font-semibold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-1">{{ sitios.length }} lugares</span>
                </div>

                <div class="flex flex-col gap-3">
                    <router-link
                        v-for="sitio in sitios"
                        :key="sitio.id"
                        :to="{ name: 'home.sitio', params: { id: sitio.id } }"
                        class="flex items-start gap-3.5 bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-500/40 text-inherit no-underline"
                    >
                        <div class="w-[46px] h-[46px] rounded-[14px] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                            <span class="text-[22px] leading-none">📍</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 m-0 leading-[1.3] line-clamp-2">{{ sitio.nombre }}</h3>
                            <p class="text-[13px] text-zinc-500 dark:text-zinc-400 m-0 leading-normal line-clamp-2 mt-1">{{ sitio.descripcion }}</p>
                            <div class="flex items-center justify-between mt-2.5">
                                <span v-if="sitio.distancia" class="flex items-center gap-1 text-xs font-semibold text-green-600">
                                    <i class="pi pi-compass text-[11px]"></i>
                                    {{ sitio.distancia }} m
                                </span>
                                <span class="text-[13px] font-semibold text-indigo-600 flex items-center gap-0.5">Ver más <i class="pi pi-angle-right"></i></span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Loading state -->
            <div v-else class="flex flex-col items-center justify-center py-12 px-4">
                <div class="w-11 h-11 rounded-full border-[3px] border-indigo-500/15 border-t-indigo-500 animate-spin mb-4"></div>
                <p class="text-base font-semibold text-zinc-600 dark:text-zinc-400 m-0">Cargando sitios turísticos...</p>
                <p class="text-[13px] text-zinc-400 dark:text-zinc-500 m-0 mt-1">Esto solo tomará un momento</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import useHome from '../hooks/useHome';
import useSitios from '../hooks/useSitios';
import { InputText } from 'primevue';
import { storeToRefs } from 'pinia';
import { home as homeStore } from '../store/home';

const mapContainer = ref(null);

const {
    obtenerUbicacion,
    setMapContainer,
    startWatchingPosition,
    stopWatchingPosition,
} = useHome()

const { isMapLoaded } = storeToRefs(homeStore())

const {
    sitios,
    getSitios,
    searchSitios
} = useSitios()

onMounted(async () => {
    setMapContainer(mapContainer.value);
    await startWatchingPosition()
    await getSitios()
})

onBeforeUnmount(async () => {
    await stopWatchingPosition()
})
</script>