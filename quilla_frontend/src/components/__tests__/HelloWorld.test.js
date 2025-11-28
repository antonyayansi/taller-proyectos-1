import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld Component', () => {
  it('debe renderizar correctamente', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test Message'
      }
    })
    
    expect(wrapper.text()).toContain('Test Message')
  })

  it('debe mostrar el mensaje pasado como prop', () => {
    const testMessage = 'Hola Mundo'
    const wrapper = mount(HelloWorld, {
      props: {
        msg: testMessage
      }
    })
    
    const h1 = wrapper.find('h1')
    expect(h1.text()).toBe(testMessage)
  })

  it('debe tener la clase green en el h1', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test'
      }
    })
    
    const h1 = wrapper.find('h1')
    expect(h1.classes()).toContain('green')
  })

  it('debe mostrar información sobre Vite y Vue 3', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test'
      }
    })
    
    expect(wrapper.text()).toContain('Vite')
    expect(wrapper.text()).toContain('Vue 3')
  })
})
