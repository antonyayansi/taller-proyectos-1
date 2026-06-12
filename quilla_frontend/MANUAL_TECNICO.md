# 📘 Manual Técnico — Quilla

## 1. Presentación del Sistema

| Campo | Detalle |
|---|---|
| **Nombre** | Quilla |
| **Versión** | 0.0.0 |
| **Autor(es)** | Equipo Taller de Proyectos 1 |
| **Repositorio** | `https://github.com/antonyayansi/taller-proyectos-1/` |
| **Fecha** | Mayo 2026 |
| **Objetivo** | Aplicación web y móvil para descubrir, explorar y compartir sitios turísticos de Cusco, con mapa interactivo, narrador por IA, asistente virtual y comunidad social |

---

## 2. Tecnologías Utilizadas

| Tecnología | Uso | Versión |
|---|---|---|
| **Vue.js 3** | Framework frontend (Composition API) | ^3.5.18 |
| **Vite** | Bundler y dev server | ^7.0.6 |
| **Pinia** | Manejo de estado global | ^3.0.3 |
| **Vue Router** | Navegación SPA | ^4.5.1 |
| **PrimeVue** | Componentes UI | ^4.3.9 |
| **Tailwind CSS** | Estilos utilitarios | ^4.1.13 |
| **Supabase** | Backend-as-a-Service (Auth, DB, RLS) | ^2.57.4 |
| **Capacitor** | App nativa Android | ^7.4.3 |
| **AWS S3** | Almacenamiento de imágenes | @aws-sdk/client-s3 ^3.943.0 |
| **Google Maps API** | Mapas interactivos y geolocalización | @googlemaps/js-api-loader ^2.0.1 |
| **Google TTS API** | Text-to-Speech (narrador) | REST API v1beta1 |
| **DeepSeek API** | Asistente IA conversacional | REST API |
| **OpenAI GPT-4o-mini** | Análisis de imágenes turísticas | REST API |
| **VueUse** | Utilidades reactivas (dark mode) | ^13.9.0 |
| **vue-sonner** | Notificaciones toast | ^2.0.9 |
| **date-fns** | Manejo de fechas | ^4.1.0 |
| **md-editor-v3** | Renderizado de Markdown | ^6.2.0 |
| **Vitest** | Testing unitario | ^4.0.14 |
| **pnpm** | Gestor de paquetes | - |

---

## 3. Arquitectura del Sistema

Quilla sigue una **arquitectura modular por features** con separación por capas dentro de cada módulo.

```
┌──────────────────────────────────────────────────┐
│                   USUARIO                        │
│          (Navegador Web / Android APK)           │
└─────────────────────┬────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│            CAPA DE PRESENTACIÓN                  │
│   Vue 3 + PrimeVue + Tailwind CSS + Capacitor   │
│   (Views, Components, Layouts)                   │
└─────────────────────┬────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO                │
│   Pinia Stores + Composables (Hooks)             │
│   (auth.js, home.js, sitios.js, tops.js, etc.)   │
└─────────────────────┬────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│          CAPA DE SERVICIOS EXTERNOS              │
│  supabase.js │ aws.js │ gps.js │ deepseek.js    │
│  openai.js   │ upload.js                         │
└─────────┬───────┬───────┬───────┬────────────────┘
          │       │       │       │
          ▼       ▼       ▼       ▼
   ┌─────────┐ ┌─────┐ ┌──────┐ ┌─────────┐
   │Supabase │ │ AWS │ │Google│ │DeepSeek │
   │  (DB +  │ │ S3  │ │Maps +│ │+ OpenAI │
   │  Auth)  │ │     │ │ TTS  │ │  (IA)   │
   └─────────┘ └─────┘ └──────┘ └─────────┘
```

---

## 4. Estructura del Proyecto

```
📁 quilla_frontend/
├── 📄 index.html                    # Punto de entrada HTML
├── 📄 package.json                  # Dependencias y scripts
├── 📄 vite.config.js                # Configuración de Vite
├── 📄 capacitor.config.json         # Config Capacitor (Android)
├── 📄 vitest.config.js              # Config de testing
├── 📄 supabase_roles_setup.sql      # Script SQL de roles/perfiles
├── 📄 .env                          # Variables de entorno
├── 📁 android/                      # Proyecto Android nativo
├── 📁 public/                       # Assets estáticos
├── 📁 docs/                         # Documentación adicional
│   ├── AI_ASSISTANT.md
│   ├── SEARCH_FEATURE.md
│   └── testing_report.md
│
└── 📁 src/
    ├── 📄 main.js                   # Entry point (plugins, Pinia, PrimeVue)
    ├── 📄 App.vue                   # Componente raíz + deep link handler
    │
    ├── 📁 assets/
    │   └── main.css                 # Tailwind + tema (paleta teal)
    │
    ├── 📁 themes/
    │   └── Quilla.js                # Preset PrimeVue (Aura + teal)
    │
    ├── 📁 router/
    │   └── index.js                 # Router principal (delega a app/router)
    │
    ├── 📁 services/                 # Servicios externos
    │   ├── 📁 supabase/
    │   │   └── supabase.js          # Cliente Supabase
    │   ├── aws.js                   # Upload/Delete S3
    │   ├── upload.js                # Upload de imágenes de posts
    │   ├── gps.js                   # Google Maps + geolocalización
    │   ├── deepseek.js              # Chat IA (DeepSeek)
    │   └── openai.js                # Análisis de imágenes (GPT-4o)
    │
    ├── 📁 components/               # Componentes globales (scaffold Vue)
    │
    └── 📁 app/                      # Aplicación principal
        ├── 📁 layouts/
        │   └── Layout.vue           # Layout con <Menu> y <AudioPlayer>
        │
        ├── 📁 components/           # Componentes compartidos de app
        │   ├── Menu.vue             # Barra de navegación inferior
        │   ├── AudioPlayer.vue      # Reproductor global de audio
        │   └── AIAssistant.vue      # Chatbot IA flotante
        │
        ├── 📁 router/
        │   └── index.js             # Rutas de la app (home, search, tops, profile)
        │
        └── 📁 modules/              # Módulos por feature
            ├── 📁 auth/             # Autenticación
            ├── 📁 home/             # Explorador + sitios turísticos
            ├── 📁 search/           # Búsqueda por imagen (IA)
            ├── 📁 tops/             # Red social (publicaciones)
            ├── 📁 profile/          # Perfil + favoritos + config
            └── 📁 admin/            # Panel administrativo
```

### Estructura interna de cada módulo

```
📁 modules/[modulo]/
├── 📁 views/       # Componentes de página (vistas)
├── 📁 components/  # Componentes específicos del módulo
├── 📁 store/       # Pinia stores (lógica de negocio + acceso a datos)
├── 📁 hooks/       # Composables (puente entre store y componentes)
├── 📁 router/      # Rutas del módulo (si aplica)
└── 📁 layouts/     # Layouts del módulo (si aplica)
```

---

## 5. Instalación del Proyecto

### Requisitos

| Software | Versión |
|---|---|
| Node.js | ^20.19.0 o >=22.12.0 |
| pnpm | Última versión estable |
| Android Studio | Para compilar APK (opcional) |

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/antonyayansi/taller-proyectos-1/
cd quilla_frontend

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las claves reales (ver sección Variables de Entorno)

# 4. Iniciar servidor de desarrollo
pnpm dev
# La app estará en http://localhost:5173

# 5. (Opcional) Compilar para Android
pnpm android
```

### Variables de Entorno (`.env`)

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_KEY` | Project ID de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon Key de Supabase |
| `VITE_GOOGLE_MAPS_KEY` | API Key de Google (Maps + TTS) |
| `VITE_URL_RETURN` | URL de retorno para OAuth |
| `VITE_AWS_ACCESS_KEY_ID` | Access Key de AWS S3 |
| `VITE_AWS_SECRET_ACCESS_KEY` | Secret Key de AWS S3 |
| `VITE_OPENAI_API_KEY` | API Key de OpenAI (análisis de imagen) |

### Scripts Disponibles

| Script | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Preview del build de producción |
| `pnpm test` | Ejecutar tests con Vitest |
| `pnpm test:ui` | Tests con interfaz visual |
| `pnpm test:coverage` | Tests con cobertura |
| `pnpm format` | Formatear código con Prettier |
| `pnpm android` | Build + sync + run en Android |

---

## 6. Base de Datos (Supabase / PostgreSQL)

### Tablas Principales

| Tabla | Descripción | Campos Clave |
|---|---|---|
| `perfiles` | Perfiles de usuario (sincronizado con auth.users) | `id (PK, FK→auth.users)`, `rol`, `nombre`, `email`, `avatar` |
| `sitios` | Sitios turísticos registrados | `id (PK)`, `nombre`, `descripcion`, `lat`, `lng`, `categorias_id (FK)`, `horarios` |
| `categorias` | Categorías de sitios turísticos | `id (PK)`, `nombre`, `created_at` |
| `imagenes_sitio` | Imágenes asociadas a sitios | `id (PK)`, `sitios_id (FK→sitios)`, `url` |
| `rutas` | Rutas de navegación de sitios | `id (PK)`, `sitios_id (FK→sitios)`, `nombre`, ... |
| `favoritos` | Sitios marcados como favoritos | `id (PK)`, `users_id (FK)`, `sitios_id (FK→sitios)` |
| `resenias` | Reseñas de sitios turísticos | `id (PK)`, `users_id`, `sitios_id (FK)`, `calificacion`, `comentario`, `name`, `avatar` |
| `publicaciones` | Posts de la comunidad (Tops) | `id (PK)`, `users_id (FK)`, `texto`, `imagen`, `ubicacion`, `likes`, `created_at` |
| `comentarios_publicaciones` | Comentarios en publicaciones | `id (PK)`, `publicacion_id (FK)`, `users_id (FK)`, `texto`, `created_at` |

### Relaciones

| Tabla Origen | Tabla Destino | Tipo | FK |
|---|---|---|---|
| `perfiles` | `auth.users` | 1:1 | `perfiles.id → auth.users.id` |
| `sitios` | `categorias` | N:1 | `sitios.categorias_id → categorias.id` |
| `imagenes_sitio` | `sitios` | N:1 | `imagenes_sitio.sitios_id → sitios.id` |
| `rutas` | `sitios` | N:1 | `rutas.sitios_id → sitios.id` |
| `favoritos` | `sitios` | N:1 | `favoritos.sitios_id → sitios.id` |
| `resenias` | `sitios` | N:1 | `resenias.sitios_id → sitios.id` |
| `publicaciones` | `perfiles` | N:1 | `publicaciones.users_id → perfiles.id` |
| `comentarios_publicaciones` | `publicaciones` | N:1 | `comentarios_publicaciones.publicacion_id → publicaciones.id` |

### Roles del Sistema

| Rol | Valor en BD | Descripción |
|---|---|---|
| Público | `publico` | Acceso limitado, sin autenticar |
| Usuario | `usuario` | Rol por defecto al registrarse |
| Guía | `guia` | Puede crear sitios turísticos y subir imágenes |
| Administrador | `administrador` | Gestión de usuarios, roles y categorías |

### Row Level Security (RLS)

- `perfiles`: SELECT público para todos; UPDATE solo por administradores
- Trigger `handle_new_user()`: Crea automáticamente un perfil al registrarse un usuario con datos de Google (nombre, email, avatar)

### Script SQL de Configuración

Archivo: `supabase_roles_setup.sql` — Contiene:
1. Creación/alteración de tabla `perfiles` con columnas `nombre`, `email`, `avatar`
2. Políticas RLS para lectura pública y escritura por admin
3. Trigger para crear perfiles automáticamente al registrar usuario
4. Script de migración para perfiles existentes

---

## 7. Módulos del Sistema

### 7.1 Módulo Auth (Autenticación)

| Elemento | Detalle |
|---|---|
| **Ruta** | `src/app/modules/auth/` |
| **Store** | `auth.js` — Estado: `user` |
| **Proveedor** | Google OAuth via Supabase |
| **Funciones** | `getUser()`, `logout()` |
| **Tablas** | `auth.users`, `perfiles` |
| **Deep Links** | `quilla://auth/callback` (Capacitor) |

### 7.2 Módulo Home (Explorador de Sitios)

| Elemento | Detalle |
|---|---|
| **Ruta** | `src/app/modules/home/` |
| **Vistas** | `Home.vue`, `SitioDetail.vue`, `SitioNavigate.vue` |
| **Stores** | `home.js` (mapa, GPS, audio), `sitios.js` (CRUD sitios, TTS), `navigate.js` (navegación) |
| **Componentes** | `Resenias.vue`, `Rutas.vue` |
| **Rutas** | `/` (listado), `/sitio/:id` (detalle), `/sitio/:id/navigate` (navegación) |
| **Tablas** | `sitios`, `categorias`, `imagenes_sitio`, `rutas`, `resenias` |
| **APIs externas** | Google Maps, Google TTS, DeepSeek |
| **Funciones principales** | Geolocalización en tiempo real, cálculo de distancia (Haversine), marcadores personalizados en mapa, Text-to-Speech configurable, detección de proximidad a sitios, reproductor de audio global, guardado de audios en filesystem |

### 7.3 Módulo Search (Búsqueda por Imagen con IA)

| Elemento | Detalle |
|---|---|
| **Ruta** | `src/app/modules/search/` |
| **Vista** | `viewSearch.vue` |
| **APIs** | OpenAI GPT-4o-mini (análisis de imagen), OpenAI TTS (narración) |
| **Funciones** | Captura de foto (cámara/galería vía Capacitor Camera), análisis IA de imagen, renderizado Markdown del resultado, narración TTS, caché local de análisis (SHA-256 hash) |
| **Tablas** | Ninguna (funciona con APIs externas) |

### 7.4 Módulo Tops (Comunidad Social)

| Elemento | Detalle |
|---|---|
| **Ruta** | `src/app/modules/tops/` |
| **Vistas** | `viewTop.vue` (feed), `PostDetail.vue` (detalle + comentarios) |
| **Store** | `tops.js` |
| **Rutas** | `/tops` (feed), `/tops/:id` (detalle) |
| **Tablas** | `publicaciones`, `comentarios_publicaciones`, `perfiles` |
| **Funciones** | Crear/eliminar publicaciones, subir imagen a S3, dar like (único por usuario, persistido en localStorage), comentar, eliminar comentarios propios |

### 7.5 Módulo Profile (Perfil de Usuario)

| Elemento | Detalle |
|---|---|
| **Ruta** | `src/app/modules/profile/` |
| **Vista** | `viewProfile.vue` |
| **Store** | `perfil.js` |
| **Componentes** | `Options.vue`, `Favoritos.vue`, `Audios.vue`, `NarratorConfig.vue` |
| **Tablas** | `perfiles`, `favoritos`, `sitios` |
| **Funciones** | Ver perfil Google, toggle modo oscuro, gestionar favoritos, listar/reproducir/eliminar audios guardados, configurar narrador (voz, velocidad, pitch, perfil de audio) |

### 7.6 Módulo Admin (Administración)

| Elemento | Detalle |
|---|---|
| **Ruta** | `src/app/modules/admin/` |
| **Stores** | `admin.js` (usuarios + categorías), `guia.js` (sitios turísticos) |
| **Componentes** | `AdminUsuarios.vue`, `AdminCategorias.vue`, `GuiaSitios.vue`, `GuiaImagenes.vue` |
| **Tablas** | `perfiles`, `categorias`, `sitios`, `imagenes_sitio` |

**Panel Administrador:**
- CRUD de usuarios (cambiar roles)
- CRUD de categorías (tablas maestras)

**Panel Guía:**
- Crear sitios turísticos (nombre, descripción, categoría, coordenadas vía mapa interactivo, horarios)
- Subir múltiples imágenes a AWS S3
- Eliminar sitios

---

## 8. Interfaces y Navegación

### Barra de navegación inferior (`Menu.vue`)

| Ícono | Ruta | Módulo |
|---|---|---|
| 🏠 Home | `/` | Explorador de sitios |
| 📷 Cámara | `/search` | Búsqueda por imagen IA |
| #️⃣ Tops | `/tops` | Comunidad social |
| 👤 Perfil | `/profile` | Perfil y configuración |

### Mapa de navegación

```
viewProfile.vue (Login con Google / Perfil)
  │
  ├──► Home.vue (Mapa + listado de sitios)
  │     ├──► SitioDetail.vue (Detalle del sitio)
  │     │     ├──► Resenias.vue (Reseñas)
  │     │     ├──► AIAssistant.vue (Chat IA flotante)
  │     │     └──► SitioNavigate.vue (Navegación con mapa)
  │     └──► Rutas.vue
  │
  ├──► viewSearch.vue (Cámara → Análisis IA)
  │
  ├──► viewTop.vue (Feed de publicaciones)
  │     └──► PostDetail.vue (Detalle + comentarios)
  │
  └──► viewProfile.vue (Opciones del perfil)
        ├──► Favoritos (Drawer)
        ├──► Audios (Drawer)
        ├──► NarratorConfig (Drawer)
        ├──► [Guía] GuiaSitios + GuiaImagenes (Drawers)
        └──► [Admin] AdminUsuarios + AdminCategorias (Drawers)
```

### Componentes PrimeVue utilizados

| Componente | Uso |
|---|---|
| `Button` | Botones de acción en toda la app |
| `Avatar` | Foto de perfil del usuario |
| `ToggleSwitch` | Switch de modo oscuro |
| `Drawer` | Paneles deslizantes (favoritos, audios, admin) |
| `InputText` | Campos de texto (chat IA, comentarios) |
| `Tooltip` | Tooltips informativos |
| `ConfirmationService` | Confirmación de acciones destructivas |

---

## 9. Seguridad

### Autenticación
- **Proveedor:** Google OAuth 2.0 via Supabase Auth
- **Flujo:** PKCE (code exchange) para Capacitor, implicit flow como fallback
- **Deep Link Android:** `quilla://auth/callback`
- **Persistencia:** Token almacenado por Supabase en localStorage

### Roles y Permisos (RBAC)

| Funcionalidad | público | usuario | guía | administrador |
|---|---|---|---|---|
| Ver sitios y mapa | ✅ | ✅ | ✅ | ✅ |
| Favoritos | ❌ | ✅ | ✅ | ✅ |
| Publicar en Tops | ❌ | ✅ | ✅ | ✅ |
| Audios guardados | ❌ | ✅ | ✅ | ✅ |
| Crear sitios turísticos | ❌ | ❌ | ✅ | ❌ |
| Subir imágenes de sitios | ❌ | ❌ | ✅ | ❌ |
| Administrar usuarios | ❌ | ❌ | ❌ | ✅ |
| Administrar categorías | ❌ | ❌ | ❌ | ✅ |
| Cambiar roles | ❌ | ❌ | ❌ | ✅ |

### Control de accesos en UI
- `Options.vue` muestra opciones condicionalmente según `user.rol`
- Solo el autor puede eliminar su publicación o comentario
- RLS en Supabase protege los datos a nivel de base de datos

---

## 10. Reglas de Negocio

### Validaciones

| Regla | Módulo |
|---|---|
| Solo imágenes, máximo 5MB para uploads | Tops (upload.js) |
| Máximo 500 caracteres por publicación | Tops |
| Un like por usuario por publicación (persistido en localStorage) | Tops |
| Solo el autor puede eliminar sus posts/comentarios | Tops |
| Calificación de reseña entre 1-5 | Home (sitios) |
| Se requiere sesión activa para favoritos, publicar y comentar | Global |
| Contraseñas gestionadas por Google OAuth (no almacenadas) | Auth |
| Los usuarios no pueden modificar su propio rol | Admin (RLS) |
| Categorías en uso no pueden eliminarse (FK constraint) | Admin |

### Notificaciones de proximidad
- Se dispara al estar a ≤100m de un sitio turístico
- Auto-reproduce audio descriptivo del sitio
- No re-notifica hasta alejarse ≥200m del sitio

### Configuración del narrador (persistida en localStorage)
- Voz: `es-US-Neural2-B` (configurable)
- Velocidad, pitch y volumen ajustables
- Perfil de audio: `small-bluetooth-speaker-class-device`

---

## 11. Problemas Comunes

| Problema | Causa | Solución |
|---|---|---|
| Error 10 en Google Sign-In (Android) | SHA-1 no registrado en Firebase | Registrar SHA-1 del keystore en Firebase Console |
| CORS error al subir a S3 (Capacitor) | Origin no es localhost en nativo | Configurar CORS en bucket S3 para permitir `capacitor://localhost` |
| Mapa no carga | API Key inválida o sin billing | Verificar `VITE_GOOGLE_MAPS_KEY` y que Maps JS API esté habilitada |
| `pnpm install` falla | Versión de Node incompatible | Usar Node ^20.19.0 o >=22.12.0 (nvm recomendado) |
| Supabase auth no retorna usuario | Token expirado en localStorage | Borrar `sb-*-auth-token` de localStorage y re-autenticar |
| TTS no genera audio | API Key sin permisos TTS | Habilitar Cloud Text-to-Speech API en Google Cloud Console |
| DeepSeek no responde | API Key expirada o rate limit | Verificar clave en `deepseek.js` y límites de la cuenta |
| Build Android falla | Android SDK no configurado | Instalar Android Studio con SDK 33+ y configurar `ANDROID_HOME` |
| Imágenes no se suben | Credenciales AWS incorrectas | Verificar `VITE_AWS_ACCESS_KEY_ID` y `VITE_AWS_SECRET_ACCESS_KEY` |

---

## 12. Mejoras Futuras

- [ ] Soporte iOS (Capacitor)
- [ ] Modo offline con Service Worker y caché de sitios
- [ ] Push notifications (FCM) para likes y comentarios
- [ ] Gamificación: rachas, logros y medallas
- [ ] Subida de foto de perfil personalizada
- [ ] Sistema de reportes de publicaciones
- [ ] Dashboard de analíticas para administradores
- [ ] Migración de API Keys a backend seguro (Edge Functions)
- [ ] Internacionalización (i18n) para turistas extranjeros
- [ ] Tests E2E con Playwright o Cypress

---

## 13. Recomendación Final

> Se recomienda separar la documentación en:

| Documento | Audiencia | Archivo |
|---|---|---|
| **Manual Técnico** | Desarrolladores | `MANUAL_TECNICO.md` (este archivo) |
| **Manual de Usuario** | Usuarios finales | `MARKDOWN_USER.md` |
| **Documentación adicional** | Equipo técnico | `docs/` (AI_ASSISTANT, SEARCH_FEATURE, testing_report) |
| **Diagramas UML** | Analistas | Pendiente de crear |

---

> _Quilla — Descubre tu mundo 🌎_
> _Desarrollado con ❤️ para el Taller de Proyectos_
