<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-slate-900">
        <!-- Back Button -->
        <div class="sticky top-4 px-4 z-30 ">
            <button @click="$router.go(-1)"
                class="group flex items-center gap-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-blue-300 dark:hover:border-blue-600">
                <svg class="w-5 h-5 text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-x-1 transition-all duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span
                    class="text-zinc-700 dark:text-zinc-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Volver</span>
            </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="!sitioActive" class="p-4 space-y-6 -mt-16">
            <!-- Header Skeleton -->
            <div class="animate-pulse">
                <div
                    class="h-8 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-xl w-3/4 mb-3">
                </div>
                <div
                    class="h-4 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-lg w-1/2">
                </div>
            </div>

            <!-- Image Skeleton -->
            <div
                class="h-48 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-2xl animate-pulse shadow-lg">
            </div>

            <!-- Info Skeleton -->
            <div class="space-y-3 animate-pulse">
                <div
                    class="h-4 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-lg w-full">
                </div>
                <div
                    class="h-4 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-lg w-5/6">
                </div>
                <div
                    class="h-4 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-lg w-4/6">
                </div>
            </div>

            <!-- Cards Skeleton -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                    class="h-24 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-2xl animate-pulse shadow-lg">
                </div>
                <div
                    class="h-24 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 rounded-2xl animate-pulse shadow-lg">
                </div>
            </div>
        </div>

        <!-- Content -->
        <div v-else class="max-w-4xl mx-auto -mt-16">
            <!-- Header -->
            <div class="relative overflow-hidden">
                <!-- Hero Section with animated background -->
                <div
                    class="relative pt-14 bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-500 dark:from-teal-800 dark:via-blue-800 dark:to-cyan-700">
                    <!-- Animated background elements -->
                    <div class="absolute inset-0 opacity-30">
                        <div class="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse">
                        </div>
                        <div
                            class="absolute top-32 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000">
                        </div>
                        <div
                            class="absolute bottom-20 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-xl animate-pulse delay-500">
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 h-full flex items-center justify-center text-center text-white p-6">
                        <div class="max-w-2xl">
                            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ sitioActive.nombre }}</h1>
                            <p class="text-lg md:text-xl mb-6 opacity-90 ">{{ sitioActive.descripcion }}</p>
                            <div class="flex items-center justify-center gap-3 flex-wrap">
                                <span
                                    class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-all duration-300">
                                    🎯 {{ sitioActive.categorias?.nombre }}
                                </span>
                                <span v-if="sitioActive.distancia > 0"
                                    class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-all duration-300">
                                    📍 {{ sitioActive.distancia }} km
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Decorative wave -->
                    <div class="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1200 120" class="w-full h-12 text-slate-50 dark:text-zinc-900">
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25" fill="currentColor"></path>
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                opacity=".5" fill="currentColor"></path>
                            <path
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="p-4 space-y-8 -mt-6 relative z-20">
                <!-- Info Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <!-- Horarios -->
                    <div
                        class="group bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-blue-300 dark:hover:border-blue-600">
                        <div class="flex items-center gap-4 mb-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="font-bold text-zinc-800 dark:text-zinc-100 text-lg">⏰ Horarios</h3>
                        </div>
                        <p class="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {{ sitioActive.horarios || 'No especificado' }}
                        </p>
                    </div>

                    <!-- Tarifas -->
                    <div
                        class="group bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-green-300 dark:hover:border-green-600">
                        <div class="flex items-center gap-4 mb-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                                    </path>
                                </svg>
                            </div>
                            <h3 class="font-bold text-zinc-800 dark:text-zinc-100 text-lg">💰 Tarifas</h3>
                        </div>
                        <p class="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {{ sitioActive.tarifas || '🆓 Gratuito' }}</p>
                    </div>
                </div>

                <!-- Rutas -->
                <div v-if="sitioActive.rutas && sitioActive.rutas.length > 0"
                    class="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-zinc-200/50 dark:border-zinc-700/50">
                    <div class="flex items-center gap-3 mb-6">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                            <span class="text-white text-lg">🗺️</span>
                        </div>
                        <h2 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Rutas Disponibles</h2>
                    </div>
                    <div class="space-y-4">
                        <div v-for="ruta in sitioActive.rutas" :key="ruta.id"
                            class="group relative bg-gradient-to-r from-white to-zinc-50 dark:from-zinc-700 dark:to-zinc-800 border-2 border-zinc-200 dark:border-zinc-600 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <!-- Decorative corner -->
                            <div
                                class="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity">
                            </div>

                            <div class="flex items-start justify-between mb-4">
                                <h3
                                    class="font-bold text-zinc-800 dark:text-zinc-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {{ ruta.titulo }}
                                </h3>
                                <span
                                    class="bg-gradient-to-r from-blue-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                    ⏱️ {{ ruta.duracion_estimada }}
                                </span>
                            </div>
                            <p class="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">{{ ruta.descripcion }}</p>

                            <!-- Audio count -->
                            <div v-if="ruta.audios && ruta.audios.length > 0" class="flex items-center gap-3 text-sm">
                                <div
                                    class="flex items-center gap-2 bg-gradient-to-r from-teal-100 to-pink-100 dark:from-teal-900/30 dark:to-pink-900/30 px-3 py-1 rounded-full text-teal-700 dark:text-teal-300">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.586 17.414l4.95-4.95a1.414 1.414 0 000-2L8.586 6.414">
                                        </path>
                                    </svg>
                                    <span>🎵 {{ ruta.audios.length }} audio(s) disponible(s)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        class="group flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-blue-300">
                        <span class="flex items-center justify-center gap-3">
                            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-10h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z">
                                </path>
                            </svg>
                            🚀 Iniciar Recorrido
                        </span>
                    </button>
                    <button
                        class="group flex-1 bg-gradient-to-r from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800 hover:from-zinc-700 hover:to-zinc-800 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-zinc-400">
                        <span class="flex items-center justify-center gap-3">
                            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            🗺️ Ver en Mapa
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useSitios from '../hooks/useSitios';

const route = useRoute()

const {
    sitioActive,
    getSitiosById
} = useSitios()


onMounted(async () => {
    const id = route.params.id;
    await getSitiosById(id)
})
</script>