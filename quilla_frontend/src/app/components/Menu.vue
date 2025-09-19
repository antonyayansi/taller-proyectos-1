<template>
    <footer
        class="grid grid-cols-4 gap-4 p-4 border-t-2 rounded-t-3xl  border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100">
        <div class="flex justify-start">
            <button
                :class="route.name == 'home' ? 'px-4 py-2 bg-primary-500 rounded-4xl text-white dark:bg-primary-500' : ''"
                class="px-4 py-2 dark:text-zinc-200" @click="routerTo('home')">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19" />
                    </svg>
                </span>
            </button>
        </div>
        <div class="flex justify-center">
            <button
                :class="route.name == 'search' ? 'px-4 py-2 bg-primary-500 rounded-4xl text-white dark:bg-primary-500' : ''"
                class="px-4 py-2 dark:text-zinc-200 " @click="routerTo('search')">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 12 12">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M8.11 9.17a4.5 4.5 0 0 1-2.61.832c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5c0 .972-.308 1.87-.832 2.61l1.61 1.61a.749.749 0 1 1-1.06 1.06l-1.61-1.61zm.893-3.67c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5S3.573 2 5.503 2s3.5 1.57 3.5 3.5"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>
        <div class="flex justify-center">
            <button
                :class="route.name == 'tops' ? 'px-4 py-2 bg-primary-500 rounded-4xl text-white dark:bg-primary-500' : ''"
                class="px-4 py-2 dark:text-zinc-200 " @click="routerTo('tops')">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27" />
                </svg>
            </button>
        </div>
        <div class="flex justify-center">
            <button
                :class="route.name == 'profile' ? 'px-4 py-2 bg-primary-500 rounded-4xl text-white dark:bg-primary-500' : ''"
                class="px-4 py-2 dark:text-zinc-200 " @click="routerTo('profile')">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>

    </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const routerTo = (name = "home") => {
    router.push({ name });
}


</script>