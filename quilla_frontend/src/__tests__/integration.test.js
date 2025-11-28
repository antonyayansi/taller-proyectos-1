import { describe, it, expect, vi } from 'vitest'

describe('Pruebas de Integración', () => {
  describe('Flujo de navegación de sitios', () => {
    it('debe poder buscar sitios por nombre', () => {
      const sitios = [
        { id: 1, nombre: 'Machu Picchu', descripcion: 'Ciudadela inca' },
        { id: 2, nombre: 'Sacsayhuamán', descripcion: 'Fortaleza inca' },
        { id: 3, nombre: 'Qoricancha', descripcion: 'Templo del Sol' }
      ]
      
      const query = 'machu'
      const resultado = sitios.filter(sitio => 
        sitio.nombre.toLowerCase().includes(query.toLowerCase())
      )
      
      expect(resultado).toHaveLength(1)
      expect(resultado[0].nombre).toBe('Machu Picchu')
    })

    it('debe calcular distancia para ordenar sitios', () => {
      const sitios = [
        { id: 1, nombre: 'Sitio A', distancia: 5.5 },
        { id: 2, nombre: 'Sitio B', distancia: 2.3 },
        { id: 3, nombre: 'Sitio C', distancia: 8.1 }
      ]
      
      const ordenados = [...sitios].sort((a, b) => a.distancia - b.distancia)
      
      expect(ordenados[0].nombre).toBe('Sitio B')
      expect(ordenados[1].nombre).toBe('Sitio A')
      expect(ordenados[2].nombre).toBe('Sitio C')
    })
  })

  describe('Flujo de reseñas', () => {
    it('debe validar estructura de nueva reseña', () => {
      const nuevaResenia = {
        users_id: '123',
        name: 'Juan Pérez',
        avatar: 'https://example.com/avatar.jpg',
        sitios_id: '456',
        calificacion: 5,
        comentario: 'Excelente lugar'
      }
      
      expect(nuevaResenia).toHaveProperty('users_id')
      expect(nuevaResenia).toHaveProperty('sitios_id')
      expect(nuevaResenia).toHaveProperty('calificacion')
      expect(nuevaResenia).toHaveProperty('comentario')
      expect(nuevaResenia.calificacion).toBeGreaterThanOrEqual(1)
      expect(nuevaResenia.calificacion).toBeLessThanOrEqual(5)
    })

    it('debe ordenar reseñas por fecha descendente', () => {
      const resenias = [
        { id: 1, created_at: '2024-01-01T10:00:00' },
        { id: 2, created_at: '2024-01-03T10:00:00' },
        { id: 3, created_at: '2024-01-02T10:00:00' }
      ]
      
      const ordenadas = [...resenias].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
      
      expect(ordenadas[0].id).toBe(2)
      expect(ordenadas[1].id).toBe(3)
      expect(ordenadas[2].id).toBe(1)
    })
  })

  describe('Configuración del narrador', () => {
    it('debe tener valores válidos de configuración', () => {
      const config = {
        enabled: true,
        voice: 'es-US-Neural2-B',
        language: 'es-US',
        pitch: 0,
        speakingRate: 1.0,
        volume: 0.8,
        effectsProfile: 'small-bluetooth-speaker-class-device'
      }
      
      expect(config.enabled).toBe(true)
      expect(config.pitch).toBeGreaterThanOrEqual(-20)
      expect(config.pitch).toBeLessThanOrEqual(20)
      expect(config.speakingRate).toBeGreaterThan(0)
      expect(config.volume).toBeGreaterThanOrEqual(0)
      expect(config.volume).toBeLessThanOrEqual(1)
    })
  })
})
