// Simulación principal del impacto de meteoritos
class MeteorSimulation {
    constructor() {
        this.earth3D = null;
        this.calculations = null;
        this.isSimulating = false;
        this.currentSimulation = null;
        
        this.init();
    }
    
    init() {
        // Inicializar componentes
        this.earthMap2D = new EarthMap2D();
        this.calculations = new ImpactCalculations();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar datos iniciales
        this.loadInitialData();
    }
    
    setupEventListeners() {
        // Botón de búsqueda de ubicación
        document.getElementById('search-location').addEventListener('click', () => {
            this.searchLocation();
        });
        
        // Enter en el campo de ubicación
        document.getElementById('location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchLocation();
            }
        });
        
        // Controles de parámetros del meteorito
        document.getElementById('meteor-size').addEventListener('input', (e) => {
            document.getElementById('size-value').textContent = e.target.value + 'm';
        });
        
        document.getElementById('meteor-speed').addEventListener('input', (e) => {
            document.getElementById('speed-value').textContent = e.target.value + ' km/s';
        });
        
        // Botones de simulación
        document.getElementById('start-simulation').addEventListener('click', () => {
            this.startSimulation();
        });
        
        document.getElementById('reset-simulation').addEventListener('click', () => {
            this.resetSimulation();
        });
        
        document.getElementById('mitigation-mode').addEventListener('click', () => {
            this.toggleMitigationMode();
        });
    }
    
    async searchLocation() {
        const input = document.getElementById('location-input').value.trim();
        if (!input) return;
        
        try {
            let coordinates;
            
            // Verificar si son coordenadas directas
            if (input.includes(',')) {
                const parts = input.split(',');
                coordinates = {
                    lat: parseFloat(parts[0].trim()),
                    lon: parseFloat(parts[1].trim())
                };
            } else {
                // Buscar coordenadas usando geocoding
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
        // Usar OpenStreetMap Nominatim API para geocoding
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
        // Establecer punto de impacto en el mapa 2D
        this.earthMap2D.setImpactPoint(lat, lon);
        
        // Guardar coordenadas para la simulación
        this.impactCoordinates = { lat, lon };
    }
    
    updateLocationDisplay(coordinates) {
        const locationDisplay = document.getElementById('location-input');
        if (coordinates.displayName) {
            locationDisplay.value = coordinates.displayName;
        }
        
        // Mostrar coordenadas en la interfaz
        this.showLocationInfo(coordinates);
    }
    
    showLocationInfo(coordinates) {
        // Crear o actualizar información de ubicación
        let locationInfo = document.getElementById('location-info');
        if (!locationInfo) {
            locationInfo = document.createElement('div');
            locationInfo.id = 'location-info';
            locationInfo.className = 'location-info';
            document.querySelector('.control-panel').appendChild(locationInfo);
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
        
        // Obtener parámetros del meteorito
        const diameter = parseFloat(document.getElementById('meteor-size').value);
        const velocity = parseFloat(document.getElementById('meteor-speed').value);
        const density = document.getElementById('meteor-density').value;
        
        // Calcular efectos del impacto
        const effects = this.calculations.calculateAllEffects(diameter, velocity, density);
        
        // Guardar simulación actual
        this.currentSimulation = {
            coordinates: this.impactCoordinates,
            parameters: { diameter, velocity, density },
            effects: effects,
            startTime: Date.now()
        };
        
        // Iniciar simulación visual
        this.runVisualSimulation();
        
        // Mostrar resultados
        this.displaySimulationResults(effects);
        
        this.isSimulating = true;
        document.getElementById('start-simulation').disabled = true;
        document.getElementById('start-simulation').textContent = 'Simulando...';
    }
    
    runVisualSimulation() {
        const { diameter, velocity } = this.currentSimulation.parameters;
        const { lat, lon } = this.currentSimulation.coordinates;
        
        // Crear meteorito en el mapa 2D
        const meteorSize = Math.min(diameter / 1000, 0.2); // Escalar tamaño para visualización
        this.earthMap2D.createMeteor(meteorSize);
        
        // Animar trayectoria hacia la Tierra
        const duration = Math.max(2000, velocity * 50); // Duración basada en velocidad
        this.earthMap2D.animateMeteorToEarth(lat, lon, duration);
        
        // Simular efectos en tiempo real
        this.simulateRealTimeEffects();
    }
    
    simulateRealTimeEffects() {
        const effects = this.currentSimulation.effects;
        const startTime = Date.now();
        
        const updateEffects = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 5000, 1); // 5 segundos de simulación
            
            // Actualizar efectos progresivamente
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
        // Actualizar datos del impacto
        document.getElementById('energy-value').textContent = 
            this.formatEnergy(effects.energyMegatons * progress);
        
        document.getElementById('crater-diameter').textContent = 
            this.formatDistance(effects.craterDiameter * progress);
        
        document.getElementById('casualties').textContent = 
            Math.round(effects.casualties.fatalities * progress).toLocaleString();
        
        document.getElementById('destruction-zone').textContent = 
            this.formatDistance(effects.totalDestructionZone * progress);
        
        // Actualizar efectos secundarios
        document.getElementById('earthquake-magnitude').textContent = 
            `Magnitud: ${(effects.earthquake.magnitude * progress).toFixed(1)}`;
        
        document.getElementById('tsunami-height').textContent = 
            `Altura: ${(effects.tsunami.height * progress).toFixed(1)}m`;
        
        document.getElementById('fire-radius').textContent = 
            `Radio: ${this.formatDistance(effects.fire.radius * progress)}`;
        
        document.getElementById('dust-radius').textContent = 
            `Radio: ${this.formatDistance(effects.dust.radius * progress)}`;
        
        // Agregar efectos visuales
        this.addVisualEffects(progress);
    }
    
    addVisualEffects(progress) {
        // Efectos de pantalla basados en la magnitud del impacto
        const energyMegatons = this.currentSimulation.effects.energyMegatons;
        
        if (energyMegatons > 10) {
            // Efecto de temblor para impactos grandes
            if (progress > 0.8) {
                document.body.classList.add('shake');
                setTimeout(() => {
                    document.body.classList.remove('shake');
                }, 500);
            }
        }
        
        if (energyMegatons > 100) {
            // Efecto de pulso para impactos muy grandes
            if (progress > 0.9) {
                document.body.classList.add('pulse');
                setTimeout(() => {
                    document.body.classList.remove('pulse');
                }, 2000);
            }
        }
    }
    
    displaySimulationResults(effects) {
        // Mostrar clasificación del impacto
        this.showImpactClassification(effects.impactClassification);
        
        // Mostrar efectos climáticos si aplican
        if (effects.climate.globalImpact) {
            this.showClimateEffects(effects.climate);
        }
        
        // Mostrar recomendaciones de mitigación
        this.showMitigationRecommendations(effects);
    }
    
    showImpactClassification(classification) {
        let classificationDiv = document.getElementById('impact-classification');
        if (!classificationDiv) {
            classificationDiv = document.createElement('div');
            classificationDiv.id = 'impact-classification';
            classificationDiv.className = 'impact-classification';
            document.querySelector('.main-content').appendChild(classificationDiv);
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
        let climateDiv = document.getElementById('climate-effects');
        if (!climateDiv) {
            climateDiv = document.createElement('div');
            climateDiv.id = 'climate-effects';
            climateDiv.className = 'climate-effects';
            document.querySelector('.main-content').appendChild(climateDiv);
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
        const panel = document.getElementById('mitigation-panel');
        panel.style.display = 'block';
        
        // Habilitar métodos de mitigación apropiados
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
                    enabled = true; // Siempre disponible
                    break;
            }
            
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
        });
    }
    
    completeSimulation() {
        this.isSimulating = false;
        document.getElementById('start-simulation').disabled = false;
        document.getElementById('start-simulation').textContent = 'Iniciar Simulación';
        
        // Mostrar resumen final
        this.showSimulationSummary();
    }
    
    showSimulationSummary() {
        const effects = this.currentSimulation.effects;
        
        // Crear resumen
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
        
        // Insertar resumen
        const container = document.querySelector('.main-content');
        let summaryDiv = document.getElementById('simulation-summary');
        if (!summaryDiv) {
            summaryDiv = document.createElement('div');
            summaryDiv.id = 'simulation-summary';
            container.appendChild(summaryDiv);
        }
        summaryDiv.innerHTML = summary;
    }
    
    resetSimulation() {
        this.isSimulating = false;
        this.currentSimulation = null;
        
        // Limpiar visualización 2D
        if (this.earthMap2D) {
            this.earthMap2D.impactZones = [];
            this.earthMap2D.meteorTrail = [];
            this.earthMap2D.mitigationEffects = [];
        }
        
        // Limpiar datos mostrados
        this.clearDisplayData();
        
        // Resetear botones
        document.getElementById('start-simulation').disabled = false;
        document.getElementById('start-simulation').textContent = 'Iniciar Simulación';
        
        // Ocultar panel de mitigación
        document.getElementById('mitigation-panel').style.display = 'none';
    }
    
    clearDisplayData() {
        // Limpiar datos del impacto
        document.getElementById('energy-value').textContent = '-';
        document.getElementById('crater-diameter').textContent = '-';
        document.getElementById('casualties').textContent = '-';
        document.getElementById('destruction-zone').textContent = '-';
        
        // Limpiar efectos secundarios
        document.getElementById('earthquake-magnitude').textContent = 'Magnitud: -';
        document.getElementById('tsunami-height').textContent = 'Altura: -';
        document.getElementById('fire-radius').textContent = 'Radio: -';
        document.getElementById('dust-radius').textContent = 'Radio: -';
        
        // Limpiar elementos adicionales
        const elementsToRemove = [
            'impact-classification',
            'climate-effects',
            'simulation-summary'
        ];
        
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }
    
    toggleMitigationMode() {
        const panel = document.getElementById('mitigation-panel');
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible && this.currentSimulation) {
            this.enableMitigationMethods(this.currentSimulation.effects);
        }
    }
    
    // Funciones de utilidad
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
        // Crear o actualizar mensaje de error
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'error-message';
            document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.control-panel'));
        }
        
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>⚠️ ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    async loadInitialData() {
        // Cargar datos de meteoritos cercanos
        try {
            await this.loadNearEarthObjects();
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    }
    
    async loadNearEarthObjects() {
        // Esta función será implementada en nasa-api.js
        console.log('Cargando objetos cercanos a la Tierra...');
    }
}

// Exportar para uso global
window.MeteorSimulation = MeteorSimulation;
