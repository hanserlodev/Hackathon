# Usa una imagen base de Python
FROM python:3.13-slim

# Instalar las dependencias necesarias para Pygame
RUN apt-get update && apt-get install -y \
    libsdl2-dev \
    libsdl2-image-dev \
    libsdl2-mixer-dev \
    libsdl2-ttf-dev \
    && rm -rf /var/lib/apt/lists/*

# Crear un directorio de trabajo
WORKDIR /app

# Copiar el código fuente del proyecto
COPY . /app

# Instalar las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Comando para ejecutar la aplicación
CMD ["python", "app.py"]  # Cambia esto si tu archivo principal no es `app.py`
