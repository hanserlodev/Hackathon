class NASAAPI {
  constructor() {
    this.apiKey = "wpKomrRpU2ogcvgoD4dlkk6i5OmRKkfnrdYu3JQ4"; // Tu clave API
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

  // Función para generar un número aleatorio entre un rango
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Obtener datos de los NEO
  async getNEOData(startDate, endDate) {

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`;
    console.log("Solicitando datos de NEO desde el proxy:", url);

    try {
      const response = await fetch(url);
      console.log("Respuesta de la API (proxy):", response); // Verifica la respuesta del proxy

      if (!response.ok) {
        throw new Error("Error en la solicitud al proxy de NASA");
      }

      const data = await response.json();
      console.log("Datos de NEO obtenidos:", data); // Verifica los datos obtenidos

      const meteoritos = [];
      for (const date in data.near_earth_objects) {
        data.near_earth_objects[date].forEach((neo) => {
          meteoritos.push({
            name: neo.name,
            hazardLevel: neo.is_potentially_hazardous_asteroid
              ? "ALTO"
              : "MEDIO",
            size:
              (neo.estimated_diameter.meters.estimated_diameter_max +
                neo.estimated_diameter.meters.estimated_diameter_min) /
              2,
            velocity:
              neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
            score: Math.random() * 100, // Puntuación aleatoria
            closeApproachDate: neo.close_approach_data[0].close_approach_date,
          });
        });
      }

      return meteoritos; // Retorna los meteoritos
    } catch (error) {
      console.error("Error al obtener los datos de NEO:", error);
      return []; // Devuelve un array vacío si hay error
    }
  }

  // Actualizar parámetros del meteorito en la UI
async updateMeteoriteParameters(startDate, endDate) {
  try {
    // Obtener los datos de los meteoritos
    const neoData = await this.getNEOData(startDate, endDate);

    if (neoData && neoData.length > 0) {
      const selectedNEO = neoData[this.getRandomInt(0, neoData.length - 1)]; // Selección aleatoria de un NEO

      // Verificar que 'selectedNEO.size' y 'selectedNEO.velocity' son números válidos antes de usar 'toFixed'
      const size = parseFloat(selectedNEO.size);
      const velocity = parseFloat(selectedNEO.velocity);

      // Asegurarse de que 'size' y 'velocity' sean números válidos
      if (!isNaN(size) && !isNaN(velocity)) {
        document.getElementById("meteor-size").textContent = `${size.toFixed(2)} m`;
        document.getElementById("meteor-velocity").textContent = `${velocity.toFixed(1)} km/h`;
      } else {
        console.error("El tamaño o la velocidad no son números válidos", selectedNEO);
      }

      document.getElementById("meteor-hazard").textContent =
        selectedNEO.hazardLevel || "N/A"; // Asegúrate de que la propiedad hazardLevel esté disponible
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

    if (neoData && neoData.length > 0) {
      meteorSelect.innerHTML =
        '<option value="" disabled selected>Selecciona un meteorito</option>'; // Opción por defecto
      // Crear una opción por cada meteorito
      neoData.forEach((neo) => {
        const option = document.createElement("option");
        option.value = neo.name;
        option.textContent = `${neo.name} (${neo.size} m, ${neo.velocity} km/s)`;
        meteorSelect.appendChild(option);
      });
      console.log("Meteorite select populated.");
    } else {
      console.warn("No NEO data available to populate select.");
    }
  }





setupEventListeners() {
        const sizeSlider = document.getElementById('meteor-size');
        const speedSlider = document.getElementById('meteor-speed');
        const angleSlider = document.getElementById('meteor-angle');
        const startButton = document.getElementById('start-simulation');
        const resetButton = document.getElementById('reset-simulation');
        const mitigationButton = document.getElementById('mitigation-mode');
        const searchButton = document.getElementById('search-location');
        const locationInput = document.getElementById('location-input');

        sizeSlider.addEventListener('input', () => {
            document.getElementById('size-value').textContent = `${sizeSlider.value}m`;
        });

        speedSlider.addEventListener('input', () => {
            document.getElementById('speed-value').textContent = `${speedSlider.value} km/s`;
        });

        angleSlider.addEventListener('input', () => {
            document.getElementById('angle-value').textContent = `${angleSlider.value}°`;
        });

        startButton.addEventListener('click', () => this.startSimulation());
        resetButton.addEventListener('click', () => this.resetSimulation());
        mitigationButton.addEventListener('click', () => this.toggleMitigationPanel());
        searchButton.addEventListener('click', () => this.searchLocation());

        locationInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.searchLocation();
            }
        });
    }
  // Obtener los objetos cercanos a la Tierra (NEO) y actualizar los objetos NEO
  async fetchNearEarthObjects() {
    const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    // Procesar la respuesta y actualizar los objetos NEO
    this.nearEarthObjects = data.near_earth_objects.map((neo) => {
      return {
        name: neo.name,
        hazardLevel: neo.is_potentially_hazardous_asteroid ? "ALTO" : "MEDIO",
        size:
          (neo.estimated_diameter.meters.estimated_diameter_max +
            neo.estimated_diameter.meters.estimated_diameter_min) /
          2, // Promedio de tamaño
        velocity: neo.relative_velocity.kilometers_per_hour,
        score: Math.random() * 100, // Puntuación aleatoria
      };
    });

    // Actualizar estadísticas
    this.updateStatistics();
  }

  updateStatistics() {
    const hazardous = this.nearEarthObjects.filter(
      (neo) => neo.hazardLevel === "ALTO"
    ).length;
    const total = this.nearEarthObjects.length;
    const hazardousPercentage = (hazardous / total) * 100;
    const averageSize =
      this.nearEarthObjects.reduce((acc, neo) => acc + neo.size, 0) / total;
    const averageVelocity =
      this.nearEarthObjects.reduce((acc, neo) => acc + neo.velocity, 0) / total;

    this.statistics = {
      total: total,
      hazardous: hazardous,
      hazardousPercentage: hazardousPercentage.toFixed(2),
      averageSize: averageSize.toFixed(2),
      averageVelocity: averageVelocity.toFixed(2),
      lastUpdate: new Date(),
    };
  }

  async getNearEarthObjects() {
    if (this.nearEarthObjects.length === 0) {
      await this.fetchNearEarthObjects(); // Cargar datos si no están disponibles
    }
    return this.nearEarthObjects;
  }

  displayNearEarthObjects() {
    // Renderizar objetos NEO en la página
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

    container.innerHTML = ""; // Limpiar el contenedor

    this.nearEarthObjects.forEach((neo) => {
      const card = document.createElement("article");
      card.className = "hazard-card";
      card.innerHTML = `
                <div>
                    <h4>${neo.name}</h4>
                    <p class="hazard-meta">Tamaño: ${neo.size.toFixed(
                      2
                    )} m · Velocidad: ${neo.velocity.toFixed(1)} km/h</p>
                </div>
                <div class="hazard-meta">
                    <span class="hazard-level ${
                      neo.hazardLevel === "ALTO"
                        ? "hazard-level-high"
                        : "hazard-level-medium"
                    }">Nivel: ${neo.hazardLevel}</span>
                    <p>Puntuación: ${neo.score.toFixed(2)}/100</p>
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
    hazardPercentage.textContent = `${this.statistics.hazardousPercentage}% peligrosos`;
    averageSize.textContent = `${this.statistics.averageSize} m`;
    averageVelocity.textContent = `${this.statistics.averageVelocity} km/h`;
    lastUpdate.textContent = this.formatDate(this.statistics.lastUpdate);
  }

  getNEOStatistics() {
    return { ...this.statistics };
  }

  formatDate(date) {
    return date.toLocaleString("es-MX", {
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

