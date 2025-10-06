/**
 * MEDICAL EMERGENCY RESPONSE PROTOCOLS
 * Disaster Triage and Multi-Phase Response System
 */

export const TRIAGE_LEVELS = [
    {
        level: "I",
        name: "RESUSCITATION",
        color: "#FF0000",
        description: "Life-threatening condition. Requires immediate medical intervention.",
        timeframe: "IMMEDIATE",
        priority: 1
    },
    {
        level: "II",
        name: "EMERGENCY",
        color: "#FF6600",
        description: "Acute condition, not immediately life-threatening.",
        timeframe: "Within 30 minutes",
        priority: 2
    },
    {
        level: "III",
        name: "URGENCY",
        color: "#FFB300",
        description: "Medical attention needed but condition is stable.",
        timeframe: "Up to 2 hours",
        priority: 3
    },
    {
        level: "IV",
        name: "NON-URGENCY",
        color: "#00FF00",
        description: "Acute condition without compromising general state.",
        timeframe: "2 to 4 hours",
        priority: 4
    },
    {
        level: "V",
        name: "NON-URGENT",
        color: "#0000FF",
        description: "Chronic condition without evident deterioration.",
        timeframe: "Outpatient appointment",
        priority: 5
    }
];

export const RESPONSE_PHASES = [
    {
        phase: "SHORT-TERM",
        timeframe: "Hours - First 3 Days",
        objective: "SAVE IMMEDIATE LIVES",
        actions: [
            "Mass Triage (START Protocol)",
            "Hemorrhage Control",
            "Emergency Evacuation",
            "Urban Search and Rescue (USAR)",
            "Establish Medical Command Post"
        ],
        color: "#FC3D21"
    },
    {
        phase: "MEDIUM-TERM",
        timeframe: "Days 4 - Weeks 4-6",
        objective: "STABILIZE & PREVENT EPIDEMICS",
        actions: [
            "Field Hospitals Deployment",
            "Potable Water Distribution",
            "Mass Sanitation Systems",
            "Mass Vaccination Campaigns",
            "Initial Mental Health Support"
        ],
        color: "#FFB300"
    },
    {
        phase: "LONG-TERM",
        timeframe: "Months - Years",
        objective: "RECOVERY & RECONSTRUCTION",
        actions: [
            "Physical Rehabilitation Programs",
            "Permanent Mental Health Care",
            "Hospital Infrastructure Rebuild",
            "Lessons Learned Analysis",
            "Preparedness Training"
        ],
        color: "#0B3D91"
    }
];

// SHOCK WAVE SEVERITY MATRIX (dB SPL)
export const SHOCK_WAVE_LEVELS = [
    {
        level: 1,
        name: "MILD",
        dbRange: "< 140 dB SPL",
        pressureRange: "< 200 Pa",
        impacts: {
            people: "Acoustic discomfort, temporary hearing loss risk",
            housing: "Vibrations, falling loose objects, superficial cracks",
            windows: "Vibration, unlikely breakage",
            energy: "Local interference, sensor saturation",
            communications: "Congestion and noise",
            transportation: "Minor obstructions"
        },
        actions: [
            "Public information (stay indoors)",
            "Quick visual inspections",
            "Secure perimeters with broken glass",
            "Network monitoring"
        ],
        color: "#FFB300"
    },
    {
        level: 2,
        name: "MODERATE",
        dbRange: "140-159 dB SPL",
        pressureRange: "200-2,000 Pa (~0.03-0.29 psi)",
        impacts: {
            people: "Eardrum rupture risk, projectile injuries",
            housing: "Cracks in weak masonry, cladding detachment",
            windows: "Widespread window breakage",
            energy: "Exposed equipment failures",
            communications: "Damaged antennas, coverage loss",
            transportation: "Main route obstacles"
        },
        actions: [
            "Rapid triage",
            "Reinforce ER capacity",
            "Selective evacuation",
            "Deploy generators"
        ],
        color: "#FF8C00"
    },
    {
        level: 3,
        name: "SEVERE",
        dbRange: "160-169 dB SPL",
        pressureRange: "2,000-6,300 Pa (~0.29-0.92 psi)",
        impacts: {
            people: "High auditory injury and debris trauma risk",
            housing: "Structural cracks, damaged roofs",
            windows: "Massive window breakage, falling facades",
            energy: "Substation and overhead line damage",
            communications: "Equipment and backbone damage",
            transportation: "Bridge and signage damage"
        },
        actions: [
            "Activate field hospitals",
            "Urgent structural assessment",
            "Generators for critical services",
            "Temporary satellite stations"
        ],
        color: "#FF3300"
    },
    {
        level: 4,
        name: "CRITICAL",
        dbRange: "170-179 dB SPL",
        pressureRange: "6,300-20,000 Pa (~0.92-2.9 psi)",
        impacts: {
            people: "Serious injuries, possible fatalities",
            housing: "Significant structural damage",
            infrastructure: "Dam failure risk, facility collapse",
            communications: "Strategic node collapse",
            transportation: "Bridge damage, limited access"
        },
        actions: [
            "Intensive urban search and rescue",
            "Activate national health network",
            "Strategic evacuations",
            "Priority satellite links"
        ],
        color: "#CC0000"
    },
    {
        level: 5,
        name: "CATASTROPHIC",
        dbRange: "≥ 180 dB SPL",
        pressureRange: "≥ 20,000 Pa (> 2.9 psi)",
        impacts: {
            people: "Multiple fatalities across wide area",
            infrastructure: "Building collapses, dam failures",
            energy: "Network node destruction",
            transportation: "Destroyed corridors, damaged ports",
            food: "Broken supply chain"
        },
        actions: [
            "International response coordination",
            "Mass evacuation corridors",
            "UN/NGO coordination",
            "Emergency programs (WFP/FAO)"
        ],
        color: "#660000"
    }
];

// SEISMIC SEVERITY MATRIX (Richter Scale)
export const SEISMIC_LEVELS = [
    {
        level: 1,
        name: "LIGHT",
        magnitudeRange: "3.0-4.9",
        impacts: {
            housing: "Perceptible vibration, cosmetic cracks",
            health: "Alarms and panic, isolated falls",
            infrastructure: "Minor displacement of loose elements",
            power: "Isolated micro-outages"
        },
        actions: [
            "Quick visual inspection",
            "Secure loose objects",
            "Primary care services",
            "Informational messages"
        ],
        color: "#FFB300"
    },
    {
        level: 2,
        name: "MODERATE",
        magnitudeRange: "5.0-5.9",
        impacts: {
            housing: "Non-structural wall cracks, broken windows",
            health: "Injuries from falling objects",
            infrastructure: "Damage to small bridges",
            power: "Local outages, pipe damage"
        },
        actions: [
            "Selective evacuation",
            "Rapid structural assessment",
            "Reinforce emergency services",
            "Priority restoration in critical zones"
        ],
        color: "#FF8C00"
    },
    {
        level: 3,
        name: "SEVERE",
        magnitudeRange: "6.0-6.9",
        impacts: {
            housing: "Partial collapse of old buildings",
            health: "Multiple injuries, hospital saturation",
            infrastructure: "Medium bridge damage, small dam issues",
            power: "Prolonged sectoral outages"
        },
        actions: [
            "Mass evacuation",
            "Open shelters",
            "Activate field hospitals",
            "Urgent infrastructure closure"
        ],
        color: "#FF3300"
    },
    {
        level: 4,
        name: "CRITICAL",
        magnitudeRange: "7.0-7.9",
        impacts: {
            housing: "Widespread collapse",
            health: "Regional health crisis",
            infrastructure: "Medium/large dam failures",
            power: "Massive transmission damage"
        },
        actions: [
            "Declaration of emergency",
            "Intensive urban search and rescue",
            "National medical coordination",
            "Infrastructure closure and securing"
        ],
        color: "#CC0000"
    },
    {
        level: 5,
        name: "CATASTROPHIC",
        magnitudeRange: "≥ 8.0",
        impacts: {
            housing: "Massive urban destruction",
            health: "Thousands-tens of thousands of victims",
            infrastructure: "Port, power plant, dam collapse",
            power: "Large-scale blackouts"
        },
        actions: [
            "International humanitarian operation",
            "WHO/Red Cross coordination",
            "Multinational intervention",
            "International energy/water provision"
        ],
        color: "#660000"
    }
];

// THERMAL RADIATION SEVERITY MATRIX
export const THERMAL_LEVELS = [
    {
        level: 1,
        name: "LEVEL 1",
        diameter: "≤ 10 km",
        temperature: "327-727°C",
        impacts: {
            infrastructure: "Facade damage, localized ignition",
            health: "First/second-degree burns in exposed individuals",
            energy: "Isolated outages",
            water: "Light ash contamination"
        },
        actions: [
            "Rapid firefighting",
            "Safety perimeter",
            "Triage at local centers",
            "Distribution of drinking water"
        ],
        color: "#FFB300"
    },
    {
        level: 2,
        name: "LEVEL 2",
        diameter: "10-120 km",
        temperature: "727-1227°C",
        impacts: {
            infrastructure: "Multiple fires, light building damage",
            health: "Severe burns, regional saturation",
            energy: "Substation damage, regional blackouts",
            water: "Plant damage, contamination risk"
        },
        actions: [
            "Continuous fire brigades",
            "Mobilize field hospitals",
            "Deploy industrial generators",
            "Activate alternative supply"
        ],
        color: "#FF8C00"
    },
    {
        level: 3,
        name: "LEVEL 3",
        diameter: "120-144 km",
        temperature: "1227-1727°C",
        impacts: {
            infrastructure: "Widespread fires, critical facility damage",
            health: "Mass trauma, regional collapse",
            energy: "National/regional grid failures",
            water: "Major plant destruction"
        },
        actions: [
            "National medical mobilization",
            "Deploy mobile power plants",
            "Supply via large tankers",
            "Emergency logistics operations"
        ],
        color: "#FF3300"
    },
    {
        level: 4,
        name: "LEVEL 4",
        diameter: "144-170 km",
        temperature: "1727-2227°C",
        impacts: {
            infrastructure: "Widespread destruction, multiple failures",
            health: "Mass casualties, humanitarian crisis",
            energy: "Generation capacity loss",
            water: "Major supply system destruction"
        },
        actions: [
            "International aid request",
            "International medical deployment",
            "Energy imports, temporary plants",
            "Emergency supply programs"
        ],
        color: "#CC0000"
    },
    {
        level: 5,
        name: "LEVEL 5",
        diameter: "170-180 km",
        temperature: "2227-2727°C",
        impacts: {
            infrastructure: "Massive urban center destruction",
            health: "Thousands dead, millions displaced",
            energy: "Extensive infrastructure destruction",
            water: "Watershed destruction, mass contamination"
        },
        actions: [
            "Sustained multinational response",
            "Massive rescue operations",
            "Strategic energy recovery",
            "Large-scale emergency food ops"
        ],
        color: "#660000"
    }
];

/**
 * Calculate overpressure from blast wave at a given distance
 * Formula: P = 10 * (E^0.33 / R)^1.5
 * Where P = overpressure (psi), E = energy (megatons), R = distance (km)
 * @param {number} energyMegatons - Impact energy in megatons
 * @param {number} distanceKm - Distance from impact in kilometers
 * @returns {number} Overpressure in psi
 */
function calculateOverpressure(energyMegatons, distanceKm) {
    if (distanceKm <= 0) return Infinity;
    const scaledDistance = Math.pow(energyMegatons, 0.33) / distanceKm;
    const overpressure = 10 * Math.pow(scaledDistance, 1.5);
    return overpressure;
}

/**
 * Convert overpressure (psi) to sound pressure level (dB SPL)
 * Formula: dB = 20 * log10(P / P_ref)
 * Where P_ref = 2.9 × 10^-9 psi (reference pressure)
 * @param {number} overpressurePsi - Overpressure in psi
 * @returns {number} Sound pressure level in dB SPL
 */
function overpressureToDecibels(overpressurePsi) {
    const P_ref = 2.9e-9; // Reference pressure in psi
    if (overpressurePsi <= 0) return 0;
    return 20 * Math.log10(overpressurePsi / P_ref);
}

/**
 * Classify shock wave severity based on calculated overpressure
 * @param {number} energyMegatons - Impact energy
 * @param {number} totalDestructionZone - Radius of total destruction in km
 * @returns {object} Shock wave classification
 */
function classifyShockWave(energyMegatons, totalDestructionZone) {
    // Calculate overpressure at destruction zone edge
    const overpressure = calculateOverpressure(energyMegatons, totalDestructionZone);
    const decibels = overpressureToDecibels(overpressure);
    
    // Find matching shock wave level
    let matchedLevel = SHOCK_WAVE_LEVELS[0];
    for (const level of SHOCK_WAVE_LEVELS) {
        // Validate that level.range exists and is a string
        if (!level.range || typeof level.range !== 'string') {
            continue;
        }
        
        // Extract minimum dB from range (e.g., "< 140 dB" -> 140)
        const dbMatch = level.range.match(/(\d+)/);
        if (dbMatch) {
            const minDb = parseInt(dbMatch[1]);
            if (decibels >= minDb) {
                matchedLevel = level;
            }
        }
    }
    
    return {
        level: matchedLevel.level,
        name: matchedLevel.name,
        range: matchedLevel.range,
        decibels: Math.round(decibels),
        overpressure: overpressure.toFixed(2),
        impacts: matchedLevel.impacts,
        actions: matchedLevel.actions,
        color: matchedLevel.color
    };
}

/**
 * Classify seismic severity based on earthquake magnitude
 * @param {number} magnitude - Earthquake magnitude (Richter scale)
 * @returns {object} Seismic classification
 */
function classifySeismic(magnitude) {
    let matchedLevel = SEISMIC_LEVELS[0];
    
    for (const level of SEISMIC_LEVELS) {
        // Extract range bounds (e.g., "5.0 - 5.9" -> [5.0, 5.9])
        const rangeMatch = level.magnitudeRange.match(/(\d+\.\d+)\s*-\s*(\d+\.\d+)/);
        if (rangeMatch) {
            const minMag = parseFloat(rangeMatch[1]);
            const maxMag = parseFloat(rangeMatch[2]);
            if (magnitude >= minMag && magnitude <= maxMag) {
                matchedLevel = level;
                break;
            }
        } else if (level.magnitudeRange.includes('≥')) {
            // Handle "≥ 8.0" case
            const minMag = parseFloat(level.magnitudeRange.match(/(\d+\.\d+)/)[1]);
            if (magnitude >= minMag) {
                matchedLevel = level;
                break;
            }
        } else if (level.magnitudeRange.includes('-')) {
            // Handle "3.0 - 4.9" case
            const parts = level.magnitudeRange.split('-').map(s => parseFloat(s.trim()));
            if (magnitude >= parts[0] && magnitude <= parts[1]) {
                matchedLevel = level;
                break;
            }
        }
    }
    
    return {
        level: matchedLevel.level,
        name: matchedLevel.name,
        magnitudeRange: matchedLevel.magnitudeRange,
        actualMagnitude: magnitude.toFixed(1),
        impacts: matchedLevel.impacts,
        actions: matchedLevel.actions,
        color: matchedLevel.color
    };
}

/**
 * Classify thermal radiation severity based on fire radius
 * @param {number} thermalRadius - Thermal radiation radius in km
 * @returns {object} Thermal classification
 */
function classifyThermal(thermalRadius) {
    let matchedLevel = THERMAL_LEVELS[0];
    
    for (const level of THERMAL_LEVELS) {
        // Extract range bounds from diameter range
        if (level.thermalDiameter.includes('-')) {
            const parts = level.thermalDiameter.match(/(\d+)\s*-\s*(\d+)/);
            if (parts) {
                const minDiameter = parseInt(parts[1]);
                const maxDiameter = parseInt(parts[2]);
                const actualDiameter = thermalRadius * 2;
                if (actualDiameter >= minDiameter && actualDiameter <= maxDiameter) {
                    matchedLevel = level;
                    break;
                }
            }
        } else if (level.thermalDiameter.includes('≤')) {
            const maxDiameter = parseInt(level.thermalDiameter.match(/(\d+)/)[1]);
            if (thermalRadius * 2 <= maxDiameter) {
                matchedLevel = level;
                break;
            }
        } else if (level.thermalDiameter.includes('>')) {
            const minDiameter = parseInt(level.thermalDiameter.match(/(\d+)/)[1]);
            if (thermalRadius * 2 > minDiameter) {
                matchedLevel = level;
                break;
            }
        }
    }
    
    return {
        level: matchedLevel.level,
        name: matchedLevel.name,
        thermalDiameter: matchedLevel.thermalDiameter,
        actualRadius: thermalRadius.toFixed(1),
        actualDiameter: (thermalRadius * 2).toFixed(1),
        temperatureRange: matchedLevel.temperatureRange,
        impacts: matchedLevel.impacts,
        actions: matchedLevel.actions,
        color: matchedLevel.color
    };
}

/**
 * Classify infrastructure damage based on Overpass data
 * @param {object} overpassData - Infrastructure data from Overpass API
 * @returns {object} Infrastructure classification
 */
function classifyInfrastructure(overpassData) {
    const critical = {
        hospitals: 0,
        fireStations: 0,
        police: 0,
        schools: 0,
        fuelStations: 0
    };
    
    const total = {
        buildings: overpassData.buildings || 0,
        amenities: overpassData.amenities?.length || 0,
        population: overpassData.totalPopulation || 0
    };
    
    // Count critical facilities
    if (overpassData.amenities) {
        for (const amenity of overpassData.amenities) {
            switch (amenity.criticality) {
                case 'CRITICAL':
                    if (amenity.type.includes('hospital')) critical.hospitals++;
                    if (amenity.type.includes('fire_station')) critical.fireStations++;
                    if (amenity.type.includes('police')) critical.police++;
                    break;
                case 'HIGH':
                    if (amenity.type.includes('school')) critical.schools++;
                    if (amenity.type.includes('fuel')) critical.fuelStations++;
                    break;
            }
        }
    }
    
    // Determine severity based on population and critical facilities
    let severity = 'MINIMAL';
    let triageLevel = 1;
    let color = '#00AA00';
    
    if (total.population > 100000 || critical.hospitals > 5) {
        severity = 'CATASTROPHIC';
        triageLevel = 5;
        color = '#660000';
    } else if (total.population > 50000 || critical.hospitals > 3) {
        severity = 'CRITICAL';
        triageLevel = 4;
        color = '#CC0000';
    } else if (total.population > 10000 || critical.hospitals > 1) {
        severity = 'MAJOR';
        triageLevel = 3;
        color = '#FF6600';
    } else if (total.population > 1000 || critical.hospitals > 0) {
        severity = 'MODERATE';
        triageLevel = 2;
        color = '#FFAA00';
    }
    
    return {
        severity,
        triageLevel,
        color,
        total,
        critical,
        affectedPopulation: total.population.toLocaleString(),
        criticalFacilitiesCount: Object.values(critical).reduce((a, b) => a + b, 0)
    };
}

/**
 * Generate priority actions list based on all severity classifications
 * @param {object} shockWave - Shock wave classification
 * @param {object} seismic - Seismic classification
 * @param {object} thermal - Thermal classification
 * @param {object} infrastructure - Infrastructure classification
 * @returns {array} List of priority actions
 */
function generatePriorityActions(shockWave, seismic, thermal, infrastructure) {
    const actions = new Set();
    
    // Add actions from each severity matrix
    shockWave.actions.forEach(action => actions.add(action));
    seismic.actions.forEach(action => actions.add(action));
    thermal.actions.forEach(action => actions.add(action));
    
    // Add infrastructure-specific actions
    if (infrastructure.critical.hospitals > 0) {
        actions.add(`Secure ${infrastructure.critical.hospitals} hospital(s) in impact zone`);
    }
    if (infrastructure.critical.fireStations > 0) {
        actions.add(`Coordinate with ${infrastructure.critical.fireStations} fire station(s)`);
    }
    if (infrastructure.critical.police > 0) {
        actions.add(`Deploy emergency services from ${infrastructure.critical.police} police station(s)`);
    }
    if (infrastructure.critical.schools > 0) {
        actions.add(`Evacuate ${infrastructure.critical.schools} school(s)`);
    }
    
    // Add population-based actions
    if (infrastructure.total.population > 10000) {
        actions.add('Mass evacuation protocol');
        actions.add('Establish multiple emergency shelters');
    } else if (infrastructure.total.population > 1000) {
        actions.add('Coordinate local evacuation');
        actions.add('Establish emergency shelter');
    }
    
    return Array.from(actions);
}

/**
 * Main classification function - analyzes simulation effects and infrastructure
 * @param {object} effects - Calculated effects from calculations.js
 * @param {object} overpassData - Infrastructure data from overpass.js
 * @returns {object} Complete severity classification
 */
export function classifySimulationEffects(effects, overpassData) {
    // Classify each severity dimension
    const shockWave = classifyShockWave(
        effects.energyMegatons,
        effects.totalDestructionZone
    );
    
    const seismic = classifySeismic(effects.earthquake.magnitude);
    
    const thermal = classifyThermal(effects.fire.radius);
    
    const infrastructure = classifyInfrastructure(overpassData);
    
    // Determine overall severity (highest level among all categories)
    const maxLevel = Math.max(
        shockWave.level,
        seismic.level,
        thermal.level,
        infrastructure.triageLevel
    );
    
    const triageLevel = TRIAGE_LEVELS.find(t => t.level === maxLevel) || TRIAGE_LEVELS[0];
    
    // Generate comprehensive priority actions
    const priorityActions = generatePriorityActions(
        shockWave,
        seismic,
        thermal,
        infrastructure
    );
    
    return {
        overallSeverity: triageLevel,
        shockWave,
        seismic,
        thermal,
        infrastructure,
        priorityActions,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate HTML report from classification results
 * @param {object} classification - Classification results
 * @returns {string} HTML string for severity report
 */
export function generateSeverityReport(classification) {
    const { overallSeverity, shockWave, seismic, thermal, infrastructure, priorityActions } = classification;
    
    return `
        <div class="severity-report">
            <div class="overall-triage" style="border-color: ${overallSeverity.color}; background: ${overallSeverity.color}22;">
                <div class="triage-badge" style="background: ${overallSeverity.color};">
                    TRIAGE LEVEL ${overallSeverity.level}
                </div>
                <div class="triage-info">
                    <h3>${overallSeverity.name}</h3>
                    <p class="attention-time">Attention Required: ${overallSeverity.attentionTime}</p>
                </div>
            </div>
            
            <div class="severity-categories">
                <div class="severity-section shock-wave-section">
                    <h3 style="color: ${shockWave.color};">
                        <i class="fas fa-wind"></i> Shock Wave Analysis
                    </h3>
                    <div class="severity-details">
                        <div class="detail-row">
                            <span class="label">Severity Level:</span>
                            <span class="value" style="color: ${shockWave.color}; font-weight: bold;">
                                ${shockWave.name} (Level ${shockWave.level})
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Sound Pressure:</span>
                            <span class="value">${shockWave.decibels} dB SPL</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Overpressure:</span>
                            <span class="value">${shockWave.overpressure} psi</span>
                        </div>
                        <div class="impacts-grid">
                            ${Object.entries(shockWave.impacts).map(([sector, impact]) => `
                                <div class="impact-item">
                                    <strong>${sector}:</strong> ${impact}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="severity-section seismic-section">
                    <h3 style="color: ${seismic.color};">
                        <i class="fas fa-house-crack"></i> Seismic Analysis
                    </h3>
                    <div class="severity-details">
                        <div class="detail-row">
                            <span class="label">Severity Level:</span>
                            <span class="value" style="color: ${seismic.color}; font-weight: bold;">
                                ${seismic.name} (Level ${seismic.level})
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Magnitude:</span>
                            <span class="value">${seismic.actualMagnitude} Richter</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Range:</span>
                            <span class="value">${seismic.magnitudeRange}</span>
                        </div>
                        <div class="impacts-grid">
                            ${Object.entries(seismic.impacts).map(([sector, impact]) => `
                                <div class="impact-item">
                                    <strong>${sector}:</strong> ${impact}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="severity-section thermal-section">
                    <h3 style="color: ${thermal.color};">
                        <i class="fas fa-fire"></i> Thermal Analysis
                    </h3>
                    <div class="severity-details">
                        <div class="detail-row">
                            <span class="label">Severity Level:</span>
                            <span class="value" style="color: ${thermal.color}; font-weight: bold;">
                                ${thermal.name} (Level ${thermal.level})
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Thermal Radius:</span>
                            <span class="value">${thermal.actualRadius} km</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Thermal Diameter:</span>
                            <span class="value">${thermal.actualDiameter} km</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Temperature:</span>
                            <span class="value">${thermal.temperatureRange}</span>
                        </div>
                        <div class="impacts-grid">
                            ${Object.entries(thermal.impacts).map(([sector, impact]) => `
                                <div class="impact-item">
                                    <strong>${sector}:</strong> ${impact}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="infrastructure-analysis">
                <h3 style="color: ${infrastructure.color};">
                    <i class="fas fa-city"></i> Infrastructure Impact Assessment
                </h3>
                <div class="infrastructure-stats">
                    <div class="stat-card">
                        <div class="stat-value">${infrastructure.affectedPopulation}</div>
                        <div class="stat-label">Affected Population</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${infrastructure.total.buildings.toLocaleString()}</div>
                        <div class="stat-label">Buildings in Zone</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${infrastructure.criticalFacilitiesCount}</div>
                        <div class="stat-label">Critical Facilities</div>
                    </div>
                </div>
                <div class="critical-facilities">
                    <h4>Critical Facilities Breakdown:</h4>
                    <ul>
                        ${infrastructure.critical.hospitals > 0 ? `<li><i class="fas fa-hospital"></i> Hospitals: ${infrastructure.critical.hospitals}</li>` : ''}
                        ${infrastructure.critical.fireStations > 0 ? `<li><i class="fas fa-fire-extinguisher"></i> Fire Stations: ${infrastructure.critical.fireStations}</li>` : ''}
                        ${infrastructure.critical.police > 0 ? `<li><i class="fas fa-shield-halved"></i> Police Stations: ${infrastructure.critical.police}</li>` : ''}
                        ${infrastructure.critical.schools > 0 ? `<li><i class="fas fa-school"></i> Schools: ${infrastructure.critical.schools}</li>` : ''}
                        ${infrastructure.critical.fuelStations > 0 ? `<li><i class="fas fa-gas-pump"></i> Fuel Stations: ${infrastructure.critical.fuelStations}</li>` : ''}
                        ${infrastructure.criticalFacilitiesCount === 0 ? '<li>No critical facilities detected in impact zone</li>' : ''}
                    </ul>
                </div>
            </div>
            
            <div class="priority-actions">
                <h3><i class="fas fa-list-check"></i> Priority Response Actions</h3>
                <ul class="actions-list">
                    ${priorityActions.map(action => `
                        <li><i class="fas fa-chevron-right"></i> ${action}</li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}