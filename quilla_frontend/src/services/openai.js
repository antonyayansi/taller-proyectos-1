const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Analiza una imagen y devuelve información sobre el lugar turístico
 * @param {string} base64Image - Imagen en formato base64
 * @returns {Promise<string>} - Descripción en formato Markdown
 */
export async function analyzeImageTouristPlace(base64Image) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analiza esta imagen e identifica si es un lugar turístico. Si lo es, proporciona la siguiente información en formato Markdown:

# [Nombre del Lugar]

## Ubicación
[País, ciudad, dirección si es reconocible]

## Descripción
[Descripción detallada del lugar, su historia e importancia]

## Características Principales
- [Característica 1]
- [Característica 2]
- [Característica 3]

## Mejor época para visitar
[Información sobre cuándo es mejor visitarlo]

## Datos Curiosos
[Datos interesantes o curiosidades sobre el lugar]

Si no puedes identificar el lugar específico, proporciona información general sobre el tipo de arquitectura, estilo o características que observas.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error de OpenAI: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error al analizar imagen:', error);
    throw error;
  }
}

/**
 * Genera audio de texto usando OpenAI TTS
 * @param {string} text - Texto a convertir en audio
 * @returns {Promise<Blob>} - Audio en formato blob
 */
export async function textToSpeech(text) {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova', // Voces disponibles: alloy, echo, fable, onyx, nova, shimmer
        input: text,
        speed: 1.0
      })
    });

    if (!response.ok) {
      throw new Error(`Error al generar audio: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error en textToSpeech:', error);
    throw error;
  }
}
