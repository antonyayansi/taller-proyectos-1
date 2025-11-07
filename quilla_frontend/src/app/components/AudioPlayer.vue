<template>
    <Transition name="slide-up">
        <div v-if="audioPlayer.audio"
            class="fixed bottom-4 mx-2 rounded-xl left-0 right-0 z-50 backdrop-blur-xl bg-white/30 dark:bg-zinc-800/30 border-t border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <div class="max-w-screen-lg mx-auto px-4 py-3">
                <!-- Player Header -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div
                            class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-volume-up text-white text-xl"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                {{ audioPlayer.title || 'Reproduciendo audio' }}
                            </h4>
                            <p class="text-xs text-zinc-500 dark:text-zinc-400">
                                {{ formatTime(audioPlayer.currentTime) }} / {{ formatTime(audioPlayer.duration) }}
                            </p>
                        </div>
                    </div>
                    <Button @click="stopAudio" icon="pi pi-times" text rounded severity="secondary"
                        class="flex-shrink-0" />
                </div>

                <!-- Progress Bar -->
                <div class="mb-3">
                    <Slider v-model="currentTime" @update:modelValue="onSeek"
                        :max="audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : 100"
                        :step="0.1" :disabled="!audioPlayer.duration || !isFinite(audioPlayer.duration)"
                        class="w-full" />
                </div>

                <!-- Controls -->
                <div class="flex items-center justify-between">
                    <!-- Play/Pause Button -->
                    <div class="flex items-center gap-2">
                        <Button @click="togglePlayPause" :icon="audioPlayer.isPlaying ? 'pi pi-pause' : 'pi pi-play'"
                            rounded :severity="audioPlayer.isPlaying ? 'info' : 'success'" size="large"
                            :loading="audioPlayer.loading" />

                        <span class="text-xs text-zinc-600 dark:text-zinc-400">
                            {{ audioPlayer.isPlaying ? 'Reproduciendo' : 'Pausado' }}
                        </span>
                    </div>

                    <!-- Volume Control -->
                    <div class="flex items-center gap-2 w-32">
                        <i class="pi pi-volume-down text-zinc-500 dark:text-zinc-400 text-sm"></i>
                        <Slider :model-value="narratorConfig.volume" @update:model-value="onVolumeChange" :min="0"
                            :max="1" :step="0.1" class="flex-1" />
                        <i class="pi pi-volume-up text-zinc-500 dark:text-zinc-400 text-sm"></i>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { Button, Slider } from 'primevue';
import { computed, watch, ref } from 'vue';
import useHome from '../modules/home/hooks/useHome';

const {
    audioPlayer,
    narratorConfig,
    togglePlayPause,
    stopAudio,
    seekAudio,
    setVolume
} = useHome();

const currentTime = ref(0);

// Sincronizar currentTime con el reproductor
watch(() => audioPlayer.value.currentTime, (newVal) => {
    if (isFinite(newVal) && !isNaN(newVal)) {
        currentTime.value = newVal;
    }
});

// Resetear currentTime cuando cambia el audio
watch(() => audioPlayer.value.audio, (newAudio) => {
    if (!newAudio) {
        currentTime.value = 0;
    }
});

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const onSeek = (value) => {
    // Validar que el valor sea finito y válido antes de buscar
    if (value != null && isFinite(value) && !isNaN(value)) {
        seekAudio(value);
    }
};

const onVolumeChange = (value) => {
    if (value != null && isFinite(value) && !isNaN(value)) {
        setVolume(value);
    }
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
    transform: translateY(0);
    opacity: 1;
}
</style>
