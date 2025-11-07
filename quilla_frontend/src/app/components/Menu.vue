<template>
    <footer
        class="sticky bottom-0 z-[50] grid grid-cols-4 gap-4 p-4 border-t-2 rounded-t-3xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-100">

        <!-- El elemento que se moverá para resaltar la opción activa -->
        <div class="absolute h-12 bg-primary-500 rounded-full transition-all duration-300 ease-in-out"
            :style="highlightStyle">
        </div>

        <!-- Botón Home -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[0] = el">
            <button class="px-4 py-2  "
                :class="route.name === 'home.index' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('home.index')">
                <i class="pi pi-home" style="font-size: 1.5rem;"></i>
            </button>
        </div>

        <!-- Botón Search -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[1] = el">
            <button class="px-4 py-2  "
                :class="route.name === 'search' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('search')">
                <i class="pi pi-camera" style="font-size: 1.5rem;"></i>
            </button>
        </div>

        <!-- Botón Tops -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[2] = el">
            <button class="px-4 py-2  "
                :class="route.name === 'tops' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('tops')">
                <i class="pi pi-hashtag" style="font-size: 1.5rem;"></i>
            </button>
        </div>

        <!-- Botón Profile -->
        <div class="relative z-10 flex justify-center" :ref="el => menuItemRefs[3] = el">
            <button class="px-4 py-2  "
                :class="route.name === 'profile' ? 'text-white' : 'text-zinc-600 dark:text-zinc-200'"
                @click="routerTo('profile')">
                <i class="pi pi-user" style="font-size: 1.5rem;"></i>
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
