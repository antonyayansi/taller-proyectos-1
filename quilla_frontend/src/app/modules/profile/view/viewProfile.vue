<script setup>
import NarratorConfig from '../components/NarratorConfig.vue'
import { ref, onMounted } from 'vue'

// Estado del modo oscuro
const isDarkMode = ref(false)

// Función para alternar modo oscuro
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

// Cargar preferencia de tema al montar
onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDarkMode.value = true
        document.documentElement.classList.add('dark')
    } else {
        isDarkMode.value = false
        document.documentElement.classList.remove('dark')
    }
})
</script>

<template>
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8  ">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white flex items-center">
                            <svg class="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Configuración de Perfil
                        </h1>
                        <p class="text-zinc-600 dark:text-zinc-300 mt-2">Personaliza tu experiencia en el centro
                            turístico</p>
                    </div>

                    <!-- Toggle de modo oscuro -->
                    <button @click="toggleDarkMode"
                        class="relative inline-flex items-center p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600   "
                        :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
                        <!-- Icono sol (modo claro) -->
                        <svg v-if="!isDarkMode" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                            </path>
                        </svg>

                        <!-- Icono luna (modo oscuro) -->
                        <svg v-else class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Configuración del Narrador -->
            <NarratorConfig />

            <!-- Otras configuraciones pueden ir aquí -->
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md dark:shadow-zinc-900/30 p-6  ">
                <h2 class="text-xl font-bold text-zinc-800 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                        </path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Configuraciones Generales
                </h2>
                <div class="space-y-4">
                    <p class="text-zinc-600 dark:text-zinc-300">Próximamente: Más opciones de personalización</p>

                    <!-- Información del tema actual -->
                    <div class="p-4 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full mr-3"
                                :class="isDarkMode ? 'bg-blue-400' : 'bg-yellow-400'"></div>
                            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                Tema actual: {{ isDarkMode ? 'Modo Oscuro' : 'Modo Claro' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>