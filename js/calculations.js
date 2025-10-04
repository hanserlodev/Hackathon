// Cálculos de impacto de meteoritos / Meteor impact calculations.
// Cálculos de impacto de meteoritos / Meteor impact calculations.
class ImpactCalculations {
    constructor() {
        // Densidades de materiales en g/cm³ / Material densities in g/cm³.
        // Densidades de materiales en g/cm³ / Material densities in g/cm³.
        this.densityValues = {
            iron: 7.8,
            stone: 3.0,
            ice: 0.9,
            gold: 19.3,
            comet: 0.0001,
            carbon: 2.2,
        };

        // Multiplicadores de diámetro de cráter / Crater diameter multipliers.
        this.craterMultipliers = {
            iron: 1000,
            stone: 800,
            ice: 600,
            default: 700,
        };
    }

    // Calcular masa del meteorito / Compute meteor mass.
    calculateMass(diameter, density) {
        const radius = diameter / 2; // metros / meters.
        const volume = (4 / 3) * Math.PI * Math.pow(radius, 3); // m³ / Cubic meters.
        const mass = volume * density * 1000; // kg (convertir g/cm³ a kg/m³) / kg (convert g/cm³ to kg/m³).
        const radius = diameter / 2; // metros / meters.
        const volume = (4 / 3) * Math.PI * Math.pow(radius, 3); // m³ / Cubic meters.
        const mass = volume * density * 1000; // kg (convertir g/cm³ a kg/m³) / kg (convert g/cm³ to kg/m³).
        return mass;
    }

    // Calcular energía cinética / Compute kinetic energy.

    // Calcular energía cinética / Compute kinetic energy.
    calculateKineticEnergy(mass, velocity) {
        const velocityMs = velocity * 1000; // Convertir km/s a m/s / Convert km/s to m/s.
        return 0.5 * mass * Math.pow(velocityMs, 2);
        const velocityMs = velocity * 1000; // Convertir km/s a m/s / Convert km/s to m/s.
        return 0.5 * mass * Math.pow(velocityMs, 2);
    }

    // Convertir energía a megatones de TNT / Convert energy to megatons of TNT.

    // Convertir energía a megatones de TNT / Convert energy to megatons of TNT.
    joulesToMegatons(joules) {
        return joules / 4.184e15; // 1 megatón TNT = 4.184e15 J / 1 megaton TNT equals 4.184e15 J.
    }

    // Convertir a megatones reutilizando cálculos previos / Normalize to megatons reusing cached values.
    normalizeMegatons(energyJoules, precomputedMegatons = null) {
        return typeof precomputedMegatons === 'number'
            ? precomputedMegatons
            : this.joulesToMegatons(energyJoules);
    }

    // Calcular diámetro del cráter / Calculate crater diameter.
    calculateCraterDiameter(energyJoules, densityKey, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const multiplier = this.craterMultipliers[densityKey] ?? this.craterMultipliers.default;
        return Math.max(Math.pow(megatons, 0.294) * multiplier, 10);
    }

    // Calcular zona de destrucción total / Calculate total destruction radius.
    calculateTotalDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 2.5; // km / Kilometers.
        return joules / 4.184e15; // 1 megatón TNT = 4.184e15 J / 1 megaton TNT equals 4.184e15 J.
    }

    // Convertir a megatones reutilizando cálculos previos / Normalize to megatons reusing cached values.
    normalizeMegatons(energyJoules, precomputedMegatons = null) {
        return typeof precomputedMegatons === 'number'
            ? precomputedMegatons
            : this.joulesToMegatons(energyJoules);
    }

    // Calcular diámetro del cráter / Calculate crater diameter.
    calculateCraterDiameter(energyJoules, densityKey, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const multiplier = this.craterMultipliers[densityKey] ?? this.craterMultipliers.default;
        return Math.max(Math.pow(megatons, 0.294) * multiplier, 10);
    }

    // Calcular zona de destrucción total / Calculate total destruction radius.
    calculateTotalDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 2.5; // km / Kilometers.
    }

    // Calcular zona de destrucción severa / Calculate severe destruction radius.
    calculateSevereDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 5; // km / Kilometers.

    // Calcular zona de destrucción severa / Calculate severe destruction radius.
    calculateSevereDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 5; // km / Kilometers.
    }

    // Calcular zona de destrucción moderada / Calculate moderate destruction radius.
    calculateModerateDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 10; // km / Kilometers.

    // Calcular zona de destrucción moderada / Calculate moderate destruction radius.
    calculateModerateDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 10; // km / Kilometers.
    }

    // Estimar víctimas basadas en la zona de impacto / Estimate casualties from impact zones.
    estimateCasualties(energyJoules, populationDensity, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const totalDestructionRadius = this.calculateTotalDestructionZone(energyJoules, megatons);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energyJoules, megatons);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energyJoules, megatons);


    // Estimar víctimas basadas en la zona de impacto / Estimate casualties from impact zones.
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


        const fatalitiesTotal = totalDestructionArea * populationDensity * 0.95;
        const fatalitiesSevere = (severeDestructionArea - totalDestructionArea) * populationDensity * 0.5;
        const fatalitiesModerate = (moderateDestructionArea - severeDestructionArea) * populationDensity * 0.1;

        const totalFatalities = fatalitiesTotal + fatalitiesSevere + fatalitiesModerate;
        const injuries = totalFatalities * 3;


        return {
            fatalities: Math.round(totalFatalities),
            injuries: Math.round(injuries),
            totalAffected: Math.round(totalFatalities + injuries),
            totalAffected: Math.round(totalFatalities + injuries),
        };
    }

    // Calcular magnitud del terremoto / Estimate earthquake magnitude.
    calculateEarthquakeMagnitude(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const magnitude = Math.log10(megatons * 4.184e15) / 1.5 - 4.5;
        return Math.max(magnitude, 0);

    // Calcular magnitud del terremoto / Estimate earthquake magnitude.
    calculateEarthquakeMagnitude(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const magnitude = Math.log10(megatons * 4.184e15) / 1.5 - 4.5;
        return Math.max(magnitude, 0);
    }

    // Calcular altura del tsunami / Estimate tsunami height.
    calculateTsunamiHeight(energyJoules, energyMegatons = null, waterDepth = 4000) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);

    // Calcular altura del tsunami / Estimate tsunami height.
    calculateTsunamiHeight(energyJoules, energyMegatons = null, waterDepth = 4000) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        let tsunamiHeight;

        if (megatons < 1) {
            tsunamiHeight = Math.pow(megatons, 0.5) * 10;
        } else if (megatons < 100) {
            tsunamiHeight = Math.pow(megatons, 0.4) * 20;

        if (megatons < 1) {
            tsunamiHeight = Math.pow(megatons, 0.5) * 10;
        } else if (megatons < 100) {
            tsunamiHeight = Math.pow(megatons, 0.4) * 20;
        } else {
            tsunamiHeight = Math.pow(megatons, 0.3) * 50;
            tsunamiHeight = Math.pow(megatons, 0.3) * 50;
        }

        return Math.max(tsunamiHeight, 1);

        return Math.max(tsunamiHeight, 1);
    }

    // Calcular radio de incendios / Calculate fire radius.
    calculateFireRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.max(Math.pow(megatons, 0.33) * 3, 1);

    // Calcular radio de incendios / Calculate fire radius.
    calculateFireRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.max(Math.pow(megatons, 0.33) * 3, 1);
    }

    // Calcular radio de nube de polvo / Calculate dust cloud radius.
    calculateDustCloudRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.max(Math.pow(megatons, 0.33) * 15, 5);

    // Calcular radio de nube de polvo / Calculate dust cloud radius.
    calculateDustCloudRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.max(Math.pow(megatons, 0.33) * 15, 5);
    }

    // Calcular efectos climáticos globales / Estimate global climate effects.
    calculateGlobalClimateEffects(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const climateEffects = {

    // Calcular efectos climáticos globales / Estimate global climate effects.
    calculateGlobalClimateEffects(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const climateEffects = {
            temperatureDrop: 0,
            duration: 0,
            globalImpact: false,
            globalImpact: false,
        };

        if (megatons > 1000) {

        if (megatons > 1000) {
            climateEffects.globalImpact = true;
            climateEffects.temperatureDrop = Math.log10(megatons) * 2;
            climateEffects.duration = Math.log10(megatons) * 2;
        } else if (megatons > 100) {
            climateEffects.temperatureDrop = Math.log10(megatons) * 1;
            climateEffects.duration = Math.log10(megatons) * 1;
            climateEffects.temperatureDrop = Math.log10(megatons) * 2;
            climateEffects.duration = Math.log10(megatons) * 2;
        } else if (megatons > 100) {
            climateEffects.temperatureDrop = Math.log10(megatons) * 1;
            climateEffects.duration = Math.log10(megatons) * 1;
        }


        return climateEffects;
    }

    // Calcular probabilidad de supervivencia / Compute survival probability by distance.
    calculateSurvivalProbability(distance, energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const totalDestructionRadius = this.calculateTotalDestructionZone(energyJoules, megatons);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energyJoules, megatons);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energyJoules, megatons);


    // Calcular probabilidad de supervivencia / Compute survival probability by distance.
    calculateSurvivalProbability(distance, energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const totalDestructionRadius = this.calculateTotalDestructionZone(energyJoules, megatons);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energyJoules, megatons);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energyJoules, megatons);

        if (distance <= totalDestructionRadius) {
            return 0.05;
            return 0.05;
        } else if (distance <= severeDestructionRadius) {
            return 0.5;
            return 0.5;
        } else if (distance <= moderateDestructionRadius) {
            return 0.9;
        }
        return 0.98;
    }

    // Calcular tiempo de llegada de efectos secundarios / Estimate timing for secondary effects.
    calculateSecondaryEffectTiming(energyJoules, distance, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
            return 0.9;
        }
        return 0.98;
    }

    // Calcular tiempo de llegada de efectos secundarios / Estimate timing for secondary effects.
    calculateSecondaryEffectTiming(energyJoules, distance, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return {
            earthquake: 0,
            tsunami: distance / 200,
            fire: Math.sqrt(distance) * 0.1,
            dust: distance / 50,
            climate: 365 * Math.log10(Math.max(megatons, 1)),
            earthquake: 0,
            tsunami: distance / 200,
            fire: Math.sqrt(distance) * 0.1,
            dust: distance / 50,
            climate: 365 * Math.log10(Math.max(megatons, 1)),
        };
    }

    // Función principal para calcular todos los efectos / Main function to compute all effects.
    calculateAllEffects(diameter, velocity, densityKey, populationDensity = 1000) {
        const materialDensity = this.densityValues[densityKey] ?? this.densityValues.stone;
        const mass = this.calculateMass(diameter, materialDensity);

    // Función principal para calcular todos los efectos / Main function to compute all effects.
    calculateAllEffects(diameter, velocity, densityKey, populationDensity = 1000) {
        const materialDensity = this.densityValues[densityKey] ?? this.densityValues.stone;
        const mass = this.calculateMass(diameter, materialDensity);
        const energy = this.calculateKineticEnergy(mass, velocity);
        const energyMegatons = this.joulesToMegatons(energy);


        return {
            // Datos básicos / Basic data.
            mass,
            energy,
            energyMegatons,

            // Efectos físicos / Physical effects.
            craterDiameter: this.calculateCraterDiameter(energy, densityKey, energyMegatons),
            totalDestructionZone: this.calculateTotalDestructionZone(energy, energyMegatons),
            severeDestructionZone: this.calculateSevereDestructionZone(energy, energyMegatons),
            moderateDestructionZone: this.calculateModerateDestructionZone(energy, energyMegatons),

            // Víctimas / Casualty estimates.
            casualties: this.estimateCasualties(energy, populationDensity, energyMegatons),

            // Efectos secundarios / Secondary effects.
            // Datos básicos / Basic data.
            mass,
            energy,
            energyMegatons,

            // Efectos físicos / Physical effects.
            craterDiameter: this.calculateCraterDiameter(energy, densityKey, energyMegatons),
            totalDestructionZone: this.calculateTotalDestructionZone(energy, energyMegatons),
            severeDestructionZone: this.calculateSevereDestructionZone(energy, energyMegatons),
            moderateDestructionZone: this.calculateModerateDestructionZone(energy, energyMegatons),

            // Víctimas / Casualty estimates.
            casualties: this.estimateCasualties(energy, populationDensity, energyMegatons),

            // Efectos secundarios / Secondary effects.
            earthquake: {
                magnitude: this.calculateEarthquakeMagnitude(energy, energyMegatons),
                magnitude: this.calculateEarthquakeMagnitude(energy, energyMegatons),
            },
            tsunami: {
                height: this.calculateTsunamiHeight(energy, energyMegatons),
                height: this.calculateTsunamiHeight(energy, energyMegatons),
            },
            fire: {
                radius: this.calculateFireRadius(energy, energyMegatons),
                radius: this.calculateFireRadius(energy, energyMegatons),
            },
            dust: {
                radius: this.calculateDustCloudRadius(energy, energyMegatons),
                radius: this.calculateDustCloudRadius(energy, energyMegatons),
            },

            // Efectos climáticos / Climate effects.
            climate: this.calculateGlobalClimateEffects(energy, energyMegatons),

            // Clasificación del impacto / Impact classification.
            impactClassification: this.classifyImpact(energyMegatons),

            // Efectos climáticos / Climate effects.
            climate: this.calculateGlobalClimateEffects(energy, energyMegatons),

            // Clasificación del impacto / Impact classification.
            impactClassification: this.classifyImpact(energyMegatons),
        };
    }

    // Clasificar el tipo de impacto / Classify the impact severity.

    // Clasificar el tipo de impacto / Classify the impact severity.
    classifyImpact(energyMegatons) {
        if (energyMegatons < 0.001) {
            return { level: 'Local', description: 'Impacto local, daños menores / Local impact, minor damage.' };
            return { level: 'Local', description: 'Impacto local, daños menores / Local impact, minor damage.' };
        } else if (energyMegatons < 0.1) {
            return { level: 'Regional', description: 'Impacto regional, daños significativos / Regional impact, significant damage.' };
            return { level: 'Regional', description: 'Impacto regional, daños significativos / Regional impact, significant damage.' };
        } else if (energyMegatons < 10) {
            return { level: 'Continental', description: 'Impacto continental, devastación masiva / Continental impact, massive devastation.' };
            return { level: 'Continental', description: 'Impacto continental, devastación masiva / Continental impact, massive devastation.' };
        } else if (energyMegatons < 1000) {
            return { level: 'Global', description: 'Impacto global, cambio climático / Global impact, climate change.' };
            return { level: 'Global', description: 'Impacto global, cambio climático / Global impact, climate change.' };
        }
        return { level: 'Extinción', description: 'Evento de extinción masiva / Mass extinction event.' };
        return { level: 'Extinción', description: 'Evento de extinción masiva / Mass extinction event.' };
    }
}

// Exportar para uso global / Expose globally.
// Exportar para uso global / Expose globally.
window.ImpactCalculations = ImpactCalculations;
