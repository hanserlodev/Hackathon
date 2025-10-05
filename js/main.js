// Inicialización ligera de la aplicación / Lightweight application bootstrap.
const tody = new Date();
const lastWeek = new Date();
lastWeek.setDate(tody.getDate() - 7);

const start_date = lastWeek.toISOString().split("T")[0];
const end_date = tody.toISOString().split("T")[0];
console.log("Fechas para datos NEO:", start_date, end_date);

document.addEventListener("DOMContentLoaded", () => {
  const simulation = new MeteorSimulation();
  const dataProvider = new NASAAPI();
  const mitigationSystem = new MitigationSystem();

  window.MeteorSimulation = simulation;
  window.NASAAPI = dataProvider;
  window.MitigationSystem = mitigationSystem;

  // Mostrar datos simulados al inicio / Render simulated data on load.
  dataProvider.displayNearEarthObjects();

  console.log("Llamando a populateMeteoriteSelect");
  dataProvider.populateMeteoriteSelect(start_date, end_date);
  dataProvider.updateMeteoriteParameters();

  const meteorSelect = document.getElementById("meteor-select");
  meteorSelect.addEventListener("change", async (event) => {
    const selectedName = event.target.value;
    const neoData = await dataProvider.getNEOData();
    const selectedNEO = neoData.find((neo) => neo.name === selectedName);

    if (selectedNEO) {
      // Actualizar los parámetros del meteorito en la UI
      document.getElementById(
        "meteor-size"
      ).textContent = `${selectedNEO.size.toFixed(2)} m`;
      document.getElementById(
        "meteor-velocity"
      ).textContent = `${selectedNEO.velocity.toFixed(1)} km/h`;
      document.getElementById("meteor-hazard").textContent =
        selectedNEO.hazardLevel;
    }
  });
});

window.addEventListener("load", async () => {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error("No se encontró el contenedor del mapa.");
    return;
  }

  const map = L.map("map").setView([39.7392, -104.9903], 10);
  console.log(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let marker = null; // Variable para almacenar el marcador

// Evento de clic en el mapa
map.on("click", async function (e) {
  if (marker) {
    map.removeLayer(marker); // Eliminar el marcador si ya existe
  }

  // Añadir un marcador donde el usuario haga clic
  marker = L.marker(e.latlng).addTo(map);

  // Obtener las coordenadas del clic
  const lat = e.latlng.lat.toFixed(4);
  const lon = e.latlng.lng.toFixed(4);

  console.log("Coordenadas seleccionadas:", lat, lon);

  // Llamar a la función para obtener los detalles del lugar usando OpenCage
  getLocationDetails(lat, lon);

  // Actualizar el campo de texto con las coordenadas
  const input = document.getElementById("location-input");
  if (input) {
    input.value = `${lat}, ${lon}`; // Mostrar las coordenadas en el campo de texto
  }

  const squareSize = 5000; // Tamaño del área de impacto en metros (ajustable)

  // Llamar a la función para obtener los datos de infraestructura y población desde Overpass
  const data = await fetchImpactData(lat, lon, squareSize);

  if (data) {
    const { buildings, amenities, populations } = processImpactData(data);
    console.log("Edificios cercanos:", buildings);
    console.log(
      "Infraestructura cercanas (hospitales, escuelas, etc.):",
      amenities
    );
    console.log("Población cercana:", populations);
  } else {
    console.error("No se recibieron datos de Overpass API.");
  }
});

// Función para obtener detalles de la ubicación
function getLocationDetails(lat, lon) {
  const apiKey = '37eea66381f54ae78f6a16bb4cdda049'; // Usa tu clave API de OpenCage
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        const address = data.results[0].components;

        // Extraemos solo el distrito, provincia/departamento y país
        const district =
          address.district || address.city_district || address.suburb || "";
        const state = address.state || address.province || address.region || "";
        const country = address.country || "";

        // Creamos la cadena de ubicación con distrito, estado y país
        const locationString = `${district ? district + ", " : ""}${
          state ? state + ", " : ""
        }${country}`;

        console.log("Dirección encontrada:", locationString); // Verifica que se obtiene correctamente

        // Llamamos a setLocationInUI con la nueva ubicación
        setLocationInUI(lat, lon, locationString); // Esta función actualizará la UI
      } else {
        console.error("No se encontró la ubicación.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener detalles de la ubicación:", error);
    });
}

// Función para actualizar la UI con la nueva ubicación
function setLocationInUI(lat, lon, locationString) {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (isNaN(latNum) || isNaN(lonNum)) {
    console.error("Coordenadas inválidas:", lat, lon);
    return;
  }

  // Actualizamos el campo de texto con la ubicación
  const input = document.getElementById("location-input");
  if (input) {
    input.value = `${locationString} (${latNum.toFixed(2)}, ${lonNum.toFixed(
      2
    )})`;
  }

  // Actualizamos el contenedor de información
  const locationInfoContainer = document.getElementById("location-info");
  if (locationInfoContainer) {
    locationInfoContainer.innerHTML = `
            <h4>📍 Ubicación Seleccionada</h4>
            <p><strong>Dirección:</strong> ${locationString}</p>
            <p><strong>Latitud:</strong> ${latNum.toFixed(2)}°</p>
            <p><strong>Longitud:</strong> ${lonNum.toFixed(2)}°</p>
        `;
  }
}
})
