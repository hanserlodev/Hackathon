// Integración con el servidor Python para la simulación 2D / Python server integration for the 2D simulation.
class ServerIntegration {
    constructor() {
        this.serverUrl = 'http://localhost:5000';
        this.simulation2DRunning = false;
        this.simulation2DPID = null;
    }
    
    // Iniciar simulación 2D / Start the 2D simulation.
    async startSimulation2D(simulationData) {
        try {
            const response = await fetch(`${this.serverUrl}/api/simulation/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(simulationData)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                this.simulation2DRunning = true;
                this.simulation2DPID = result.pid;
                
                // Mostrar notificación / Display notification.
                this.showNotification('Simulación 2D iniciada correctamente', 'success');
                
                return true;
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
            
        } catch (error) {
            console.error('Error al iniciar simulación 2D:', error);
            this.showNotification(`Error al iniciar simulación 2D: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Detener simulación 2D / Stop the 2D simulation.
    async stopSimulation2D() {
        try {
            const response = await fetch(`${this.serverUrl}/api/simulation/stop`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                this.simulation2DRunning = false;
                this.simulation2DPID = null;
                
                this.showNotification('Simulación 2D detenida', 'info');
                return true;
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
            
        } catch (error) {
            console.error('Error al detener simulación 2D:', error);
            this.showNotification(`Error al detener simulación 2D: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Verificar estado de la simulación 2D / Check 2D simulation status.
    async checkSimulationStatus() {
        try {
            const response = await fetch(`${this.serverUrl}/api/simulation/status`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            this.simulation2DRunning = result.running;
            
            return result;
            
        } catch (error) {
            console.error('Error al verificar estado:', error);
            return { running: false, error: error.message };
        }
    }
    
    // Obtener datos de la NASA a través del servidor / Retrieve NASA data via the server.
    async getNASAData(startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            params.append('api_key', 'DEMO_KEY');
            
            const response = await fetch(`${this.serverUrl}/api/nasa/neo?${params}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Error al obtener datos de la NASA:', error);
            throw error;
        }
    }
    
    // Geocoding a través del servidor / Perform geocoding through the server.
    async geocodeLocation(locationName) {
        try {
            const params = new URLSearchParams();
            params.append('q', locationName);
            
            const response = await fetch(`${this.serverUrl}/api/geocoding?${params}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
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
            
        } catch (error) {
            console.error('Error en geocoding:', error);
            throw error;
        }
    }
    
    // Calcular impacto a través del servidor / Calculate impact metrics via the server.
    async calculateImpact(diameter, velocity, density, populationDensity = 1000) {
        try {
            const response = await fetch(`${this.serverUrl}/api/impact/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diameter: diameter,
                    velocity: velocity,
                    density: density,
                    population_density: populationDensity
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Error al calcular impacto:', error);
            throw error;
        }
    }
    
    // Verificar conectividad con el servidor / Check server connectivity.
    async checkServerConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/api/simulation/status`, {
                method: 'GET',
                timeout: 5000
            });
            
            return response.ok;
            
        } catch (error) {
            console.error('Servidor no disponible:', error);
            return false;
        }
    }
    
    // Mostrar notificación / Render notification element.
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Agregar estilos si no existen / Inject styles if they do not exist.
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 10000;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease-out;
                }
                
                .notification.success {
                    background: linear-gradient(45deg, #28a745, #20c997);
                }
                
                .notification.error {
                    background: linear-gradient(45deg, #dc3545, #e74c3c);
                }
                
                .notification.info {
                    background: linear-gradient(45deg, #17a2b8, #6f42c1);
                }
                
                .notification.warning {
                    background: linear-gradient(45deg, #ffc107, #fd7e14);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-icon {
                    font-size: 1.2rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    margin-left: auto;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos / Auto-remove after five seconds.
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Obtener icono para notificación / Retrieve notification icon.
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || 'ℹ️';
    }
    
    // Inicializar integración / Initialize integration.
    async init() {
        // Verificar conectividad / Check connectivity.
        const isConnected = await this.checkServerConnection();
        
        if (isConnected) {
            this.showNotification('Conectado al servidor Python', 'success');
            
            // Verificar estado de simulación existente / Check if an existing simulation is running.
            const status = await this.checkSimulationStatus();
            if (status.running) {
                this.simulation2DRunning = true;
                this.showNotification('Simulación 2D ya está ejecutándose', 'info');
            }
        } else {
            this.showNotification('Servidor Python no disponible. La simulación 2D no estará disponible.', 'warning');
        }
        
        return isConnected;
    }
}

// Extender la clase MeteorSimulation para incluir integración 2D / Extend MeteorSimulation to include 2D integration.
class MeteorSimulationWith2D extends MeteorSimulation {
    constructor() {
        super();
        this.serverIntegration = new ServerIntegration();
        this.nasaAPI = window.nasaAPI || this.nasaAPI;
        this.setup2DIntegration();
    }
    
    async setup2DIntegration() {
        // Inicializar integración con servidor / Initialize server integration.
        await this.serverIntegration.init();
        
        // Agregar botón para simulación 2D / Add button for 2D simulation.
        this.add2DControls();
    }
    
    add2DControls() {
        // Agregar botón para iniciar simulación 2D / Add button to start 2D simulation.
        const simulationControls = document.querySelector('.simulation-controls');
        
        const button2D = document.createElement('button');
        button2D.id = 'start-2d-simulation';
        button2D.className = 'btn-warning';
        button2D.textContent = 'Vista 2D';
        button2D.addEventListener('click', () => {
            this.start2DSimulation();
        });
        
        simulationControls.appendChild(button2D);
    }
    
    async start2DSimulation() {
        if (!this.currentSimulation) {
            this.showError('No hay simulación activa para mostrar en vista 2D');
            return;
        }
        
        if (this.serverIntegration.simulation2DRunning) {
            this.showError('Ya hay una simulación 2D ejecutándose');
            return;
        }
        
        // Preparar datos para la simulación 2D / Prepare data for the 2D simulation.
        const simulationData = {
            effects: this.currentSimulation.effects,
            parameters: this.currentSimulation.parameters,
            coordinates: this.currentSimulation.coordinates
        };
        
        // Iniciar simulación 2D / Start the 2D simulation.
        const success = await this.serverIntegration.startSimulation2D(simulationData);
        
        if (success) {
            // Actualizar botón / Update button state.
            const button2D = document.getElementById('start-2d-simulation');
            button2D.textContent = 'Detener Vista 2D';
            button2D.onclick = () => this.stop2DSimulation();
        }
    }
    
    async stop2DSimulation() {
        const success = await this.serverIntegration.stopSimulation2D();
        
        if (success) {
            // Actualizar botón / Update button state.
            const button2D = document.getElementById('start-2d-simulation');
            button2D.textContent = 'Vista 2D';
            button2D.onclick = () => this.start2DSimulation();
        }
    }
    
    // Sobrescribir método de búsqueda de ubicación para usar servidor / Override geocoding to use the server.
    async geocodeLocation(locationName) {
        try {
            return await this.serverIntegration.geocodeLocation(locationName);
        } catch (error) {
            // Fallback al método original si el servidor no está disponible / Fall back to original method if server is unavailable.
            return await super.geocodeLocation(locationName);
        }
    }
    
    // Sobrescribir método de carga de datos de la NASA / Override NASA data loading method.
    async loadNearEarthObjects() {
        try {
            const data = await this.serverIntegration.getNASAData();
            this.nasaAPI.processNearEarthObjects(data);
            this.nasaAPI.displayNearEarthObjects();
            this.nasaAPI.displayHazardAlerts();
        } catch (error) {
            console.error('Error al cargar datos de la NASA:', error);
            // Continuar sin datos de la NASA / Continue without NASA data.
        }
    }
}

// Exportar para uso global / Expose globally.
window.ServerIntegration = ServerIntegration;
window.MeteorSimulationWith2D = MeteorSimulationWith2D;
