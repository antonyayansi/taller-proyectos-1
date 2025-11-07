<template>
    <div v-if="user">
        <div v-if="user?.user_metadata" class="my-6">
            <div class="flex flex-col space-y-2 items-center justify-center">
                <Avatar :image="user.user_metadata.avatar_url" size="xlarge" shape="circle" />
                <h2 class="text-2xl font-semibold mb-2">Bienvenido, {{ user.user_metadata.full_name }}</h2>
                <p class="text-zinc-600 dark:text-zinc-300">{{ user.user_metadata.email }}</p>
            </div>
        </div>
    </div>
    <div class="flex flex-col items-center justify-center h-screen" v-else>
        <div class="p-4">
            <Button @click="loginWithGoogle" fluid icon="pi pi-google" severity="secondary"
                label="Iniciar con Google" />
        </div>
    </div>
</template>

<script setup>
import {
    Button,
    Avatar
} from 'primevue'
import useAuth from '../../auth/hooks/useAuth';
import { supabase } from '@/services/supabase/supabase';

const {
    user
} = useAuth()

const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `/`,
        },
    })
}
</script>