<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useTops from '../hooks/useTops'
import { auth } from '@/app/modules/auth/store/auth'
import { toast } from 'vue-sonner'
import {
  Avatar
} from 'primevue'

const route = useRoute()
const router = useRouter()
const authStore = auth()
const {
  posts,
  comments,
  loadingComments,
  fetchComments,
  addComment,
  deleteComment,
  toggleLike,
  hasLiked
} = useTops()

const post = ref(null)
const newComment = ref('')

// Buscar post localmente o fetch si es necesario
const findPost = () => {
  const found = posts.value.find(p => p.id === parseInt(route.params.id) || p.id === route.params.id)
  if (found) {
    post.value = found
    fetchComments(post.value.id)
  } else {
    // Si no está en el store (ej. refresh), redirigir o cargar (aquí redirigimos por simplicidad)
    toast.error('Publicación no encontrada')
    router.push({ name: 'tops' })
  }
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return
  await addComment(post.value.id, newComment.value)
  newComment.value = ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isMyComment = (comment) => comment.users_id === authStore.user?.id

onMounted(() => {
  findPost()
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20" v-if="post">
    <!-- Header Navigation -->
    <div class="sticky top-0 z-[100] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
      <button class="bg-transparent border-0 text-xl text-indigo-500 cursor-pointer mr-4 flex items-center justify-center" @click="router.back()">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h2 class="text-lg font-bold m-0 text-zinc-900 dark:text-white">Publicación</h2>
    </div>

    <div class="max-w-[600px] mx-auto p-4">
      <!-- Post Card -->
      <div class="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <Avatar 
            v-if="post.autor?.avatar_url" 
            :image="post.autor.avatar_url" 
            shape="circle" 
            size="large"
            class="ring-2 ring-indigo-500/20"
          />
          <Avatar 
            v-else 
            :label="post.autor?.nombre?.charAt(0) || '?'" 
            shape="circle" 
            size="large"
            class="bg-indigo-500 text-white ring-2 ring-indigo-500/20" 
          />
          <div class="flex flex-col">
            <p class="font-bold m-0 text-zinc-900 dark:text-white">{{ post.autor?.nombre || 'Usuario' }}</p>
            <p class="text-xs text-zinc-500 m-0">{{ formatDate(post.created_at) }}</p>
          </div>
        </div>

        <p class="text-base leading-relaxed mb-4 text-zinc-800 dark:text-zinc-200">{{ post.texto }}</p>

        <div v-if="post.imagen" class="-mx-5 mb-4 max-h-[500px] overflow-hidden">
          <img :src="post.imagen" class="w-full object-cover" />
        </div>

        <div v-if="post.ubicacion" class="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 w-fit px-3 py-1 rounded-full mb-4">
          <i class="pi pi-map-marker"></i>
          Ubicación compartida
        </div>

        <div class="flex gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button 
            class="flex items-center gap-2 bg-transparent border-0 text-sm font-bold transition-colors" 
            :class="hasLiked(post.id) ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500'"
            @click="toggleLike(post.id)"
            :disabled="hasLiked(post.id)"
          >
            <i :class="hasLiked(post.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
            <span>{{ post.likes }} Me gusta</span>
          </button>
          <div class="flex items-center gap-2 text-zinc-500 text-sm font-bold">
            <i class="pi pi-comment"></i>
            <span>{{ comments[post.id]?.length || post.conteo_comentarios?.[0]?.count || 0 }} Comentarios</span>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="space-y-6">
        <h3 class="text-lg font-bold text-zinc-900 dark:text-white px-1">Comentarios</h3>

        <div v-if="loadingComments[post.id]" class="flex justify-center p-8">
          <i class="pi pi-spin pi-spinner text-3xl text-indigo-500"></i>
        </div>

        <div v-else class="space-y-4">
          <div v-if="!comments[post.id]?.length" class="text-center py-10 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p class="text-zinc-500 dark:text-zinc-400 font-medium">No hay comentarios aún. ¡Sé el primero!</p>
          </div>
          
          <div v-for="comment in comments[post.id]" :key="comment.id" class="flex gap-3 animate-fade-in">
            <Avatar 
              v-if="comment.autor?.avatar_url" 
              :image="comment.autor.avatar_url" 
              shape="circle" 
              class="ring-2 ring-indigo-500/10"
            />
            <Avatar 
              v-else 
              :label="comment.autor?.nombre?.charAt(0) || '?'" 
              shape="circle" 
              class="bg-indigo-400 text-white ring-2 ring-indigo-500/10"
            />
            <div class="flex-1 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-sm font-bold text-zinc-900 dark:text-white">{{ comment.autor?.nombre || 'Usuario' }}</span>
                <span class="text-[11px] text-zinc-400 font-medium flex-1">{{ formatDate(comment.created_at) }}</span>
                <button 
                  v-if="isMyComment(comment)" 
                  class="bg-transparent border-0 text-zinc-400 hover:text-rose-500 transition-colors p-1" 
                  @click="deleteComment(post.id, comment.id)"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
              <p class="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300 m-0">{{ comment.texto }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Comment Input -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg p-4 border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div class="max-w-[600px] mx-auto flex gap-3 items-center">
        <Avatar 
          v-if="authStore.user?.user_metadata?.avatar_url" 
          :image="authStore.user.user_metadata.avatar_url" 
          shape="circle" 
        />
        <div class="flex-1 flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 pl-4 rounded-full border border-zinc-200 dark:border-zinc-700 transition-all focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10">
          <input 
            v-model="newComment" 
            class="flex-1 bg-transparent border-0 outline-none text-[15px] text-zinc-900 dark:text-white py-1.5"
            placeholder="Escribe un comentario..." 
            @keyup.enter="handleAddComment"
          />
          <button 
            class="bg-indigo-600 text-white border-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed transition-all active:scale-90 shadow-lg shadow-indigo-500/20" 
            @click="handleAddComment" 
            :disabled="!newComment.trim()"
          >
            <i class="pi pi-send text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.pb-safe {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}
</style>
