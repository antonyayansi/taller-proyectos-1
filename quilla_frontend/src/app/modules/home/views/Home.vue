<template>
    <div class="px-4 py-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <!-- 🔍 BUSCADOR -->
        <input v-model="textoBusqueda" @keyup="aplicarFiltros"
            class="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-sm w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar..." />

        <!-- 🏷️ SELECT DE CATEGORÍAS -->
        <div class="mt-3">
            <Select v-model="categoriaSeleccionada" :options="categorias" optionLabel="nombre" optionValue="id"
                placeholder="Selecciona una categoría"
                class="w-full md:w-56 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-sm"
                @change="aplicarFiltros" />
        </div>

        <!-- 🗺️ MAPA -->
        <div class="my-4">
            <div class="flex items-center justify-between space-x-2">
                <label class="font-light text-sm">Tu ubicación actual</label>
                <button class="text-blue-500 text-sm font-medium" @click="obtenerUbicacion">
                    Actualizar
                </button>
            </div>
            <div class="h-42 rounded-lg mt-2" ref="mapContainer"></div>
        </div>

        <!-- 📋 LISTA DE SITIOS -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-zinc-600 dark:text-zinc-300 text-lg font-medium">
                Cargando sitios turísticos...
            </p>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                Esto solo tomará un momento
            </p>
        </div>

        <template v-else>
            <div v-if="sitios.length > 0" class="space-y-4">
                <button class="text-green-500 text-sm font-medium" @click="addSitesToMap">
                    Importar sitios a mapa
                </button>

                <router-link v-for="sitio in sitios" :key="sitio.id"
                    :to="{ name: 'home.sitio', params: { id: sitio.id } }">
                    <div
                        class="my-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-shadow duration-300">
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
                </router-link>
            </div>

            <!-- ❌ SIN RESULTADOS -->
            <div v-else class="flex flex-col items-center justify-center text-center py-12">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png" alt="No encontrado"
                    class="w-20 h-20 mb-4 opacity-80" />
                <h2 class="text-xl font-semibold text-zinc-700 dark:text-zinc-200">
                    ¡Ups! 😅
                </h2>
                <p class="text-zinc-600 dark:text-zinc-400 mt-2">
                    Aún no tenemos esta categoría disponible
                </p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/services/supabase/supabase";
import useSitios from "../hooks/useSitios";
import useHome from "../hooks/useHome";
import Select from 'primevue/select';

const mapContainer = ref(null);
const categorias = ref([]);
const textoBusqueda = ref("");
const categoriaSeleccionada = ref("");
const loading = ref(false);

const { obtenerUbicacion, setMapContainer } = useHome();
const { sitios, getSitios, addSitesToMap } = useSitios();

// ✅ Cargar categorías desde Supabase
const getCategorias = async () => {
    const { data, error } = await supabase.from("categorias").select("id, nombre");
    if (error) {
        console.error("Error al obtener categorías:", error);
        return;
    }
    categorias.value = data;
};

// ✅ Aplicar filtros combinados
const aplicarFiltros = async () => {
    loading.value = true;

    let query = supabase.from("sitios").select("*");

    if (categoriaSeleccionada.value) {
        query = query.eq("categoria_id", categoriaSeleccionada.value);
    }

    if (textoBusqueda.value.trim() !== "") {
        query = query.or(
            `nombre.ilike.%${textoBusqueda.value}%, descripcion.ilike.%${textoBusqueda.value}%`
        );
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error al aplicar filtros:", error);
        loading.value = false;
        return;
    }

    sitios.value = data || [];
    loading.value = false;
};

onMounted(async () => {
    setMapContainer(mapContainer.value);
    loading.value = true;
    await obtenerUbicacion();
    await getSitios(); // carga inicial
    await getCategorias(); // carga categorías
    loading.value = false;
});
</script>
