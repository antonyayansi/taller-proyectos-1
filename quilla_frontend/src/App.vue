<template>
    <RouterView />
    <Toaster richColors position="top-center" :theme="isDark ? 'dark' : 'light'" />
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'
import useAuth from './app/modules/auth/hooks/useAuth'
import { Toaster } from 'vue-sonner'

const {
    getUser
} = useAuth()

const isDark = useDark()
const toggleDark = useToggle(isDark.value)

getUser()
</script>