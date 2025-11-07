<template>
    <div class="">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 gap-4">
            <div v-for="n in 3" :key="n" class="animate-pulse">
                <div class="bg-white dark:bg-zinc-800 rounded-2xl p-4">
                    <div class="flex gap-4">
                        <div class="w-24 h-24 bg-zinc-300 dark:bg-zinc-700 rounded-xl"></div>
                        <div class="flex-1">
                            <div class="h-5 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
                            <div class="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
                            <div class="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!favoritos.length" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <i class="pi pi-heart text-5xl text-zinc-400 dark:text-zinc-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                No tienes favoritos aún
            </h3>
            <p class="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm">
                Explora lugares increíbles y guarda tus favoritos tocando el icono de corazón
            </p>
            <Button label="Explorar lugares" icon="pi pi-compass" @click="$router.push('/')" size="large" />
        </div>

        <!-- Favoritos Grid -->
        <div v-else class="grid grid-cols-1 gap-6">
            <div v-for="{ sitio } in favoritos" :key="sitio.id" @click="goToSitio(sitio.id)"
                class="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">

                <!-- Image Section -->
                <div class="relative h-48 overflow-hidden">
                    <img v-if="sitio.imagenes_sitio && sitio.imagenes_sitio.length > 0"
                        :src="sitio.imagenes_sitio[0].url" :alt="sitio.nombre"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div v-else
                        class="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                        <i class="pi pi-image text-6xl text-white opacity-50"></i>
                    </div>

                    <!-- Overlay gradient -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <!-- Category Badge -->
                    <div class="absolute top-4 left-4">
                        <Tag v-if="sitio.categorias" :value="sitio.categorias.nombre" severity="info"
                            class="bg-white/90 backdrop-blur-sm text-zinc-800 font-semibold px-3 py-1 text-xs" />
                    </div>

                    <!-- Heart Icon -->
                    <div class="absolute top-4 right-4">
                        <div
                            class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <i class="pi pi-heart-fill text-red-500 text-lg"></i>
                        </div>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="p-5">
                    <!-- Title -->
                    <h3
                        class="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {{ sitio.nombre }}
                    </h3>

                    <!-- Description -->
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                        {{ sitio.descripcion }}
                    </p>

                    <!-- Info Grid -->
                    <div class="grid grid-cols-2 gap-3">
                        <!-- Horarios -->
                        <div class="flex items-center gap-2">
                            <div
                                class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="pi pi-clock text-purple-600 dark:text-purple-400 text-sm"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs text-zinc-500 dark:text-zinc-500">Horario</p>
                                <p class="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {{ sitio.horarios }}
                                </p>
                            </div>
                        </div>

                        <!-- Tarifas -->
                        <div class="flex items-center gap-2">
                            <div
                                class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="pi pi-tag text-green-600 dark:text-green-400 text-sm"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs text-zinc-500 dark:text-zinc-500">Entrada</p>
                                <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                                    S/ {{ sitio.tarifas }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                        <div
                            class="flex items-center justify-between text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform">
                            <span class="text-sm font-semibold">Ver detalles</span>
                            <i class="pi pi-arrow-right text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Button, Tag } from 'primevue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import usePerfil from '../hooks/usePerfil';

const router = useRouter();
const loading = ref(true);

const {
    favoritos,
    getFavoritos
} = usePerfil();

const init = async () => {
    loading.value = true;
    try {
        await getFavoritos();
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
    } finally {
        loading.value = false;
    }
};

const goToSitio = (id) => {
    if (id) {
        router.push(`/sitio/${id}`);
    }
};

init();
</script>