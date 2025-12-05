<script setup>
import { ref, onMounted, computed } from 'vue'
import { Geolocation } from '@capacitor/geolocation'
import useTops from '../hooks/useTops'
import { uploadPostImage } from '@/services/upload'
import { auth } from '@/app/modules/auth/store/auth'
import { toast } from 'vue-sonner'
import {
  Button,
  Textarea,
  FileUpload,
  Card,
  Avatar,
  Dialog
} from 'primevue'

const authStore = auth()

const {
  posts,
  loading,
  fetchPosts,
  createPost,
  toggleLike,
  deletePost,
  hasLiked
} = useTops()

// Estado del formulario
const newPostText = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)
const isSubmitting = ref(false)
const currentLocation = ref(null)

// Modal de confirmación
const showDeleteDialog = ref(false)
const postToDelete = ref(null)

// Capturar ubicación actual
const captureLocation = async () => {
  try {
    const position = await Geolocation.getCurrentPosition()
    currentLocation.value = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    toast.success('Ubicación capturada')
  } catch (error) {
    console.error('Error getting location:', error)
    toast.error('No se pudo obtener la ubicación')
  }
}

// Manejar selección de imagen
const onImageSelect = (event) => {
  const file = event.files[0]
  if (file) {
    selectedImage.value = file
    
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Remover imagen seleccionada
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
}

// Validar formulario
const canSubmit = computed(() => {
  return (newPostText.value.trim().length > 0 || selectedImage.value) && !isSubmitting.value
})

// Publicar nuevo post
const handleSubmit = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true

  try {
    let imageUrl = null

    // Si hay imagen, subir directamente sin comprimir
    if (selectedImage.value) {
      console.log('📸 Iniciando subida de imagen...', {
        name: selectedImage.value.name,
        type: selectedImage.value.type,
        size: selectedImage.value.size
      })
      
      toast.info('Subiendo imagen a AWS...')
      imageUrl = await uploadPostImage(selectedImage.value)

      if (!imageUrl) {
        throw new Error('Error al subir la imagen')
      }
      
      console.log('🎉 Imagen subida exitosamente:', imageUrl)
      toast.success('Imagen subida correctamente')
    }

    // Crear publicación
    const postData = {
      texto: newPostText.value.trim(),
      imagen: imageUrl,
      ubicacion: currentLocation.value ? JSON.stringify(currentLocation.value) : null
    }

    console.log('📝 Creando publicación con datos:', postData)
    await createPost(postData)

    // Limpiar formulario
    newPostText.value = ''
    selectedImage.value = null
    imagePreview.value = null
    currentLocation.value = null
  } catch (error) {
    console.error('❌ Error creating post:', error)
    toast.error(error.message || 'Error al crear la publicación')
  } finally {
    isSubmitting.value = false
  }
}

// Confirmar eliminación
const confirmDelete = (post) => {
  postToDelete.value = post
  showDeleteDialog.value = true
}

// Eliminar post
const handleDelete = async () => {
  if (postToDelete.value) {
    await deletePost(postToDelete.value.id)
    showDeleteDialog.value = false
    postToDelete.value = null
  }
}

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  } else if (days > 0) {
    return `Hace ${days} día${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  } else {
    return 'Hace un momento'
  }
}

// Verificar si el post es del usuario actual
const isMyPost = (post) => {
  return post.users_id === authStore.user?.id
}

onMounted(async () => {
  await authStore.getUser()
  await fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-6 px-4">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Formulario de nueva publicación -->
      <Card class="shadow-xl border-0 overflow-hidden">
        <template #title>
          <div class="flex items-center space-x-3 pb-4">
            <Avatar 
              :label="authStore.user?.email?.charAt(0).toUpperCase()" 
              shape="circle" 
              class="bg-gradient-to-br from-purple-500 to-pink-500 text-white"
              size="large"
            />
            <div>
              <h2 class="text-xl font-bold text-zinc-800 dark:text-white">Comparte tu experiencia</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">¿Qué lugar increíble descubriste hoy?</p>
            </div>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <!-- Textarea -->
            <Textarea
              v-model="newPostText"
              placeholder="Cuéntanos sobre tu aventura turística..."
              rows="4"
              class="w-full resize-none text-lg"
              :maxlength="500"
            />

            <!-- Preview de imagen -->
            <div v-if="imagePreview" class="relative rounded-xl overflow-hidden">
              <img :src="imagePreview" alt="Preview" class="w-full max-h-96 object-cover" />
              <button
                @click="removeImage"
                class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Contador de caracteres -->
            <div class="flex justify-between items-center text-sm text-zinc-500">
              <span>{{ newPostText.length }}/500 caracteres</span>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <div class="flex items-center space-x-2">
                <!-- Subir imagen -->
                <FileUpload
                  mode="basic"
                  accept="image/*"
                  :maxFileSize="5000000"
                  @select="onImageSelect"
                  chooseLabel=""
                  :auto="false"
                  customUpload
                  class="p-0"
                >
                  <template #uploadicon>
                    <Button
                      icon="pi pi-image"
                      severity="secondary"
                      text
                      rounded
                      v-tooltip.top="'Agregar imagen'"
                    />
                  </template>
                </FileUpload>

                <!-- Capturar ubicación -->
                <Button
                  icon="pi pi-map-marker"
                  :severity="currentLocation ? 'success' : 'secondary'"
                  text
                  rounded
                  @click="captureLocation"
                  v-tooltip.top="'Agregar ubicación'"
                />
              </div>

              <!-- Botón publicar -->
              <Button
                label="Publicar"
                icon="pi pi-send"
                :disabled="!canSubmit"
                :loading="isSubmitting"
                @click="handleSubmit"
                class="px-6"
                severity="primary"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-purple-500"></i>
      </div>

      <!-- Feed de publicaciones -->
      <div v-else class="space-y-4">
        <div v-if="posts.length === 0" class="text-center py-12">
          <i class="pi pi-inbox text-6xl text-zinc-300 dark:text-zinc-600 mb-4"></i>
          <p class="text-zinc-500 dark:text-zinc-400 text-lg">No hay publicaciones aún</p>
          <p class="text-zinc-400 dark:text-zinc-500 text-sm">¡Sé el primero en compartir!</p>
        </div>

        <Card
          v-for="post in posts"
          :key="post.id"
          class="shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
        >
          <template #content>
            <div class="space-y-4">
              <!-- Header del post -->
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <Avatar
                    icon="pi pi-user"
                    shape="circle"
                    class="bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                  />
                  <div>
                    <p class="font-semibold text-zinc-800 dark:text-white">Usuario</p>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ formatDate(post.created_at) }}</p>
                  </div>
                </div>

                <!-- Botón eliminar (solo si es tu post) -->
                <Button
                  v-if="isMyPost(post)"
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  @click="confirmDelete(post)"
                  v-tooltip.top="'Eliminar'"
                />
              </div>

              <!-- Texto del post -->
              <p v-if="post.texto" class="text-zinc-700 dark:text-zinc-200 text-lg leading-relaxed">
                {{ post.texto }}
              </p>

              <!-- Imagen del post -->
              <div v-if="post.imagen" class="rounded-xl overflow-hidden -mx-6">
                <img
                  :src="post.imagen"
                  :alt="post.texto"
                  class="w-full max-h-[500px] object-cover"
                />
              </div>

              <!-- Ubicación -->
              <div v-if="post.ubicacion" class="flex items-center space-x-2 text-sm text-zinc-500">
                <i class="pi pi-map-marker"></i>
                <span>Ubicación compartida</span>
              </div>

              <!-- Footer con acciones -->
              <div class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <Button
                  :label="`${post.likes} Me gusta`"
                  :icon="hasLiked(post.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                  :severity="hasLiked(post.id) ? 'danger' : 'secondary'"
                  text
                  @click="toggleLike(post.id)"
                  :disabled="hasLiked(post.id)"
                  :class="{'opacity-50 cursor-not-allowed': hasLiked(post.id)}"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Dialog de confirmación para eliminar -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Confirmar eliminación"
      :style="{ width: '25rem' }"
    >
      <div class="flex items-center space-x-4">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
        <p class="text-zinc-700 dark:text-zinc-200">
          ¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.
        </p>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showDeleteDialog = false" />
        <Button label="Eliminar" severity="danger" @click="handleDelete" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Animación sutil para el hover de las cards */
.p-card:hover {
  transform: translateY(-2px);
}

/* Estilo para el botón de like cuando ya se dio like */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}
</style>