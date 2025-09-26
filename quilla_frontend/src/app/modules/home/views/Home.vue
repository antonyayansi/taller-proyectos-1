<template>
    <!-- <Button label="modo noche" @click="toggleLight" /> -->
    <div class="px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 class="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Sitios Turísticos
        </h1>
        <input
            class="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-sm w-full px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar..." />
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Mapa</span>
                <div class="flex items-center space-x-2">
                    <div v-if="ubicacionActual" class="flex items-center text-xs text-green-600 dark:text-green-400">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Ubicación detectada
                    </div>
                    <div v-else class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <div class="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                        Obteniendo ubicación...
                    </div>
                </div>
            </div>
            <div id="mapa" class="h-32 rounded-lg border border-gray-200 dark:border-gray-700">
            </div>
        </div>
        <div v-if="sitios.length > 0" class="space-y-4">
            <div v-for="sitio in sitios" :key="sitio.id"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-xl">📍</span>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {{ sitio.nombre }}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                            {{ sitio.descripcion }}
                        </p>
                        <div class="mt-4 flex items-center justify-between">
                            <span
                                class="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                Ver más
                            </span>
                            <button class="text-gray-400 hover:text-red-500 transition-colors duration-200">
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
            <p class="text-gray-600 dark:text-gray-300 text-lg font-medium">
                Cargando sitios turísticos...
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Esto solo tomará un momento
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase/supabase';
import Button from 'primevue/button';
import { useDark } from '@vueuse/core'
import mapboxgl from 'mapbox-gl'

const isDark = useDark()

const toggleLight = () => {
    isDark.value = !isDark.value;
}

const sitios = ref([])
const ubicacionActual = ref(null)
const map = ref(null)

const obtenerUbicacion = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalización no soportada'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                }
                ubicacionActual.value = coords
                resolve(coords)
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error)
                reject(error)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        )
    })
}

onMounted(async () => {
    // Cargar sitios turísticos
    const {
        data, error
    } = await supabase.from('sitios').select('id, nombre, descripcion')

    if (error) {
        console.log('Se produjo un error', error)
    } else {
        sitios.value = data
        console.log(sitios.value)
    }

    // Configurar Mapbox
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9uYWxkbzE1OTM5IiwiYSI6ImNtZnJlMDN3OTA4ZWcya3E0YTc5eW54dmMifQ.RqsLNCYJNBHSGMaQWN6lew';

    try {
        // Obtener ubicación actual
        const coords = await obtenerUbicacion()

        // Inicializar mapa centrado en la ubicación actual
        map.value = new mapboxgl.Map({
            container: 'mapa',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [coords.lng, coords.lat], // Centrar en ubicación actual
            zoom: 14, // Zoom más cercano para ver la ubicación
            telemetry: false
        });

        // Agregar marcador de ubicación actual
        const marcadorUbicacion = new mapboxgl.Marker({
            color: '#3b82f6', // Color azul
            scale: 1.2
        })
            .setLngLat([coords.lng, coords.lat])
            .setPopup(new mapboxgl.Popup().setHTML('<div class="text-center"><strong>📍 Tu ubicación</strong></div>'))
            .addTo(map.value);

        // Agregar control de geolocalización
        map.value.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        }));

    } catch (error) {
        console.error('No se pudo obtener la ubicación:', error)

        // Fallback: mapa con ubicación por defecto
        map.value = new mapboxgl.Map({
            container: 'mapa',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-74.5, 40], // Ubicación por defecto
            zoom: 9,
            telemetry: false
        });
    }
})


</script>