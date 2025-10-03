import { defineStore } from 'pinia'
import { Geolocation } from '@capacitor/geolocation'
import Decimal from 'decimal.js-light'

export const home = defineStore('home', {
  state: () => ({
    sitios: [],
    ubicacionActual: {
      lat: null,
      lng: null,
    },
    loading: false,
    error: null,
    watchId: null,
    mapCenter: { lat: 10.9685, lng: -74.7813 }, // Barranquilla, Colombia
    mapZoom: 12,
    mapOptions: {
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: [], // Puedes agregar estilos personalizados aquí
    },
  }),
  actions: {
    async obtenerUbicacion() {
      try {
        // Verificar y solicitar permisos de ubicación
        const permissions = await Geolocation.checkPermissions()

        if (permissions.location === 'denied') {
          const requestResult = await Geolocation.requestPermissions()
          if (requestResult.location === 'denied') {
            throw new Error('Permisos de ubicación denegados')
          }
        }

        // Obtener la posición actual usando Capacitor
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        })

        const coords = {
          lat: new Decimal(position.coords.latitude).toNumber(),
          lng: new Decimal(position.coords.longitude).toNumber(),
        }

        this.ubicacionActual = coords
        this.error = null

        // Actualizar el centro del mapa
        this.mapCenter = coords
        this.mapZoom = 15
        return coords
      } catch (error) {
        errorUbicacion.value = error
        throw error
      }
    },
    async iniciarSeguimientoUbicacion() {
      try {
        this.watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            timeout: 30000,
          },
          (position, err) => {
            if (err) {
              console.error('Error en seguimiento de ubicación:', err)
              return
            }

            if (position) {
              const coords = {
                lat: new Decimal(position.coords.latitude).toNumber(),
                lng: new Decimal(position.coords.longitude).toNumber(),
              }
              this.ubicacionActual = coords
              this.mapCenter = coords
            }
          },
        )
      } catch (error) {
        console.error('Error iniciando seguimiento:', error)
      }
    },
    async detenerSeguimientoUbicacion() {
      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId })
        this.watchId = null
      }
    },
  },
  getters: {},
})
