<template>
    <div>
        <div v-if="audiosSave.length > 0" class="flex justify-between items-center mb-4">
            <div>
                <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">
                    Audios guardados ({{ audiosSave.length }})
                </h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    Espacio usado: {{ espacioUsadoMB }} MB
                </p>
            </div>
            <Button @click="confirmarEliminarTodos" icon="pi pi-trash" label="Eliminar todos" :severity="'danger'"
                size="small" outlined />
        </div>

        <ul v-if="audiosSave.length === 0" class="text-center mt-6 text-zinc-600 dark:text-zinc-400">
            <li>No tienes audios guardados.</li>
        </ul>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="audio in audiosSave" :key="audio"
                class="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div
                            class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-volume-up text-white text-xl"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                {{ audio.name || 'Audio guardado' }}
                            </h4>
                            <p class="text-xs text-zinc-500 dark:text-zinc-400">
                                {{ formatearTamanio(audio.size) }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <Button @click="reproducirAudio(audio.name)" icon="pi pi-play" rounded :severity="'success'"
                            size="large" />
                        <Button @click="confirmarEliminarAudio(audio.name)" icon="pi pi-trash" rounded
                            :severity="'danger'" size="large" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ConfirmDialog />
</template>

<script setup>
import { Button } from 'primevue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { computed } from 'vue';
import usePerfil from '../hooks/usePerfil';

const confirm = useConfirm();

const {
    audiosSave,
    reproducirAudio,
    eliminarAudio,
    eliminarTodosLosAudios
} = usePerfil()

// Calcular espacio total usado en MB
const espacioUsadoMB = computed(() => {
    const totalBytes = audiosSave.value.reduce((total, audio) => {
        return total + (audio.size || 0);
    }, 0);
    return (totalBytes / (1024 * 1024)).toFixed(2);
});

// Formatear tamaño de archivo individual
const formatearTamanio = (bytes) => {
    if (!bytes) return '0 KB';

    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(2)} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
};

const confirmarEliminarAudio = (fileName) => {
    confirm.require({
        message: '¿Estás seguro de que deseas eliminar este audio?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        acceptClass: 'p-button-danger',
        rejectLabel: 'Cancelar',
        rejectClass: 'p-button-secondary',
        accept: async () => {
            try {
                await eliminarAudio(fileName);
            } catch (error) {
                console.error('Error al eliminar audio:', error);
            }
        }
    });
};

const confirmarEliminarTodos = () => {
    confirm.require({
        message: `¿Estás seguro de que deseas eliminar todos los ${audiosSave.value.length} audios guardados?`,
        header: 'Confirmar eliminación masiva',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar todos',
        acceptClass: 'p-button-danger',
        rejectLabel: 'Cancelar',
        rejectClass: 'p-button-secondary',
        accept: async () => {
            try {
                await eliminarTodosLosAudios();
            } catch (error) {
                console.error('Error al eliminar todos los audios:', error);
            }
        }
    });
};

</script>