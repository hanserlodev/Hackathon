// Sistema de métodos de mitigación y desviación corregido / Corrected mitigation and deflection system.
class MitigationSystem {
    constructor() {
        this.activeMitigations = [];
        this.currentMitigation = null; // Solo una mitigación activa / Only one mitigation active.
        this.mitigationMethods = {
            kinetic: {
                name: 'Impacto Cinético',
                description: 'Enviar una nave espacial para impactar y desviar el meteorito',
                effectiveness: 0.8,
                cost: 'Alto',
                timeRequired: '2-5 años',
                requirements: 'Nave espacial, sistema de navegación preciso',
                limitations: 'Efectivo solo para meteoritos pequeños a medianos',
                maxEnergy: 1000 // Megatones / Megatons.
            },
            gravity: {
                name: 'Gravedad Artificial',
                description: 'Usar una nave masiva para desviar el meteorito con su gravedad',
                effectiveness: 0.6,
                cost: 'Muy Alto',
                timeRequired: '5-10 años',
                requirements: 'Nave muy masiva, sistema de propulsión avanzado',
                limitations: 'Requiere mucho tiempo y recursos',
                maxEnergy: 100 // Megatones / Megatons.
            },
            laser: {
                name: 'Láser Ablativo',
                description: 'Usar láseres para vaporizar material y cambiar la trayectoria',
                effectiveness: 0.4,
                cost: 'Medio',
                timeRequired: '1-3 años',
                requirements: 'Sistema láser de alta potencia, energía solar',
                limitations: 'Efectivo solo para meteoritos pequeños',
                maxEnergy: 10 // Megatones / Megatons.
            },
            shelters: {
                name: 'Refugios Subterráneos',
                description: 'Construir refugios para proteger a la población',
                effectiveness: 0.9,
                cost: 'Medio',
                timeRequired: '1-2 años',
                requirements: 'Construcción subterránea, sistemas de soporte vital',
                limitations: 'Solo protege a quienes están en los refugios',
                maxEnergy: Infinity // Siempre disponible / Always available.
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Botones de mitigación / Mitigation buttons event binding.
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-mitigation')) {
                const method = e.target.dataset.method;
                this.applyMitigation(method);
            }
        });
    }
    
    // Aplicar método de mitigación / Apply mitigation method.
    applyMitigation(method) {
        if (!window.meteorSimulation || !window.meteorSimulation.currentSimulation) {
            this.showError('No hay simulación activa para aplicar mitigación');
            return;
        }
        
        // Si ya hay una mitigación activa, removerla primero / Remove existing mitigation first.
        if (this.currentMitigation) {
            this.removeCurrentMitigation();
        }
        
        const simulation = window.meteorSimulation.currentSimulation;
        const mitigationInfo = this.mitigationMethods[method];
        
        // Verificar si el método es aplicable / Validate if the method is applicable.
        if (!this.isMethodApplicable(method, simulation.effects)) {
            this.showError(`El método ${mitigationInfo.name} no es aplicable para este impacto`);
            return;
        }
        
        // Calcular efectos de la mitigación / Calculate mitigation effects.
        const mitigationEffects = this.calculateMitigationEffects(method, simulation.effects);
        
        // Aplicar mitigación / Store mitigation state.
        this.currentMitigation = {
            method: method,
            effects: mitigationEffects,
            appliedAt: Date.now()
        };
        
        // Mostrar resultados / Present mitigation results.
        this.displayMitigationResults(method, mitigationEffects);
        
        // Actualizar simulación / Update simulation with mitigation.
        this.updateSimulationWithMitigation(simulation, mitigationEffects);
        
        // Mostrar efectos en la Tierra / Display Earth-side mitigation effects.
        this.showMitigationOnEarth(method);
        
        // Actualizar botones / Refresh mitigation buttons.
        this.updateMitigationButtons();
    }
    
    // Verificar si un método es aplicable / Check if a method can be applied.
    isMethodApplicable(method, effects) {
        const energyMegatons = effects.energyMegatons;
        const mitigationInfo = this.mitigationMethods[method];
        
        return energyMegatons <= mitigationInfo.maxEnergy;
    }
    
    // Calcular efectos de la mitigación / Compute mitigation outcome metrics.
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
    
    // Calcular mitigación por impacto cinético / Calculate kinetic impact mitigation.
    calculateKineticMitigation(originalEffects, effectiveness) {
        const energyMegatons = originalEffects.energyMegatons;
        
        // Reducción de energía basada en desviación / Energy reduction based on trajectory deflection.
        const energyReduction = Math.min(0.7, effectiveness * (energyMegatons / 1000));
        
        return {
            energyReduction: energyReduction,
            casualtyReduction: energyReduction * 0.8,
            damageReduction: energyReduction * 0.9,
            successProbability: Math.max(0.3, effectiveness - (energyMegatons / 2000)),
            method: 'kinetic'
        };
    }
    
    // Calcular mitigación por gravedad artificial / Calculate gravity tractor mitigation.
    calculateGravityMitigation(originalEffects, effectiveness) {
        const energyMegatons = originalEffects.energyMegatons;
        
        // Reducción más gradual pero consistente / Gradual yet consistent reduction.
        const energyReduction = Math.min(0.5, effectiveness * (energyMegatons / 500));
        
        return {
            energyReduction: energyReduction,
            casualtyReduction: energyReduction * 0.7,
            damageReduction: energyReduction * 0.8,
            successProbability: Math.max(0.2, effectiveness - (energyMegatons / 1000)),
            method: 'gravity'
        };
    }
    
    // Calcular mitigación por láser / Calculate laser ablation mitigation.
    calculateLaserMitigation(originalEffects, effectiveness) {
        const energyMegatons = originalEffects.energyMegatons;
        
        // Reducción limitada pero rápida / Limited but fast reduction.
        const energyReduction = Math.min(0.3, effectiveness * (energyMegatons / 100));
        
        return {
            energyReduction: energyReduction,
            casualtyReduction: energyReduction * 0.6,
            damageReduction: energyReduction * 0.7,
            successProbability: Math.max(0.4, effectiveness - (energyMegatons / 500)),
            method: 'laser'
        };
    }
    
    // Calcular mitigación por refugios / Calculate shelter mitigation.
    calculateShelterMitigation(originalEffects, effectiveness) {
        // Los refugios no reducen la energía del impacto, pero protegen a las personas / Shelters do not reduce impact energy but protect people.
        const shelterCapacity = 0.3; // 30% de la población puede ser protegida / 30% of the population can be protected.
        
        return {
            energyReduction: 0, // No reduce la energía / Does not reduce impact energy.
            casualtyReduction: shelterCapacity * effectiveness,
            damageReduction: 0, // No reduce el daño físico / Does not reduce physical damage.
            successProbability: effectiveness,
            method: 'shelters',
            shelterCapacity: shelterCapacity
        };
    }
    
    // Mostrar efectos de mitigación en la Tierra / Visualize mitigation effects on Earth.
    showMitigationOnEarth(method) {
        const earthMap2D = window.meteorSimulation.earthMap2D;
        if (!earthMap2D) return;
        
        // Remover efectos anteriores / Remove previous visual effects.
        earthMap2D.removeMitigationEffects();
        
        // Crear efectos específicos según el método / Create method-specific effects.
        earthMap2D.showMitigationEffect(method);
    }
    
    // Los efectos visuales ahora se manejan en el mapa 2D / Visual effects are now handled in the 2D map.
    
    // Remover mitigación actual / Remove the currently active mitigation.
    removeCurrentMitigation() {
        if (this.currentMitigation) {
            const earthMap2D = window.meteorSimulation.earthMap2D;
            if (earthMap2D) {
                earthMap2D.removeMitigationEffects();
            }
            
            this.currentMitigation = null;
            this.updateMitigationButtons();
        }
    }
    
    // Actualizar botones de mitigación / Refresh mitigation button states.
    updateMitigationButtons() {
        const buttons = document.querySelectorAll('.btn-mitigation');
        
        buttons.forEach(button => {
            const method = button.dataset.method;
            const isActive = this.currentMitigation && this.currentMitigation.method === method;
            
            if (isActive) {
                button.textContent = 'Desactivar';
                button.style.background = 'linear-gradient(45deg, #dc3545, #c82333)';
            } else {
                button.textContent = 'Aplicar';
                button.style.background = 'linear-gradient(45deg, #ffc107, #e0a800)';
            }
        });
    }
    
    // Mostrar resultados de la mitigación / Display mitigation results.
    displayMitigationResults(method, effects) {
        const mitigationInfo = this.mitigationMethods[method];
        
        // Crear modal de resultados / Create mitigation results modal.
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
        
        // Event listeners para el modal / Modal event listeners.
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Generar recomendaciones específicas / Generate specific recommendations.
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
    
    // Actualizar simulación con mitigación / Update simulation with mitigation effects.
    updateSimulationWithMitigation(simulation, mitigationEffects) {
        // Crear nueva simulación con efectos mitigados / Create new simulation snapshot with mitigation applied.
        const mitigatedEffects = this.applyMitigationToEffects(simulation.effects, mitigationEffects);
        
        // Mostrar comparación / Display comparison summary.
        this.showMitigationComparison(simulation.effects, mitigatedEffects);
    }
    
    // Aplicar mitigación a los efectos / Apply mitigation modifiers to effects.
    applyMitigationToEffects(originalEffects, mitigationEffects) {
        const mitigatedEffects = { ...originalEffects };
        
        // Reducir energía / Reduce energy value.
        mitigatedEffects.energyMegatons *= (1 - mitigationEffects.energyReduction);
        mitigatedEffects.energy *= (1 - mitigationEffects.energyReduction);
        
        // Aplicar reducciones de mitigación / Apply mitigation reductions.
        mitigatedEffects.casualties.fatalities = Math.round(
            originalEffects.casualties.fatalities * (1 - mitigationEffects.casualtyReduction)
        );
        mitigatedEffects.casualties.injuries = Math.round(
            originalEffects.casualties.injuries * (1 - mitigationEffects.casualtyReduction)
        );
        
        mitigatedEffects.totalDestructionZone *= (1 - mitigationEffects.damageReduction);
        mitigatedEffects.severeDestructionZone *= (1 - mitigationEffects.damageReduction);
        mitigatedEffects.moderateDestructionZone *= (1 - mitigationEffects.damageReduction);
        
        return mitigatedEffects;
    }
    
    // Mostrar comparación de mitigación / Display mitigation comparison.
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
    
    // Funciones de utilidad / Utility helpers.
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

// Exportar para uso global / Expose globally.
window.MitigationSystem = MitigationSystem;
