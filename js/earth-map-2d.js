// Mapa 2D basado en OpenStreetMap / 2D map powered by OpenStreetMap tiles.
class EarthMap2D {
    constructor() {
        // Referencias DOM esenciales / Core DOM references.
        this.container = document.getElementById('earth-container');
        this.mapElement = document.getElementById('earth-map');
        this.marker = document.getElementById('impact-marker');
        this.currentCoordinates = { lat: 39.8283, lon: -98.5795 };
        this.map = null;
        this.conusBounds = null;

        this.initMap();
    }

    initMap() {
        if (!this.container || !this.mapElement || typeof L === 'undefined') {
            console.warn('Leaflet no está disponible en este entorno. / Leaflet is not available in this environment.');
            return;
        }

        // Limitar la vista a Estados Unidos continental / Limit the view to the continental United States.
        this.conusBounds = L.latLngBounds(
            [24.396308, -125.000000],
            [49.384358, -66.934570]
        );

        this.map = L.map(this.mapElement, {
            zoomControl: false,
            attributionControl: false,
            minZoom: 4,
            maxZoom: 10,
            maxBounds: this.conusBounds.pad(0.08),
            maxBoundsViscosity: 1.0,
            worldCopyJump: false,
            inertia: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.fitBounds(this.conusBounds);

        this.map.on('move', () => this.updateMarkerPosition());
        this.map.on('zoom', () => this.updateMarkerPosition());

        window.addEventListener('resize', () => this.handleResize());

        this.map.whenReady(() => {
            this.setImpactPoint(this.currentCoordinates.lat, this.currentCoordinates.lon);
            this.updateMarkerPosition();
        });
    }

    handleResize() {
        if (!this.map) {
            return;
        }

        this.map.invalidateSize();
        this.updateMarkerPosition();
    }

    constrainToBounds(lat, lon) {
        if (!this.conusBounds) {
            return { lat, lon };
        }

        const south = this.conusBounds.getSouth();
        const north = this.conusBounds.getNorth();
        const west = this.conusBounds.getWest();
        const east = this.conusBounds.getEast();

        return {
            lat: Math.min(Math.max(lat, south), north),
            lon: Math.min(Math.max(lon, west), east)
        };
    }

    setImpactPoint(lat, lon) {
        const constrained = this.constrainToBounds(lat, lon);
        this.currentCoordinates = constrained;

        if (!this.map) {
            return;
        }

        const target = L.latLng(constrained.lat, constrained.lon);
        const zoomLevel = Math.max(this.map.getZoom(), 5);
        this.map.flyTo(target, zoomLevel, { duration: 0.8 });

        this.updateMarkerPosition();
        this.activateMarker();
    }

    updateMarkerPosition() {
        if (!this.container || !this.marker || !this.map) {
            return;
        }

        const { lat, lon } = this.currentCoordinates;
        const point = this.map.latLngToContainerPoint([lat, lon]);

        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
            return;
        }

        this.marker.style.left = `${point.x}px`;
        this.marker.style.top = `${point.y}px`;
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
