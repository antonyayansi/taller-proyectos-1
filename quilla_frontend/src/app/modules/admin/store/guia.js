import { supabase } from '@/services/supabase/supabase'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import { uploadFileToS3 } from '@/services/aws'

export const useGuiaStore = defineStore('guia', {
  state: () => ({
    misSitios: [],
    categoriasActivas: [],
    loading: false,
  }),
  actions: {
    async fetchCategorias() {
      try {
        const { data, error } = await supabase.from('categorias').select('id, nombre')
        if (error) throw error
        this.categoriasActivas = data
      } catch (err) {
        console.error('Error obteniendo categorias', err)
      }
    },

    async fetchMisSitios() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('sitios')
          .select('*, categorias:categorias_id(nombre)')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.misSitios = data
      } catch (error) {
        console.error('Error al obtener sitios:', error)
        toast.error('No se pudieron cargar los sitios.')
      } finally {
        this.loading = false
      }
    },

    async createSitio(sitioData, imageFiles) {
      this.loading = true
      try {
        // 1. Crear el sitio
        const { data: nuevoSitio, error: errorSitio } = await supabase
          .from('sitios')
          .insert([
            {
              nombre: sitioData.nombre,
              descripcion: sitioData.descripcion,
              categorias_id: sitioData.categorias_id,
              lat: parseFloat(sitioData.lat || 0),
              lng: parseFloat(sitioData.lng || 0),
              horarios: sitioData.horarios,
            },
          ])
          .select()
          .single()

        if (errorSitio) throw errorSitio

        // 2. Subir imágenes si existen
        if (imageFiles && imageFiles.length > 0) {
          toast.info(`Sitio creado, subiendo ${imageFiles.length} imágenes...`)
          for (const file of imageFiles) {
            // Generar nombre unico
            const fileName = `sitios/${nuevoSitio.id}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
            await uploadFileToS3(fileName, file)

            // Crear el registro de imagen
            const imageUrl = `https://rotux.s3.us-east-1.amazonaws.com/${fileName}` // Adaptado a tu conf
            await supabase
              .from('imagenes_sitio')
              .insert([{ sitios_id: nuevoSitio.id, url: imageUrl }])
          }
        }

        toast.success('Sitio turístico publicado con éxito.')
        await this.fetchMisSitios()
        return true
      } catch (error) {
        console.error('Error al crear sitio:', error)
        toast.error('Ocurrió un error al crear la publicación turística.')
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteSitio(id) {
      try {
        const { error } = await supabase.from('sitios').delete().eq('id', id)
        if (error) throw error
        toast.success('Sitio borrado exitosamente.')
        this.misSitios = this.misSitios.filter((s) => s.id !== id)
      } catch (err) {
        console.error(err)
        toast.error('Error borrando el sitio, puede que tenga recomendaciones o audios vinculados.')
      }
    },
  },
})
