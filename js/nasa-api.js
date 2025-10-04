// Integración con NASA NEO API / NASA NEO API integration.
class NASAAPI {
    constructor() {
        // Configuración base de la API / Base API configuration.
        this.apiKey = 'QceqJ4dDvyiejRyGSmRuUF7Akjd52QJTU4KPqoqP';
        this.baseURL = 'https://api.nasa.gov/neo/rest/v1';
        this.nearEarthObjects = [];
        this.lastUpdate = null;
    }

    // Obtener objetos cercanos a la Tierra / Fetch near-earth objects from NASA.
    async getNearEarthObjects(startDate = null, endDate = null) {
        try {
            const { start, end } = this.resolveDateRange(startDate, endDate);
            const url = this.buildURL('/feed', {
                start_date: start,
                end_date: end,
            });

            const data = await this.fetchJSON(url);
            this.processNearEarthObjects(data);
            return this.nearEarthObjects;
        } catch (error) {
            console.error('Error al obtener objetos cercanos a la Tierra:', error);
            throw error;
        }
    }

    // Procesar la estructura de respuesta / Process the API response structure.
    processNearEarthObjects(data) {
        const objectsByDate = data?.near_earth_objects ?? {};

        this.nearEarthObjects = Object.values(objectsByDate)
            .flat()
            .map(neo => this.processNEOData(neo))
            .sort((a, b) => b.hazardScore - a.hazardScore);

        this.lastUpdate = new Date();
    }

    // Procesar datos individuales de un NEO / Process a single NEO entry.
    processNEOData(neo) {
        if (!neo) {
            return null;
        }

        const estimatedDiameter = this.estimateDiameter(neo.estimated_diameter);
        const averageVelocity = this.calculateAverageVelocity(neo.close_approach_data);
        const hazardScore = this.calculateHazardScore(neo, estimatedDiameter, averageVelocity);
        const nextApproach = this.getNextApproach(neo.close_approach_data);

        return {
            id: neo.id,
            name: neo.name,
            estimatedDiameter,
            averageVelocity,
            hazardScore,
            isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
            nextApproach,
            orbitalData: neo.orbital_data,
            absoluteMagnitude: neo.absolute_magnitude_h,
            nasaUrl: neo.nasa_jpl_url,
        };
    }

    // Estimar diámetro basado en los datos / Estimate diameter using NASA metrics.
    estimateDiameter(estimatedDiameter) {
        const meters = estimatedDiameter?.meters ?? {};
        const min = meters.estimated_diameter_min ?? 0;
        const max = meters.estimated_diameter_max ?? 0;
        const average = (min + max) / 2;

        return { min, max, average };
    }

    // Calcular velocidad promedio / Calculate average approach velocity.
    calculateAverageVelocity(closeApproachData) {
        if (!Array.isArray(closeApproachData) || closeApproachData.length === 0) {
            return 0;
        }

        const velocities = closeApproachData
            .map(approach => parseFloat(approach?.relative_velocity?.kilometers_per_second ?? 0))
            .filter(value => Number.isFinite(value));

        if (velocities.length === 0) {
            return 0;
        }

        const total = velocities.reduce((sum, value) => sum + value, 0);
        return total / velocities.length;
    }

    // Calcular puntuación de peligro / Compute hazard score for a NEO.
    calculateHazardScore(neo, diameter, velocity) {
        let score = 0;

        // Factor de tamaño (0-40 puntos) / Size factor (0-40 points).
        const sizeScore = Math.min(40, (diameter.average / 100) * 10);
        score += sizeScore;

        // Factor de velocidad (0-30 puntos) / Speed factor (0-30 points).
        const velocityScore = Math.min(30, velocity / 2);
        score += velocityScore;

        // Factor de proximidad (0-20 puntos) / Proximity factor (0-20 points).
        const nextApproach = neo.close_approach_data?.[0];
        if (nextApproach) {
            const missDistance = parseFloat(nextApproach.miss_distance?.kilometers ?? '0');
            const proximityScore = Math.max(0, 20 - missDistance / 1000000);
            score += proximityScore;
        }

        // Factor de peligrosidad potencial (0-10 puntos) / Potential hazard flag (0-10 points).
        if (neo.is_potentially_hazardous_asteroid) {
            score += 10;
        }

        return Math.min(100, score);
    }

    // Obtener próximo acercamiento / Retrieve the closest upcoming approach.
    getNextApproach(closeApproachData) {
        if (!Array.isArray(closeApproachData) || closeApproachData.length === 0) {
            return null;
        }

        const sortedApproaches = [...closeApproachData].sort((a, b) => {
            return new Date(a.close_approach_date) - new Date(b.close_approach_date);
        });

        const nextApproach = sortedApproaches[0];
        return {
            date: nextApproach.close_approach_date,
            missDistance: parseFloat(nextApproach.miss_distance?.kilometers ?? '0'),
            relativeVelocity: parseFloat(nextApproach.relative_velocity?.kilometers_per_second ?? '0'),
            orbitingBody: nextApproach.orbiting_body,
        };
    }

    // Obtener detalles específicos de un NEO / Fetch details for a specific NEO.
    async getNEODetails(neoId) {
        try {
            const url = this.buildURL(`/neo/${neoId}`);
            const data = await this.fetchJSON(url);
            return this.processNEOData(data);
        } catch (error) {
            console.error('Error al obtener detalles del NEO:', error);
            throw error;
        }
    }

    // Buscar NEOs por nombre / Search NEOs by name.
    async searchNEOs(query) {
        try {
            const url = this.buildURL('/search', { q: query });
            const data = await this.fetchJSON(url);

            return (data?.collection?.items ?? [])
                .map(item => this.processNEOData(item?.data?.[0]))
                .filter(Boolean);
        } catch (error) {
            console.error('Error al buscar NEOs:', error);
            throw error;
        }
    }

    // Obtener estadísticas de NEOs / Compute statistics for NEO collections.
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
            large: this.nearEarthObjects.filter(neo => neo.estimatedDiameter.average >= 1000).length,
        };

        return {
            total,
            hazardous,
            hazardousPercentage: (hazardous / total) * 100,
            averageSize,
            averageVelocity,
            sizeDistribution,
            lastUpdate: this.lastUpdate,
        };
    }

    // Filtrar NEOs según criterios / Filter NEOs using criteria.
    filterNEOs(criteria) {
        return this.nearEarthObjects.filter(neo => {
            const matchesSizeMin = criteria.minSize ? neo.estimatedDiameter.average >= criteria.minSize : true;
            const matchesSizeMax = criteria.maxSize ? neo.estimatedDiameter.average <= criteria.maxSize : true;
            const matchesVelocityMin = criteria.minVelocity ? neo.averageVelocity >= criteria.minVelocity : true;
            const matchesVelocityMax = criteria.maxVelocity ? neo.averageVelocity <= criteria.maxVelocity : true;
            const matchesHazard = criteria.hazardousOnly ? neo.isPotentiallyHazardous : true;
            const matchesScore = criteria.minHazardScore ? neo.hazardScore >= criteria.minHazardScore : true;

            return matchesSizeMin && matchesSizeMax && matchesVelocityMin && matchesVelocityMax && matchesHazard && matchesScore;
        });
    }

    // Obtener alertas de NEOs peligrosos / Build a list of hazard alerts.
    getHazardAlerts() {
        return this.nearEarthObjects
            .filter(neo => neo.hazardScore > 50)
            .map(neo => ({
                id: neo.id,
                name: neo.name,
                hazardScore: neo.hazardScore,
                size: neo.estimatedDiameter.average,
                velocity: neo.averageVelocity,
                nextApproach: neo.nextApproach,
                severity: this.getSeverityLevel(neo.hazardScore),
            }))
            .sort((a, b) => b.hazardScore - a.hazardScore);
    }

    // Determinar nivel de severidad / Derive a severity label from the hazard score.
    getSeverityLevel(hazardScore) {
        if (hazardScore >= 80) return 'CRÍTICO';
        if (hazardScore >= 60) return 'ALTO';
        if (hazardScore >= 40) return 'MEDIO';
        if (hazardScore >= 20) return 'BAJO';
        return 'MÍNIMO';
    }

    // Actualizar datos automáticamente / Automatically refresh NEO data.
    async autoUpdate() {
        try {
            await this.getNearEarthObjects();
            this.displayNearEarthObjects();
            this.displayHazardAlerts();
        } catch (error) {
            console.error('Error en actualización automática:', error);
        }
    }

    // Mostrar objetos cercanos a la Tierra en la interfaz / Render NEO list in the UI.
    displayNearEarthObjects() {
        const container = document.getElementById('near-earth-objects');
        if (!container) {
            return;
        }

        if (this.nearEarthObjects.length === 0) {
            container.innerHTML = '<p>No se encontraron objetos cercanos a la Tierra.</p>';
            return;
        }

        const topNEOs = this.nearEarthObjects.slice(0, 10);
        container.innerHTML = topNEOs
            .map(neo => `
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
            `)
            .join('');

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

    // Mostrar alertas de peligro / Render hazard alerts panel.
    displayHazardAlerts() {
        const alerts = this.getHazardAlerts();
        if (alerts.length === 0) {
            const existingPanel = document.getElementById('hazard-alerts');
            if (existingPanel) {
                existingPanel.remove();
            }
            return;
        }

        const alertsPanel = this.getOrCreateElement('hazard-alerts', 'hazard-alerts', '.alerts-panel');
        alertsPanel.innerHTML = `
            <h4>🚨 Alertas de Peligro</h4>
            ${alerts
                .map(alert => `
                    <div class="alert-item ${alert.severity.toLowerCase()}">
                        <h5>${alert.name}</h5>
                        <p><strong>Nivel:</strong> ${alert.severity}</p>
                        <p><strong>Puntuación:</strong> ${alert.hazardScore.toFixed(0)}/100</p>
                        <p><strong>Tamaño:</strong> ${alert.size.toFixed(0)}m</p>
                        <p><strong>Velocidad:</strong> ${alert.velocity.toFixed(1)} km/s</p>
                    </div>
                `)
                .join('')}
        `;
    }

    // Construir URLs de la API / Build API URLs with query parameters.
    buildURL(path, params = {}) {
        const url = new URL(`${this.baseURL}${path}`);
        url.searchParams.set('api_key', this.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value);
            }
        });

        return url.toString();
    }

    // Resolver rango de fechas / Resolve default date range.
    resolveDateRange(startDate, endDate) {
        const today = new Date();
        const start = startDate || today.toISOString().split('T')[0];

        const futureDate = endDate ? new Date(endDate) : new Date(today);
        if (!endDate) {
            futureDate.setDate(futureDate.getDate() + 7);
        }
        const end = futureDate.toISOString().split('T')[0];

        return { start, end };
    }

    // Solicitud genérica a la API / Generic API request helper.
    async fetchJSON(url, options = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    }

    // Crear o reutilizar elementos del DOM / Get or create DOM helper elements.
    getOrCreateElement(id, className, parentSelector) {
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement('div');
            element.id = id;
            element.className = className;
            const parent = document.querySelector(parentSelector);
            if (parent) {
                parent.appendChild(element);
            }
        }
        return element;
    }
}

// Exportar para uso global / Expose class globally.
window.NASAAPI = NASAAPI;
