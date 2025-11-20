// Lightweight application bootstrap
const tody = new Date();
const lastWeek = new Date();
lastWeek.setDate(tody.getDate() - 7);

const start_date = lastWeek.toISOString().split("T")[0];
const end_date = tody.toISOString().split("T")[0];
console.log("NEO data date range:", start_date, end_date);

document.addEventListener("DOMContentLoaded", () => {
  const simulation = new MeteorSimulation();
  const dataProvider = new NASAAPI();

  window.MeteorSimulation = simulation;
  window.NASAAPI = dataProvider;

  // Display simulated data on initialization
  dataProvider.displayNearEarthObjects();
  dataProvider.populateMeteoriteSelect(start_date, end_date);
  dataProvider.updateMeteoriteParameters();

  const meteorSelect = document.getElementById("meteor-select");
  meteorSelect.addEventListener("change", async (event) => {
    const selectedValue = event.target.value;
    const selectedOption = event.target.options[event.target.selectedIndex];

    // Don't process if 'manual' is selected
    if (selectedValue === "manual") {
      console.log("Manual configuration mode selected");
      return;
    }

    let diameter, velocityKmS;

    // Check if it's a famous meteorite (has data attributes)
    if (selectedOption.dataset.size && selectedOption.dataset.velocity) {
      diameter = parseFloat(selectedOption.dataset.size);
      velocityKmS = parseFloat(selectedOption.dataset.velocity);

      console.log(`Famous meteorite selected: ${selectedValue}`);
      console.log(
        `Using stored values - Diameter: ${diameter}m, Velocity: ${velocityKmS} km/s`
      );
    } else {
      // It's a NEO from the API
      const neoData = await dataProvider.getNEOData(start_date, end_date);
      const selectedNEO = neoData.find((neo) => neo.name === selectedValue);

      if (!selectedNEO) {
        console.error("Selected meteorite not found in NEO data");
        return;
      }

      diameter = selectedNEO.size;
      // Convert velocity from km/h to km/s
      velocityKmS = selectedNEO.velocity / 3600;

      console.log(`NEO meteorite selected: ${selectedValue}`);
      console.log(
        `API values - Diameter: ${diameter.toFixed(
          2
        )}m, Velocity: ${velocityKmS.toFixed(2)} km/s`
      );
    }

    // Update sliders with meteorite data
    const sizeSlider = document.getElementById("meteor-size");
    const velocitySlider = document.getElementById("meteor-velocity");
    const densitySelect = document.getElementById("meteor-density");

    if (sizeSlider) {
      // Ensure diameter is within slider range
      const clampedDiameter = Math.min(Math.max(diameter, 10), 40000);
      sizeSlider.value = Math.round(clampedDiameter);

      const formatted =
        clampedDiameter >= 1000
          ? `${(clampedDiameter / 1000).toFixed(1)} km`
          : `${Math.round(clampedDiameter)}m`;
      document.getElementById("size-value").textContent = formatted;
    }

    if (velocitySlider) {
      // Ensure velocity is within slider range
      const clampedVelocity = Math.min(Math.max(velocityKmS, 11), 1000);
      velocitySlider.value = Math.round(clampedVelocity);
      document.getElementById("velocity-value").textContent = `${Math.round(
        clampedVelocity
      )} km/s`;
    }

    // Update material density based on asteroid type
    if (densitySelect) {
      // Try to determine asteroid type from name or properties
      const asteroidName = selectedValue.toLowerCase();
      let densityType = "stone"; // Default

      // C-type asteroids (carbonaceous) - dark, carbon-rich
      if (
        asteroidName.includes("bennu") ||
        asteroidName.includes("ryugu") ||
        asteroidName.includes("1999 jm8") ||
        asteroidName.includes("1999 rq36")
      ) {
        densityType = "carbon";
      }
      // M-type asteroids (metallic) - metal-rich
      else if (
        asteroidName.includes("psyche") ||
        asteroidName.includes("kleopatra")
      ) {
        densityType = "iron";
      }
      // Comets and icy bodies
      else if (
        asteroidName.includes("comet") ||
        asteroidName.includes("halley") ||
        selectedOption.dataset.type === "comet"
      ) {
        densityType = "comet";
      }
      // S-type asteroids (stony) - most common, default
      else {
        densityType = "stone";
      }

      densitySelect.value = densityType;
      console.log(`Material density set to: ${densityType}`);
    }

    console.log(`Sliders updated successfully`);
  });
});

window.addEventListener("load", async () => {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error("Map container element not found.");
    return;
  }

  // Check if map is already initialized - prevent double init
  if (window.impactMap) {
    console.log("Map already initialized, using existing instance");
    return;
  }

  // Check if Leaflet already initialized this container
  if (mapContainer._leaflet_id) {
    console.log("Leaflet already initialized this container");
    return;
  }

  const map = L.map("map").setView([39.7392, -104.9903], 4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Store map globally to prevent re-initialization
  window.impactMap = map;

  let marker = null;

  // Map click event handler
  map.on("click", async function (e) {
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map);

    const lat = e.latlng.lat.toFixed(4);
    const lon = e.latlng.lng.toFixed(4);

    getLocationDetails(lat, lon);
    const input = document.getElementById("location-input");
    if (input) {
      input.value = `${lat}, ${lon}`;
    }
  });

  // Simulation initialization event
  const startButton = document.getElementById("start-simulation");
  startButton.addEventListener("click", async () => {
    const locationInput = document.getElementById("location-input").value;
    const meteorSelect = document.getElementById("meteor-select").value;

    // Retrieve meteorite parameters and location
    const meteorDetails = await getMeteorDetails(meteorSelect);
    const [lat, lon] = locationInput
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Fetch infrastructure and population data from Overpass
    const overpassData = await fetchImpactData(lat, lon, 5000); // Assuming 5 km radius
    if (overpassData) {
      const { buildings, amenities, populations } = overpassData;

      // Calculate population density
      const areaKm2 = Math.pow(5000 / 1000, 2); // Convert 5000m side to km²
      const populationDensity = areaKm2 > 0 ? populations.length / areaKm2 : 0; // Simple density calculation

      // Instantiate ImpactCalculations
      const impactCalculations = new ImpactCalculations();

      // Perform calculations using retrieved details
      const results = impactCalculations.calculateAllEffects(
        meteorDetails.diameter,
        meteorDetails.velocity,
        meteorDetails.material,
        meteorDetails.impactAngle,
        populationDensity
      );

      // Calculate destruction radius
      const destructionRadius =
        impactCalculations.calculateTotalDestructionZone(
          results.energy,
          results.energyMegatons
        );

      // Update UI with calculated results
      updateImpactDataUI(results);

      // Display destruction radius in UI
      document.getElementById(
        "destruction-zone"
      ).textContent = `${destructionRadius.toFixed(2)} km`;
    } else {
      console.error("No data received from Overpass API.");
    }
  });

  // Function to retrieve meteorite details
  async function getMeteorDetails(meteorName) {
    const selectedNEO = await dataProvider.getNEOData();
    return selectedNEO.find((neo) => neo.name === meteorName);
  }

  // Function to update simulation results in UI
  function updateImpactDataUI(results) {
    // Update UI with calculated data
    document.getElementById(
      "energy-value"
    ).textContent = `${results.energyMegatons.toFixed(3)} MT`;
    document.getElementById(
      "crater-diameter"
    ).textContent = `${results.craterDiameter.toFixed(2)} km`;
    document.getElementById(
      "casualties"
    ).textContent = `${results.casualties.fatalities} fatalities / ${results.casualties.injuries} injuries`;
    document.getElementById(
      "destruction-zone"
    ).textContent = `${results.radiusOfDestruction.toFixed(2)} km`;

    // Secondary effects
    document.getElementById(
      "earthquake-magnitude"
    ).textContent = `Magnitude: ${results.impactClassification.level}`;
    document.getElementById(
      "tsunami-height"
    ).textContent = `Height: ${results.impactClassification.level}`;
    document.getElementById(
      "fire-radius"
    ).textContent = `${results.fireRadius.toFixed(2)} km`;
    document.getElementById(
      "dust-radius"
    ).textContent = `${results.dustCloudRadius.toFixed(2)} km`;
  }
});
