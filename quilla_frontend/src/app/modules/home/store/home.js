import { defineStore } from 'pinia'
import { Geolocation } from '@capacitor/geolocation'
import { addMarker, loadMapa } from '@/services/gps';

const initLatLng = { lat: -13.516985, lng: -71.978113 };

export const home = defineStore('home', {
  state: () => ({
    ubicacionActual: {
      lat: null,
      lng: null,
    },
    error: null,
    mapContainer: null, // HTML element container
    map: null, // Google Maps instance
    isMapLoaded: false // Flag para saber si el mapa está completamente cargado
  }),
  actions: {
    async obtenerUbicacion(reload = true) {
      try {
        const pos = await Geolocation.getCurrentPosition();
        this.ubicacionActual.lat = pos.coords.latitude;
        this.ubicacionActual.lng = pos.coords.longitude
        if (reload) {
          await this.getMapa()
        }
      } catch (error) {
        this.error = error
      }
    },
    async getMapa() {
      if (!this.mapContainer) {
        console.warn('Map container not set. Call setMapContainer first.');
        return;
      }
      this.isMapLoaded = false;

      try {
        if (this.ubicacionActual.lat && this.ubicacionActual.lng) {
          const data = await loadMapa(
            this.mapContainer,
            this.ubicacionActual,
            'location',
            false
          );
          this.map = data.map;
        } else {
          const data = await loadMapa(this.mapContainer, initLatLng, 'location', false, this.getNewLatLng);
          this.map = data.map;
        }

        // Marcar el mapa como cargado
        this.isMapLoaded = true;
      } catch (error) {
        this.isMapLoaded = false;
      }
    },
    setMapContainer(element) {
      this.mapContainer = element;
    },
  },
  getters: {},
})
