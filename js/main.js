// Inicialización ligera de la aplicación / Lightweight application bootstrap.
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new MeteorSimulation();
    const dataProvider = new NASAAPI();
    const mitigationSystem = new MitigationSystem();

    // Exponer instancias para otros módulos / Expose instances for other modules.
    window.meteorSimulation = simulator;
    window.nasaAPI = dataProvider;
    window.mitigationSystem = mitigationSystem;

    // Mostrar datos simulados al inicio / Render simulated data on load.
    dataProvider.displayNearEarthObjects();
});
