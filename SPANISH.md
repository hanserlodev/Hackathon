# 🌍 Sistema de Evaluación de Impacto de Objetos Cercanos a la Tierra (NEO)

<div align="center">

![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)
![Status](https://img.shields.io/badge/Estado-Operacional-success?style=for-the-badge)
![License](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)

**Sistema profesional de simulación de impactos de meteoritos con datos reales de NASA**

[Demo en Vivo](#) · [Reportar Bug](https://github.com/hanserlodev/Hackathon/issues) · [Solicitar Función](https://github.com/hanserlodev/Hackathon/issues) · [English](README.md)

</div>

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías y APIs](#-tecnologías-y-apis)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Base de Datos de Asteroides](#-base-de-datos-de-asteroides)
- [Clasificación de Severidad](#-clasificación-de-severidad)
- [Documentación Técnica](#-documentación-técnica)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🚀 Características Principales

### 📡 Integración con NASA
- **35+ asteroides reales** de la base de datos NASA SBDB
- **154+ NEOs** actualizados en tiempo real
- **Datos orbitales completos** con elementos Keplerianos
- **Enlaces directos** a NASA Eyes on Asteroids y SBDB oficial

### 🎯 Simulación Realista
- Cálculos físicos basados en modelos científicos validados
- Datos de población real de OpenStreetMap
- Estimación de daños con 4 zonas de destrucción
- Análisis sísmico, térmico y de onda de choque

### 🗺️ Visualización Interactiva
- Mapa 2D con marcador de impacto animado
- Selector de ubicación con búsqueda geográfica
- Pantalla de carga profesional con progreso en tiempo real
- Interfaz temática NASA con animaciones

### 📊 Análisis de Severidad Dinámico
- Clasificación automática en 5 niveles de amenaza
- Análisis de infraestructura crítica afectada
- Generación de plan de respuesta de emergencia
- Evaluación de instalaciones médicas y servicios esenciales

### 🎛️ Parámetros Configurables
- **Diámetro**: 10m a 40,000m (40 km)
- **Velocidad**: 11 km/s a 1,000 km/s
- **Ángulo de entrada**: 10° a 90°
- **Densidad de material**: Hierro, piedra, hielo, oro, carbón, cometa
- **Actualización automática** según tipo de asteroide

---

## 🛠️ Tecnologías y APIs

### APIs de NASA Integradas

#### 1. NASA Small-Body Database (SBDB) API
```
Endpoint: https://ssd-api.jpl.nasa.gov/sbdb.api
```
- Datos detallados de asteroides individuales
- Elementos orbitales Keplerianos completos
- Propiedades físicas (diámetro, albedo, magnitud)
- Clasificación NEO/PHA

#### 2. NASA SBDB Query API
```
Endpoint: https://ssd-api.jpl.nasa.gov/sbdb_query.api
```
- Consultas de asteroides potencialmente peligrosos (PHAs)
- Filtrado por diámetro, órbita y clasificación
- Acceso a múltiples asteroides simultáneamente

#### 3. NASA NEO Feed API
```
Endpoint: api.nasa.gov/neo/rest/v1/feed
```
- 154+ objetos cercanos a la Tierra actualizados
- Datos de aproximación cercana
- Información de tamaño y velocidad

#### 4. Eyes on Asteroids (Visualización 3D)
```
URL: eyes.nasa.gov/apps/asteroids/
```
- Visualización 3D oficial de NASA/JPL
- Enlaces directos desde cada asteroide
- Formato correcto: `#/designation_name`

### Otras Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Mapas**: Leaflet.js con OpenStreetMap
- **Datos Geográficos**: Overpass API (OpenStreetMap)
- **Backend**: Flask (Python) con proxies CORS
- **Animaciones**: CSS3 Animations + JavaScript

---

## 📥 Instalación

### Requisitos Previos
- Python 3.8+
- Navegador web moderno (Chrome, Firefox, Edge)

### Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/hanserlodev/Hackathon.git
cd Hackathon

# 2. Instalar dependencias de Python
pip install -r requirements.txt

# 3. Iniciar el servidor
python start.py

# 4. Abrir en navegador
# http://localhost:5000
```

### Estructura del Proyecto

```
Hackathon/
├── index.html              # Página principal
├── styles.css              # Estilos temática NASA
├── server.py               # Servidor Flask con proxies
├── start.py                # Script de inicio
├── requirements.txt        # Dependencias Python
├── config.json            # Configuración del sistema
│
├── js/                    # Módulos JavaScript
│   ├── main.js                      # Punto de entrada
│   ├── simulation.js                # Motor de simulación
│   ├── calculations.js              # Cálculos físicos
│   ├── nasa-sbdb-api.js            # API NASA SBDB
│   ├── nasa-sbdb-init.js           # Inicialización SBDB
│   ├── known-asteroids.js          # Base de datos 35+ asteroides
│   ├── nasa-api.js                  # NEO Feed API
│   ├── neo-database.js              # Gestión de NEOs
│   ├── neo-analysis-ui.js           # UI de análisis
│   ├── loading-screen.js            # Pantalla de carga
│   ├── emergency-protocols.js       # Clasificación severidad
│   ├── overpass.js                  # API OpenStreetMap
│   ├── map.js                       # Gestión del mapa
│   ├── earth-map-2d.js             # Renderizado 2D
│   └── server-integration.js        # Integración backend
│
├── python/                # Scripts Python
│   ├── meteor_impact_2d.py         # Simulación 2D
│   ├── run_simulation.py           # Ejecutor de simulación
│   └── server.py                   # Servidor alternativo
│
└── assets/                # Recursos estáticos
    └── fondostar.jpg              # Fondo espacial
```

---

## 🎮 Uso

### Inicio Rápido

1. **Seleccionar Meteorito**
   - Elige entre 35+ asteroides reales de NASA
   - O 154+ NEOs actualizados en tiempo real
   - O usa "Parámetros de Impacto Personalizados"

2. **Elegir Ubicación de Impacto**
   - Busca ciudad (ej: "Nueva York", "Tokio", "Londres")
   - O ingresa coordenadas: `lat, lon` (ej: `40.7128, -74.0060`)
   - O haz clic directamente en el mapa

3. **Ver Datos Orbitales** (Opcional)
   - Clic en "Ver Datos Orbitales (NASA SBDB)"
   - Revisa elementos Keplerianos completos
   - Visualiza en NASA Eyes on Asteroids
   - Aplica datos reales a la simulación

4. **Ajustar Parámetros** (Si es necesario)
   - Diámetro del meteorito
   - Velocidad de entrada
   - Ángulo de impacto
   - Densidad del material (se actualiza automáticamente)

5. **Iniciar Simulación**
   - Clic en "⚠️ INICIAR EVALUACIÓN DE IMPACTO"
   - Espera el análisis en 3 fases:
     - Fase 1: Detección de tipo de terreno
     - Fase 2: Cálculo de efectos de impacto
     - Fase 3: Análisis de población afectada

6. **Revisar Resultados**
   - **Panel de Efectos**: Energía, cráter, víctimas, zonas
   - **Panel de Severidad**: Clasificación dinámica en 5 niveles
   - **Infraestructura Afectada**: Hospitales, escuelas, servicios críticos
   - **Plan de Respuesta**: Acciones prioritarias generadas automáticamente

### Asteroides Destacados

#### Asteroides Potencialmente Peligrosos (PHAs) ⚠️

| Asteroide | Diámetro | Velocidad | Características |
|-----------|----------|-----------|-----------------|
| **99942 Apophis** | 370 m | 30.7 km/s | Pasará cerca en 2029 |
| **101955 Bennu** | 492 m | 27.5 km/s | Objetivo OSIRIS-REx |
| **1566 Icarus** | 1,400 m | 32.8 km/s | Cruzador del Sol |
| **1862 Apollo** | 1,500 m | 24.1 km/s | Prototipo grupo Apollo |
| **4179 Toutatis** | 4,600 m | 34.3 km/s | Asteroide tumbador |

#### Objetos Cercanos a la Tierra (NEOs) 🌍

| Asteroide | Diámetro | Misión/Logro |
|-----------|----------|--------------|
| **433 Eros** | 16,840 m | Primer NEO orbitado (NEAR) |
| **162173 Ryugu** | 900 m | Objetivo Hayabusa2 |
| **25143 Itokawa** | 330 m | Objetivo Hayabusa |
| **3200 Phaethon** | 5,100 m | Origen lluvia Gemínidas |

---

## 🏗️ Arquitectura del Sistema

### Flujo de Datos

```
Usuario → NASA SBDB API → Cálculos de Impacto → Overpass API → 
Simulación de Efectos → Clasificación Severidad → Visualización
```

### Proceso de Simulación

#### 1. Fase de Pre-cálculo
- Usuario proporciona parámetros (ubicación, meteorito)
- Sistema calcula efectos preliminares con densidad por defecto
- Determina radio de destrucción inicial

#### 2. Consulta Dinámica a Overpass
- Usa radio de destrucción para consultar OpenStreetMap
- Obtiene datos reales de población
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
