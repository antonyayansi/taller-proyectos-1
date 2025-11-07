<template>
    <div class="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-900">
        <!-- Fixed Header with Back Button and Actions -->
        <div
            class="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
            <div class="flex justify-between items-center p-4">
                <Button @click="$router.go(-1)" severity="secondary" icon="pi pi-arrow-left" text rounded
                    class="hover:bg-zinc-100 dark:hover:bg-zinc-800" />
                <div class="flex gap-2">
                    <Button icon="pi pi-share-alt" rounded text severity="secondary"
                        class="hover:bg-zinc-100 dark:hover:bg-zinc-800" />
                    <Button @click="setFavoritos(sitioActive.id)" icon="pi pi-heart" rounded text severity="secondary"
                        class="hover:bg-zinc-100 dark:hover:bg-zinc-800" />
                </div>
            </div>
        </div>

        <!-- Content -->
        <div v-if="sitioActive" class="pb-8">
            <!-- Hero Image with Gradient Overlay -->
            <div class="relative h-80 overflow-hidden">
                <img v-if="sitioActive.imagenes_sitio.length" :src="sitioActive.imagenes_sitio[0]?.url"
                    alt="Imagen del sitio" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <!-- Image Counter Badge -->
                <div v-if="sitioActive.imagenes_sitio.length > 1"
                    class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                    <i class="pi pi-images"></i>
                    <span>{{ sitioActive.imagenes_sitio.length }} fotos</span>
                </div>
            </div>

            <!-- Main Info Card -->
            <div class="mx-4 -mt-2 relative z-10">
                <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6">
                    <!-- Title and Category -->
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                                {{ sitioActive.nombre }}
                            </h1>
                            <Tag :value="sitioActive.categorias.nombre" severity="info" class="font-medium" />
                        </div>
                        <Button @click="initNavigation" icon="pi pi-directions" rounded size="large"
                            class="ml-4 bg-blue-600 hover:bg-blue-700" />
                    </div>

                    <!-- Quick Info Grid -->
                    <div class="grid grid-cols-2 gap-4 my-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                        <!-- Horarios -->
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <i class="pi pi-clock text-blue-600 dark:text-blue-400 text-lg"></i>
                            </div>
                            <div>
                                <p class="text-xs text-zinc-500 dark:text-zinc-400">Horario</p>
                                <p class="font-semibold text-sm text-zinc-900 dark:text-white">
                                    {{ sitioActive.horarios || 'No disponible' }}
                                </p>
                            </div>
                        </div>

                        <!-- Tarifas -->
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <i class="pi pi-dollar text-green-600 dark:text-green-400 text-lg"></i>
                            </div>
                            <div>
                                <p class="text-xs text-zinc-500 dark:text-zinc-400">Tarifa</p>
                                <p class="font-semibold text-sm text-zinc-900 dark:text-white">
                                    S/. {{ sitioActive.tarifas || 'Gratis' }}
                                </p>
                            </div>
                        </div>

                        <!-- Rutas disponibles -->
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <i class="pi pi-map-marker text-purple-600 dark:text-purple-400 text-lg"></i>
                            </div>
                            <div>
                                <p class="text-xs text-zinc-500 dark:text-zinc-400">Rutas</p>
                                <p class="font-semibold text-sm text-zinc-900 dark:text-white">
                                    {{ sitioActive.rutas?.length || 0 }}
                                </p>
                            </div>
                        </div>

                        <!-- Audio Guide Button -->
                        <div class="flex items-center gap-3">
                            <Button @click="textToSpeech(sitioActive.descripcion, sitioActive.nombre)"
                                icon="pi pi-volume-up" label="Escuchar" size="small" class="w-full" outlined />
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                            <i class="pi pi-info-circle text-blue-600"></i>
                            Descripción
                        </h3>
                        <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {{ sitioActive.descripcion }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Tabs Section -->
            <div class="mt-6 mx-4">
                <Tabs v-model:value="tap" class="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
                    <TabList class="border-b border-zinc-200 dark:border-zinc-700 px-4">
                        <Tab value="0" class="px-6 py-3 font-medium">
                            <i class="pi pi-map mr-2"></i>
                            Rutas
                        </Tab>
                        <Tab value="1" class="px-6 py-3 font-medium">
                            <i class="pi pi-images mr-2"></i>
                            Galería
                        </Tab>
                        <Tab value="2" class="px-6 py-3 font-medium">
                            <i class="pi pi-star mr-2"></i>
                            Reseñas
                        </Tab>
                    </TabList>
                    <TabPanels class="p-4">
                        <TabPanel value="0">
                            <Rutas v-if="tap === '0'" />
                        </TabPanel>
                        <TabPanel value="1">
                            <!-- Image Gallery Grid -->
                            <div class="grid grid-cols-2 gap-3">
                                <div v-for="(imagen, index) in sitioActive.imagenes_sitio" :key="index"
                                    class="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                                    <img :src="imagen.url" :alt="`Imagen ${index + 1}`"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    <div
                                        class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                                    </div>
                                </div>
                            </div>
                            <div v-if="!sitioActive.imagenes_sitio.length" class="text-center py-12 text-zinc-500">
                                <i class="pi pi-images text-4xl mb-3 block"></i>
                                <p>No hay imágenes disponibles</p>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <Resenias v-if="tap === '2'" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else class="p-4">
            <div class="animate-pulse">
                <div class="h-80 bg-zinc-300 dark:bg-zinc-700 rounded-xl mb-4"></div>
                <div class="h-8 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-full mb-2"></div>
                <div class="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-5/6"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {
    Button,
    Tag,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useSitios from '../hooks/useSitios';
import Rutas from '../components/Rutas.vue';
import useHome from '../hooks/useHome';
import usePerfil from '../../profile/hooks/usePerfil';
import Resenias from '../components/Resenias.vue';

const route = useRoute()
const router = useRouter()
const tap = ref('0');

const {
    sitioActive,
    getSitiosById,
    textToSpeech
} = useSitios()

const {
    ubicacionActual,
    obtenerUbicacion
} = useHome()

const {
    setFavoritos
} = usePerfil()

const initNavigation = () => {
    router.push({ name: 'home.sitio.navigate', params: { id: sitioActive.value.id } })
}

onMounted(async () => {
    const id = route.params.id;
    await getSitiosById(id)
    obtenerUbicacion()
})
</script>