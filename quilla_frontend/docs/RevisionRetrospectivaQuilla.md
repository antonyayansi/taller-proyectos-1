***"Año de la Esperanza y el Fortalecimiento de la Democracia"***

**UNIVERSIDAD CONTINENTAL**  
**ESCUELA ACADÉMICA PROFESIONAL DE INGENIERÍA**  
**FACULTAD DE INGENIERÍA INDUSTRIAL Y SISTEMAS E INFORMÁTICA**

---

**TALLER DE PROYECTOS II**

**REVISIÓN Y RETROSPECTIVA DEL PROYECTO**

**Sistema de Gestión Turística — Quilla**  
*Aplicación móvil turística con audioguías inteligentes y mapas interactivos para promover el patrimonio en la provincia de La Convención*

**INTEGRANTES:**

| N° | Nombre completo | Correo |
|:---|:---|:---|
| 1 | ANTONY ELIO AYANSI HUISA | 7702318@continental.edu.pe |
| 2 | JOSE RONALDO HORTA ESPINOZA | 72111413@continental.edu.pe |
| 3 | JULIO JOAQUIN AYMA VEGA CENTENO | 74031847@continental.edu.pe |

**CUSCO — PERÚ**  
**2026**

---

## TABLA DE CONTENIDO

1. [Revisión del Proyecto](#1-revisión-del-proyecto)
   - 1.1 [Resumen](#11-resumen-del-proyecto)
   - 1.2 [Objetivos Alcanzados](#12-objetivos-alcanzados)
   - 1.3 [Funcionalidades Implementadas](#13-funcionalidades-implementadas)
   - 1.4 [Cumplimiento de Requisitos](#14-cumplimiento-de-requisitos)
   - 1.5 [Resultados de Usabilidad](#15-resultados-de-la-evaluación-de-usabilidad)
   - 1.6 [Dificultades Encontradas](#16-dificultades-encontradas)
   - 1.7 [Estructura del Código y Arquitectura](#17-estructura-del-código-y-arquitectura-del-proyecto)
2. [Retrospectiva del Proyecto](#2-retrospectiva-del-proyecto)
   - 2.1 [¿Qué salió bien?](#21-qué-salió-bien)
   - 2.2 [¿Qué podría mejorarse?](#22-qué-podría-mejorarse)
   - 2.3 [Aprendizajes](#23-qué-aprendimos)
   - 2.4 [Problemas y Soluciones](#24-problemas-identificados-y-soluciones-aplicadas)
   - 2.5 [Acciones Futuras](#25-acciones-para-futuros-proyectos)
   - 2.6 [Conclusión](#26-conclusión)
3. [Evidencias del Proyecto](#3-evidencias-del-proyecto)
4. [Lecciones Aprendidas por Integrante](#4-lecciones-aprendidas-por-integrante)
5. [Acta de Retrospectiva (Estilo Scrum)](#5-acta-de-retrospectiva-estilo-scrum)
6. [Firmas](#6-firmas)

---

## 1. REVISIÓN DEL PROYECTO

### 1.1 Resumen del Proyecto

El proyecto consistió en el desarrollo de **Quilla**, un Sistema de Información turístico orientado a la Municipalidad Provincial de La Convención. La aplicación permite a turistas y visitantes explorar atractivos culturales y naturales de la provincia mediante:

- Catálogo de sitios turísticos con fichas detalladas
- Mapas interactivos y geolocalización en tiempo real
- Audioguías inteligentes con narración por proximidad (GPS + TTS)
- Modo offline parcial para zonas sin conectividad
- Búsqueda por imagen con inteligencia artificial
- Comunidad social (publicaciones, reseñas, favoritos)
- Panel administrativo para gestión de contenidos y usuarios

El sistema fue desarrollado con **Vue.js 3**, **Supabase** (PostgreSQL + Auth), **Capacitor** (Android), **AWS S3**, **Google Maps/TTS** y APIs de IA (**DeepSeek**, **OpenAI**), siguiendo una metodología ágil basada en Scrum con 5 releases planificados.

**Stakeholders principales:** Municipalidad de La Convención, turistas, emprendedores y guías locales, equipo de desarrollo.

**Documento de referencia:** [ContextoQuilla.md](./ContextoQuilla.md)

---

### 1.2 Objetivos Alcanzados

| Objetivo | Estado | Observaciones |
|:---|:---|:---|
| Centralizar información turística verificada | Cumplido | Catálogo, fichas, categorías e imágenes en Supabase |
| Facilitar exploración autónoma de atractivos | Cumplido | Mapa interactivo, filtros, búsqueda y navegación asistida |
| Implementar audioguías inteligentes contextualizadas | Cumplido | TTS por proximidad, reproductor global, configuración de narrador |
| Mejorar accesibilidad de la información turística | Cumplido | Audioguías, asistente IA conversacional, modo oscuro |
| Promover economía local y servicios turísticos | Parcial | Directorio y contacto con guías planificados; módulo social implementado |
| Fortalecer preservación y difusión del patrimonio | Cumplido | Contenido multimedia, reseñas y publicaciones comunitarias |
| Proporcionar herramientas de administración centralizada | Cumplido | Panel admin (usuarios, categorías) y panel guía (sitios, imágenes) |
| Funcionamiento offline en zonas rurales | Parcial | Descarga de audios y caché local; sincronización automática en progreso |
| Aplicación móvil multiplataforma | Cumplido | Build Android con Capacitor; web responsive con Vite |

---

### 1.3 Funcionalidades Implementadas

#### Módulos funcionales del sistema

| Módulo | Funcionalidades |
|:---|:---|
| **Autenticación** | Login con Google OAuth (Supabase), gestión de sesión, deep links en Android |
| **Home / Exploración** | Catálogo de sitios, ficha detallada, mapa interactivo, filtros por categoría, navegación asistida, reseñas, rutas |
| **Geolocalización** | GPS en tiempo real, marcadores en mapa, detección de proximidad (Haversine), activación de audioguías |
| **Audioguías** | Text-to-Speech (Google TTS), reproductor global (`AudioPlayer`), guardado local de audios |
| **Búsqueda IA** | Captura de foto, análisis con OpenAI GPT-4o-mini, narración TTS, caché local SHA-256 |
| **Asistente IA** | Chat conversacional con DeepSeek, entrada por voz (micrófono), respuestas en audio |
| **Tops (Comunidad)** | Feed de publicaciones, likes, comentarios, subida de imágenes a AWS S3 |
| **Perfil** | Datos de usuario, favoritos, audios guardados, configuración del narrador, modo oscuro |
| **Administración** | CRUD usuarios y roles, CRUD categorías, CRUD sitios turísticos (panel guía), gestión de imágenes |

#### Stack tecnológico

| Capa | Tecnologías |
|:---|:---|
| Frontend | Vue.js 3 (Composition API), Vite, Vue Router, Pinia, PrimeVue, Tailwind CSS |
| Móvil | Capacitor 7 (Android), plugins: Geolocation, Camera, Filesystem, Network |
| Backend / BD | Supabase (PostgreSQL, Auth, RLS) |
| Almacenamiento | AWS S3 (imágenes) |
| Mapas y voz | Google Maps API, Google TTS |
| Inteligencia artificial | DeepSeek API, OpenAI GPT-4o-mini |
| Testing | Vitest, @vue/test-utils, happy-dom |

---

### 1.4 Cumplimiento de Requisitos

Evaluación basada en los 26 requerimientos funcionales (RF-01 a RF-26) y 14 no funcionales (RNF-01 a RNF-14) definidos en [ContextoQuilla.md](./ContextoQuilla.md).

| Categoría | Cumplimiento | Detalle |
|:---|:---|:---|
| Funcionales | ~88% | Autenticación, exploración, mapas, audioguías, favoritos, reseñas, admin y comunidad implementados. Pendientes: directorio completo de servicios, itinerarios, notificaciones push |
| No funcionales | ~82% | Rendimiento aceptable, UI responsive, modularidad por features. Pendientes: disponibilidad 95% medida, build iOS, respaldo automatizado documentado |
| Usabilidad | ~85% | Navegación inferior clara, feedback visual (toast), modo oscuro. Mejoras identificadas en heurísticas de Nielsen |
| Seguridad | ~78% | OAuth, RLS en Supabase, roles (público, usuario, guía, administrador). Pendiente: auditoría formal de políticas RLS |
| Rendimiento | ~87% | Caché local, lazy loading de rutas. Latencia IA: 2–5 s por respuesta |

**Historias de usuario del backlog (23 HU):**

| Estado | Historias |
|:---|:---|
| Completadas | HU1–HU8, HU10–HU12, HU14–HU16, HU20 (parcial) |
| Parciales | HU6 (offline), HU13 (publicar reseñas), HU22 (contacto guías) |
| Pendientes | HU9, HU11, HU17–HU19, HU21, HU23 |

---

### 1.5 Resultados de la Evaluación de Usabilidad

La evaluación se realizó con base en las **10 Heurísticas de Jakob Nielsen** (ver `HEURISTICAS_NIELSEN.md`) y pruebas con usuarios del equipo y stakeholders.

| Criterio | Puntuación (1–5) |
|:---|:---|
| Visibilidad del estado del sistema | 4.2 |
| Correspondencia con el mundo real | 4.5 |
| Control y libertad del usuario | 4.0 |
| Consistencia y estándares | 4.3 |
| Prevención de errores | 3.8 |
| Reconocimiento antes que recuerdo | 4.4 |
| Flexibilidad y eficiencia de uso | 3.9 |
| Diseño estético y minimalista | 4.1 |
| Ayuda para reconocer y recuperarse de errores | 3.7 |
| Ayuda y documentación | 4.0 |

**Promedio general: 4.09 / 5**

**Observaciones:** La barra de navegación inferior, el mapa interactivo y el reproductor de audio global fueron bien valorados. Se identificaron oportunidades de mejora en mensajes de error, confirmaciones de acciones destructivas y onboarding para nuevos usuarios.

---

### 1.6 Dificultades Encontradas

#### Dificultades técnicas

| Área | Descripción |
|:---|:---|
| Conectividad offline | Zonas rurales de La Convención con señal deficiente; implementación parcial del modo offline (R-01) |
| Precisión GPS | Variabilidad del GPS en entornos con vegetación densa o relieve accidentado (R-02) |
| Integración de APIs externas | Dependencia de Google Maps, TTS, OpenAI y DeepSeek; gestión de claves y costos (R-05) |
| Capacitor / Android | Configuración de permisos (cámara, ubicación, almacenamiento) y deep links OAuth |
| Supabase RLS | Definición y prueba de políticas de seguridad por rol |
| Testing | Mocks de servicios externos (GPS, Supabase, APIs IA) en entorno Vitest |

#### Dificultades organizacionales

| Área | Descripción |
|:---|:---|
| Coordinación de roles | Cada integrante asumió múltiples roles (PM, analista, frontend, backend, QA, UI/UX) |
| Cronograma | Retrasos en releases 4 y 5 por priorización del MVP y funcionalidades IA |
| Documentación | Mantener sincronizados ContextoQuilla, manual técnico y documentación de módulos |
| Validación de contenidos | Dependencia de la Municipalidad para verificar información patrimonial (R-03) |

---

### 1.7 Estructura del Código y Arquitectura del Proyecto

#### Arquitectura general

Quilla sigue una **arquitectura modular por features** con separación en tres capas:

```
┌──────────────────────────────────────────────────┐
│                   USUARIO                        │
│          (Navegador Web / Android APK)           │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│            CAPA DE PRESENTACIÓN                  │
│   Vue 3 + PrimeVue + Tailwind CSS + Capacitor   │
│   (Views, Components, Layouts)                   │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO                  │
│   Pinia Stores + Composables (Hooks)             │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│          CAPA DE SERVICIOS EXTERNOS              │
│  supabase.js │ aws.js │ gps.js │ deepseek.js    │
│  openai.js   │ upload.js │ microphone.js        │
└─────────┬───────┬───────┬───────┬────────────────┘
          ▼       ▼       ▼       ▼
   Supabase   AWS S3  Google   DeepSeek
   (DB+Auth)         Maps+TTS  + OpenAI
```

#### Estructura de directorios del repositorio

```
quilla_frontend/
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias y scripts npm/pnpm
├── vite.config.js                # Configuración de Vite
├── vitest.config.js              # Configuración de pruebas
├── capacitor.config.json         # Configuración Capacitor (Android)
├── supabase_roles_setup.sql      # Script SQL de roles y perfiles
├── .env / .env.example           # Variables de entorno
│
├── android/                      # Proyecto nativo Android (Capacitor)
├── dist/                         # Build de producción
├── public/                       # Assets estáticos
├── resources/                    # Recursos de la app móvil
│
├── docs/                         # Documentación del proyecto
│   ├── ContextoQuilla.md         # Documento académico completo
│   ├── RevisionRetrospectivaQuilla.md
│   ├── AI_ASSISTANT.md
│   ├── SEARCH_FEATURE.md
│   ├── QUICK_START_AI.md
│   └── testing_report.md
│
├── MANUAL_TECNICO.md             # Manual técnico detallado
├── HEURISTICAS_NIELSEN.md        # Análisis de usabilidad
├── MARKDOWN_USER.md              # Manual de usuario
├── TESTING.md                    # Guía de pruebas
├── README.md                     # Guía de inicio rápido
│
└── src/                          # Código fuente principal
    ├── main.js                   # Entry point (Vue, Pinia, PrimeVue, Router)
    ├── App.vue                   # Componente raíz + deep link handler
    │
    ├── assets/
    │   └── main.css              # Estilos globales (Tailwind + tema teal)
    │
    ├── themes/
    │   └── Quilla.js             # Preset PrimeVue (paleta Quilla)
    │
    ├── router/
    │   └── index.js              # Router principal
    │
    ├── services/                 # Capa de servicios externos
    │   ├── supabase/supabase.js  # Cliente Supabase (Auth + DB)
    │   ├── aws.js                # Upload/delete en AWS S3
    │   ├── upload.js             # Upload de imágenes de posts
    │   ├── gps.js                # Google Maps + geolocalización
    │   ├── deepseek.js           # Chat IA conversacional
    │   ├── openai.js             # Análisis de imágenes turísticas
    │   └── microphone.js         # Entrada de voz
    │
    ├── components/               # Componentes globales (scaffold)
    │
    ├── utils/                    # Utilidades compartidas
    │
    ├── __tests__/                # Pruebas de integración
    │
    └── app/                      # Aplicación principal
        ├── layouts/
        │   └── Layout.vue        # Layout con Menu + AudioPlayer
        │
        ├── components/           # Componentes compartidos
        │   ├── Menu.vue          # Barra de navegación inferior
        │   ├── AudioPlayer.vue   # Reproductor global de audio
        │   └── AIAssistant.vue   # Chatbot IA flotante
        │
        ├── router/
        │   └── index.js          # Rutas: home, search, tops, profile
        │
        └── modules/              # Módulos por feature
            ├── auth/             # Autenticación (Google OAuth)
            ├── home/             # Explorador de sitios turísticos
            ├── search/           # Búsqueda por imagen con IA
            ├── tops/             # Red social / comunidad
            ├── profile/          # Perfil, favoritos, configuración
            └── admin/            # Panel administrativo y guía
```

#### Estructura interna de cada módulo

```
modules/[modulo]/
├── views/        # Vistas (páginas)
├── components/   # Componentes del módulo
├── store/        # Pinia stores (estado + lógica)
├── hooks/        # Composables (useSitios, useAuth, etc.)
├── router/       # Rutas del módulo (si aplica)
└── layouts/      # Layouts del módulo (si aplica)
```

#### Mapa de rutas de la aplicación

| Ruta | Vista | Módulo |
|:---|:---|:---|
| `/` | `Home.vue` | Home — listado de sitios |
| `/sitio/:id` | `SitioDetail.vue` | Home — ficha detallada |
| `/sitio/:id/navigate` | `SitioNavigate.vue` | Home — navegación asistida |
| `/search` | `viewSearch.vue` | Search — búsqueda por imagen IA |
| `/tops` | `viewTop.vue` | Tops — feed social |
| `/tops/:id` | `PostDetail.vue` | Tops — detalle de publicación |
| `/profile` | `viewProfile.vue` | Profile — perfil y opciones |

#### Base de datos (Supabase / PostgreSQL)

| Tabla | Descripción |
|:---|:---|
| `perfiles` | Perfiles de usuario (rol, nombre, email, avatar) |
| `sitios` | Sitios turísticos (nombre, descripción, coordenadas, categoría) |
| `categorias` | Categorías de sitios (Cultura, Naturaleza, etc.) |
| `imagenes_sitio` | Imágenes asociadas a sitios |
| `rutas` | Rutas de navegación de sitios |
| `favoritos` | Sitios marcados como favoritos por usuario |
| `resenias` | Reseñas y calificaciones de sitios |
| `publicaciones` | Posts de la comunidad (Tops) |
| `comentarios_publicaciones` | Comentarios en publicaciones |

**Roles del sistema:** `publico`, `usuario`, `guia`, `administrador`

#### Resultados de pruebas automatizadas

| Métrica | Valor |
|:---|:---|
| Framework | Vitest + happy-dom |
| Archivos de prueba | 7 |
| Pruebas totales | 25 |
| Estado | Todas pasan (100%) |
| Fecha última ejecución | 5 de diciembre de 2025 |

---

## 2. RETROSPECTIVA DEL PROYECTO

### 2.1 ¿Qué salió bien?

- **Comunicación y trabajo colaborativo:** El equipo mantuvo comunicación constante mediante reuniones de sprint y uso de Git para control de versiones.
- **Arquitectura modular:** La organización por módulos (`auth`, `home`, `search`, `tops`, `profile`, `admin`) facilitó el desarrollo paralelo y el mantenimiento.
- **Stack moderno:** Vue 3 + Vite + Supabase permitió iterar rápidamente y desplegar sin infraestructura propia de servidor.
- **Funcionalidades diferenciadoras:** Audioguías por proximidad, asistente IA y búsqueda por imagen aportaron valor único al producto.
- **Aceptación del MVP:** El catálogo de sitios, mapa interactivo y navegación asistida cumplieron los criterios del Release 1.
- **Documentación:** Se generaron manual técnico, manual de usuario, guías de IA y reporte de pruebas.
- **Build móvil:** Compilación exitosa de APK Android mediante Capacitor.

### 2.2 ¿Qué podría mejorarse?

- **Planificación de sprints:** Algunos releases (4 y 5) quedaron incompletos por subestimar la complejidad de integraciones IA y offline.
- **Documentación técnica en tiempo real:** La documentación se actualizó al final de cada release en lugar de forma continua.
- **Pruebas tempranas:** Las pruebas automatizadas se implementaron en fases avanzadas; convendría TDD o pruebas desde el Sprint 1.
- **Modo offline completo:** La descarga y sincronización de mapas y contenidos requiere mayor robustez.
- **Cobertura de tests:** 25 pruebas cubren componentes críticos, pero faltan tests E2E en dispositivo real.
- **Build iOS:** Solo se compiló para Android; falta validación en iOS.
- **Directorio de servicios:** Módulo de servicios turísticos (HU20–HU22) pendiente de completar.

### 2.3 ¿Qué aprendimos?

- Desarrollo frontend con **Vue.js 3** (Composition API, Pinia, Vue Router).
- Integración de **Backend-as-a-Service** con Supabase (Auth, PostgreSQL, RLS).
- Empaquetado de aplicaciones web como apps nativas con **Capacitor**.
- Consumo de APIs de **geolocalización**, **text-to-speech** e **inteligencia artificial**.
- Arquitectura por capas y **organización modular por features**.
- Metodología **Scrum**: product backlog, sprint planning, reviews y retrospectivas.
- Gestión de **riesgos** en proyectos con dependencia de conectividad y servicios externos.
- Trabajo colaborativo con **Git**, code review y convenciones de código (Prettier).

### 2.4 Problemas Identificados y Soluciones Aplicadas

| Problema | Solución aplicada |
|:---|:---|
| Incompatibilidad de API Supabase en tests | Actualizar mocks para usar `auth.signInWithPassword` en lugar de API deprecada |
| Tests de Pinia fallaban sin store activo | Implementar `setActivePinia(createPinia())` en setup de pruebas |
| Fechas off-by-one en tests por zona horaria | Usar fechas UTC explícitas o matchers flexibles en Vitest |
| OAuth en Android no redirigía correctamente | Configurar deep link `quilla://auth/callback` en Capacitor |
| Latencia alta en respuestas IA | Caché local SHA-256 para análisis de imágenes repetidas |
| Permisos de cámara/GPS en Android | Declarar permisos en `AndroidManifest.xml` y solicitar en runtime |
| Componentes PrimeVue generaban warnings en tests | Stubear componentes y directivas en `mount()` de @vue/test-utils |
| Información turística desactualizada | Panel guía/admin para que la Municipalidad actualice contenidos |

### 2.5 Acciones para Futuros Proyectos

- Elaborar **cronogramas realistas** con buffer para integraciones de terceros (APIs, móvil).
- Realizar **reuniones periódicas** de seguimiento (daily standup o equivalente).
- Implementar **pruebas continuas** desde el primer sprint (CI con Vitest/GitHub Actions).
- Mantener **documentación viva** sincronizada con cada merge a main.
- Definir **criterios de aceptación** medibles antes de iniciar cada historia de usuario.
- Realizar **pruebas en dispositivo real** desde el Release 1, no solo en emulador.
- Establecer **presupuesto de APIs** (OpenAI, DeepSeek, Google) desde la planificación económica.

### 2.6 Conclusión

El proyecto **Quilla** permitió aplicar conocimientos técnicos de desarrollo web y móvil, integración de servicios en la nube e inteligencia artificial, fortaleciendo competencias de trabajo en equipo bajo metodología ágil. Se entregó un producto funcional con un MVP sólido (exploración, mapas, audioguías) y funcionalidades avanzadas (IA, comunidad social, administración) que responden al diagnóstico de la Municipalidad Provincial de La Convención.

Quedan como trabajo futuro el modo offline completo, el directorio de servicios turísticos, notificaciones push y la versión iOS. El equipo considera que el proyecto cumple con los objetivos académicos del Taller de Proyectos II y sienta las bases para una herramienta de **Turismo Inteligente** en la región Cusco.

---

## 3. EVIDENCIAS DEL PROYECTO

*Inserte aquí capturas de pantalla del sistema, diagramas UML, resultados de pruebas de usabilidad, actas de reuniones y cualquier evidencia relevante.*

| N° | Evidencia | Descripción |
|:---|:---|:---|
| Evidencia 1 | ________________________________________________ | Pantalla principal — catálogo y mapa de sitios turísticos |
| Evidencia 2 | ________________________________________________ | Navegación asistida con audioguía por proximidad |
| Evidencia 3 | ________________________________________________ | Diagramas UML (casos de uso, secuencia, clases) — ver ContextoQuilla Cap. 5 |
| Evidencia 4 | ________________________________________________ | Resultados de pruebas Vitest (25/25 passed) — ver testing_report.md |
| Evidencia 5 | ________________________________________________ | APK Android compilado con Capacitor |
| Evidencia 6 | ________________________________________________ | Evaluación de usabilidad — Heurísticas de Nielsen |
| Evidencia 7 | ________________________________________________ | Actas de reuniones de sprint / retrospectivas |
| Evidencia 8 | ________________________________________________ | Panel administrativo y gestión de sitios (rol guía) |

---

## 4. LECCIONES APRENDIDAS POR INTEGRANTE

### Integrante 1 — ANTONY ELIO AYANSI HUISA
*Rol principal: Diseñador UI/UX / Desarrollador Frontend*

**Fortalezas identificadas:**

**Aspectos a mejorar:**

**Aprendizajes obtenidos:**

---

### Integrante 2 — JOSE RONALDO HORTA ESPINOZA
*Rol principal: Analista de Sistemas / Desarrollador Backend*

**Fortalezas identificadas:**

**Aspectos a mejorar:**

**Aprendizajes obtenidos:**

---

### Integrante 3 — JULIO JOAQUIN AYMA VEGA CENTENO
*Rol principal: Project Manager / Tester (QA)*

**Fortalezas identificadas:**

**Aspectos a mejorar:**

**Aprendizajes obtenidos:**

---

## 5. ACTA DE RETROSPECTIVA (ESTILO SCRUM)

**Fecha:** ______________________  
**Participantes:** Antony Ayansi, Jose Horta, Julio Ayma  
**Sprint / Release evaluado:** ______________________

### ¿Qué hicimos bien?

### ¿Qué debemos mejorar?

### ¿Qué acciones concretas implementaremos en el siguiente proyecto?

| Acción | Responsable | Fecha límite |
|:---|:---|:---|
| | | |
| | | |
| | | |

---

## 6. FIRMAS

| Rol | Nombre | Firma |
|:---|:---|:---|
| Integrante 1 | ANTONY ELIO AYANSI HUISA | __________________________ |
| Integrante 2 | JOSE RONALDO HORTA ESPINOZA | __________________________ |
| Integrante 3 | JULIO JOAQUIN AYMA VEGA CENTENO | __________________________ |
| Docente | ______________________________ | __________________________ |

---

*Documento generado para el cierre del proyecto Quilla — Taller de Proyectos II, Universidad Continental, Cusco 2026.*

*Referencias: [ContextoQuilla.md](./ContextoQuilla.md) · [MANUAL_TECNICO.md](../MANUAL_TECNICO.md) · [testing_report.md](./testing_report.md)*
