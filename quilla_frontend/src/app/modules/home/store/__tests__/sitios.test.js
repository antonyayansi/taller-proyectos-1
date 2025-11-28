import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock de las dependencias ANTES de importar el store
vi.mock('@/services/gps', () => ({
  addMarker: vi.fn(),
  calculateDistance: vi.fn(() => Promise.resolve(5.5))
}))

vi.mock('@/services/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        })),
        order: vi.fn()
      })),
      insert: vi.fn()
    }))
  }
}))

vi.mock('@capacitor/filesystem', () => ({
  Filesystem: {
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn()
  },
  Directory: {
    Data: 'DATA'
  }
}))

// Mock de los hooks que usan el store
vi.mock('../../hooks/useHome', () => ({
  default: () => ({
    ubicacionActual: { value: { lat: 0, lng: 0 } },
    obtenerUbicacion: vi.fn()
  })
}))

vi.mock('../../../auth/hooks/useAuth', () => ({
  default: () => ({
    user: { value: null }
  })
}))

// Mock del store home
vi.mock('../home', () => ({
  home: vi.fn(() => ({
    loadNarratorConfig: vi.fn(),
    narratorConfig: {
      enabled: false
    },
    setLoading: vi.fn(),
    playAudio: vi.fn()
  }))
}))

// Ahora sí importamos el store
import { sitios } from '../sitios'

describe('Store: Sitios', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debe inicializar con el estado correcto', () => {
    const store = sitios()
    
    expect(store.sitios).toEqual([])
    expect(store.sitiosbk).toEqual([])
    expect(store.sitioActive).toBeNull()
    expect(store.resenias).toEqual([])
    expect(store.loadingResenias).toBe(false)
    expect(store.openNewReseniaModal).toBe(false)
  })

  it('debe tener la estructura correcta de new_resenia', () => {
    const store = sitios()
    
    expect(store.new_resenia).toHaveProperty('users_id')
    expect(store.new_resenia).toHaveProperty('name')
    expect(store.new_resenia).toHaveProperty('avatar')
    expect(store.new_resenia).toHaveProperty('sitios_id')
    expect(store.new_resenia).toHaveProperty('calificacion')
    expect(store.new_resenia).toHaveProperty('comentario')
    expect(store.new_resenia.calificacion).toBe(1)
  })

  it('debe filtrar sitios correctamente con searchSitios', () => {
    const store = sitios()
    
    store.sitiosbk = [
      { id: 1, nombre: 'Machu Picchu', descripcion: 'Sitio arqueológico' },
      { id: 2, nombre: 'Sacsayhuamán', descripcion: 'Fortaleza inca' },
      { id: 3, nombre: 'Plaza de Armas', descripcion: 'Plaza principal' }
    ]
    
    store.searchSitios('Machu')
    expect(store.sitios).toHaveLength(1)
    expect(store.sitios[0].nombre).toBe('Machu Picchu')
  })

  it('debe restaurar todos los sitios cuando la búsqueda está vacía', () => {
    const store = sitios()
    
    store.sitiosbk = [
      { id: 1, nombre: 'Machu Picchu', descripcion: 'Sitio arqueológico' },
      { id: 2, nombre: 'Sacsayhuamán', descripcion: 'Fortaleza inca' }
    ]
    
    store.searchSitios('Machu')
    expect(store.sitios).toHaveLength(1)
    
    store.searchSitios('')
    expect(store.sitios).toHaveLength(2)
  })

  it('debe buscar en nombre y descripción', () => {
    const store = sitios()
    
    store.sitiosbk = [
      { id: 1, nombre: 'Machu Picchu', descripcion: 'Sitio arqueológico' },
      { id: 2, nombre: 'Sacsayhuamán', descripcion: 'Fortaleza inca' }
    ]
    
    store.searchSitios('arqueológico')
    expect(store.sitios).toHaveLength(1)
    expect(store.sitios[0].id).toBe(1)
  })

  it('debe ser case-insensitive en la búsqueda', () => {
    const store = sitios()
    
    store.sitiosbk = [
      { id: 1, nombre: 'Machu Picchu', descripcion: 'Sitio arqueológico' }
    ]
    
    store.searchSitios('MACHU')
    expect(store.sitios).toHaveLength(1)
    
    store.searchSitios('machu')
    expect(store.sitios).toHaveLength(1)
  })
})
