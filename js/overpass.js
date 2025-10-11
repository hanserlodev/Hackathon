// Function to query Overpass API using sideLength (in meters)
async function fetchImpactData(lat, lon, sideLength) {
  const overpassUrl = "https://overpass-api.de/api/interpreter";

  // Convert lat and lon to numbers to ensure no errors
  lat = parseFloat(lat);
  lon = parseFloat(lon);

  if (isNaN(lat) || isNaN(lon)) {
    throw new Error("Invalid coordinates.");
  }

  // Ensure sideLength is a positive number and limit to reasonable range (100m to 100km)
  sideLength = Math.min(100000, Math.max(100, parseFloat(sideLength) || 5000));

  console.log(
    `Querying Overpass with radius: ${(sideLength / 1000).toFixed(2)} km`
  );

  // Calculate the coordinates of the square area
  const lat1 = lat - sideLength / 2 / 111320;
  const lon1 =
    lon - sideLength / 2 / (111320 * Math.cos((lat * Math.PI) / 180));
  const lat2 = lat + sideLength / 2 / 111320;
  const lon2 =
    lon + sideLength / 2 / (111320 * Math.cos((lat * Math.PI) / 180));

  // Create Overpass query (nodes, ways, relations) with population data
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["building"](${lat1},${lon1},${lat2},${lon2});
      way["building"](${lat1},${lon1},${lat2},${lon2});
      node["amenity"](${lat1},${lon1},${lat2},${lon2});
      way["amenity"](${lat1},${lon1},${lat2},${lon2});
      node["population"](${lat1},${lon1},${lat2},${lon2});
      way["population"](${lat1},${lon1},${lat2},${lon2});
      relation["population"](${lat1},${lon1},${lat2},${lon2});
      node["place"~"city|town|village|suburb|neighbourhood"](${lat1},${lon1},${lat2},${lon2});
      way["place"~"city|town|village|suburb|neighbourhood"](${lat1},${lon1},${lat2},${lon2});
    );
    out body;
    >;
    out skel qt;
  `;

  // Make the request to Overpass API
  const response = await fetch(
    `${overpassUrl}?data=${encodeURIComponent(overpassQuery)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching data from Overpass API: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("Datos recibidos de Overpass API:", data);

  // Verify if there is data
  if (!data || !data.elements || data.elements.length === 0) {
    console.warn(
      "No elements received from Overpass API for the provided coordinates. Using default population density."
    );
    return {
      buildings: [],
      amenities: [],
      totalPopulation: 0,
      populatedAreas: [],
    };
  }

  // IMPORTANT: Process the data here directly
  return processImpactData(data);
}

// Function to process data received from Overpass API
function processImpactData(data) {
  const buildings = [];
  const amenities = [];
  let totalPopulation = 0;
  let populatedAreas = [];

  if (!data || !data.elements || data.elements.length === 0) {
    console.error("No elements received from Overpass API.");
    return { buildings, amenities, totalPopulation, populatedAreas };
  }

  console.log("Total elements to process:", data.elements.length);

  // Process each received element
  data.elements.forEach((element) => {
    // Get coordinates based on element type
    let coordinates;
    if (element.lat && element.lon) {
      coordinates = [element.lon, element.lat]; // GeoJSON uses [lon, lat]
    } else if (element.geometry && element.geometry.coordinates) {
      coordinates = element.geometry.coordinates;
    } else {
      coordinates = null;
    }

    const item = {
      id: element.id,
      type: element.type,
      coordinates,
      tags: element.tags || {},
    };

    // Filter buildings
    if (element.tags && element.tags.building) {
      buildings.push(item);
    }

    // Filter amenities
    if (element.tags && element.tags.amenity) {
      // Classify criticality of amenity
      const amenityType = element.tags.amenity;
      const name = element.tags.name || amenityType;
      let criticality = "LOW";

      // CRITICAL: Emergency services and healthcare
      if (
        ["hospital", "clinic", "doctors", "fire_station", "police"].includes(
          amenityType
        )
      ) {
        criticality = "CRITICAL";
      }
      // HIGH: Essential services
      else if (
        ["school", "university", "fuel", "pharmacy", "shelter"].includes(
          amenityType
        )
      ) {
        criticality = "HIGH";
      }
      // MEDIUM: Important infrastructure
      else if (
        [
          "townhall",
          "post_office",
          "bank",
          "library",
          "community_centre",
        ].includes(amenityType)
      ) {
        criticality = "MEDIUM";
      }

      amenities.push({
        ...item,
        type: amenityType,
        name: name,
        criticality: criticality,
      });
    }

    // Extract population from tags
    if (element.tags && element.tags.population) {
      const pop = parseInt(element.tags.population);
      if (!isNaN(pop) && pop > 0) {
        totalPopulation += pop;
        populatedAreas.push({
          ...item,
          population: pop,
        });
      }
    }

    // Extract population from place tags (cities, towns, villages)
    if (element.tags && element.tags.place) {
      const placeTypes = ["city", "town", "village", "suburb", "neighbourhood"];
      if (placeTypes.includes(element.tags.place)) {
        if (element.tags.population) {
          const pop = parseInt(element.tags.population);
          if (!isNaN(pop) && pop > 0) {
            totalPopulation += pop;
            populatedAreas.push({
              ...item,
              population: pop,
              placeName: element.tags.name || "Unknown",
            });
          }
        }
      }
    }
  });

  return { buildings, amenities, totalPopulation, populatedAreas };
}

// Expose functions globally
window.fetchImpactData = fetchImpactData;
window.processImpactData = processImpactData;
