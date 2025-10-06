// Crear un nuevo archivo map.js para manejar solo el mapa

// Inicialización del mapa y creación del marcador
const map = L.map("map").setView([39.7392, -104.9903], 4); // Coordenadas de inicio (Denver, CO)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let marker = null; // Variable para almacenar el marcador

// Función para actualizar la ubicación en el mapa y en la UI
function updateLocationInfo(lat, lon) {
  // Convertir lat y lon a números, en caso de que lleguen como strings
  lat = parseFloat(lat);
  lon = parseFloat(lon);

  if (isNaN(lat) || isNaN(lon)) {
    console.error("Las coordenadas no son válidas:", lat, lon);
    return;
  }

  if (marker) {
    marker.setLatLng([lat, lon]); // Actualiza la posición del marcador
  } else {
    marker = L.marker([lat, lon]).addTo(map); // Si no existe, crea el marcador
  }

  // Actualizar los detalles en el HTML
  const locationInfo = document.getElementById('location-info');
  locationInfo.innerHTML = `
    <h4>📍 Ubicación Seleccionada</h4>
    <p><strong>Latitud:</strong> ${lat.toFixed(2)}°</p>
    <p><strong>Longitud:</strong> ${lon.toFixed(2)}°</p>
  `;

  getLocationDetails(lat, lon); // Llamar a la función para obtener detalles del lugar
}

// Evento de clic en el mapa para obtener la ubicación y los datos de impacto
map.on("click", async function (event) {
  const lat = event.latlng.lat.toFixed(4);
  const lon = event.latlng.lng.toFixed(4);

  console.log("Coordenadas seleccionadas:", lat, lon);

  // Actualizar el marcador en el mapa y la información de la UI
  updateLocationInfo(lat, lon);

  const sideLength = 10000; // Tamaño del área de impacto en metros (ajustable)

  // Llamar a la función de Overpass para obtener los datos de infraestructura y población
  const { buildings, amenities, totalPopulation, populatedAreas } = await fetchImpactData(lat, lon, sideLength); // Asegúrate de que fetchImpactData esté en overpass.js
    console.log("Edificios cercanos:", buildings);
    console.log("Infraestructura cercanas:", amenities);
    console.log("Población total:", totalPopulation);
    console.log("Áreas pobladas:", populatedAreas);
});

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
    input.value = `${locationString} (${latNum.toFixed(2)}, ${lonNum.toFixed(2)})`;
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