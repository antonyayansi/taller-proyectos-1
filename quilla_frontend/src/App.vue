<template>
    <RouterView />
    <Toaster richColors position="top-center" :theme="isDark ? 'dark' : 'light'" />
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'
import useAuth from './app/modules/auth/hooks/useAuth'
import { Toaster } from 'vue-sonner'
import useHome from './app/modules/home/hooks/useHome'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase/supabase'

const router = useRouter()

const {
    getUser
} = useAuth()

const {
    checkNetwork
} = useHome()

const isDark = useDark()
const toggleDark = useToggle(isDark.value)

getUser()
checkNetwork()

if (Capacitor.isNativePlatform()) {
    CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = event.url;
        if (url.includes('quilla://')) {
            const parsedUrl = new URL(url);
            
            // For OAuth flows that use PKCE (Supabase v2 default)
            if (parsedUrl.searchParams.has('code')) {
                await supabase.auth.exchangeCodeForSession(parsedUrl.searchParams.get('code'));
            } 
            // For implicit flows just in case
            else if (parsedUrl.hash) {
                const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));
                if (hashParams.has('access_token') && hashParams.has('refresh_token')) {
                    await supabase.auth.setSession({
                        access_token: hashParams.get('access_token'),
                        refresh_token: hashParams.get('refresh_token')
                    });
                }
            }
            
            getUser();
            router.push('/profile');
        }
    });
}
</script>