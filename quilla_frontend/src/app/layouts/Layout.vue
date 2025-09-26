<script setup>
import Menu from '../components/Menu.vue';
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();
const { isMapFullscreen } = uiStore; 
</script>

<template>
    <div class="flex flex-col h-screen bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">

        <header class="flex-shrink-0">
        </header>

        <main class="flex-grow overflow-y-auto">
            <RouterView />
        </main>

        <div v-if="!isMapFullscreen" class="flex-shrink-0">
            <Menu />
        </div>
    </div>
</template>