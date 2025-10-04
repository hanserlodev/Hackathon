// Archivo principal que inicializa toda la aplicación / Main entry point that bootstraps the entire application.
class MeteorImpactSimulator {
    constructor() {
        // Referencias principales de la simulación / Core simulation references.
        this.simulation = null;
        this.nasaAPI = null;
        this.mitigationSystem = null;
        this.updateIntervals = [];

        this.injectMessageStyles();
        this.init();
    }

    async init() {
        try {
            // Mostrar mensaje de carga / Show loading overlay.
            this.toggleLoadingOverlay(true);

            // Inicializar componentes principales / Initialize core modules.
            this.simulation = new MeteorSimulation();
            this.nasaAPI = new NASAAPI();
            this.simulation.nasaAPI = this.nasaAPI;
            this.mitigationSystem = new MitigationSystem();

            // Hacer disponibles globalmente / Expose instances globally.
            window.meteorSimulation = this.simulation;
            window.nasaAPI = this.nasaAPI;
            window.mitigationSystem = this.mitigationSystem;

            // Cargar datos iniciales / Load initial datasets.
            await this.loadInitialData();

            // Configurar actualizaciones automáticas / Configure automatic refresh tasks.
            this.setupAutoUpdates();

            // Ocultar mensaje de carga / Hide loading overlay.
            this.toggleLoadingOverlay(false);

            // Mostrar mensaje de bienvenida / Display welcome message.
            this.showWelcomeMessage();
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.toggleLoadingOverlay(false);
            this.showErrorMessage('Error al inicializar la aplicación. Por favor, recarga la página.');
        }
    }

    async loadInitialData() {
        try {
            // Cargar datos de meteoritos cercanos / Load near-earth object data.
            await this.nasaAPI.getNearEarthObjects();

            // Mostrar datos en la interfaz / Render the information on the UI.
            this.nasaAPI.displayNearEarthObjects();
            this.nasaAPI.displayHazardAlerts();
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            // Continuar sin datos de la NASA / Continue with simulated data when NASA data fails.
            this.showWarningMessage('No se pudieron cargar los datos de meteoritos de la NASA. La simulación seguirá funcionando con datos simulados.');
        }
    }

    setupAutoUpdates() {
        // Limpiar intervalos existentes / Clear existing scheduled intervals.
        this.clearAutoUpdates();

        // Actualizar datos de meteoritos cada 30 minutos / Refresh NEO data every 30 minutes.
        this.updateIntervals.push(
            setInterval(() => this.nasaAPI.autoUpdate(), 30 * 60 * 1000)
        );

        // Actualizar estadísticas cada 5 minutos / Refresh dashboard statistics every 5 minutes.
        this.updateIntervals.push(
            setInterval(() => this.updateStatistics(), 5 * 60 * 1000)
        );
    }

    clearAutoUpdates() {
        // Detener intervalos activos / Stop active intervals.
        this.updateIntervals.forEach(intervalId => clearInterval(intervalId));
        this.updateIntervals = [];
    }

    updateStatistics() {
        const stats = this.nasaAPI.getNEOStatistics();
        if (!stats) {
            return;
        }

        const counter = document.getElementById('neo-counter');
        if (counter) {
            counter.textContent = `${stats.total} objetos cercanos detectados`;
        }
    }

    injectMessageStyles() {
        // Insertar estilos personalizados una sola vez / Inject custom styles only once.
        if (document.getElementById('meteor-messages-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'meteor-messages-styles';
        styles.textContent = `
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

            .warning-message {
                background: linear-gradient(45deg, #ffc107, #e0a800);
                color: #212529;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            }

            .warning-message .message-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #212529;
                line-height: 1;
            }

            .message-close {
                background: white;
                color: inherit;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }

            .message-close:hover {
                transform: scale(1.05);
            }

            .welcome-message .message-close {
                margin-top: 10px;
                color: #4ecdc4;
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
                max-width: 420px;
            }

            .error-content {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .reload-button {
                background: white;
                color: #dc3545;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }

            .reload-button:hover {
                transform: scale(1.05);
            }
        `;

        document.head.appendChild(styles);
    }

    toggleLoadingOverlay(show) {
        // Controlar overlay de carga / Toggle loading overlay visibility.
        let loadingDiv = document.getElementById('loading-message');

        if (show) {
            if (!loadingDiv) {
                loadingDiv = document.createElement('div');
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
            return;
        }

        if (loadingDiv && loadingDiv.parentElement) {
            loadingDiv.remove();
        }
    }

    showWelcomeMessage() {
        // Mensaje de bienvenida inicial / Initial welcome banner.
        this.renderInlineMessage({
            id: 'welcome-message',
            className: 'welcome-message',
            parentSelector: '.container',
            insertBeforeSelector: '.header',
            autoRemoveMs: 10000,
            content: `
                <div class="welcome-content">
                    <h3>🚀 ¡Bienvenido al Simulador de Impacto de Meteoritos!</h3>
                    <p>Explora las consecuencias de impactos de meteoritos en tiempo real. Selecciona una ubicación, ajusta los parámetros del meteorito y observa los efectos.</p>
                    <button type="button" class="message-close" aria-label="Comenzar / Start">Comenzar</button>
                </div>
            `
        });
    }

    showWarningMessage(message) {
        // Mensaje de advertencia reutilizable / Reusable warning banner.
        this.renderInlineMessage({
            className: 'warning-message',
            parentSelector: '.container',
            insertBeforeSelector: '.control-panel',
            autoRemoveMs: 8000,
            content: `
                <div class="warning-content">
                    <span>⚠️ ${message}</span>
                    <button type="button" class="message-close" aria-label="Cerrar / Close">×</button>
                </div>
            `
        });
    }

    renderInlineMessage({ id = null, className, content, parentSelector, insertBeforeSelector = null, autoRemoveMs = null }) {
        // Renderizar mensajes en línea reutilizables / Render reusable inline messages.
        const parent = document.querySelector(parentSelector);
        if (!parent) {
            return;
        }

        let messageDiv = id ? document.getElementById(id) : null;
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            if (id) {
                messageDiv.id = id;
            }
        }
        messageDiv.className = className;
        messageDiv.innerHTML = content.trim();

        const closeButton = messageDiv.querySelector('.message-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, { once: true });
        }

        const insertBeforeElement = insertBeforeSelector ? parent.querySelector(insertBeforeSelector) : null;
        if (insertBeforeElement) {
            parent.insertBefore(messageDiv, insertBeforeElement);
        } else {
            parent.appendChild(messageDiv);
        }

        if (autoRemoveMs) {
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, autoRemoveMs);
        }
    }

    showErrorMessage(message) {
        // Mensaje de error crítico / Critical error overlay.
        let errorDiv = document.getElementById('fatal-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'fatal-error-message';
            errorDiv.className = 'error-message';
            document.body.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="error-content">
                <span>❌ ${message}</span>
                <button type="button" class="reload-button" aria-label="Recargar / Reload">Recargar</button>
            </div>
        `;

        const reloadButton = errorDiv.querySelector('.reload-button');
        reloadButton.addEventListener('click', () => window.location.reload());
    }
}

// Inicializar la aplicación cuando el DOM esté listo / Bootstrap once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    new MeteorImpactSimulator();
});
