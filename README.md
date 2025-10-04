# 🌍 Simulador de Impacto de Meteoritos

Aplicación web en una sola página que ilustra los efectos de un impacto de meteorito utilizando datos simulados y una vista global en proyección Mercator. Todo el contenido visual y textual está disponible en español e inglés dentro de los comentarios del código para facilitar el mantenimiento bilingüe.

## 🚀 ¿Qué incluye?
- **Mapa mundial 2D estático** con marcador animado para el punto de impacto.
- **Panel de control** para ajustar tamaño, velocidad y densidad del meteorito.
- **Simulación inmediata** con sacudida de pantalla y destello breve al iniciar.
- **Panel de estadísticas** con los valores semanales de ejemplo:
  - Total de objetos: 121
  - Potencialmente peligrosos: 3 (2.5%)
  - Tamaño promedio: 88 m
  - Velocidad promedio: 13.8 km/s
  - Última actualización: 4/10/2025, 11:02:37 a. m.
- **Alertas destacadas** para los objetos 2021 ED5, 2021 SZ4, 2012 TA259, 2017 WK13 y 2020 GA2.
- **Panel de mitigación** con las estrategias de Impacto Cinético, Gravedad Artificial, Láser Ablativo y Refugios Subterráneos.

## 🧪 Cómo usarlo
1. Abre `index.html` en tu navegador preferido (o levanta el servidor de prueba con `python server.py`).
2. Escribe una ciudad de referencia (Ciudad de México, Madrid, Tokio, Buenos Aires, Nairobi) o coordenadas `lat, lon` y pulsa **Buscar**.
3. Ajusta los controles de tamaño y velocidad del meteorito.
4. Haz clic en **Iniciar Simulación** para ver los resultados, la vibración de la página y el destello.
5. Explora los datos calculados y las alertas simuladas en los paneles inferiores.
6. Abre **Modo Mitigación** para revisar las opciones disponibles después del impacto.

## 🛠️ Estructura relevante
- `styles.css` – Estilos con soporte para animaciones, paneles de estadísticas y mensajes de alerta.
- `js/earth-map-2d.js` – Proyección Mercator simplificada y marcador animado.
- `js/simulation.js` – Controlador principal de simulación con mensajes bilingües.
- `js/calculations.js` – Fórmulas físicas para energía, radios de daño y efectos secundarios.
- `js/nasa-api.js` – Proveedor de datos estáticos y renderer del panel de estadísticas.
- `js/mitigation-fixed.js` – Lógica de estrategias de mitigación.
- `js/main.js` – Punto de entrada ligero que inicializa todos los módulos.

## ▶️ Ejecución opcional con Python
Si prefieres un servidor local en lugar de abrir el archivo directamente, instala las dependencias y ejecuta:
```bash
pip install -r requirements.txt
python server.py
```
Luego visita `http://localhost:5000` en tu navegador.

## 💡 Consejos rápidos
- El panel de mensajes muestra avisos temporales si la entrada es inválida.
- El marcador del mapa se reajusta automáticamente al cambiar el tamaño de la ventana.
- Las cifras del panel de estadísticas son datos de prueba; no requieren conexión a internet.

## 🤝 Contribución
1. Haz fork del repositorio.
2. Crea una rama de trabajo.
3. Implementa tus mejoras (comentarios bilingües recomendados).
4. Envía un Pull Request describiendo los cambios.

¡Disfruta explorando escenarios de impacto con datos seguros y controlados! 🌠
