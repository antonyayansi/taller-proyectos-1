<template>
    <div class="p-4 h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <Button icon="pi pi-refresh" @click="adminStore.fetchUsuarios()" outlined rounded size="small" />
        </div>

        <div v-if="adminStore.loading" class="flex justify-center my-10">
            <i class="pi pi-spin pi-spinner text-3xl text-purple-500"></i>
        </div>

        <div v-else class="flex flex-col gap-4 overflow-y-auto pb-10">
            <div v-for="usuario in adminStore.usuarios" :key="usuario.id"
                class="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <Avatar :image="usuario.avatar" shape="circle" size="large" />
                    <div>
                        <h3 class="font-bold dark:text-white">{{ usuario.nombre || 'Usuario sin nombre' }}</h3>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ usuario.email }}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-1">
                    <span class="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Asignar Rol:</span>
                    <Select v-model="usuario.rol" :options="rolesPermitidos" optionLabel="label" optionValue="value"
                        placeholder="Selecciona un rol" class="w-full md:w-48 text-sm"
                        @change="(e) => cambiarRol(usuario.id, e.value)" />
                </div>
            </div>

            <div v-if="adminStore.usuarios.length === 0" class="text-center text-zinc-500 mt-10">
                No hay perfiles registrados en el sistema.
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '../../admin/store/admin';
import { Button, Avatar, Select } from 'primevue';

const adminStore = useAdminStore();

const rolesPermitidos = [
    { label: 'Público (Lectura)', value: 'publico' },
    { label: 'Usuario Estándar', value: 'usuario' },
    { label: 'Guía Turístico', value: 'guia' },
    { label: 'Administrador', value: 'administrador' }
];

const cambiarRol = (id, nuevoRol) => {
    adminStore.updateUserRole(id, nuevoRol);
};

onMounted(() => {
    adminStore.fetchUsuarios();
});
</script>
