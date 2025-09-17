<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../src/services/supabase/supabase';


const sitios = ref([])


onMounted(async () => {
    const {
        data, error
    } = await supabase.from('sitios').select('id, nombre, descripcion')

    if (error) {
        console.log('Se produjo un error', error)
    } else {
        sitios.value = data
        console.log(sitios.value)
    }
})

</script>

<template>
    <div>
        <h1>Sitios Turísticos</h1>
        <div v-if="sitios.length > 0">
            <ul>
                <li v-for="sitio in sitios" :key="sitio.id">
                    <h2>{{ sitio.nombre }}</h2>
                    <p>{{ sitio.descripcion }}</p>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Cargando sitios...</p>
        </div>
    </div>
</template>
