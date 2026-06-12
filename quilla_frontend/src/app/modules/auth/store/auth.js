import { supabase } from "@/services/supabase/supabase";
import { defineStore } from "pinia";

export const auth = defineStore("auth", {
    state: () => ({
        user: null,
    }),
    actions: {
        async getUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            
            if (user) {
                const { data: perfil } = await supabase
                    .from('perfiles')
                    .select('rol')
                    .eq('id', user.id)
                    .single()
                
                if (perfil) {
                    user.rol = perfil.rol;
                } else {
                    user.rol = 'usuario'; // rol por defecto mientras carga
                }
            }
            this.user = user;
        },
        async logout() {
            this.user = null;
            const { error } = await supabase.auth.signOut()
            localStorage.removeItem(`sb-${import.meta.env.VITE_SUPABASE_KEY}-auth-token`);
        }
    },
});