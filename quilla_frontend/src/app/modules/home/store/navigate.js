import { supabase } from "@/services/supabase/supabase";
import { defineStore } from "pinia";
import useHome from "../hooks/useHome";
import { calculateDistance } from "@/services/gps";

const {
    ubicacionActual
} = useHome()

export const navigate = defineStore('navigate', {
    state: () => ({
        sitioActive: null,
        rutas: [],
        narrativa: '',
        parametros: {}
    }),
    actions: {
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
    }
})