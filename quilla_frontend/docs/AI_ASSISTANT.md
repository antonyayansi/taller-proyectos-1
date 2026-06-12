# 🤖 Asistente IA con Reconocimiento de Voz

## Descripción

El asistente IA es un guía turístico virtual inteligente que responde preguntas sobre los lugares turísticos de Cusco. Utiliza **DeepSeek AI** para generar respuestas contextualizadas y reproduce las respuestas en audio utilizando el sistema de text-to-speech ya integrado en el proyecto.

## 🌟 Características Principales

### 1. **Reconocimiento de Voz**
- Pregunta usando el micrófono de tu teléfono
- Reconocimiento automático de voz en español
- Transcripción en tiempo real

### 2. **Chat Inteligente**
- También puedes escribir tus preguntas
- Respuestas contextualizadas según el sitio turístico activo
- Conversación natural y amigable

### 3. **Respuestas en Audio**
- Las respuestas se reproducen automáticamente en audio
- Usa la configuración de voz personalizada del perfil
- Control de reproducción integrado

### 4. **Contexto Inteligente**
El asistente tiene acceso a:
- Nombre del lugar turístico
- Descripción completa
- Categoría del sitio
- Distancia del usuario
- Horarios de visita
- Precios de entrada
- Rutas disponibles

## 📍 Dónde Encontrarlo

El asistente está disponible en:

1. **Vista de Detalle del Sitio** (`SitioDetail.vue`)
   - Botón flotante morado/rosa en la esquina inferior derecha
   - Disponible cuando estás viendo la información de un lugar

2. **Vista de Navegación** (`SitioNavigate.vue`)
   - Disponible mientras navegas hacia un lugar turístico
   - Útil para hacer preguntas en camino

## 🎯 Cómo Usar

### Por Voz:
1. Toca el botón del asistente (icono de chat)
2. Presiona el botón del micrófono 🎤
3. Habla tu pregunta claramente
4. Espera la respuesta en audio

### Por Texto:
1. Toca el botón del asistente
2. Escribe tu pregunta en el campo de texto
3. Presiona Enter o el botón de enviar
4. Escucha la respuesta

## 💡 Ejemplos de Preguntas

- "¿Cuál es la historia de este lugar?"
- "¿Cuánto tiempo se recomienda para la visita?"
- "¿Qué debo saber antes de visitar?"
- "¿Hay descuentos para estudiantes?"
- "¿Cuál es la mejor hora para visitar?"
- "¿Qué ruta me recomiendas?"
- "¿Hay restricciones o reglas especiales?"
- "¿Es accesible para personas con movilidad reducida?"

## 🔧 Componentes Técnicos

### Servicio DeepSeek (`/src/services/deepseek.js`)
```javascript
// Maneja la comunicación con la API de DeepSeek
- askDeepSeek(message, context) - Envía consultas al asistente
- buildSystemPrompt(context) - Construye el contexto del sitio
- getErrorMessage(error) - Maneja errores de forma amigable
```

### Componente AIAssistant (`/src/app/components/AIAssistant.vue`)
```vue
// Componente visual del asistente
- Interfaz de chat con historial de mensajes
- Reconocimiento de voz integrado
- Reproducción automática de respuestas
- Botón flotante minimalista
```

## 🔐 Configuración

### API Key de DeepSeek
La API key está configurada en `/src/services/deepseek.js`:
```javascript
const DEEPSEEK_API_KEY = '';
```

> ⚠️ **Nota de Seguridad**: En producción, mueve esta clave a variables de entorno (.env)

### Configuración del Modelo
```javascript
{
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 500
}
```

- **temperature**: 0.7 - Balance entre creatividad y precisión
- **max_tokens**: 500 - Respuestas concisas (3-4 oraciones)

## 🎨 Diseño y UX

### Estados Visuales:
- **Cerrado**: Botón flotante con gradiente morado-rosa
- **Abierto**: Panel deslizante desde abajo
- **Escuchando**: Botón de micrófono pulsante en rojo
- **Pensando**: Animación de puntos de carga
- **Transcribiendo**: Badge azul con el texto transcrito

### Animaciones:
- Transición suave al abrir/cerrar (slide-up)
- Fade para el botón flotante
- Bounce en los puntos de carga
- Pulse durante la grabación de voz

## 🔊 Integración con Text-to-Speech

El asistente usa la función `textToSpeech` del store de sitios:
```javascript
textToSpeech(text, title = '', saveToFile = false, IDUnico = '')
```

Características:
- Usa la configuración de voz del perfil del usuario
- Reproduce automáticamente después de cada respuesta
- Permite reproducir respuestas anteriores manualmente
- Control de volumen integrado

## 🌐 Soporte de Navegadores

### Reconocimiento de Voz:
- ✅ Chrome (Android/iOS)
- ✅ Safari (iOS)
- ✅ Edge
- ⚠️ Firefox (soporte limitado)

### Síntesis de Voz:
- ✅ Todos los navegadores modernos
- ✅ Dispositivos Android e iOS

## 🐛 Manejo de Errores

El asistente maneja elegantemente varios tipos de errores:

1. **Sin voz detectada**: "No se detectó ninguna voz"
2. **Permiso denegado**: "Permiso de micrófono denegado"
3. **Error de API**: "No puedo conectar con el servicio en este momento"
4. **Error general**: "Lo siento, ocurrió un error. Por favor intenta de nuevo"

## 🚀 Mejoras Futuras

Ideas para expandir la funcionalidad:

1. **Historial Persistente**
   - Guardar conversaciones en localStorage
   - Recuperar conversaciones anteriores

2. **Modo Offline**
   - Respuestas pre-cacheadas
   - FAQs sin conexión

3. **Multilenguaje**
   - Detección automática de idioma
   - Respuestas en inglés, francés, etc.

4. **Favoritos**
   - Guardar respuestas útiles
   - Compartir respuestas

5. **Feedback**
   - Valorar respuestas
   - Reportar problemas

## 📱 Permisos Requeridos

### En el Navegador:
- Micrófono (para reconocimiento de voz)
- Audio (para reproducción de respuestas)

### En Capacitor/Android:
Agrega a `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

## 🧪 Testing

Para probar el asistente:

1. Navega a un sitio turístico
2. Toca el botón del asistente (esquina inferior derecha)
3. Prueba ambos métodos:
   - Por voz: "¿Cuál es la historia de este lugar?"
   - Por texto: Escribe una pregunta

## 📚 Recursos Adicionales

- [DeepSeek API Docs](https://platform.deepseek.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)

## 👥 Contribuciones

Si deseas mejorar el asistente:
1. Ajusta el prompt del sistema en `deepseek.js`
2. Personaliza la UI en `AIAssistant.vue`
3. Experimenta con diferentes valores de temperature
4. Agrega más contexto al prompt del sistema

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Desarrollador**: @quilla_frontend
