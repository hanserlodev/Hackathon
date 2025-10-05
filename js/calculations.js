class ImpactCalculations {
    constructor() {
        // Densidades de materiales en g/cm³
        this.densityValues = {
            iron: 7.8,
            stone: 3.0,
            ice: 0.9,
            gold: 19.3,
            comet: 0.0001,
            carbon: 2.2,
            concrete: 2.4, // Para infraestructura
            wood: 0.8,     // Para casas de madera
            water: 1.0,    // Densidad del agua
        };

        // Multiplicadores de diámetro de cráter
        this.craterMultipliers = {
            iron: 1000,
            stone: 800,
            ice: 600,
            default: 700,
        };

        // Pérdida de energía por fricción del aire (simulación de la atmósfera)
        this.airFrictionLoss = 0.8; // 20% de pérdida de energía por fricción con el aire
    }

    // Calcular masa del meteorito
    calculateMass(diameter, density) {
        const radius = diameter / 2; // metros
        const volume = (4 / 3) * Math.PI * Math.pow(radius, 3); // m³
        const mass = volume * density * 1000; // kg
        return mass;
    }

    // Calcular energía cinética
    calculateKineticEnergy(mass, velocity) {
        const velocityMs = velocity * 1000; // Convertir km/s a m/s
        return 0.5 * mass * Math.pow(velocityMs, 2);
    }

    // Convertir energía a megatones de TNT
    joulesToMegatons(joules) {
        return joules / 4.184e15; // 1 megatón TNT = 4.184e15 J
    }

    // Normalizar a megatones
    normalizeMegatons(energyJoules, precomputedMegatons = null) {
        return typeof precomputedMegatons === 'number'
            ? precomputedMegatons
            : this.joulesToMegatons(energyJoules);
    }

    // Ángulo de impacto ajustado para cráter
    calculateImpactAngleModifier(angle) {
        // Ángulo en grados: 90° es vertical, 0° es horizontal
        const angleFactor = Math.cos(angle * Math.PI / 180);
        return Math.max(angleFactor, 0.1); // Evitar valores negativos
    }

    // Calcular el diámetro del cráter con ajuste por ángulo
    calculateCraterDiameter(energyJoules, densityKey, angle = 90, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const multiplier = this.craterMultipliers[densityKey] ?? this.craterMultipliers.default;
        const angleModifier = this.calculateImpactAngleModifier(angle);
        return Math.max(Math.pow(megatons, 0.294) * multiplier * angleModifier, 10);
    }

    // Estimar víctimas con efectos de infraestructura
    estimateCasualtiesWithInfrastructure(energyJoules, populationDensity, distance, densityKey, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const radiusOfDestruction = this.calculateTotalDestructionZone(energyJoules, megatons);

        // Calculamos el daño a la infraestructura
        const distanceFactor = Math.pow(distance / radiusOfDestruction, 2); // Reducción de daño con la distancia
        const infrastructureDamage = this.getInfrastructureDamage(densityKey, distanceFactor);

        // Estimamos las víctimas
        const totalDestructionArea = Math.PI * Math.pow(radiusOfDestruction, 2);
        const fatalities = totalDestructionArea * populationDensity * infrastructureDamage * 0.95;
        const injuries = fatalities * 3;

        return {
            fatalities: Math.round(fatalities),
            injuries: Math.round(injuries),
            totalAffected: Math.round(fatalities + injuries),
        };
    }

    // Daño a la infraestructura según el material
    getInfrastructureDamage(densityKey, distanceFactor) {
        switch (densityKey) {
            case 'concrete':
                return 1.0 * distanceFactor; // Estructuras de concreto resisten mejor
            case 'wood':
                return 0.6 * distanceFactor; // Estructuras de madera son más vulnerables
            default:
                return 0.8 * distanceFactor; // Caso por defecto
        }
    }

    // Calcular las zonas de destrucción
    calculateTotalDestructionZone(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.pow(megatons, 0.33) * 2.5; // km
    }

    // Estimar víctimas basadas en la zona de impacto
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

    // Calcular magnitud de terremoto
    calculateEarthquakeMagnitude(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        const magnitude = Math.log10(megatons * 4.184e15) / 1.5 - 4.5;
        return Math.max(magnitude, 0);
    }

    // Calcular altura del tsunami
    calculateTsunamiHeight(energyJoules, energyMegatons = null, waterDepth = 4000) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        let tsunamiHeight;

        if (megatons < 1) {
            tsunamiHeight = Math.pow(megatons, 0.5) * 10;
        } else if (megatons < 100) {
            tsunamiHeight = Math.pow(megatons, 0.4) * 20;
        } else {
            tsunamiHeight = Math.pow(megatons, 0.3) * 50;
        }

        return Math.max(tsunamiHeight, 1);
    }

    // Calcular radio de incendios
    calculateFireRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.max(Math.pow(megatons, 0.33) * 3, 1);
    }

    // Calcular radio de nube de polvo
    calculateDustCloudRadius(energyJoules, energyMegatons = null) {
        const megatons = this.normalizeMegatons(energyJoules, energyMegatons);
        return Math.max(Math.pow(megatons, 0.33) * 15, 5);
    }

    // Calcular efectos climáticos globales
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

    // Calcular probabilidad de supervivencia
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

    // Calcular tiempo de llegada de efectos secundarios
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

    // Función principal para calcular todos los efectos
    calculateAllEffects(diameter, velocity, densityKey, angle, populationDensity = 1000) {
        const materialDensity = this.densityValues[densityKey] ?? this.densityValues.stone;
        const mass = this.calculateMass(diameter, materialDensity);
        const energy = this.calculateKineticEnergy(mass, velocity);
        const energyMegatons = this.joulesToMegatons(energy);

        const radiusOfDestruction = this.calculateTotalDestructionZone(energy, energyMegatons);

        return {
            mass,
            energy,
            energyMegatons,
            craterDiameter: this.calculateCraterDiameter(energy, densityKey, angle, energyMegatons),
            casualties: this.estimateCasualtiesWithInfrastructure(energy, populationDensity, radiusOfDestruction, densityKey, energyMegatons),
            impactClassification: this.classifyImpact(energyMegatons),
        };
    }

    classifyImpact(energyMegatons) {
        if (energyMegatons < 0.001) {
            return { level: 'Local', description: 'Impacto local, daños menores.' };
        } else if (energyMegatons < 0.1) {
            return { level: 'Regional', description: 'Impacto regional, daños significativos.' };
        } else if (energyMegatons < 10) {
            return { level: 'Continental', description: 'Impacto continental, devastación masiva.' };
        } else if (energyMegatons < 1000) {
            return { level: 'Global', description: 'Impacto global, cambio climático.' };
        }
        return { level: 'Extinción', description: 'Evento de extinción masiva.' };
    }
}

// Exponer globalmente
window.ImpactCalculations = ImpactCalculations;
