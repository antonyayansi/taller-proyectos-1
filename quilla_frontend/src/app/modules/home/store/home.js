import { defineStore } from 'pinia'
import { Geolocation } from '@capacitor/geolocation'
import { addMarker, loadMapa, calculateDistance } from '@/services/gps';
import { Network } from '@capacitor/network';
import { toast } from 'vue-sonner';

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
    isMapLoaded: false, // Flag para saber si el mapa está completamente cargado
    watchId: null, // ID del watcher de ubicación en tiempo real
    currentMarker: null, // Marcador de la ubicación actual
    
    // Control de proximidad a sitios turísticos
    notifiedSites: new Set(), // Sitios sobre los que ya se notificó
    proximityThreshold: 100, // Distancia en metros para activar notificación

    // Configuración del narrador
    narratorConfig: {
      enabled: true,
      voice: 'es-US-Neural2-B',
      language: 'es-US',
      pitch: 0,
      speakingRate: 1.0,
      volume: 0.8,
      effectsProfile: 'small-bluetooth-speaker-class-device'
    },

    // Reproductor de audio global
    audioPlayer: {
      audio: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      title: '',
      loading: false,
      audioBlob: null // Guardar el blob para poder guardarlo
    },
    statusNetwork: true,
  }),
  actions: {
    async checkNetwork() {
      Network.addListener('networkStatusChange', status => {
        this.statusNetwork = status;
      });
    },
    // Inicializar configuración del narrador
    init() {
      this.loadNarratorConfig();
    },

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

    // Iniciar seguimiento en tiempo real de la ubicación
    async startWatchingPosition() {
      try {
        // Si ya hay un watcher activo, detenerlo primero
        if (this.watchId !== null) {
          await this.stopWatchingPosition();
        }

        // Obtener ubicación inicial
        await this.obtenerUbicacion(true);

        // Iniciar seguimiento en tiempo real
        this.watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          },
          (position, err) => {
            if (err) {
              console.error('Error en watchPosition:', err);
              this.error = err;
              return;
            }

            if (position) {
              // Actualizar ubicación actual
              this.ubicacionActual.lat = position.coords.latitude;
              this.ubicacionActual.lng = position.coords.longitude;

              // Actualizar marcador en el mapa si existe
              if (this.currentMarker && this.map) {
                this.currentMarker.position = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };

                // Centrar el mapa en la nueva posición (opcional, puedes comentar esto si no quieres que se centre automáticamente)
                this.map.panTo({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                });
              }

              // Verificar proximidad a sitios turísticos
              this.checkNearbyTouristSpots();
            }
          }
        );

        console.log('Seguimiento de ubicación iniciado con ID:', this.watchId);
      } catch (error) {
        console.error('Error al iniciar seguimiento de ubicación:', error);
        this.error = error;
      }
    },

    // Detener seguimiento de ubicación
    async stopWatchingPosition() {
      if (this.watchId !== null) {
        await Geolocation.clearWatch({ id: this.watchId });
        this.watchId = null;
        this.notifiedSites.clear(); // Limpiar sitios notificados
        console.log('Seguimiento de ubicación detenido');
      }
    },

    // Verificar proximidad a sitios turísticos
    async checkNearbyTouristSpots() {
      // Importar el store de sitios dinámicamente para evitar dependencias circulares
      const { sitios } = await import('./sitios');
      const sitiosStore = sitios();
      
      if (!this.ubicacionActual.lat || !this.ubicacionActual.lng) {
        return;
      }

      if (!sitiosStore.sitios || sitiosStore.sitios.length === 0) {
        return;
      }

      // Verificar cada sitio turístico
      for (const sitio of sitiosStore.sitios) {
        try {
          const distance = await calculateDistance(
            this.ubicacionActual.lat,
            this.ubicacionActual.lng,
            sitio.lat,
            sitio.lng
          );

          // Si está dentro del rango y no se ha notificado antes
          if (distance <= this.proximityThreshold && !this.notifiedSites.has(sitio.id)) {
            this.notifiedSites.add(sitio.id);
            
            // Mostrar notificación
            toast.success(`¡Estás cerca de ${sitio.nombre}!`, {
              description: `A ${distance.toFixed(0)} metros. Reproduciendo audio...`,
              duration: 5000,
            });

            // Reproducir audio del sitio si está disponible
            if (sitio.descripcion) {
              await sitiosStore.textToSpeech(
                sitio.descripcion,
                sitio.nombre,
                false,
                sitio.id
              );
            }
          }
          
          // Si se aleja más de 200 metros, permitir notificar nuevamente
          if (distance > this.proximityThreshold * 2 && this.notifiedSites.has(sitio.id)) {
            this.notifiedSites.delete(sitio.id);
          }
        } catch (error) {
          console.error(`Error calculando distancia para ${sitio.nombre}:`, error);
        }
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
          this.currentMarker = data.marker; // Guardar referencia al marcador
        } else {
          const data = await loadMapa(this.mapContainer, initLatLng, 'location', false, this.getNewLatLng);
          this.map = data.map;
          this.currentMarker = data.marker; // Guardar referencia al marcador
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

    // Métodos para configuración del narrador
    loadNarratorConfig() {
      const savedConfig = localStorage.getItem('narrator-config');
      if (savedConfig) {
        this.narratorConfig = { ...this.narratorConfig, ...JSON.parse(savedConfig) };
      }
    },

    saveNarratorConfig() {
      localStorage.setItem('narrator-config', JSON.stringify(this.narratorConfig));
    },

    updateNarratorConfig(newConfig) {
      this.narratorConfig = { ...this.narratorConfig, ...newConfig };
      this.saveNarratorConfig();
    },

    resetNarratorConfig() {
      this.narratorConfig = {
        enabled: true,
        voice: 'es-US-Neural2-B',
        language: 'es-US',
        pitch: 0,
        speakingRate: 1.0,
        volume: 0.8,
        effectsProfile: 'small-bluetooth-speaker-class-device'
      };
      this.saveNarratorConfig();
    },

    // Métodos del reproductor de audio
    playAudio(audioBlob, title = '') {
      // Detener audio anterior si existe
      this.stopAudio();

      // Crear nuevo audio
      const audioUrl = URL.createObjectURL(audioBlob);
      this.audioPlayer.audio = new Audio(audioUrl);
      this.audioPlayer.audio.volume = this.narratorConfig.volume;
      this.audioPlayer.title = title;
      this.audioPlayer.audioBlob = audioBlob; // Guardar el blob

      // Event listeners
      this.audioPlayer.audio.addEventListener('loadedmetadata', () => {
        this.audioPlayer.duration = this.audioPlayer.audio.duration;
      });

      this.audioPlayer.audio.addEventListener('timeupdate', () => {
        this.audioPlayer.currentTime = this.audioPlayer.audio?.currentTime;
      });

      this.audioPlayer.audio.addEventListener('ended', () => {
        this.audioPlayer.isPlaying = false;
        this.audioPlayer.currentTime = 0;
      });

      this.audioPlayer.audio.addEventListener('play', () => {
        this.audioPlayer.isPlaying = true;
      });

      this.audioPlayer.audio.addEventListener('pause', () => {
        this.audioPlayer.isPlaying = false;
      });

      // Reproducir
      this.audioPlayer.audio.play();
      this.audioPlayer.isPlaying = true;
    },

    togglePlayPause() {
      if (!this.audioPlayer.audio) return;

      if (this.audioPlayer.isPlaying) {
        this.audioPlayer.audio.pause();
      } else {
        this.audioPlayer.audio.play();
      }
    },

    stopAudio() {
      if (this.audioPlayer.audio) {
        this.audioPlayer.audio.pause();
        this.audioPlayer.audio.currentTime = 0;
        this.audioPlayer.audio = null;
        this.audioPlayer.isPlaying = false;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.duration = 0;
        this.audioPlayer.title = '';
        this.audioPlayer.audioBlob = null;
      }
    },

    async saveCurrentAudio() {
      if (!this.audioPlayer.audioBlob) {
        throw new Error('No hay audio para guardar');
      }

      try {
        // Importar dinámicamente para evitar problemas de dependencias circulares
        const { Filesystem, Directory } = await import('@capacitor/filesystem');

        // Convertir blob a base64
        const reader = new FileReader();
        const base64Data = await new Promise((resolve, reject) => {
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(this.audioPlayer.audioBlob);
        });

        // Generar nombre de archivo único
        const timestamp = Date.now();
        const sanitizedTitle = this.audioPlayer.title
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase()
          .substring(0, 50);
        const fileName = `${sanitizedTitle}_${timestamp}.mp3`;

        // Guardar archivo
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Data,
        });

        return fileName;
      } catch (error) {
        console.error('Error al guardar audio:', error);
        throw error;
      }
    },

    seekAudio(time) {
      if (this.audioPlayer.audio && isFinite(time) && !isNaN(time) && time >= 0) {
        this.audioPlayer.audio.currentTime = time;
      }
    },

    setVolume(volume) {
      if (this.audioPlayer.audio) {
        this.audioPlayer.audio.volume = volume;
      }
      this.narratorConfig.volume = volume;
      this.saveNarratorConfig();
    },

    setLoading(loading) {
      this.audioPlayer.loading = loading;
    }
  },
  getters: {},
})
