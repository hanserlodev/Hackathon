# 🌍 Near-Earth Object (NEO) Impact Assessment System# 🌍 Sistema de Evaluación de Impacto de Objetos Cercanos a la Tierra (NEO)# 🌍 Meteorite Impact Simulator



<div align="center">



![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)<div align="center">Single-page web application that demonstrates the effects of a meteorite impact using real NASA NEO data and OpenStreetMap population statistics. All visual and textual content utilizes technical English for professional scientific communication.

![Status](https://img.shields.io/badge/Status-Operational-success?style=for-the-badge)

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)



**Professional meteorite impact simulation system with real NASA data**![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)## 🚀 Features



[Live Demo](#) · [Report Bug](https://github.com/hanserlodev/Hackathon/issues) · [Request Feature](https://github.com/hanserlodev/Hackathon/issues) · [Español](SPANISH.md)![Status](https://img.shields.io/badge/Estado-Operacional-success?style=for-the-badge)- **Static 2D world map** with animated marker for impact point



</div>![License](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)- **Meteorite selector** with famous historical impacts and current NASA NEO data:



---  - 🎯 Manual Configuration mode



## 📋 Table of Contents**Sistema profesional de simulación de impactos de meteoritos con datos reales de NASA**  - 1036 Ganymed (40 km diameter - largest known NEO)



- [Main Features](#-main-features)  - Chicxulub Impactor (10 km - dinosaur extinction event)

- [Technologies and APIs](#-technologies-and-apis)

- [Installation](#-installation)[Demo en Vivo](#) · [Reportar Bug](https://github.com/hanserlodev/Hackathon/issues) · [Solicitar Función](https://github.com/hanserlodev/Hackathon/issues)  - Tunguska Event (60m - 1908 Siberia)

- [Usage](#-usage)

- [System Architecture](#-system-architecture)  - Chelyabinsk Meteor (20m - 2013 Russia)

- [Asteroid Database](#-asteroid-database)

- [Severity Classification](#-severity-classification)</div>  - Apophis (370m - 2029 close approach)

- [Technical Documentation](#-technical-documentation)

- [Troubleshooting](#-troubleshooting)  - Bennu (490m - OSIRIS-REx target)

- [Contributing](#-contributing)

- [License](#-license)---  - Real-time NEO data from NASA API



---- **Extended parameter ranges**:



## 🚀 Main Features## 📋 Tabla de Contenidos  - Diameter: 10m to 40,000m (40 km)



### 📡 NASA Integration  - Velocity: 11 km/s to 1,000 km/s

- **35+ real asteroids** from NASA SBDB database

- **154+ NEOs** updated in real-time- [Características Principales](#-características-principales)  - Entry angle: 10° to 90°

- **Complete orbital data** with Keplerian elements

- **Direct links** to NASA Eyes on Asteroids and official SBDB- [Tecnologías y APIs](#-tecnologías-y-apis)- **Dynamic population data** from OpenStreetMap via Overpass API



### 🎯 Realistic Simulation- [Instalación](#-instalación)- **Real casualty estimates** based on actual population density

- Physics calculations based on validated scientific models

- Real population data from OpenStreetMap- [Uso](#-uso)- **Immediate simulation** with screen shake and brief flash on initialization

- Damage estimation with 4 destruction zones

- Seismic, thermal, and shockwave analysis- [Arquitectura del Sistema](#-arquitectura-del-sistema)- **Statistics panel** with weekly NEO sample values



### 🗺️ Interactive Visualization- [Base de Datos de Asteroides](#-base-de-datos-de-asteroides)- **Hazard alerts** for potentially hazardous asteroids

- 2D map with animated impact marker

- Location selector with geographic search- [Clasificación de Severidad](#-clasificación-de-severidad)- **Mitigation panel** with Kinetic Impact, Gravity Tractor, Laser Ablation, and Underground Shelter strategies

- Professional loading screen with real-time progress

- NASA-themed interface with animations- [Documentación Técnica](#-documentación-técnica)



### 📊 Dynamic Severity Analysis- [Solución de Problemas](#-solución-de-problemas)## 🧪 Usage

- Automatic classification in 5 threat levels

- Analysis of affected critical infrastructure- [Contribuir](#-contribuir)1. Open `index.html` in your preferred browser (or launch test server with `python server.py`)

- Emergency response plan generation

- Assessment of medical facilities and essential services- [Licencia](#-licencia)2. **Select a meteorite** from dropdown:



### 🎛️ Configurable Parameters   - Choose "Manual Configuration" to use custom sliders

- **Diameter**: 10m to 40,000m (40 km)

- **Velocity**: 11 km/s to 1,000 km/s---   - Select any famous meteorite (e.g., "1036 Ganymed") to auto-populate parameters

- **Entry angle**: 10° to 90°

- **Material density**: Iron, stone, ice, gold, carbon, comet   - Select a current NEO from NASA data

- **Automatic update** based on asteroid type

## 🚀 Características Principales3. Enter a reference city (Denver, New York, Tokyo, London, etc.) or coordinates `lat, lon` and press **Search**

---

4. Adjust meteorite size, velocity, and angle controls (if in manual mode)

## 🛠️ Technologies and APIs

### 📡 Integración con NASA5. Click **Initialize Simulation** to:

### Integrated NASA APIs

- **35+ asteroides reales** de la base de datos NASA SBDB   - Calculate destruction radius

#### 1. NASA Small-Body Database (SBDB) API

```- **154+ NEOs** actualizados en tiempo real   - Query real population data from OpenStreetMap

Endpoint: https://ssd-api.jpl.nasa.gov/sbdb.api

```- **Datos orbitales completos** con elementos Keplerianos   - Compute casualties based on actual population

- Detailed data of individual asteroids

- Complete Keplerian orbital elements- **Enlaces directos** a NASA Eyes on Asteroids y SBDB oficial   - Display results with page vibration and flash effect

- Physical properties (diameter, albedo, magnitude)

- NEO/PHA classification6. Review calculated impact metrics:



#### 2. NASA SBDB Query API### 🎯 Simulación Realista   - Released Energy (Megatons of TNT)

```

Endpoint: https://ssd-api.jpl.nasa.gov/sbdb_query.api- Cálculos físicos basados en modelos científicos validados   - Crater Diameter

```

- Queries for Potentially Hazardous Asteroids (PHAs)- Datos de población real de OpenStreetMap   - Estimated Casualties (fatalities/injuries)

- Filtering by diameter, orbit, and classification

- Access to multiple asteroids simultaneously- Estimación de daños con 4 zonas de destrucción   - Destruction Radius



#### 3. NASA NEO Feed API- Análisis sísmico, térmico y de onda de choque   - Population Density (real data from OSM)

```

Endpoint: api.nasa.gov/neo/rest/v1/feed7. Explore secondary effects:

```

- 154+ updated Near-Earth Objects### 🗺️ Visualización Interactiva   - Seismic Activity (earthquake magnitude)

- Close approach data

- Size and velocity information- Mapa 2D con marcador de impacto animado   - Tsunami Wave height



#### 4. Eyes on Asteroids (3D Visualization)- Selector de ubicación con búsqueda geográfica   - Thermal Fires radius

```

URL: eyes.nasa.gov/apps/asteroids/- Pantalla de carga profesional con progreso en tiempo real   - Ejecta Cloud radius

```

- Official NASA/JPL 3D visualization- Interfaz temática NASA con animaciones8. Open **Mitigation Mode** to review available deflection strategies

- Direct links from each asteroid

- Correct format: `#/designation_name`



### Other Technologies### 📊 Análisis de Severidad Dinámico## 📊 How It Works



- **Frontend**: HTML5, CSS3, JavaScript ES6+- Clasificación automática en 5 niveles de amenaza

- **Maps**: Leaflet.js with OpenStreetMap

- **Geographic Data**: Overpass API (OpenStreetMap)- Análisis de infraestructura crítica afectada### Dynamic Data Flow

- **Backend**: Flask (Python) with CORS proxies

- **Animations**: CSS3 Animations + JavaScript- Generación de plan de respuesta de emergencia1. **Pre-calculation**: System calculates preliminary impact radius



---- Evaluación de instalaciones médicas y servicios esenciales2. **Overpass Query**: Queries OpenStreetMap with calculated radius



## 📥 Installation3. **Population Extraction**: Extracts real population from OSM tags



### Prerequisites### 🎛️ Parámetros Configurables4. **Final Calculation**: Recalculates all effects with real population density

- Python 3.8+

- Modern web browser (Chrome, Firefox, Edge)- **Diámetro**: 10m a 40,000m (40 km)



### Quick Installation- **Velocidad**: 11 km/s a 1,000 km/sSee `SIMULATION_FLOW.md` for detailed technical documentation.



```bash- **Ángulo de entrada**: 10° a 90°

# 1. Clone the repository

git clone https://github.com/hanserlodev/Hackathon.git- **Densidad de material**: Hierro, piedra, hielo, oro, carbón, cometa## 🛠️ Project Structure

cd Hackathon

- **Actualización automática** según tipo de asteroide- `styles.css` – Styles with support for animations, statistics panels, and alert messages

# 2. Install Python dependencies

pip install -r requirements.txt- `js/earth-map-2d.js` – Simplified Mercator projection and animated marker



# 3. Start the server---- `js/simulation.js` – Main simulation controller with technical messaging

python start.py

- `js/calculations.js` – Physical formulas for energy, damage radii, and secondary effects

# 4. Open in browser

# http://localhost:5000## 🛠️ Tecnologías y APIs- `js/nasa-api.js` – Static data provider and statistics panel renderer

```

- `js/mitigation-fixed.js` – Mitigation strategy logic

### Project Structure

### APIs de NASA Integradas- `js/main.js` – Lightweight entry point that initializes all modules

```

Hackathon/

├── index.html              # Main page

├── styles.css              # NASA theme styles#### 1. NASA Small-Body Database (SBDB) API## ▶️ Optional Python Execution

├── server.py               # Flask server with proxies

├── start.py                # Startup script```If you prefer a local server instead of opening the file directly, install dependencies and execute:

├── requirements.txt        # Python dependencies

├── config.json            # System configurationEndpoint: https://ssd-api.jpl.nasa.gov/sbdb.api```bash

│

├── js/                    # JavaScript modules```pip install -r requirements.txt

│   ├── main.js                      # Entry point

│   ├── simulation.js                # Simulation engine- Datos detallados de asteroides individualespython server.py

│   ├── calculations.js              # Physics calculations

│   ├── nasa-sbdb-api.js            # NASA SBDB API- Elementos orbitales Keplerianos completos```

│   ├── nasa-sbdb-init.js           # SBDB initialization

│   ├── known-asteroids.js          # 35+ asteroids database- Propiedades físicas (diámetro, albedo, magnitud)Then visit `http://localhost:5000` in your browser.

│   ├── nasa-api.js                  # NEO Feed API

│   ├── neo-database.js              # NEO management- Clasificación NEO/PHA

│   ├── neo-analysis-ui.js           # Analysis UI

│   ├── loading-screen.js            # Loading screen## 💡 Quick Tips

│   ├── emergency-protocols.js       # Severity classification

│   ├── overpass.js                  # OpenStreetMap API#### 2. NASA SBDB Query API- The message panel displays temporary warnings if input is invalid

│   ├── map.js                       # Map management

│   ├── earth-map-2d.js             # 2D rendering```- The map marker automatically adjusts when window is resized

│   └── server-integration.js        # Backend integration

│Endpoint: https://ssd-api.jpl.nasa.gov/sbdb_query.api- Statistics panel figures are test data; no internet connection required

├── python/                # Python scripts

│   ├── meteor_impact_2d.py         # 2D simulation```

│   ├── run_simulation.py           # Simulation runner

│   └── server.py                   # Alternative server- Consultas de asteroides potencialmente peligrosos (PHAs)## 🤝 Contributing

│

└── assets/                # Static resources- Filtrado por diámetro, órbita y clasificación1. Fork the repository

    └── fondostar.jpg              # Space background

```- Acceso a múltiples asteroides simultáneamente2. Create a working branch



---3. Implement your improvements (technical English comments recommended)



## 🎮 Usage#### 3. NASA NEO Feed API4. Submit a Pull Request describing the changes



### Quick Start```



1. **Select Meteorite**Endpoint: api.nasa.gov/neo/rest/v1/feedExplore impact scenarios with safe and controlled data! 🌠

   - Choose from 35+ real NASA asteroids

   - Or 154+ NEOs updated in real-time```

   - Or use "Custom Impact Parameters"- 154+ objetos cercanos a la Tierra actualizados

- Datos de aproximación cercana

2. **Choose Impact Location**- Información de tamaño y velocidad

   - Search city (e.g., "New York", "Tokyo", "London")

   - Or enter coordinates: `lat, lon` (e.g., `40.7128, -74.0060`)#### 4. Eyes on Asteroids (Visualización 3D)

   - Or click directly on the map```

URL: eyes.nasa.gov/apps/asteroids/

3. **View Orbital Data** (Optional)```

   - Click "View Orbital Data (NASA SBDB)"- Visualización 3D oficial de NASA/JPL

   - Review complete Keplerian elements- Enlaces directos desde cada asteroide

   - Visualize in NASA Eyes on Asteroids- Formato correcto: `#/designation_name`

   - Apply real data to simulation

### Otras Tecnologías

4. **Adjust Parameters** (If needed)

   - Meteorite diameter- **Frontend**: HTML5, CSS3, JavaScript ES6+

   - Entry velocity- **Mapas**: Leaflet.js con OpenStreetMap

   - Impact angle- **Datos Geográficos**: Overpass API (OpenStreetMap)

   - Material density (automatically updated)- **Backend**: Flask (Python) con proxies CORS

- **Animaciones**: CSS3 Animations + JavaScript

5. **Start Simulation**

   - Click "⚠️ START IMPACT ASSESSMENT"---

   - Wait for 3-phase analysis:

     - Phase 1: Terrain type detection## 📥 Installation

     - Phase 2: Impact effects calculation

     - Phase 3: Affected population analysis### Prerequisites

- Python 3.8+

6. **Review Results**- Modern web browser (Chrome, Firefox, Edge)

   - **Effects Panel**: Energy, crater, casualties, zones

   - **Severity Panel**: Dynamic 5-level classification### Quick Installation

   - **Affected Infrastructure**: Hospitals, schools, critical services

   - **Response Plan**: Automatically generated priority actions```bash

# 1. Clone the repository

### Featured Asteroidsgit clone https://github.com/hanserlodev/Hackathon.git

cd Hackathon

#### Potentially Hazardous Asteroids (PHAs) ⚠️

# 2. Install Python dependencies

| Asteroid | Diameter | Velocity | Characteristics |pip install -r requirements.txt

|----------|----------|----------|-----------------|

| **99942 Apophis** | 370 m | 30.7 km/s | Close approach in 2029 |# 3. Start the server

| **101955 Bennu** | 492 m | 27.5 km/s | OSIRIS-REx target |python start.py

| **1566 Icarus** | 1,400 m | 32.8 km/s | Sun-grazer |

| **1862 Apollo** | 1,500 m | 24.1 km/s | Apollo group prototype |# 4. Open in browser

| **4179 Toutatis** | 4,600 m | 34.3 km/s | Tumbling asteroid |# http://localhost:5000

```

#### Near-Earth Objects (NEOs) 🌍

### Project Structure

| Asteroid | Diameter | Mission/Achievement |

|----------|----------|---------------------|```

| **433 Eros** | 16,840 m | First orbited NEO (NEAR) |Hackathon/

| **162173 Ryugu** | 900 m | Hayabusa2 target |├── index.html              # Main page

| **25143 Itokawa** | 330 m | Hayabusa target |├── styles.css              # NASA theme styles

| **3200 Phaethon** | 5,100 m | Geminids shower origin |├── server.py               # Flask server with proxies

├── start.py                # Startup script

---├── requirements.txt        # Python dependencies

├── config.json            # System configuration

## 🏗️ System Architecture│

├── js/                    # JavaScript modules

### Data Flow│   ├── main.js                      # Entry point

│   ├── simulation.js                # Simulation engine

```│   ├── calculations.js              # Physics calculations

User → NASA SBDB API → Impact Calculations → Overpass API → │   ├── nasa-sbdb-api.js            # NASA SBDB API

Effects Simulation → Severity Classification → Visualization│   ├── nasa-sbdb-init.js           # SBDB initialization

```│   ├── known-asteroids.js          # 35+ asteroids database

│   ├── nasa-api.js                  # NEO Feed API

### Simulation Process│   ├── neo-database.js              # NEO management

│   ├── neo-analysis-ui.js           # Analysis UI

#### 1. Pre-calculation Phase│   ├── loading-screen.js            # Loading screen

- User provides parameters (location, meteorite)│   ├── emergency-protocols.js       # Severity classification

- System calculates preliminary effects with default density│   ├── overpass.js                  # OpenStreetMap API

- Determines initial destruction radius│   ├── map.js                       # Map management

│   ├── earth-map-2d.js             # 2D rendering

#### 2. Dynamic Overpass Query│   └── server-integration.js        # Backend integration

- Uses destruction radius to query OpenStreetMap│

- Obtains real population data├── python/                # Python scripts

- Extracts buildings, infrastructure, and amenities│   ├── meteor_impact_2d.py         # 2D simulation

│   ├── run_simulation.py           # Simulation runner

#### 3. Final Impact Calculation│   └── server.py                   # Alternative server

- Recalculates effects with real population density│

- Applies validated physical models└── assets/                # Static resources

- Generates all damage metrics    └── fondostar.jpg              # Space background

```

#### 4. Severity Classification

- Analyzes shockwave, seismic, thermal, and infrastructure---

- Classifies into 5 threat levels

- Generates automated response plan## 🎮 Usage



#### 5. Results Visualization### Quick Start

- Shows traditional effects panel

- Presents severity assessment panel1. **Select Meteorite**

- Lists affected critical infrastructure   - Choose from 35+ real NASA asteroids

- Provides priority actions   - Or 154+ NEOs updated in real-time

   - Or use "Custom Impact Parameters"

### Physics Calculations

2. **Choose Impact Location**

#### 1. Kinetic Energy   - Search city (e.g., "New York", "Tokyo", "London")

```   - Or enter coordinates: `lat, lon` (e.g., `40.7128, -74.0060`)

E = 0.5 * m * v²   - Or click directly on the map

m = (4/3) * π * r³ * ρ

```3. **View Orbital Data** (Optional)

   - Click "View Orbital Data (NASA SBDB)"

#### 2. Crater Diameter   - Review complete Keplerian elements

```   - Visualize in NASA Eyes on Asteroids

D = K * W^(1/3.4)   - Apply real data to simulation

```

Where K depends on impact type (land/ocean)4. **Adjust Parameters** (If needed)

   - Meteorite diameter

#### 3. Seismic Magnitude   - Entry velocity

```   - Impact angle

M = 0.67 * log₁₀(E) - 5.87   - Material density (automatically updated)

```

5. **Start Simulation**

#### 4. Impact Velocity   - Click "⚠️ START IMPACT ASSESSMENT"

```   - Wait for 3-phase analysis:

v² = GM * (2/r - 1/a)     - Phase 1: Terrain type detection

```     - Phase 2: Impact effects calculation

Vis-viva equation with Sun constants     - Phase 3: Affected population analysis



#### 5. Overpressure (Shockwave)6. **Review Results**

```   - **Effects Panel**: Energy, crater, casualties, zones

P = 10 * (E^0.33 / R)^1.5   - **Severity Panel**: Dynamic 5-level classification

dB = 20 * log₁₀(P / P_ref)   - **Affected Infrastructure**: Hospitals, schools, critical services

```   - **Response Plan**: Automatically generated priority actions



---### Featured Asteroids



## 📚 Asteroid Database#### Potentially Hazardous Asteroids (PHAs) ⚠️



### Included Asteroids (35+)| Asteroid | Diameter | Velocity | Characteristics |

|----------|----------|----------|-----------------|

- **8 Main PHAs**: Apophis, Bennu, Icarus, Apollo, Toutatis, Castalia, 1950 DA, Didymos| **99942 Apophis** | 370 m | 30.7 km/s | Close approach in 2029 |

- **8 Famous NEOs**: Ryugu, Eros, Aten, Itokawa, Phaethon, Geographos, Nereus, Golevka| **101955 Bennu** | 492 m | 27.5 km/s | OSIRIS-REx target |

- **3 Recent Approaches**: 2019 OK, 2012 DA14| **1566 Icarus** | 1,400 m | 32.8 km/s | Sun-grazer |

- **3 Amor Group**: Amor, Ganymed, Cruithne| **1862 Apollo** | 1,500 m | 24.1 km/s | Apollo group prototype |

- **13 Additional PHAs**: Hathor, Toro, Betulia, Sisyphus, Cuno, Heracles, Midas, Bacchus, Orpheus, 1994 CC, Cacus, and more| **4179 Toutatis** | 4,600 m | 34.3 km/s | Tumbling asteroid |



### Automatic Density Update#### Near-Earth Objects (NEOs) 🌍



The system automatically detects asteroid type and adjusts material density:| Asteroid | Diameter | Mission/Achievement |

|----------|----------|---------------------|

- **C-type (carbonaceous)** → carbon (2.2 g/cm³)| **433 Eros** | 16,840 m | First orbited NEO (NEAR) |

  - Bennu, Ryugu| **162173 Ryugu** | 900 m | Hayabusa2 target |

- **M-type (metallic)** → iron (7.8 g/cm³)| **25143 Itokawa** | 330 m | Hayabusa target |

  - Psyche, Kleopatra| **3200 Phaethon** | 5,100 m | Geminids shower origin |

- **Comets** → comet (0.0001 g/cm³)

  - All comets---

- **S-type (stony)** → stone (3.0 g/cm³) [default]

  - Other asteroids## 🏗️ System Architecture



---### Data Flow



## 🎯 Severity Classification```

User → NASA SBDB API → Impact Calculations → Overpass API → 

### 5-Level SystemEffects Simulation → Severity Classification → Visualization

```

#### Level 1: MINIMAL 🟢

- **Population**: ≤ 1,000### Simulation Process

- **Richter Scale**: 3.0 - 4.9

- **Shockwave**: < 140 dB SPL#### 1. Pre-calculation Phase

- **Thermal Radiation**: ≤ 10 km- User provides parameters (location, meteorite)

- **Action**: Local response- System calculates preliminary effects with default density

- Determines initial destruction radius

#### Level 2: MODERATE 🟡

- **Population**: 1,000 - 10,000#### 2. Dynamic Overpass Query

- **Richter Scale**: 5.0 - 5.9- Uses destruction radius to query OpenStreetMap

- **Shockwave**: 140-159 dB SPL- Obtains real population data

- **Thermal Radiation**: 30-50 km- Extracts buildings, infrastructure, and amenities

- **Action**: Regional response

#### 3. Final Impact Calculation

#### Level 3: MAJOR 🟠- Recalculates effects with real population density

- **Population**: 10,000 - 50,000- Applies validated physical models

- **Richter Scale**: 6.0 - 6.9- Generates all damage metrics

- **Shockwave**: 160-169 dB SPL

- **Thermal Radiation**: 70-90 km#### 4. Severity Classification

- **Action**: National response- Analyzes shockwave, seismic, thermal, and infrastructure

- Classifies into 5 threat levels

#### Level 4: CRITICAL 🔴- Generates automated response plan

- **Population**: 50,000 - 100,000

- **Richter Scale**: 7.0 - 7.9#### 5. Results Visualization

- **Shockwave**: 170-179 dB SPL- Shows traditional effects panel

- **Thermal Radiation**: 120-150 km- Presents severity assessment panel

- **Action**: International response- Lists affected critical infrastructure

- Provides priority actions

#### Level 5: CATASTROPHIC ⚫

- **Population**: > 100,000### Physics Calculations

- **Richter Scale**: ≥ 8.0

- **Shockwave**: ≥ 180 dB SPL#### 1. Kinetic Energy

- **Thermal Radiation**: 170-180 km```

- **Action**: Global responseE = 0.5 * m * v²

m = (4/3) * π * r³ * ρ

### Infrastructure Analysis```



The system identifies and classifies critical facilities:#### 2. Crater Diameter

```

- 🏥 **CRITICAL**: Hospitals, fire stations, policeD = K * W^(1/3.4)

- 📚 **HIGH**: Schools, gas stations, pharmacies, shelters```

- 🏛️ **MEDIUM**: Town halls, banks, librariesWhere K depends on impact type (land/ocean)

- 🏪 **LOW**: Other services

#### 3. Seismic Magnitude

---```

M = 0.67 * log₁₀(E) - 5.87

## 📖 Technical Documentation```



### Loading Screen#### 4. Impact Velocity

```

The system implements a professional loading screen that waits for all API data to load before displaying the application:v² = GM * (2/r - 1/a)

```

**Features:**Vis-viva equation with Sun constants

- ✨ Animation with NASA logo (🛰️)

- 📊 Real-time progress bar#### 5. Overpressure (Shockwave)

- 🔄 3 animated rotating rings```

- 📝 Detailed status messagesP = 10 * (E^0.33 / R)^1.5

dB = 20 * log₁₀(P / P_ref)

**Process:**```

1. "Initializing NASA APIs..." - Connecting to servers

2. "Loading NEO Feed API..." - Loading 154+ NEOs---

3. "Connecting to SBDB..." - Connecting database

4. "Fetching asteroid database..." - Loading 35+ asteroids## 📚 Asteroid Database

5. "✅ All data loaded" - System ready

### Included Asteroids (35+)

**Timeout:** 15 seconds if APIs fail

- **8 Main PHAs**: Apophis, Bennu, Icarus, Apollo, Toutatis, Castalia, 1950 DA, Didymos

### CORS Proxies (server.py)- **8 Famous NEOs**: Ryugu, Eros, Aten, Itokawa, Phaethon, Geographos, Nereus, Golevka

- **3 Recent Approaches**: 2019 OK, 2012 DA14

To avoid CORS errors, the Flask server provides proxies:- **3 Amor Group**: Amor, Ganymed, Cruithne

- **13 Additional PHAs**: Hathor, Toro, Betulia, Sisyphus, Cuno, Heracles, Midas, Bacchus, Orpheus, 1994 CC, Cacus, and more

```python

@app.route('/api/sbdb', methods=['GET'])### Automatic Density Update

def nasa_sbdb_proxy():

    """Proxy for NASA Small-Body Database API"""The system automatically detects asteroid type and adjusts material density:

    sstr = request.args.get('sstr')

    full_prec = request.args.get('full-prec', 'true')- **C-type (carbonaceous)** → carbon (2.2 g/cm³)

      - Bennu, Ryugu

    url = 'https://ssd-api.jpl.nasa.gov/sbdb.api'- **M-type (metallic)** → iron (7.8 g/cm³)

    params = {'sstr': sstr, 'full-prec': full_prec}  - Psyche, Kleopatra

    - **Comets** → comet (0.0001 g/cm³)

    response = requests.get(url, params=params, timeout=30)  - All comets

    return jsonify(response.json())- **S-type (stony)** → stone (3.0 g/cm³) [default]

```  - Other asteroids



### NASA Eyes Link Format---



The system uses the correct format for Eyes on Asteroids links:## 🎯 Severity Classification



```### 5-Level System

# Format: #/designation_name (lowercase with underscore)

# Examples:#### Level 1: MINIMAL 🟢

'99942 Apophis'    → '#/99942_apophis'- **Population**: ≤ 1,000

'433 Eros'         → '#/433_eros'- **Richter Scale**: 3.0 - 4.9

'162173 Ryugu'     → '#/162173_ryugu'- **Shockwave**: < 140 dB SPL

```- **Thermal Radiation**: ≤ 10 km

- **Action**: Local response

Complete mapping of 35+ asteroids implemented.

#### Level 2: MODERATE 🟡

---- **Population**: 1,000 - 10,000

- **Richter Scale**: 5.0 - 5.9

## 🔬 Scientific Models- **Shockwave**: 140-159 dB SPL

- **Thermal Radiation**: 30-50 km

### Academic References- **Action**: Regional response



1. **Collins, G.S., et al. (2005)** - "Earth Impact Effects Program"#### Level 3: MAJOR 🟠

2. **Holsapple & Schmidt (1987)** - "Crater scaling laws"- **Population**: 10,000 - 50,000

3. **Glasstone & Dolan (1977)** - "The Effects of Nuclear Weapons"- **Richter Scale**: 6.0 - 6.9

4. **Murray & Dermott (1999)** - "Solar System Dynamics"- **Shockwave**: 160-169 dB SPL

- **Thermal Radiation**: 70-90 km

### Implemented Formulas- **Action**: National response



#### Kepler's Equation#### Level 4: CRITICAL 🔴

```- **Population**: 50,000 - 100,000

M = E - e * sin(E)- **Richter Scale**: 7.0 - 7.9

```- **Shockwave**: 170-179 dB SPL

Solved iteratively with Newton-Raphson method- **Thermal Radiation**: 120-150 km

- **Action**: International response

#### True Anomaly

```#### Level 5: CATASTROPHIC ⚫

v = 2 * atan2(√(1+e)*sin(E/2), √(1-e)*cos(E/2))- **Population**: > 100,000

```- **Richter Scale**: ≥ 8.0

- **Shockwave**: ≥ 180 dB SPL

#### Radial Distance- **Thermal Radiation**: 170-180 km

```- **Action**: Global response

r = a * (1 - e * cos(E))

```### Infrastructure Analysis



---The system identifies and classifies critical facilities:



## 🐛 Troubleshooting- 🏥 **CRITICAL**: Hospitals, fire stations, police

- 📚 **HIGH**: Schools, gas stations, pharmacies, shelters

### Common Errors- 🏛️ **MEDIUM**: Town halls, banks, libraries

- 🏪 **LOW**: Other services

#### 1. CORS Error on NASA APIs

**Solution**: Flask server must be running:---

```bash

python start.py## 📖 Technical Documentation

```

### Loading Screen

#### 2. Empty Meteorite Selector

**Solution**:The system implements a professional loading screen that waits for all API data to load before displaying the application:

1. Wait 2-3 seconds for initial load

2. Refresh page (F5)**Features:**

3. Check internet connection- ✨ Animation with NASA logo (🛰️)

- 📊 Real-time progress bar

#### 3. "Map container is already initialized"- 🔄 3 animated rotating rings

**Solution**: Automatic double validation implemented- 📝 Detailed status messages



#### 4. Diameter: 0.00 km**Process:**

**Solution**: System uses local database with verified data as fallback1. "Initializing NASA APIs..." - Connecting to servers

2. "Loading NEO Feed API..." - Loading 154+ NEOs

#### 5. Velocity: NaN km/s3. "Connecting to SBDB..." - Connecting database

**Solution**: Automatic validation with default velocity (20 km/s)4. "Fetching asteroid database..." - Loading 35+ asteroids

5. "✅ All data loaded" - System ready

### Diagnostic Logs

**Timeout:** 15 seconds if APIs fail

For diagnostics, open browser console (F12) and check:

### CORS Proxies (server.py)

```javascript

// View loaded asteroidsTo avoid CORS errors, the Flask server provides proxies:

console.log(window.loadedAsteroids);

```python

// View available API functions@app.route('/api/sbdb', methods=['GET'])

console.log(window.NASASBDB);def nasa_sbdb_proxy():

```    """Proxy for NASA Small-Body Database API"""

    sstr = request.args.get('sstr')

---    full_prec = request.args.get('full-prec', 'true')

    

## 🤝 Contributing    url = 'https://ssd-api.jpl.nasa.gov/sbdb.api'

    params = {'sstr': sstr, 'full-prec': full_prec}

### How to Contribute    

    response = requests.get(url, params=params, timeout=30)

1. **Fork** the repository    return jsonify(response.json())

2. **Create** a branch for your feature (`git checkout -b feature/AmazingFeature`)```

3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)

4. **Push** to the branch (`git push origin feature/AmazingFeature`)### NASA Eyes Link Format

5. **Open** a Pull Request

The system uses the correct format for Eyes on Asteroids links:

### Areas for Improvement

```

- [ ] Add more asteroids to database (50+)# Format: #/designation_name (lowercase with underscore)

- [ ] Implement 3D visualization with Three.js# Examples:

- [ ] Add close approach predictions'99942 Apophis'    → '#/99942_apophis'

- [ ] Multi-language support (Spanish, Portuguese)'433 Eros'         → '#/433_eros'

- [ ] Offline mode with service workers'162173 Ryugu'     → '#/162173_ryugu'

- [ ] Export reports to PDF```

- [ ] Integration with JPL Horizons

Complete mapping of 35+ asteroids implemented.

---

---

## 📜 License

## 🔬 Scientific Models

This project is under the MIT License.

### Academic References

### Data Credits

1. **Collins, G.S., et al. (2005)** - "Earth Impact Effects Program"

- **NASA Jet Propulsion Laboratory** - Small-Body Database2. **Holsapple & Schmidt (1987)** - "Crater scaling laws"

- **NASA Open Data Portal** - NEO Feed API3. **Glasstone & Dolan (1977)** - "The Effects of Nuclear Weapons"

- **OpenStreetMap Contributors** - Geographic data4. **Murray & Dermott (1999)** - "Solar System Dynamics"

- **Eyes on Asteroids** - 3D visualizations

- **Leaflet.js** - Map library### Implemented Formulas



---#### Kepler's Equation

```

## 👥 AuthorsM = E - e * sin(E)

```

- **Hans Erlo** - [@hanserlodev](https://github.com/hanserlodev)Solved iteratively with Newton-Raphson method



---#### True Anomaly

```

## 📞 Contactv = 2 * atan2(√(1+e)*sin(E/2), √(1-e)*cos(E/2))

```

- GitHub: [@hanserlodev](https://github.com/hanserlodev)

- Project: [Hackathon](https://github.com/hanserlodev/Hackathon)#### Radial Distance

```

---r = a * (1 - e * cos(E))

```

<div align="center">

---

**⚠️ DISCLAIMER ⚠️**

## 🐛 Troubleshooting

This is an educational project for demonstration purposes. Calculations are based on simplified scientific models and should not be used for actual emergency planning. For professional impact threat assessments, consult official space agencies.

### Common Errors

---

#### 1. CORS Error on NASA APIs

**Developed with ❤️ for the scientific community****Solution**: Flask server must be running:

```bash

**Last update:** October 5, 2025  python start.py

**Version:** 2.0.0  ```

**Status:** ✅ Fully Operational

#### 2. Empty Meteorite Selector

</div>**Solution**:

1. Wait 2-3 seconds for initial load
2. Refresh page (F5)
3. Check internet connection

#### 3. "Map container is already initialized"
**Solution**: Automatic double validation implemented

#### 4. Diameter: 0.00 km
**Solution**: System uses local database with verified data as fallback

#### 5. Velocity: NaN km/s
**Solution**: Automatic validation with default velocity (20 km/s)

### Diagnostic Logs

For diagnostics, open browser console (F12) and check:

```javascript
// View loaded asteroids
console.log(window.loadedAsteroids);

// View available API functions
console.log(window.NASASBDB);
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork** the repository
2. **Create** a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Areas for Improvement

- [ ] Add more asteroids to database (50+)
- [ ] Implement 3D visualization with Three.js
- [ ] Add close approach predictions
- [ ] Multi-language support (Spanish, Portuguese)
- [ ] Offline mode with service workers
- [ ] Export reports to PDF
- [ ] Integration with JPL Horizons

---

## 📜 License

This project is under the MIT License.

### Data Credits

- **NASA Jet Propulsion Laboratory** - Small-Body Database
- **NASA Open Data Portal** - NEO Feed API
- **OpenStreetMap Contributors** - Geographic data
- **Eyes on Asteroids** - 3D visualizations
- **Leaflet.js** - Map library

---

## 👥 Authors

- **Hans Erlo** - [@hanserlodev](https://github.com/hanserlodev)

---

## 📞 Contact

- GitHub: [@hanserlodev](https://github.com/hanserlodev)
- Project: [Hackathon](https://github.com/hanserlodev/Hackathon)

---

<div align="center">

**⚠️ DISCLAIMER ⚠️**

This is an educational project for demonstration purposes. Calculations are based on simplified scientific models and should not be used for actual emergency planning. For professional impact threat assessments, consult official space agencies.

---

**Developed with ❤️ for the scientific community**

**Last update:** October 5, 2025  
**Version:** 2.0.0  
**Status:** ✅ Fully Operational

</div>
