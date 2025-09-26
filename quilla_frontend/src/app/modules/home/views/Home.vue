<template>
    <!-- <Button label="modo noche" @click="toggleLight" /> -->
    <div class="px-4 py-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <h1 class="text-2xl font-bold text-center mb-4 text-zinc-800 dark:text-white">
            Sitios Turísticos
        </h1>
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
            <div id="mapa" class="h-48 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            </div>
        </div>
        <div v-if="sitios.length > 0" class="space-y-4">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/services/supabase/supabase';
import mapboxgl from 'mapbox-gl'
import { Geolocation } from '@capacitor/geolocation'

const sitios = ref([])
const ubicacionActual = ref(null)
const map = ref(null)
const watchId = ref(null)
const errorUbicacion = ref(null)

const obtenerUbicacion = async () => {
    try {
        // Verificar y solicitar permisos de ubicación
        const permissions = await Geolocation.checkPermissions()

        if (permissions.location === 'denied') {
            const requestResult = await Geolocation.requestPermissions()
            if (requestResult.location === 'denied') {
                throw new Error('Permisos de ubicación denegados')
            }
        }

        // Obtener la posición actual usando Capacitor
        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
        })

        const coords = {
            lng: position.coords.longitude,
            lat: position.coords.latitude
        }

        ubicacionActual.value = coords
        errorUbicacion.value = null
        console.log('Ubicación obtenida:', coords)
        return coords

    } catch (error) {

        console.error('Error obteniendo ubicación con Capacitor:', error)
        errorUbicacion.value = error
        throw error
    }
}

// Función para observar cambios en la ubicación
const iniciarSeguimientoUbicacion = async () => {
    try {
        watchId.value = await Geolocation.watchPosition({
            enableHighAccuracy: true,
            timeout: 30000
        }, (position, err) => {
            if (err) {
                console.error('Error en seguimiento de ubicación:', err)
                return
            }

            if (position) {
                const coords = {
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                }
                ubicacionActual.value = coords

                // Actualizar marcador en el mapa si existe
                if (map.value && map.value.marcadorUbicacion) {
                    map.value.marcadorUbicacion.setLngLat([coords.lng, coords.lat])
                }
            }
        })
    } catch (error) {
        console.error('Error iniciando seguimiento:', error)
    }
}

// Función para detener el seguimiento
const detenerSeguimientoUbicacion = async () => {
    if (watchId.value) {
        await Geolocation.clearWatch({ id: watchId.value })
        watchId.value = null
    }
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
    }

    // Configurar Mapbox
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9uYWxkbzE1OTM5IiwiYSI6ImNtZnJlMDN3OTA4ZWcya3E0YTc5eW54dmMifQ.RqsLNCYJNBHSGMaQWN6lew';

    // Esperar un poco para que el DOM esté completamente listo
    await new Promise(resolve => setTimeout(resolve, 100));

    // Inicializar mapa con ubicación por defecto (Barranquilla, Colombia)
    map.value = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v11', // Usar v11 por compatibilidad
        center: [-74.7813, 10.9685], // Barranquilla, Colombia
        zoom: 12,
        telemetry: false,
        attributionControl: false,
        preserveDrawingBuffer: true
    });

    // Esperar a que el mapa se cargue completamente
    map.value.on('load', async () => {
        console.log('Mapa cargado correctamente');

        try {
            // Obtener ubicación actual y recentrar
            const coords = await obtenerUbicacion()

            // Recentrar el mapa en la ubicación actual
            map.value.flyTo({
                center: [coords.lng, coords.lat],
                zoom: 15,
                speed: 2,
                curve: 1
            });

            // Agregar marcador de ubicación actual
            const marcadorUbicacion = new mapboxgl.Marker({
                color: '#3b82f6', // Color azul
                scale: 1.2
            })
                .setLngLat([coords.lng, coords.lat])
                .setPopup(new mapboxgl.Popup().setHTML('<div class="text-center"><strong>📍 Tu ubicación</strong></div>'))
                .addTo(map.value);

            // Guardar referencia del marcador para poder actualizarlo
            map.value.marcadorUbicacion = marcadorUbicacion

            // Iniciar seguimiento de ubicación
            await iniciarSeguimientoUbicacion()

        } catch (error) {
            console.error('Error obteniendo ubicación:', error)
            errorUbicacion.value = 'No se pudo obtener tu ubicación'
        }
    });

    map.value.on('error', (error) => {
        console.error('Error del mapa:', error);
    });
})

// Limpiar seguimiento al desmontar el componente
onUnmounted(async () => {
    await detenerSeguimientoUbicacion()
})


</script>