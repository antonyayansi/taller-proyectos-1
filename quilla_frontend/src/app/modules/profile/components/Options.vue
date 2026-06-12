<template>
    <div class="py-4">
        <ul
            class="w-full text-zinc-700 font-medium dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 space-y-4">
            <li>
                <div class="flex justify-between items-center">
                    <span><i class="pi pi-moon"></i> Modo oscuro</span>
                    <ToggleSwitch v-model="isDark" />
                </div>
            </li>
            <li v-if="['usuario', 'administrador', 'guia'].includes(user?.rol)" @click="onOpenDrawer('Favoritos')">
                <div class="flex justify-between items-center cursor-pointer">
                    <span><i class="pi pi-heart"></i> Mis favoritos</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li v-if="['usuario', 'administrador', 'guia'].includes(user?.rol)" @click="onOpenDrawer('Audios')">
                <div class="flex justify-between items-center cursor-pointer">
                    <span><i class="pi pi-headphones"></i> Mis audios guardados</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li v-if="['usuario', 'administrador', 'guia'].includes(user?.rol)" @click="onOpenDrawer('Narrador')">
                <div class="flex justify-between items-center cursor-pointer">
                    <span><i class="pi pi-comment"></i> Narrador</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            
            <!-- Vistas Solo para GUIA -->
            <li v-if="user?.rol === 'guia'" @click="onOpenDrawer('CrearSitio')">
                <div class="flex justify-between items-center text-blue-500 cursor-pointer">
                    <span><i class="pi pi-map-marker"></i> Crear sitio turístico</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li v-if="user?.rol === 'guia'" @click="onOpenDrawer('SubirImagenes')">
                <div class="flex justify-between items-center text-blue-500 cursor-pointer">
                    <span><i class="pi pi-image"></i> Subir Imágenes</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>

            <!-- Vistas Solo para ADMINISTRADOR -->
            <li v-if="user?.rol === 'administrador'" @click="onOpenDrawer('AdminUsuarios')">
                <div class="flex justify-between items-center text-purple-500 cursor-pointer">
                    <span><i class="pi pi-users"></i> Administrar Usuarios</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li v-if="user?.rol === 'administrador'" @click="onOpenDrawer('AdminRoles')">
                <div class="flex justify-between items-center text-purple-500 cursor-pointer">
                    <span><i class="pi pi-shield"></i> Administrar Roles</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li v-if="user?.rol === 'administrador'" @click="onOpenDrawer('AdminMaestras')">
                <div class="flex justify-between items-center text-purple-500 cursor-pointer">
                    <span><i class="pi pi-database"></i> Tablas Maestras</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>

            <li>
                <div class="flex justify-between items-center cursor-pointer">
                    <span><i class="pi pi-cog"></i> Configuración</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li>
                <div class="flex justify-between text-red-500 items-center cursor-pointer" @click="logout">
                    <span><i class="pi pi-sign-out"></i> Cerrar sesión</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
        </ul>
    </div>
    <Drawer v-model:visible="openDrawer" :header="optionSelected" position="bottom"
        style="height: 90vh; min-height: auto;" :dismissable-mask="true">
        <Audios v-if="optionSelected === 'Audios'" />
        <Favoritos v-if="optionSelected === 'Favoritos'" />
        <NarratorConfig v-if="optionSelected === 'Narrador'" />
        <AdminUsuarios v-if="optionSelected === 'Administrar Usuarios' || optionSelected === 'Administrar Roles'" />
        <AdminCategorias v-if="optionSelected === 'Tablas Maestras'" />
        <GuiaSitios v-if="optionSelected === 'Crear sitio turístico'" />
        <GuiaImagenes v-if="optionSelected === 'Subir Imágenes'" />
    </Drawer>
</template>

<script setup>
import { useDark } from '@vueuse/core';
import { ToggleSwitch, Drawer } from 'primevue';
import useAuth from '../../auth/hooks/useAuth';
import { ref } from 'vue';
import NarratorConfig from './NarratorConfig.vue';
import Favoritos from './Favoritos.vue';
import Audios from './Audios.vue';
import AdminUsuarios from './AdminUsuarios.vue';
import AdminCategorias from './AdminCategorias.vue';
import GuiaSitios from './GuiaSitios.vue';
import GuiaImagenes from './GuiaImagenes.vue';

const isDark = useDark()
const openDrawer = ref(false)
const optionSelected = ref(null)

const {
    user,
    logout
} = useAuth()

const onOpenDrawer = (option) => {
    const titles = {
        'CrearSitio': 'Crear sitio turístico',
        'SubirImagenes': 'Subir Imágenes',
        'AdminUsuarios': 'Administrar Usuarios',
        'AdminRoles': 'Administrar Roles',
        'AdminMaestras': 'Tablas Maestras'
    }
    optionSelected.value = titles[option] || option
    openDrawer.value = true
}

</script>