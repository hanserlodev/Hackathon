// Cálculos de impacto de meteoritos
class ImpactCalculations {
    constructor() {
        this.densityValues = {
            iron: 7.8,    // g/cm³
            stone: 3.0,   // g/cm³
            ice: 0.9,      // g/cm³
            gold: 19.3,    // g/cm³
            comet: 0.0001,  // g/cm³
            carbon: 2.2,  // g/cm³
        };
    }
    
    // Calcular masa del meteorito
    calculateMass(diameter, density) {
        const radius = diameter / 2; // metros
        const volume = (4/3) * Math.PI * Math.pow(radius, 3); // m³
        const mass = volume * density * 1000; // kg (convertir g/cm³ a kg/m³)
        return mass;
    }
    
    // Calcular energía cinética
    calculateKineticEnergy(mass, velocity) {
        // E = 0.5 * m * v²
        const velocityMs = velocity * 1000; // convertir km/s a m/s
        const energyJoules = 0.5 * mass * Math.pow(velocityMs, 2);
        return energyJoules;
    }
    
    // Convertir energía a megatones de TNT
    joulesToMegatons(joules) {
        const megatonsTNT = joules / (4.184e15); // 1 megatón TNT = 4.184e15 J
        return megatonsTNT;
    }
    
    // Calcular diámetro del cráter
    calculateCraterDiameter(energy, density) {
        // Fórmula simplificada basada en estudios de impacto
        const energyMegatons = this.joulesToMegatons(energy);
        let craterDiameter;
        
        if (density === 'iron') {
            craterDiameter = Math.pow(energyMegatons, 0.294) * 1000; // metros
        } else if (density === 'stone') {
            craterDiameter = Math.pow(energyMegatons, 0.294) * 800; // metros
        } else { // ice
            craterDiameter = Math.pow(energyMegatons, 0.294) * 600; // metros
        }
        
        return Math.max(craterDiameter, 10); // mínimo 10 metros
    }
    
    // Calcular zona de destrucción total
    calculateTotalDestructionZone(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        const radiusKm = Math.pow(energyMegatons, 0.33) * 2.5; // km
        return radiusKm;
    }
    
    // Calcular zona de destrucción severa
    calculateSevereDestructionZone(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        const radiusKm = Math.pow(energyMegatons, 0.33) * 5; // km
        return radiusKm;
    }
    
    // Calcular zona de destrucción moderada
    calculateModerateDestructionZone(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        const radiusKm = Math.pow(energyMegatons, 0.33) * 10; // km
        return radiusKm;
    }
    
    // Estimar víctimas basado en densidad de población y zona de impacto
    estimateCasualties(energy, populationDensity, impactZone) {
        const totalDestructionRadius = this.calculateTotalDestructionZone(energy);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energy);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energy);
        
        // Calcular áreas
        const totalDestructionArea = Math.PI * Math.pow(totalDestructionRadius, 2);
        const severeDestructionArea = Math.PI * Math.pow(severeDestructionRadius, 2);
        const moderateDestructionArea = Math.PI * Math.pow(moderateDestructionRadius, 2);
        
        // Estimar víctimas por zona
        const fatalitiesTotal = totalDestructionArea * populationDensity * 0.95; // 95% fatalidad
        const fatalitiesSevere = (severeDestructionArea - totalDestructionArea) * populationDensity * 0.5; // 50% fatalidad
        const fatalitiesModerate = (moderateDestructionArea - severeDestructionArea) * populationDensity * 0.1; // 10% fatalidad
        
        const totalFatalities = fatalitiesTotal + fatalitiesSevere + fatalitiesModerate;
        
        // Estimar heridos (aproximadamente 3 veces las fatalidades)
        const injuries = totalFatalities * 3;
        
        return {
            fatalities: Math.round(totalFatalities),
            injuries: Math.round(injuries),
            totalAffected: Math.round(totalFatalities + injuries)
        };
    }
    
    // Calcular magnitud del terremoto
    calculateEarthquakeMagnitude(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        // Fórmula aproximada para convertir energía de impacto a magnitud sísmica
        const magnitude = Math.log10(energyMegatons * 4.184e15) / 1.5 - 4.5;
        return Math.max(magnitude, 0); // mínimo magnitud 0
    }
    
    // Calcular altura del tsunami (si el impacto es en el océano)
    calculateTsunamiHeight(energy, waterDepth = 4000) {
        const energyMegatons = this.joulesToMegatons(energy);
        
        // Fórmula simplificada para altura de tsunami
        let tsunamiHeight;
        
        if (energyMegatons < 1) {
            tsunamiHeight = Math.pow(energyMegatons, 0.5) * 10; // metros
        } else if (energyMegatons < 100) {
            tsunamiHeight = Math.pow(energyMegatons, 0.4) * 20; // metros
        } else {
            tsunamiHeight = Math.pow(energyMegatons, 0.3) * 50; // metros
        }
        
        return Math.max(tsunamiHeight, 1); // mínimo 1 metro
    }
    
    // Calcular radio de incendios
    calculateFireRadius(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        const fireRadiusKm = Math.pow(energyMegatons, 0.33) * 3; // km
        return Math.max(fireRadiusKm, 1); // mínimo 1 km
    }
    
    // Calcular radio de nube de polvo
    calculateDustCloudRadius(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        const dustRadiusKm = Math.pow(energyMegatons, 0.33) * 15; // km
        return Math.max(dustRadiusKm, 5); // mínimo 5 km
    }
    
    // Calcular efectos climáticos globales
    calculateGlobalClimateEffects(energy) {
        const energyMegatons = this.joulesToMegatons(energy);
        
        let climateEffects = {
            temperatureDrop: 0,
            duration: 0,
            globalImpact: false
        };
        
        if (energyMegatons > 1000) { // Impacto mayor a 1000 megatones
            climateEffects.globalImpact = true;
            climateEffects.temperatureDrop = Math.log10(energyMegatons) * 2; // °C
            climateEffects.duration = Math.log10(energyMegatons) * 2; // años
        } else if (energyMegatons > 100) { // Impacto mayor a 100 megatones
            climateEffects.temperatureDrop = Math.log10(energyMegatons) * 1; // °C
            climateEffects.duration = Math.log10(energyMegatons) * 1; // años
        }
        
        return climateEffects;
    }
    
    // Calcular probabilidad de supervivencia por distancia
    calculateSurvivalProbability(distance, energy) {
        const totalDestructionRadius = this.calculateTotalDestructionZone(energy);
        const severeDestructionRadius = this.calculateSevereDestructionZone(energy);
        const moderateDestructionRadius = this.calculateModerateDestructionZone(energy);
        
        if (distance <= totalDestructionRadius) {
            return 0.05; // 5% de supervivencia
        } else if (distance <= severeDestructionRadius) {
            return 0.5; // 50% de supervivencia
        } else if (distance <= moderateDestructionRadius) {
            return 0.9; // 90% de supervivencia
        } else {
            return 0.98; // 98% de supervivencia
        }
    }
    
    // Calcular tiempo de llegada de efectos secundarios
    calculateSecondaryEffectTiming(energy, distance) {
        const energyMegatons = this.joulesToMegatons(energy);
        
        return {
            earthquake: 0, // inmediato
            tsunami: distance / 200, // velocidad aproximada de tsunami (200 m/s)
            fire: Math.sqrt(distance) * 0.1, // propagación de incendios
            dust: distance / 50, // velocidad del viento (50 m/s)
            climate: 365 * Math.log10(energyMegatons) // años para efectos climáticos
        };
    }
    
    // Función principal para calcular todos los efectos
    calculateAllEffects(diameter, velocity, density, populationDensity = 1000) {
        const mass = this.calculateMass(diameter, this.densityValues[density]);
        const energy = this.calculateKineticEnergy(mass, velocity);
        const energyMegatons = this.joulesToMegatons(energy);
        
        return {
            // Datos básicos
            mass: mass,
            energy: energy,
            energyMegatons: energyMegatons,
            
            // Efectos físicos
            craterDiameter: this.calculateCraterDiameter(energy, density),
            totalDestructionZone: this.calculateTotalDestructionZone(energy),
            severeDestructionZone: this.calculateSevereDestructionZone(energy),
            moderateDestructionZone: this.calculateModerateDestructionZone(energy),
            
            // Víctimas
            casualties: this.estimateCasualties(energy, populationDensity),
            
            // Efectos secundarios
            earthquake: {
                magnitude: this.calculateEarthquakeMagnitude(energy)
            },
            tsunami: {
                height: this.calculateTsunamiHeight(energy)
            },
            fire: {
                radius: this.calculateFireRadius(energy)
            },
            dust: {
                radius: this.calculateDustCloudRadius(energy)
            },
            
            // Efectos climáticos
            climate: this.calculateGlobalClimateEffects(energy),
            
            // Clasificación del impacto
            impactClassification: this.classifyImpact(energyMegatons)
        };
    }
    
    // Clasificar el tipo de impacto
    classifyImpact(energyMegatons) {
        if (energyMegatons < 0.001) {
            return { level: 'Local', description: 'Impacto local, daños menores' };
        } else if (energyMegatons < 0.1) {
            return { level: 'Regional', description: 'Impacto regional, daños significativos' };
        } else if (energyMegatons < 10) {
            return { level: 'Continental', description: 'Impacto continental, devastación masiva' };
        } else if (energyMegatons < 1000) {
            return { level: 'Global', description: 'Impacto global, cambio climático' };
        } else {
            return { level: 'Extinción', description: 'Evento de extinción masiva' };
        }
    }
}

// Exportar para uso global
window.ImpactCalculations = ImpactCalculations;
