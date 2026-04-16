<template>
    <div class="p-4 h-full flex flex-col">
        <div class="mb-6">
            <h2 class="text-xl font-bold dark:text-zinc-100">Subir Imágenes a Sitios</h2>
            <p class="text-sm text-zinc-500 mt-1">Selecciona un sitio y sube fotos representativas para los turistas.
            </p>
        </div>

        <!-- Selector de sitio -->
        <div class="flex flex-col gap-2 mb-4">
            <label class="text-sm font-bold text-zinc-600 dark:text-zinc-300">Sitio Turístico</label>
            <Select v-model="sitioSeleccionado" :options="guiaStore.misSitios" optionLabel="nombre" optionValue="id"
                placeholder="Selecciona el sitio al que subir imágenes" class="w-full" @change="cargarImagenesSitio" />
        </div>

        <!-- Uploader -->
        <div v-if="sitioSeleccionado" class="flex flex-col gap-3">
            <div class="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center">
                <input ref="inputFile" type="file" accept="image/*" multiple class="hidden" @change="onFilesSelected" />
                <i class="pi pi-cloud-upload text-4xl text-blue-400 mb-3"></i>
                <p class="text-sm font-semibold dark:text-zinc-200">Arrastra fotos o</p>
                <Button label="Elegir desde dispositivo" outlined size="small" class="mt-3"
                    @click="inputFile.click()" />
            </div>

            <!-- Preview de archivos seleccionados -->
            <div v-if="archivosSeleccionados.length" class="flex flex-wrap gap-2 mt-2">
                <div v-for="(archivo, i) in archivosSeleccionados" :key="i" class="relative">
                    <img :src="archivo.preview"
                        class="w-20 h-20 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700" />
                    <button @click="quitarArchivo(i)"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ×
                    </button>
                </div>
            </div>

            <Button v-if="archivosSeleccionados.length" label="Subir Imágenes al Sitio" icon="pi pi-upload"
                :loading="subiendo" @click="subirImagenes" class="mt-2" />
        </div>

        <!-- Imágenes ya subidas -->
        <div v-if="imagenesActuales.length && sitioSeleccionado" class="mt-6">
            <h3 class="text-sm font-bold text-zinc-600 dark:text-zinc-300 mb-2">
                Imágenes actuales del sitio ({{ imagenesActuales.length }})
            </h3>
            <div class="flex flex-wrap gap-2">
                <div v-for="img in imagenesActuales" :key="img.id" class="relative">
                    <img :src="img.url"
                        class="w-24 h-24 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700" />
                    <button @click="eliminarImagenSitio(img.id)"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ×
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!sitioSeleccionado" class="flex-1 flex items-center justify-center">
            <div class="text-center text-zinc-400">
                <i class="pi pi-image text-4xl mb-3"></i>
                <p>Selecciona un sitio para gestionar sus imágenes</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useGuiaStore } from '../../admin/store/guia';
import { supabase } from '@/services/supabase/supabase';
import { uploadFileToS3, deleteFileFromS3 } from '@/services/aws';
import { Button, Select } from 'primevue';
import { toast } from 'vue-sonner';

const guiaStore = useGuiaStore();
const inputFile = ref(null);
const sitioSeleccionado = ref(null);
const archivosSeleccionados = ref([]);
const imagenesActuales = ref([]);
const subiendo = ref(false);

const cargarImagenesSitio = async () => {
    if (!sitioSeleccionado.value) return;
    const { data, error } = await supabase
        .from('imagenes_sitio')
        .select('*')
        .eq('sitios_id', sitioSeleccionado.value);
    if (!error) imagenesActuales.value = data;
};

const onFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
    }));
    archivosSeleccionados.value.push(...newFiles);
    // Reset input so same file can be re-selected
    e.target.value = '';
};

const quitarArchivo = (index) => {
    URL.revokeObjectURL(archivosSeleccionados.value[index].preview);
    archivosSeleccionados.value.splice(index, 1);
};

const subirImagenes = async () => {
    if (!sitioSeleccionado.value || !archivosSeleccionados.value.length) return;
    subiendo.value = true;
    try {
        for (const { file } of archivosSeleccionados.value) {
            const fileName = `sitios/${sitioSeleccionado.value}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            await uploadFileToS3(fileName, file);
            const url = `https://rotux.s3.us-east-1.amazonaws.com/${fileName}`;
            await supabase.from('imagenes_sitio').insert([{ sitios_id: sitioSeleccionado.value, url }]);
        }
        toast.success(`${archivosSeleccionados.value.length} imágenes subidas con éxito.`);
        archivosSeleccionados.value = [];
        await cargarImagenesSitio();
    } catch (err) {
        console.error(err);
        toast.error('Error al subir una o más imágenes.');
    } finally {
        subiendo.value = false;
    }
};

const eliminarImagenSitio = async (imgId) => {
    const img = imagenesActuales.value.find(i => i.id === imgId);
    if (!img) return;
    try {
        // Extract S3 key from URL
        const key = img.url.split('.amazonaws.com/')[1];
        await deleteFileFromS3(key);
        await supabase.from('imagenes_sitio').delete().eq('id', imgId);
        imagenesActuales.value = imagenesActuales.value.filter(i => i.id !== imgId);
        toast.success('Imagen eliminada.');
    } catch (err) {
        console.error(err);
        toast.error('Error al eliminar la imagen.');
    }
};

onMounted(() => {
    guiaStore.fetchMisSitios();
});
</script>
