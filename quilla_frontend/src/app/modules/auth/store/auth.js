import { defineStore } from "pinia";

export const auth = defineStore("auth", {
    state: () => ({
        user: null,
    }),
    actions: {
        getUser() {
            const userData = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_KEY}-auth-token`);
            if (userData) {
                this.user = JSON.parse(userData)?.user;
            }
        },
    },
});