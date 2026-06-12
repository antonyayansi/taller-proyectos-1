<template>
    <div v-if="sitioActive && sitioActive.rutas.length" class="space-y-4">
        <div v-for="ruta in sitioActive.rutas" :key="ruta.id"
            class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                        {{ ruta.titulo }}
                    </h3>
                    <div class="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <i class="pi pi-clock"></i>
                        <span>{{ ruta.duracion }} min</span>
                    </div>
                </div>
                <Button @click="textToSpeech(ruta.descripcion, ruta.titulo, true, ruta.id)" icon="pi pi-volume-up"
                    rounded text severity="secondary" size="small" v-tooltip.top="'Escuchar descripción'" />
            </div>
            <!-- <p v-if="ruta.descripcion" class="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                {{ ruta.descripcion }}
            </p> -->
        </div>
    </div>
    <div v-else class="text-center py-12">
        <i class="pi pi-map text-4xl text-zinc-400 dark:text-zinc-600 mb-3 block"></i>
        <p class="text-zinc-500 dark:text-zinc-400">No hay rutas disponibles</p>
    </div>
</template>

<script setup>
import { Button } from 'primevue';
import useSitios from '../hooks/useSitios';

const {
    sitioActive,
    textToSpeech
} = useSitios()
</script>