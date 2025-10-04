// Archivo principal que inicializa toda la aplicación
class MeteorImpactSimulator {
    constructor() {
        this.simulation = null;
        this.nasaAPI = null;
        this.mitigationSystem = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Mostrar mensaje de carga
            this.showLoadingMessage();
            
            // Inicializar componentes principales
            this.simulation = new MeteorSimulation();
            this.nasaAPI = new NASAAPI();
            this.mitigationSystem = new MitigationSystem();
            
            // Hacer disponibles globalmente
            window.meteorSimulation = this.simulation;
            window.nasaAPI = this.nasaAPI;
            window.mitigationSystem = this.mitigationSystem;
            
            // Cargar datos iniciales
            await this.loadInitialData();
            
            // Configurar actualizaciones automáticas
            this.setupAutoUpdates();
            
            // Ocultar mensaje de carga
            this.hideLoadingMessage();
            
            // Mostrar mensaje de bienvenida
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.showErrorMessage('Error al inicializar la aplicación. Por favor, recarga la página.');
        }
    }
    
    async loadInitialData() {
        try {
            // Cargar datos de meteoritos cercanos
            await this.nasaAPI.getNearEarthObjects();
            
            // Mostrar datos en la interfaz
            this.nasaAPI.displayNearEarthObjects();
            this.nasaAPI.displayHazardAlerts();
            
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            // Continuar sin datos de la NASA
            this.showWarningMessage('No se pudieron cargar los datos de meteoritos de la NASA. La simulación seguirá funcionando con datos simulados.');
        }
    }
    
    setupAutoUpdates() {
        // Actualizar datos de meteoritos cada 30 minutos
        setInterval(() => {
            this.nasaAPI.autoUpdate();
        }, 30 * 60 * 1000);
        
        // Actualizar estadísticas cada 5 minutos
        setInterval(() => {
            this.updateStatistics();
        }, 5 * 60 * 1000);
    }
    
    updateStatistics() {
        const stats = this.nasaAPI.getNEOStatistics();
        if (stats) {
            // Actualizar contador de objetos cercanos
            const counter = document.getElementById('neo-counter');
            if (counter) {
                counter.textContent = `${stats.total} objetos cercanos detectados`;
            }
        }
    }
    
    showLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.className = 'loading-message';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3>🌍 Inicializando Simulador de Impacto de Meteoritos</h3>
                <p>Cargando datos de la NASA y preparando la simulación...</p>
            </div>
        `;
        
        document.body.appendChild(loadingDiv);
    }
    
    hideLoadingMessage() {
        const loadingDiv = document.getElementById('loading-message');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = 'welcome-message';
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <div class="welcome-content">
                <h3>🚀 ¡Bienvenido al Simulador de Impacto de Meteoritos!</h3>
                <p>Explora las consecuencias de impactos de meteoritos en tiempo real. Selecciona una ubicación, ajusta los parámetros del meteorito y observa los efectos.</p>
                <button onclick="this.parentElement.parentElement.remove()">Comenzar</button>
            </div>
        `;
        
        document.querySelector('.container').insertBefore(welcomeDiv, document.querySelector('.header'));
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (welcomeDiv.parentElement) {
                welcomeDiv.remove();
            }
        }, 10000);
    }
    
    showWarningMessage(message) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-message';
        warningDiv.innerHTML = `
            <div class="warning-content">
                <span>⚠️ ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.querySelector('.container').insertBefore(warningDiv, document.querySelector('.control-panel'));
        
        setTimeout(() => {
            if (warningDiv.parentElement) {
                warningDiv.remove();
            }
        }, 8000);
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>❌ ${message}</span>
                <button onclick="location.reload()">Recargar</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MeteorImpactSimulator();
});

// Agregar estilos adicionales para los mensajes
const additionalStyles = `
    .loading-message {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .loading-content {
        text-align: center;
        color: white;
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top: 5px solid #4ecdc4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .welcome-message {
        background: linear-gradient(45deg, #4ecdc4, #45b7d1);
        color: white;
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 20px;
        text-align: center;
    }
    
    .welcome-content button {
        background: white;
        color: #4ecdc4;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 10px;
    }
    
    .warning-message {
        background: linear-gradient(45deg, #ffc107, #e0a800);
        color: #212529;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .warning-content button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #212529;
    }
    
    .error-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #dc3545, #c82333);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .error-content button {
        background: white;
        color: #dc3545;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 15px;
    }
    
    .mitigation-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: white;
        color: #333;
        padding: 30px;
        border-radius: 15px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #4ecdc4;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }
    
    .mitigation-info, .mitigation-results, .mitigation-recommendations {
        margin-bottom: 25px;
    }
    
    .result-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    
    .result-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #4ecdc4;
    }
    
    .mitigation-comparison {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        margin-top: 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .comparison-item {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        border-left: 4px solid #4ecdc4;
    }
    
    .comparison-item h4 {
        color: #4ecdc4;
        margin-bottom: 15px;
    }
    
    .comparison-item p {
        margin-bottom: 8px;
        color: white;
    }
    
    .hazard-indicator {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-top: 5px;
    }
    
    .hazard-indicator.crítico {
        background: #dc3545;
        color: white;
    }
    
    .hazard-indicator.alto {
        background: #fd7e14;
        color: white;
    }
    
    .hazard-indicator.medio {
        background: #ffc107;
        color: #212529;
    }
    
    .hazard-indicator.bajo {
        background: #28a745;
        color: white;
    }
    
    .hazard-indicator.mínimo {
        background: #6c757d;
        color: white;
    }
    
    .neo-stats {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
        border-left: 4px solid #4ecdc4;
    }
    
    .hazard-alerts {
        background: rgba(220, 53, 69, 0.2);
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
        border-left: 4px solid #dc3545;
    }
    
    .alert-item {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        border-left: 4px solid #dc3545;
    }
    
    .alert-item.crítico {
        border-left-color: #dc3545;
        background: rgba(220, 53, 69, 0.1);
    }
    
    .alert-item.alto {
        border-left-color: #fd7e14;
        background: rgba(253, 126, 20, 0.1);
    }
    
    .alert-item.medio {
        border-left-color: #ffc107;
        background: rgba(255, 193, 7, 0.1);
    }
    
    .location-info {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 15px;
        margin-top: 15px;
        border-left: 4px solid #4ecdc4;
    }
    
    .location-info h4 {
        color: #4ecdc4;
        margin-bottom: 10px;
    }
    
    .location-info p {
        color: white;
        margin-bottom: 5px;
    }
    
    .impact-classification {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        margin-top: 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .classification-card {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        border-left: 4px solid #4ecdc4;
    }
    
    .classification-card h4 {
        color: #4ecdc4;
        margin-bottom: 10px;
        font-size: 1.5rem;
    }
    
    .climate-effects {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        margin-top: 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .climate-card {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        border-left: 4px solid #ffc107;
    }
    
    .climate-card p {
        color: white;
        margin-bottom: 10px;
    }
    
    .simulation-summary {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        margin-top: 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .summary-item {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        border-left: 4px solid #4ecdc4;
    }
    
    .summary-item h4 {
        color: #4ecdc4;
        margin-bottom: 10px;
    }
    
    .summary-item p {
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
    }
`;

// Agregar estilos adicionales al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
