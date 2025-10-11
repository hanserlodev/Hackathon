/**
 * NASA SBDB Integration Initialization
 * Loads real asteroid data from NASA's Small-Body Database at startup
 */

import * as NASASBDB from './nasa-sbdb-api.js';

// Make NASA SBDB API available globally
window.NASASBDB = NASASBDB;

// Store loaded asteroids globally
window.loadedAsteroids = new Map();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading indicator
    const meteorSelect = document.getElementById('meteor-select');
    if (meteorSelect) {
        const loadingOption = document.createElement('option');
        loadingOption.value = 'loading';
        loadingOption.textContent = '🌠 Loading NASA data...';
        loadingOption.disabled = true;
        meteorSelect.appendChild(loadingOption);
    }
    
    try {
        // Load notable asteroids from NASA SBDB
        const asteroids = await NASASBDB.getNotableAsteroids();
        
        console.log(`✅ Successfully loaded ${asteroids.length} asteroids from NASA SBDB`);
        
        // Store asteroids for later use
        asteroids.forEach(asteroid => {
            window.loadedAsteroids.set(asteroid.name, asteroid);
            console.log(`  ✓ ${asteroid.name}${asteroid.pha ? ' ⚠️ PHA' : ''}${asteroid.neo ? ' 🌍 NEO' : ''}`);
            console.log(`    → Diameter: ${asteroid.physical.diameter.toFixed(2)} km`);
            console.log(`    → Orbit: a=${asteroid.orbit.semiMajorAxis.toFixed(3)} AU, e=${asteroid.orbit.eccentricity.toFixed(3)}`);
        });

        // Populate selector with real NASA data
        if (meteorSelect) {
            // DO NOT clear innerHTML - NEOs are already there from nasa-api.js
            
            // Check if separator already exists
            const existingSeparator = Array.from(meteorSelect.options).find(opt => 
                opt.textContent.includes('Real NASA Asteroids')
            );
            
            if (!existingSeparator) {
                // Add separator
                const separator = document.createElement('option');
                separator.disabled = true;
                separator.textContent = '── Real NASA Asteroids (SBDB) ──';
                meteorSelect.appendChild(separator);
            }
            
            // Add real asteroids (these have complete orbital data)
            asteroids.forEach(asteroid => {
                // Check if already exists
                const exists = Array.from(meteorSelect.options).some(opt => 
                    opt.value === asteroid.name
                );
                
                if (!exists) {
                    const option = document.createElement('option');
                    option.value = asteroid.name;
                    option.textContent = `${asteroid.name} ${asteroid.pha ? '⚠️' : ''}${asteroid.neo ? '🌍' : ''}`;
                    option.dataset.spkid = asteroid.spkId;
                    option.dataset.diameter = (asteroid.physical.diameter * 1000).toFixed(0); // km to m
                    option.dataset.velocity = NASASBDB.estimateImpactVelocity(asteroid.orbit).toFixed(1);
                    option.dataset.neo = asteroid.neo;
                    option.dataset.pha = asteroid.pha;
                    meteorSelect.appendChild(option);
                }
            });
            
            console.log(`✅ Added ${asteroids.length} real asteroids to selector (total: ${meteorSelect.options.length})`);
        }
        
        // Fetch some PHAs for demonstration
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Fetching Potentially Hazardous Asteroids (PHAs)...');
        const phas = await NASASBDB.getPotentiallyHazardousAsteroids(5);
        console.log(`Found ${phas.length} PHAs:`);
        phas.forEach(pha => {
            console.log(`  ⚠️ ${pha.name} - Diameter: ${pha.diameter.toFixed(2)} km`);
        });
        
        // Show Apophis example
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 Example: Detailed data for 99942 Apophis');
        const apophis = await NASASBDB.getAsteroidData('99942');
        console.log('Apophis Details:');
        console.log(`  Name: ${apophis.name}`);
        console.log(`  Diameter: ${apophis.physical.diameter.toFixed(2)} km (${(apophis.physical.diameter * 1000).toFixed(0)} m)`);
        console.log(`  Is PHA: ${apophis.pha ? '⚠️ YES' : 'No'}`);
        console.log(`  Is NEO: ${apophis.neo ? '🌍 YES' : 'No'}`);
        console.log(`  Semi-major Axis: ${apophis.orbit.semiMajorAxis.toFixed(3)} AU`);
        console.log(`  Eccentricity: ${apophis.orbit.eccentricity.toFixed(3)}`);
        console.log(`  Inclination: ${apophis.orbit.inclination.toFixed(2)}°`);
        console.log(`  Estimated Impact Velocity: ${NASASBDB.estimateImpactVelocity(apophis.orbit).toFixed(1)} km/s`);
        
    } catch (error) {
        console.error('❌ Error initializing NASA SBDB:', error);
        
        if (meteorSelect) {
            meteorSelect.innerHTML = '<option value="manual">Custom Impact Parameters (NASA API Error)</option>';
        }
    }
});

// Add button to view asteroid orbital data
function addOrbitViewerButton() {
    const controlPanel = document.querySelector('.control-panel');
    if (!controlPanel) return;
    
    // Check if button already exists
    if (document.getElementById('view-orbit-data')) return;
    
    const button = document.createElement('button');
    button.id = 'view-orbit-data';
    button.className = 'control-button';
    button.innerHTML = '<i class="fas fa-satellite"></i> View Orbital Data (NASA SBDB)';
    button.style.marginTop = '15px';
    
    button.addEventListener('click', showOrbitDataModal);
    
    // Insert after meteor select
    const meteorSelect = document.getElementById('meteor-select');
    if (meteorSelect && meteorSelect.parentElement) {
        meteorSelect.parentElement.insertAdjacentElement('afterend', button);
    } else {
        controlPanel.appendChild(button);
    }
}

// Show orbital data modal
async function showOrbitDataModal() {
    const meteorSelect = document.getElementById('meteor-select');
    if (!meteorSelect) {
        alert('Selector not found.');
        return;
    }
    
    const selectedValue = meteorSelect.value;
    const selectedOption = meteorSelect.options[meteorSelect.selectedIndex];
    
    if (!selectedValue || selectedValue === 'manual' || selectedValue === 'loading') {
        alert('⚠️ Please select a real asteroid from the dropdown first.\n\nAvailable asteroids are marked with 🌍 (NEO) and ⚠️ (PHA)');
        return;
    }
    
    // Show loading modal
    const loadingModal = document.createElement('div');
    loadingModal.className = 'orbit-modal';
    loadingModal.innerHTML = `
        <div class="orbit-modal-content" style="text-align: center; padding: 50px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">
                <i class="fas fa-satellite" style="animation: rotate-satellite 2s linear infinite;"></i>
            </div>
            <h2 style="color: #FFB300;">🔍 Querying NASA SBDB...</h2>
            <p style="color: #e0e0e0; margin-top: 20px;">Fetching real-time data from NASA's Small-Body Database</p>
            <p style="color: #4ecdc4; font-size: 0.9rem;">${selectedValue}</p>
        </div>
    `;
    document.body.appendChild(loadingModal);
    
    try {
        console.log(`🔍 Fetching orbital data for: ${selectedValue}`);

        // Check if we have cached data
        let data = window.loadedAsteroids.get(selectedValue);
        
        if (!data) {
            data = await NASASBDB.searchSmallBody(selectedValue);
            window.loadedAsteroids.set(selectedValue, data);
        } else {
            console.log(`   ✓ Using cached data`);
        }
        
        console.log(`   Type: ${data.type}`);
        console.log(`   NEO: ${data.neo ? 'Yes' : 'No'}`);
        console.log(`   PHA: ${data.pha ? 'Yes (Potentially Hazardous)' : 'No'}`);
        
        // Remove loading modal
        loadingModal.remove();
        
        // Calculate impact velocity
        const impactVelocity = NASASBDB.estimateImpactVelocity(data.orbit);
        
        // Create detailed modal
        const modal = document.createElement('div');
        modal.className = 'orbit-modal';
        modal.innerHTML = `
            <div class="orbit-modal-content">
                <div class="orbit-modal-header">
                    <h2><i class="fas fa-satellite-dish"></i> ${data.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="orbit-modal-body">
                    <div class="nasa-api-badge">
                        <i class="fas fa-database"></i> Data Source: NASA Small-Body Database (SBDB) API
                    </div>
                    
                    <div class="orbit-info-grid">
                        <div class="orbit-info-section">
                            <h3><i class="fas fa-tags"></i> Classification</h3>
                            <ul>
                                <li><strong>Object Type:</strong> ${(data.type || 'asteroid').toUpperCase()}</li>
                                <li><strong>SPK-ID:</strong> ${data.spkId || 'N/A'}</li>
                                <li><strong>Near-Earth Object (NEO):</strong> ${data.neo ? '✅ Yes' : '❌ No'}</li>
                                <li><strong>Potentially Hazardous (PHA):</strong> ${data.pha ? '⚠️ YES' : '✅ No'}</li>
                                ${data.physical?.diameter && data.physical.diameter > 0 ? `<li><strong>Diameter:</strong> ${data.physical.diameter.toFixed(3)} km (${(data.physical.diameter * 1000).toFixed(0)} m)</li>` : '<li><strong>Diameter:</strong> Not available</li>'}
                                ${data.physical?.albedo && data.physical.albedo > 0 ? `<li><strong>Albedo:</strong> ${data.physical.albedo.toFixed(3)}</li>` : ''}
                                ${data.physical?.magnitude && data.physical.magnitude > 0 ? `<li><strong>Absolute Magnitude (H):</strong> ${data.physical.magnitude.toFixed(2)}</li>` : ''}
                            </ul>
                        </div>
                        
                        <div class="orbit-info-section">
                            <h3><i class="fas fa-orbit"></i> Keplerian Orbital Elements</h3>
                            <ul>
                                <li><strong>Semi-major Axis (a):</strong> ${(data.orbit.semiMajorAxis || data.orbit.perihelionDistance || 0).toFixed(6)} AU</li>
                                <li><strong>Eccentricity (e):</strong> ${data.orbit.eccentricity.toFixed(6)}</li>
                                <li><strong>Inclination (i):</strong> ${data.orbit.inclination.toFixed(4)}°</li>
                                <li><strong>Longitude Ascending Node (Ω):</strong> ${data.orbit.ascendingNode.toFixed(4)}°</li>
                                <li><strong>Argument Perihelion (ω):</strong> ${data.orbit.argPerihelion.toFixed(4)}°</li>
                                ${data.orbit.meanAnomaly ? `<li><strong>Mean Anomaly (M):</strong> ${data.orbit.meanAnomaly.toFixed(4)}°</li>` : ''}
                                <li><strong>Orbital Period:</strong> ${(data.orbit.period / 365.25).toFixed(2)} years (${data.orbit.period.toFixed(1)} days)</li>
                            </ul>
                        </div>
                        
                        <div class="orbit-info-section">
                            <h3><i class="fas fa-calculator"></i> Impact Simulation Parameters</h3>
                            <ul>
                                <li><strong>Estimated Impact Velocity:</strong> ${impactVelocity.toFixed(2)} km/s</li>
                                <li><strong>Relative to Earth Orbit:</strong> ${(impactVelocity - 29.78).toFixed(2)} km/s</li>
                                ${data.physical?.diameter ? `<li><strong>Kinetic Energy (at impact):</strong> ${((0.5 * data.physical.diameter * 1000 * 1000 * 1000 * 2700 * impactVelocity * impactVelocity) / 4.184e15).toFixed(2)} MT</li>` : ''}
                                ${data.physical?.diameter ? `<li><strong>Diameter for Sim:</strong> ${(data.physical.diameter * 1000).toFixed(0)} m</li>` : ''}
                                <li><strong>Velocity for Sim:</strong> ${impactVelocity.toFixed(1)} km/s</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="orbit-actions">
                        <button class="use-for-simulation" onclick="applyOrbitDataToSimulation('${selectedValue.replace(/'/g, "\\'")}')">
                            <i class="fas fa-play"></i> Apply to Simulation
                        </button>
                        ${data.spkId || data.name ? `
                        <button class="view-nasa-eyes" onclick="(function() {
                            // Eyes on Asteroids format: #/designation_name (lowercase)
                            const name = '${selectedValue}'.toLowerCase();
                            let eyesId = '';
                            
                            // Map specific asteroids to their Eyes on Asteroids ID
                            if (name.includes('99942') || name.includes('apophis')) eyesId = '99942_apophis';
                            else if (name.includes('101955') || name.includes('bennu')) eyesId = '101955_bennu';
                            else if (name.includes('162173') || name.includes('ryugu')) eyesId = '162173_ryugu';
                            else if (name.includes('433') || name.includes('eros')) eyesId = '433_eros';
                            else if (name.includes('1566') || name.includes('icarus')) eyesId = '1566_icarus';
                            else if (name.includes('1862') || name.includes('apollo')) eyesId = '1862_apollo';
                            else if (name.includes('2062') || name.includes('aten')) eyesId = '2062_aten';
                            else if (name.includes('4179') || name.includes('toutatis')) eyesId = '4179_toutatis';
                            else if (name.includes('25143') || name.includes('itokawa')) eyesId = '25143_itokawa';
                            else if (name.includes('3200') || name.includes('phaethon')) eyesId = '3200_phaethon';
                            else if (name.includes('1620') || name.includes('geographos')) eyesId = '1620_geographos';
                            else if (name.includes('4660') || name.includes('nereus')) eyesId = '4660_nereus';
                            else if (name.includes('6489') || name.includes('golevka')) eyesId = '6489_golevka';
                            else if (name.includes('1221') || name.includes('amor')) eyesId = '1221_amor';
                            else if (name.includes('1036') || name.includes('ganymed')) eyesId = '1036_ganymed';
                            else if (name.includes('1685') || name.includes('toro')) eyesId = '1685_toro';
                            else if (name.includes('1866') || name.includes('sisyphus')) eyesId = '1866_sisyphus';
                            else if (name.includes('2063') || name.includes('bacchus')) eyesId = '2063_bacchus';
                            else if (name.includes('3361') || name.includes('orpheus')) eyesId = '3361_orpheus';
                            else if (name.includes('4769') || name.includes('castalia')) eyesId = '4769_castalia';
                            else if (name.includes('65803') || name.includes('didymos')) eyesId = '65803_didymos';
                            else {
                                // Default: try designation_name format
                                const designation = '${selectedValue}'.match(/^\\d+/);
                                if (designation) {
                                    eyesId = designation[0];
                                }
                            }
                            
                            if (eyesId) {
                                window.open('https://eyes.nasa.gov/apps/asteroids/#/' + eyesId, '_blank');
                            } else {
                                alert('Este asteroide no está disponible en Eyes on Asteroids');
                            }
                        })()">
                            <i class="fas fa-external-link-alt"></i> View in NASA Eyes
                        </button>
                        ` : ''}
                        <button class="view-sbdb" onclick="(function() {
                            const designation = '${selectedValue}'.match(/^\\d+/) ? '${selectedValue}'.match(/^\\d+/)[0] : '${data.spkId ? data.spkId.replace(/^2/, '') : selectedValue.replace(/[^0-9]/g, '')}';
                            window.open('https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=' + designation, '_blank');
                        })()">
                            <i class="fas fa-database"></i> View in SBDB
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('❌ Error fetching orbital data:', error);
        
        loadingModal.remove();
        
        alert(`❌ Could not fetch orbital data for "${selectedValue}".\n\nError: ${error.message}\n\nPlease try:\n1. Check your internet connection\n2. Try another asteroid\n3. Check browser console for details`);
    }
}

// Apply orbital data to simulation
window.applyOrbitDataToSimulation = async function(name) {
    try {
        console.log(`✅ Applying real NASA data to simulation: ${name}`);
        
        let data = window.loadedAsteroids.get(name);
        
        if (!data) {
            data = await NASASBDB.searchSmallBody(name);
        }
        
        // Set diameter
        if (data.physical?.diameter) {
            const diameterM = data.physical.diameter * 1000; // Convert km to m
            const sizeSlider = document.getElementById('meteor-size');
            if (sizeSlider) {
                const clampedDiameter = Math.min(Math.max(diameterM, 10), 40000);
                sizeSlider.value = clampedDiameter;
                sizeSlider.dispatchEvent(new Event('input'));
                console.log(`   Diameter set to: ${clampedDiameter.toFixed(0)} m`);
            }
        }
        
        // Set velocity
        const velocity = NASASBDB.estimateImpactVelocity(data.orbit);
        const velocitySlider = document.getElementById('meteor-velocity');
        if (velocitySlider) {
            const clampedVelocity = Math.min(Math.max(velocity, 11), 1000);
            velocitySlider.value = clampedVelocity;
            velocitySlider.dispatchEvent(new Event('input'));
            console.log(`   Velocity set to: ${clampedVelocity.toFixed(1)} km/s`);
        }
        
        console.log(`✅ Simulation parameters updated successfully`);
                
        // Close modal
        const modal = document.querySelector('.orbit-modal');
        if (modal) {
            modal.remove();
        }
        
        alert(`✅ Simulation parameters updated with real NASA SBDB data!\n\n` +
              `Asteroid: ${data.name}\n` +
              `Diameter: ${data.physical?.diameter ? (data.physical.diameter * 1000).toFixed(0) + ' m' : 'Unknown'}\n` +
              `Velocity: ${velocity.toFixed(1)} km/s\n\n` +
              `🚀 Ready to simulate! Click "Initialize Simulation"`);
        
    } catch (error) {
        console.error('❌ Error applying orbital data:', error);
        alert('❌ Error applying orbital data to simulation.\n\n' + error.message);
    }
};

// Add orbit viewer button when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other initializations
    setTimeout(addOrbitViewerButton, 1000);
});
