<template>
    <footer
        class="sticky bottom-0 z-[50] grid grid-cols-4 gap-4 p-4 border-t-2 rounded-t-3xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100">

        <!-- El elemento que se moverá para resaltar la opción activa -->
        <div class="absolute h-12 bg-primary-500 rounded-full transition-all duration-300 ease-in-out"
            :style="highlightStyle">
        </div>

        <!-- Botón Home -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[0] = el">
            <button class="px-4 py-2 transition-colors duration-300"
                :class="route.name === 'home.index' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('home.index')">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19" />
                </svg>
            </button>
        </div>

        <!-- Botón Search -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[1] = el">
            <button class="px-4 py-2 transition-colors duration-300"
                :class="route.name === 'search' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('search')">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
                </svg>
            </button>
        </div>

        <!-- Botón Tops -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[2] = el">
            <button class="px-4 py-2 transition-colors duration-300"
                :class="route.name === 'tops' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('tops')">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27" />
                </svg>
            </button>
        </div>

        <!-- Botón Profile -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[3] = el">
            <button class="px-4 py-2 transition-colors duration-300"
                :class="route.name === 'profile' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('profile')">
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
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue';

const router = useRouter();
const route = useRoute();

// Mapa de nombres de ruta a índices para encontrar la referencia correcta
const routeMap = {
    'home.index': 0,
    'search': 1,
    'tops': 2,
    'profile': 3,
};

const menuItemRefs = ref([]);
const highlightStyle = reactive({
    transform: 'translateX(0px)',
    width: '0px',
    top: '1rem', // Equivalente a p-4
});

// Función para actualizar la posición del resaltador
const updateHighlight = () => {
    let activeIndex = routeMap[route.name];

    // Si no encontramos la ruta exacta, intentamos buscar por prefijo
    if (activeIndex === undefined) {
        const routeName = route.name;
        if (routeName && routeName.startsWith('home')) {
            activeIndex = 0;
        } else if (routeName && routeName.startsWith('search')) {
            activeIndex = 1;
        } else if (routeName && routeName.startsWith('tops')) {
            activeIndex = 2;
        } else if (routeName && routeName.startsWith('profile')) {
            activeIndex = 3;
        }
    }

    // Nos aseguramos de que el índice y el elemento existan
    if (activeIndex === undefined || !menuItemRefs.value[activeIndex]) {
        return;
    }

    const activeItem = menuItemRefs.value[activeIndex];

    const itemWidth = activeItem.offsetWidth;
    const itemOffsetLeft = activeItem.offsetLeft;

    highlightStyle.width = `${itemWidth}px`;
    highlightStyle.transform = `translateX(${itemOffsetLeft}px)`;
};

// Observador que se activa cada vez que la ruta cambia
watch(() => route.name, async () => {
    // **LA CORRECCIÓN CLAVE**
    // Esperamos al siguiente ciclo de actualización del DOM antes de calcular
    await nextTick();
    updateHighlight();
});

// Se ejecuta cuando el componente se monta para establecer la posición inicial
onMounted(async () => {
    // Esperamos a que el DOM esté completamente renderizado
    await nextTick();
    updateHighlight();
    // Añadimos un listener para actualizar la posición si la ventana cambia de tamaño
    window.addEventListener('resize', updateHighlight);
});

// Es buena práctica limpiar los listeners cuando el componente se destruye
onUnmounted(() => {
    window.removeEventListener('resize', updateHighlight);
});


const routerTo = (name = "home.index") => {
    if (route.name !== name) {
        router.push({ name });
    }
}
</script>
