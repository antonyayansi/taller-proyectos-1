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

// Estado de comentarios por post
const commentInputs = ref({}) // { [postId]: string }

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

// Comentarios
const handleToggleComments = async (postId) => {
  if (!commentInputs.value[postId]) commentInputs.value[postId] = ''
  await toggleComments(postId)
}

const handleAddComment = async (postId) => {
  const text = commentInputs.value[postId]
  if (!text?.trim()) return
  await addComment(postId, text)
  commentInputs.value[postId] = ''
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
const isMyComment = (comment) => comment.users_id === authStore.user?.id

const commentCount = (postId) => comments.value[postId]?.length ?? 0

onMounted(async () => {
  await authStore.getUser()
  await fetchPosts()
})
</script>

<template>
  <div class="feed-page">
    <div class="feed-content">

      <!-- ── Crear publicación ── -->
      <div class="create-card">
        <div class="create-header">
          <div class="author-avatar-wrap">
            <img
              v-if="authStore.user?.user_metadata?.avatar_url"
              :src="authStore.user.user_metadata.avatar_url"
              class="author-avatar-img"
              alt="avatar"
            />
            <div v-else class="author-avatar-placeholder">
              {{ authStore.user?.email?.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div>
            <h2 class="create-title">Comparte tu experiencia</h2>
            <p class="create-sub">¿Qué lugar increíble descubriste hoy?</p>
          </div>
        </div>

        <!-- Textarea -->
        <Textarea
          v-model="newPostText"
          placeholder="Cuéntanos sobre tu aventura turística..."
          rows="3"
          class="post-textarea"
          :maxlength="500"
        />

        <!-- Preview imagen -->
        <div v-if="imagePreview" class="image-preview-wrap">
          <img :src="imagePreview" alt="Preview" class="image-preview" />
          <button class="remove-image-btn" @click="removeImage">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Contador y acciones -->
        <div class="create-footer">
          <div class="action-btns">
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
                <button class="icon-btn" title="Agregar imagen">
                  <i class="pi pi-image"></i>
                </button>
              </template>
            </FileUpload>

            <button
              class="icon-btn"
              :class="{ 'icon-btn--active': currentLocation }"
              @click="captureLocation"
              title="Agregar ubicación"
            >
              <i class="pi pi-map-marker"></i>
            </button>
          </div>

          <div class="create-right">
            <span class="char-count">{{ newPostText.length }}/500</span>
            <button
              class="publish-btn"
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
      <div v-if="loading" class="loading-feed">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
      </div>

      <!-- ── Feed ── -->
      <div v-else class="posts-list">
        <div v-if="posts.length === 0" class="empty-state">
          <i class="pi pi-inbox empty-icon"></i>
          <p class="empty-title">No hay publicaciones aún</p>
          <p class="empty-sub">¡Sé el primero en compartir!</p>
        </div>

        <!-- Post card -->
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
        >
          <!-- Header del post: perfil del autor -->
          <div class="post-header">
            <div class="post-author">
              <div class="post-author-avatar">
                <img
                  v-if="getAuthorAvatar(post)"
                  :src="getAuthorAvatar(post)"
                  :alt="getAuthorName(post)"
                  class="author-avatar-img"
                />
                <div v-else class="author-avatar-placeholder author-avatar-placeholder--post">
                  {{ getAuthorInitial(post) }}
                </div>
              </div>
              <div class="post-author-info">
                <p class="post-author-name">{{ getAuthorName(post) }}</p>
                <p class="post-author-date">{{ formatDate(post.created_at) }}</p>
              </div>
            </div>

            <!-- Botón eliminar (solo para el autor) -->
            <button
              v-if="isMyPost(post)"
              class="delete-btn"
              @click="confirmDelete(post)"
              title="Eliminar publicación"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>

          <!-- Texto del post -->
          <p v-if="post.texto" class="post-text">{{ post.texto }}</p>

          <!-- Imagen del post -->
          <div v-if="post.imagen" class="post-image-wrap">
            <img :src="post.imagen" :alt="post.texto" class="post-image" />
          </div>

          <!-- Ubicación -->
          <div v-if="post.ubicacion" class="post-location">
            <i class="pi pi-map-marker"></i>
            <span>Ubicación compartida</span>
          </div>

          <!-- Acciones del post -->
          <div class="post-actions">
            <button
              class="action-pill"
              :class="{ 'action-pill--liked': hasLiked(post.id) }"
              @click="toggleLike(post.id)"
              :disabled="hasLiked(post.id)"
            >
              <i :class="hasLiked(post.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
              <span>{{ post.likes }}</span>
            </button>

            <button
              class="action-pill"
              :class="{ 'action-pill--active': openCommentsPost === post.id }"
              @click="handleToggleComments(post.id)"
            >
              <i class="pi pi-comment"></i>
              <span>{{ commentCount(post.id) }}</span>
            </button>
          </div>

          <!-- ── Sección de comentarios ── -->
          <div v-if="openCommentsPost === post.id" class="comments-section">

            <!-- Cargar comentarios -->
            <div v-if="loadingComments[post.id]" class="comments-loading">
              <i class="pi pi-spin pi-spinner"></i>
            </div>

            <!-- Lista de comentarios -->
            <div v-else>
              <div v-if="!comments[post.id] || comments[post.id].length === 0" class="no-comments">
                Sé el primero en comentar...
              </div>
              <div
                v-for="comment in comments[post.id]"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-avatar">
                  <img
                    v-if="comment.autor?.avatar_url"
                    :src="comment.autor.avatar_url"
                    class="comment-avatar-img"
                    alt="avatar"
                  />
                  <div v-else class="comment-avatar-placeholder">
                    {{ comment.autor?.nombre?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                </div>
                <div class="comment-body">
                  <div class="comment-top">
                    <span class="comment-author">{{ comment.autor?.nombre || 'Usuario' }}</span>
                    <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                    <button
                      v-if="isMyComment(comment)"
                      class="comment-delete"
                      @click="deleteComment(post.id, comment.id)"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                  <p class="comment-text">{{ comment.texto }}</p>
                </div>
              </div>

              <!-- Input nuevo comentario -->
              <div class="comment-input-row">
                <div class="comment-input-avatar">
                  <img
                    v-if="authStore.user?.user_metadata?.avatar_url"
                    :src="authStore.user.user_metadata.avatar_url"
                    class="comment-avatar-img"
                    alt="yo"
                  />
                  <div v-else class="comment-avatar-placeholder">
                    {{ authStore.user?.email?.charAt(0)?.toUpperCase() }}
                  </div>
                </div>
                <div class="comment-input-wrap">
                  <input
                    v-model="commentInputs[post.id]"
                    class="comment-input"
                    placeholder="Escribe un comentario..."
                    @keyup.enter="handleAddComment(post.id)"
                  />
                  <button
                    class="comment-send-btn"
                    @click="handleAddComment(post.id)"
                    :disabled="!commentInputs[post.id]?.trim()"
                  >
                    <i class="pi pi-send"></i>
                  </button>
                </div>
              </div>
            </div>
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
      <div class="delete-dialog-body">
        <i class="pi pi-exclamation-triangle dialog-warn-icon"></i>
        <p>¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showDeleteDialog = false" />
        <Button label="Eliminar" severity="danger" @click="handleDelete" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* ── Layout ── */
.feed-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #f5f3ff 0%, #fdf4ff 50%, #eff6ff 100%);
  padding-bottom: 80px;
}

:global(.dark) .feed-page {
  background: linear-gradient(160deg, #18161f 0%, #1a1025 50%, #111827 100%);
}

.feed-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Create card ── */
.create-card {
  background: white;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:global(.dark) .create-card {
  background: #1e1b2e;
  border-color: rgba(139, 92, 246, 0.25);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}

.create-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.create-title {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

:global(.dark) .create-title { color: #fafafa; }

.create-sub {
  font-size: 12px;
  color: #71717a;
  margin: 2px 0 0;
}

.post-textarea {
  width: 100%;
  font-size: 15px;
  border-radius: 12px !important;
  border: 1.5px solid rgba(99, 102, 241, 0.2) !important;
  resize: none;
  transition: border-color 0.2s;
}

.post-textarea:focus {
  border-color: #6366f1 !important;
}

.image-preview-wrap {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
}

.create-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  padding-top: 10px;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover { background: rgba(99, 102, 241, 0.15); transform: scale(1.08); }
.icon-btn--active { background: rgba(22, 163, 74, 0.12); color: #16a34a; }

.create-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.char-count {
  font-size: 12px;
  color: #a1a1aa;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.publish-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
}

.publish-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ── Avatar shared ── */
.author-avatar-wrap {
  flex-shrink: 0;
}

.author-avatar-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(99, 102, 241, 0.3);
}

.author-avatar-placeholder {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Loading ── */
.loading-feed {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.loading-icon { font-size: 36px; color: #a855f7; }

/* ── Post card ── */
.posts-list { display: flex; flex-direction: column; gap: 14px; }

.post-card {
  background: white;
  border-radius: 20px;
  padding: 18px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.25s ease;
}

:global(.dark) .post-card {
  background: #1e1b2e;
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 2px 16px rgba(0,0,0,0.4);
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.15);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-author-avatar { flex-shrink: 0; }

.author-avatar-placeholder--post {
  width: 38px;
  height: 38px;
  font-size: 15px;
}

.post-author-info { display: flex; flex-direction: column; gap: 2px; }

.post-author-name {
  font-size: 14px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

:global(.dark) .post-author-name { color: #fafafa; }

.post-author-date {
  font-size: 11px;
  color: #a1a1aa;
  margin: 0;
}

.delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-btn:hover { background: rgba(239, 68, 68, 0.15); transform: scale(1.08); }

.post-text {
  font-size: 15px;
  color: #27272a;
  line-height: 1.6;
  margin: 0;
}

:global(.dark) .post-text { color: #e4e4e7; }

.post-image-wrap {
  border-radius: 14px;
  overflow: hidden;
  margin: 0 -18px;
}

.post-image {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  display: block;
}

.post-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6366f1;
  font-weight: 500;
}

/* ── Post actions ── */
.post-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgba(99, 102, 241, 0.08);
  padding-top: 10px;
}

.action-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 24px;
  border: 1.5px solid rgba(99, 102, 241, 0.15);
  background: transparent;
  color: #71717a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-pill:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.3);
}

.action-pill--liked {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.25) !important;
  cursor: not-allowed;
}

.action-pill--active {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.3);
}

.action-pill:disabled { opacity: 0.7; }

/* ── Comentarios ── */
.comments-section {
  background: rgba(99, 102, 241, 0.04);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 -2px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

:global(.dark) .comments-section {
  background: rgba(99, 102, 241, 0.07);
}

.comments-loading {
  display: flex;
  justify-content: center;
  padding: 12px;
  color: #a855f7;
  font-size: 20px;
}

.no-comments {
  text-align: center;
  color: #a1a1aa;
  font-size: 13px;
  padding: 8px 0;
}

.comment-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.comment-avatar { flex-shrink: 0; }

.comment-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(99, 102, 241, 0.2);
}

.comment-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-body {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

:global(.dark) .comment-body {
  background: #2a2640;
}

.comment-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 12px;
  font-weight: 700;
  color: #18181b;
}

:global(.dark) .comment-author { color: #fafafa; }

.comment-date {
  font-size: 10px;
  color: #a1a1aa;
  flex: 1;
}

.comment-delete {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.comment-delete:hover { opacity: 1; }

.comment-text {
  font-size: 13px;
  color: #3f3f46;
  line-height: 1.5;
  margin: 0;
}

:global(.dark) .comment-text { color: #d4d4d8; }

/* Input comentario */
.comment-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.comment-input-avatar { flex-shrink: 0; }

.comment-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1.5px solid rgba(99, 102, 241, 0.2);
  border-radius: 24px;
  padding: 6px 8px 6px 14px;
  transition: border-color 0.2s;
}

:global(.dark) .comment-input-wrap {
  background: #2a2640;
  border-color: rgba(139, 92, 246, 0.3);
}

.comment-input-wrap:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.comment-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #18181b;
  outline: none;
}

:global(.dark) .comment-input { color: #e4e4e7; }

.comment-input::placeholder { color: #a1a1aa; }

.comment-send-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.comment-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.comment-send-btn:hover:not(:disabled) { transform: scale(1.1); }

/* ── Empty state ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 16px;
  text-align: center;
}

.empty-icon { font-size: 56px; color: #d4d4d8; margin-bottom: 14px; }
.empty-title { font-size: 17px; font-weight: 600; color: #71717a; margin: 0 0 6px; }
.empty-sub { font-size: 13px; color: #a1a1aa; margin: 0; }

/* ── Delete dialog ── */
.delete-dialog-body {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 4px 0;
}

.dialog-warn-icon { font-size: 32px; color: #f97316; flex-shrink: 0; }

.delete-dialog-body p {
  font-size: 14px;
  color: #3f3f46;
  line-height: 1.6;
  margin: 0;
}

:global(.dark) .delete-dialog-body p { color: #d4d4d8; }
</style>