<template>
    <!-- Skeleton Loading -->
    <div v-if="loading" class="space-y-4">
        <div class="flex justify-end">
            <Skeleton width="10rem" height="2.5rem" />
        </div>
        <div v-for="i in 3" :key="i"
            class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
            <div class="flex items-start gap-4">
                <Skeleton shape="circle" size="3rem" />
                <div class="flex-1 space-y-2">
                    <Skeleton width="60%" height="1.5rem" />
                    <Skeleton width="30%" height="1rem" />
                </div>
            </div>
            <div class="mt-4 space-y-2">
                <Skeleton width="8rem" height="1.5rem" />
                <Skeleton width="100%" height="3rem" />
            </div>
        </div>
    </div>

    <!-- Sin reseñas -->
    <div v-else-if="!resenias.length" class="text-center py-12 text-zinc-500">
        <i class="pi pi-star text-4xl mb-3 block"></i>
        <p>No hay reseñas disponibles</p>
        <Button @click="newResenia()" label="Escribir reseña" class="mt-4" outlined />
    </div>

    <!-- Lista de reseñas -->
    <div v-else class="space-y-4">
        <div class="flex justify-end">
            <Button @click="newResenia()" label="Escribir reseña" outlined />
        </div>
        <div v-for="resenia in resenias" :key="resenia.id"
            class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start gap-4">
                <Avatar :image="resenia.avatar || 'https://www.gravatar.com/avatar/?d=mp'" size="large"
                    shape="circle" />
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                        {{ resenia.name }}
                    </h3>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400">
                        {{ format(new Date(resenia.created_at), 'dd/MM/yyyy') }}
                    </p>
                </div>
            </div>
            <div class="mt-4 space-y-2">
                <Rating v-model="resenia.calificacion" :readonly="true" />
                <p class="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                    {{ resenia.comentario }}
                </p>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="openNewReseniaModal" modal header="Reseña" :style="{ width: '25rem' }">
        <div class="space-y-4">
            <div class="flex justify-center items-center gap-3">
                <Rating v-model="new_resenia.calificacion">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                            width="24" />
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                            width="24" />
                    </template>
                </Rating>
            </div>
            <Textarea v-model="new_resenia.comentario" fluid rows="5" placeholder="Escribe tu reseña aquí..." />
            <div class="flex items-center justify-end">
                <Button @click="openNewReseniaModal = false" label="Cancelar" class="mr-2" outlined />
                <Button @click="addNewResenia()" label="Publicar" />
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import {
    Button,
    Dialog,
    Textarea,
    Rating,
    Avatar,
    Skeleton
} from 'primevue';
import useSitios from '../hooks/useSitios';
import { format } from 'date-fns';

const {
    getReseniasBySitioId,
    resenias,
    sitioActive,
    new_resenia,
    openNewReseniaModal,
    addNewResenia,
    loadingResenias: loading
} = useSitios()

const newResenia = () => {
    openNewReseniaModal.value = true
}

getReseniasBySitioId(sitioActive.value?.id)
</script>