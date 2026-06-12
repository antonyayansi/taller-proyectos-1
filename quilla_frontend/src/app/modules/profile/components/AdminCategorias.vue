<template>
    <div class="p-4 h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <Button icon="pi pi-plus" @click="abrirModal('', null)" label="Nueva" size="small" />
        </div>

        <div v-if="adminStore.loading" class="flex justify-center my-10">
            <i class="pi pi-spin pi-spinner text-3xl text-purple-500"></i>
        </div>

        <div v-else class="flex flex-col gap-3 overflow-y-auto pb-10">
            <div v-for="cat in adminStore.categorias" :key="cat.id"
                class="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-zinc-800 dark:text-zinc-100">{{ cat.nombre }}</h3>
                    <p class="text-xs text-zinc-500">ID: {{ cat.id }}</p>
                </div>
                <div class="flex gap-2">
                    <Button icon="pi pi-pencil" severity="secondary" rounded text
                        @click="abrirModal(cat.nombre, cat.id)" />
                    <Button icon="pi pi-trash" severity="danger" rounded text @click="confirmarBorrar(cat.id)" />
                </div>
            </div>

            <div v-if="adminStore.categorias.length === 0" class="text-center text-zinc-500 mt-10">
                No hay categorías creadas aún.
            </div>
        </div>

        <!-- Dialog para Crear / Editar -->
        <Dialog v-model:visible="modalAbierto" :header="idEdicion ? 'Editar Categoría' : 'Nueva Categoría'"
            :modal="true" class="w-11/12 max-w-md">
            <div class="flex flex-col gap-4 mt-2">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold dark:text-zinc-300">Nombre de la Categoría</label>
                    <InputText v-model="nombreModal" placeholder="Ej. Museo, Parque, Restaurante" />
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancelar" icon="pi pi-times" text severity="secondary"
                        @click="modalAbierto = false" />
                    <Button label="Guardar" icon="pi pi-check" @click="guardar" :disabled="!nombreModal" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAdminStore } from '../../admin/store/admin';
import { Button, InputText, Dialog } from 'primevue';
import { useConfirm } from "primevue/useconfirm";

const adminStore = useAdminStore();
const confirm = useConfirm();

const modalAbierto = ref(false);
const nombreModal = ref('');
const idEdicion = ref(null);

const abrirModal = (nombre = '', id = null) => {
    nombreModal.value = nombre;
    idEdicion.value = id;
    modalAbierto.value = true;
};

const guardar = async () => {
    if (idEdicion.value) {
        await adminStore.updateCategoria(idEdicion.value, nombreModal.value);
    } else {
        await adminStore.createCategoria(nombreModal.value);
    }
    modalAbierto.value = false;
};

const confirmarBorrar = (id) => {
    confirm.require({
        message: '¿Estás seguro que quieres eliminar esta categoría? Si tiene sitios turísticos asignados, ocurrirá un error.',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Sí, borrar',
        accept: () => {
            adminStore.deleteCategoria(id);
        }
    });
};

onMounted(() => {
    adminStore.fetchCategorias();
});
</script>
