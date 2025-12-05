<template>
    <div class="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 p-5">
        <!-- AI Assistant Component -->
        <AIAssistant v-if="sitioActive" :sitioContext="sitioActive" />
        
        <!-- Loading State -->
        <div v-if="!sitioActive" class="flex items-center justify-center min-h-screen">
            <div class="text-center text-white">
                <div
                    class="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4">
                </div>
                <p class="text-lg">Cargando información del sitio...</p>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else>
            <!-- Header -->
            <div class="text-center text-white mb-6">
                <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ sitioActive.nombre }}</h1>
                <div class="flex items-center justify-center gap-2 text-sm opacity-90">
                    <span class="bg-white/20 px-3 py-1 rounded-full">{{ sitioActive.categorias?.nombre }}</span>
                    <span>•</span>
                    <span>{{ sitioActive.horarios }}</span>
                    <span>•</span>
                    <span>S/ {{ sitioActive.tarifas }}</span>
                </div>
            </div>

            <!-- Radar Container -->
            <div class="max-w-md mx-auto mb-6">
                <div class="relative w-full aspect-square bg-black/30 rounded-full overflow-hidden shadow-2xl">
                    <!-- Pulse effect -->
                    <div class="pulse"></div>
                    <div class="pulse animation-delay-600"></div>
                    <div class="pulse animation-delay-1200"></div>

                    <!-- Radar circles -->
                    <div class="radar-circle w-1/3 h-1/3"></div>
                    <div class="radar-circle w-2/3 h-2/3"></div>
                    <div class="radar-circle w-full h-full"></div>

                    <!-- Center point (user location) -->
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div
                            class="w-4 h-4 bg-green-400 border-3 border-white rounded-full shadow-[0_0_20px_rgba(74,222,128,0.8)]">
                        </div>
                    </div>

                    <!-- Points of interest (rutas) -->
                    <div v-for="(ruta, index) in sitioActive.rutas" :key="ruta.id"
                        class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-5 animate-poi-bounce group"
                        :style="{
                            left: getPointPosition(index).x + '%',
                            top: getPointPosition(index).y + '%',
                            animationDelay: `${index * 0.3}s`
                        }">
                        <div
                            class="w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-300">
                        </div>
                        <div
                            class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {{ ruta.titulo }}
                        </div>
                    </div>

                    <!-- Scanning line -->
                    <div class="radar-scan"></div>
                </div>

                <!-- Distance indicator -->
                <div class="flex justify-between items-center mt-5 gap-4">
                    <div class="flex-1 bg-white/20 backdrop-blur-md p-4 rounded-xl flex flex-col text-white">
                        <span class="text-sm opacity-90">Distancia al sitio</span>
                        <span class="text-3xl font-bold mt-1">{{ currentDistance }}m</span>
                    </div>
                    <div class="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform duration-500"
                        :style="{ transform: `rotate(${directionAngle}deg)` }">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path d="M12 2L4 12h6v10h4V12h6L12 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Site Info Card -->
            <div class="max-w-md mx-auto bg-white/15 backdrop-blur-xl rounded-2xl p-4 text-white">
                <div class="flex items-start gap-3 mb-4">
                    <div class="text-2xl">ℹ️</div>
                    <div class="flex-1">
                        <h3 class="font-semibold mb-2">Información del Sitio</h3>
                        <p class="text-sm opacity-90 mb-3 line-clamp-4">{{ sitioActive.descripcion }}</p>
                    </div>
                </div>

                <!-- Rutas -->
                <div v-if="sitioActive.rutas && sitioActive.rutas.length > 0">
                    <h4 class="font-semibold mb-2 text-sm flex items-center gap-2">
                        🗺️ Rutas Disponibles ({{ sitioActive.rutas.length }})
                    </h4>
                    <div class="space-y-2">
                        <div v-for="ruta in sitioActive.rutas" :key="ruta.id"
                            class="bg-white/10 rounded-lg p-3 text-sm">
                            <div class="flex items-center justify-between mb-1">
                                <span class="font-medium">{{ ruta.titulo }}</span>
                                <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ ruta.duracion }}
                                    min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useNavigation from '../hooks/useNavigation';
import { useRoute } from 'vue-router';
import AIAssistant from '@/app/components/AIAssistant.vue';

const {
    getSitiosById,
    sitioActive
} = useNavigation();

const route = useRoute();

// Estado de animación
const currentDistance = ref(25);
const directionAngle = ref(45);

// Función para obtener posiciones de puntos en el radar
const getPointPosition = (index) => {
    const positions = [
        { x: 30, y: 20 },
        { x: 70, y: 35 },
        { x: 50, y: 70 },
        { x: 20, y: 60 },
        { x: 80, y: 60 }
    ];
    return positions[index % positions.length];
};

// Intervalos para animación
let distanceInterval = null;

// Simular cambio de distancia y dirección
onMounted(async () => {
    await getSitiosById(route.params.id);

    // Simular cambio de distancia
    distanceInterval = setInterval(() => {
        currentDistance.value = Math.floor(Math.random() * 100) + 10;
        directionAngle.value = Math.floor(Math.random() * 360);
    }, 3000);
});

onUnmounted(() => {
    if (distanceInterval) clearInterval(distanceInterval);
});
</script>

<style scoped>
/* Animaciones personalizadas que no están en Tailwind */

/* Pulse effect */
.pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse-animation 2s ease-out infinite;
}

.animation-delay-600 {
    animation-delay: 0.6s;
}

.animation-delay-1200 {
    animation-delay: 1.2s;
}

@keyframes pulse-animation {
    0% {
        width: 20px;
        height: 20px;
        opacity: 1;
    }

    100% {
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}

/* Radar circles */
.radar-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

/* Radar scan line */
.radar-scan {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(74, 222, 128, 0.8), transparent);
    transform-origin: left center;
    animation: radar-scan 4s linear infinite;
}

@keyframes radar-scan {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* POI bounce animation */
@keyframes poi-bounce {

    0%,
    100% {
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        transform: translate(-50%, -50%) scale(1.1);
    }
}

.animate-poi-bounce {
    animation: poi-bounce 2s ease-in-out infinite;
}

/* Audio pulse animation */
@keyframes audio-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }
}

.animate-audio-pulse {
    animation: audio-pulse 1.5s ease-in-out infinite;
}
</style>