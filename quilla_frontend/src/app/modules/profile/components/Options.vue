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
            <li @click="onOpenDrawer('Favoritos')">
                <div class="flex justify-between items-center">
                    <span><i class="pi pi-heart"></i> Mis favoritos</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li @click="onOpenDrawer('Audios')">
                <div class="flex justify-between items-center">
                    <span><i class="pi pi-headphones"></i> Mis audios guardados</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li @click="onOpenDrawer('Narrador')">
                <div class="flex justify-between items-center">
                    <span><i class="pi pi-comment"></i> Narrador</span>
                    <i class="pi pi-chevron-right"></i>
                </div>
            </li>
            <li>
                <div class="flex justify-between items-center">
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
        style="height: 80vh; min-height: auto;" :dismissable-mask="true">
        <Audios v-if="optionSelected === 'Audios'" />
        <Favoritos v-if="optionSelected === 'Favoritos'" />
        <NarratorConfig v-if="optionSelected === 'Narrador'" />
    </Drawer>
</template>

<script setup>
import { useDark } from '@vueuse/core';
import {
    ToggleSwitch,
    Drawer
} from 'primevue';
import useAuth from '../../auth/hooks/useAuth';
import { ref } from 'vue';
import NarratorConfig from './NarratorConfig.vue';
import Favoritos from './Favoritos.vue';
import Audios from './Audios.vue';

const isDark = useDark()
const openDrawer = ref(false)
const optionSelected = ref(null)

const {
    logout
} = useAuth()

const onOpenDrawer = (option) => {
    optionSelected.value = option
    openDrawer.value = true
}

</script>