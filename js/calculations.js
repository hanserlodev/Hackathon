class ImpactCalculations {
    constructor() {
        // Material densities in kg/m³ (more precise)
        this.densityValues = {
            iron: 7800,      // Iron meteorite
            stone: 3300,     // Stony meteorite (chondrite)
            ice: 917,        // Ice/comet
            gold: 19300,     // Gold (theoretical)
            comet: 500,      // Comet nucleus (porous ice/rock)
            carbon: 2260,    // Carbonaceous chondrite
            concrete: 2400,  // Infrastructure
            wood: 800,       // Wooden structures
            water: 1000,     // Water density
        };

        // Physical constants
        this.GRAVITY = 9.81; // m/s² (Earth surface gravity)
        this.AIR_DENSITY_SEA_LEVEL = 1.225; // kg/m³
        this.SCALE_HEIGHT = 8500; // m (atmospheric scale height)
        this.SOUND_SPEED = 340; // m/s (speed of sound in air)
        
        // Target properties (Earth's crust)
        this.TARGET_DENSITY = 2700; // kg/m³ (typical crustal rock)
        this.TARGET_STRENGTH = 65e6; // Pa (compressive strength of granite)
        
        // Crater scaling parameters (Holsapple & Schmidt, 1987)
        this.CRATER_SCALING = {
            gravity: {
                K1: 0.132,  // Crater formation constant
                mu: 0.41,   // Coupling parameter
                nu: 0.40    // Crater growth exponent
            },
            strength: {
                K2: 0.26,
                mu: 0.41,
                nu: 0.40
            }
        };
    }

    // Calculate atmospheric entry effects (Passey & Melosh, 1980)
    calculateAtmosphericEntry(diameter, velocity, density, angle) {
        const mass = this.calculateMass(diameter, density);
        const velocityMs = velocity * 1000; // km/s to m/s
        
        // Ballistic coefficient (kg/m²)
        const crossSection = Math.PI * Math.pow(diameter / 2, 2);
        const ballisticCoeff = mass / crossSection;
        
        // Entry angle factor (sine for oblique entry)
        const angleRad = angle * Math.PI / 180;
        const sinAngle = Math.sin(angleRad);
        
        // Atmospheric density at impact altitude (exponential atmosphere)
        const impactAltitude = 0; // Sea level
        const airDensity = this.AIR_DENSITY_SEA_LEVEL * Math.exp(-impactAltitude / this.SCALE_HEIGHT);
        
        // Drag coefficient for sphere (~0.5)
        const dragCoeff = 0.47;
        
        // Velocity loss due to atmospheric drag
        // Using simplified Collins et al. (2005) approach
        const H = this.SCALE_HEIGHT * sinAngle;
        const dragParameter = (dragCoeff * airDensity * H) / (2 * ballisticCoeff * sinAngle);
        
        // Final velocity after atmospheric passage
        let finalVelocity = velocityMs;
        if (dragParameter < 1) {
            finalVelocity = velocityMs * Math.sqrt(1 - dragParameter);
        } else {
            // Object breaks up in atmosphere (airburst)
            finalVelocity = Math.sqrt(2 * this.GRAVITY * H); // Terminal velocity
        }
        
        // Energy loss due to atmospheric passage
        const initialKE = 0.5 * mass * Math.pow(velocityMs, 2);
        const finalKE = 0.5 * mass * Math.pow(finalVelocity, 2);
        const energyLoss = initialKE - finalKE;
        
        return {
            finalVelocity: finalVelocity / 1000, // Convert back to km/s
            finalKE,
            energyLoss,
            airburst: dragParameter >= 1,
            altitude: dragParameter >= 1 ? H * (1 - 1/dragParameter) : 0
        };
    }

    // Calculate meteorite mass (kg)
    calculateMass(diameter, density) {
        const radius = diameter / 2; // meters
        const volume = (4 / 3) * Math.PI * Math.pow(radius, 3); // m³
        return volume * density; // kg
    }

    // Calculate kinetic energy with atmospheric effects
    calculateKineticEnergy(mass, velocity, diameter, density, angle) {
        // Get atmospheric entry effects
        const entry = this.calculateAtmosphericEntry(diameter, velocity, density, angle);
        
        // Return final kinetic energy at impact
        return entry.finalKE;
    }

    // Convert energy to megatons of TNT (1 MT = 4.184 × 10^15 J)
    joulesToMegatons(joules) {
        return joules / 4.184e15;
    }

    // Normalize to megatons
    normalizeMegatons(energyJoules, precomputedMegatons = null) {
        return typeof precomputedMegatons === 'number'
            ? precomputedMegatons
            : this.joulesToMegatons(energyJoules);
    }

    // Calculate crater diameter using Holsapple & Schmidt (1987) scaling laws
    calculateCraterDiameter(diameter, velocity, density, angle, energyJoules) {
        const velocityMs = velocity * 1000; // km/s to m/s
        const mass = this.calculateMass(diameter, density);
        
        // Impact angle effect on crater size
        const angleRad = angle * Math.PI / 180;
        const sinAngle = Math.sin(angleRad);
        const angleEffect = Math.pow(sinAngle, 1/3); // Crater scales with sin^(1/3)(θ)
        
        // Gravity regime (for large craters)
        const gScaling = this.CRATER_SCALING.gravity;
        
        // Effective impact velocity (accounting for angle)
        const vEff = velocityMs * sinAngle;
        
        // Projectile kinetic energy per unit mass
        const energyPerMass = 0.5 * Math.pow(vEff, 2);
        
        // Crater diameter in gravity regime (Holsapple, 1993)
        // D = K * (m/ρ_t)^(1/3) * (v² / (g*L))^μ
        const projectileVolume = mass / density;
        const projectileLength = Math.pow(projectileVolume, 1/3);
        
        const pi2 = (mass / this.TARGET_DENSITY) * Math.pow(energyPerMass / (this.GRAVITY * projectileLength), gScaling.mu);
        const craterVolume = gScaling.K1 * pi2;
        
        // Final crater diameter (assuming crater depth = 1/5 diameter for complex craters)
        const craterDiameter = 2 * Math.pow((3 * craterVolume) / (Math.PI * 0.2), 1/3);
        
        // Apply angle effect
        const finalCraterDiameter = craterDiameter * angleEffect / 1000; // Convert to km
        
        return Math.max(finalCraterDiameter, diameter / 1000 * 20); // Minimum 20x projectile diameter
    }

    // Calculate blast overpressure zones (Glasstone & Dolan, 1977)
    calculateBlastZones(energyMegatons) {
        // Scaling law: R = C * E^(1/3) where E is in megatons
        const E_third = Math.pow(energyMegatons, 1/3);
        
        return {
            // 20 psi - Total destruction (100% fatalities)
            totalDestruction: 0.28 * E_third,
            // 10 psi - Severe destruction (50-90% fatalities)
            severeDestruction: 0.40 * E_third,
            // 5 psi - Moderate destruction (10-50% fatalities)
            moderateDestruction: 0.71 * E_third,
            // 2 psi - Light destruction (casualties from debris)
            lightDestruction: 1.27 * E_third,
            // 1 psi - Broken windows, minor injuries
            glassBreakage: 2.20 * E_third
        };
    }

    // Estimate casualties with infrastructure effects (Collins et al., 2005)
    estimateCasualtiesWithInfrastructure(energyJoules, populationDensity, distance, densityKey, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const zones = this.calculateBlastZones(megatons);
        
        // Calculate casualties in each zone
        const totalArea = Math.PI * Math.pow(zones.totalDestruction, 2);
        const severeArea = Math.PI * (Math.pow(zones.severeDestruction, 2) - Math.pow(zones.totalDestruction, 2));
        const moderateArea = Math.PI * (Math.pow(zones.moderateDestruction, 2) - Math.pow(zones.severeDestruction, 2));
        const lightArea = Math.PI * (Math.pow(zones.lightDestruction, 2) - Math.pow(zones.moderateDestruction, 2));
        
        // Fatality rates by zone
        const totalFatalities = totalArea * populationDensity * 0.98;
        const severeFatalities = severeArea * populationDensity * 0.75;
        const moderateFatalities = moderateArea * populationDensity * 0.30;
        const lightFatalities = lightArea * populationDensity * 0.05;
        
        const totalFatalityCount = totalFatalities + severeFatalities + moderateFatalities + lightFatalities;
        
        // Injuries (typically 2-4x fatalities in disaster zones)
        const injuries = totalFatalityCount * 2.8;
        
        return {
            fatalities: Math.round(totalFatalityCount),
            injuries: Math.round(injuries),
            totalAffected: Math.round(totalFatalityCount + injuries),
            zones
        };
    }

    // Calculate destruction zones
    calculateTotalDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const zones = this.calculateBlastZones(megatons);
        return zones.totalDestruction; // km
    }

    // Estimate casualties based on impact zone
    estimateCasualties(energyJoules, populationDensity, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const totalDestructionRadius = this.calculateTotalDestructionZone(energyJoules, megatons);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energyJoules, megatons);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energyJoules, megatons);

        const totalDestructionArea = Math.PI * Math.pow(totalDestructionRadius, 2);
        const severeDestructionArea = Math.PI * Math.pow(severeDestructionRadius, 2);
        const moderateDestructionArea = Math.PI * Math.pow(moderateDestructionRadius, 2);

        const fatalitiesTotal = totalDestructionArea * populationDensity * 0.95;
        const fatalitiesSevere = (severeDestructionArea - totalDestructionArea) * populationDensity * 0.5;
        const fatalitiesModerate = (moderateDestructionArea - severeDestructionArea) * populationDensity * 0.1;

        const totalFatalities = fatalitiesTotal + fatalitiesSevere + fatalitiesModerate;
        const injuries = totalFatalities * 3;

        return {
            fatalities: Math.round(totalFatalities),
            injuries: Math.round(injuries),
            totalAffected: Math.round(totalFatalities + injuries),
        };
    }

    // Calculate earthquake magnitude (Richter scale) - Kanamori (1977)
    // M = (2/3) * log10(E) - 6.0, where E is in ergs
    calculateEarthquakeMagnitude(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const ergs = energyJoules * 1e7; // Convert joules to ergs
        
        // Only ~0.1-1% of impact energy converts to seismic energy
        const seismicEfficiency = 0.005;
        const seismicEnergy = ergs * seismicEfficiency;
        
        // Richter magnitude formula
        const magnitude = (2/3) * Math.log10(seismicEnergy) - 6.0;
        
        return Math.max(magnitude, 0);
    }

    // Calculate seismic wave radius (surface waves - Rayleigh & Love waves)
    // Based on wave attenuation and ground motion amplitude
    calculateSeismicRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const magnitude = this.calculateEarthquakeMagnitude(energyJoules, megatons);
        
        // Modified Mercalli Intensity (MMI) scaling
        // Distance where shaking is still felt (MMI III-IV)
        // log10(R) = 0.53*M - 0.18 (empirical formula)
        const radiusKm = Math.pow(10, 0.53 * magnitude - 0.18);
        
        // Surface wave propagation (Rayleigh waves travel ~3.5 km/s)
        // Detectable at distances where amplitude > threshold
        // A(r) = A0 * (r0/r)^n * exp(-α*r) where n≈0.5 for surface waves
        
        // Maximum detectable distance (seismograph threshold)
        const maxRadius = Math.pow(megatons, 0.35) * 150;
        
        return Math.min(radiusKm, maxRadius);
    }

    // Calculate tsunami height (Ward & Asphaug, 2000)
    // For ocean impacts only
    calculateTsunamiHeight(energyJoules, energyMegatons = null, waterDepth = 4000, isOceanImpact = false) {
        if (!isOceanImpact) {
            return 0; // No tsunami for land impacts
        }
        
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const energy = energyJoules;
        
        // Tsunami amplitude scaling (Ward & Asphaug, 2000)
        // A ≈ (E / (ρ * g * d^2))^(1/4) * d
        const rho = 1025; // seawater density kg/m³
        const g = this.GRAVITY;
        
        // Energy coupled to tsunami (~10% of impact energy)
        const tsunamiEnergy = energy * 0.1;
        
        // Initial amplitude near impact
        const amplitude = Math.pow(tsunamiEnergy / (rho * g * Math.pow(waterDepth, 2)), 0.25) * waterDepth;
        
        // Coastal amplification factor (2-5x due to shoaling)
        const amplificationFactor = 3.5;
        
        const tsunamiHeight = (amplitude / 1000) * amplificationFactor; // Convert to meters
        
        return Math.max(tsunamiHeight, 1);
    }

    // Calculate tsunami propagation radius (deep water wave speed)
    // v = sqrt(g * h) where h is ocean depth
    calculateTsunamiRadius(energyJoules, energyMegatons = null, isOceanImpact = false) {
        if (!isOceanImpact) {
            return 0;
        }
        
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const tsunamiHeight = this.calculateTsunamiHeight(energyJoules, megatons, 4000, true);
        
        // Tsunami propagation in deep water
        // Speed: v = sqrt(g * d) ≈ 200 m/s for 4000m depth
        const deepWaterSpeed = Math.sqrt(this.GRAVITY * 4000); // m/s
        
        // Energy decay with distance: H(r) = H0 * sqrt(r0/r)
        // Damaging threshold: ~2m height
        const damagingThreshold = 2.0; // meters
        
        // Solve: 2 = H0 * sqrt(r0/r) → r = r0 * (H0/2)^2
        const r0 = 10; // km (reference distance from impact)
        const maxRadius = r0 * Math.pow(tsunamiHeight / damagingThreshold, 2);
        
        // Limit to realistic values (trans-oceanic ~10,000 km)
        return Math.min(maxRadius, 10000);
    }

    // Calculate thermal radiation fire radius (Glasstone & Dolan, 1977)
    // Based on thermal fluence needed to ignite materials (~10 cal/cm²)
    calculateFireRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        
        // Thermal radiation is ~35% of total yield
        const thermalYield = megatons * 0.35;
        
        // Scaling law for thermal effects: R = C * Y^0.41
        // For 10 cal/cm² (material ignition threshold)
        const fireRadius = 0.92 * Math.pow(thermalYield, 0.41);
        
        return Math.max(fireRadius, 0.5); // Minimum 500m
    }

    // Calculate ejecta cloud radius (Toon et al., 1997)
    // Based on impact ejecta plume dynamics
    calculateDustCloudRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        
        // Ejecta mass scales with crater volume
        // M_ejecta ≈ ρ * V_crater
        const craterVolumeFactor = Math.pow(megatons, 0.88); // Empirical scaling
        
        // Ejecta curtain radius (Melosh, 1989)
        // Extends to ~3-5x crater radius
        const ejectaRadius = Math.pow(megatons, 0.33) * 18;
        
        // Atmospheric dust plume can extend much further
        // Global distribution for E > 10^6 MT
        if (megatons > 1e6) {
            return 20000; // Global distribution (km)
        } else if (megatons > 1000) {
            return Math.pow(megatons, 0.4) * 50; // Continental scale
        }
        
        return Math.max(ejectaRadius, 5); // Minimum 5km
    }

    // Calculate global climate effects
    calculateGlobalClimateEffects(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const climateEffects = {
            temperatureDrop: 0,
            duration: 0,
            globalImpact: false,
        };

        if (megatons > 1000) {
            climateEffects.globalImpact = true;
            climateEffects.temperatureDrop = Math.log10(megatons) * 2;
            climateEffects.duration = Math.log10(megatons) * 2;
        } else if (megatons > 100) {
            climateEffects.temperatureDrop = Math.log10(megatons) * 1;
            climateEffects.duration = Math.log10(megatons) * 1;
        }

        return climateEffects;
    }

    // Calculate survival probability
    calculateSurvivalProbability(distance, energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const totalDestructionRadius = this.calculateTotalDestructionZone(energyJoules, megatons);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energyJoules, megatons);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energyJoules, megatons);

        if (distance <= totalDestructionRadius) {
            return 0.05;
        } else if (distance <= severeDestructionRadius) {
            return 0.5;
        } else if (distance <= moderateDestructionRadius) {
            return 0.9;
        }
        return 0.98;
    }

    // Calculate secondary effect timing
    calculateSecondaryEffectTiming(energyJoules, distance, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return {
            earthquake: 0,
            tsunami: distance / 200,
            fire: Math.sqrt(distance) * 0.1,
            dust: distance / 50,
            climate: 365 * Math.log10(Math.max(megatons, 1)),
        };
    }

    // Main function to calculate all effects
    calculateAllEffects(diameter, velocity, densityKey, angle = 45, populationDensity = 1000, isOceanImpact = false) {
        const materialDensity = this.densityValues[densityKey] ?? this.densityValues.stone;
        const mass = this.calculateMass(diameter, materialDensity);
        
        // Calculate kinetic energy with atmospheric entry effects
        const energy = this.calculateKineticEnergy(mass, velocity, diameter, materialDensity, angle);
        const energyMegatons = this.joulesToMegatons(energy);
        
        // Get atmospheric entry details
        const atmosphericEntry = this.calculateAtmosphericEntry(diameter, velocity, materialDensity, angle);

        const totalDestructionZone = this.calculateTotalDestructionZone(energy, energyMegatons);
        const earthquakeMagnitude = this.calculateEarthquakeMagnitude(energy, energyMegatons);
        const seismicRadius = this.calculateSeismicRadius(energy, energyMegatons);
        const tsunamiHeight = this.calculateTsunamiHeight(energy, energyMegatons, 4000, isOceanImpact);
        const tsunamiRadius = this.calculateTsunamiRadius(energy, energyMegatons, isOceanImpact);
        const fireRadius = this.calculateFireRadius(energy, energyMegatons);
        const dustCloudRadius = this.calculateDustCloudRadius(energy, energyMegatons);
        const craterDiameter = this.calculateCraterDiameter(diameter, velocity, materialDensity, angle, energy);
        const casualties = this.estimateCasualtiesWithInfrastructure(energy, populationDensity, totalDestructionZone, densityKey, energyMegatons);

        return {
            mass,
            energy,
            energyMegatons,
            craterDiameter,
            casualties,
            totalDestructionZone,
            impactClassification: this.classifyImpact(energyMegatons),
            atmosphericEntry: {
                initialVelocity: velocity,
                finalVelocity: atmosphericEntry.finalVelocity,
                energyLoss: this.joulesToMegatons(atmosphericEntry.energyLoss),
                airburst: atmosphericEntry.airburst,
                airburstAltitude: atmosphericEntry.altitude
            },
            earthquake: {
                magnitude: earthquakeMagnitude,
                radius: seismicRadius,
                description: this.getEarthquakeDescription(earthquakeMagnitude)
            },
            tsunami: {
                height: tsunamiHeight,
                radius: tsunamiRadius,
                description: this.getTsunamiDescription(tsunamiHeight),
                applicable: isOceanImpact
            },
            fire: {
                radius: fireRadius,
                description: this.getFireDescription(fireRadius)
            },
            dust: {
                radius: dustCloudRadius,
                description: this.getDustDescription(dustCloudRadius)
            }
        };
    }

    getEarthquakeDescription(magnitude) {
        if (magnitude < 3) return 'Negligible';
        if (magnitude < 5) return 'Minor tremors';
        if (magnitude < 6) return 'Moderate damage';
        if (magnitude < 7) return 'Severe damage';
        return 'Catastrophic';
    }

    getTsunamiDescription(height) {
        if (height < 5) return 'Minimal wave';
        if (height < 15) return 'Moderate wave';
        if (height < 30) return 'Dangerous wave';
        return 'Catastrophic wave';
    }

    getFireDescription(radius) {
        if (radius < 5) return 'Localized fires';
        if (radius < 15) return 'Widespread fires';
        if (radius < 30) return 'Massive firestorm';
        return 'Global conflagration';
    }

    getDustDescription(radius) {
        if (radius < 50) return 'Local dust cloud';
        if (radius < 200) return 'Regional obscuration';
        if (radius < 1000) return 'Continental darkness';
        return 'Global atmospheric impact';
    }

    classifyImpact(energyMegatons) {
        if (energyMegatons < 0.001) {
            return { level: 'Local', description: 'Local impact, minor damage.' };
        } else if (energyMegatons < 0.1) {
            return { level: 'Regional', description: 'Regional impact, significant damage.' };
        } else if (energyMegatons < 10) {
            return { level: 'Continental', description: 'Continental impact, massive devastation.' };
        } else if (energyMegatons < 1000) {
            return { level: 'Global', description: 'Global impact, climate change.' };
        }
        return { level: 'Extinction', description: 'Mass extinction event.' };
    }
}

// Expose globally
window.ImpactCalculations = ImpactCalculations;
