<script setup>
import { ref, onMounted, computed } from 'vue'
import { Geolocation } from '@capacitor/geolocation'
import useTops from '../hooks/useTops'
import { uploadPostImage } from '@/services/upload'
import { auth } from '@/app/modules/auth/store/auth'
import { toast } from 'vue-sonner'
import { useRoute, useRouter } from 'vue-router'
import {
  Button,
  Textarea,
  FileUpload,
  Card,
  Avatar,
  Dialog
} from 'primevue'

const authStore = auth()
const router = useRouter()

const {
  posts,
  loading,
  fetchPosts,
  createPost,
  toggleLike,
  deletePost,
  hasLiked,
  comments,
  loadingComments,
  openCommentsPost,
  toggleComments,
  addComment,
  deleteComment
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
    const reader = new FileReader()
    reader.onload = (e) => { imagePreview.value = e.target.result }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
}

const canSubmit = computed(() =>
  (newPostText.value.trim().length > 0 || selectedImage.value) && !isSubmitting.value
)

// Publicar nuevo post
const handleSubmit = async () => {
  if (!canSubmit.value) return
  isSubmitting.value = true

  try {
    let imageUrl = null
    if (selectedImage.value) {
      toast.info('Subiendo imagen...')
      imageUrl = await uploadPostImage(selectedImage.value)
      if (!imageUrl) throw new Error('Error al subir la imagen')
      toast.success('Imagen subida correctamente')
    }

    await createPost({
      texto: newPostText.value.trim(),
      imagen: imageUrl,
      ubicacion: currentLocation.value ? JSON.stringify(currentLocation.value) : null
    })

    newPostText.value = ''
    selectedImage.value = null
    imagePreview.value = null
    currentLocation.value = null
  } catch (error) {
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

const handleDelete = async () => {
  if (postToDelete.value) {
    await deletePost(postToDelete.value.id)
    showDeleteDialog.value = false
    postToDelete.value = null
  }
}

// Navegar a detalle
const goToDetail = (postId) => {
  router.push({ name: 'tops.detail', params: { id: postId } })
}

// Conteo de comentarios
const getCommentCount = (post) => {
  return post.conteo_comentarios?.[0]?.count || 0
}

// Avatar del autor
const getAuthorInitial = (post) => {
  const name = post.autor?.nombre
  if (name) return name.charAt(0).toUpperCase()
  return '?'
}

const getAuthorName = (post) => {
  return post.autor?.nombre || 'Usuario'
}

const getAuthorAvatar = (post) => {
  return post.autor?.avatar_url || null
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

  if (days > 7) return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  else if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`
  else if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  else if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  else return 'Hace un momento'
}

const isMyPost = (post) => post.users_id === authStore.user?.id

onMounted(async () => {
  await authStore.getUser()
  await fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pb-20">
    <div class="max-w-2xl mx-auto p-4 flex flex-col gap-4">

      <!-- ── Crear publicación ── -->
      <div class="bg-white dark:bg-zinc-900 rounded-[20px] p-[18px] shadow-xl shadow-indigo-500/5 border border-indigo-500/10 dark:border-indigo-500/20 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="shrink-0">
            <img
              v-if="authStore.user?.user_metadata?.avatar_url"
              :src="authStore.user.user_metadata.avatar_url"
              class="w-[42px] h-[42px] rounded-full object-cover border-2 border-indigo-500/30"
              alt="avatar"
            />
            <div v-else class="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-base flex items-center justify-center">
              {{ authStore.user?.email?.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-50 m-0">Comparte tu experiencia</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">¿Qué lugar increíble descubriste hoy?</p>
          </div>
        </div>

        <!-- Textarea -->
        <Textarea
          v-model="newPostText"
          placeholder="Cuéntanos sobre tu aventura turística..."
          rows="3"
          class="w-full text-[15px] rounded-xl border-[1.5px] border-indigo-500/20 dark:border-indigo-500/30 dark:bg-zinc-800 dark:text-zinc-200 resize-none transition-all focus:border-indigo-500 outline-none p-3"
          :maxlength="500"
        />

        <!-- Preview imagen -->
        <div v-if="imagePreview" class="relative rounded-2xl overflow-hidden">
          <img :src="imagePreview" alt="Preview" class="w-full max-h-[280px] object-cover block" />
          <button class="absolute top-2 right-2 bg-red-500/90 text-white border-none rounded-full w-7.5 h-7.5 flex items-center justify-center cursor-pointer text-xs" @click="removeImage">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Contador y acciones -->
        <div class="flex items-center justify-between border-t border-indigo-500/10 pt-2.5">
          <div class="flex items-center gap-1.5">
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
                <button class="w-9 h-9 rounded-full border-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center cursor-pointer transition-all hover:bg-indigo-500/20 hover:scale-110 active:scale-95" title="Agregar imagen">
                  <i class="pi pi-image text-[15px]"></i>
                </button>
              </template>
            </FileUpload>

            <button
              class="w-9 h-9 rounded-full border-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center cursor-pointer transition-all hover:bg-indigo-500/20 hover:scale-110 active:scale-95"
              :class="{ 'bg-green-500/15 text-green-600 dark:text-green-400': currentLocation }"
              @click="captureLocation"
              title="Agregar ubicación"
            >
              <i class="pi pi-map-marker text-[15px]"></i>
            </button>
          </div>

          <div class="flex items-center gap-2.5">
            <span class="text-xs text-zinc-400">{{ newPostText.length }}/500</span>
            <button
              class="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none rounded-xl px-4.5 py-2.5 text-sm font-bold cursor-pointer transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="!canSubmit"
              @click="handleSubmit"
            >
              <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
              <i v-else class="pi pi-send"></i>
              Publicar
            </button>
          </div>
        </div>
      </div>

      <!-- ── Loading ── -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-purple-500"></i>
      </div>

      <!-- ── Feed ── -->
      <div v-else class="flex flex-col gap-3.5">
        <div v-if="posts.length === 0" class="flex flex-col items-center py-14 px-4 text-center">
          <i class="pi pi-inbox text-[56px] text-zinc-300 mb-3.5"></i>
          <p class="text-[17px] font-semibold text-zinc-500 m-0 mb-1.5">No hay publicaciones aún</p>
          <p class="text-[13px] text-zinc-400 m-0">¡Sé el primero en compartir!</p>
        </div>

        <!-- Post card -->
        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-white dark:bg-zinc-900 rounded-[20px] p-[18px] border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col gap-3"
        >
          <!-- Header del post: perfil del autor -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="shrink-0">
                <img
                  v-if="getAuthorAvatar(post)"
                  :src="getAuthorAvatar(post)"
                  :alt="getAuthorName(post)"
                  class="w-[38px] h-[38px] rounded-full object-cover border-2 border-indigo-500/30"
                />
                <div v-else class="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-[15px] flex items-center justify-center">
                  {{ getAuthorInitial(post) }}
                </div>
              </div>
              <div class="flex flex-col gap-0.5">
                <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 m-0">{{ getAuthorName(post) }}</p>
                <p class="text-[11px] text-zinc-400 dark:text-zinc-500 m-0">{{ formatDate(post.created_at) }}</p>
              </div>
            </div>

            <!-- Botón eliminar (solo para el autor) -->
            <button
              v-if="isMyPost(post)"
              class="w-8 h-8 rounded-full border-none bg-red-500/10 text-red-500 cursor-pointer text-xs flex items-center justify-center transition-all hover:bg-red-500/20 hover:scale-110"
              @click="confirmDelete(post)"
              title="Eliminar publicación"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>

          <!-- Texto del post -->
          <p v-if="post.texto" class="text-[15px] text-zinc-800 dark:text-zinc-200 leading-relaxed m-0">{{ post.texto }}</p>

          <!-- Imagen del post -->
          <div v-if="post.imagen" class="rounded-2xl overflow-hidden -mx-[18px]">
            <img :src="post.imagen" :alt="post.texto" class="w-full max-h-[420px] object-cover block" />
          </div>

          <!-- Ubicación -->
          <div v-if="post.ubicacion" class="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold">
            <i class="pi pi-map-marker"></i>
            <span>Ubicación compartida</span>
          </div>

          <!-- Acciones del post -->
          <div class="flex items-center gap-2.5 border-t border-indigo-500/10 pt-2.5">
            <button
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-[1.5px] border-indigo-500/15 text-zinc-500 dark:text-zinc-400 text-[13px] font-bold cursor-pointer transition-all hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/30 bg-transparent"
              :class="{ 'bg-red-500/10 !text-red-500 !border-red-500/25 cursor-default': hasLiked(post.id) }"
              @click="toggleLike(post.id)"
              :disabled="hasLiked(post.id)"
            >
              <i :class="hasLiked(post.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
              <span>{{ post.likes }}</span>
            </button>

            <button
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-[1.5px] border-indigo-500/15 text-zinc-500 dark:text-zinc-400 text-[13px] font-bold cursor-pointer transition-all hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/30 bg-transparent"
              @click="goToDetail(post.id)"
            >
              <i class="pi pi-comment"></i>
              <span>{{ getCommentCount(post) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog eliminar post -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Confirmar eliminación"
      :style="{ width: '22rem' }"
    >
      <div class="flex items-start gap-3.5 py-1">
        <i class="pi pi-exclamation-triangle text-3xl text-orange-500 shrink-0"></i>
        <p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed m-0">¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showDeleteDialog = false" />
        <Button label="Eliminar" severity="danger" @click="handleDelete" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Transiciones suaves para interactividad */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>