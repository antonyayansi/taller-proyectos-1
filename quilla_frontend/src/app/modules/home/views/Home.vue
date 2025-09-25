<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button';
import { useDark } from '@vueuse/core'
import mapboxgl from 'mapbox-gl'
import { storeToRefs } from 'pinia';
import { useHomeStore } from '@/app/modules/home/store/home'



const isDark = useDark()

const homeStore = useHomeStore();
const { sitios } = storeToRefs(homeStore)



const toggleLight = () => {
    isDark.value = !isDark.value;
}

onMounted(async () => {
    await homeStore.fetchSitios();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9uYWxkbzE1OTM5IiwiYSI6ImNtZnJlMDN3OTA4ZWcya3E0YTc5eW54dmMifQ.RqsLNCYJNBHSGMaQWN6lew';

    const map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 9,
        telemetry: false
    });

    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });

    map.addControl(geolocate);

    map.on('load', () => {
        geolocate.trigger();
    });
})
</script>

<template>
    <Button label="modo noche" @click="toggleLight" />

    <div>
        <h1>Sitios Turísticos</h1>
    </div>

    <div class="relative w-full h-[500px] rounded-2xl overflow-hidden mt-64">

        <div id="mapa" class="w-full h-full"></div>

        <div class="absolute z-20 top-5 left-0 right-0">
            <h2 class="text-center text-2xl font-bold text-primary [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">
                Tu ubicación
            </h2>
        </div>

        <div
            class="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle,transparent_35%,theme(colors.white)_70%)] dark:bg-[radial-gradient(circle,transparent_10%,theme(colors.black)_70%)]">
        </div>

    </div>
</template>

<style scoped></style>