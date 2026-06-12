import Decimal from "decimal.js-light";

const initLatLng = { lat: -13.516985, lng: -71.978113 };

// Función auxiliar para convertir grados a radianes
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

export const calculateDistance = async (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en metros

    return distance;
}

// Variable para controlar si ya se configuraron las opciones
let isOptionsSet = false;
let map = null

export const loadMapa = async (contentHTML, latlng = initLatLng, iconType = 'location', drag = false, callback, htmlContent = null) => {
    const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");

    // Solo configurar las opciones una vez
    if (!isOptionsSet) {
        setOptions({ key: import.meta.env.VITE_GOOGLE_MAPS_KEY });
        isOptionsSet = true;
    }

    const { Map } = await importLibrary("maps");
    const { AdvancedMarkerElement } = await importLibrary("marker");

    map = new Map(contentHTML, {
        center: {
            lat: new Decimal(latlng.lat).toNumber(),
            lng: new Decimal(latlng.lng).toNumber()
        },
        zoom: 15,
        mapId: "DEMO_MAP_ID", // Required for AdvancedMarkerElement
    });

    // Crear el marcador con el ícono seleccionado
    const marker = await addMarker(latlng, iconType, 'Ubicacion', drag, htmlContent);

    // Si drag es true, agregar evento de click al mapa para mover el marcador
    if (drag) {
        map.addListener('click', (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            // Mover el marcador a la nueva posición
            marker.position = { lat: newLat, lng: newLng };

            // Ejecutar callback si se proporciona
            if (callback && typeof callback === 'function') {
                callback({ lat: newLat, lng: newLng });
            }
        });

        // Agregar evento de arrastre al marcador
        marker.addListener('dragend', (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            // Ejecutar callback si se proporciona
            if (callback && typeof callback === 'function') {
                callback({ lat: newLat, lng: newLng });
            }
        });
    }

    return { map, marker };
}

// Función para agregar marcadores adicionales al mapa
export const addMarker = async (latlng, iconType = 'location', title = 'Ubicacion', draggable = false, htmlContent = null) => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Crear contenido personalizado del marcador
    const markerContent = createCustomMarkerContent(iconType);

    const marker = new AdvancedMarkerElement({
        position: {
            lat: new Decimal(latlng.lat).toNumber(),
            lng: new Decimal(latlng.lng).toNumber()
        },
        map: map,
        content: markerContent,
        title: title || 'Ubicación',
        gmpDraggable: draggable
    });

    // Si se proporciona contenido HTML, crear InfoWindow
    if (htmlContent) {
        const { InfoWindow } = await google.maps.importLibrary("maps");

        const infoWindow = new InfoWindow({
            content: htmlContent
        });

        // Agregar evento de click al marcador para mostrar el InfoWindow
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }

    return marker;
}

// Función para crear contenido personalizado del marcador
const createCustomMarkerContent = (iconType) => {
    const iconData = getIconData(iconType);

    // Crear un div contenedor para el marcador
    const markerDiv = document.createElement('div');
    markerDiv.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${iconData.background};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        position: relative;
    `;

    // Agregar el ícono SVG o emoji
    const iconElement = document.createElement('div');
    iconElement.innerHTML = iconData.icon;
    iconElement.style.cssText = `
        font-size: 20px;
        color: white;
        line-height: 1;
    `;

    markerDiv.appendChild(iconElement);

    // Agregar una pequeña flecha en la parte inferior
    const arrow = document.createElement('div');
    arrow.style.cssText = `
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${iconData.background};
    `;

    markerDiv.appendChild(arrow);

    return markerDiv;
}

// Función para obtener datos del ícono según el tipo
const getIconData = (iconType) => {
    const icons = {
        location: {
            background: "#ff6b35",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>`
        },
        turismo: {
            background: "green",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,8H5V6H19M21,4H3C2.45,4 2,4.45 2,5V7C2,7.55 2.45,8 3,8V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V8C21.55,8 22,7.55 22,7V5C22,4.45 21.55,4 21,4Z"/>
            </svg>`
        },
        museo: {
            background: "#34a853",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,8H5V6H19M21,4H3C2.45,4 2,4.45 2,5V7C2,7.55 2.45,8 3,8V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V8C21.55,8 22,7.55 22,7V5C22,4.45 21.55,4 21,4Z"/>
            </svg>`
        },
        restaurante: {
            background: "#e74c3c",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.28,12.92 16.28,15.18 14.88,16.58C13.49,17.97 11.23,17.97 9.83,16.58L7.03,13.78L9.86,10.94L14.88,11.53M19.37,6.54C19.37,8.18 18.94,9.82 18.07,11.25L15.27,8.45C16.13,7.59 17.77,7.59 18.63,8.45C19.13,8.95 19.37,9.74 19.37,6.54Z"/>
            </svg>`
        },
        hotel: {
            background: "#9b59b6",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z"/>
            </svg>`
        },
        parque: {
            background: "#27ae60",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
            </svg>`
        }
    };

    return icons[iconType] || icons['location'];
}

// Función auxiliar para obtener colores según el tipo de ícono (mantener para compatibilidad)
const getIconColor = (iconType) => {
    const colors = {
        location: "#ff6b35",
        turismo: "#4285f4",
        museo: "#34a853",
    };
    return colors[iconType] || colors.location;
}