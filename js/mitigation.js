// Sistema de métodos de mitigación y desviación
class MitigationSystem {
    constructor() {
        this.activeMitigations = [];
        this.mitigationMethods = {
            kinetic: {
                name: 'Impacto Cinético',
                description: 'Enviar una nave espacial para impactar y desviar el meteorito',
                effectiveness: 0.8,
                cost: 'Alto',
                timeRequired: '2-5 años',
                requirements: 'Nave espacial, sistema de navegación preciso',
                limitations: 'Efectivo solo para meteoritos pequeños a medianos'
            },
            gravity: {
                name: 'Gravedad Artificial',
                description: 'Usar una nave masiva para desviar el meteorito con su gravedad',
                effectiveness: 0.6,
                cost: 'Muy Alto',
                timeRequired: '5-10 años',
                requirements: 'Nave muy masiva, sistema de propulsión avanzado',
                limitations: 'Requiere mucho tiempo y recursos'
            },
            laser: {
                name: 'Láser Ablativo',
                description: 'Usar láseres para vaporizar material y cambiar la trayectoria',
                effectiveness: 0.4,
                cost: 'Medio',
                timeRequired: '1-3 años',
                requirements: 'Sistema láser de alta potencia, energía solar',
                limitations: 'Efectivo solo para meteoritos pequeños'
            },
            shelters: {
                name: 'Refugios Subterráneos',
                description: 'Construir refugios para proteger a la población',
                effectiveness: 0.9,
                cost: 'Medio',
                timeRequired: '1-2 años',
                requirements: 'Construcción subterránea, sistemas de soporte vital',
                limitations: 'Solo protege a quienes están en los refugios'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Botones de mitigación
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-mitigation')) {
                const method = e.target.dataset.method;
                this.applyMitigation(method);
            }
        });
    }
    
    // Aplicar método de mitigación
    applyMitigation(method) {
        if (!window.meteorSimulation || !window.meteorSimulation.currentSimulation) {
            this.showError('No hay simulación activa para aplicar mitigación');
            return;
        }
        
        const simulation = window.meteorSimulation.currentSimulation;
        const mitigationInfo = this.mitigationMethods[method];
        
        // Verificar si el método es aplicable
        if (!this.isMethodApplicable(method, simulation.effects)) {
            this.showError(`El método ${mitigationInfo.name} no es aplicable para este impacto`);
            return;
        }
        
        // Calcular efectos de la mitigación
        const mitigationEffects = this.calculateMitigationEffects(method, simulation.effects);
        
        // Aplicar mitigación
        this.activeMitigations.push({
            method: method,
            effects: mitigationEffects,
            appliedAt: Date.now()
        });
        
        // Mostrar resultados
        this.displayMitigationResults(method, mitigationEffects);
        
        // Actualizar simulación
        this.updateSimulationWithMitigation(simulation, mitigationEffects);
    }
    
    // Verificar si un método es aplicable
    isMethodApplicable(method, effects) {
        const energyMegatons = effects.energyMegatons;
        
        switch (method) {
            case 'kinetic':
                return energyMegatons < 1000; // Efectivo para impactos menores a 1000 MT
            case 'gravity':
                return energyMegatons < 100; // Efectivo para impactos menores a 100 MT
            case 'laser':
                return energyMegatons < 10; // Efectivo para impactos menores a 10 MT
            case 'shelters':
                return true; // Siempre aplicable
            default:
                return false;
        }
    }
    
    // Calcular efectos de la mitigación
    calculateMitigationEffects(method, originalEffects) {
        const mitigationInfo = this.mitigationMethods[method];
        const effectiveness = mitigationInfo.effectiveness;
        
        let mitigationEffects = {
            energyReduction: 0,
            casualtyReduction: 0,
            damageReduction: 0,
            successProbability: 0
        };
        
        switch (method) {
            case 'kinetic':
                mitigationEffects = this.calculateKineticMitigation(originalEffects, effectiveness);
                break;
            case 'gravity':
                mitigationEffects = this.calculateGravityMitigation(originalEffects, effectiveness);
                break;
            case 'laser':
                mitigationEffects = this.calculateLaserMitigation(originalEffects, effectiveness);
                break;
            case 'shelters':
                mitigationEffects = this.calculateShelterMitigation(originalEffects, effectiveness);
                break;
        }
        
        return mitigationEffects;
    }
    
    // Calcular mitigación por impacto cinético
    calculateKineticMitigation(originalEffects, effectiveness) {
        const energyMegatons = originalEffects.energyMegatons;
        
        // Reducción de energía basada en desviación
        const energyReduction = Math.min(0.7, effectiveness * (energyMegatons / 1000));
        
        return {
            energyReduction: energyReduction,
            casualtyReduction: energyReduction * 0.8,
            damageReduction: energyReduction * 0.9,
            successProbability: Math.max(0.3, effectiveness - (energyMegatons / 2000)),
            method: 'kinetic'
        };
    }
    
    // Calcular mitigación por gravedad artificial
    calculateGravityMitigation(originalEffects, effectiveness) {
        const energyMegatons = originalEffects.energyMegatons;
        
        // Reducción más gradual pero consistente
        const energyReduction = Math.min(0.5, effectiveness * (energyMegatons / 500));
        
        return {
            energyReduction: energyReduction,
            casualtyReduction: energyReduction * 0.7,
            damageReduction: energyReduction * 0.8,
            successProbability: Math.max(0.2, effectiveness - (energyMegatons / 1000)),
            method: 'gravity'
        };
    }
    
    // Calcular mitigación por láser
    calculateLaserMitigation(originalEffects, effectiveness) {
        const energyMegatons = originalEffects.energyMegatons;
        
        // Reducción limitada pero rápida
        const energyReduction = Math.min(0.3, effectiveness * (energyMegatons / 100));
        
        return {
            energyReduction: energyReduction,
            casualtyReduction: energyReduction * 0.6,
            damageReduction: energyReduction * 0.7,
            successProbability: Math.max(0.4, effectiveness - (energyMegatons / 500)),
            method: 'laser'
        };
    }
    
    // Calcular mitigación por refugios
    calculateShelterMitigation(originalEffects, effectiveness) {
        // Los refugios no reducen la energía del impacto, pero protegen a las personas
        const shelterCapacity = 0.3; // 30% de la población puede ser protegida
        
        return {
            energyReduction: 0, // No reduce la energía
            casualtyReduction: shelterCapacity * effectiveness,
            damageReduction: 0, // No reduce el daño físico
            successProbability: effectiveness,
            method: 'shelters',
            shelterCapacity: shelterCapacity
        };
    }
    
    // Mostrar resultados de la mitigación
    displayMitigationResults(method, effects) {
        const mitigationInfo = this.mitigationMethods[method];
        
        // Crear modal de resultados
        const modal = document.createElement('div');
        modal.className = 'mitigation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🛡️ ${mitigationInfo.name} Aplicado</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="mitigation-info">
                        <h4>Información del Método</h4>
                        <p><strong>Descripción:</strong> ${mitigationInfo.description}</p>
                        <p><strong>Efectividad:</strong> ${(mitigationInfo.effectiveness * 100).toFixed(0)}%</p>
                        <p><strong>Costo:</strong> ${mitigationInfo.cost}</p>
                        <p><strong>Tiempo requerido:</strong> ${mitigationInfo.timeRequired}</p>
                    </div>
                    
                    <div class="mitigation-results">
                        <h4>Resultados de la Mitigación</h4>
                        <div class="result-grid">
                            <div class="result-item">
                                <span class="label">Reducción de Energía:</span>
                                <span class="value">${(effects.energyReduction * 100).toFixed(1)}%</span>
                            </div>
                            <div class="result-item">
                                <span class="label">Reducción de Víctimas:</span>
                                <span class="value">${(effects.casualtyReduction * 100).toFixed(1)}%</span>
                            </div>
                            <div class="result-item">
                                <span class="label">Reducción de Daños:</span>
                                <span class="value">${(effects.damageReduction * 100).toFixed(1)}%</span>
                            </div>
                            <div class="result-item">
                                <span class="label">Probabilidad de Éxito:</span>
                                <span class="value">${(effects.successProbability * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mitigation-recommendations">
                        <h4>Recomendaciones</h4>
                        <ul>
                            ${this.generateRecommendations(method, effects)}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners para el modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Generar recomendaciones específicas
    generateRecommendations(method, effects) {
        const recommendations = [];
        
        switch (method) {
            case 'kinetic':
                recommendations.push('Desarrollar sistemas de navegación de alta precisión');
                recommendations.push('Crear múltiples naves de respaldo');
                recommendations.push('Monitorear continuamente la trayectoria del meteorito');
                break;
            case 'gravity':
                recommendations.push('Desarrollar sistemas de propulsión avanzados');
                recommendations.push('Crear infraestructura de lanzamiento masiva');
                recommendations.push('Planificar misiones de larga duración');
                break;
            case 'laser':
                recommendations.push('Desarrollar sistemas láser de alta potencia');
                recommendations.push('Crear sistemas de energía solar espacial');
                recommendations.push('Implementar sistemas de seguimiento preciso');
                break;
            case 'shelters':
                recommendations.push('Identificar ubicaciones geológicamente estables');
                recommendations.push('Desarrollar sistemas de soporte vital avanzados');
                recommendations.push('Crear planes de evacuación eficientes');
                break;
        }
        
        if (effects.successProbability < 0.5) {
            recommendations.push('Considerar métodos de mitigación adicionales');
            recommendations.push('Desarrollar planes de contingencia');
        }
        
        return recommendations.map(rec => `<li>${rec}</li>`).join('');
    }
    
    // Actualizar simulación con mitigación
    updateSimulationWithMitigation(simulation, mitigationEffects) {
        // Crear nueva simulación con efectos mitigados
        const mitigatedEffects = this.applyMitigationToEffects(simulation.effects, mitigationEffects);
        
        // Actualizar visualización
        this.updateVisualizationWithMitigation(mitigationEffects);
        
        // Mostrar comparación
        this.showMitigationComparison(simulation.effects, mitigatedEffects);
    }
    
    // Aplicar mitigación a los efectos
    applyMitigationToEffects(originalEffects, mitigationEffects) {
        const mitigatedEffects = { ...originalEffects };
        
        // Reducir energía
        mitigatedEffects.energyMegatons *= (1 - mitigationEffects.energyReduction);
        mitigatedEffects.energy *= (1 - mitigationEffects.energyReduction);
        
        // Recalcular efectos basados en nueva energía
        const calculations = new ImpactCalculations();
        const newEffects = calculations.calculateAllEffects(
            simulation.parameters.diameter,
            simulation.parameters.velocity,
            simulation.parameters.density
        );
        
        // Aplicar reducciones de mitigación
        mitigatedEffects.casualties.fatalities = Math.round(
            newEffects.casualties.fatalities * (1 - mitigationEffects.casualtyReduction)
        );
        mitigatedEffects.casualties.injuries = Math.round(
            newEffects.casualties.injuries * (1 - mitigationEffects.casualtyReduction)
        );
        
        mitigatedEffects.totalDestructionZone *= (1 - mitigationEffects.damageReduction);
        mitigatedEffects.severeDestructionZone *= (1 - mitigationEffects.damageReduction);
        mitigatedEffects.moderateDestructionZone *= (1 - mitigationEffects.damageReduction);
        
        return mitigatedEffects;
    }
    
    // Actualizar visualización con mitigación
    updateVisualizationWithMitigation(mitigationEffects) {
        // Agregar efectos visuales de mitigación
        const earth3D = window.meteorSimulation.earth3D;
        
        // Crear indicadores de mitigación
        this.createMitigationIndicators(earth3D.scene, mitigationEffects);
        
        // Actualizar colores para mostrar áreas protegidas
        this.updateProtectedAreas(earth3D.scene, mitigationEffects);
    }
    
    // Crear indicadores de mitigación
    createMitigationIndicators(scene, effects) {
        // Crear anillos de protección
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(2.2 + i * 0.1, 2.3 + i * 0.1, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3 - i * 0.1,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            scene.add(ring);
            
            // Animación de pulso
            const animateRing = () => {
                ring.rotation.z += 0.01;
                ring.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.1);
                requestAnimationFrame(animateRing);
            };
            animateRing();
        }
    }
    
    // Actualizar áreas protegidas
    updateProtectedAreas(scene, effects) {
        // Crear marcadores de áreas protegidas
        const protectedAreas = this.calculateProtectedAreas(effects);
        
        protectedAreas.forEach(area => {
            const geometry = new THREE.CircleGeometry(area.radius, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.2
            });
            
            const protectedArea = new THREE.Mesh(geometry, material);
            protectedArea.position.set(area.x, area.y, area.z);
            scene.add(protectedArea);
        });
    }
    
    // Calcular áreas protegidas
    calculateProtectedAreas(effects) {
        // Simplificado: crear algunas áreas protegidas alrededor del impacto
        const areas = [];
        
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 0.3;
            
            areas.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                z: 2.01,
                radius: 0.1
            });
        }
        
        return areas;
    }
    
    // Mostrar comparación de mitigación
    showMitigationComparison(originalEffects, mitigatedEffects) {
        const comparisonDiv = document.createElement('div');
        comparisonDiv.className = 'mitigation-comparison';
        comparisonDiv.innerHTML = `
            <h3>📊 Comparación: Antes vs Después de la Mitigación</h3>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h4>Energía Liberada</h4>
                    <p><strong>Antes:</strong> ${this.formatEnergy(originalEffects.energyMegatons)}</p>
                    <p><strong>Después:</strong> ${this.formatEnergy(mitigatedEffects.energyMegatons)}</p>
                    <p><strong>Reducción:</strong> ${((originalEffects.energyMegatons - mitigatedEffects.energyMegatons) / originalEffects.energyMegatons * 100).toFixed(1)}%</p>
                </div>
                <div class="comparison-item">
                    <h4>Víctimas Estimadas</h4>
                    <p><strong>Antes:</strong> ${originalEffects.casualties.fatalities.toLocaleString()}</p>
                    <p><strong>Después:</strong> ${mitigatedEffects.casualties.fatalities.toLocaleString()}</p>
                    <p><strong>Reducción:</strong> ${((originalEffects.casualties.fatalities - mitigatedEffects.casualties.fatalities) / originalEffects.casualties.fatalities * 100).toFixed(1)}%</p>
                </div>
                <div class="comparison-item">
                    <h4>Zona de Destrucción</h4>
                    <p><strong>Antes:</strong> ${this.formatDistance(originalEffects.totalDestructionZone)}</p>
                    <p><strong>Después:</strong> ${this.formatDistance(mitigatedEffects.totalDestructionZone)}</p>
                    <p><strong>Reducción:</strong> ${((originalEffects.totalDestructionZone - mitigatedEffects.totalDestructionZone) / originalEffects.totalDestructionZone * 100).toFixed(1)}%</p>
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').appendChild(comparisonDiv);
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
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>⚠️ ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.control-panel'));
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Exportar para uso global
window.MitigationSystem = MitigationSystem;
