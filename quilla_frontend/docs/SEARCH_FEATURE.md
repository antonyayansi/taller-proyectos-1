# 🏛️ Funcionalidad de Búsqueda de Lugares Turísticos

## Descripción
Esta funcionalidad permite a los usuarios tomar fotos de lugares turísticos y obtener información detallada utilizando la API de OpenAI Vision (GPT-4o-mini). Además, incluye narración de audio usando OpenAI Text-to-Speech.

## Características

### 📸 Captura de Imagen
- **Cámara nativa** usando Capacitor Camera API
- Botón para abrir cámara del dispositivo
- Botón para seleccionar desde galería
- Preview de imagen antes del análisis
- Optimizado para APK y aplicaciones móviles nativas

### 🤖 Análisis con IA
- Utiliza **GPT-4o-mini** con capacidades de visión
- Identifica lugares turísticos, monumentos y arquitectura
- Proporciona información detallada:
  - Nombre del lugar
  - Ubicación (país, ciudad)
  - Descripción histórica
  - Características principales
  - Mejor época para visitar
  - Datos curiosos

### 📖 Visualización con Markdown
- Renderiza la respuesta en formato Markdown usando **md-editor-v3**
- Soporte para modo claro y oscuro
- Tipografía optimizada con Tailwind Typography

### 🔊 Narración de Audio
- Convierte el texto a audio usando OpenAI TTS
- Voz: **Nova** (español)
- Integración con el reproductor de audio global del proyecto
- Control de reproducción, pausa y volumen
- **Botón de guardar audio** en el reproductor para almacenar narraciones
- Los audios guardados no necesitan regenerarse

### 💾 Sistema de Caché Inteligente
- **Caché automático** de análisis de imágenes
- Usa hash SHA-256 para identificar imágenes duplicadas
- Almacenamiento en localStorage del navegador
- Indicador visual cuando un resultado proviene del caché
- Opción para limpiar caché manualmente
- **Ahorra créditos de OpenAI** al no analizar la misma imagen múltiples veces
- Contador de imágenes en caché

## Configuración

### Variables de Entorno
Asegúrate de tener configurada la API key de OpenAI en tu archivo `.env`:

```env
VITE_OPENAI_API_KEY="tu-api-key-aqui"
```

### Dependencias
```json
{
  "md-editor-v3": "^6.2.0",
  "@capacitor/camera": "^7.0.2"
}
```

### Permisos de Android
Asegúrate de tener los siguientes permisos en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

Estos permisos ya están configurados en el proyecto.

## Uso

1. Navega a la vista de búsqueda (Search)
2. Haz clic en "Abrir Cámara" para tomar una foto o "Galería" para seleccionar una existente
3. La cámara nativa del dispositivo se abrirá
4. Toma la foto del lugar turístico
5. Espera el análisis automático
6. Lee la información o escucha la narración haciendo clic en "Narrar"
7. Guarda el audio con el botón 💾 en el reproductor si lo deseas

## Uso en Dispositivos Móviles

La aplicación usa **Capacitor Camera API**, lo que significa:
- ✅ Abre la cámara nativa del dispositivo (no un selector de archivos web)
- ✅ Funciona correctamente al compilar a APK
- ✅ Solicita permisos de cámara al usuario en tiempo de ejecución
- ✅ Permite elegir entre cámara y galería
- ✅ Optimizado para Android e iOS

## Estructura de Archivos

```
src/
├── services/
│   └── openai.js                    # Servicio de OpenAI (Vision + TTS)
└── app/modules/search/
    └── views/
        └── viewSearch.vue           # Vista principal
```

## API de OpenAI

### Vision API
- **Modelo**: gpt-4o-mini
- **Endpoint**: https://api.openai.com/v1/chat/completions
- **Max Tokens**: 1000
- **Temperature**: 0.7

### Text-to-Speech API
- **Modelo**: tts-1
- **Voz**: nova
- **Velocidad**: 1.0
- **Endpoint**: https://api.openai.com/v1/audio/speech

## Funciones Principales

### `analyzeImageTouristPlace(base64Image)`
Analiza una imagen y devuelve información en formato Markdown.

**Parámetros:**
- `base64Image` (string): Imagen en formato base64

**Retorna:**
- `Promise<string>`: Descripción en Markdown

### `textToSpeech(text)`
Convierte texto a audio usando OpenAI TTS.

**Parámetros:**
- `text` (string): Texto a convertir

**Retorna:**
- `Promise<Blob>`: Audio en formato blob

### `saveCurrentAudio()`
Guarda el audio actual que se está reproduciendo en el sistema de archivos local.

**Retorna:**
- `Promise<string>`: Nombre del archivo guardado

### `generateImageHash(file)`
Genera un hash SHA-256 de una imagen para identificarla de forma única en el caché.

**Parámetros:**
- `file` (File): Archivo de imagen

**Retorna:**
- `Promise<string>`: Hash de 16 caracteres

## Sistema de Caché

### Funcionamiento
1. Al analizar una imagen, se genera un hash SHA-256
2. Se verifica si existe en localStorage
3. Si existe, se carga instantáneamente sin llamar a la API
4. Si no existe, se analiza con OpenAI y se guarda el resultado
5. El caché persiste entre sesiones

### Gestión del Caché
- **Almacenamiento**: localStorage con clave `imageAnalysisCache`
- **Estructura**: `{ [imageHash]: markdownResult }`
- **Limpiar**: Botón en la interfaz o manualmente en localStorage

## Sistema de Guardado de Audio

### Funcionamiento
1. Cuando se genera audio con TTS, el blob se guarda en el estado
2. El reproductor muestra un botón "Guardar" (icono de disquete)
3. Al hacer clic, el audio se guarda en Capacitor Filesystem
4. El archivo se nombra con el título + timestamp
5. Se puede reproducir desde la sección "Mis audios guardados" en el perfil

### Almacenamiento
- **Directorio**: `Directory.Data` de Capacitor
- **Formato**: MP3 en base64
- **Nombre**: `{titulo_sanitizado}_{timestamp}.mp3`

## Estilos
La interfaz utiliza:
- **TailwindCSS**: Para estilos responsivos
- **PrimeVue**: Componentes UI (Button, Tooltip)
- **Gradientes**: Diseño moderno con degradados
- **Dark Mode**: Soporte completo para tema oscuro

## Manejo de Errores
- Validación de tipos de archivo (solo imágenes)
- Mensajes de error con toast notifications
- Fallback cuando la IA no puede identificar el lugar
- Manejo de errores de red y API
- Fallback en generación de hash si SHA-256 falla
- Validación de existencia de audioBlob antes de guardar

## Mejoras Implementadas
- ✅ Cache de resultados para imágenes similares
- ✅ Guardado de audios en sistema de archivos local
- ✅ Indicador visual de caché
- ✅ Contador de análisis guardados
- ✅ Botón para limpiar caché

## Mejoras Futuras
- [ ] Traducción a múltiples idiomas
- [ ] Compartir resultados en redes sociales
- [ ] Modo offline con análisis local (sin OpenAI)
- [ ] Exportar resultados como PDF
- [ ] Historial de búsquedas
- [ ] Comparación entre múltiples lugares

## Notas Importantes
- ✅ Requiere conexión a internet para el análisis con OpenAI
- ✅ Consume créditos de OpenAI por cada análisis (no por caché)
- ✅ El audio se reproduce usando el sistema global de audio del proyecto
- ✅ Los audios guardados se almacenan localmente en el dispositivo
- ✅ El caché de análisis se mantiene entre sesiones
- ✅ El botón de guardar solo aparece cuando hay audio reproduciéndose
- ⚠️ La limpieza de caché no afecta los audios guardados

## Uso de la Funcionalidad Completa

1. **Analizar lugar con cámara**:
   - Clic en "Abrir Cámara" → Tomar foto → Análisis automático → Ver resultado

2. **Analizar desde galería**:
   - Clic en "Galería" → Seleccionar imagen → Análisis automático → Ver resultado

3. **Reusar análisis**:
   - Tomar misma foto → Carga instantánea desde caché

4. **Guardar narración**:
   - Hacer clic en "Narrar" → Audio se reproduce → Clic en botón "Guardar" (💾)
   - El audio se guarda y puede reproducirse desde el perfil sin regenerar

5. **Gestionar caché**:
   - Ver contador de análisis guardados en la pantalla inicial
   - Hacer clic en "Limpiar" para borrar todo el caché

## Compilación a APK

Para compilar la aplicación con la funcionalidad de cámara:

```bash
# Sincronizar cambios de Capacitor
npx cap sync android

# Abrir en Android Studio
npx cap open android

# O compilar directamente
cd android
./gradlew assembleDebug
```

La aplicación solicitará automáticamente los permisos de cámara al usuario cuando intente tomar una foto.
