# 🚨 SOLUCIÓN RÁPIDA - Error "Endpoint no encontrado"

## Problema
El navegador muestra `{"error": "Endpoint no encontrado"}` en lugar de la aplicación web.

## Solución

### Opción 1: Usar el servidor corregido
```bash
python server.py
```

### Opción 2: Usar el script de prueba
```bash
python test_server.py
```

### Opción 3: Usar el script de inicio
```bash
python start.py
```

## Verificación
1. Abrir navegador en `http://localhost:5000`
2. Deberías ver la página del Simulador de Impacto de Meteoritos
3. Si aún hay problemas, revisar la consola del servidor

## Archivos importantes
- `server.py` - Servidor Flask corregido
- `index.html` - Página principal
- `styles.css` - Estilos
- `js/` - Archivos JavaScript
- `python/` - Simulación 2D con Pygame

## Comandos útiles
```bash
# Instalar dependencias
pip install flask pygame requests

# Verificar que Python funciona
python --version

# Verificar que Flask está instalado
python -c "import flask; print('Flask OK')"

# Verificar que Pygame está instalado
python -c "import pygame; print('Pygame OK')"
```

## Si el problema persiste
1. Verificar que estás en el directorio correcto del proyecto
2. Verificar que todos los archivos están presentes
3. Revisar la consola del servidor para errores
4. Intentar con un puerto diferente: cambiar `port=5000` a `port=8000` en server.py
