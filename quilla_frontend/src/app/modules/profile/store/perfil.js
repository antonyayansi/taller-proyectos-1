import { supabase } from "@/services/supabase/supabase";
import useAuth from "../../auth/hooks/useAuth";
import { defineStore } from "pinia";
import { Directory, Filesystem } from "@capacitor/filesystem";
import useHome from "../../home/hooks/useHome";

const {
    user
} = useAuth()

const {
    playAudio // blob, title
} = useHome()

export const perfil = defineStore("perfil", {
    state: () => ({
        favoritos: [],
        audiosSave: []
    }),
    actions: {
        async getFavoritos() {
            try {
                const { data, error } = await supabase
                    .from('favoritos')
                    .select(`
                        *,
                        sitio: sitios_id (
                            *,
                            categorias:categorias_id(nombre),
                            imagenes_sitio (*)
                        )
                    `)
                    .eq('users_id', user.value.id)

                if (error) throw error;

                this.favoritos = data;
            } catch (e) {
                console.error('Error fetching favoritos:', e);
            }
        },
        async setFavoritos(sitios_id) {
            if (!user.value) return;
            try {
                await supabase.from('favoritos').insert({
                    users_id: user.value.id,
                    sitios_id: sitios_id
                })
            } catch (e) {
                console.error('Error adding favorito:', e);
            }
        },
        async removeFavoritos(sitios_id) {
            if (!user.value) return;
            try {
                await supabase.from('favoritos')
                    .delete()
                    .eq('users_id', user.value.id)
                    .eq('sitios_id', sitios_id)
                await this.getFavoritos();
            } catch (e) {
                console.error('Error removing favorito:', e);
            }
        },
        async listarAudiosGuardados() {
            const result = await Filesystem.readdir({
                path: '',
                directory: Directory.Data,
            });
            this.audiosSave = result.files;
            return result.files; // array de nombres o rutas
        },
        async reproducirAudio(fileNameOrUri) {
            // Extraer solo el nombre del archivo si es una URI
            let fileName = fileNameOrUri;
            if (fileNameOrUri.includes('/')) {
                fileName = fileNameOrUri.split('/').pop();
            }

            try {
                const result = await Filesystem.readFile({
                    path: fileName,
                    directory: Directory.Data,
                });

                // Decodificar base64 a blob
                const audioBlob = new Blob(
                    [Uint8Array.from(atob(result.data), c => c.charCodeAt(0))],
                    { type: 'audio/mp3' }
                );

                // Crear URL para reproducir
                playAudio(audioBlob, fileName);
            } catch (error) {
                console.error('Error al reproducir audio:', error);
                throw error;
            }
        },
        async eliminarAudio(fileNameOrUri) {
            // Extraer solo el nombre del archivo si es una URI
            let fileName = fileNameOrUri;
            if (fileNameOrUri.includes('/')) {
                fileName = fileNameOrUri.split('/').pop();
            }

            try {
                await Filesystem.deleteFile({
                    path: fileName,
                    directory: Directory.Data,
                });

                // Actualizar lista de audios
                await this.listarAudiosGuardados();
            } catch (error) {
                console.error('Error al eliminar audio:', error);
                throw error;
            }
        },
        async eliminarTodosLosAudios() {
            try {
                // Obtener lista de audios antes de eliminar
                const result = await Filesystem.readdir({
                    path: '',
                    directory: Directory.Data,
                });

                // Eliminar cada archivo
                for (const file of result.files) {
                    try {
                        await Filesystem.deleteFile({
                            path: file.name,
                            directory: Directory.Data,
                        });
                    } catch (error) {
                        console.error(`Error al eliminar ${file.name}:`, error);
                    }
                }

                // Actualizar lista de audios
                await this.listarAudiosGuardados();
            } catch (error) {
                console.error('Error al eliminar todos los audios:', error);
                throw error;
            }
        }
    },
});