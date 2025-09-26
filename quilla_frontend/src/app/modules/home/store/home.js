// src/app/modules/home/store/home.js

import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase/supabase'

export const useHomeStore = defineStore('home', {
  state: () => ({
    sitios: [],
  }),
  actions: {
    async fetchSitios() {
      if (this.sitios.length > 0) {
        console.log('Datos ya cargados desde el store')
        return
      }

      try {
        console.log('Consultando datos desde Supabase...')
        const { data, error } = await supabase.from('sitios').select('id,nombre,descripcion')

        if (error) throw error

        // Asigna los datos al estado
        this.sitios = data
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    },
  },
  getters: {},
})
