<script setup>
import { onMounted, ref, watch } from 'vue'
import Button from 'primevue/button';
import { useDark } from '@vueuse/core'
import mapboxgl from 'mapbox-gl'
import { storeToRefs } from 'pinia';
import { useHomeStore } from '@/app/modules/home/store/home'
import { useUiStore } from '@/stores/ui';

const isDark = useDark()

const homeStore = useHomeStore();
const { sitios } = storeToRefs(homeStore)

const uiStore = useUiStore();

const { isMapFullscreen, toggleMapFullscreen } = uiStore;

const mapInstance = ref(null);

const toggleLight = () => {
    isDark.value = !isDark.value;
}

watch(isMapFullscreen, () => {
    setTimeout(() => {
        if (mapInstance.value) {
            mapInstance.value.resize();
        }
    }, 150);
});

onMounted(async () => {
    console.log('Componente Home montado. Cargando sitios...'); // Para depurar
    await homeStore.fetchSitios();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9uYWxkbzE1OTM5IiwiYSI6ImNtZnJlMDN3OTA4ZWcya3E0YTc5eW54dmMifQ.RqsLNCYJNBHSGMaQWN6lew';

    const map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 9,
        telemetry: false
    });

    mapInstance.value = map;

    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });

    map.addControl(geolocate);

    map.on('load', () => {
        geolocate.trigger();
    });
})
</script>
<template>
    <div class="p-4">
        <button @click="toggleLight"
            class="mb-4 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-primary-600 transition-colors">
            Modo Noche
        </button>

        <div>
            <h1 class="text-2xl font-bold mb-2">Sitios Turísticos</h1>
            <ul class="list-disc list-inside space-y-2">
                <li v-for="sitio in sitios" :key="sitio.id">
                    <strong>{{ sitio.nombre }}:</strong> {{ sitio.descripcion }}
                </li>
            </ul>
        </div>

        <div class="relative w-full h-[500px] rounded-2xl overflow-hidden mt-8 transition-all duration-300"
            :class="{ 'fixed inset-0 z-50 !rounded-none !mt-0': isMapFullscreen }">

            <button @click="toggleMapFullscreen"
                class="absolute z-20 top-4 right-4 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg">
                <svg v-if="!isMapFullscreen" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M10 4H8v4H4v2h6V4zm6 0v6h6v-2h-4V4h-2zm-2 16h-4v-6H4v-2h6v8zm2 0v-8h6v2h-4v6h-2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M4 9V6a2 2 0 0 1 2-2h3m11 11v3a2 2 0 0 1-2 2h-3m0-16h3a2 2 0 0 1 2 2v3M9 20H6a2 2 0 0 1-2-2v-3" />
                </svg>
            </button>

            <div id="mapa" class="w-full h-full"></div>

            <div v-if="!isMapFullscreen" class="absolute z-20 top-5 left-0 right-0">
                <h2 class="text-center text-2xl font-bold text-primary [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">
                    Tu ubicación
                </h2>
            </div>

            <div class="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle,transparent_35%,theme(colors.white)_70%)] dark:bg-[radial-gradient(circle,transparent_10%,theme(colors.black)_70%)]"
                :class="{ 'hidden': isMapFullscreen }">
            </div>
        </div>
    </div>
</template>