<template>
    <div class="home-container">
        <!-- Search bar -->
        <div class="search-wrapper">
            <div class="search-box">
                <i class="pi pi-search search-icon"></i>
                <InputText
                    @keyup="searchSitios($event.target.value)"
                    placeholder="Buscar sitios turísticos..."
                    fluid
                    class="search-input"
                />
            </div>
        </div>

        <!-- Map section -->
        <div class="map-section">
            <div class="map-header">
                <div class="map-header-left">
                    <span class="map-label">
                        <i class="pi pi-map-marker"></i>
                        Tu ubicación actual
                    </span>
                    <span v-if="isMapLoaded" class="map-badge-live">
                        <span class="live-dot"></span> EN VIVO
                    </span>
                </div>
                <button class="btn-refresh" @click="obtenerUbicacion()">
                    <i class="pi pi-refresh"></i>
                    Actualizar
                </button>
            </div>

            <!-- Map container -->
            <div class="map-wrapper" :class="{ 'map-loading': !isMapLoaded }">
                <div ref="mapContainer" class="map-element"></div>
                <!-- Loading overlay -->
                <div v-if="!isMapLoaded" class="map-overlay">
                    <div class="map-spinner">
                        <i class="pi pi-spin pi-spinner"></i>
                        <span>Cargando mapa...</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sites list -->
        <div class="sites-section">
            <div v-if="sitios.length > 0">
                <div class="sites-header">
                    <h2 class="sites-title">
                        <i class="pi pi-globe"></i>
                        Sitios Turísticos
                    </h2>
                    <span class="sites-count">{{ sitios.length }} lugares</span>
                </div>

                <div class="sites-list">
                    <router-link
                        v-for="sitio in sitios"
                        :key="sitio.id"
                        :to="{ name: 'home.sitio', params: { id: sitio.id } }"
                        class="site-card"
                    >
                        <div class="site-icon">
                            <span class="site-emoji">📍</span>
                        </div>
                        <div class="site-info">
                            <h3 class="site-name">{{ sitio.nombre }}</h3>
                            <p class="site-desc">{{ sitio.descripcion }}</p>
                            <div class="site-footer">
                                <span v-if="sitio.distancia" class="site-distance">
                                    <i class="pi pi-compass"></i>
                                    {{ sitio.distancia }} m
                                </span>
                                <span class="site-cta">Ver más <i class="pi pi-angle-right"></i></span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Loading state -->
            <div v-else class="loading-state">
                <div class="loading-spinner"></div>
                <p class="loading-title">Cargando sitios turísticos...</p>
                <p class="loading-sub">Esto solo tomará un momento</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import useHome from '../hooks/useHome';
import useSitios from '../hooks/useSitios';
import { InputText } from 'primevue';
import { storeToRefs } from 'pinia';
import { home as homeStore } from '../store/home';

const mapContainer = ref(null);

const {
    obtenerUbicacion,
    setMapContainer,
    startWatchingPosition,
    stopWatchingPosition,
} = useHome()

const { isMapLoaded } = storeToRefs(homeStore())

const {
    sitios,
    getSitios,
    searchSitios
} = useSitios()

onMounted(async () => {
    setMapContainer(mapContainer.value);
    await startWatchingPosition()
    await getSitios()
})

onBeforeUnmount(async () => {
    await stopWatchingPosition()
})
</script>

<style scoped>
.home-container {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fdf4ff 50%, #f0fdf4 100%);
    padding: 0 0 80px;
}

:global(.dark) .home-container {
    background: linear-gradient(160deg, #0f0f1a 0%, #18101f 50%, #0a1410 100%);
}

/* Search */
.search-wrapper {
    padding: 20px 16px 12px;
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(240, 244, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

:global(.dark) .search-wrapper {
    background: rgba(15, 15, 26, 0.85);
    border-bottom-color: rgba(99, 102, 241, 0.2);
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 14px;
    color: #6366f1;
    font-size: 15px;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding-left: 42px !important;
    height: 46px;
    border-radius: 14px !important;
    border: 1.5px solid rgba(99, 102, 241, 0.2) !important;
    font-size: 15px;
    background: white;
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.08);
    transition: all 0.2s;
}

.search-input:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
}

/* Map section */
.map-section {
    margin: 12px 16px 0;
}

.map-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.map-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.map-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #52525b;
}

:global(.dark) .map-label {
    color: #a1a1aa;
}

.map-label i {
    color: #6366f1;
}

.map-badge-live {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #16a34a;
    background: rgba(22, 163, 74, 0.1);
    border: 1px solid rgba(22, 163, 74, 0.3);
    border-radius: 20px;
    padding: 2px 8px;
}

.live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16a34a;
    animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
}

.btn-refresh {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 10px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-refresh:hover {
    background: rgba(99, 102, 241, 0.15);
    transform: scale(1.02);
}

.btn-refresh i {
    font-size: 12px;
}

.map-wrapper {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    height: 200px;
    box-shadow: 0 4px 24px rgba(99, 102, 241, 0.18), 0 1px 4px rgba(0,0,0,0.08);
    border: 2px solid rgba(99, 102, 241, 0.15);
}

.map-element {
    width: 100%;
    height: 100%;
}

.map-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(240, 244, 255, 0.85);
    backdrop-filter: blur(4px);
}

:global(.dark) .map-overlay {
    background: rgba(15, 15, 26, 0.85);
}

.map-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #6366f1;
}

.map-spinner i {
    font-size: 28px;
}

.map-spinner span {
    font-size: 13px;
    font-weight: 500;
    color: #71717a;
}

/* Sites section */
.sites-section {
    margin: 20px 16px 0;
}

.sites-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.sites-title {
    font-size: 17px;
    font-weight: 700;
    color: #18181b;
    display: flex;
    align-items: center;
    gap: 7px;
}

:global(.dark) .sites-title {
    color: #fafafa;
}

.sites-title i {
    color: #6366f1;
}

.sites-count {
    font-size: 12px;
    font-weight: 600;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    padding: 3px 10px;
}

.sites-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.site-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: white;
    border-radius: 16px;
    padding: 16px;
    border: 1px solid rgba(99, 102, 241, 0.1);
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    text-decoration: none;
    color: inherit;
    transition: all 0.25s ease;
}

:global(.dark) .site-card {
    background: #1c1c2e;
    border-color: rgba(99, 102, 241, 0.2);
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

.site-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.18);
    border-color: rgba(99, 102, 241, 0.35);
}

.site-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.site-emoji {
    font-size: 22px;
    line-height: 1;
}

.site-info {
    flex: 1;
    min-width: 0;
}

.site-name {
    font-size: 16px;
    font-weight: 700;
    color: #18181b;
    margin: 0 0 4px;
    line-height: 1.3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

:global(.dark) .site-name {
    color: #fafafa;
}

.site-desc {
    font-size: 13px;
    color: #71717a;
    margin: 0 0 10px;
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

:global(.dark) .site-desc {
    color: #a1a1aa;
}

.site-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.site-distance {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #16a34a;
}

.site-distance i {
    font-size: 11px;
}

.site-cta {
    font-size: 13px;
    font-weight: 600;
    color: #6366f1;
    display: flex;
    align-items: center;
    gap: 2px;
}

/* Loading state */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
}

.loading-spinner {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 3px solid rgba(99, 102, 241, 0.15);
    border-top-color: #6366f1;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-title {
    font-size: 16px;
    font-weight: 600;
    color: #52525b;
    margin: 0 0 6px;
}

:global(.dark) .loading-title {
    color: #a1a1aa;
}

.loading-sub {
    font-size: 13px;
    color: #a1a1aa;
    margin: 0;
}
</style>