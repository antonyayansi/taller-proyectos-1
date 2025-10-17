import { addMarker, calculateDistance } from '@/services/gps'
import { supabase } from '@/services/supabase/supabase'
import { defineStore } from 'pinia'
import useHome from '../hooks/useHome'
import { home } from './home'

const { ubicacionActual } = useHome()
const homeStore = home()

export const sitios = defineStore('sitios', {
  state: () => ({
    sitios: [],
    sitiosbk: [],
    sitioActive: null,
  }),
  actions: {
    // 🔹 Obtener todos los sitios
    async getSitios() {
      try {
        const { data, error } = await supabase.from('sitios').select('*')
        if (error) throw error

        const sitiosWithDistance = await Promise.all(
          data.map(async (item) => {
            let distancia = 0
            if (ubicacionActual.value.lat && ubicacionActual.value.lng) {
              distancia = await calculateDistance(
                ubicacionActual.value.lat,
                ubicacionActual.value.lng,
                item.lat,
                item.lng,
              )
            }
            return {
              ...item,
              distancia: distancia.toFixed(2),
            }
          }),
        )

        this.sitios = sitiosWithDistance
        this.sitiosbk = [...this.sitios]
      } catch (e) {
        console.error('Error fetching sitios:', e)
      }
    },

    // 🔹 Obtener sitio por ID (detalle)
    async getSitiosById(id) {
      try {
        const { data, error } = await supabase
          .from('sitios')
          .select(
            `
            *,
            categorias:categoria_id (*),
            imagenes_sitio (*),
            rutas (*, audios (*))
          `,
          )
          .eq('id', id)
          .single()

        if (error) throw error

        let distancia = 0
        if (ubicacionActual.value.lat && ubicacionActual.value.lng && data) {
          distancia = await calculateDistance(
            ubicacionActual.value.lat,
            ubicacionActual.value.lng,
            data.lat,
            data.lng,
          )
        }

        this.sitioActive = {
          ...data,
          distancia: distancia.toFixed(2),
        }

        await this.textToSpeech(this.sitioActive.descripcion)
        return this.sitioActive
      } catch (e) {
        console.error('Error fetching sitio by id:', e)
        this.sitioActive = null
        return null
      }
    },

    // 🔹 Agregar marcadores al mapa
    async addSitesToMap() {
      for (const sitio of this.sitios) {
        const htmlContent = `
          <div>
            <h3 class="font-black text-green-800">${sitio.nombre}</h3>
            <p class="text-zinc-800 mb-4">${sitio.descripcion || 'Descripción no disponible'}</p>
            <a href="/sitio/${sitio.id}" class="bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600">
              Iniciar Recorrido
            </a>
          </div>`

        await addMarker(
          { lat: sitio.lat, lng: sitio.lng },
          'turismo',
          sitio.nombre || 'Sitio turístico',
          false,
          htmlContent,
        )
      }
    },

    // 🔹 Búsqueda local (texto)
    searchSitios(query) {
      if (!query) {
        this.sitios = this.sitiosbk
        return
      }
      const lowerQuery = query.toLowerCase()
      this.sitios = this.sitiosbk.filter(
        (sitio) =>
          sitio.nombre.toLowerCase().includes(lowerQuery) ||
          sitio.descripcion.toLowerCase().includes(lowerQuery),
      )
    },

    // 🔹 🔥 Nueva búsqueda directa por texto en Supabase (más eficiente en grandes datasets)
    async searchSitiosDB(termino) {
      const texto = termino.trim()
      if (texto === '') {
        await this.getSitios()
        return
      }

      const { data, error } = await supabase
        .from('sitios')
        .select('*')
        .or(`nombre.ilike.%${texto}%, descripcion.ilike.%${texto}%`)

      if (error) {
        console.error('Error en la búsqueda:', error)
        return
      }

      this.sitios = data
    },

    // 🔹 🔍 Nueva búsqueda por categoría
    async getSitiosByCategoria(categoriaId) {
      try {
        if (!categoriaId) {
          // si no se selecciona categoría → mostrar todos
          await this.getSitios()
          return
        }

        const { data, error } = await supabase
          .from('sitios')
          .select('*')
          .eq('categoria_id', categoriaId)

        if (error) throw error

        this.sitios = data
      } catch (e) {
        console.error('Error al filtrar por categoría:', e)
      }
    },

    // 🔹 Text-to-speech (mantiene tu lógica)
    async textToSpeech(text) {
      homeStore.loadNarratorConfig()
      const config = homeStore.narratorConfig

      if (!config.enabled) return

      try {
        const apiKey = 'AIzaSyClgb1ViE6cjIMaDTobCLHxUcJk6AutcLk'
        const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`

        const payload = {
          audioConfig: {
            audioEncoding: 'MP3',
            effectsProfileId: [config.effectsProfile],
            pitch: config.pitch,
            speakingRate: config.speakingRate,
          },
          input: { text },
          voice: {
            languageCode: config.language,
            name: config.voice,
          },
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error('Error en la solicitud de text-to-speech')

        const result = await response.json()
        const audioBytes = result.audioContent
        const audioBlob = new Blob([Uint8Array.from(atob(audioBytes), (c) => c.charCodeAt(0))], {
          type: 'audio/mp3',
        })

        const audio = new Audio(URL.createObjectURL(audioBlob))
        audio.volume = config.volume
        audio.play()
      } catch (error) {
        console.error('Error en textToSpeech:', error)
      }
    },
  },
})
