import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase/supabase'
import { auth } from '@/app/modules/auth/store/auth'
import { toast } from 'vue-sonner'

export const useTopsStore = defineStore('tops', {
  state: () => ({
    posts: [],
    loading: false,
    likedPosts: new Set(), // Control local de likes
    // Comentarios
    comments: {},      // { [postId]: Comment[] }
    loadingComments: {}, // { [postId]: boolean }
    openCommentsPost: null, // ID del post con comentarios abiertos
  }),

  actions: {
    // Obtener todas las publicaciones con perfil del autor
    async fetchPosts() {
      this.loading = true
      try {
        // Join con perfiles para obtener nombre y avatar
        const { data, error } = await supabase
          .from('publicaciones')
          .select(`
            *,
            autor:perfiles!publicaciones_users_id_fkey(nombre, avatar_url)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          // Fallback sin join si la relación no existe aún
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('publicaciones')
            .select('*')
            .order('created_at', { ascending: false })
          if (fallbackError) throw fallbackError
          this.posts = fallbackData || []
        } else {
          this.posts = data || []
        }
        
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
          .select(`
            *,
            autor:perfiles!publicaciones_users_id_fkey(nombre, avatar_url)
          `)

        if (error) {
          // Fallback
          const { data: fd, error: fe } = await supabase
            .from('publicaciones')
            .insert([{
              users_id: authStore.user.id,
              texto: postData.texto,
              imagen: postData.imagen || null,
              ubicacion: postData.ubicacion || null,
              likes: 0
            }])
            .select()
          if (fe) throw fe
          if (fd && fd.length > 0) {
            this.posts.unshift(fd[0])
            toast.success('Publicación creada exitosamente')
            return fd[0]
          }
          return null
        }

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

    // Dar like a una publicación
    async toggleLike(postId) {
      if (this.likedPosts.has(postId)) {
        toast.warning('Ya le diste like a esta publicación')
        return
      }

      try {
        const post = this.posts.find(p => p.id === postId)
        if (!post) return

        const newLikes = post.likes + 1

        const { error } = await supabase
          .from('publicaciones')
          .update({ likes: newLikes })
          .eq('id', postId)

        if (error) throw error

        post.likes = newLikes
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
        
        if (post.users_id !== authStore.user?.id) {
          toast.error('No tienes permiso para eliminar esta publicación')
          return
        }

        const { error } = await supabase
          .from('publicaciones')
          .delete()
          .eq('id', postId)

        if (error) throw error

        this.posts = this.posts.filter(p => p.id !== postId)
        // Limpiar comentarios del post
        delete this.comments[postId]
        toast.success('Publicación eliminada')
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Error al eliminar publicación')
      }
    },

    // ───── Comentarios ─────

    // Abrir/cerrar sección de comentarios de un post
    async toggleComments(postId) {
      if (this.openCommentsPost === postId) {
        this.openCommentsPost = null
        return
      }
      this.openCommentsPost = postId
      if (!this.comments[postId]) {
        await this.fetchComments(postId)
      }
    },

    // Cargar comentarios de un post
    async fetchComments(postId) {
      this.loadingComments[postId] = true
      try {
        const { data, error } = await supabase
          .from('comentarios_publicaciones')
          .select(`
            *,
            autor:perfiles!comentarios_publicaciones_users_id_fkey(nombre, avatar_url)
          `)
          .eq('publicacion_id', postId)
          .order('created_at', { ascending: true })

        if (error) throw error
        this.comments[postId] = data || []
      } catch (error) {
        console.error('Error fetching comments:', error)
        toast.error('Error al cargar comentarios')
      } finally {
        this.loadingComments[postId] = false
      }
    },

    // Agregar comentario
    async addComment(postId, texto) {
      if (!texto?.trim()) return
      const authStore = auth()
      if (!authStore.user) {
        toast.error('Debes iniciar sesión')
        return
      }

      try {
        const { data, error } = await supabase
          .from('comentarios_publicaciones')
          .insert([{
            publicacion_id: postId,
            users_id: authStore.user.id,
            texto: texto.trim()
          }])
          .select(`
            *,
            autor:perfiles!comentarios_publicaciones_users_id_fkey(nombre, avatar_url)
          `)

        if (error) throw error

        if (!this.comments[postId]) this.comments[postId] = []
        if (data && data.length > 0) this.comments[postId].push(data[0])

        toast.success('Comentario agregado')
      } catch (error) {
        console.error('Error adding comment:', error)
        toast.error('Error al agregar comentario')
      }
    },

    // Eliminar comentario
    async deleteComment(postId, commentId) {
      const authStore = auth()
      try {
        const { error } = await supabase
          .from('comentarios_publicaciones')
          .delete()
          .eq('id', commentId)
          .eq('users_id', authStore.user?.id)

        if (error) throw error

        if (this.comments[postId]) {
          this.comments[postId] = this.comments[postId].filter(c => c.id !== commentId)
        }
        toast.success('Comentario eliminado')
      } catch (error) {
        console.error('Error deleting comment:', error)
        toast.error('Error al eliminar comentario')
      }
    },

    // ───── Persistencia de likes ─────
    loadLikedPosts() {
      try {
        const saved = localStorage.getItem('likedPosts')
        if (saved) this.likedPosts = new Set(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading liked posts:', error)
      }
    },

    saveLikedPosts() {
      try {
        localStorage.setItem('likedPosts', JSON.stringify([...this.likedPosts]))
      } catch (error) {
        console.error('Error saving liked posts:', error)
      }
    },

    hasLiked(postId) {
      return this.likedPosts.has(postId)
    }
  }
})
