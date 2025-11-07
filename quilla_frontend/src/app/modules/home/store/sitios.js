import { addMarker, calculateDistance } from "@/services/gps";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { supabase } from "@/services/supabase/supabase";
import { defineStore } from "pinia";
import useHome from "../hooks/useHome";
import { home } from "./home";
import useAuth from "../../auth/hooks/useAuth";

const {
    ubicacionActual
} = useHome()

const {
    user
} = useAuth()

const homeStore = home()

export const sitios = defineStore("sitios", {
    state: () => ({
        sitios: [],
        sitiosbk: [],
        sitioActive: null,
        resenias: [],
        loadingResenias: false,
        openNewReseniaModal: false,
        new_resenia: {
            users_id: null,
            name: '',
            avatar: '',
            sitios_id: null,
            calificacion: 1,
            comentario: ''
        }
    }),
    actions: {
        async getSitios() {
            try {
                const { data, error } = await supabase
                    .from('sitios')
                    .select('*')
                if (error) throw error;

                const sitiosWithDistance = await Promise.all(
                    data.map(async item => {
                        let distancia = 0;
                        if (ubicacionActual.value.lat && ubicacionActual.value.lng) {
                            distancia = await calculateDistance(
                                ubicacionActual.value.lat,
                                ubicacionActual.value.lng,
                                item.lat,
                                item.lng
                            )
                        }
                        return {
                            ...item,
                            distancia: distancia.toFixed(2)
                        }
                    })
                );

                this.sitios = sitiosWithDistance;
                this.sitiosbk = [...this.sitios];
            } catch (e) {
                console.error('Error fetching sitios:', e);
            }
        },
        async getSitiosById(id) {
            try {
                const { data, error } = await supabase
                    .from('sitios')
                    .select(`
                        *,
                        categorias:categorias_id(nombre),
                        rutas (*),
                        imagenes_sitio (*)
                    `)
                    .eq('id', id)
                    .single();

                if (error) throw error;

                // Calcular distancia si tenemos ubicación actual
                let distancia = 0;
                if (ubicacionActual.value.lat && ubicacionActual.value.lng && data) {
                    distancia = await calculateDistance(
                        ubicacionActual.value.lat,
                        ubicacionActual.value.lng,
                        data.lat,
                        data.lng
                    );
                }

                this.sitioActive = {
                    ...data,
                    distancia: distancia.toFixed(2)
                };
                // await this.textToSpeech(this.sitioActive.descripcion);
                return this.sitioActive;
            } catch (e) {
                console.error('Error fetching sitio by id:', e);
                this.sitioActive = null;
                return null;
            }
        },
        async addSitesToMap() {

            for (const sitio of this.sitios) {

                const htmlContent = `<div>
        <h3 class="font-black text-green-800">${sitio.nombre}</h3>
        <p class="text-zinc-800 mb-4">${sitio.descripcion || 'Descripción no disponible'}</p>
        <a href="/sitio/${sitio.id}" class="bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600">Iniciar Recorrido</a>
    </div>`

                await addMarker({
                    lat: sitio.lat,
                    lng: sitio.lng
                }, 'turismo', sitio.nombre || 'Sitio turístico', false, htmlContent);
            }
        },
        searchSitios(query) {
            if (!query) {
                this.sitios = this.sitiosbk;
                return;
            }
            const lowerQuery = query.toLowerCase();
            this.sitios = this.sitiosbk.filter(sitio =>
                sitio.nombre.toLowerCase().includes(lowerQuery) ||
                sitio.descripcion.toLowerCase().includes(lowerQuery)
            );
        },
        async textToSpeech(text, title = '', saveToFile = false, IDUnico = '') {
            // Cargar configuración del narrador
            homeStore.loadNarratorConfig();
            const config = homeStore.narratorConfig;

            // Si el narrador está desactivado, no hacer nada
            if (!config.enabled) {
                return;
            }

            // Si viene IDUnico, buscar si ya existe el audio guardado
            if (IDUnico) {
                try {
                    const result = await Filesystem.readdir({
                        path: '',
                        directory: Directory.Data,
                    });

                    // Buscar archivo que contenga el IDUnico en el nombre
                    const audioExistente = result.files.find(file => file.name.split(' - ')[0] == IDUnico);

                    if (audioExistente) {
                        // Leer el archivo existente
                        const fileResult = await Filesystem.readFile({
                            path: audioExistente.name,
                            directory: Directory.Data,
                        });

                        // Decodificar base64 a blob
                        const audioBlob = new Blob(
                            [Uint8Array.from(atob(fileResult.data), c => c.charCodeAt(0))],
                            { type: 'audio/mp3' }
                        );

                        // Reproducir el audio existente
                        homeStore.playAudio(audioBlob, title);

                        return audioExistente.uri; // Devolver la ruta del archivo existente
                    }
                } catch (error) {
                    console.log('⚠️ No se encontró audio en cache, generando nuevo:', error.message);
                    // Continuar con la generación normal si no se encuentra
                }
            }

            // Indicar que está cargando
            homeStore.setLoading(true);

            let text_sub = text;

            try {
                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
                const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

                const payload = {
                    "audioConfig": {
                        "audioEncoding": "MP3",
                        "effectsProfileId": [
                            config.effectsProfile
                        ],
                        "pitch": config.pitch,
                        "speakingRate": config.speakingRate
                    },
                    "input": {
                        "text": text_sub
                    },
                    "voice": {
                        "languageCode": config.language,
                        "name": config.voice
                    }
                };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud de text-to-speech');
                }

                const result = await response.json();

                // Decodificar el audio base64 y crear Blob
                const audioBytes = result.audioContent;
                const audioBlob = new Blob([Uint8Array.from(atob(audioBytes), c => c.charCodeAt(0))], {
                    type: 'audio/mp3'
                });

                // Usar el reproductor global
                homeStore.playAudio(audioBlob, title);

                let filePath = null;

                if (saveToFile) {
                    const fileName = `${IDUnico} - ${title || 'tts_audio'}_${Date.now()}.mp3`;
                    const saveResult = await Filesystem.writeFile({
                        path: fileName,
                        data: audioBytes, // base64
                        directory: Directory.Data,
                    });
                    filePath = saveResult.uri;
                    console.log('✅ Audio guardado en:', filePath);
                }

                return filePath; // <- 🔁 devuelve la ruta si se guardó
            } catch (error) {
                console.error('Error en textToSpeech:', error);
            } finally {
                homeStore.setLoading(false);
            }
        },
        async getReseniasBySitioId(sitioId) {
            this.loadingResenias = true;
            try {
                const { data, error } = await supabase
                    .from('resenias')
                    .select(`
                        *
                    `)
                    .eq('sitios_id', sitioId)
                    .order('created_at', { ascending: false });
                if (error) throw error;

                this.resenias = data;
            } catch (e) {
                console.error('Error fetching resenias:', e);
            } finally {
                this.loadingResenias = false;
            }
        },
        async addNewResenia() {
            try {
                this.new_resenia.sitios_id = this.sitioActive.id;
                this.new_resenia.users_id = user.value.id;
                this.new_resenia.name = user.value?.user_metadata.name;
                this.new_resenia.avatar = user.value?.user_metadata.avatar_url;

                const { data, error } = await supabase
                    .from('resenias')
                    .insert(this.new_resenia)
                if (error) throw error;

                await this.getReseniasBySitioId(this.sitioActive.id);
                this.openNewReseniaModal = false;
                // Reset new_resenia
                this.new_resenia = {
                    users_id: null,
                    sitios_id: null,
                    calificacion: 1,
                    comentario: ''
                };
            } catch (e) {
                console.error('Error adding new resenia:', e);
            }
        }
    },
});
