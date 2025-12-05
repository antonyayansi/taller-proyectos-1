<script setup>
import { ref, computed } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { Button } from 'primevue';
import { analyzeImageTouristPlace, textToSpeech } from '@/services/openai';
import useHome from '@/app/modules/home/hooks/useHome';
import { toast } from 'vue-sonner';
import { useDark } from '@vueuse/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const { playAudio } = useHome();
const isDark = useDark();

const imagePreview = ref(null);
const markdownResult = ref('');
const isAnalyzing = ref(false);
const isNarrating = ref(false);
const currentImageHash = ref(null);
const currentImageFile = ref(null);

// Caché de resultados por hash de imagen
const imageCache = ref(JSON.parse(localStorage.getItem('imageAnalysisCache') || '{}'));

// Capturar imagen desde la cámara nativa
const captureImage = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera // Solo cámara, no galería
    });

    // Mostrar preview
    imagePreview.value = `data:image/${photo.format};base64,${photo.base64String}`;

    // Crear un File object simulado para el análisis
    const base64Response = await fetch(`data:image/${photo.format};base64,${photo.base64String}`);
    const blob = await base64Response.blob();
    const file = new File([blob], `photo_${Date.now()}.${photo.format}`, { 
      type: `image/${photo.format}` 
    });
    
    currentImageFile.value = file;

    // Analizar imagen
    await analyzeImage(file, photo.base64String);
  } catch (error) {
    if (error.message !== 'User cancelled photos app') {
      console.error('Error al capturar imagen:', error);
      toast.error('Error al abrir la cámara', {
        description: error.message
      });
    }
  }
};

// Abrir galería para seleccionar imagen
const selectFromGallery = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos // Solo galería
    });

    // Mostrar preview
    imagePreview.value = `data:image/${photo.format};base64,${photo.base64String}`;

    // Crear un File object simulado
    const base64Response = await fetch(`data:image/${photo.format};base64,${photo.base64String}`);
    const blob = await base64Response.blob();
    const file = new File([blob], `photo_${Date.now()}.${photo.format}`, { 
      type: `image/${photo.format}` 
    });
    
    currentImageFile.value = file;

    // Analizar imagen
    await analyzeImage(file, photo.base64String);
  } catch (error) {
    if (error.message !== 'User cancelled photos app') {
      console.error('Error al seleccionar imagen:', error);
      toast.error('Error al abrir galería', {
        description: error.message
      });
    }
  }
};

// Analizar imagen con OpenAI Vision
const analyzeImage = async (file, base64String = null) => {
  isAnalyzing.value = true;
  markdownResult.value = '';

  try {
    // Generar hash de la imagen
    const imageHash = await generateImageHash(file);
    currentImageHash.value = imageHash;

    // Verificar si ya existe en caché
    if (imageCache.value[imageHash]) {
      markdownResult.value = imageCache.value[imageHash];
      toast.success('Resultado cargado desde caché', {
        description: 'Esta imagen ya fue analizada anteriormente'
      });
      isAnalyzing.value = false;
      return;
    }

    toast.info('Analizando imagen...', { duration: 2000 });

    // Si ya tenemos el base64, usarlo; si no, convertir
    let base64Data;
    if (base64String) {
      base64Data = base64String;
    } else {
      const base64 = await fileToBase64(file);
      base64Data = base64.split(',')[1]; // Remover el prefijo data:image/...
    }

    // Llamar a OpenAI
    const result = await analyzeImageTouristPlace(base64Data);
    markdownResult.value = result;

    // Guardar en caché
    imageCache.value[imageHash] = result;
    localStorage.setItem('imageAnalysisCache', JSON.stringify(imageCache.value));

    toast.success('¡Imagen analizada correctamente!');
  } catch (error) {
    console.error('Error al analizar:', error);
    toast.error('Error al analizar la imagen. Verifica tu conexión y API key.');
    markdownResult.value = '# Error\n\nNo se pudo analizar la imagen. Por favor intenta nuevamente.';
  } finally {
    isAnalyzing.value = false;
  }
};

// Convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Generar hash simple de una imagen para caché
const generateImageHash = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
  } catch (error) {
    // Fallback: usar nombre + tamaño + tipo
    return `${file.name}_${file.size}_${file.type}`.replace(/[^a-zA-Z0-9]/g, '_');
  }
};

// Narrar el resultado
const narrateResult = async () => {
  if (!markdownResult.value) {
    toast.warning('No hay contenido para narrar');
    return;
  }

  isNarrating.value = true;

  try {
    toast.info('Generando audio...', { duration: 2000 });

    // Limpiar el markdown para el audio (remover caracteres de formato)
    const cleanText = markdownResult.value
      .replace(/[#*\-_`]/g, '')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, ' ')
      .trim();

    // Generar audio con OpenAI TTS
    const audioBlob = await textToSpeech(cleanText);

    // Reproducir audio usando el sistema existente
    playAudio(audioBlob, 'Narración del lugar turístico');

    toast.success('¡Reproduciendo narración!');
  } catch (error) {
    console.error('Error al narrar:', error);
    toast.error('Error al generar la narración. Intenta nuevamente.');
  } finally {
    isNarrating.value = false;
  }
};

// Limpiar y reiniciar
const reset = () => {
  imagePreview.value = null;
  markdownResult.value = '';
  currentImageHash.value = null;
  currentImageFile.value = null;
};

// Limpiar caché
const clearCache = () => {
  imageCache.value = {};
  localStorage.removeItem('imageAnalysisCache');
  toast.success('Caché limpiado exitosamente');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 pt-6">
        <h1 class="text-4xl font-bold text-zinc-800 dark:text-white mb-2">
          🏛️ Descubre Lugares
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400">
          Toma una foto y descubre información sobre lugares turísticos
        </p>
      </div>

      <!-- Camera/Upload Section -->
      <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 mb-6">
        <div v-if="!imagePreview" class="text-center py-12">
          <div class="mb-6">
            <i class="pi pi-camera text-6xl text-blue-500"></i>
          </div>
          <h2 class="text-xl font-semibold text-zinc-800 dark:text-white mb-4">
            Captura o selecciona una imagen
          </h2>
          <div class="flex gap-2 justify-center flex-wrap">
            <Button
              @click="captureImage"
              label="Abrir Cámara"
              icon="pi pi-camera"
              :loading="isAnalyzing"
            />
            <Button
              @click="selectFromGallery"
              label="Galería"
              icon="pi pi-images"
              severity="secondary"
              outlined
              :loading="isAnalyzing"
            />
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="relative rounded-xl overflow-hidden">
            <img
              :src="imagePreview"
              alt="Preview"
              class="w-full h-auto max-h-96 object-contain bg-zinc-100 dark:bg-zinc-700"
            />
            <Button
              @click="reset"
              icon="pi pi-times"
              rounded
              severity="danger"
              class="absolute top-4 right-4"
              v-tooltip.left="'Cambiar imagen'"
            />
          </div>

          <div class="flex justify-center gap-2">
            <Button
              @click="captureImage"
              label="Nueva Foto"
              icon="pi pi-camera"
              severity="secondary"
              outlined
            />
            <Button
              @click="selectFromGallery"
              label="Galería"
              icon="pi pi-images"
              severity="secondary"
              outlined
            />
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="markdownResult" class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold text-zinc-800 dark:text-white">
              📖 Información del Lugar
            </h2>
            <span v-if="imageCache[currentImageHash]" 
                  class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                  v-tooltip.top="'Este resultado fue cargado desde caché'">
              <i class="pi pi-check-circle"></i> Caché
            </span>
          </div>
          <Button
            @click="narrateResult"
            label="Narrar"
            icon="pi pi-volume-up"
            severity="success"
            :loading="isNarrating"
            v-tooltip.top="'Escuchar narración'"
          />
        </div>

        <div class="prose dark:prose-invert max-w-none">
          <MdPreview
            :modelValue="markdownResult"
            language="es-ES"
            :theme="isDark ? 'dark' : 'light'"
            class="bg-transparent"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isAnalyzing" class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-12 text-center">
        <i class="pi pi-spin pi-spinner text-5xl text-blue-500 mb-4"></i>
        <p class="text-lg text-zinc-600 dark:text-zinc-400">
          Analizando imagen con IA...
        </p>
      </div>

      <!-- Instructions -->
      <div v-if="!imagePreview && !isAnalyzing" class="space-y-4">
        <div class="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-6">
          <h3 class="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
            <i class="pi pi-info-circle"></i>
            ¿Cómo funciona?
          </h3>
          <ul class="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
            <li class="flex items-start gap-2">
              <i class="pi pi-check-circle mt-1"></i>
              <span>Toma una foto de un lugar turístico o monumento</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="pi pi-check-circle mt-1"></i>
              <span>La IA analizará la imagen y te dará información detallada</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="pi pi-check-circle mt-1"></i>
              <span>Puedes escuchar la narración del lugar con un solo clic</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="pi pi-check-circle mt-1"></i>
              <span>Los resultados se guardan en caché para ahorrar análisis</span>
            </li>
          </ul>
        </div>

        <!-- Cache Info -->
        <div v-if="Object.keys(imageCache).length > 0" 
             class="bg-zinc-100 dark:bg-zinc-700/50 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="pi pi-database text-zinc-600 dark:text-zinc-400 text-xl"></i>
            <div>
              <p class="text-sm font-semibold text-zinc-800 dark:text-white">
                Caché de análisis
              </p>
              <p class="text-xs text-zinc-600 dark:text-zinc-400">
                {{ Object.keys(imageCache).length }} imagen{{ Object.keys(imageCache).length !== 1 ? 'es' : '' }} guardada{{ Object.keys(imageCache).length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
          <Button
            @click="clearCache"
            label="Limpiar"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            outlined
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos personalizados para el markdown preview */
:deep(.md-editor-preview-wrapper) {
  padding: 0;
  background: transparent;
}

:deep(.md-editor-preview) {
  color: inherit;
}
</style>