<template>
    <div
        class="bg-white dark:bg-zinc-800 rounded-lg shadow-md dark:shadow-zinc-900/30 p-6 mb-6 transition-colors duration-300">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-zinc-800 dark:text-white flex items-center">
                <svg class="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.536 7.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 7h4l2-2h3a2 2 0 012 2v4.586">
                    </path>
                </svg>
                Configuración del Narrador
            </h2>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="localConfig.enabled" class="sr-only peer" @change="updateConfig">
                <div
                    class="w-11 h-6 bg-zinc-200 dark:bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 dark:after:border-zinc-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500">
                </div>
                <span class="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {{ localConfig.enabled ? 'Activado' : 'Desactivado' }}
                </span>
            </label>
        </div>

        <div v-if="localConfig.enabled" class="space-y-6">
            <!-- Idioma y Voz -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                        Idioma
                    </label>
                    <select v-model="localConfig.language" @change="onLanguageChange"
                        class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200">
                        <option value="es-US">Español (Estados Unidos)</option>
                        <option value="es-ES">Español (España)</option>
                        <option value="es-MX">Español (México)</option>
                        <option value="en-US">Inglés (Estados Unidos)</option>
                        <option value="en-GB">Inglés (Reino Unido)</option>
                        <option value="fr-FR">Francés</option>
                        <option value="de-DE">Alemán</option>
                        <option value="it-IT">Italiano</option>
                        <option value="pt-BR">Portugués (Brasil)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                        Tipo de Voz
                    </label>
                    <select v-model="localConfig.voice" @change="updateConfig"
                        class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200">
                        <option v-for="voice in availableVoices" :key="voice.value" :value="voice.value">
                            {{ voice.label }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Controles de Audio -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                        Velocidad: {{ localConfig.speakingRate }}x
                    </label>
                    <input type="range" v-model.number="localConfig.speakingRate" @input="updateConfig" min="0.25"
                        max="2.0" step="0.1"
                        class="w-full h-2 bg-zinc-200 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer slider">
                    <div class="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        <span>Lento</span>
                        <span>Rápido</span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                        Tono: {{ localConfig.pitch > 0 ? '+' : '' }}{{ localConfig.pitch }}
                    </label>
                    <input type="range" v-model.number="localConfig.pitch" @input="updateConfig" min="-10" max="10"
                        step="0.5"
                        class="w-full h-2 bg-zinc-200 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer slider">
                    <div class="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        <span>Grave</span>
                        <span>Agudo</span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                        Volumen: {{ Math.round(localConfig.volume * 100) }}%
                    </label>
                    <input type="range" v-model.number="localConfig.volume" @input="updateConfig" min="0.1" max="1.0"
                        step="0.1"
                        class="w-full h-2 bg-zinc-200 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer slider">
                    <div class="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        <span>Bajo</span>
                        <span>Alto</span>
                    </div>
                </div>
            </div>

            <!-- Perfil de Efectos -->
            <div>
                <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
                    Perfil de Audio
                </label>
                <select v-model="localConfig.effectsProfile" @change="updateConfig"
                    class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200">
                    <option value="small-bluetooth-speaker-class-device">Altavoz Bluetooth Pequeño</option>
                    <option value="medium-bluetooth-speaker-class-device">Altavoz Bluetooth Mediano</option>
                    <option value="large-home-entertainment-class-device">Sistema de Entretenimiento</option>
                    <option value="large-automotive-class-device">Audio Automotriz</option>
                    <option value="headphone-class-device">Auriculares</option>
                    <option value="handset-class-device">Teléfono</option>
                </select>
            </div>

            <!-- Botones de Prueba y Reset -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-600">
                <button @click="testVoice" :disabled="isTesting"
                    class="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-green-400 dark:disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                    <svg v-if="!isTesting" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                        </path>
                    </svg>
                    <div v-else
                        class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {{ isTesting ? 'Probando...' : 'Probar Voz' }}
                </button>

                <button @click="resetConfig"
                    class="flex-1 bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-500 dark:hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
                    </svg>
                    Restablecer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { home } from '@/app/modules/home/store/home'

const homeStore = home()
const isTesting = ref(false)

// Configuración local reactiva
const localConfig = ref({
    enabled: true,
    voice: 'es-US-Neural2-B',
    language: 'es-US',
    pitch: 0,
    speakingRate: 1.0,
    volume: 0.8,
    effectsProfile: 'small-bluetooth-speaker-class-device'
})

// Voces disponibles por idioma
const voicesByLanguage = {
    'es-US': [
        { value: 'es-US-Neural2-A', label: 'Femenina Neural A' },
        { value: 'es-US-Neural2-B', label: 'Masculina Neural B' },
        { value: 'es-US-Neural2-C', label: 'Femenina Neural C' },
        { value: 'es-US-Standard-A', label: 'Femenina Estándar A' },
        { value: 'es-US-Standard-B', label: 'Masculina Estándar B' },
        { value: 'es-US-Standard-C', label: 'Femenina Estándar C' }
    ],
    'es-ES': [
        { value: 'es-ES-Neural2-A', label: 'Femenina Neural A' },
        { value: 'es-ES-Neural2-B', label: 'Masculina Neural B' },
        { value: 'es-ES-Neural2-C', label: 'Femenina Neural C' },
        { value: 'es-ES-Standard-A', label: 'Femenina Estándar A' }
    ],
    'es-MX': [
        { value: 'es-MX-Neural2-A', label: 'Femenina Neural A' },
        { value: 'es-MX-Neural2-B', label: 'Masculina Neural B' },
        { value: 'es-MX-Neural2-C', label: 'Femenina Neural C' }
    ],
    'en-US': [
        { value: 'en-US-Neural2-A', label: 'Female Neural A' },
        { value: 'en-US-Neural2-C', label: 'Female Neural C' },
        { value: 'en-US-Neural2-D', label: 'Male Neural D' },
        { value: 'en-US-Neural2-E', label: 'Female Neural E' }
    ],
    'en-GB': [
        { value: 'en-GB-Neural2-A', label: 'Female Neural A' },
        { value: 'en-GB-Neural2-B', label: 'Male Neural B' },
        { value: 'en-GB-Neural2-C', label: 'Female Neural C' }
    ],
    'fr-FR': [
        { value: 'fr-FR-Neural2-A', label: 'Féminine Neural A' },
        { value: 'fr-FR-Neural2-B', label: 'Masculine Neural B' },
        { value: 'fr-FR-Neural2-C', label: 'Féminine Neural C' }
    ],
    'de-DE': [
        { value: 'de-DE-Neural2-A', label: 'Weiblich Neural A' },
        { value: 'de-DE-Neural2-B', label: 'Männlich Neural B' },
        { value: 'de-DE-Neural2-C', label: 'Weiblich Neural C' }
    ],
    'it-IT': [
        { value: 'it-IT-Neural2-A', label: 'Femminile Neural A' },
        { value: 'it-IT-Neural2-C', label: 'Maschile Neural C' }
    ],
    'pt-BR': [
        { value: 'pt-BR-Neural2-A', label: 'Feminina Neural A' },
        { value: 'pt-BR-Neural2-B', label: 'Masculina Neural B' },
        { value: 'pt-BR-Neural2-C', label: 'Feminina Neural C' }
    ]
}

// Voces disponibles para el idioma seleccionado
const availableVoices = computed(() => {
    return voicesByLanguage[localConfig.value.language] || []
})

// Cargar configuración al montar el componente
onMounted(() => {
    homeStore.loadNarratorConfig()
    localConfig.value = { ...homeStore.narratorConfig }
})

// Actualizar configuración
const updateConfig = () => {
    homeStore.updateNarratorConfig(localConfig.value)
}

// Cambio de idioma
const onLanguageChange = () => {
    const voices = availableVoices.value
    if (voices.length > 0) {
        localConfig.value.voice = voices[0].value
    }
    updateConfig()
}

// Probar voz
const testVoice = async () => {
    if (isTesting.value) return

    isTesting.value = true
    try {
        const testText = getTestText(localConfig.value.language)
        await textToSpeech(testText)
    } catch (error) {
        console.error('Error al probar la voz:', error)
    } finally {
        isTesting.value = false
    }
}

// Texto de prueba por idioma
const getTestText = (language) => {
    const testTexts = {
        'es-US': 'Bienvenido al centro turístico de Cusco. Esta es una prueba de la configuración de voz del narrador.',
        'es-ES': 'Bienvenido al centro turístico de Cusco. Esta es una prueba de la configuración de voz del narrador.',
        'es-MX': 'Bienvenido al centro turístico de Cusco. Esta es una prueba de la configuración de voz del narrador.',
        'en-US': 'Welcome to the tourist center of Cusco. This is a test of the narrator voice configuration.',
        'en-GB': 'Welcome to the tourist centre of Cusco. This is a test of the narrator voice configuration.',
        'fr-FR': 'Bienvenue au centre touristique de Cusco. Ceci est un test de la configuration de la voix du narrateur.',
        'de-DE': 'Willkommen im Touristenzentrum von Cusco. Dies ist ein Test der Erzählerstimmen-Konfiguration.',
        'it-IT': 'Benvenuti al centro turistico di Cusco. Questo è un test della configurazione della voce del narratore.',
        'pt-BR': 'Bem-vindos ao centro turístico de Cusco. Este é um teste da configuração de voz do narrador.'
    }
    return testTexts[language] || testTexts['es-US']
}

// Función de text-to-speech
const textToSpeech = async (text) => {
    try {
        const apiKey = "AIzaSyClgb1ViE6cjIMaDTobCLHxUcJk6AutcLk"
        const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`

        const payload = {
            "audioConfig": {
                "audioEncoding": "MP3",
                "effectsProfileId": [localConfig.value.effectsProfile],
                "pitch": localConfig.value.pitch,
                "speakingRate": localConfig.value.speakingRate
            },
            "input": {
                "text": text
            },
            "voice": {
                "languageCode": localConfig.value.language,
                "name": localConfig.value.voice
            }
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error('Error en la solicitud de text-to-speech')
        }

        const result = await response.json()
        const audioBytes = result.audioContent
        const audioBlob = new Blob([Uint8Array.from(atob(audioBytes), c => c.charCodeAt(0))], {
            type: 'audio/mp3'
        })

        const audio = new Audio(URL.createObjectURL(audioBlob))
        audio.volume = localConfig.value.volume
        audio.play()
    } catch (error) {
        console.error('Error en textToSpeech:', error)
        throw error
    }
}

// Restablecer configuración
const resetConfig = () => {
    homeStore.resetNarratorConfig()
    localConfig.value = { ...homeStore.narratorConfig }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
    background: #2563EB;
}

.dark .slider::-webkit-slider-thumb {
    background: #60A5FA;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.dark .slider::-webkit-slider-thumb:hover {
    background: #93C5FD;
}

.slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease;
}

.slider::-moz-range-thumb:hover {
    background: #2563EB;
}

.dark .slider::-moz-range-thumb {
    background: #60A5FA;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.dark .slider::-moz-range-thumb:hover {
    background: #93C5FD;
}

/* Estilos adicionales para el track en modo oscuro */
.dark .slider::-webkit-slider-track {
    background: #4B5563;
}

.dark .slider::-moz-range-track {
    background: #4B5563;
}
</style>