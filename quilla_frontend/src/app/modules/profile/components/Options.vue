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
            <li>
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
</template>

<script setup>
import { useDark } from '@vueuse/core';
import {
    ToggleSwitch
} from 'primevue';
import useAuth from '../../auth/hooks/useAuth';

const isDark = useDark()

const {
    logout
} = useAuth()

</script>