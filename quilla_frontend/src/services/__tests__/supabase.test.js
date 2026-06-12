import { describe, it, expect } from 'vitest'
import { supabase } from '../supabase/supabase'

describe('Supabase Service', () => {
  it('debe tener el cliente de supabase inicializado', () => {
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
    expect(supabase.from).toBeDefined()
  })

  it('debe tener las propiedades necesarias del cliente', () => {
    expect(typeof supabase.from).toBe('function')
    expect(typeof supabase.auth.signInWithPassword).toBe('function')
    expect(typeof supabase.auth.signOut).toBe('function')
  })
})
