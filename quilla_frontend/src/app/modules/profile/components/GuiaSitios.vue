<template>
    <div class="p-4 h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold dark:text-zinc-100">Catálogo de Sitios Turísticos</h2>
            <Button icon="pi pi-plus" label="Crear Sitio" @click="abrirDialogo" size="small" />
        </div>

        <div v-if="guiaStore.loading" class="flex justify-center my-10">
            <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
        </div>

        <div v-else class="flex flex-col gap-4 overflow-y-auto pb-20">
            <div v-for="sitio in guiaStore.misSitios" :key="sitio.id"
                class="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl flex flex-col gap-2">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-lg dark:text-white">{{ sitio.nombre }}</h3>
                    <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmarBorrar(sitio.id)" />
                </div>
                <div class="flex items-center gap-2 mb-2">
                    <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {{ sitio.categorias?.nombre || 'General' }}
                    </span>
                    <span class="text-xs text-zinc-500">📍 {{ sitio.lat?.toFixed(4) }}, {{ sitio.lng?.toFixed(4) }}</span>
                </div>
                <p class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{{ sitio.descripcion }}</p>
                <div class="text-xs text-zinc-500 mt-2">
                    <i class="pi pi-clock mr-1"></i> {{ sitio.horarios || 'No definido' }}
                </div>
            </div>

            <div v-if="guiaStore.misSitios.length === 0" class="text-center text-zinc-500 my-10">
                Aún no has creado ningún sitio turístico.
            </div>
        </div>

        <Dialog v-model:visible="modalAbierto" header="Nuevo Sitio Turístico" :modal="true" class="w-11/12 md:max-w-xl"
            @show="inicializarMapa">
            <div class="flex flex-col gap-4 mt-2 max-h-[70vh] overflow-y-auto p-1">

                <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-zinc-600 dark:text-zinc-300">Nombre del Lugar</label>
                    <InputText v-model="nuevo.nombre" placeholder="Ej. El gran museo" />
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-zinc-600 dark:text-zinc-300">Descripción (Atractivo)</label>
                    <Textarea v-model="nuevo.descripcion" rows="3" placeholder="Información turística principal..." />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-zinc-600 dark:text-zinc-300">Categoría</label>
                        <Select v-model="nuevo.categorias_id" :options="guiaStore.categoriasActivas" optionLabel="nombre"
                            optionValue="id" placeholder="Clasifique el sitio" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-zinc-600 dark:text-zinc-300">Horarios (Atención)</label>
                        <InputText v-model="nuevo.horarios" placeholder="Ej. L-V 8AM - 5PM" />
                    </div>
                </div>

                <!-- Mapa interactivo para seleccionar lat/lng -->
                <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold text-green-600 dark:text-green-400">
                        <i class="pi pi-map-marker"></i> Ubicación en el Mapa
                        <span class="font-normal text-zinc-500 ml-1">(toca el mapa para posicionar el marcador)</span>
                    </label>
                    <div ref="mapContainer" class="w-full rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-600" style="height: 220px;"></div>
                    <div class="flex gap-3 text-xs text-zinc-500">
                        <span>📍 Lat: <strong class="text-zinc-800 dark:text-zinc-200">{{ nuevo.lat || '—' }}</strong></span>
                        <span>Lng: <strong class="text-zinc-800 dark:text-zinc-200">{{ nuevo.lng || '—' }}</strong></span>
                    </div>
                </div>

                <div class="flex flex-col gap-1 mt-2">
                    <label class="text-xs font-bold text-blue-600 dark:text-blue-400">
                        <i class="pi pi-images"></i> Subir Imágenes Representativas
                    </label>
                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="10000000"
                        multiple @select="onImageSelect" chooseLabel="Elegir Fotos" class="mt-1" />
                    <small class="text-zinc-400">Estas imágenes se subirán directamente al catálogo de este sitio.</small>
                </div>
            </div>

            <template #footer>
                <div class="flex gap-2 justify-end pt-3">
                    <Button label="Cancelar" text severity="secondary" @click="modalAbierto = false" />
                    <Button label="Crear Sitio" icon="pi pi-check" @click="guardarSitio" :loading="saving" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useGuiaStore } from '../../admin/store/guia';
import { Button, InputText, Textarea, Dialog, Select, FileUpload } from 'primevue';
import { useConfirm } from "primevue/useconfirm";
import { toast } from 'vue-sonner';
import { loadMapa } from '@/services/gps';

const guiaStore = useGuiaStore();
const confirm = useConfirm();

const modalAbierto = ref(false);
const saving = ref(false);
const imagenesAsubir = ref([]);
const mapContainer = ref(null);

const nuevo = ref({
    nombre: '',
    descripcion: '',
    categorias_id: null,
    horarios: '',
    lat: '',
    lng: ''
});

const inicializarMapa = async () => {
    // nextTick para que el DOM del Dialog este disponible
    await nextTick();
    if (!mapContainer.value) return;

    try {
        await loadMapa(
            mapContainer.value,
            { lat: -13.516985, lng: -71.978113 }, // centro inicial (Cusco)
            'turismo',
            true, // drag habilitado - click en mapa mueve el marcador
            ({ lat, lng }) => {
                // Callback al hacer click o arrastrar el marcador
                nuevo.value.lat = lat.toFixed(6);
                nuevo.value.lng = lng.toFixed(6);
            }
        );
    } catch (e) {
        console.error('Error al cargar el mapa:', e);
        toast.error('No se pudo cargar el mapa. Verifica tu conexion.');
    }
};

const onImageSelect = (event) => {
    imagenesAsubir.value = event.files;
};

const abrirDialogo = () => {
    nuevo.value = { nombre: '', descripcion: '', categorias_id: null, horarios: '', lat: '', lng: '' };
    imagenesAsubir.value = [];
    modalAbierto.value = true;
};

const guardarSitio = async () => {
    if (!nuevo.value.nombre || !nuevo.value.categorias_id) {
        toast.warning('Por favor llene el nombre y la categoria.');
        return;
    }
    if (!nuevo.value.lat || !nuevo.value.lng) {
        toast.warning('Por favor selecciona la ubicacion en el mapa.');
        return;
    }

    saving.value = true;
    const completado = await guiaStore.createSitio(nuevo.value, imagenesAsubir.value);
    saving.value = false;

    if (completado) {
        modalAbierto.value = false;
    }
};

const confirmarBorrar = (id) => {
    confirm.require({
        message: 'Borrar sitio? Esto eliminara visualmente el acceso a el.',
        header: 'Cuidado',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
            guiaStore.deleteSitio(id);
        }
    });
};

onMounted(() => {
    guiaStore.fetchCategorias();
    guiaStore.fetchMisSitios();
});
</script>
