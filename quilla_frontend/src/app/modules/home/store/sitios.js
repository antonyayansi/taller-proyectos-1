import { addMarker } from "@/services/gps";
import { supabase } from "@/services/supabase/supabase";
import { defineStore } from "pinia";
import useHome from "../hooks/useHome";

const {
    map
} = useHome()

export const sitios = defineStore("sitios", {
    state: () => ({
        sitios: [],
        sitiosbk: [],
    }),
    actions: {
        async getSitios() {
            try {
                const { data, error } = await supabase
                    .from('sitios')
                    .select('*')
                if (error) throw error;
                this.sitios = data;
                this.sitiosbk = data;
            } catch (e) {
                console.error('Error fetching sitios:', e);
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
