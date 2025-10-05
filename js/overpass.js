// Función para realizar la consulta a Flask (proxy de Overpass API)
async function fetchImpactData(lat, lon, squareSize) {
    const apiUrl = 'https://overpass-api.de/api/interpreter';  // URL del endpoint en Flask

    const latDiff = squareSize / 111320; // Aproximadamente 111.32 km por grado de latitud
    const lonDiff = squareSize / (40008000/360);    // Aproximadamente 111.32 km por grado de longitud

    const minLat = lat - latDiff / 2;
    const maxLat = lat + latDiff / 2;
    const minLon = lon - lonDiff / 2;
    const maxLon = lon + lonDiff / 2;

    const query = `
    [out:json];
    (
      node["building"](around:${lat},${lon},${squareSize}); 
      way["building"](around:${lat},${lon},${squareSize});
      relation["building"](around:${lat},${lon},${squareSize});
      
      node["amenity"](around:${lat},${lon},${squareSize});
      way["amenity"](around:${lat},${lon},${squareSize});
      relation["amenity"](around:${lat},${lon},${squareSize});
      
      node["population"](around:${lat},${lon},${squareSize});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&squareSize=${squareSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;



// Función para procesar la respuesta de Overpass y extraer los datos de infraestructura y población
function processImpactData(data) {
    const buildings = [];
    const amenities = [];
    const populations = [];
    
    if (data && data.elements) {
        data.elements.forEach(element => {
            // Procesar edificios (casas, escuelas, hospitales, etc.)
            if (element.type === 'node' && element.tags && element.tags.building) {
                const building = {
                    id: element.id,
                    type: element.type,
                    coordinates: [element.lat, element.lon]
                };
                buildings.push(building);
            } else if (element.type === 'way' && element.tags && element.tags.building) {
                const building = {
                    id: element.id,
                    type: element.type,
                    coordinates: getWayCoordinates(element, data.elements)
                };
                buildings.push(building);
            }

            // Procesar infraestructura (hospitales, escuelas, universidades, centros públicos, etc.)
            if (element.type === 'node' && element.tags && element.tags.amenity) {
                const amenity = {
                    id: element.id,
                    type: element.type,
                    amenity: element.tags.amenity,
                    coordinates: [element.lat, element.lon]
                };
                amenities.push(amenity);
            } else if (element.type === 'way' && element.tags && element.tags.amenity) {
                const amenity = {
                    id: element.id,
                    type: element.type,
                    amenity: element.tags.amenity,
                    coordinates: getWayCoordinates(element, data.elements)
                };
                amenities.push(amenity);
            }

            // Procesar población (ciudades, pueblos, aldeas)
            if (element.type === 'node' && element.tags && element.tags.population) {
                const population = {
                    id: element.id,
                    type: element.type,
                    population: element.tags.population,
                    coordinates: [element.lat, element.lon]
                };
                populations.push(population);
            }
        });
    }

    return { buildings, amenities, populations };
}

// Función auxiliar para obtener las coordenadas de un 'way' (línea o área)
function getWayCoordinates(way, elements) {
    return way.nodes.map(nodeId => {
        const node = elements.find(n => n.id === nodeId); // Buscar el nodo en los elementos
        return [node.lat, node.lon]; // Retornar las coordenadas del nodo
    });
}

// Función para mostrar los datos en la consola (sin visualización en el mapa)
async function fetchAndDisplayImpactData(lat, lon, radius) {
    // Consultar los datos de infraestructura y población cercanos a las coordenadas seleccionadas
    const data = await fetchImpactData(lat, lon, radius);

    // Procesar los datos obtenidos
    const { buildings, amenities, populations } = processImpactData(data);

    // Mostrar los datos de edificios, infraestructura y población en la consola
    console.log('Edificios cercanos:', buildings);
    console.log('Infraestructura cercanas (hospitales, escuelas, etc.):', amenities);
    console.log('Población cercana:', populations);
}

}