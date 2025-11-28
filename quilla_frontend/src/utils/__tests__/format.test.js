import { describe, it, expect } from 'vitest'
import { format } from 'date-fns'

describe('Utilidades de Formato', () => {
  describe('format (date-fns)', () => {
    it('debe formatear fechas correctamente', () => {
      const date = new Date('2024-11-28T10:30:00')
      const formatted = format(date, 'dd/MM/yyyy')
      expect(formatted).toBe('28/11/2024')
    })

    it('debe formatear fechas con hora', () => {
      const date = new Date('2024-11-28T10:30:00')
      const formatted = format(date, 'dd/MM/yyyy HH:mm')
      expect(formatted).toBe('28/11/2024 10:30')
    })

    it('debe manejar diferentes formatos', () => {
      const date = new Date('2024-11-28T12:00:00Z')
      
      expect(format(date, 'yyyy-MM-dd')).toMatch(/2024-11-(27|28)/)
      expect(format(date, 'dd-MM-yyyy')).toMatch(/(27|28)-11-2024/)
      expect(format(date, 'MM/dd/yyyy')).toMatch(/11\/(27|28)\/2024/)
    })
  })
})
