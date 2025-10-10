# 🌍 Sistema de Evaluación de Impacto de Objetos Cercanos a la Tierra (NEO)# 🌍 Sistema de Evaluación de Impacto de Objetos Cercanos a la Tierra (NEO)



<div align="center"><div align="center">



![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)

![Status](https://img.shields.io/badge/Estado-Operacional-success?style=for-the-badge)![Status](https://img.shields.io/badge/Estado-Operacional-success?style=for-the-badge)

![License](https://img.shields.io/badge/Licencia-GPL--3.0-blue?style=for-the-badge)![License](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)



**Sistema profesional de simulación de impactos de meteoritos con datos reales de NASA y modelos científicos****Sistema profesional de simulación de impactos de meteoritos con datos reales de NASA**



[Reportar Bug](https://github.com/hanserlodev/Hackathon/issues) · [Solicitar Función](https://github.com/hanserlodev/Hackathon/issues) · [English](README.md)[Demo en Vivo](#) · [Reportar Bug](https://github.com/hanserlodev/Hackathon/issues) · [Solicitar Función](https://github.com/hanserlodev/Hackathon/issues) · [English](README.md)



</div></div>



------



## 📋 Tabla de Contenidos## 📋 Tabla de Contenidos



- [Descripción General](#-descripción-general)- [Características Principales](#-características-principales)

- [Características Principales](#-características-principales)- [Tecnologías y APIs](#-tecnologías-y-apis)

- [Stack Tecnológico](#-stack-tecnológico)- [Instalación](#-instalación)

- [Inicio Rápido](#-inicio-rápido)- [Uso](#-uso)

- [Guía de Uso](#-guía-de-uso)- [Arquitectura del Sistema](#-arquitectura-del-sistema)

- [Integración de Datos NASA](#-integración-de-datos-nasa)- [Base de Datos de Asteroides](#-base-de-datos-de-asteroides)

- [Contribuir](#-contribuir)- [Clasificación de Severidad](#-clasificación-de-severidad)

- [Licencia](#-licencia)- [Documentación Técnica](#-documentación-técnica)

- [Solución de Problemas](#-solución-de-problemas)

---- [Contribuir](#-contribuir)

- [Licencia](#-licencia)

## 🎯 Descripción General

---

Aplicación web de una sola página que simula impactos de meteoritos utilizando datos en tiempo real de objetos cercanos a la Tierra (NEO) de NASA y estadísticas de población de OpenStreetMap. El sistema proporciona evaluaciones científicas de impacto, incluyendo cálculos de liberación de energía, estimaciones de víctimas y protocolos de respuesta de emergencia.

## 🚀 Características Principales

**Capacidades Clave:**

- Datos en tiempo real de 154+ NEOs rastreados por NASA### 📡 Integración con NASA

- Base de datos histórica con 35+ asteroides notables- **35+ asteroides reales** de la base de datos NASA SBDB

- Cálculos físicos basados en modelos científicos- **154+ NEOs** actualizados en tiempo real

- Análisis de densidad poblacional vía OpenStreetMap- **Datos orbitales completos** con elementos Keplerianos

- Sistema de clasificación de severidad de emergencias- **Enlaces directos** a NASA Eyes on Asteroids y SBDB oficial



---### 🎯 Simulación Realista

- Cálculos físicos basados en modelos científicos validados

## 🚀 Características Principales- Datos de población real de OpenStreetMap

- Estimación de daños con 4 zonas de destrucción

### 📡 Integración con NASA- Análisis sísmico, térmico y de onda de choque

- **Datos NEO en tiempo real** vía APIs SBDB y NEO Feed de NASA

- **Elementos orbitales** con parámetros Keplerianos completos### 🗺️ Visualización Interactiva

- **Enlaces directos** a visualización NASA Eyes on Asteroids- Mapa 2D con marcador de impacto animado

- **35+ asteroides históricos** incluyendo Chicxulub, Apophis y Bennu- Selector de ubicación con búsqueda geográfica

- Pantalla de carga profesional con progreso en tiempo real

### 🎯 Simulación Científica- Interfaz temática NASA con animaciones

- **Cálculos basados en física** para liberación de energía y formación de cráteres

- **Datos de población real** desde la API Overpass de OpenStreetMap### 📊 Análisis de Severidad Dinámico

- **Evaluación de daños multi-zona** (cráter, onda de choque, térmico, ejecta)- Clasificación automática en 5 niveles de amenaza

- **Modelado sísmico y tsunamis** basado en parámetros de impacto- Análisis de infraestructura crítica afectada

- Generación de plan de respuesta de emergencia

### 📊 Análisis de Impacto- Evaluación de instalaciones médicas y servicios esenciales

- **Clasificación de severidad en 5 niveles** (Mínimo a Extinción)

- **Evaluación de infraestructura crítica** (hospitales, servicios, emergencias)### 🎛️ Parámetros Configurables

- **Estimación de víctimas** con proyecciones de lesiones/fallecimientos- **Diámetro**: 10m a 40,000m (40 km)

- **Protocolos de respuesta de emergencia** adaptados al nivel de amenaza- **Velocidad**: 11 km/s a 1,000 km/s

- **Ángulo de entrada**: 10° a 90°

### 🎛️ Parámetros Configurables- **Densidad de material**: Hierro, piedra, hielo, oro, carbón, cometa

- **Diámetro:** 10m a 40,000m- **Actualización automática** según tipo de asteroide

- **Velocidad:** 11 km/s a 1,000 km/s  

- **Ángulo de entrada:** 10° a 90°---

- **Densidad del material:** Hierro, piedra, hielo, carbono, cometa

## 🛠️ Tecnologías y APIs

---

### APIs de NASA Integradas

## 🛠️ Stack Tecnológico

#### 1. NASA Small-Body Database (SBDB) API

### APIs y Fuentes de Datos```

- **NASA SBDB API** - Base de datos de cuerpos pequeños para propiedades de asteroidesEndpoint: https://ssd-api.jpl.nasa.gov/sbdb.api

- **NASA NEO Feed API** - Seguimiento de objetos cercanos a la Tierra en tiempo real```

- **Overpass API** - Datos de densidad poblacional de OpenStreetMap- Datos detallados de asteroides individuales

- **NASA Eyes on Asteroids** - Integración de visualización 3D- Elementos orbitales Keplerianos completos

- Propiedades físicas (diámetro, albedo, magnitud)

### Tecnologías Frontend- Clasificación NEO/PHA

- **HTML5/CSS3** - Interfaz responsiva con diseño temático NASA

- **JavaScript ES6+** - Arquitectura modular con patrones async/await#### 2. NASA SBDB Query API

- **Leaflet.js** - Visualización de mapa interactivo 2D```

Endpoint: https://ssd-api.jpl.nasa.gov/sbdb_query.api

### Backend```

- **Python 3.8+** - Servidor Flask con proxy CORS- Consultas de asteroides potencialmente peligrosos (PHAs)

- **Librerías científicas** - Cálculos físicos estilo NumPy- Filtrado por diámetro, órbita y clasificación

- Acceso a múltiples asteroides simultáneamente

---

#### 3. NASA NEO Feed API

## 📥 Inicio Rápido```

Endpoint: api.nasa.gov/neo/rest/v1/feed

### Requisitos Previos```

- Python 3.8 o superior- 154+ objetos cercanos a la Tierra actualizados

- Navegador web moderno (Chrome, Firefox, Edge, Safari)- Datos de aproximación cercana

- Información de tamaño y velocidad

### Instalación

#### 4. Eyes on Asteroids (Visualización 3D)

```bash```

# Clonar repositorioURL: eyes.nasa.gov/apps/asteroids/

git clone https://github.com/hanserlodev/Hackathon.git```

cd Hackathon- Visualización 3D oficial de NASA/JPL

- Enlaces directos desde cada asteroide

# Instalar dependencias- Formato correcto: `#/designation_name`

pip install -r requirements.txt

### Otras Tecnologías

# Iniciar servidor

python start.py- **Frontend**: HTML5, CSS3, JavaScript ES6+

- **Mapas**: Leaflet.js con OpenStreetMap

# Abrir navegador en http://localhost:5000- **Datos Geográficos**: Overpass API (OpenStreetMap)

```- **Backend**: Flask (Python) con proxies CORS

- **Animaciones**: CSS3 Animations + JavaScript

### Alternativa: Acceso Directo al Archivo

```bash---

# Simplemente abrir index.html en tu navegador

# No requiere servidor para funcionalidad básica## 📥 Instalación

```

### Requisitos Previos

---- Python 3.8+

- Navegador web moderno (Chrome, Firefox, Edge)

## 🎮 Guía de Uso

### Instalación Rápida

### Flujo de Trabajo Básico

```bash

1. **Seleccionar Objeto de Impacto**# 1. Clonar el repositorio

   - Elegir entre 35+ asteroides históricos (Chicxulub, Apophis, Bennu, etc.)git clone https://github.com/hanserlodev/Hackathon.git

   - Seleccionar de 154+ NEOs de NASA en tiempo realcd Hackathon

   - Configurar parámetros personalizados manualmente

# 2. Instalar dependencias de Python

2. **Establecer Ubicación de Impacto**pip install -r requirements.txt

   - Buscar por nombre de ciudad (ej: "Tokio", "Nueva York", "Londres")

   - Ingresar coordenadas: `latitud, longitud`# 3. Iniciar el servidor

   - Hacer clic directamente en el mapapython start.py



3. **Ver Datos Orbitales** (Opcional)# 4. Abrir en navegador

   - Acceder a elementos orbitales completos de NASA SBDB# http://localhost:5000

   - Visualizar en el visor 3D NASA Eyes on Asteroids```

   - Aplicar parámetros reales del asteroide a la simulación

### Estructura del Proyecto

4. **Ajustar Parámetros** (Modo Personalizado)

   - Diámetro: 10m - 40,000m```

   - Velocidad: 11 km/s - 1,000 km/sHackathon/

   - Ángulo de entrada: 10° - 90°├── index.html              # Página principal

   - Tipo de material: Hierro, piedra, hielo, carbono, cometa├── styles.css              # Estilos temática NASA

├── server.py               # Servidor Flask con proxies

5. **Inicializar Simulación**├── start.py                # Script de inicio

   - Calcula radio de destrucción├── requirements.txt        # Dependencias Python

   - Consulta datos de población real desde OpenStreetMap├── config.json            # Configuración del sistema

   - Computa estimaciones de víctimas│

   - Muestra resultados con efectos visuales├── js/                    # Módulos JavaScript

│   ├── main.js                      # Punto de entrada

6. **Analizar Resultados**│   ├── simulation.js                # Motor de simulación

   - Liberación de energía (equivalente en Megatones TNT)│   ├── calculations.js              # Cálculos físicos

   - Diámetro y profundidad del cráter│   ├── nasa-sbdb-api.js            # API NASA SBDB

   - Estimaciones de víctimas (fallecimientos/lesiones)│   ├── nasa-sbdb-init.js           # Inicialización SBDB

   - Zonas de radio de destrucción│   ├── known-asteroids.js          # Base de datos 35+ asteroides

   - Densidad poblacional (datos reales OSM)│   ├── nasa-api.js                  # NEO Feed API

   - Efectos secundarios (sísmicos, térmicos, ejecta)│   ├── neo-database.js              # Gestión de NEOs

│   ├── neo-analysis-ui.js           # UI de análisis

7. **Revisar Protocolos de Emergencia**│   ├── loading-screen.js            # Pantalla de carga

   - Clasificación de severidad (5 niveles de amenaza)│   ├── emergency-protocols.js       # Clasificación severidad

   - Evaluación de impacto en infraestructura│   ├── overpass.js                  # API OpenStreetMap

   - Estrategias de mitigación recomendadas│   ├── map.js                       # Gestión del mapa

   - Cronograma de respuesta de emergencia│   ├── earth-map-2d.js             # Renderizado 2D

│   └── server-integration.js        # Integración backend

---│

├── python/                # Scripts Python

## 📡 Integración de Datos NASA│   ├── meteor_impact_2d.py         # Simulación 2D

│   ├── run_simulation.py           # Ejecutor de simulación

### Fuentes de Datos│   └── server.py                   # Servidor alternativo

│

**NASA Small-Body Database (SBDB)**└── assets/                # Recursos estáticos

```    └── fondostar.jpg              # Fondo espacial

https://ssd-api.jpl.nasa.gov/sbdb.api```

```

- Propiedades individuales de asteroides---

- Elementos orbitales Keplerianos

- Características físicas (diámetro, albedo, magnitud)## 🎮 Uso

- Clasificación NEO/PHA

### Inicio Rápido

**NASA NEO Feed API**

```1. **Seleccionar Meteorito**

https://api.nasa.gov/neo/rest/v1/feed   - Elige entre 35+ asteroides reales de NASA

```   - O 154+ NEOs actualizados en tiempo real

- 154+ objetos cercanos a la Tierra actualizados diariamente   - O usa "Parámetros de Impacto Personalizados"

- Datos de acercamiento cercano

- Información de tamaño y velocidad2. **Elegir Ubicación de Impacto**

   - Busca ciudad (ej: "Nueva York", "Tokio", "Londres")

**NASA Eyes on Asteroids**   - O ingresa coordenadas: `lat, lon` (ej: `40.7128, -74.0060`)

```   - O haz clic directamente en el mapa

https://eyes.nasa.gov/apps/asteroids/

```3. **Ver Datos Orbitales** (Opcional)

- Visualización 3D interactiva   - Clic en "Ver Datos Orbitales (NASA SBDB)"

- Seguimiento orbital en tiempo real   - Revisa elementos Keplerianos completos

- Enlaces de integración directa   - Visualiza en NASA Eyes on Asteroids

   - Aplica datos reales a la simulación

### Estructura de Base de Datos

4. **Ajustar Parámetros** (Si es necesario)

El sistema mantiene una base de datos curada de 35+ asteroides notables incluyendo:   - Diámetro del meteorito

- **NEOs Grandes**: 1036 Ganymed (40km), 433 Eros (16.8km)   - Velocidad de entrada

- **Impactos históricos**: Chicxulub (10km), Tunguska (60m), Chelyabinsk (20m)   - Ángulo de impacto

- **Objetivos de misiones**: Bennu (490m), Apophis (370m)   - Densidad del material (se actualiza automáticamente)

- **Acercamientos cercanos**: 99942 Apophis, 101955 Bennu

5. **Iniciar Simulación**

---   - Clic en "⚠️ INICIAR EVALUACIÓN DE IMPACTO"

   - Espera el análisis en 3 fases:

## 🤝 Contribuir     - Fase 1: Detección de tipo de terreno

     - Fase 2: Cálculo de efectos de impacto

¡Damos la bienvenida a contribuciones de la comunidad! Para contribuir:     - Fase 3: Análisis de población afectada



1. **Hacer Fork** del repositorio6. **Revisar Resultados**

2. **Crear** una rama de característica (`git checkout -b feature/mejora`)   - **Panel de Efectos**: Energía, cráter, víctimas, zonas

3. **Hacer Commit** de tus cambios (`git commit -m 'Agregar nueva característica'`)   - **Panel de Severidad**: Clasificación dinámica en 5 niveles

4. **Push** a la rama (`git push origin feature/mejora`)   - **Infraestructura Afectada**: Hospitales, escuelas, servicios críticos

5. **Abrir** un Pull Request   - **Plan de Respuesta**: Acciones prioritarias generadas automáticamente



### Directrices### Asteroides Destacados

- Usar inglés técnico para comentarios de código y documentación

- Seguir la estructura de código y convenciones de nombres existentes#### Asteroides Potencialmente Peligrosos (PHAs) ⚠️

- Incluir referencias científicas para cálculos físicos

- Probar exhaustivamente con varios parámetros de asteroides| Asteroide | Diámetro | Velocidad | Características |

|-----------|----------|-----------|-----------------|

---| **99942 Apophis** | 370 m | 30.7 km/s | Pasará cerca en 2029 |

| **101955 Bennu** | 492 m | 27.5 km/s | Objetivo OSIRIS-REx |

## 📄 Licencia| **1566 Icarus** | 1,400 m | 32.8 km/s | Cruzador del Sol |

| **1862 Apollo** | 1,500 m | 24.1 km/s | Prototipo grupo Apollo |

Este proyecto está licenciado bajo la **Licencia Pública General de GNU v3.0 (GPL-3.0)**.| **4179 Toutatis** | 4,600 m | 34.3 km/s | Asteroide tumbador |



### Qué Significa Esto#### Objetos Cercanos a la Tierra (NEOs) 🌍



✅ **PUEDES:**| Asteroide | Diámetro | Misión/Logro |

- Usar este software para cualquier propósito|-----------|----------|--------------|

- Estudiar y modificar el código fuente| **433 Eros** | 16,840 m | Primer NEO orbitado (NEAR) |

- Distribuir copias del software original| **162173 Ryugu** | 900 m | Objetivo Hayabusa2 |

- Distribuir versiones modificadas| **25143 Itokawa** | 330 m | Objetivo Hayabusa |

| **3200 Phaethon** | 5,100 m | Origen lluvia Gemínidas |

❗ **DEBES:**

- Divulgar el código fuente al distribuir---

- Licenciar trabajos derivados bajo GPL-3.0

- Incluir el aviso de copyright original## 🏗️ Arquitectura del Sistema

- Declarar cambios significativos hechos al código

### Flujo de Datos

🚫 **Protección Copyleft:**

Cualquier software que incorpore o esté basado en este proyecto también debe ser liberado como código abierto bajo GPL-3.0. Esto asegura que todos los derivados permanezcan libres y abiertos.```

Usuario → NASA SBDB API → Cálculos de Impacto → Overpass API → 

### Licencia CompletaSimulación de Efectos → Clasificación Severidad → Visualización

Consulta el archivo [LICENSE](LICENSE) para términos y condiciones completos, o visita:```

https://www.gnu.org/licenses/gpl-3.0.es.html

### Proceso de Simulación

---

#### 1. Fase de Pre-cálculo

<div align="center">- Usuario proporciona parámetros (ubicación, meteorito)

- Sistema calcula efectos preliminares con densidad por defecto

**Construido con 🌍 para investigación y educación en defensa planetaria**- Determina radio de destrucción inicial



Hecho con APIs públicas de NASA | [Reportar Problemas](https://github.com/hanserlodev/Hackathon/issues) | [Ver Documentación](README.md)#### 2. Consulta Dinámica a Overpass

- Usa radio de destrucción para consultar OpenStreetMap

</div>- Obtiene datos reales de población

- Extrae edificios, infraestructura y amenidades

#### 3. Cálculo Final de Impacto
- Recalcula efectos con densidad de población real
- Aplica modelos físicos validados
- Genera todas las métricas de daño

#### 4. Clasificación de Severidad
- Analiza onda de choque, sísmica, térmica e infraestructura
- Clasifica en 5 niveles de amenaza
- Genera plan de respuesta automatizado

#### 5. Visualización de Resultados
- Muestra panel de efectos tradicional
- Presenta panel de evaluación de severidad
- Lista infraestructura crítica afectada
- Proporciona acciones prioritarias

### Cálculos Físicos

#### 1. Energía Cinética
```
E = 0.5 * m * v²
m = (4/3) * π * r³ * ρ
```

#### 2. Diámetro del Cráter
```
D = K * W^(1/3.4)
```
Donde K depende del tipo de impacto (tierra/océano)

#### 3. Magnitud Sísmica
```
M = 0.67 * log₁₀(E) - 5.87
```

#### 4. Velocidad de Impacto
```
v² = GM * (2/r - 1/a)
```
Ecuación vis-viva con constantes del Sol

#### 5. Sobrepresión (Onda de Choque)
```
P = 10 * (E^0.33 / R)^1.5
dB = 20 * log₁₀(P / P_ref)
```

---

## 📚 Base de Datos de Asteroides

### Asteroides Incluidos (35+)

- **8 PHAs principales**: Apophis, Bennu, Icarus, Apollo, Toutatis, Castalia, 1950 DA, Didymos
- **8 NEOs famosos**: Ryugu, Eros, Aten, Itokawa, Phaethon, Geographos, Nereus, Golevka
- **3 Aproximaciones recientes**: 2019 OK, 2012 DA14
- **3 Grupo Amor**: Amor, Ganymed, Cruithne
- **13 PHAs adicionales**: Hathor, Toro, Betulia, Sisyphus, Cuno, Heracles, Midas, Bacchus, Orpheus, 1994 CC, Cacus, y más

### Actualización Automática de Densidad

El sistema detecta automáticamente el tipo de asteroide y ajusta la densidad del material:

- **C-type (carbonáceos)** → carbon (2.2 g/cm³)
  - Bennu, Ryugu
- **M-type (metálicos)** → iron (7.8 g/cm³)
  - Psyche, Kleopatra
- **Cometas** → comet (0.0001 g/cm³)
  - Todos los cometas
- **S-type (rocosos)** → stone (3.0 g/cm³) [default]
  - Resto de asteroides

---

## 🎯 Clasificación de Severidad

### Sistema de 5 Niveles

#### Nivel 1: MÍNIMO 🟢
- **Población**: ≤ 1,000
- **Escala Richter**: 3.0 - 4.9
- **Onda de Choque**: < 140 dB SPL
- **Radiación Térmica**: ≤ 10 km
- **Acción**: Respuesta local

#### Nivel 2: MODERADO 🟡
- **Población**: 1,000 - 10,000
- **Escala Richter**: 5.0 - 5.9
- **Onda de Choque**: 140-159 dB SPL
- **Radiación Térmica**: 30-50 km
- **Acción**: Respuesta regional

#### Nivel 3: MAYOR 🟠
- **Población**: 10,000 - 50,000
- **Escala Richter**: 6.0 - 6.9
- **Onda de Choque**: 160-169 dB SPL
- **Radiación Térmica**: 70-90 km
- **Acción**: Respuesta nacional

#### Nivel 4: CRÍTICO 🔴
- **Población**: 50,000 - 100,000
- **Escala Richter**: 7.0 - 7.9
- **Onda de Choque**: 170-179 dB SPL
- **Radiación Térmica**: 120-150 km
- **Acción**: Respuesta internacional

#### Nivel 5: CATASTRÓFICO ⚫
- **Población**: > 100,000
- **Escala Richter**: ≥ 8.0
- **Onda de Choque**: ≥ 180 dB SPL
- **Radiación Térmica**: 170-180 km
- **Acción**: Respuesta global

### Análisis de Infraestructura

El sistema identifica y clasifica instalaciones críticas:

- 🏥 **CRÍTICO**: Hospitales, estaciones de bomberos, policía
- 📚 **ALTO**: Escuelas, gasolineras, farmacias, refugios
- 🏛️ **MEDIO**: Ayuntamientos, bancos, bibliotecas
- 🏪 **BAJO**: Otros servicios

---

## 📖 Documentación Técnica

### Pantalla de Carga

El sistema implementa una pantalla de carga profesional que espera a que todos los datos de las APIs se carguen antes de mostrar la aplicación:

**Características:**
- ✨ Animación con logo NASA (🛰️)
- 📊 Barra de progreso en tiempo real
- 🔄 3 anillos giratorios animados
- 📝 Mensajes de estado detallados

**Proceso:**
1. "Initializing NASA APIs..." - Conectando a servidores
2. "Loading NEO Feed API..." - Cargando 154+ NEOs
3. "Connecting to SBDB..." - Conectando base de datos
4. "Fetching asteroid database..." - Cargando 35+ asteroides
5. "✅ All data loaded" - Sistema listo

**Timeout:** 15 segundos si las APIs fallan

### Proxies CORS (server.py)

Para evitar errores CORS, el servidor Flask proporciona proxies:

```python
@app.route('/api/sbdb', methods=['GET'])
def nasa_sbdb_proxy():
    """Proxy para NASA Small-Body Database API"""
    sstr = request.args.get('sstr')
    full_prec = request.args.get('full-prec', 'true')
    
    url = 'https://ssd-api.jpl.nasa.gov/sbdb.api'
    params = {'sstr': sstr, 'full-prec': full_prec}
    
    response = requests.get(url, params=params, timeout=30)
    return jsonify(response.json())
```

### Formato de Enlaces NASA Eyes

El sistema utiliza el formato correcto para enlaces de Eyes on Asteroids:

```
# Formato: #/designation_name (lowercase con guión bajo)
# Ejemplos:
'99942 Apophis'    → '#/99942_apophis'
'433 Eros'         → '#/433_eros'
'162173 Ryugu'     → '#/162173_ryugu'
```

Mapeo completo de 35+ asteroides implementado.

---

## 🔬 Modelos Científicos

### Referencias Académicas

1. **Collins, G.S., et al. (2005)** - "Earth Impact Effects Program"
2. **Holsapple & Schmidt (1987)** - "Crater scaling laws"
3. **Glasstone & Dolan (1977)** - "The Effects of Nuclear Weapons"
4. **Murray & Dermott (1999)** - "Solar System Dynamics"

### Fórmulas Implementadas

#### Ecuación de Kepler
```
M = E - e * sin(E)
```
Resuelto iterativamente con método de Newton-Raphson

#### Anomalía Verdadera
```
v = 2 * atan2(√(1+e)*sin(E/2), √(1-e)*cos(E/2))
```

#### Distancia Radial
```
r = a * (1 - e * cos(E))
```

---

## 🐛 Solución de Problemas

### Errores Comunes

#### 1. CORS Error en NASA APIs
**Solución**: El servidor Flask debe estar ejecutándose:
```bash
python start.py
```

#### 2. Selector de Meteoritos Vacío
**Solución**:
1. Esperar 2-3 segundos para carga inicial
2. Refrescar la página (F5)
3. Verificar conexión a internet

#### 3. "Map container is already initialized"
**Solución**: Implementada doble validación automática

#### 4. Diameter: 0.00 km
**Solución**: Sistema usa base de datos local con datos verificados como fallback

#### 5. Velocity: NaN km/s
**Solución**: Validación automática con velocidad por defecto (20 km/s)

### Logs de Diagnóstico

Para diagnóstico, abrir consola del navegador (F12) y verificar:

```javascript
// Ver asteroides cargados
console.log(window.loadedAsteroids);

// Ver funciones de API disponibles
console.log(window.NASASBDB);
```

---

## 🤝 Contribuir

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu función (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Áreas de Mejora

- [ ] Agregar más asteroides a la base de datos (50+)
- [ ] Implementar visualización 3D con Three.js
- [ ] Agregar predicciones de aproximación cercana
- [ ] Soporte multiidioma (inglés, portugués)
- [ ] Modo offline con service workers
- [ ] Exportar reportes en PDF
- [ ] Integración con JPL Horizons

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT.

### Créditos de Datos

- **NASA Jet Propulsion Laboratory** - Small-Body Database
- **NASA Open Data Portal** - NEO Feed API
- **OpenStreetMap Contributors** - Datos geográficos
- **Eyes on Asteroids** - Visualizaciones 3D
- **Leaflet.js** - Librería de mapas

---

## 👥 Autores

- **Hans Erlo** - [@hanserlodev](https://github.com/hanserlodev)

---

## 📞 Contacto

- GitHub: [@hanserlodev](https://github.com/hanserlodev)
- Proyecto: [Hackathon](https://github.com/hanserlodev/Hackathon)

---

<div align="center">

**⚠️ DESCARGO DE RESPONSABILIDAD ⚠️**

Este es un proyecto educativo con fines de demostración. Los cálculos se basan en modelos científicos simplificados y no deben usarse para planificación de emergencias real. Para evaluaciones profesionales de amenazas de impacto, consulte agencias espaciales oficiales.

---

**Desarrollado con ❤️ para la comunidad científica**

**Última actualización:** 5 de octubre de 2025  
**Versión:** 2.0.0  
**Estado:** ✅ Completamente Operacional

</div>
