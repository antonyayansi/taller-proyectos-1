<template>
    <!-- Botón flotante para abrir el asistente -->
    <Transition name="fade">
        <div v-if="!isOpen && showButton" @click="toggleAssistant"
            class="fixed bottom-40 right-4 z-9999 cursor-pointer group">
            <div
                class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <i class="pi pi-comments text-white text-xl"></i>
            </div>
            <!-- Tooltip -->
            <div
                class="absolute bottom-full right-0 mb-2 px-3 py-1 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Asistente IA
            </div>
        </div>
    </Transition>

    <!-- Panel del Asistente -->
    <Transition name="slide-up">
        <div v-if="isOpen"
            class="fixed bottom-0 left-0 right-0 z-9999 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl border-t border-zinc-200 dark:border-zinc-700 max-h-[80vh] flex flex-col">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <i class="pi pi-sparkles text-white"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Asistente IA</h3>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Tu guía turístico virtual</p>
                    </div>
                </div>
                <Button @click="toggleAssistant" icon="pi pi-times" text rounded severity="secondary" />
            </div>

            <!-- Chat Messages -->
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
                <!-- Mensaje de bienvenida -->
                <div v-if="messages.length === 0" class="text-center py-8">
                    <i class="pi pi-comments text-6xl text-zinc-300 dark:text-zinc-600 mb-4"></i>
                    <p class="text-zinc-600 dark:text-zinc-400 mb-2">¡Hola! Soy tu guía turístico virtual</p>
                    <p class="text-sm text-zinc-500 dark:text-zinc-500">
                        Pregúntame sobre {{ sitioContext?.nombre || 'los lugares turísticos' }}
                    </p>
                </div>

                <!-- Mensajes -->
                <div v-for="(msg, index) in messages" :key="index"
                    :class="['flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']">
                    <!-- Avatar -->
                    <div
                        :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', msg.role === 'user' ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-600']">
                        <i :class="msg.role === 'user' ? 'pi pi-user' : 'pi pi-sparkles'"
                            class="text-white text-sm"></i>
                    </div>

                    <!-- Mensaje -->
                    <div
                        :class="['max-w-[75%] rounded-2xl px-4 py-3', msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white']">
                        <p class="text-sm leading-relaxed">{{ msg.content }}</p>
                        
                        <!-- Botón para reproducir audio de respuesta del asistente -->
                        <div v-if="msg.role === 'assistant'" class="mt-2 flex gap-2">
                            <Button @click="playMessageAudio(msg.content)" icon="pi pi-volume-up" text size="small"
                                severity="secondary" v-tooltip.top="'Escuchar respuesta'" />
                        </div>
                    </div>
                </div>

                <!-- Mensaje de carga -->
                <div v-if="isThinking" class="flex gap-3">
                    <div
                        class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <i class="pi pi-sparkles text-white text-sm"></i>
                    </div>
                    <div class="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3">
                        <div class="flex gap-1">
                            <div class="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                                style="animation-delay: 0s"></div>
                            <div class="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                                style="animation-delay: 0.2s"></div>
                            <div class="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                                style="animation-delay: 0.4s"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 border-t border-zinc-200 dark:border-zinc-700">
                <div class="flex gap-2 mb-2" v-if="transcription">
                    <div class="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                        <p class="text-sm text-blue-600 dark:text-blue-400">{{ transcription }}</p>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <!-- Botón de voz -->
                    <Button @click="toggleVoiceRecording"
                        :icon="isRecording ? 'pi pi-stop' : 'pi pi-microphone'"
                        :severity="isRecording ? 'danger' : 'info'" rounded
                        :class="{ 'animate-pulse': isRecording }" v-tooltip.top="'Preguntar por voz'" />

                    <!-- Input de texto -->
                    <InputText v-model="userInput" @keyup.enter="sendMessage" placeholder="Escribe tu pregunta..."
                        class="flex-1" :disabled="isThinking || isRecording" />

                    <!-- Botón enviar -->
                    <Button @click="sendMessage" icon="pi pi-send" :disabled="!userInput.trim() || isThinking"
                        :loading="isThinking" />
                </div>

                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                    Pregunta por voz o escribe tu consulta
                </p>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { Button, InputText } from 'primevue';
import { toast } from 'vue-sonner';
import { askDeepSeek, getErrorMessage } from '@/services/deepseek';
import useSitios from '../modules/home/hooks/useSitios';

const props = defineProps({
    sitioContext: {
        type: Object,
        default: null
    },
    showButton: {
        type: Boolean,
        default: true
    }
});

const {
    textToSpeech
} = useSitios();

const isOpen = ref(false);
const isRecording = ref(false);
const isThinking = ref(false);
const userInput = ref('');
const transcription = ref('');
const messages = ref([]);
const chatContainer = ref(null);

// Soporte de reconocimiento de voz
let recognition = null;
let mediaRecorder = null;

// Inicializar reconocimiento de voz
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcription.value = transcript;
        userInput.value = transcript;
        isRecording.value = false;
        
        // Enviar automáticamente después de la transcripción
        setTimeout(() => {
            sendMessage();
        }, 500);
    };

    recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        isRecording.value = false;
        
        if (event.error === 'no-speech') {
            toast.error('No se detectó ninguna voz');
        } else if (event.error === 'not-allowed') {
            toast.error('Permiso de micrófono denegado');
        } else {
            toast.error('Error en el reconocimiento de voz');
        }
    };

    recognition.onend = () => {
        isRecording.value = false;
    };
}

const toggleAssistant = () => {
    isOpen.value = !isOpen.value;
    
    if (isOpen.value && messages.value.length === 0) {
        // Mensaje de bienvenida opcional
        // messages.value.push({
        //     role: 'assistant',
        //     content: `¡Hola! Estoy aquí para ayudarte con información sobre ${props.sitioContext?.nombre || 'los lugares turísticos'}. ¿Qué te gustaría saber?`
        // });
    }
};

const toggleVoiceRecording = () => {
    if (!recognition) {
        toast.error('El reconocimiento de voz no está disponible en este dispositivo');
        return;
    }

    if (isRecording.value) {
        recognition.stop();
        isRecording.value = false;
    } else {
        transcription.value = '';
        userInput.value = '';
        isRecording.value = true;
        
        try {
            recognition.start();
            toast.info('Escuchando... Habla ahora');
        } catch (error) {
            console.error('Error al iniciar reconocimiento:', error);
            isRecording.value = false;
            toast.error('Error al iniciar el micrófono');
        }
    }
};

const sendMessage = async () => {
    const message = userInput.value.trim();
    if (!message || isThinking.value) return;

    // Agregar mensaje del usuario
    messages.value.push({
        role: 'user',
        content: message
    });

    userInput.value = '';
    transcription.value = '';
    isThinking.value = true;

    // Scroll al final
    await nextTick();
    scrollToBottom();

    try {
        // Preparar contexto
        const context = {
            sitio: props.sitioContext,
            ubicacion: {
                lat: props.sitioContext?.lat,
                lng: props.sitioContext?.lng
            }
        };

        // Obtener respuesta de DeepSeek
        const response = await askDeepSeek(message, context);

        // Agregar respuesta del asistente
        messages.value.push({
            role: 'assistant',
            content: response
        });

        // Reproducir respuesta en audio automáticamente
        await playMessageAudio(response);

        // Scroll al final
        await nextTick();
        scrollToBottom();
    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        const errorMsg = getErrorMessage(error);
        
        messages.value.push({
            role: 'assistant',
            content: errorMsg
        });

        toast.error(errorMsg);
    } finally {
        isThinking.value = false;
    }
};

const playMessageAudio = async (text) => {
    try {
        await textToSpeech(text, 'Respuesta del Asistente');
    } catch (error) {
        console.error('Error al reproducir audio:', error);
    }
};

const scrollToBottom = () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

// Limpiar al desmontar
watch(isOpen, (newValue) => {
    if (!newValue && isRecording.value) {
        recognition?.stop();
        isRecording.value = false;
    }
});
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #4a5568;
}
</style>
