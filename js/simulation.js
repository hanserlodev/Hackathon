// Control principal de la simulación / Main simulation controller.
// Control principal de la simulación / Main simulation controller.
class MeteorSimulation {
    constructor() {
        this.calculations = new ImpactCalculations();
        this.nasaAPI = null;
        this.earthMap2D = new EarthMap2D();
        this.calculations = new ImpactCalculations();
        this.nasaAPI = null;
        this.earthMap2D = new EarthMap2D();
        this.isSimulating = false;
        this.impactCoordinates = null;

        // Ubicaciones de referencia para búsquedas rápidas / Reference locations for quick searches.
        this.referenceLocations = [
            { query: 'denver', lat: 39.7392, lon: -104.9903, label: 'Denver, CO, EE. UU.' },
            { query: 'new york', lat: 40.7128, lon: -74.0060, label: 'Nueva York, NY, EE. UU.' },
            { query: 'los angeles', lat: 34.0522, lon: -118.2437, label: 'Los Ángeles, CA, EE. UU.' },
            { query: 'chicago', lat: 41.8781, lon: -87.6298, label: 'Chicago, IL, EE. UU.' },
            { query: 'houston', lat: 29.7604, lon: -95.3698, label: 'Houston, TX, EE. UU.' }
        ];

        this.init();
    }

    init() {
        // Configurar escuchas y valores iniciales / Configure listeners and default values.
        // Configurar escuchas y valores iniciales / Configure listeners and default values.
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        const sizeSlider = document.getElementById('meteor-size');
        const speedSlider = document.getElementById('meteor-speed');
        const startButton = document.getElementById('start-simulation');
        const resetButton = document.getElementById('reset-simulation');
        const mitigationButton = document.getElementById('mitigation-mode');
        const searchButton = document.getElementById('search-location');
        const locationInput = document.getElementById('location-input');

        if (sizeSlider) {
            sizeSlider.addEventListener('input', () => {
                document.getElementById('size-value').textContent = `${sizeSlider.value}m`;
            });
        }

        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                document.getElementById('speed-value').textContent = `${speedSlider.value} km/s`;
            });
        }

        if (startButton) {
            startButton.addEventListener('click', () => this.startSimulation());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetSimulation());
        }

        if (mitigationButton) {
            mitigationButton.addEventListener('click', () => this.toggleMitigationPanel());
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchLocation());
        }

        if (locationInput) {
            locationInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.searchLocation();
                }
            });
        }
    }

    loadInitialData() {
        // Seleccionar primera ubicación de referencia / Select first reference location.
        const defaultLocation = this.referenceLocations[0];
        this.setImpactLocation(defaultLocation.lat, defaultLocation.lon, defaultLocation.label);
        const input = document.getElementById('location-input');
        if (input) {
            input.value = defaultLocation.label;
        }
    }

    searchLocation() {
        const input = document.getElementById('location-input');
        if (!input) {
            return;
        }

        const value = input.value.trim();
        if (!value) {
            this.showInlineMessage('Por favor ingresa una ubicación o coordenadas. / Please enter a location or coordinates.');
            return;
        }

        if (value.includes(',')) {
            const [latString, lonString] = value.split(',');
            const lat = parseFloat(latString);
            const lon = parseFloat(lonString);

            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                this.setImpactLocation(lat, lon, `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`);
                return;
            }
        }

        const normalized = value.toLowerCase();
        const match = this.referenceLocations.find(location => normalized.includes(location.query));

        if (match) {
            this.setImpactLocation(match.lat, match.lon, match.label);
            input.value = match.label;
        } else {
            this.showInlineMessage('Ubicación no encontrada. Usa coordenadas latitud, longitud. / Location not found. Use latitude, longitude coordinates.');
        }
    }

    setImpactLocation(lat, lon, label) {
        this.impactCoordinates = { lat, lon, label };
        const sizeSlider = document.getElementById('meteor-size');
        const speedSlider = document.getElementById('meteor-speed');
        const startButton = document.getElementById('start-simulation');
        const resetButton = document.getElementById('reset-simulation');
        const mitigationButton = document.getElementById('mitigation-mode');
        const searchButton = document.getElementById('search-location');
        const locationInput = document.getElementById('location-input');

        if (sizeSlider) {
            sizeSlider.addEventListener('input', () => {
                document.getElementById('size-value').textContent = `${sizeSlider.value}m`;
            });
        }

        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                document.getElementById('speed-value').textContent = `${speedSlider.value} km/s`;
            });
        }

        if (startButton) {
            startButton.addEventListener('click', () => this.startSimulation());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetSimulation());
        }

        if (mitigationButton) {
            mitigationButton.addEventListener('click', () => this.toggleMitigationPanel());
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchLocation());
        }

        if (locationInput) {
            locationInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.searchLocation();
                }
            });
        }
    }

    loadInitialData() {
        // Seleccionar primera ubicación de referencia / Select first reference location.
        const defaultLocation = this.referenceLocations[0];
        this.setImpactLocation(defaultLocation.lat, defaultLocation.lon, defaultLocation.label);
        const input = document.getElementById('location-input');
        if (input) {
            input.value = defaultLocation.label;
        }
    }

    searchLocation() {
        const input = document.getElementById('location-input');
        if (!input) {
            return;
        }

        const value = input.value.trim();
        if (!value) {
            this.showInlineMessage('Por favor ingresa una ubicación o coordenadas. / Please enter a location or coordinates.');
            return;
        }

        if (value.includes(',')) {
            const [latString, lonString] = value.split(',');
            const lat = parseFloat(latString);
            const lon = parseFloat(lonString);

            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                this.setImpactLocation(lat, lon, `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`);
                return;
            }
        }

        const normalized = value.toLowerCase();
        const match = this.referenceLocations.find(location => normalized.includes(location.query));

        if (match) {
            this.setImpactLocation(match.lat, match.lon, match.label);
            input.value = match.label;
        } else {
            this.showInlineMessage('Ubicación no encontrada. Usa coordenadas latitud, longitud. / Location not found. Use latitude, longitude coordinates.');
        }
    }

    setImpactLocation(lat, lon, label) {
        this.impactCoordinates = { lat, lon, label };
        this.earthMap2D.setImpactPoint(lat, lon);
        this.renderLocationInfo();
        this.renderLocationInfo();
    }

    renderLocationInfo() {
        const container = document.querySelector('.control-panel');
        if (!container || !this.impactCoordinates) {
            return;
        }

        let info = document.getElementById('location-info');
        if (!info) {
            info = document.createElement('div');
            info.id = 'location-info';
            info.className = 'nearest-city-info';
            container.appendChild(info);

    renderLocationInfo() {
        const container = document.querySelector('.control-panel');
        if (!container || !this.impactCoordinates) {
            return;
        }

        let info = document.getElementById('location-info');
        if (!info) {
            info = document.createElement('div');
            info.id = 'location-info';
            info.className = 'nearest-city-info';
            container.appendChild(info);
        }

        const { lat, lon, label } = this.impactCoordinates;
        info.innerHTML = `
            <h4>📍 Ubicación Seleccionada / Selected Location</h4>
            <p><strong>Descripción:</strong> ${label}</p>
            <p><strong>Latitud:</strong> ${lat.toFixed(2)}°</p>
            <p><strong>Longitud:</strong> ${lon.toFixed(2)}°</p>

        const { lat, lon, label } = this.impactCoordinates;
        info.innerHTML = `
            <h4>📍 Ubicación Seleccionada / Selected Location</h4>
            <p><strong>Descripción:</strong> ${label}</p>
            <p><strong>Latitud:</strong> ${lat.toFixed(2)}°</p>
            <p><strong>Longitud:</strong> ${lon.toFixed(2)}°</p>
        `;
    }


    startSimulation() {
        if (this.isSimulating) {
            this.showInlineMessage('La simulación ya está en curso. / The simulation is already running.');
            this.showInlineMessage('La simulación ya está en curso. / The simulation is already running.');
            return;
        }


        if (!this.impactCoordinates) {
            this.showInlineMessage('Selecciona una ubicación antes de iniciar. / Select a location before starting.');
            this.showInlineMessage('Selecciona una ubicación antes de iniciar. / Select a location before starting.');
            return;
        }


        const diameter = parseFloat(document.getElementById('meteor-size').value);
        const velocity = parseFloat(document.getElementById('meteor-speed').value);
        const density = document.getElementById('meteor-density').value;


        const effects = this.calculations.calculateAllEffects(diameter, velocity, density);
        this.currentSimulation = { effects };

        this.displayEffects(effects);
        this.triggerSimulationEffects();
        this.earthMap2D.animateImpact();

        this.currentSimulation = { effects };

        this.displayEffects(effects);
        this.triggerSimulationEffects();
        this.earthMap2D.animateImpact();

        this.isSimulating = true;
        this.updateStartButton(true);

        setTimeout(() => this.finishSimulation(), 1500);
    }

    displayEffects(effects) {
        // Actualizar métricas principales / Update key metrics.
        this.setText('energy-value', this.formatEnergy(effects.energyMegatons));
        this.setText('crater-diameter', this.formatDistance(effects.craterDiameter));
        this.setText('casualties', effects.casualties.fatalities.toLocaleString('es-MX'));
        this.setText('destruction-zone', this.formatDistance(effects.totalDestructionZone));

        this.setText('earthquake-magnitude', `Magnitud: ${effects.earthquake.magnitude.toFixed(1)}`);
        this.setText('tsunami-height', `Altura: ${effects.tsunami.height.toFixed(1)} m`);
        this.setText('fire-radius', `Radio: ${this.formatDistance(effects.fire.radius)}`);
        this.setText('dust-radius', `Radio: ${this.formatDistance(effects.dust.radius)}`);
        this.updateStartButton(true);

        setTimeout(() => this.finishSimulation(), 1500);
    }

    displayEffects(effects) {
        // Actualizar métricas principales / Update key metrics.
        this.setText('energy-value', this.formatEnergy(effects.energyMegatons));
        this.setText('crater-diameter', this.formatDistance(effects.craterDiameter));
        this.setText('casualties', effects.casualties.fatalities.toLocaleString('es-MX'));
        this.setText('destruction-zone', this.formatDistance(effects.totalDestructionZone));

        this.setText('earthquake-magnitude', `Magnitud: ${effects.earthquake.magnitude.toFixed(1)}`);
        this.setText('tsunami-height', `Altura: ${effects.tsunami.height.toFixed(1)} m`);
        this.setText('fire-radius', `Radio: ${this.formatDistance(effects.fire.radius)}`);
        this.setText('dust-radius', `Radio: ${this.formatDistance(effects.dust.radius)}`);
    }

    triggerSimulationEffects() {
        document.body.classList.add('page-shake');
        setTimeout(() => document.body.classList.remove('page-shake'), 600);

        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 400);
    }

    finishSimulation() {

    triggerSimulationEffects() {
        document.body.classList.add('page-shake');
        setTimeout(() => document.body.classList.remove('page-shake'), 600);

        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 400);
    }

    finishSimulation() {
        this.isSimulating = false;
        this.updateStartButton(false);
        this.updateStartButton(false);
    }


    resetSimulation() {
        this.isSimulating = false;
        this.currentSimulation = null;
        this.updateStartButton(false);

        ['energy-value', 'crater-diameter', 'casualties', 'destruction-zone'].forEach(id => this.setText(id, '-'));
        this.setText('earthquake-magnitude', 'Magnitud: -');
        this.setText('tsunami-height', 'Altura: -');
        this.setText('fire-radius', 'Radio: -');
        this.setText('dust-radius', 'Radio: -');
    }

    toggleMitigationPanel() {
        this.updateStartButton(false);

        ['energy-value', 'crater-diameter', 'casualties', 'destruction-zone'].forEach(id => this.setText(id, '-'));
        this.setText('earthquake-magnitude', 'Magnitud: -');
        this.setText('tsunami-height', 'Altura: -');
        this.setText('fire-radius', 'Radio: -');
        this.setText('dust-radius', 'Radio: -');
    }

    toggleMitigationPanel() {
        const panel = document.getElementById('mitigation-panel');
        if (!panel) {
            return;
        }

        const isVisible = panel.style.display === 'block';
        if (!panel) {
            return;
        }

        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
    }

    updateStartButton(disabled) {
        const startButton = document.getElementById('start-simulation');
        if (!startButton) {
            return;
        }

        startButton.disabled = disabled;
        startButton.textContent = disabled ? 'Simulando...' : 'Iniciar Simulación';
    }

    setText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    }

    updateStartButton(disabled) {
        const startButton = document.getElementById('start-simulation');
        if (!startButton) {
            return;
        }

        startButton.disabled = disabled;
        startButton.textContent = disabled ? 'Simulando...' : 'Iniciar Simulación';
    }

    setText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatEnergy(megatons) {
        return `${megatons.toFixed(2)} MT`;
    }

    formatDistance(distance) {
        return `${distance.toFixed(1)} km`;
    }

    showInlineMessage(message) {
        let box = document.getElementById('simulation-message');
        if (!box) {
            box = document.createElement('div');
            box.id = 'simulation-message';
            box.className = 'warning-message';
            const panel = document.querySelector('.control-panel');
            if (panel) {
                panel.insertAdjacentElement('afterend', box);
            }
        }

        box.textContent = message;
        return `${megatons.toFixed(2)} MT`;
    }

    formatDistance(distance) {
        return `${distance.toFixed(1)} km`;
    }

    showInlineMessage(message) {
        let box = document.getElementById('simulation-message');
        if (!box) {
            box = document.createElement('div');
            box.id = 'simulation-message';
            box.className = 'warning-message';
            const panel = document.querySelector('.control-panel');
            if (panel) {
                panel.insertAdjacentElement('afterend', box);
            }
        }

        box.textContent = message;
        setTimeout(() => {
            if (box) {
                box.remove();
            if (box) {
                box.remove();
            }
        }, 4000);
        }, 4000);
    }
}
}
