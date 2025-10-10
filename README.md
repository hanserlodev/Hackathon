# 🌍 Near-Earth Object (NEO) Impact Assessment System

<div align="center">

![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)
![Status](https://img.shields.io/badge/Status-Operational-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)

**Professional meteorite impact simulation system with real NASA data**

[Report Bug](https://github.com/hanserlodev/Hackathon/issues) · [Request Feature](https://github.com/hanserlodev/Hackathon/issues) · [Español](README.es.md)

</div>



---

## 🎯 Overview

Web application that simulates meteorite impacts using real-time NASA Near-Earth Object (NEO) data and OpenStreetMap population statistics. Provides scientific impact assessments including energy calculations, casualty estimates, and emergency response protocols.

**Key Features:**
- 154+ real-time NASA NEO data
- 35+ historical asteroid database
- Physics-based impact calculations
- Real population density analysis
- 5-tier emergency severity classification

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/hanserlodev/Hackathon.git
cd Hackathon

# Install dependencies
pip install -r requirements.txt

# Start server
python start.py

# Open http://localhost:5000
```

---

## 📖 How to Use

1. **Select Meteorite** - Choose from 35+ NASA asteroids, 154+ live NEOs, or customize parameters
2. **Set Impact Location** - Click on map or search by city name
3. **View Orbital Data** (Optional) - Access NASA SBDB elements and visualize in NASA Eyes
4. **Run Simulation** - Initialize assessment, system calculates zones and queries population
5. **Analyze Results** - Review energy release, crater size, casualties, and emergency protocols


---

## 🛠️ Technology Stack

- **NASA SBDB API** - Asteroid orbital data
- **NASA NEO Feed API** - Real-time NEO tracking
- **OpenStreetMap Overpass API** - Population density data
- **Leaflet.js** - Interactive 2D mapping
- **Flask (Python)** - Backend server with CORS proxy

---

## 📊 Notable Asteroids

| Asteroid | Diameter | Type |
|----------|----------|------|
| **99942 Apophis** | 370m | PHA - 2029 close approach |
| **101955 Bennu** | 492m | OSIRIS-REx mission target |
| **433 Eros** | 16.8km | First orbited NEO |
| **Chicxulub** | 10km | Dinosaur extinction event |
| **1036 Ganymed** | 40km | Largest known NEO |
---

## 🤝 Contributing

Contributions welcome! Fork the repository, create a feature branch, commit your changes, and open a Pull Request.

**Guidelines:**
- Use technical English for code comments
- Follow existing code structure
- Include scientific references for physics calculations
- Test thoroughly with various parameters

---

## 📄 License

Licensed under **GNU General Public License v3.0 (GPL-3.0)**.

### Key Points

✅ **You Can:** Use, modify, and distribute this software freely

❗ **You Must:**
- **Disclose source code** when distributing
- **License derivatives under GPL-3.0** (copyleft requirement)
- Include original copyright notice
- State significant changes

� **Copyleft Protection:** Any derivative work **must** also be open source under GPL-3.0. This ensures the software and all derivatives remain free and open forever.

**Full License:** See [LICENSE](LICENSE) file or visit https://www.gnu.org/licenses/gpl-3.0.html

---

<div align="center">

**Built for planetary defense research and education 🌍**

Made with NASA APIs · [Report Issues](https://github.com/hanserlodev/Hackathon/issues)

⚠️ **Educational purposes only** - Not for actual emergency planning, but perhaps in the future

</div>
