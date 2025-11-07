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
            this.user = user;
        },
        async logout() {
            this.user = null;
            const { error } = await supabase.auth.signOut()
            localStorage.removeItem(`sb-${import.meta.env.VITE_SUPABASE_KEY}-auth-token`);
        }
    },
});