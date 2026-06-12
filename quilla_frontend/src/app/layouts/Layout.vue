<template>
    <div class="flex flex-col justify-between min-h-screen">
        <!-- <header>
            Header
        </header> -->
        <main>
            <RouterView />
        </main>
        <Menu />
        <AudioPlayer />
    </div>
</template>

<script setup>
import Menu from '../components/Menu.vue';
import AudioPlayer from '../components/AudioPlayer.vue';
</script>