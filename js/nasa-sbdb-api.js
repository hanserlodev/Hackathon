/**
 * NASA Small-Body Database (SBDB) API Integration
 * 
 * This module provides access to NASA's Small-Body Database Query Tool and related APIs
 * for retrieving real asteroid and comet data, including:
 * 
 * 1. Small-Body Database Query Tool - Keplerian parameters for NEOs and PHAs
 * 2. Near-Earth Comets Orbital Elements API - Orbital data for 170 NECs
 * 3. Orbital propagation for trajectory simulation
 * 
 * APIs Used:
 * - SBDB API: https://ssd-api.jpl.nasa.gov/doc/sbdb.html
 * - SBDB Query API: https://ssd-api.jpl.nasa.gov/doc/sbdb_query.html
 * - NEC Orbital Elements: https://data.nasa.gov/Space-Science/Near-Earth-Comets-Orbital-Elements/b67r-rgxc
 * 
 * References:
 * - Eyes on Asteroids (JPL): https://eyes.nasa.gov/apps/asteroids/
 * - Elliptical Orbit Simulator Tutorial: NASA/JPL educational resources
 */

import { KNOWN_ASTEROIDS, enhanceAsteroidData } from './known-asteroids.js';

// API Endpoints - Using Flask proxy to avoid CORS issues
const NASA_SBDB_API = '/api/sbdb';
const NASA_SBDB_QUERY_API = '/api/sbdb_query';
const NASA_NEC_API = 'https://data.nasa.gov/resource/b67r-rgxc.json';

/**
 * Fetch detailed information about a specific asteroid from SBDB
 * @param {string} designation - SPK-ID, IAU number, or designation (e.g., "433", "2019 OK", "Apophis")
 * @returns {Promise<object>} Asteroid data including orbit, physical properties, and close approaches
 */
export async function getAsteroidData(designation) {
    try {
        // Use Flask proxy to avoid CORS
        const url = `${NASA_SBDB_API}?sstr=${encodeURIComponent(designation)}&full-prec=true`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`SBDB API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract useful information
        const apiData = {
            name: data.object?.fullname || designation,
            spkId: data.object?.spkid,
            type: data.object?.kind || 'asteroid', // Add type field
            neo: data.object?.neo === '1', // Is it a Near-Earth Object?
            pha: data.object?.pha === '1', // Is it Potentially Hazardous?
            
            // Orbital elements (Keplerian parameters)
            orbit: {
                epoch: data.orbit?.epoch, // Julian Date
                eccentricity: parseFloat(data.orbit?.elements?.find(e => e.name === 'e')?.value || 0),
                semiMajorAxis: parseFloat(data.orbit?.elements?.find(e => e.name === 'a')?.value || 0), // AU
                inclination: parseFloat(data.orbit?.elements?.find(e => e.name === 'i')?.value || 0), // degrees
                ascendingNode: parseFloat(data.orbit?.elements?.find(e => e.name === 'om')?.value || 0), // degrees
                argPerihelion: parseFloat(data.orbit?.elements?.find(e => e.name === 'w')?.value || 0), // degrees
                meanAnomaly: parseFloat(data.orbit?.elements?.find(e => e.name === 'ma')?.value || 0), // degrees
                period: parseFloat(data.orbit?.elements?.find(e => e.name === 'per')?.value || 0), // days
            },
            
            // Physical properties - try multiple sources for diameter
            physical: {
                diameter: parseFloat(
                    data.phys_par?.diameter || 
                    data.object?.diameter || 
                    data.diameter ||
                    (data.orbit?.elements?.find(e => e.name === 'diameter')?.value) ||
                    0
                ), // km
                albedo: parseFloat(data.phys_par?.albedo || data.object?.albedo || 0),
                magnitude: parseFloat(data.phys_par?.H || data.object?.H || 0), // Absolute magnitude
                rotation: parseFloat(data.phys_par?.rot_per || 0), // hours
            },
            
            // Close approach data
            closeApproaches: data.close_approaches || [],
            
            // Raw data for advanced usage
            raw: data
        };
        
        // Enhance with known asteroid data if available
        return enhanceAsteroidData(apiData, designation);
    } catch (error) {
        console.error(`Error fetching asteroid data for "${designation}":`, error);
        throw error;
    }
}

/**
 * Query multiple asteroids with specific criteria
 * @param {object} filters - Query filters
 * @param {string} filters.neo - NEO flag ('1' or 'true' for NEOs)
 * @param {string} filters.pha - PHA flag ('1' or 'true' for PHAs)
 * @param {number} filters.diameterMin - Minimum diameter in km
 * @param {number} filters.diameterMax - Maximum diameter in km
 * @param {number} filters.limit - Maximum number of results (default 100)
 * @returns {Promise<array>} Array of asteroid objects
 */
export async function queryAsteroids(filters = {}) {
    try {
        // Build query conditions
        const conditions = [];
        
        if (filters.neo) {
            conditions.push({ field: 'neo', op: 'EQ', value: '1' });
        }
        
        if (filters.pha) {
            conditions.push({ field: 'pha', op: 'EQ', value: '1' });
        }
        
        if (filters.diameterMin !== undefined) {
            conditions.push({ field: 'diameter', op: 'GT', value: filters.diameterMin.toString() });
        }
        
        if (filters.diameterMax !== undefined) {
            conditions.push({ field: 'diameter', op: 'LT', value: filters.diameterMax.toString() });
        }
        
        // Build query payload
        const payload = {
            fields: ['spkid', 'full_name', 'pdes', 'name', 'neo', 'pha', 'diameter', 'H', 'e', 'a', 'i', 'om', 'w', 'ma', 'per'],
            sb_kind: 'a', // Asteroids only
            sb_cdata: conditions.length > 0 ? { fields: conditions } : undefined,
            limit: filters.limit || 100
        };
        
        const response = await fetch(NASA_SBDB_QUERY_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`SBDB Query API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse results
        const fields = data.fields || [];
        const results = (data.data || []).map(row => {
            const obj = {};
            fields.forEach((field, index) => {
                obj[field] = row[index];
            });
            return {
                spkId: obj.spkid,
                name: obj.full_name || obj.name || obj.pdes,
                designation: obj.pdes,
                neo: obj.neo === '1',
                pha: obj.pha === '1',
                diameter: parseFloat(obj.diameter || 0),
                magnitude: parseFloat(obj.H || 0),
                orbit: {
                    eccentricity: parseFloat(obj.e || 0),
                    semiMajorAxis: parseFloat(obj.a || 0),
                    inclination: parseFloat(obj.i || 0),
                    ascendingNode: parseFloat(obj.om || 0),
                    argPerihelion: parseFloat(obj.w || 0),
                    meanAnomaly: parseFloat(obj.ma || 0),
                    period: parseFloat(obj.per || 0)
                }
            };
        });
        
        return results;
    } catch (error) {
        console.error('Error querying asteroids:', error);
        throw error;
    }
}

/**
 * Get potentially hazardous asteroids (PHAs)
 * @param {number} limit - Maximum number of results
 * @returns {Promise<array>} Array of PHA objects
 */
export async function getPotentiallyHazardousAsteroids(limit = 50) {
    return queryAsteroids({
        pha: true,
        limit: limit
    });
}

/**
 * Get large near-Earth objects (diameter > 1 km)
 * @param {number} limit - Maximum number of results
 * @returns {Promise<array>} Array of large NEO objects
 */
export async function getLargeNEOs(limit = 50) {
    return queryAsteroids({
        neo: true,
        diameterMin: 1.0,
        limit: limit
    });
}

/**
 * Calculate orbital position using Keplerian parameters
 * Based on NASA's Elliptical Orbit Simulator tutorial
 * 
 * @param {object} orbit - Orbital elements
 * @param {number} orbit.a - Semi-major axis (AU)
 * @param {number} orbit.e - Eccentricity
 * @param {number} orbit.i - Inclination (degrees)
 * @param {number} orbit.om - Longitude of ascending node (degrees)
 * @param {number} orbit.w - Argument of perihelion (degrees)
 * @param {number} orbit.ma - Mean anomaly (degrees)
 * @param {number} julianDate - Current Julian Date
 * @returns {object} Position {x, y, z} in AU (heliocentric ecliptic coordinates)
 */
export function calculateOrbitalPosition(orbit, julianDate) {
    const DEG_TO_RAD = Math.PI / 180;
    const AU_TO_KM = 149597870.7; // 1 AU in km
    
    // Convert to radians
    const i = orbit.i * DEG_TO_RAD;
    const om = orbit.om * DEG_TO_RAD;
    const w = orbit.w * DEG_TO_RAD;
    const M = orbit.ma * DEG_TO_RAD;
    
    // Solve Kepler's equation for eccentric anomaly (E)
    let E = M;
    for (let iter = 0; iter < 10; iter++) {
        E = M + orbit.e * Math.sin(E);
    }
    
    // Calculate true anomaly (v)
    const v = 2 * Math.atan2(
        Math.sqrt(1 + orbit.e) * Math.sin(E / 2),
        Math.sqrt(1 - orbit.e) * Math.cos(E / 2)
    );
    
    // Calculate distance (r)
    const r = orbit.a * (1 - orbit.e * Math.cos(E));
    
    // Position in orbital plane
    const xOrb = r * Math.cos(v);
    const yOrb = r * Math.sin(v);
    
    // Rotate to ecliptic coordinates
    const cosOm = Math.cos(om);
    const sinOm = Math.sin(om);
    const cosI = Math.cos(i);
    const sinI = Math.sin(i);
    const cosW = Math.cos(w);
    const sinW = Math.sin(w);
    
    const x = (cosOm * cosW - sinOm * sinW * cosI) * xOrb + 
               (-cosOm * sinW - sinOm * cosW * cosI) * yOrb;
    const y = (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
               (-sinOm * sinW + cosOm * cosW * cosI) * yOrb;
    const z = (sinW * sinI) * xOrb + (cosW * sinI) * yOrb;
    
    return { x, y, z, r };
}

/**
 * Calculate impact velocity for an Earth-intersecting trajectory
 * Uses simplified energy conservation approach
 * 
 * @param {object} orbit - Orbital elements
 * @param {number} earthDistance - Distance from Earth at approach (AU)
 * @returns {number} Impact velocity in km/s
 */
export function estimateImpactVelocity(orbit, earthDistance = 1.0) {
    const AU_TO_KM = 149597870.7;
    const GM_SUN = 1.32712440018e11; // km³/s² (Gravitational parameter of Sun)
    const EARTH_ORBITAL_VELOCITY = 29.78; // km/s
    
    // Vis-viva equation: v² = GM * (2/r - 1/a)
    const r = earthDistance * AU_TO_KM;
    const a = orbit.a * AU_TO_KM;
    
    const velocitySquared = GM_SUN * (2 / r - 1 / a);
    const orbitalVelocity = Math.sqrt(Math.max(0, velocitySquared));
    
    // Relative velocity (simplified - assumes worst case head-on collision)
    const relativeVelocity = Math.sqrt(
        orbitalVelocity * orbitalVelocity + 
        EARTH_ORBITAL_VELOCITY * EARTH_ORBITAL_VELOCITY
    );
    
    return relativeVelocity;
}

/**
 * Fetch near-Earth comets data from NASA Open Data Portal
 * @param {number} limit - Maximum number of results
 * @returns {Promise<array>} Array of NEC objects with orbital elements
 */
export async function getNearEarthComets(limit = 50) {
    try {
        const url = `${NASA_NEC_API}?$limit=${limit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`NEC API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data.map(comet => ({
            name: comet.object_name || comet.object,
            designation: comet.principal_designation || comet.object,
            epoch: comet.epoch_tdb,
            orbit: {
                eccentricity: parseFloat(comet.e || 0),
                perihelionDistance: parseFloat(comet.q_au_1 || 0), // AU
                inclination: parseFloat(comet.i_deg || 0),
                ascendingNode: parseFloat(comet.node_deg || 0),
                argPerihelion: parseFloat(comet.w_deg || 0),
                timePerihelion: parseFloat(comet.tp_tdb || 0),
                period: parseFloat(comet.p_yr || 0) * 365.25 // Convert years to days
            },
            raw: comet
        }));
    } catch (error) {
        console.error('Error fetching near-Earth comets:', error);
        throw error;
    }
}

/**
 * Search for a specific asteroid or comet by name
 * Tries SBDB first, then checks if it's a comet
 * 
 * @param {string} name - Name or designation
 * @returns {Promise<object>} Object data or null if not found
 */
export async function searchSmallBody(name) {
    try {
        // Try SBDB first (asteroids)
        const asteroidData = await getAsteroidData(name);
        return {
            type: 'asteroid',
            ...asteroidData
        };
    } catch (asteroidError) {
        // If asteroid lookup fails, try comets
        try {
            const comets = await getNearEarthComets(170);
            const comet = comets.find(c => 
                c.name.toLowerCase().includes(name.toLowerCase()) ||
                c.designation.toLowerCase().includes(name.toLowerCase())
            );
            
            if (comet) {
                return {
                    type: 'comet',
                    ...comet
                };
            }
        } catch (cometError) {
            console.error('Comet lookup also failed:', cometError);
        }
        
        throw new Error(`Small body "${name}" not found in SBDB or NEC databases`);
    }
}

/**
 * Get famous/notable asteroids and their real data
 * Includes: PHAs, NEOs, famous missions targets, close approachers
 * Expanded to 35+ asteroids from known-asteroids.js database
 * 
 * @returns {Promise<array>} Array of notable asteroid objects
 */
export async function getNotableAsteroids() {
    // Get all designations from KNOWN_ASTEROIDS
    const notableNames = Object.keys(KNOWN_ASTEROIDS);
    
    console.log(`🔄 Loading ${notableNames.length} asteroids from NASA SBDB...`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const designation of notableNames) {
        try {
            const data = await getAsteroidData(designation);
            results.push(data);
            successCount++;
        } catch (error) {
            // If API fails, use known data directly
            const knownData = KNOWN_ASTEROIDS[designation];
            if (knownData) {
                results.push(knownData);
                successCount++;
                console.log(`✅ Using known data for ${knownData.name}`);
            } else {
                failCount++;
                console.warn(`❌ Could not fetch data for ${designation}:`, error.message);
            }
        }
    }
    
    console.log(`✅ Loaded ${successCount}/${notableNames.length} asteroids (${failCount} failed)`);
    
    return results;
}

/**
 * UI Integration: Update famous meteorite selector with real NASA data
 */
export async function updateFamousMeteoriteSelector() {
    const selector = document.getElementById('famous-meteorite-selector');
    if (!selector) return;
    
    console.log('🌠 Fetching real asteroid data from NASA SBDB...');
    
    try {
        const asteroids = await getNotableAsteroids();
        
        // Clear existing options (keep "Custom")
        while (selector.options.length > 1) {
            selector.remove(1);
        }
        
        // Add real asteroid options
        asteroids.forEach(asteroid => {
            const option = document.createElement('option');
            option.value = asteroid.name;
            option.textContent = `${asteroid.name} ${asteroid.pha ? '⚠️ PHA' : ''}`;
            option.dataset.diameter = (asteroid.physical.diameter || 0.5).toFixed(2);
            option.dataset.velocity = estimateImpactVelocity(asteroid.orbit).toFixed(1);
            option.dataset.neo = asteroid.neo;
            option.dataset.pha = asteroid.pha;
            selector.appendChild(option);
        });
        
        console.log(`✅ Loaded ${asteroids.length} real asteroids from NASA SBDB`);
        
    } catch (error) {
        console.error('❌ Error loading NASA asteroid data:', error);
    }
}

// Export all functions
export default {
    getAsteroidData,
    queryAsteroids,
    getPotentiallyHazardousAsteroids,
    getLargeNEOs,
    calculateOrbitalPosition,
    estimateImpactVelocity,
    getNearEarthComets,
    searchSmallBody,
    getNotableAsteroids,
    updateFamousMeteoriteSelector
};
