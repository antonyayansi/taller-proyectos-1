<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase/supabase';
import Button from 'primevue/button';
import { useDark } from '@vueuse/core'
import mapboxgl from 'mapbox-gl'

const isDark = useDark()

const toggleLight = () => {
    isDark.value = !isDark.value;
}

const sitios = ref([])

const mapView = ref(null);

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
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9uYWxkbzE1OTM5IiwiYSI6ImNtZnJlMDN3OTA4ZWcya3E0YTc5eW54dmMifQ.RqsLNCYJNBHSGMaQWN6lew';

    const map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9, // starting zoom
        telemetry: false
    });
})


</script>

<template>
    <div id="mapa">
    </div>
    <Button label="modo noche" @click="toggleLight" />
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