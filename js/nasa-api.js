class NASAAPI {
  constructor() {
    this.apiKey = "wpKomrRpU2ogcvgoD4dlkk6i5OmRKkfnrdYu3JQ4"; // Your API key
    this.nearEarthObjects = [];
    this.statistics = {
      total: 0,
      hazardous: 0,
      hazardousPercentage: 0,
      averageSize: 0,
      averageVelocity: 0,
      lastUpdate: new Date(),
    };
  }

  // Function to generate random number within range
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Retrieve NEO data
  async getNEOData(startDate, endDate) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`;
    console.log("Requesting NEO data from proxy:", url);

    try {
      const response = await fetch(url);
      console.log("API response (proxy):", response); // Verify proxy response

      if (!response.ok) {
        throw new Error("Error in request to NASA proxy");
      }

      const data = await response.json();
      console.log("NEO data obtained:", data); // Verify obtained data

      const meteoritos = [];
      for (const date in data.near_earth_objects) {
        data.near_earth_objects[date].forEach((neo) => {
          meteoritos.push({
            name: neo.name,
            hazardLevel: neo.is_potentially_hazardous_asteroid
              ? "HIGH"
              : "MEDIUM",
            size:
              (neo.estimated_diameter.meters.estimated_diameter_max +
                neo.estimated_diameter.meters.estimated_diameter_min) /
              2,
            velocity:
              neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
            score: Math.random() * 100, // Random score
            closeApproachDate: neo.close_approach_data[0].close_approach_date,
          });
        });
      }

      return meteoritos; // Return meteorites
    } catch (error) {
      console.error("Error retrieving NEO data:", error);
      return []; // Return empty array on error
    }
  }

  // Update meteorite parameters in UI
  async updateMeteoriteParameters(startDate, endDate) {
    try {
      // Retrieve meteorite data
      const neoData = await this.getNEOData(startDate, endDate);

      // Verify we have NEO data
      if (neoData && neoData.length > 0) {
        const selectedNEO = neoData[this.getRandomInt(0, neoData.length - 1)]; // Random NEO selection

        // Verify 'selectedNEO.size' and 'selectedNEO.velocity' are valid numbers before using
        const size = parseFloat(selectedNEO.size);
        const velocity = parseFloat(selectedNEO.velocity);

        // Ensure 'size' and 'velocity' are valid numbers
        if (!isNaN(size) && !isNaN(velocity)) {
          // Update meteorite parameters in UI
          const meteorSizeElement = document.getElementById("meteor-size");
          if (meteorSizeElement) {
            meteorSizeElement.textContent = `${size.toFixed(2)} m`;
          } else {
            console.error("Element meteor-size not found.");
          }

          const meteorVelocityElement =
            document.getElementById("meteor-velocity");
          if (meteorVelocityElement) {
            meteorVelocityElement.textContent = `${velocity.toFixed(1)} km/h`;
          } else {
            console.error("Element meteor-velocity not found.");
          }

          const meteorHazardElement = document.getElementById("meteor-hazard");
          if (meteorHazardElement) {
            meteorHazardElement.textContent = selectedNEO.hazardLevel || "N/A"; // If no hazard level, display "N/A"
          } else {
            console.error("Element meteor-hazard not found.");
          }
        } else {
          console.error(
            "El tamaño o la velocidad no son números válidos",
            selectedNEO
          );
        }
      } else {
        console.error("No se encontraron datos de NEO.");
      }
    } catch (error) {
      console.error("Error al actualizar parámetros del meteorito:", error);
    }
  }

  async populateMeteoriteSelect(startDate, endDate) {
    console.log("Getting NEO data to populate select");
    const neoData = await this.getNEOData(startDate, endDate);
    console.log("NEO data received:", neoData);

    const meteorSelect = document.getElementById("meteor-select");
    console.log("Populating meteorite select with NEO data:", neoData);

    // Famous/historical meteorites for reference
    const famousMeteors = [
      {
        name: "1036 Ganymed",
        size: 40000,
        velocity: 72,
        hazard: "HIGH",
        description: "Largest known NEO",
      },
      {
        name: "Chicxulub Impactor",
        size: 10000,
        velocity: 72,
        hazard: "EXTINCTION",
        description: "Dinosaur extinction event",
      },
      {
        name: "Tunguska Event",
        size: 60,
        velocity: 54,
        hazard: "MEDIUM",
        description: "1908 Siberia explosion",
      },
      {
        name: "Chelyabinsk Meteor",
        size: 20,
        velocity: 66.6,
        hazard: "LOW",
        description: "2013 Russia airburst",
      },
      {
        name: "Apophis (2029)",
        size: 370,
        velocity: 30.7,
        hazard: "HIGH",
        description: "Close approach in 2029",
      },
      {
        name: "Bennu",
        size: 490,
        velocity: 28,
        hazard: "HIGH",
        description: "OSIRIS-REx target",
      },
    ];

    meteorSelect.innerHTML = "";

    // Add manual option first
    const manualOption = document.createElement("option");
    manualOption.value = "manual";
    manualOption.textContent = "🎯 Manual Configuration";
    manualOption.selected = true;
    meteorSelect.appendChild(manualOption);

    // Add famous meteorites section
    const famousSeparator = document.createElement("option");
    famousSeparator.disabled = true;
    famousSeparator.textContent = "─────── Famous Meteorites ───────";
    meteorSelect.appendChild(famousSeparator);

    famousMeteors.forEach((meteor) => {
      const option = document.createElement("option");
      option.value = `famous_${meteor.name}`;
      option.dataset.size = meteor.size;
      option.dataset.velocity = meteor.velocity;
      option.dataset.hazard = meteor.hazard;
      option.textContent = `${meteor.name} (${meteor.size}m, ${meteor.velocity} km/s)`;
      meteorSelect.appendChild(option);
    });

    // Add NEO meteorites section if available
    if (neoData && neoData.length > 0) {
      const neoSeparator = document.createElement("option");
      neoSeparator.disabled = true;
      neoSeparator.textContent = "─────── Current NEO Data ───────";
      meteorSelect.appendChild(neoSeparator);

      // Create option for each meteorite
      neoData.forEach((neo) => {
        const option = document.createElement("option");
        option.value = neo.name;
        option.dataset.size = neo.size;
        option.dataset.velocity = neo.velocity / 3600; // Convert km/h to km/s
        option.dataset.hazard = neo.hazardLevel;

        // Convert velocity from km/h to km/s for display
        const velocityKmS = (neo.velocity / 3600).toFixed(1);
        option.textContent = `${neo.name} (${neo.size.toFixed(
          0
        )}m, ${velocityKmS} km/s)`;
        meteorSelect.appendChild(option);
      });
      console.log(
        "Meteorite select populated with",
        neoData.length,
        "NEO meteorites."
      );
    }

    console.log("Total options:", meteorSelect.options.length);
  }

  setupEventListeners() {
    const sizeSlider = document.getElementById("meteor-size");
    const speedSlider = document.getElementById("meteor-speed");
    const angleSlider = document.getElementById("meteor-angle");
    const startButton = document.getElementById("start-simulation");
    const resetButton = document.getElementById("reset-simulation");
    const searchButton = document.getElementById("search-location");
    const locationInput = document.getElementById("location-input");

    sizeSlider.addEventListener("input", () => {
      document.getElementById(
        "size-value"
      ).textContent = `${sizeSlider.value}m`;
    });

    speedSlider.addEventListener("input", () => {
      document.getElementById(
        "speed-value"
      ).textContent = `${speedSlider.value} km/s`;
    });

    angleSlider.addEventListener("input", () => {
      document.getElementById(
        "angle-value"
      ).textContent = `${angleSlider.value}°`;
    });

    startButton.addEventListener("click", () => this.startSimulation());
    resetButton.addEventListener("click", () => this.resetSimulation());
    mitigationButton.addEventListener("click", () =>
      this.toggleMitigationPanel()
    );
    searchButton.addEventListener("click", () => this.searchLocation());

    locationInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchLocation();
      }
    });
  }
  // Get Near-Earth Objects and update NEO data
  async fetchNearEarthObjects() {
    const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    // Process response and update NEO objects
    this.nearEarthObjects = data.near_earth_objects.map((neo) => {
      return {
        name: neo.name,
        hazardLevel: neo.is_potentially_hazardous_asteroid ? "HIGH" : "MEDIUM",
        size:
          (neo.estimated_diameter.meters.estimated_diameter_max +
            neo.estimated_diameter.meters.estimated_diameter_min) /
          2, // Average size
        velocity:
          neo.close_approach_data && neo.close_approach_data[0]
            ? parseFloat(
                neo.close_approach_data[0].relative_velocity.kilometers_per_hour
              )
            : 75000, // Default velocity if not available
        score: neo.is_potentially_hazardous_asteroid
          ? Math.random() * 40 + 60 // 60-100 for hazardous
          : Math.random() * 60, // 0-60 for non-hazardous
      };
    });

    // Update statistics
    this.updateStatistics();
  }

  updateStatistics() {
    const hazardous = this.nearEarthObjects.filter(
      (neo) => neo.hazardLevel === "HIGH"
    ).length;
    const total = this.nearEarthObjects.length;
    const hazardousPercentage = total > 0 ? (hazardous / total) * 100 : 0;
    const averageSize =
      total > 0
        ? this.nearEarthObjects.reduce((acc, neo) => acc + neo.size, 0) / total
        : 0;
    const averageVelocity =
      total > 0
        ? this.nearEarthObjects.reduce((acc, neo) => acc + neo.velocity, 0) /
          total
        : 0;

    this.statistics = {
      total: total,
      hazardous: hazardous,
      hazardousPercentage: hazardousPercentage.toFixed(2),
      averageSize: averageSize.toFixed(2),
      averageVelocity: (averageVelocity / 3600).toFixed(2), // Convert km/h to km/s
      lastUpdate: new Date(),
    };
  }

  async getNearEarthObjects() {
    if (this.nearEarthObjects.length === 0) {
      await this.fetchNearEarthObjects(); // Cargar datos si no están disponibles
    }
    return this.nearEarthObjects;
  }

  async displayNearEarthObjects() {
    // First load NEO data if not already loaded
    if (this.nearEarthObjects.length === 0) {
      try {
        await this.fetchNearEarthObjects();
      } catch (error) {
        console.error("Error loading NEO data for statistics:", error);
        // Set default values if fetch fails
        this.statistics = {
          total: 0,
          hazardous: 0,
          hazardousPercentage: "0.00",
          averageSize: "0.00",
          averageVelocity: "0.00",
          lastUpdate: new Date(),
        };
      }
    }

    // Render NEO objects on page
    this.renderHazardCards();
    this.renderStatistics();
  }

  displayHazardAlerts() {
    this.renderHazardCards(); // Compatibilidad
  }

  autoUpdate() {
    // Re-render para simular la actualización
    this.renderHazardCards();
    this.renderStatistics();
  }

  renderHazardCards() {
    const container = document.getElementById("hazard-alerts");
    if (!container) {
      return;
    }

    container.innerHTML = ""; // Clear container

    // Filter only potentially hazardous asteroids
    const hazardousNEOs = this.nearEarthObjects.filter(
      (neo) => neo.hazardLevel === "HIGH"
    );

    if (hazardousNEOs.length === 0) {
      container.innerHTML =
        '<p class="no-hazards">No potentially hazardous asteroids currently under observation.</p>';
      return;
    }

    hazardousNEOs.forEach((neo) => {
      const card = document.createElement("article");
      card.className = "hazard-card";
      const velocityKmS = (neo.velocity / 3600).toFixed(2); // Convert km/h to km/s

      card.innerHTML = `
                <div>
                    <h4>🚨 ${neo.name}</h4>
                    <p class="hazard-meta">Diameter: ${neo.size.toFixed(
                      1
                    )} m · Velocity: ${velocityKmS} km/s</p>
                </div>
                <div class="hazard-meta">
                    <span class="hazard-level hazard-level-high">⚠️ POTENTIALLY HAZARDOUS</span>
                    <p>Risk Score: ${neo.score.toFixed(1)}/100</p>
                </div>
            `;
      container.appendChild(card);
    });
  }

  renderStatistics() {
    const total = document.getElementById("stat-total");
    const hazardous = document.getElementById("stat-hazardous");
    const hazardPercentage = document.getElementById("stat-hazard-percentage");
    const averageSize = document.getElementById("stat-average-size");
    const averageVelocity = document.getElementById("stat-average-velocity");
    const lastUpdate = document.getElementById("stat-last-update");

    if (!total) {
      return;
    }

    total.textContent = this.statistics.total.toString();
    hazardous.textContent = this.statistics.hazardous.toString();
    hazardPercentage.textContent = `${this.statistics.hazardousPercentage}% hazardous`;
    averageSize.textContent = `${this.statistics.averageSize} m`;
    averageVelocity.textContent = `${this.statistics.averageVelocity} km/s`;
    lastUpdate.textContent = this.formatDate(this.statistics.lastUpdate);
  }

  getNEOStatistics() {
    return { ...this.statistics };
  }

  formatDate(date) {
    return date.toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  }
}

window.addEventListener("load", async () => {
  try {
    // Crear una nueva instancia de la clase NASAAPI
    const nasaAPI = new NASAAPI();

    // Esperar a que se complete el llenado de la lista de meteoritos
    await nasaAPI.populateMeteoriteSelect("2025-09-01", "2025-09-07"); // Fecha de ejemplo

    // Esperar a que se completen los parámetros del meteorito
    await nasaAPI.updateMeteoriteParameters("2025-09-01", "2025-09-07"); // Fecha de ejemplo
  } catch (error) {
    console.error("Error al cargar los datos de la API de NASA:", error);
  }
});
