import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase/supabase'
import { auth } from '@/app/modules/auth/store/auth'
import { toast } from 'vue-sonner'

export const useTopsStore = defineStore('tops', {
  state: () => ({
    posts: [],
    loading: false,
    likedPosts: new Set(), // Control local de likes
  }),

  actions: {
    // Obtener todas las publicaciones ordenadas por fecha
    async fetchPosts() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('publicaciones')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        this.posts = data || []
        
        // Cargar likes del usuario desde localStorage
        this.loadLikedPosts()
      } catch (error) {
        console.error('Error fetching posts:', error)
        toast.error('Error al cargar publicaciones')
      } finally {
        this.loading = false
      }
    },

    // Crear nueva publicación
    async createPost(postData) {
      try {
        const authStore = auth()
        if (!authStore.user) {
          toast.error('Debes iniciar sesión')
          return null
        }

        const { data, error } = await supabase
          .from('publicaciones')
          .insert([
            {
              users_id: authStore.user.id,
              texto: postData.texto,
              imagen: postData.imagen || null,
              ubicacion: postData.ubicacion || null,
              likes: 0
            }
          ])
          .select()

        if (error) throw error

        // Agregar al inicio del array
        if (data && data.length > 0) {
          this.posts.unshift(data[0])
          toast.success('Publicación creada exitosamente')
          return data[0]
        }
      } catch (error) {
        console.error('Error creating post:', error)
        toast.error('Error al crear publicación')
        return null
      }
    },

    // Dar/quitar like a una publicación
    async toggleLike(postId) {
      // Validar si ya le dio like localmente
      if (this.likedPosts.has(postId)) {
        toast.warning('Ya le diste like a esta publicación')
        return
      }

      try {
        // Buscar el post
        const post = this.posts.find(p => p.id === postId)
        if (!post) return

        const newLikes = post.likes + 1

        // Actualizar en Supabase
        const { error } = await supabase
          .from('publicaciones')
          .update({ likes: newLikes })
          .eq('id', postId)

        if (error) throw error

        // Actualizar localmente
        post.likes = newLikes
        
        // Marcar como likeado
        this.likedPosts.add(postId)
        this.saveLikedPosts()

        toast.success('¡Like agregado!')
      } catch (error) {
        console.error('Error toggling like:', error)
        toast.error('Error al dar like')
      }
    },

    // Eliminar publicación
    async deletePost(postId) {
      try {
        const authStore = auth()
        const post = this.posts.find(p => p.id === postId)
        
        // Validar que sea el propietario
        if (post.users_id !== authStore.user?.id) {
          toast.error('No tienes permiso para eliminar esta publicación')
          return
        }

        const { error } = await supabase
          .from('publicaciones')
          .delete()
          .eq('id', postId)

        if (error) throw error

        // Remover del array
        this.posts = this.posts.filter(p => p.id !== postId)
        toast.success('Publicación eliminada')
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Error al eliminar publicación')
      }
    },

    // Cargar likes desde localStorage
    loadLikedPosts() {
      try {
        const saved = localStorage.getItem('likedPosts')
        if (saved) {
          this.likedPosts = new Set(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Error loading liked posts:', error)
      }
    },

    // Guardar likes en localStorage
    saveLikedPosts() {
      try {
        localStorage.setItem('likedPosts', JSON.stringify([...this.likedPosts]))
      } catch (error) {
        console.error('Error saving liked posts:', error)
      }
    },

    // Verificar si ya le dio like
    hasLiked(postId) {
      return this.likedPosts.has(postId)
    }
  }
})
