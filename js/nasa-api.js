// Integración con NASA NEO API
class NASAAPI {
    constructor() {
        this.apiKey = 'QceqJ4dDvyiejRyGSmRuUF7Akjd52QJTU4KPqoqP'; // API key de la NASA
        this.baseURL = 'https://api.nasa.gov/neo/rest/v1';
        this.nearEarthObjects = [];
        this.lastUpdate = null;
    }
    
    // Obtener objetos cercanos a la Tierra
    async getNearEarthObjects(startDate = null, endDate = null) {
        try {
            // Si no se proporcionan fechas, usar los próximos 7 días
            if (!startDate) {
                const today = new Date();
                startDate = today.toISOString().split('T')[0];
            }
            
            if (!endDate) {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 7);
                endDate = futureDate.toISOString().split('T')[0];
            }
            
            const url = `${this.baseURL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Procesar datos
            this.processNearEarthObjects(data);
            
            return this.nearEarthObjects;
            
        } catch (error) {
            console.error('Error al obtener objetos cercanos a la Tierra:', error);
            throw error;
        }
    }
    
    // Procesar datos de objetos cercanos a la Tierra
    processNearEarthObjects(data) {
        this.nearEarthObjects = [];
        
        // Iterar sobre las fechas en los datos
        Object.keys(data.near_earth_objects).forEach(date => {
            data.near_earth_objects[date].forEach(neo => {
                const processedNEO = this.processNEOData(neo);
                this.nearEarthObjects.push(processedNEO);
            });
        });
        
        // Ordenar por peligrosidad (más peligrosos primero)
        this.nearEarthObjects.sort((a, b) => {
            return b.hazardScore - a.hazardScore;
        });
        
        this.lastUpdate = new Date();
    }
    
    // Procesar datos individuales de NEO
    processNEOData(neo) {
        // Calcular tamaño estimado
        const estimatedDiameter = this.estimateDiameter(neo.estimated_diameter);
        
        // Calcular velocidad promedio
        const averageVelocity = this.calculateAverageVelocity(neo.close_approach_data);
        
        // Calcular puntuación de peligro
        const hazardScore = this.calculateHazardScore(neo, estimatedDiameter, averageVelocity);
        
        // Obtener próximo acercamiento
        const nextApproach = this.getNextApproach(neo.close_approach_data);
        
        return {
            id: neo.id,
            name: neo.name,
            estimatedDiameter: estimatedDiameter,
            averageVelocity: averageVelocity,
            hazardScore: hazardScore,
            isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
            nextApproach: nextApproach,
            orbitalData: neo.orbital_data,
            absoluteMagnitude: neo.absolute_magnitude_h,
            nasaUrl: neo.nasa_jpl_url
        };
    }
    
    // Estimar diámetro basado en datos de la NASA
    estimateDiameter(estimatedDiameter) {
        const meters = estimatedDiameter.meters;
        return {
            min: meters.estimated_diameter_min,
            max: meters.estimated_diameter_max,
            average: (meters.estimated_diameter_min + meters.estimated_diameter_max) / 2
        };
    }
    
    // Calcular velocidad promedio
    calculateAverageVelocity(closeApproachData) {
        if (!closeApproachData || closeApproachData.length === 0) {
            return 0;
        }
        
        const velocities = closeApproachData.map(approach => {
            return parseFloat(approach.relative_velocity.kilometers_per_second);
        });
        
        return velocities.reduce((sum, vel) => sum + vel, 0) / velocities.length;
    }
    
    // Calcular puntuación de peligro
    calculateHazardScore(neo, diameter, velocity) {
        let score = 0;
        
        // Factor de tamaño (0-40 puntos)
        const sizeScore = Math.min(40, (diameter.average / 100) * 10);
        score += sizeScore;
        
        // Factor de velocidad (0-30 puntos)
        const velocityScore = Math.min(30, velocity / 2);
        score += velocityScore;
        
        // Factor de proximidad (0-20 puntos)
        if (neo.close_approach_data && neo.close_approach_data.length > 0) {
            const nextApproach = neo.close_approach_data[0];
            const missDistance = parseFloat(nextApproach.miss_distance.kilometers);
            const proximityScore = Math.max(0, 20 - (missDistance / 1000000));
            score += proximityScore;
        }
        
        // Factor de peligrosidad potencial (0-10 puntos)
        if (neo.is_potentially_hazardous_asteroid) {
            score += 10;
        }
        
        return Math.min(100, score);
    }
    
    // Obtener próximo acercamiento
    getNextApproach(closeApproachData) {
        if (!closeApproachData || closeApproachData.length === 0) {
            return null;
        }
        
        // Encontrar el acercamiento más cercano en el tiempo
        const sortedApproaches = closeApproachData.sort((a, b) => {
            return new Date(a.close_approach_date) - new Date(b.close_approach_date);
        });
        
        const nextApproach = sortedApproaches[0];
        
        return {
            date: nextApproach.close_approach_date,
            missDistance: parseFloat(nextApproach.miss_distance.kilometers),
            relativeVelocity: parseFloat(nextApproach.relative_velocity.kilometers_per_second),
            orbitingBody: nextApproach.orbiting_body
        };
    }
    
    // Obtener detalles específicos de un NEO
    async getNEODetails(neoId) {
        try {
            const url = `${this.baseURL}/neo/${neoId}?api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            return this.processNEOData(data);
            
        } catch (error) {
            console.error('Error al obtener detalles del NEO:', error);
            throw error;
        }
    }
    
    // Buscar NEOs por nombre
    async searchNEOs(query) {
        try {
            const url = `${this.baseURL}/search?q=${encodeURIComponent(query)}&api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            return data.collection.items.map(item => this.processNEOData(item.data[0]));
            
        } catch (error) {
            console.error('Error al buscar NEOs:', error);
            throw error;
        }
    }
    
    // Obtener estadísticas de NEOs
    getNEOStatistics() {
        if (this.nearEarthObjects.length === 0) {
            return null;
        }
        
        const total = this.nearEarthObjects.length;
        const hazardous = this.nearEarthObjects.filter(neo => neo.isPotentiallyHazardous).length;
        const averageSize = this.nearEarthObjects.reduce((sum, neo) => sum + neo.estimatedDiameter.average, 0) / total;
        const averageVelocity = this.nearEarthObjects.reduce((sum, neo) => sum + neo.averageVelocity, 0) / total;
        
        const sizeDistribution = {
            small: this.nearEarthObjects.filter(neo => neo.estimatedDiameter.average < 100).length,
            medium: this.nearEarthObjects.filter(neo => neo.estimatedDiameter.average >= 100 && neo.estimatedDiameter.average < 1000).length,
            large: this.nearEarthObjects.filter(neo => neo.estimatedDiameter.average >= 1000).length
        };
        
        return {
            total,
            hazardous,
            hazardousPercentage: (hazardous / total) * 100,
            averageSize,
            averageVelocity,
            sizeDistribution,
            lastUpdate: this.lastUpdate
        };
    }
    
    // Filtrar NEOs por criterios
    filterNEOs(criteria) {
        let filtered = [...this.nearEarthObjects];
        
        if (criteria.minSize) {
            filtered = filtered.filter(neo => neo.estimatedDiameter.average >= criteria.minSize);
        }
        
        if (criteria.maxSize) {
            filtered = filtered.filter(neo => neo.estimatedDiameter.average <= criteria.maxSize);
        }
        
        if (criteria.minVelocity) {
            filtered = filtered.filter(neo => neo.averageVelocity >= criteria.minVelocity);
        }
        
        if (criteria.maxVelocity) {
            filtered = filtered.filter(neo => neo.averageVelocity <= criteria.maxVelocity);
        }
        
        if (criteria.hazardousOnly) {
            filtered = filtered.filter(neo => neo.isPotentiallyHazardous);
        }
        
        if (criteria.minHazardScore) {
            filtered = filtered.filter(neo => neo.hazardScore >= criteria.minHazardScore);
        }
        
        return filtered;
    }
    
    // Obtener alertas de NEOs peligrosos
    getHazardAlerts() {
        const alerts = this.nearEarthObjects
            .filter(neo => neo.hazardScore > 50)
            .map(neo => ({
                id: neo.id,
                name: neo.name,
                hazardScore: neo.hazardScore,
                size: neo.estimatedDiameter.average,
                velocity: neo.averageVelocity,
                nextApproach: neo.nextApproach,
                severity: this.getSeverityLevel(neo.hazardScore)
            }))
            .sort((a, b) => b.hazardScore - a.hazardScore);
        
        return alerts;
    }
    
    // Determinar nivel de severidad
    getSeverityLevel(hazardScore) {
        if (hazardScore >= 80) return 'CRÍTICO';
        if (hazardScore >= 60) return 'ALTO';
        if (hazardScore >= 40) return 'MEDIO';
        if (hazardScore >= 20) return 'BAJO';
        return 'MÍNIMO';
    }
    
    // Actualizar datos automáticamente
    async autoUpdate() {
        try {
            await this.getNearEarthObjects();
            this.displayNearEarthObjects();
            this.displayHazardAlerts();
        } catch (error) {
            console.error('Error en actualización automática:', error);
        }
    }
    
    // Mostrar objetos cercanos a la Tierra en la interfaz
    displayNearEarthObjects() {
        const container = document.getElementById('near-earth-objects');
        
        if (this.nearEarthObjects.length === 0) {
            container.innerHTML = '<p>No se encontraron objetos cercanos a la Tierra.</p>';
            return;
        }
        
        const topNEOs = this.nearEarthObjects.slice(0, 10); // Mostrar solo los 10 más peligrosos
        
        container.innerHTML = topNEOs.map(neo => `
            <div class="neo-item" data-hazard-score="${neo.hazardScore}">
                <h4>${neo.name}</h4>
                <p><strong>Tamaño:</strong> ${neo.estimatedDiameter.average.toFixed(0)}m</p>
                <p><strong>Velocidad:</strong> ${neo.averageVelocity.toFixed(1)} km/s</p>
                <p><strong>Peligrosidad:</strong> ${neo.hazardScore.toFixed(0)}/100</p>
                <p><strong>Potencialmente Peligroso:</strong> ${neo.isPotentiallyHazardous ? 'Sí' : 'No'}</p>
                ${neo.nextApproach ? `
                    <p><strong>Próximo Acercamiento:</strong> ${neo.nextApproach.date}</p>
                    <p><strong>Distancia:</strong> ${(neo.nextApproach.missDistance / 1000000).toFixed(2)} millones km</p>
                ` : ''}
                <div class="hazard-indicator ${this.getSeverityLevel(neo.hazardScore).toLowerCase()}">
                    ${this.getSeverityLevel(neo.hazardScore)}
                </div>
            </div>
        `).join('');
        
        // Agregar estadísticas
        const stats = this.getNEOStatistics();
        if (stats) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'neo-stats';
            statsDiv.innerHTML = `
                <h4>📊 Estadísticas</h4>
                <p><strong>Total de objetos:</strong> ${stats.total}</p>
                <p><strong>Potencialmente peligrosos:</strong> ${stats.hazardous} (${stats.hazardousPercentage.toFixed(1)}%)</p>
                <p><strong>Tamaño promedio:</strong> ${stats.averageSize.toFixed(0)}m</p>
                <p><strong>Velocidad promedio:</strong> ${stats.averageVelocity.toFixed(1)} km/s</p>
                <p><strong>Última actualización:</strong> ${stats.lastUpdate.toLocaleString()}</p>
            `;
            container.appendChild(statsDiv);
        }
    }
    
    // Mostrar alertas de peligro
    displayHazardAlerts() {
        const alerts = this.getHazardAlerts();
        
        if (alerts.length === 0) {
            return;
        }
        
        // Crear o actualizar panel de alertas
        let alertsPanel = document.getElementById('hazard-alerts');
        if (!alertsPanel) {
            alertsPanel = document.createElement('div');
            alertsPanel.id = 'hazard-alerts';
            alertsPanel.className = 'hazard-alerts';
            document.querySelector('.alerts-panel').appendChild(alertsPanel);
        }
        
        alertsPanel.innerHTML = `
            <h4>🚨 Alertas de Peligro</h4>
            ${alerts.map(alert => `
                <div class="alert-item ${alert.severity.toLowerCase()}">
                    <h5>${alert.name}</h5>
                    <p><strong>Nivel:</strong> ${alert.severity}</p>
                    <p><strong>Puntuación:</strong> ${alert.hazardScore.toFixed(0)}/100</p>
                    <p><strong>Tamaño:</strong> ${alert.size.toFixed(0)}m</p>
                    <p><strong>Velocidad:</strong> ${alert.velocity.toFixed(1)} km/s</p>
                </div>
            `).join('')}
        `;
    }
}

// Exportar para uso global
window.NASAAPI = NASAAPI;
