// Simulación principal del impacto de meteoritos / Main meteor impact simulation controller.
class MeteorSimulation {
    constructor() {
        this.calculations = null;
        this.nasaAPI = null;
        this.isSimulating = false;
        this.currentSimulation = null;
        this.domCache = new Map();

        this.init();
    }

    init() {
        // Inicializar componentes / Initialize core components.
        this.earthMap2D = new EarthMap2D();
        this.calculations = new ImpactCalculations();

        // Configurar escuchas de eventos / Configure event listeners.
        this.setupEventListeners();

        // Cargar datos iniciales / Load default data.
        this.loadInitialData();
    }

    setupEventListeners() {
        // Botón de búsqueda de ubicación / Location search button.
        this.getElement('search-location')?.addEventListener('click', () => {
            this.searchLocation();
        });

        // Enter en el campo de ubicación / Trigger search on Enter key.
        this.getElement('location-input')?.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.searchLocation();
            }
        });

        // Controles de parámetros del meteorito / Meteor parameter controls.
        this.syncRangeWithLabel('meteor-size', 'size-value', 'm');
        this.syncRangeWithLabel('meteor-speed', 'speed-value', ' km/s');

        // Botones de simulación / Simulation control buttons.
        this.getElement('start-simulation')?.addEventListener('click', () => {
            this.startSimulation();
        });

        this.getElement('reset-simulation')?.addEventListener('click', () => {
            this.resetSimulation();
        });

        this.getElement('mitigation-mode')?.addEventListener('click', () => {
            this.toggleMitigationMode();
        });
    }
    
    async searchLocation() {
        const inputElement = this.getElement('location-input');
        const input = inputElement ? inputElement.value.trim() : '';
        if (!input) return;
        
        try {
            let coordinates;
            
            // Verificar si son coordenadas directas / Check if direct latitude-longitude values.
            if (input.includes(',')) {
                const parts = input.split(',');
                coordinates = {
                    lat: parseFloat(parts[0].trim()),
                    lon: parseFloat(parts[1].trim())
                };
            } else {
                // Buscar coordenadas usando geocoding / Resolve coordinates via geocoding service.
                coordinates = await this.geocodeLocation(input);
            }
            
            if (coordinates) {
                this.setImpactLocation(coordinates.lat, coordinates.lon);
                this.updateLocationDisplay(coordinates);
            } else {
                this.showError('No se pudo encontrar la ubicación especificada');
            }
        } catch (error) {
            console.error('Error al buscar ubicación:', error);
            this.showError('Error al buscar la ubicación');
        }
    }
    
    async geocodeLocation(locationName) {
        // Usar OpenStreetMap Nominatim API para geocoding / Use the OpenStreetMap Nominatim API for geocoding.
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
        );
        
        if (!response.ok) {
            throw new Error('Error en la búsqueda de geocoding');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        
        return null;
    }
    
    setImpactLocation(lat, lon) {
        // Establecer punto de impacto en el mapa 2D / Set impact point on the 2D map.
        this.earthMap2D.setImpactPoint(lat, lon);
        
        // Guardar coordenadas para la simulación / Persist coordinates for simulation runs.
        this.impactCoordinates = { lat, lon };
    }
    
    updateLocationDisplay(coordinates) {
        const locationDisplay = this.getElement('location-input');
        if (coordinates.displayName && locationDisplay) {
            locationDisplay.value = coordinates.displayName;
        }

        // Mostrar coordenadas en la interfaz / Display coordinates in the UI.
        this.showLocationInfo(coordinates);
    }

    showLocationInfo(coordinates) {
        // Crear o actualizar información de ubicación / Create or update location info panel.
        let locationInfo = this.getElement('location-info');
        if (!locationInfo) {
            locationInfo = document.createElement('div');
            locationInfo.id = 'location-info';
            locationInfo.className = 'location-info';
            document.querySelector('.control-panel').appendChild(locationInfo);
            this.domCache.set('location-info', locationInfo);
        }
        
        locationInfo.innerHTML = `
            <h4>📍 Ubicación Seleccionada</h4>
            <p><strong>Latitud:</strong> ${coordinates.lat.toFixed(4)}°</p>
            <p><strong>Longitud:</strong> ${coordinates.lon.toFixed(4)}°</p>
            ${coordinates.displayName ? `<p><strong>Lugar:</strong> ${coordinates.displayName}</p>` : ''}
        `;
    }
    
    startSimulation() {
        if (this.isSimulating) {
            this.showError('Ya hay una simulación en curso');
            return;
        }
        
        if (!this.impactCoordinates) {
            this.showError('Por favor selecciona una ubicación de impacto primero');
            return;
        }
        
        // Obtener parámetros del meteorito / Gather meteor parameters from the UI.
        const diameter = parseFloat(this.getElement('meteor-size')?.value || '0');
        const velocity = parseFloat(this.getElement('meteor-speed')?.value || '0');
        const density = this.getElement('meteor-density')?.value;
        
        // Calcular efectos del impacto / Compute impact effects.
        const effects = this.calculations.calculateAllEffects(diameter, velocity, density);
        
        // Guardar simulación actual / Persist current simulation snapshot.
        this.currentSimulation = {
            coordinates: this.impactCoordinates,
            parameters: { diameter, velocity, density },
            effects: effects,
            startTime: Date.now()
        };
        
        // Iniciar simulación visual / Start visual simulation.
        this.runVisualSimulation();
        
        // Mostrar resultados / Present calculated results.
        this.displaySimulationResults(effects);
        
        this.isSimulating = true;
        const startButton = this.getElement('start-simulation');
        if (startButton) {
            startButton.disabled = true;
            startButton.textContent = 'Simulando...';
        }
    }
    
    runVisualSimulation() {
        const { diameter, velocity } = this.currentSimulation.parameters;
        const { lat, lon } = this.currentSimulation.coordinates;
        
        // Crear meteorito en el mapa 2D / Render meteor on the 2D map.
        const meteorSize = Math.min(diameter / 1000, 0.2); // Escalar tamaño para visualización / Scale size for visualization.
        this.earthMap2D.createMeteor(meteorSize);

        // Animar trayectoria hacia la Tierra / Animate trajectory towards Earth.
        const duration = Math.max(2000, velocity * 50); // Duración basada en velocidad / Duration derived from speed.
        this.earthMap2D.animateMeteorToEarth(lat, lon, duration);

        // Simular efectos en tiempo real / Simulate real-time effects.
        this.simulateRealTimeEffects();
    }

    simulateRealTimeEffects() {
        const effects = this.currentSimulation.effects;
        const startTime = Date.now();

        const updateEffects = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 5000, 1); // 5 segundos de simulación / Five-second simulation window.

            // Actualizar efectos progresivamente / Update effects progressively.
            this.updateEffectDisplay(effects, progress);
            
            if (progress < 1) {
                requestAnimationFrame(updateEffects);
            } else {
                this.completeSimulation();
            }
        };
        
        updateEffects();
    }
    
    updateEffectDisplay(effects, progress) {
        // Actualizar datos del impacto / Update core impact metrics.
        this.setText('energy-value', this.formatEnergy(effects.energyMegatons * progress));
        this.setText('crater-diameter', this.formatDistance(effects.craterDiameter * progress));
        this.setText('casualties', Math.round(effects.casualties.fatalities * progress).toLocaleString());
        this.setText('destruction-zone', this.formatDistance(effects.totalDestructionZone * progress));

        // Actualizar efectos secundarios / Update secondary effect indicators.
        this.setText('earthquake-magnitude', `Magnitud: ${(effects.earthquake.magnitude * progress).toFixed(1)}`);
        this.setText('tsunami-height', `Altura: ${(effects.tsunami.height * progress).toFixed(1)}m`);
        this.setText('fire-radius', `Radio: ${this.formatDistance(effects.fire.radius * progress)}`);
        this.setText('dust-radius', `Radio: ${this.formatDistance(effects.dust.radius * progress)}`);
        
        // Agregar efectos visuales / Add visual feedback.
        this.addVisualEffects(progress);
    }

    addVisualEffects(progress) {
        // Efectos de pantalla basados en la magnitud del impacto / Screen effects based on impact magnitude.
        const energyMegatons = this.currentSimulation.effects.energyMegatons;

        if (energyMegatons > 10) {
            // Efecto de temblor para impactos grandes / Screen shake for large impacts.
            if (progress > 0.8) {
                document.body.classList.add('shake');
                setTimeout(() => {
                    document.body.classList.remove('shake');
                }, 500);
            }
        }

        if (energyMegatons > 100) {
            // Efecto de pulso para impactos muy grandes / Pulse effect for extreme impacts.
            if (progress > 0.9) {
                document.body.classList.add('pulse');
                setTimeout(() => {
                    document.body.classList.remove('pulse');
                }, 2000);
            }
        }
    }
    
    displaySimulationResults(effects) {
        // Mostrar clasificación del impacto / Display impact classification.
        this.showImpactClassification(effects.impactClassification);

        // Mostrar efectos climáticos si aplican / Display climate effects when applicable.
        if (effects.climate.globalImpact) {
            this.showClimateEffects(effects.climate);
        }

        // Mostrar recomendaciones de mitigación / Display mitigation recommendations.
        this.showMitigationRecommendations(effects);
    }
    
    showImpactClassification(classification) {
        let classificationDiv = this.getElement('impact-classification');
        if (!classificationDiv) {
            classificationDiv = document.createElement('div');
            classificationDiv.id = 'impact-classification';
            classificationDiv.className = 'impact-classification';
            document.querySelector('.main-content').appendChild(classificationDiv);
            this.domCache.set('impact-classification', classificationDiv);
        }
        
        const levelColors = {
            'Local': '#4ecdc4',
            'Regional': '#ffc107',
            'Continental': '#ff6b6b',
            'Global': '#dc3545',
            'Extinción': '#6f42c1'
        };
        
        classificationDiv.innerHTML = `
            <h3>Clasificación del Impacto</h3>
            <div class="classification-card" style="border-left-color: ${levelColors[classification.level]}">
                <h4>${classification.level}</h4>
                <p>${classification.description}</p>
            </div>
        `;
    }
    
    showClimateEffects(climate) {
        let climateDiv = this.getElement('climate-effects');
        if (!climateDiv) {
            climateDiv = document.createElement('div');
            climateDiv.id = 'climate-effects';
            climateDiv.className = 'climate-effects';
            document.querySelector('.main-content').appendChild(climateDiv);
            this.domCache.set('climate-effects', climateDiv);
        }
        
        climateDiv.innerHTML = `
            <h3>🌡️ Efectos Climáticos Globales</h3>
            <div class="climate-card">
                <p><strong>Descenso de temperatura:</strong> ${climate.temperatureDrop.toFixed(1)}°C</p>
                <p><strong>Duración:</strong> ${climate.duration.toFixed(1)} años</p>
                <p><strong>Impacto:</strong> ${climate.globalImpact ? 'Global' : 'Regional'}</p>
            </div>
        `;
    }
    
    showMitigationRecommendations(effects) {
        const panel = this.getElement('mitigation-panel');
        panel.style.display = 'block';
        
        // Habilitar métodos de mitigación apropiados / Enable suitable mitigation methods.
        this.enableMitigationMethods(effects);
    }
    
    enableMitigationMethods(effects) {
        const buttons = document.querySelectorAll('.btn-mitigation');
        
        buttons.forEach(button => {
            const method = button.dataset.method;
            let enabled = false;
            
            switch (method) {
                case 'kinetic':
                    enabled = effects.energyMegatons < 1000;
                    break;
                case 'gravity':
                    enabled = effects.energyMegatons < 100;
                    break;
                case 'laser':
                    enabled = effects.energyMegatons < 10;
                    break;
                case 'shelters':
                    enabled = true; // Siempre disponible / Always available.
                    break;
            }
            
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
        });
    }
    
    completeSimulation() {
        this.isSimulating = false;
        const startButton = this.getElement('start-simulation');
        if (startButton) {
            startButton.disabled = false;
            startButton.textContent = 'Iniciar Simulación';
        }
        
        // Mostrar resumen final / Present final summary.
        this.showSimulationSummary();
    }

    showSimulationSummary() {
        const effects = this.currentSimulation.effects;

        // Crear resumen / Build summary markup.
        const summary = `
            <div class="simulation-summary">
                <h3>📊 Resumen de la Simulación</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <h4>Energía Liberada</h4>
                        <p>${this.formatEnergy(effects.energyMegatons)}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Víctimas Estimadas</h4>
                        <p>${effects.casualties.fatalities.toLocaleString()}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Zona Afectada</h4>
                        <p>${this.formatDistance(effects.totalDestructionZone)}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Clasificación</h4>
                        <p>${effects.impactClassification.level}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar resumen / Insert summary into the layout.
        const container = document.querySelector('.main-content');
        let summaryDiv = this.getElement('simulation-summary');
        if (!summaryDiv) {
            summaryDiv = document.createElement('div');
            summaryDiv.id = 'simulation-summary';
            container.appendChild(summaryDiv);
            this.domCache.set('simulation-summary', summaryDiv);
        }
        summaryDiv.innerHTML = summary;
    }
    
    resetSimulation() {
        this.isSimulating = false;
        this.currentSimulation = null;
        
        // Limpiar visualización 2D / Reset 2D visualization state.
        if (this.earthMap2D) {
            this.earthMap2D.impactZones = [];
            this.earthMap2D.meteorTrail = [];
            this.earthMap2D.mitigationEffects = [];
        }

        // Limpiar datos mostrados / Clear displayed metrics.
        this.clearDisplayData();

        // Resetear botones / Reset action buttons.
        const startButton = this.getElement('start-simulation');
        if (startButton) {
            startButton.disabled = false;
            startButton.textContent = 'Iniciar Simulación';
        }

        // Ocultar panel de mitigación / Hide mitigation panel.
        const mitigationPanel = this.getElement('mitigation-panel');
        if (mitigationPanel) {
            mitigationPanel.style.display = 'none';
        }
    }
    
    clearDisplayData() {
        // Limpiar datos del impacto / Reset impact data labels.
        this.setText('energy-value', '-');
        this.setText('crater-diameter', '-');
        this.setText('casualties', '-');
        this.setText('destruction-zone', '-');

        // Limpiar efectos secundarios / Reset secondary effect labels.
        this.setText('earthquake-magnitude', 'Magnitud: -');
        this.setText('tsunami-height', 'Altura: -');
        this.setText('fire-radius', 'Radio: -');
        this.setText('dust-radius', 'Radio: -');

        // Limpiar elementos adicionales / Remove auxiliary elements.
        const elementsToRemove = [
            'impact-classification',
            'climate-effects',
            'simulation-summary'
        ];

        elementsToRemove.forEach(id => {
            const element = this.getElement(id);
            if (element) {
                element.remove();
                this.domCache.delete(id);
            }
        });
    }

    toggleMitigationMode() {
        const panel = this.getElement('mitigation-panel');
        if (!panel) {
            return;
        }

        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible && this.currentSimulation) {
            this.enableMitigationMethods(this.currentSimulation.effects);
        }
    }
    
    // Sincronizar controles deslizantes con sus etiquetas / Sync slider controls with display labels.
    syncRangeWithLabel(rangeId, labelId, suffix) {
        const range = this.getElement(rangeId);
        const label = this.getElement(labelId);

        if (!range || !label) {
            return;
        }

        const updateLabel = () => {
            label.textContent = `${range.value}${suffix}`;
        };

        updateLabel();
        range.addEventListener('input', updateLabel);
    }

    // Establecer texto de forma segura / Safely set element text content.
    setText(id, value) {
        const element = this.getElement(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Obtener y cachear elementos del DOM / Retrieve and cache DOM elements.
    getElement(id) {
        const cached = this.domCache.get(id);
        if (cached && document.body.contains(cached)) {
            return cached;
        }

        const element = document.getElementById(id);
        if (element) {
            this.domCache.set(id, element);
        } else {
            this.domCache.delete(id);
        }

        return element;
    }

    // Funciones de utilidad / General utility helpers.
    formatEnergy(megatons) {
        if (megatons >= 1000) {
            return `${(megatons / 1000).toFixed(1)} GT`;
        } else if (megatons >= 1) {
            return `${megatons.toFixed(1)} MT`;
        } else {
            return `${(megatons * 1000).toFixed(0)} KT`;
        }
    }
    
    formatDistance(km) {
        if (km >= 1000) {
            return `${(km / 1000).toFixed(1)} Mm`;
        } else {
            return `${km.toFixed(1)} km`;
        }
    }
    
    showError(message) {
        // Crear o actualizar mensaje de error / Create or update transient error banner.
        let errorDiv = this.getElement('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'error-message';
            document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.control-panel'));
            this.domCache.set('error-message', errorDiv);
        }
        
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>⚠️ ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Auto-remover después de 5 segundos / Auto-remove after five seconds.
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
                this.domCache.delete('error-message');
            }
        }, 5000);
    }

    async loadInitialData() {
        // Cargar datos de meteoritos cercanos / Load nearby meteor data.
        try {
            await this.loadNearEarthObjects();
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    }
    
    async loadNearEarthObjects() {
        // Integración con la NASA API cuando esté disponible / Integrate with NASA API when available.
        const api = this.nasaAPI || window.nasaAPI;
        if (api && typeof api.getNearEarthObjects === 'function') {
            await api.getNearEarthObjects();
            api.displayNearEarthObjects?.();
            api.displayHazardAlerts?.();
        } else {
            console.log('Cargando objetos cercanos a la Tierra (modo local) / Loading near-earth objects (local mode).');
        }
    }
}

// Exportar para uso global / Expose globally.
window.MeteorSimulation = MeteorSimulation;
