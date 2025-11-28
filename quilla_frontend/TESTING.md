# Pruebas Unitarias - Quilla Frontend

## 📋 Resumen

Este proyecto incluye pruebas unitarias completas utilizando **Vitest**, el framework de testing recomendado para proyectos Vite + Vue 3.

## 🧪 Cobertura de Pruebas

### Componentes Vue
- ✅ **HelloWorld.vue** - Componente de bienvenida
- ✅ **Menu.vue** - Menú de navegación
- ✅ **AudioPlayer.vue** - Reproductor de audio

### Stores (Pinia)
- ✅ **sitios.js** - Store de sitios turísticos
  - Inicialización de estado
  - Búsqueda de sitios
  - Filtrado por nombre y descripción
  - Manejo de reseñas

### Servicios
- ✅ **gps.js** - Cálculo de distancias
- ✅ **supabase.js** - Cliente de Supabase

### Utilidades
- ✅ **format** - Formateo de fechas con date-fns

### Integración
- ✅ Flujo de navegación de sitios
- ✅ Flujo de reseñas
- ✅ Configuración del narrador

## 🚀 Comandos de Prueba

### Ejecutar todas las pruebas (modo watch)
```bash
pnpm test
```

### Ejecutar pruebas una sola vez
```bash
pnpm test:run
```

### Ejecutar pruebas con interfaz UI
```bash
pnpm test:ui
```

### Generar reporte de cobertura
```bash
pnpm test:coverage
```

## 📁 Estructura de Pruebas

```
src/
├── __tests__/
│   └── integration.test.js           # Pruebas de integración
├── components/
│   └── __tests__/
│       └── HelloWorld.test.js        # Prueba del componente HelloWorld
├── app/
│   ├── components/
│   │   └── __tests__/
│   │       ├── Menu.test.js          # Prueba del menú
│   │       └── AudioPlayer.test.js   # Prueba del reproductor
│   └── modules/
│       └── home/
│           └── store/
│               └── __tests__/
│                   └── sitios.test.js # Prueba del store de sitios
├── services/
│   └── __tests__/
│       ├── gps.test.js               # Prueba del servicio GPS
│       └── supabase.test.js          # Prueba del cliente Supabase
└── utils/
    └── __tests__/
        └── format.test.js            # Prueba de utilidades de formato
```

## 🔧 Configuración

La configuración de Vitest está en `vitest.config.js` e incluye:
- Entorno: **happy-dom** (simula DOM para pruebas de componentes Vue)
- Cobertura: proveedor **v8** con reportes en texto, JSON y HTML
- Exclusiones: archivos e2e y configuraciones por defecto

## 📊 Tipos de Pruebas

### 1. Pruebas Unitarias de Componentes
Verifican que los componentes Vue rendericen correctamente y respondan a props.

### 2. Pruebas de Store (Pinia)
Verifican la lógica de negocio, estado y mutaciones del store.

### 3. Pruebas de Servicios
Verifican funciones utilitarias y servicios externos.

### 4. Pruebas de Integración
Verifican flujos completos de la aplicación.

## 🎯 Buenas Prácticas

1. **Aislamiento**: Cada prueba es independiente
2. **Mocks**: Se utilizan mocks para dependencias externas
3. **Descriptivo**: Nombres claros de pruebas usando "debe..."
4. **AAA Pattern**: Arrange, Act, Assert en cada prueba

## 🐛 Debugging

Para depurar pruebas específicas:

```bash
# Ejecutar un archivo específico
pnpm test src/components/__tests__/HelloWorld.test.js

# Ejecutar pruebas que coincidan con un patrón
pnpm test -t "debe renderizar"

# Modo debug
pnpm test --inspect-brk
```

## 📈 Próximos Pasos

- [ ] Aumentar cobertura de pruebas a 80%+
- [ ] Agregar pruebas E2E con Playwright
- [ ] Integrar pruebas en CI/CD
- [ ] Agregar pruebas de accesibilidad
- [ ] Pruebas de rendimiento

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Pinia Stores](https://pinia.vuejs.org/cookbook/testing.html)
