/**
 * NEO Analysis and Emergency Protocols UI Renderer
 * Dynamically populates the database analysis and protocol sections
 */

import { NEO_DATABASE, SIZE_CATEGORIES, getNEOStatistics } from './neo-database.js';
import { TRIAGE_LEVELS, RESPONSE_PHASES, SHOCK_WAVE_LEVELS, SEISMIC_LEVELS, THERMAL_LEVELS } from './emergency-protocols.js';

// Initialize all sections when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    renderNEOCategories();
    renderTriageLevels();
    renderResponsePhases();
    renderShockWaveMatrix();
    renderSeismicMatrix();
    renderThermalMatrix();
});

/**
 * Render NEO Categories
 */
function renderNEOCategories() {
    const container = document.getElementById('neo-categories');
    if (!container) return;

    const stats = getNEOStatistics();
    
    // Sort categories by count
    const sortedCategories = Object.entries(stats.byCategory)
        .sort(([, a], [, b]) => b - a);

    sortedCategories.forEach(([category, count]) => {
        const categoryInfo = SIZE_CATEGORIES[category];
        if (!categoryInfo) return;

        const card = document.createElement('div');
        card.className = 'neo-category-card';
        card.style.borderLeftColor = categoryInfo.color;

        card.innerHTML = `
            <h4 style="color: ${categoryInfo.color};">${categoryInfo.label}</h4>
            <div class="count">${count} Objects</div>
            <div class="impact-desc"><strong>Range:</strong> ${category}</div>
            <div class="impact-desc"><strong>Impact:</strong> ${categoryInfo.impact}</div>
            <div class="frequency">Frequency: ${categoryInfo.frequency}</div>
        `;

        container.appendChild(card);
    });
}

/**
 * Render Triage Levels
 */
function renderTriageLevels() {
    const container = document.getElementById('triage-levels');
    if (!container) return;

    TRIAGE_LEVELS.forEach(triage => {
        const card = document.createElement('div');
        card.className = 'triage-card';
        card.style.borderLeftColor = triage.color;

        card.innerHTML = `
            <div class="level-badge" style="background-color: ${triage.color}; color: ${triage.color === '#00FF00' || triage.color === '#0000FF' ? '#000' : '#FFF'};">
                LEVEL ${triage.level}
            </div>
            <h4>${triage.name}</h4>
            <p>${triage.description}</p>
            <div class="timeframe">⏱️ ${triage.timeframe}</div>
        `;

        container.appendChild(card);
    });
}

/**
 * Render Response Phases
 */
function renderResponsePhases() {
    const container = document.getElementById('response-phases');
    if (!container) return;

    RESPONSE_PHASES.forEach(phase => {
        const card = document.createElement('div');
        card.className = 'phase-card';
        card.style.borderTopColor = phase.color;

        const actionsHTML = phase.actions.map(action => 
            `<li>${action}</li>`
        ).join('');

        card.innerHTML = `
            <div class="phase-header">
                <h4 style="color: ${phase.color};">${phase.phase}</h4>
                <div class="timeframe-badge">${phase.timeframe}</div>
            </div>
            <div class="objective">${phase.objective}</div>
            <ul>${actionsHTML}</ul>
        `;

        container.appendChild(card);
    });
}

/**
 * Render Shock Wave Severity Matrix
 */
function renderShockWaveMatrix() {
    const container = document.getElementById('shock-wave-matrix');
    if (!container) return;

    SHOCK_WAVE_LEVELS.forEach(level => {
        const card = document.createElement('div');
        card.className = 'severity-level-card';
        card.style.borderLeftColor = level.color;

        const impactsHTML = Object.entries(level.impacts)
            .map(([key, value]) => `
                <div class="impact-item">
                    <div class="impact-label">${key.toUpperCase()}</div>
                    <div class="impact-desc">${value}</div>
                </div>
            `).join('');

        const actionsHTML = level.actions.map(action => 
            `<li>${action}</li>`
        ).join('');

        card.innerHTML = `
            <div class="level-header">
                <div class="level-name" style="color: ${level.color};">LEVEL ${level.level}: ${level.name}</div>
                <div class="level-range">${level.dbRange} | ${level.pressureRange}</div>
            </div>
            <div class="impacts-grid">${impactsHTML}</div>
            <div class="actions-section">
                <div class="actions-title">IMMEDIATE ACTIONS:</div>
                <ul class="actions-list">${actionsHTML}</ul>
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Render Seismic Severity Matrix
 */
function renderSeismicMatrix() {
    const container = document.getElementById('seismic-matrix');
    if (!container) return;

    SEISMIC_LEVELS.forEach(level => {
        const card = document.createElement('div');
        card.className = 'severity-level-card';
        card.style.borderLeftColor = level.color;

        const impactsHTML = Object.entries(level.impacts)
            .map(([key, value]) => `
                <div class="impact-item">
                    <div class="impact-label">${key.toUpperCase()}</div>
                    <div class="impact-desc">${value}</div>
                </div>
            `).join('');

        const actionsHTML = level.actions.map(action => 
            `<li>${action}</li>`
        ).join('');

        card.innerHTML = `
            <div class="level-header">
                <div class="level-name" style="color: ${level.color};">LEVEL ${level.level}: ${level.name}</div>
                <div class="level-range">Magnitude ${level.magnitudeRange}</div>
            </div>
            <div class="impacts-grid">${impactsHTML}</div>
            <div class="actions-section">
                <div class="actions-title">IMMEDIATE ACTIONS:</div>
                <ul class="actions-list">${actionsHTML}</ul>
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Render Thermal Radiation Severity Matrix
 */
function renderThermalMatrix() {
    const container = document.getElementById('thermal-matrix');
    if (!container) return;

    THERMAL_LEVELS.forEach(level => {
        const card = document.createElement('div');
        card.className = 'severity-level-card';
        card.style.borderLeftColor = level.color;

        const impactsHTML = Object.entries(level.impacts)
            .map(([key, value]) => `
                <div class="impact-item">
                    <div class="impact-label">${key.toUpperCase()}</div>
                    <div class="impact-desc">${value}</div>
                </div>
            `).join('');

        const actionsHTML = level.actions.map(action => 
            `<li>${action}</li>`
        ).join('');

        card.innerHTML = `
            <div class="level-header">
                <div class="level-name" style="color: ${level.color};">${level.name}</div>
                <div class="level-range">Ø ${level.diameter} | ${level.temperature}</div>
            </div>
            <div class="impacts-grid">${impactsHTML}</div>
            <div class="actions-section">
                <div class="actions-title">IMMEDIATE ACTIONS:</div>
                <ul class="actions-list">${actionsHTML}</ul>
            </div>
        `;

        container.appendChild(card);
    });
}

// Export functions for external use
export {
    renderNEOCategories,
    renderTriageLevels,
    renderResponsePhases,
    renderShockWaveMatrix,
    renderSeismicMatrix,
    renderThermalMatrix
};
