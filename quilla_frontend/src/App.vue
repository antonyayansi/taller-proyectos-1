<template>
    <RouterView />
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'
import useAuth from './app/modules/auth/hooks/useAuth'

const {
    getUser
} = useAuth()

const isDark = useDark()
const toggleDark = useToggle(isDark.value)

getUser()
</script>