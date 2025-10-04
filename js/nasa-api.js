// Proveedor de datos simulados para NEOs / Simulated NEO data provider.
class NASAAPI {
    constructor() {
        // Datos estáticos representativos / Static representative dataset.
        this.nearEarthObjects = [
            { name: '2021 ED5', hazardLevel: 'ALTO', score: 70, size: 400, velocity: 22.2 },
            { name: '2021 SZ4', hazardLevel: 'ALTO', score: 67, size: 346, velocity: 44.5 },
            { name: '2012 TA259', hazardLevel: 'MEDIO', score: 55, size: 364, velocity: 36.4 },
            { name: '2017 WK13', hazardLevel: 'MEDIO', score: 55, size: 519, velocity: 29.1 },
            { name: '2020 GA2', hazardLevel: 'MEDIO', score: 50, size: 254, velocity: 30.0 }
        ];

        this.statistics = {
            total: 121,
            hazardous: 3,
            hazardousPercentage: 2.5,
            averageSize: 88,
            averageVelocity: 13.8,
            lastUpdate: new Date('2025-10-04T11:02:37')
        };
    }

    async getNearEarthObjects() {
        // Devolver datos simulados / Return simulated data.
        return this.nearEarthObjects;
    }

    displayNearEarthObjects() {
        // Mostrar lista principal usando datos simulados / Render main list using mock data.
        this.renderHazardCards();
        this.renderStatistics();
    }

    displayHazardAlerts() {
        // Alias para compatibilidad / Alias for backward compatibility.
        this.renderHazardCards();
    }

    autoUpdate() {
        // Repetir renderizado para simular actualización / Re-render to simulate an update tick.
        this.renderHazardCards();
        this.renderStatistics();
    }

    renderHazardCards() {
        const container = document.getElementById('hazard-alerts');
        if (!container) {
            return;
        }

        container.innerHTML = '';

        this.nearEarthObjects.forEach(neo => {
            const card = document.createElement('article');
            card.className = 'hazard-card';
            card.innerHTML = `
                <div>
                    <h4>${neo.name}</h4>
                    <p class="hazard-meta">Tamaño: ${neo.size} m · Velocidad: ${neo.velocity.toFixed(1)} km/s</p>
                </div>
                <div class="hazard-meta">
                    <span class="hazard-level ${neo.hazardLevel === 'ALTO' ? 'hazard-level-high' : 'hazard-level-medium'}">Nivel: ${neo.hazardLevel}</span>
                    <p>Puntuación: ${neo.score}/100</p>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderStatistics() {
        const total = document.getElementById('stat-total');
        const hazardous = document.getElementById('stat-hazardous');
        const hazardPercentage = document.getElementById('stat-hazard-percentage');
        const averageSize = document.getElementById('stat-average-size');
        const averageVelocity = document.getElementById('stat-average-velocity');
        const lastUpdate = document.getElementById('stat-last-update');

        if (!total) {
            return;
        }

        total.textContent = this.statistics.total.toString();
        hazardous.textContent = this.statistics.hazardous.toString();
        hazardPercentage.textContent = `${this.statistics.hazardousPercentage}% peligrosos`;
        averageSize.textContent = `${this.statistics.averageSize} m`;
        averageVelocity.textContent = `${this.statistics.averageVelocity} km/s`;
        lastUpdate.textContent = this.formatDate(this.statistics.lastUpdate);
    }

    getNEOStatistics() {
        return { ...this.statistics };
    }

    formatDate(date) {
        // Formatear fecha de manera legible / Produce a human readable timestamp.
        return date.toLocaleString('es-MX', {
            dateStyle: 'short',
            timeStyle: 'medium'
        });
    }
}
