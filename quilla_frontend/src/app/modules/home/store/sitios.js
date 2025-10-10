import { addMarker, calculateDistance } from "@/services/gps";
import { supabase } from "@/services/supabase/supabase";
import { defineStore } from "pinia";
import useHome from "../hooks/useHome";

const {
    ubicacionActual
} = useHome()

export const sitios = defineStore("sitios", {
    state: () => ({
        sitios: [],
        sitiosbk: [],
        sitioActive: null
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
                        categorias:categoria_id (
                            *
                        ),
                        imagenes_sitio (
                            *
                        ),
                        rutas (
                            *,
                            audios (
                                *
                            )
                        )
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
        }
    },
});
