// Initial map setup and marker creation
const map = L.map("map").setView([39.7392, -104.9903], 4); // Initial coordinates (Denver, CO)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let marker = null; // Variable to store the marker

// Function to update the location on the map and in the UI
function updateLocationInfo(lat, lon) {
  // Convert lat and lon to numbers, in case they arrive as strings
  lat = parseFloat(lat);
  lon = parseFloat(lon);

  if (isNaN(lat) || isNaN(lon)) {
    console.error("Invalid coordinates:", lat, lon);
    return;
  }

  if (marker) {
    marker.setLatLng([lat, lon]); // Update marker position
  } else {
    marker = L.marker([lat, lon]).addTo(map); // If it doesn't exist, create the marker
  }

  // Update the details in the HTML
  const locationInfo = document.getElementById("location-info");
  locationInfo.innerHTML = `
    <h4>📍 Ubicación Seleccionada</h4>
    <p><strong>Latitud:</strong> ${lat.toFixed(2)}°</p>
    <p><strong>Longitud:</strong> ${lon.toFixed(2)}°</p>
  `;

  getLocationDetails(lat, lon); // Call function to get location details
}

// Click event on the map to get the location and impact data
map.on("click", async function (event) {
  const lat = event.latlng.lat.toFixed(4);
  const lon = event.latlng.lng.toFixed(4);

  console.log("Selected coordinates:", lat, lon);

  // Update marker position on the map and UI information
  updateLocationInfo(lat, lon);

  const sideLength = 10000; // Impact area size in meters (adjustable)

  // Call Overpass function to get infrastructure and population data
  const { buildings, amenities, totalPopulation, populatedAreas } =
    await fetchImpactData(lat, lon, sideLength); // Make sure fetchImpactData is in overpass.js
  console.log("Nearby buildings:", buildings);
  console.log("Nearby infrastructure:", amenities);
  console.log("Total population:", totalPopulation);
  console.log("Populated areas:", populatedAreas);
});

function getLocationDetails(lat, lon) {
  const apiKey = "37eea66381f54ae78f6a16bb4cdda049"; // Use your OpenCage API key please dont use mine ;v
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        const address = data.results[0].components;

        // Extract only district, state/province and country
        const district =
          address.district || address.city_district || address.suburb || "";
        const state = address.state || address.province || address.region || "";
        const country = address.country || "";

        // Create location string with district, state and country
        const locationString = `${district ? district + ", " : ""}${
          state ? state + ", " : ""
        }${country}`;

        console.log("Address found:", locationString); // Check that it is obtained correctly

        // Call setLocationInUI with the new location
        setLocationInUI(lat, lon, locationString); // This function will update the UI
      } else {
        console.error("Location not found.");
      }
    })
    .catch((error) => {
      console.error("Error obtaining location details:", error);
    });
}

function setLocationInUI(lat, lon, locationString) {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (isNaN(latNum) || isNaN(lonNum)) {
    console.error("Invalid coordinates:", lat, lon);
    return;
  }

  // Update the text field with the location
  const input = document.getElementById("location-input");
  if (input) {
    input.value = `${locationString} (${latNum.toFixed(2)}, ${lonNum.toFixed(
      2
    )})`;
  }

  // Update the information container
  const locationInfoContainer = document.getElementById("location-info");
  if (locationInfoContainer) {
    locationInfoContainer.innerHTML = `
            <h4>📍 Location Selected</h4>
            <p><strong>Dirección:</strong> ${locationString}</p>
            <p><strong>Latitud:</strong> ${latNum.toFixed(2)}°</p>
            <p><strong>Longitud:</strong> ${lonNum.toFixed(2)}°</p>
        `;
  }
}
