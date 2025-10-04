# 🌍 Simulador de Impacto de Meteoritos

Una herramienta web interactiva para simular los impactos de meteoritos en la Tierra, integrando datos de la NASA NEO API y proporcionando visualizaciones 3D y 2D de las consecuencias.

## 🚀 Características Principales

### Visualización 3D
- **Tierra interactiva** con Three.js
- **Simulación de trayectoria** de meteoritos
- **Efectos visuales** de impacto y explosión
- **Zonas de destrucción** visualizadas

### Vista 2D (Pygame)
- **Vista desde la superficie** de la Tierra
- **Efectos de explosión** en tiempo real
- **Destrucción de edificios** progresiva
- **Partículas de fuego y polvo**
- **Ondas de choque** animadas

### Cálculos Científicos
- **Energía liberada** en megatones de TNT
- **Estimación de víctimas** basada en densidad de población
- **Efectos secundarios**: terremotos, tsunamis, incendios
- **Zonas de destrucción** calculadas científicamente

### Métodos de Mitigación
- **Impacto cinético** para desviar meteoritos
- **Gravedad artificial** usando naves masivas
- **Láser ablativo** para vaporizar material
- **Refugios subterráneos** para proteger población

### Integración con APIs
- **NASA NEO API** para datos de meteoritos cercanos
- **Geocoding** para ubicaciones geográficas
- **Alertas en tiempo real** de objetos peligrosos

## 📋 Requisitos del Sistema

### Software Requerido
- **Python 3.8+** con pip
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Conexión a internet** para APIs externas

### Dependencias Python
```
Flask==2.3.3
pygame==2.5.2
requests==2.31.0
Werkzeug==2.3.7
```

## 🛠️ Instalación

### 1. Clonar o Descargar el Proyecto
```bash
git clone <url-del-repositorio>
cd meteor-impact-simulator
```

### 2. Instalar Dependencias Python
```bash
pip install -r requirements.txt
```

### 3. Verificar Instalación de Pygame
```bash
python -c "import pygame; print('Pygame instalado correctamente')"
```

## 🎮 Uso

### Iniciar el Servidor
```bash
python python/server.py
```

El servidor se ejecutará en `http://localhost:5000`

### Abrir la Aplicación Web
1. Abrir navegador web
2. Navegar a `http://localhost:5000`
3. La aplicación se cargará automáticamente

### Usar la Simulación

#### 1. Seleccionar Ubicación
- Escribir nombre de ciudad o coordenadas
- Ejemplo: "Madrid, España" o "40.4168, -3.7038"
- Hacer clic en "Buscar"

#### 2. Configurar Parámetros del Meteorito
- **Tamaño**: Deslizar entre 10m y 1000m
- **Velocidad**: Deslizar entre 11 km/s y 70 km/s
- **Densidad**: Seleccionar entre Hierro, Piedra o Hielo

#### 3. Iniciar Simulación
- Hacer clic en "Iniciar Simulación"
- Observar efectos en la visualización 3D
- Hacer clic en "Vista 2D" para simulación Pygame

#### 4. Aplicar Mitigación
- Hacer clic en "Modo Mitigación"
- Seleccionar método apropiado
- Observar reducción de efectos

## 🎯 Controles de la Vista 2D

### Teclado
- **ESPACIO**: Pausar/Reanudar simulación
- **D**: Mostrar/Ocultar panel de datos
- **E**: Mostrar/Ocultar efectos visuales
- **R**: Reiniciar simulación
- **ESC**: Salir

### Mouse
- **Clic izquierdo**: Interactuar con controles
- **Scroll**: Zoom en visualización 3D

## 📊 Interpretación de Resultados

### Clasificación de Impactos
- **Local**: < 0.001 MT - Daños menores
- **Regional**: 0.001-0.1 MT - Daños significativos
- **Continental**: 0.1-10 MT - Devastación masiva
- **Global**: 10-1000 MT - Cambio climático
- **Extinción**: > 1000 MT - Evento de extinción masiva

### Métricas Importantes
- **Energía Liberada**: Medida en megatones de TNT
- **Zona de Destrucción Total**: Radio donde todo es destruido
- **Víctimas Estimadas**: Basado en densidad de población
- **Magnitud del Terremoto**: Escala Richter
- **Altura del Tsunami**: Si el impacto es en océano

## 🔧 Configuración Avanzada

### Personalizar Servidor
Editar `python/server.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Modificar Cálculos
Editar `js/calculations.js` para ajustar fórmulas científicas.

### Personalizar Visualización
Editar `js/earth3d.js` para modificar efectos 3D.

## 🐛 Solución de Problemas

### Error: "Servidor Python no disponible"
1. Verificar que Python esté instalado
2. Instalar dependencias: `pip install -r requirements.txt`
3. Ejecutar servidor: `python python/server.py`

### Error: "Pygame no funciona"
1. Instalar Pygame: `pip install pygame`
2. Verificar drivers de audio
3. En Linux: `sudo apt-get install python3-pygame`

### Error: "No se pueden cargar datos de la NASA"
1. Verificar conexión a internet
2. La API de la NASA puede tener límites de velocidad
3. Usar datos simulados como alternativa

### Vista 2D no se abre
1. Verificar que Pygame esté instalado
2. Verificar permisos de ejecución
3. Revisar logs del servidor para errores

## 📈 Mejoras Futuras

### Funcionalidades Planificadas
- [ ] Simulación de múltiples meteoritos
- [ ] Integración con más APIs científicas
- [ ] Modo de realidad virtual
- [ ] Exportación de datos de simulación
- [ ] Comparación histórica de impactos
- [ ] Simulación de efectos climáticos a largo plazo

### Optimizaciones
- [ ] Caché de datos de la NASA
- [ ] Compresión de texturas 3D
- [ ] Optimización de partículas 2D
- [ ] Soporte para dispositivos móviles

## 🤝 Contribuciones

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama para nueva funcionalidad
3. Implementar cambios
4. Crear pull request

### Áreas de Contribución
- Mejoras en cálculos científicos
- Nuevos efectos visuales
- Optimización de rendimiento
- Documentación
- Pruebas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **NASA** por la API de objetos cercanos a la Tierra
- **Three.js** por la biblioteca de gráficos 3D
- **Pygame** por la biblioteca de juegos Python
- **OpenStreetMap** por el servicio de geocoding

## 📞 Soporte

Para reportar bugs o solicitar funcionalidades:
1. Crear issue en GitHub
2. Incluir descripción detallada
3. Adjuntar logs de error si aplica
4. Especificar sistema operativo y versión

---

**⚠️ Advertencia**: Esta herramienta es para fines educativos y de investigación. Los cálculos son aproximaciones basadas en modelos científicos simplificados. Para análisis serios de riesgo de impacto, consultar con expertos en el campo.
