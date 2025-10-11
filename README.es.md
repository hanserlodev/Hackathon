# 🌍 Sistema de Evaluación de Impacto de Objetos Cercanos a la Tierra (NEO)

<div align="center">

![NASA Badge](https://img.shields.io/badge/NASA-API-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)
![Status](https://img.shields.io/badge/Estado-Operacional-success?style=for-the-badge)
![License](https://img.shields.io/badge/Licencia-GPL--3.0-blue?style=for-the-badge)

**Sistema profesional de simulación de impactos de meteoritos con datos reales de NASA**

[Reportar Bug](https://github.com/hanserlodev/Hackathon/issues) · [Solicitar Función](https://github.com/hanserlodev/Hackathon/issues) · [English](README.md)

</div>



---

## 🎯 Descripción General

Aplicación web que simula impactos de meteoritos utilizando datos en tiempo real de objetos cercanos a la Tierra (NEO) de NASA y estadísticas de población de OpenStreetMap. Proporciona evaluaciones científicas incluyendo cálculos de energía, estimaciones de víctimas y protocolos de respuesta de emergencia.

**Características Principales:**
- Datos en tiempo real de 154+ NEOs de NASA
- Base de datos con 35+ asteroides históricos
- Cálculos físicos basados en modelos científicos
- Análisis de densidad poblacional real
- Clasificación de severidad en 5 niveles

---

## 🚀 Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/hanserlodev/Hackathon.git
cd Hackathon

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python start.py

# Abrir http://localhost:5000
```

---

## 📖 Cómo Usar

1. **Seleccionar Meteorito** - Elegir entre 35+ asteroides NASA, 154+ NEOs en vivo, o personalizar parámetros
2. **Ubicación de Impacto** - Hacer clic en el mapa o buscar por nombre de ciudad
3. **Ver Datos Orbitales** (Opcional) - Acceder a elementos SBDB y visualizar en NASA Eyes
4. **Ejecutar Simulación** - Iniciar evaluación, el sistema calcula zonas y consulta población
5. **Analizar Resultados** - Revisar liberación de energía, tamaño del cráter, víctimas y protocolos


---

## 🛠️ Stack Tecnológico

- **NASA SBDB API** - Datos orbitales de asteroides
- **NASA NEO Feed API** - Seguimiento NEO en tiempo real
- **OpenStreetMap Overpass API** - Datos de densidad poblacional
- **Leaflet.js** - Mapas interactivos 2D
- **Flask (Python)** - Servidor backend con proxy CORS

---

## 📊 Asteroides Notables

| Asteroide | Diámetro | Tipo |
|-----------|----------|------|
| **99942 Apophis** | 370m | PHA - Acercamiento 2029 |
| **101955 Bennu** | 492m | Objetivo misión OSIRIS-REx |
| **433 Eros** | 16.8km | Primer NEO orbitado |
| **Chicxulub** | 10km | Evento extinción dinosaurios |
| **1036 Ganymed** | 40km | NEO más grande conocido |
---

## 🤝 Contribuir

¡Contribuciones bienvenidas! Hacer fork del repositorio, crear rama de característica, hacer commit de cambios y abrir Pull Request.

**Directrices:**
- Usar inglés técnico para comentarios de código
- Seguir estructura de código existente
- Incluir referencias científicas para cálculos físicos
- Probar exhaustivamente con varios parámetros

---

## 📄 Licencia

Licenciado bajo **GNU General Public License v3.0 (GPL-3.0)**.

### Puntos Clave

✅ **Puedes:** Usar, modificar y distribuir este software libremente

❗ **Debes:**
- **Divulgar el código fuente** al distribuir
- **Licenciar derivados bajo GPL-3.0** (requisito copyleft)
- Incluir aviso de copyright original
- Declarar cambios significativos

🔒 **Protección Copyleft:** Cualquier trabajo derivado **debe** también ser código abierto bajo GPL-3.0. Esto asegura que el software y todos sus derivados permanezcan libres y abiertos para siempre.

**Licencia Completa:** Ver archivo [LICENSE](LICENSE) o visitar https://www.gnu.org/licenses/gpl-3.0.html

---

<div align="center">

**Construido para investigación y educación en defensa planetaria 🌍**

Hecho con APIs de NASA · [Reportar Problemas](https://github.com/hanserlodev/Hackathon/issues)

⚠️ **Solo con fines educativos** - No para planificación de emergencias real, pero quizás en el futuro wazaa

</div>
