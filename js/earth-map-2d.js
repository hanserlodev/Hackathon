// 2D map powered by OpenStreetMap tiles
class EarthMap2D {
    constructor() {
        // Core DOM references
        this.container = document.getElementById('earth-container');
        this.mapElement = document.getElementById('earth-map');
        this.marker = document.getElementById('impact-marker');
        this.currentCoordinates = { lat: 39.8283, lon: -98.5795 };
        this.map = null;
        this.conusBounds = null;
        
        // Store circle layers by type
        this.circleLayers = {
            seismic: null,
            tsunami: null,
            blastWave: [],
            thermal: null,
            ejecta: null
        };
        
        // Store current effects for redrawing
        this.currentEffects = null;
        this.isOceanImpact = false;

        this.initMap();
    }

    initMap() {
        if (!this.container || !this.mapElement || typeof L === 'undefined') {
            console.error('Leaflet is not available or map elements missing');
            return;
        }

        console.log('Initializing Leaflet map...');

        // Limit view to continental United States
        this.conusBounds = L.latLngBounds(
            [24.396308, -125.000000],
            [49.384358, -66.934570]
        );

        this.map = L.map(this.mapElement, {
            zoomControl: true,
            attributionControl: false,
            minZoom: 3,
            maxZoom: 12,
            maxBounds: this.conusBounds.pad(0.08),
            maxBoundsViscosity: 1.0,
            worldCopyJump: false,
            inertia: true
        });

        console.log('Map instance created:', this.map);

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

    // Store effects for later use
    storeEffects(effects, isOceanImpact) {
        this.currentEffects = effects;
        this.isOceanImpact = isOceanImpact;
    }

    // Toggle seismic circle
    toggleSeismic(show) {
        console.log('toggleSeismic called:', show, 'Map exists:', !!this.map, 'Effects:', !!this.currentEffects);
        
        if (!this.map || !this.currentEffects) {
            console.warn('Cannot toggle seismic: map or effects missing');
            return;
        }

        if (!show) {
            if (this.circleLayers.seismic) {
                this.map.removeLayer(this.circleLayers.seismic);
                this.circleLayers.seismic = null;
                console.log('Seismic circle removed');
            }
            return;
        }

        const { lat, lon } = this.currentCoordinates;
        const radius = this.currentEffects.earthquake.radius;
        
        console.log('Creating seismic circle at:', lat, lon, 'radius:', radius, 'km');

        this.circleLayers.seismic = L.circle([lat, lon], {
            radius: radius * 1000, // Convert km to meters
            color: '#8B4513',
            fillColor: '#CD853F',
            fillOpacity: 0.3,
            weight: 3,
            opacity: 0.7
        }).addTo(this.map);

        this.circleLayers.seismic.bindTooltip(
            `Seismic Waves: ${radius.toFixed(1)} km (Magnitude ${this.currentEffects.earthquake.magnitude.toFixed(1)})`,
            { permanent: false, direction: 'top', className: 'zone-tooltip' }
        );
        
        console.log('Seismic circle created successfully');
    }

    // Toggle tsunami circle
    toggleTsunami(show) {
        if (!this.map || !this.currentEffects) return;

        if (!show) {
            if (this.circleLayers.tsunami) {
                this.map.removeLayer(this.circleLayers.tsunami);
                this.circleLayers.tsunami = null;
            }
            return;
        }

        if (!this.isOceanImpact || !this.currentEffects.tsunami.applicable) {
            console.log('No tsunami for land impacts');
            return;
        }

        const { lat, lon } = this.currentCoordinates;
        const radius = this.currentEffects.tsunami.radius;

        this.circleLayers.tsunami = L.circle([lat, lon], {
            radius: radius * 1000,
            color: '#0066cc',
            fillColor: '#3399ff',
            fillOpacity: 0.25,
            weight: 3,
            opacity: 0.8
        }).addTo(this.map);

        this.circleLayers.tsunami.bindTooltip(
            `Tsunami Propagation: ${radius.toFixed(1)} km (Height: ${this.currentEffects.tsunami.height.toFixed(1)}m)`,
            { permanent: false, direction: 'top', className: 'zone-tooltip' }
        );
    }

    // Toggle blast wave circles (5 zones)
    toggleBlastWave(show) {
        console.log('toggleBlastWave called:', show);
        
        if (!this.map || !this.currentEffects) {
            console.warn('Cannot toggle blast wave: map or effects missing');
            return;
        }

        // Clear existing blast circles
        this.circleLayers.blastWave.forEach(circle => this.map.removeLayer(circle));
        this.circleLayers.blastWave = [];

        if (!show || this.isOceanImpact) {
            console.log('Blast wave not shown (show=false or ocean impact)');
            return;
        }

        const { lat, lon } = this.currentCoordinates;
        const zones = this.currentEffects.casualties.zones;

        console.log('Creating 5 blast wave zones at:', lat, lon);

        const blastZones = [
            { radius: zones.glassBreakage, color: '#ffff00', fillColor: '#ffff99', opacity: 0.2, label: '1 psi - Glass Breakage' },
            { radius: zones.lightDestruction, color: '#ffd700', fillColor: '#ffeb99', opacity: 0.25, label: '2 psi - Light Damage' },
            { radius: zones.moderateDestruction, color: '#ffaa00', fillColor: '#ffcc66', opacity: 0.3, label: '5 psi - Moderate Damage' },
            { radius: zones.severeDestruction, color: '#ff6600', fillColor: '#ff9933', opacity: 0.4, label: '10 psi - Severe Damage' },
            { radius: zones.totalDestruction, color: '#ff0000', fillColor: '#ff4444', opacity: 0.5, label: '20 psi - Total Destruction' }
        ];

        blastZones.forEach((zone, index) => {
            const circle = L.circle([lat, lon], {
                radius: zone.radius * 1000,
                color: zone.color,
                fillColor: zone.fillColor,
                fillOpacity: zone.opacity,
                weight: 2,
                opacity: 0.7
            }).addTo(this.map);

            circle.bindTooltip(
                `${zone.label}: ${zone.radius.toFixed(1)} km`,
                { permanent: false, direction: 'top', className: 'zone-tooltip' }
            );

            this.circleLayers.blastWave.push(circle);
            console.log(`Blast zone ${index + 1} created:`, zone.label, zone.radius, 'km');
        });
    }

    // Toggle thermal fires circle
    toggleThermal(show) {
        if (!this.map || !this.currentEffects) return;

        if (!show) {
            if (this.circleLayers.thermal) {
                this.map.removeLayer(this.circleLayers.thermal);
                this.circleLayers.thermal = null;
            }
            return;
        }

        const { lat, lon } = this.currentCoordinates;
        const radius = this.currentEffects.fire.radius;

        this.circleLayers.thermal = L.circle([lat, lon], {
            radius: radius * 1000,
            color: '#ff4500',
            fillColor: '#ff6347',
            fillOpacity: 0.4,
            weight: 3,
            opacity: 0.8
        }).addTo(this.map);

        this.circleLayers.thermal.bindTooltip(
            `Thermal Radiation: ${radius.toFixed(1)} km (Fire ignition zone)`,
            { permanent: false, direction: 'top', className: 'zone-tooltip' }
        );
    }

    // Toggle ejecta cloud circle
    toggleEjecta(show) {
        if (!this.map || !this.currentEffects) return;

        if (!show) {
            if (this.circleLayers.ejecta) {
                this.map.removeLayer(this.circleLayers.ejecta);
                this.circleLayers.ejecta = null;
            }
            return;
        }

        const { lat, lon } = this.currentCoordinates;
        const radius = this.currentEffects.dust.radius;

        this.circleLayers.ejecta = L.circle([lat, lon], {
            radius: radius * 1000,
            color: '#555555',
            fillColor: '#888888',
            fillOpacity: 0.2,
            weight: 2,
            opacity: 0.6
        }).addTo(this.map);

        this.circleLayers.ejecta.bindTooltip(
            `Ejecta Cloud: ${radius.toFixed(1)} km (Dust and debris)`,
            { permanent: false, direction: 'top', className: 'zone-tooltip' }
        );
    }

    // Clear all impact zones
    clearImpactZones() {
        if (!this.map) return;

        console.log('Clearing all impact zones');

        // Clear all circle types
        this.toggleSeismic(false);
        this.toggleTsunami(false);
        this.toggleBlastWave(false);
        this.toggleThermal(false);
        this.toggleEjecta(false);

        this.currentEffects = null;
        this.isOceanImpact = false;
    }

    // Test function to verify circle rendering works
    testCircle() {
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }

        console.log('Creating test circle...');
        const { lat, lon } = this.currentCoordinates;
        
        const testCircle = L.circle([lat, lon], {
            radius: 100000, // 100 km in meters
            color: '#ff0000',
            fillColor: '#ff0000',
            fillOpacity: 0.5,
            weight: 3
        }).addTo(this.map);

        testCircle.bindTooltip('Test Circle: 100 km', { permanent: true });
        
        console.log('Test circle created at:', lat, lon);
        
        return testCircle;
    }
}
