/**
 * Servicio para interactuar con DeepSeek API
 * Proporciona funcionalidades de chat y asistente IA
 */

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEP_SEEK_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Envía un mensaje al asistente de DeepSeek
 * @param {string} message - Mensaje del usuario
 * @param {object} context - Contexto adicional (información del sitio, ubicación, etc.)
 * @returns {Promise<string>} - Respuesta del asistente
 */
export async function askDeepSeek(message, context = {}) {
    try {
        const systemPrompt = buildSystemPrompt(context);
        
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error en askDeepSeek:', error);
        throw error;
    }
}

/**
 * Construye el prompt del sistema con el contexto del sitio
 * @param {object} context - Información del sitio activo
 * @returns {string} - Prompt del sistema
 */
function buildSystemPrompt(context) {
    const { sitio, ubicacion } = context;
    
    let prompt = `Eres un guía turístico virtual experto y amigable de Cusco, Perú. Tu objetivo es ayudar a los turistas proporcionando información clara, concisa y útil sobre los lugares turísticos.

INSTRUCCIONES:
- Responde siempre en español de manera clara y amigable
- Sé breve y conciso (máximo 3-4 oraciones)
- Usa un tono conversacional y entusiasta
- Si no sabes algo, sé honesto pero ofrece información relacionada
- Enfócate en datos interesantes, historia, consejos prácticos y recomendaciones`;

    if (sitio) {
        prompt += `\n\nCONTEXTO DEL LUGAR ACTUAL:
- Nombre: ${sitio.nombre}
- Descripción: ${sitio.descripcion}
- Categoría: ${sitio.categorias?.nombre || 'N/A'}
- Distancia del usuario: ${sitio.distancia} km
- Horarios: ${sitio.horarios || 'No especificado'}
- Precio: ${sitio.precio || 'No especificado'}`;

        if (sitio.rutas && sitio.rutas.length > 0) {
            prompt += `\n- Rutas disponibles: ${sitio.rutas.map(r => r.nombre).join(', ')}`;
        }
    }

    if (ubicacion) {
        prompt += `\n\nUBICACIÓN DEL USUARIO:
- Latitud: ${ubicacion.lat}
- Longitud: ${ubicacion.lng}`;
    }

    prompt += `\n\nRecuerda: El usuario puede estar preguntando por voz, así que tu respuesta se convertirá en audio. Hazla natural y fácil de escuchar.`;

    return prompt;
}

/**
 * Genera un mensaje de error amigable
 * @param {Error} error - Error original
 * @returns {string} - Mensaje de error para el usuario
 */
export function getErrorMessage(error) {
    if (error.message.includes('API')) {
        return 'Lo siento, no puedo conectar con el servicio en este momento. Por favor intenta de nuevo más tarde.';
    }
    return 'Lo siento, ocurrió un error. Por favor intenta de nuevo.';
}
