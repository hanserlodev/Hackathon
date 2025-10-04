// Mapa 2D basado en imagen estática / 2D map based on a static image.
class EarthMap2D {
    constructor() {
        // Referencias DOM esenciales / Core DOM references.
        this.container = document.getElementById('earth-container');
        this.mapImage = document.getElementById('earth-map');
        this.marker = document.getElementById('impact-marker');
        this.currentCoordinates = { lat: 19.4326, lon: -99.1332 };

        this.bindEvents();
        this.updateMarkerPosition();
    }

    bindEvents() {
        // Recalcular al cargar imagen y al cambiar el tamaño / Recompute on image load and resize events.
        if (this.mapImage) {
            this.mapImage.addEventListener('load', () => this.updateMarkerPosition());
        }

        window.addEventListener('resize', () => this.updateMarkerPosition());
    }

    setImpactPoint(lat, lon) {
        // Guardar coordenadas y actualizar marcador / Store coordinates and refresh marker.
        this.currentCoordinates = { lat, lon };
        this.updateMarkerPosition();
        this.activateMarker();
    }

    updateMarkerPosition() {
        if (!this.container || !this.marker || !this.mapImage) {
            return;
        }

        const bounds = this.container.getBoundingClientRect();
        const { lat, lon } = this.currentCoordinates;
        const { x, y } = this.projectMercator(lat, lon, bounds.width, bounds.height);

        this.marker.style.left = `${x}px`;
        this.marker.style.top = `${y}px`;
    }

    projectMercator(lat, lon, width, height) {
        // Convertir a radianes y limitar valores extremos / Convert to radians and clamp extremes.
        const lambda = (lon + 180) / 360;
        const sinPhi = Math.sin((lat * Math.PI) / 180);
        const safeSinPhi = Math.min(Math.max(sinPhi, -0.9999), 0.9999);

        const x = lambda * width;
        const y = (0.5 - Math.log((1 + safeSinPhi) / (1 - safeSinPhi)) / (4 * Math.PI)) * height;

        return {
            x: Math.min(Math.max(x, 0), width),
            y: Math.min(Math.max(y, 0), height)
        };
    }

    activateMarker() {
        if (!this.marker) {
            return;
        }

        this.marker.classList.remove('impact-marker-active');
        // Forzar reinicio de animación / Force animation restart.
        void this.marker.offsetWidth;
        this.marker.classList.add('impact-marker-active');
    }

    animateImpact() {
        // Simplemente reactiva la animación del marcador / Reactivate marker animation only.
        this.activateMarker();
    }
}
