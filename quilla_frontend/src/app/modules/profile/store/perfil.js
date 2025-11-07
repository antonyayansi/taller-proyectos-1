import { supabase } from "@/services/supabase/supabase";
import useAuth from "../../auth/hooks/useAuth";
import { defineStore } from "pinia";

const {
    user
} = useAuth()

export const perfil = defineStore("perfil", {
    state: () => ({
        favoritos: []
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
        }
    },
});