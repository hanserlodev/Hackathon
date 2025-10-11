// Import classification functions
import { classifySimulationEffects, generateSeverityReport } from './emergency-protocols.js';

// Main simulation controller
class MeteorSimulation {
  constructor() {
    this.calculations = new ImpactCalculations();
    this.nasaAPI = null;
    this.earthMap2D = new EarthMap2D();
    this.isSimulating = false;
    this.impactCoordinates = null;

    // Reference locations for quick searches
    this.referenceLocations = [
      {
        query: "denver",
        lat: 39.7392,
        lon: -104.9903,
        label: "Denver, CO, USA",
      },
      {
        query: "new york",
        lat: 40.7128,
        lon: -74.006,
        label: "New York, NY, USA",
      },
      {
        query: "los angeles",
        lat: 34.0522,
        lon: -118.2437,
        label: "Los Angeles, CA, USA",
      },
      {
        query: "chicago",
        lat: 41.8781,
        lon: -87.6298,
        label: "Chicago, IL, USA",
      },
      {
        query: "houston",
        lat: 29.7604,
        lon: -95.3698,
        label: "Houston, TX, USA",
      },
      // Ocean impact locations for testing
      {
        query: "gulf of mexico",
        lat: 21.5,
        lon: -92.5,
        label: "Gulf of Mexico (Chicxulub Impact Site)",
      },
      {
        query: "pacific ocean",
        lat: 0,
        lon: -140,
        label: "Pacific Ocean (Deep Water)",
      },
      {
        query: "atlantic ocean",
        lat: 30,
        lon: -40,
        label: "Atlantic Ocean (Mid-Atlantic)",
      },
      {
        query: "indian ocean",
        lat: -10,
        lon: 75,
        label: "Indian Ocean (Deep Water)",
      }
    ];

    this.init();
  }

  init() {
    // Configure event listeners and initial values
    this.setupEventListeners();
    this.loadInitialData();
  }

  setupEventListeners() {
    const sizeSlider = document.getElementById("meteor-size");
    const velocitySlider = document.getElementById("meteor-velocity");
    const angleSlider = document.getElementById("meteor-angle");
    const startButton = document.getElementById("start-simulation");
    const resetButton = document.getElementById("reset-simulation");
    const searchButton = document.getElementById("search-location");
    const locationInput = document.getElementById("location-input");

    // Verify elements exist before adding listeners
    if (sizeSlider) {
      sizeSlider.addEventListener("input", () => {
        const value = parseInt(sizeSlider.value);
        const formatted = value >= 1000 
          ? `${(value/1000).toFixed(1)} km` 
          : `${value}m`;
        document.getElementById("size-value").textContent = formatted;
      });
    } else {
      console.error("Element #meteor-size not found");
    }

    if (velocitySlider) {
      velocitySlider.addEventListener("input", () => {
        document.getElementById(
          "velocity-value"
        ).textContent = `${velocitySlider.value} km/s`;
      });
    } else {
      console.error("Element #meteor-velocity not found");
    }

    if (angleSlider) {
      angleSlider.addEventListener("input", () => {
        document.getElementById(
          "angle-value"
        ).textContent = `${angleSlider.value}°`;
      });
    } else {
      console.error("Element #meteor-angle not found");
    }

    if (startButton) {
      startButton.addEventListener("click", () => this.startSimulation());
    } else {
      console.error("Element #start-simulation not found");
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => this.resetSimulation());
    } else {
      console.error("Element #reset-simulation not found");
    }

    if (searchButton) {
      searchButton.addEventListener("click", () => this.searchLocation());
    } else {
      console.error("Element #search-location not found");
    }

    if (locationInput) {
      locationInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.searchLocation();
        }
      });
    } else {
      console.error("Element #location-input not found");
    }
  }

  showInlineMessage(message) {
    // Display message in the interface
    const messageContainer = document.getElementById("visualization-message");
    if (messageContainer) {
      messageContainer.textContent = message;
      messageContainer.style.display = 'block'; // Show message
    }
  }

  showCalculationMessage(message) {
    // Create or update calculation progress message at the top
    let calcMessage = document.getElementById("calculation-progress");
    if (!calcMessage) {
      calcMessage = document.createElement("div");
      calcMessage.id = "calculation-progress";
      calcMessage.className = "calculation-progress";
      const header = document.querySelector(".header");
      if (header && header.parentNode) {
        header.parentNode.insertBefore(calcMessage, header.nextSibling);
      }
    }
    calcMessage.innerHTML = `
      <div class="progress-content">
        <div class="spinner"></div>
        <span>${message}</span>
      </div>
    `;
    calcMessage.style.display = 'block';
  }

  hideCalculationMessage() {
    const calcMessage = document.getElementById("calculation-progress");
    if (calcMessage) {
      calcMessage.style.display = 'none';
    }
  }

  async checkIfOceanImpact(lat, lon) {
    // Check if coordinates are over water using Overpass API
    try {
      const overpassUrl = "https://overpass-api.de/api/interpreter";
      
      // Small radius query (500m) just to check terrain type
      const radius = 500; // meters
      const lat1 = lat - radius / 111320;
      const lon1 = lon - radius / (111320 * Math.cos((lat * Math.PI) / 180));
      const lat2 = lat + radius / 111320;
      const lon2 = lon + radius / (111320 * Math.cos((lat * Math.PI) / 180));
      
      // Query for land features (buildings, highways, landuse)
      const query = `
        [out:json][timeout:10];
        (
          node["building"](${lat1},${lon1},${lat2},${lon2});
          way["building"](${lat1},${lon1},${lat2},${lon2});
          way["highway"](${lat1},${lon1},${lat2},${lon2});
          way["landuse"](${lat1},${lon1},${lat2},${lon2});
          node["place"](${lat1},${lon1},${lat2},${lon2});
        );
        out body;
      `;
      
      const response = await fetch(
        `${overpassUrl}?data=${encodeURIComponent(query)}`,
        { method: "GET", timeout: 10000 }
      );
      
      if (!response.ok) {
        console.warn("Could not determine terrain type, assuming land");
        return false;
      }
      
      const data = await response.json();
      
      // If no land features found, it's likely water
      const isWater = !data.elements || data.elements.length === 0;
      
      return isWater;
      
    } catch (error) {
      console.error("Error checking terrain type:", error);
      // Default to land impact if check fails
      return false;
    }
  }

  loadInitialData() {
    // Select first reference location
    const defaultLocation = this.referenceLocations[0];
    this.setImpactLocation(
      defaultLocation.lat,
      defaultLocation.lon,
      defaultLocation.label
    );
    const input = document.getElementById("location-input");
    if (input) {
      input.value = defaultLocation.label;
    }
  }

  setImpactLocation(lat, lon, label) {
    // Set impact coordinates
    this.impactCoordinates = { lat, lon, label };

    // Update UI to display coordinates and location
    this.renderLocationInfo();

    // Update map with marker at new location
    if (this.earthMap2D) {
      this.earthMap2D.setImpactPoint(lat, lon);
    }

    // Update text field with description and coordinates
    const input = document.getElementById("location-input");
    if (input) {
      input.value = `${label} (${lat.toFixed(2)}, ${lon.toFixed(2)})`; // Display location and coordinates in text field
    }
  }

  renderLocationInfo() {
    const container = document.querySelector(".control-panel");
    if (!container || !this.impactCoordinates) {
      return;
    }

    let info = document.getElementById("location-info");
    if (!info) {
      info = document.createElement("div");
      info.id = "location-info";
      info.className = "nearest-city-info";
      container.appendChild(info);
    }

    const { lat, lon, label } = this.impactCoordinates;
    info.innerHTML = `
        <h4>📍 Selected Location</h4>
        <p><strong>Description:</strong> ${label}</p>
        <p><strong>Latitude:</strong> ${lat.toFixed(2)}°</p>
        <p><strong>Longitude:</strong> ${lon.toFixed(2)}°</p>
    `;
  }

  searchLocation() {
    const input = document.getElementById("location-input");
    if (!input) {
      return;
    }

    const value = input.value.trim();
    if (!value) {
      this.showInlineMessage(
        "Please enter a location or coordinates."
      );
      return;
    }

    // If value includes commas, interpret as coordinates
    if (value.includes(",")) {
      const [latString, lonString] = value.split(",");
      const lat = parseFloat(latString.trim());
      const lon = parseFloat(lonString.trim());

      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        this.setImpactLocation(
          lat,
          lon,
          `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`
        );
        return;
      } else {
        this.showInlineMessage("Invalid coordinates.");
      }
    }

    // If it's a place name, search in reference locations
    const normalized = value.toLowerCase();
    const match = this.referenceLocations.find((location) =>
      normalized.includes(location.query)
    );

    if (match) {
      this.setImpactLocation(match.lat, match.lon, match.label);
      input.value = match.label; // Update text field with found location
    } else {
      this.showInlineMessage(
        "Location not found. Use latitude, longitude coordinates."
      );
    }
  }

  renderLocationInfo() {
    const container = document.querySelector(".control-panel");
    if (!container || !this.impactCoordinates) {
      return;
    }

    let info = document.getElementById("location-info");
    if (!info) {
      info = document.createElement("div");
      info.id = "location-info";
      info.className = "nearest-city-info";
      container.appendChild(info);
    }

    const { lat, lon, label } = this.impactCoordinates;
    info.innerHTML = `
        <h4>📍 Selected Location</h4>
        <p><strong>Descripción:</strong> ${label}</p>
        <p><strong>Latitud:</strong> ${lat.toFixed(2)}°</p>
        <p><strong>Longitud:</strong> ${lon.toFixed(2)}°</p>
    `;
  }

  async startSimulation() {
    if (this.isSimulating) {
      this.showInlineMessage(
        "The simulation is already running."
      );
      return;
    }

    if (!this.impactCoordinates) {
      this.showInlineMessage(
        "Select a location before starting."
      );
      return;
    }

    // Get meteorite parameters
    const diameter = parseFloat(document.getElementById("meteor-size").value);
    const velocity = parseFloat(document.getElementById("meteor-velocity").value);
    const angle = parseFloat(document.getElementById("meteor-angle").value);
    const density = document.getElementById("meteor-density").value;

    this.isSimulating = true;
    this.updateStartButton(true);
    
    // Show calculation message
    this.showCalculationMessage("Phase 1/3: Detecting impact terrain type...");

    // Check if impact is over ocean/water
    const isOceanImpact = await this.checkIfOceanImpact(
      this.impactCoordinates.lat,
      this.impactCoordinates.lon
    );
    
    console.log(`Impact terrain: ${isOceanImpact ? 'OCEAN/WATER' : 'LAND'}`);

    // Step 1: Calculate preliminary impact to get destruction radius
    this.showCalculationMessage("Phase 2/3: Calculating impact effects...");
    
    const preliminaryEffects = this.calculations.calculateAllEffects(
      diameter,
      velocity,
      density,
      angle,
      1000, // Default population density for initial calculation
      isOceanImpact
    );

    // Use the total destruction zone as the query radius (convert km to meters)
    const queryRadius = Math.max(
      preliminaryEffects.totalDestructionZone * 1000,
      1000 // Minimum 1 km radius
    );

    console.log(`Calculated destruction radius: ${preliminaryEffects.totalDestructionZone.toFixed(2)} km`);
    console.log(`Querying Overpass with radius: ${(queryRadius/1000).toFixed(2)} km`);

    // Step 2: Query Overpass API with the calculated radius
    this.showCalculationMessage("Phase 3/3: Analyzing affected population...");
    
    let populationDensity = 1000; // Default value
    let overpassData = null; // Store for classification
    
    try {
      if (typeof fetchImpactData === 'function') {
        overpassData = await fetchImpactData(
          this.impactCoordinates.lat,
          this.impactCoordinates.lon,
          queryRadius
        );

        if (overpassData && overpassData.totalPopulation > 0) {
          // Calculate area in km²
          const areaKm2 = Math.PI * Math.pow(queryRadius / 1000, 2);
          populationDensity = overpassData.totalPopulation / areaKm2;
          console.log(`Real population found: ${overpassData.totalPopulation.toLocaleString()}`);
          console.log(`Calculated population density: ${populationDensity.toFixed(2)} people/km²`);
        } else {
          console.warn("No population data found in area. Using default density of 1000 people/km²");
        }
      }
    } catch (error) {
      console.error("Error fetching Overpass data:", error);
      console.warn("Using default population density of 1000 people/km²");
    }

    // Step 3: Recalculate effects with real population density
    const effects = this.calculations.calculateAllEffects(
      diameter,
      velocity,
      density,
      angle,
      populationDensity,
      isOceanImpact
    );
    
    // Step 4: Classify severity and generate report
    let classification = null;
    if (overpassData) {
      try {
        classification = classifySimulationEffects(effects, overpassData);
        console.log("Severity classification completed:", classification);
      } catch (error) {
        console.error("Error classifying simulation effects:", error);
      }
    }
    
    // Hide calculation message
    this.hideCalculationMessage();
    
    this.currentSimulation = { 
      effects,
      parameters: { diameter, velocity, angle, density, populationDensity, isOceanImpact },
      coordinates: this.impactCoordinates,
      classification: classification,
      overpassData: overpassData
    };

    this.displayEffects(effects);
    
    // Display severity classification if available
    if (classification) {
      this.displaySeverityClassification(classification);
    }
    
    this.triggerSimulationEffects();
    this.earthMap2D.animateImpact();
    
    // Store effects in map for toggle buttons
    this.earthMap2D.storeEffects(effects, isOceanImpact);
    
    // Setup toggle buttons for secondary effects
    setTimeout(() => {
      this.setupSecondaryEffectToggles();
    }, 500);

    setTimeout(() => this.finishSimulation(), 1500);
  }

  setupSecondaryEffectToggles() {
    // Convert secondary effect items to toggle buttons
    const effectItems = {
      'earthquake-effect': 'seismic',
      'tsunami-effect': 'tsunami',
      'blast-wave-effect': 'blastWave',
      'fire-effect': 'thermal',
      'dust-effect': 'ejecta'
    };

    Object.entries(effectItems).forEach(([elementId, layerType]) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      // Remove old listeners
      element.replaceWith(element.cloneNode(true));
      const newElement = document.getElementById(elementId);
      
      // Make it clickable
      newElement.style.cursor = 'pointer';
      newElement.classList.add('effect-toggle');
      
      // Add click listener
      newElement.addEventListener('click', () => {
        const isActive = newElement.classList.toggle('active');
        
        // Toggle the corresponding circle
        switch(layerType) {
          case 'seismic':
            this.earthMap2D.toggleSeismic(isActive);
            break;
          case 'tsunami':
            this.earthMap2D.toggleTsunami(isActive);
            break;
          case 'blastWave':
            this.earthMap2D.toggleBlastWave(isActive);
            break;
          case 'thermal':
            this.earthMap2D.toggleThermal(isActive);
            break;
          case 'ejecta':
            this.earthMap2D.toggleEjecta(isActive);
            break;
        }
      });
    });
  }

  displayEffects(effects) {
    // Update key metrics
    this.setText("energy-value", formatEnergy(effects.energyMegatons));
    this.setText(
      "crater-diameter",
      formatDistance(effects.craterDiameter)
    );
    this.setText(
      "casualties",
      `${effects.casualties.fatalities.toLocaleString("en-US")} fatalities / ${effects.casualties.injuries.toLocaleString("en-US")} injuries`
    );
    this.setText(
      "destruction-zone",
      formatDistance(effects.totalDestructionZone)
    );
    
    // Display population density if available
    if (this.currentSimulation && this.currentSimulation.parameters) {
      const popDensity = this.currentSimulation.parameters.populationDensity;
      this.setText(
        "population-density",
        `${popDensity.toFixed(0)} people/km²`
      );
    }

    // Update secondary effects
    this.setText(
      "earthquake-magnitude",
      `Magnitude: ${effects.earthquake.magnitude.toFixed(1)}`
    );
    
    // Display blast wave zones information
    if (effects.casualties && effects.casualties.zones) {
      const zones = effects.casualties.zones;
      const isOcean = this.currentSimulation?.parameters?.isOceanImpact || false;
      
      if (isOcean) {
        this.setText(
          "blast-wave-zones",
          `N/A (Underwater Explosion)`
        );
      } else {
        this.setText(
          "blast-wave-zones",
          `5 zones: ${zones.totalDestruction.toFixed(1)}km (20psi) → ${zones.glassBreakage.toFixed(1)}km (1psi)`
        );
      }
    }
    
    // Highlight tsunami for ocean impacts
    const tsunamiElement = document.getElementById("tsunami-height");
    if (effects.tsunami.applicable && effects.tsunami.height > 0) {
      this.setText(
        "tsunami-height",
        `⚠️ Height: ${effects.tsunami.height.toFixed(1)} m (OCEAN IMPACT)`
      );
      if (tsunamiElement) {
        tsunamiElement.style.color = "#ff6b6b";
        tsunamiElement.style.fontWeight = "bold";
      }
    } else {
      this.setText(
        "tsunami-height",
        `Height: N/A (Land Impact)`
      );
      if (tsunamiElement) {
        tsunamiElement.style.color = "#4ecdc4";
        tsunamiElement.style.fontWeight = "normal";
      }
    }
    
    this.setText(
      "fire-radius",
      formatDistance(effects.fire.radius)
    );
    this.setText(
      "dust-radius",
      formatDistance(effects.dust.radius)
    );
  }

  displaySeverityClassification(classification) {
    // Find or create severity panel
    let severityPanel = document.getElementById("severity-panel");
    
    if (!severityPanel) {
      // Create panel if it doesn't exist
      severityPanel = document.createElement("div");
      severityPanel.id = "severity-panel";
      severityPanel.className = "severity-panel";
      
      // Insert after effects panel
      const effectsPanel = document.querySelector(".effects-panel");
      if (effectsPanel && effectsPanel.parentNode) {
        effectsPanel.parentNode.insertBefore(severityPanel, effectsPanel.nextSibling);
      } else {
        // Fallback: append to main content
        const mainContent = document.querySelector(".main-content") || document.body;
        mainContent.appendChild(severityPanel);
      }
    }
    
    // Generate and insert the severity report HTML
    const reportHTML = generateSeverityReport(classification);
    severityPanel.innerHTML = `
      <div class="panel-header">
        <h2><i class="fas fa-triangle-exclamation"></i> Impact Severity Assessment</h2>
      </div>
      ${reportHTML}
    `;
    
    // Scroll to severity panel
    setTimeout(() => {
      severityPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }

  triggerSimulationEffects() {
    document.body.classList.add("page-shake");
    setTimeout(() => document.body.classList.remove("page-shake"), 600);

    const flash = document.createElement("div");
    flash.className = "screen-flash";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }

  finishSimulation() {
    this.isSimulating = false;
    this.updateStartButton(false);
  }

  resetSimulation() {
    this.isSimulating = false;
    this.currentSimulation = null;
    this.updateStartButton(false);

    // Clear impact zones from map
    if (this.earthMap2D) {
      this.earthMap2D.clearImpactZones();
    }
    
    // Remove severity panel if it exists
    const severityPanel = document.getElementById("severity-panel");
    if (severityPanel) {
      severityPanel.remove();
    }

    [
      "energy-value",
      "crater-diameter",
      "casualties",
      "destruction-zone",
      "population-density",
    ].forEach((id) => this.setText(id, "-"));
    this.setText("earthquake-magnitude", "Magnitude: -");
    this.setText("blast-wave-zones", "Zones: -");
    this.setText("tsunami-height", "Height: -");
    this.setText("fire-radius", "Radius: -");
    this.setText("dust-radius", "Radius: -");
  }



  updateStartButton(disabled) {
    const startButton = document.getElementById("start-simulation");
    if (!startButton) {
      return;
    }

    startButton.disabled = disabled;
    startButton.textContent = disabled ? "Simulating..." : "Initialize Simulation";
  }

  setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }
}

function formatEnergy(megatons) {
  return `${megatons.toFixed(2)} MT`;
}

function formatDistance(distance) {
  return `${distance.toFixed(1)} km`;
}

function showInlineMessage(message) {
  let box = document.getElementById("simulation-message");
  if (!box) {
    box = document.createElement("div");
    box.id = "simulation-message";
    box.className = "warning-message";
    const panel = document.querySelector(".control-panel");
    if (panel) {
      panel.insertAdjacentElement("afterend", box);
    }
  }

  box.textContent = message;
  setTimeout(() => {
    if (box) {
      box.remove();
    }
  }, 4000);
}

// Export for ES6 modules
export default MeteorSimulation;

// Also expose globally for non-module scripts
window.MeteorSimulation = MeteorSimulation;
