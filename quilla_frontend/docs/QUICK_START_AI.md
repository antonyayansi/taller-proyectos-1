# 🎤 Guía Rápida - Asistente IA

## ¿Qué hace?

El **Asistente IA** es tu guía turístico virtual que responde preguntas sobre los lugares de Cusco usando:
- 🎤 **Reconocimiento de voz** - Pregunta hablando
- ⌨️ **Chat de texto** - O escribe tu pregunta
- 🔊 **Respuestas en audio** - Escucha las respuestas automáticamente

## 🚀 Cómo Empezar

### 1. Ubicación del Asistente
Busca el **botón flotante morado/rosa** con un icono de chat 💬 en la esquina inferior derecha cuando:
- Estés viendo los detalles de un lugar turístico
- Estés navegando hacia un lugar

### 2. Usar por Voz (Recomendado)
```
1. Toca el botón del asistente
2. Presiona el icono del micrófono 🎤 
3. Cuando veas "Escuchando...", di tu pregunta
4. El asistente transcribirá y responderá automáticamente
5. Escucha la respuesta en audio
```

### 3. Usar por Texto
```
1. Toca el botón del asistente
2. Escribe tu pregunta en el campo de texto
3. Presiona Enter o el botón de enviar ➤
4. Escucha la respuesta en audio
```

## 💬 Preguntas de Ejemplo

Prueba preguntando:

**Sobre Historia:**
- "¿Cuál es la historia de este lugar?"
- "¿Qué pasó aquí en el pasado?"
- "¿Por qué es importante este sitio?"

**Información Práctica:**
- "¿Cuánto cuesta la entrada?"
- "¿A qué hora abre?"
- "¿Cuánto tiempo necesito para visitarlo?"

**Recomendaciones:**
- "¿Qué debo ver aquí?"
- "¿Cuál es la mejor hora para visitar?"
- "¿Qué ruta me recomiendas?"

**Consejos:**
- "¿Qué debo llevar?"
- "¿Hay restricciones?"
- "¿Es accesible para todos?"

## ⚙️ Configuración

### Token de DeepSeek
El token API está configurado en: `/src/services/deepseek.js`

```javascript
const DEEPSEEK_API_KEY = '';
```

### Configuración de Voz
Las respuestas usan tu configuración de narrador del perfil:
- Ve a **Perfil** → **Configuración del Narrador**
- Ajusta velocidad, tono y tipo de voz
- Las respuestas del asistente usarán esta configuración

## 🎯 Características del Sistema

### Contexto Inteligente
El asistente conoce automáticamente:
- ✅ Nombre del lugar actual
- ✅ Descripción completa
- ✅ Categoría del sitio
- ✅ Tu distancia al lugar
- ✅ Horarios y precios
- ✅ Rutas disponibles

### Respuestas Optimizadas
- **Concisas**: 3-4 oraciones máximo
- **Conversacionales**: Tono amigable y natural
- **En español**: Respuestas en español de Perú
- **Contextualizadas**: Basadas en el lugar activo

## 🔧 Solución de Problemas

### "No se detectó ninguna voz"
- Habla más fuerte o más cerca del micrófono
- Asegúrate de que hay poco ruido de fondo
- Intenta de nuevo presionando el botón del micrófono

### "Permiso de micrófono denegado"
1. Ve a la configuración de tu navegador/app
2. Permite el acceso al micrófono
3. Recarga la página

### "No puedo conectar con el servicio"
- Verifica tu conexión a internet
- Intenta de nuevo en unos segundos
- Si persiste, usa el modo de texto

### No reproduce audio
- Verifica el volumen de tu dispositivo
- Revisa la configuración del narrador en tu perfil
- Asegúrate de que el narrador esté habilitado

## 📱 Compatibilidad

### Dispositivos:
- ✅ Android (Chrome, Edge)
- ✅ iOS (Safari, Chrome)
- ✅ Escritorio (todos los navegadores modernos)

### Funciones:
- **Reconocimiento de voz**: Requiere Chrome/Safari
- **Reproducción de audio**: Funciona en todos los dispositivos

## 🎨 Interfaz

### Estados Visuales:
- **🟣 Botón flotante**: El asistente está disponible
- **🔴 Pulsante**: Está escuchando tu voz
- **⚫ Puntos animados**: Está pensando la respuesta
- **🔵 Badge azul**: Tu voz fue transcrita

### Controles:
- **🎤 Micrófono**: Grabar pregunta por voz
- **⌨️ Campo de texto**: Escribir pregunta
- **➤ Enviar**: Enviar pregunta escrita
- **✖️ Cerrar**: Cerrar el asistente
- **🔊 Reproducir**: Volver a escuchar una respuesta

## 💡 Tips

1. **Habla claramente**: El reconocimiento de voz funciona mejor con voz clara
2. **Sé específico**: Preguntas específicas obtienen mejores respuestas
3. **Usa el contexto**: El asistente conoce el lugar actual
4. **Escucha activa**: Las respuestas se reproducen automáticamente
5. **Historial**: Puedes volver a reproducir respuestas anteriores

## 🔒 Privacidad

- Las conversaciones NO se guardan en el servidor
- El reconocimiento de voz es procesado por tu navegador
- Solo se envían tus preguntas y el contexto del sitio a DeepSeek
- No se graba ni almacena audio

## 📊 Rendimiento

- **Latencia promedio**: 2-5 segundos por respuesta
- **Tamaño de respuesta**: ~50-150 palabras
- **Uso de datos**: ~10-20 KB por pregunta

## 🎓 Mejores Prácticas

### Para mejores resultados:

✅ **Haz esto:**
- "¿Cuál es la mejor hora para visitar Sacsayhuamán?"
- "¿Qué debo saber antes de entrar?"
- "¿Hay alguna leyenda sobre este lugar?"

❌ **Evita:**
- Preguntas muy largas o complejas
- Múltiples preguntas en una sola vez
- Preguntas no relacionadas con turismo

## 🆘 Soporte

Si encuentras problemas:
1. Revisa esta guía primero
2. Verifica tu conexión a internet
3. Intenta recargar la aplicación
4. Contacta al soporte técnico

---

**¡Disfruta tu experiencia con el Asistente IA!** 🎉
