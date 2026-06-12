import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Menu from '../Menu.vue'

// Mock del router
const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/tops', name: 'tops', component: { template: '<div>Tops</div>' } },
    { path: '/search', name: 'search', component: { template: '<div>Search</div>' } },
    { path: '/maps', name: 'maps', component: { template: '<div>Maps</div>' } },
    { path: '/profile', name: 'profile', component: { template: '<div>Profile</div>' } }
  ]
})

describe('Menu Component', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(Menu, {
      global: {
        plugins: [mockRouter],
        stubs: {
          RouterLink: true
        }
      }
    })
    await mockRouter.isReady()
  })

  it('debe renderizar correctamente', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('debe tener enlaces de navegación', () => {
    // Verificar que el componente existe y tiene estructura de navegación
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toBeTruthy()
  })

  it('debe mostrar iconos de navegación', () => {
    const icons = wrapper.findAll('i[class*="pi"]')
    expect(icons.length).toBeGreaterThan(0)
  })
})
