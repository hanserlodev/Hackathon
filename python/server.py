#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor Flask para integrar la simulación 2D con la aplicación web / Flask server integrating the 2D simulation with the web application.
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import subprocess
import os
import threading
import time
import requests
from flask_cors import CORS
from geopy.geocoders import Nominatim

app = Flask(__name__)
CORS(app)

# Configuración / Configuration.
PYGAME_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), 'meteor_impact_2d.py')
# Guardar archivo de datos en el directorio del proyecto / Save data file in the project directory.
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIMULATION_DATA_FILE = os.path.join(PROJECT_DIR, 'simulation_data.json')

class SimulationManager:
    def __init__(self):
        self.current_process = None
        self.simulation_data = None
    
    def start_simulation(self, data):
        """Iniciar simulación 2D con datos específicos"""
        try:
            # Guardar datos en archivo JSON / Save data to JSON file.
            with open(SIMULATION_DATA_FILE, 'w') as f:
                json.dump(data, f)
            
            # Terminar simulación anterior si existe / Terminate previous simulation if it exists.
            if self.current_process:
                self.current_process.terminate()
                self.current_process.wait()
            
            # Iniciar nueva simulación / Start new simulation.
            self.current_process = subprocess.Popen([
                'python', PYGAME_SCRIPT_PATH,
                '--data-file', SIMULATION_DATA_FILE
            ])
            
            self.simulation_data = data
            return True
            
        except Exception as e:
            print(f"Error al iniciar simulación: {e}")
            return False
    
    def stop_simulation(self):
        """Detener simulación actual"""
        if self.current_process:
            self.current_process.terminate()
            self.current_process.wait()
            self.current_process = None
    
    def is_running(self):
        """Verificar si la simulación está ejecutándose"""
        if self.current_process:
            return self.current_process.poll() is None
        return False

# Instancia global del administrador de simulación / Global simulation manager instance.
sim_manager = SimulationManager()

@app.route('/')
def index():
    """Página principal"""
    # Obtener el directorio padre (donde están los archivos HTML/CSS/JS) / Get the directory containing HTML/CSS/JS files.
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return send_from_directory(parent_dir, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Servir archivos estáticos"""
    # Obtener el directorio padre (donde están los archivos HTML/CSS/JS) / Get the directory containing HTML/CSS/JS files.
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return send_from_directory(parent_dir, filename)

@app.route('/api/simulation/start', methods=['POST'])
def start_simulation():
    """Iniciar simulación 2D"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        # Validar datos requeridos / Validate required data.
        required_fields = ['effects']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido faltante: {field}'}), 400
        
        # Iniciar simulación / Start simulation.
        success = sim_manager.start_simulation(data)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Simulación 2D iniciada correctamente',
                'pid': sim_manager.current_process.pid if sim_manager.current_process else None
            })
        else:
            return jsonify({'error': 'No se pudo iniciar la simulación'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulation/stop', methods=['POST'])
def stop_simulation():
    """Detener simulación 2D"""
    try:
        sim_manager.stop_simulation()
        return jsonify({
            'status': 'success',
            'message': 'Simulación detenida correctamente'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulation/status', methods=['GET'])
def simulation_status():
    """Obtener estado de la simulación"""
    try:
        return jsonify({
            'running': sim_manager.is_running(),
            'data': sim_manager.simulation_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/overpass', methods=['GET','POST'])
def get_overpass_data():
    """Proxy para Overpass API"""
    try:
        # Obtener parámetros de consulta del frontend
        lat = (request.args.get('lat'))
        lon = (request.args.get('lon'))
        side_length = int(request.args.get('sideLength', 5000))  # Tamaño del área de impacto en metros (ajustable)

        # Validar que las coordenadas sean válidas
        if not lat or not lon:
            return jsonify({'error': 'Coordenadas lat/lon son necesarias'}), 400
        
        # URL de Overpass API
        overpass_url = 'https://overpass-api.de/api/interpreter'
        
        # Consulta Overpass API para obtener edificios, infraestructura y población
        query = f"""
            [out:json];
            (
              node["building"](around:{lat},{lon},{side_length});
              way["building"](around:{lat},{lon},{side_length});
              relation["building"](around:{lat},{lon},{side_length});
              
              node["amenity"](around:{lat},{lon},{side_length});
              way["amenity"](around:{lat},{lon},{side_length});
              relation["amenity"](around:{lat},{lon},{side_length});
              
              node["population"](around:{lat},{lon},{side_length});
            );
            out body;
            >;
            out skel qt;
        """

        # Mostrar la consulta en la consola (útil para depuración)
        print(f"Consulta enviada a Overpass API: {query}")
        
        # Realizar la solicitud a Overpass API
        response = requests.post(overpass_url, data={'data': query})
        response.raise_for_status()  # Si hay un error, se lanzará una excepción

        # Devolver los datos obtenidos de Overpass API
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        # Capturar cualquier error de la solicitud (como problemas de red)
        return jsonify({'error': str(e)}), 500

@app.route('/api/geocoding', methods=['GET'])
def geocoding():
    """Proxy para geocoding (Nominatim usando Geopy)"""
    try:
        query = request.args.get('q')
        if not query:
            return jsonify({'error': 'Parámetro q requerido'}), 400
        
        print(f"Realizando solicitud a Nominatim para: {query}")
        
        # Usar Geopy con Nominatim
        geolocator = Nominatim(user_agent="MeteoriteImpactSimulatorHackathonNASA/1.0 (hanserlodev@gmail.com)")
        
        # Obtener la ubicación usando Geopy
        location = geolocator.reverse(query, language='es', addressdetails=True)
        
        if location:
            address = location.raw.get('address', {})
            print(f"Ubicación encontrada: {location.address}")
            
            # Formar la respuesta
            location_details = {
                'address': address,
                'latitude': location.latitude,
                'longitude': location.longitude
            }
            
            return jsonify(location_details)
        else:
            return jsonify({'error': 'No se encontró la ubicación'}), 404
        
    except Exception as e:
        print(f"Error al obtener detalles de la ubicación: {e}")
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500


@app.route('/api/impact/calculate', methods=['POST'])
def calculate_impact():
    """Calcular efectos de impacto"""
    try:
        data = request.get_json()
        
        # Validar datos de entrada / Validate input data.
        required_fields = ['diameter', 'velocity', 'density']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido faltante: {field}'}), 400
        
        # Simular cálculos (en una implementación real, usarías las funciones de JavaScript) / Simulate calculations (in a real implementation, JavaScript functions would be used).
        diameter = float(data['diameter'])
        velocity = float(data['velocity'])
        density = data['density']
        
        # Cálculos simplificados / Simplified calculations.
        density_values = {
            'iron': 7.8,
            'stone': 3.0,
            'ice': 0.9
        }
        
        density_kg_m3 = density_values.get(density, 3.0) * 1000
        radius = diameter / 2
        volume = (4/3) * 3.14159 * (radius ** 3)
        mass = volume * density_kg_m3
        velocity_ms = velocity * 1000
        energy_joules = 0.5 * mass * (velocity_ms ** 2)
        energy_megatons = energy_joules / (4.184e15)
        
        # Calcular efectos / Calculate effects.
        crater_diameter = (energy_megatons ** 0.294) * 800
        total_destruction_zone = (energy_megatons ** 0.33) * 2.5
        severe_destruction_zone = (energy_megatons ** 0.33) * 5
        moderate_destruction_zone = (energy_megatons ** 0.33) * 10
        
        # Estimar víctimas (simplificado) / Estimate casualties (simplified).
        population_density = data.get('population_density', 1000)
        fatalities = int(total_destruction_zone * total_destruction_zone * 3.14159 * population_density * 0.5)
        injuries = int(fatalities * 3)
        
        # Efectos secundarios / Secondary effects.
        earthquake_magnitude = max(0, (energy_megatons ** 0.5) * 2)
        tsunami_height = max(1, (energy_megatons ** 0.4) * 20)
        fire_radius = max(1, (energy_megatons ** 0.33) * 3)
        dust_radius = max(5, (energy_megatons ** 0.33) * 15)
        
        result = {
            'mass': mass,
            'energy': energy_joules,
            'energyMegatons': energy_megatons,
            'craterDiameter': crater_diameter,
            'totalDestructionZone': total_destruction_zone,
            'severeDestructionZone': severe_destruction_zone,
            'moderateDestructionZone': moderate_destruction_zone,
            'casualties': {
                'fatalities': fatalities,
                'injuries': injuries,
                'totalAffected': fatalities + injuries
            },
            'earthquake': {
                'magnitude': earthquake_magnitude
            },
            'tsunami': {
                'height': tsunami_height
            },
            'fire': {
                'radius': fire_radius
            },
            'dust': {
                'radius': dust_radius
            },
            'impactClassification': {
                'level': 'Regional' if energy_megatons < 10 else 'Continental',
                'description': 'Impacto regional con daños significativos' if energy_megatons < 10 else 'Impacto continental con devastación masiva'
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# (Eliminado: función duplicada de geocoding)
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Manejar errores 404"""
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Manejar errores 500"""
    return jsonify({'error': 'Error interno del servidor'}), 500

def cleanup_on_exit():
    """Limpiar recursos al salir"""
    sim_manager.stop_simulation()
    if os.path.exists(SIMULATION_DATA_FILE):
        os.remove(SIMULATION_DATA_FILE)

if __name__ == '__main__':
    import atexit
    atexit.register(cleanup_on_exit)
    
    print("🌍 Iniciando Simulador de Impacto de Meteoritos")
    print("📡 Servidor Flask ejecutándose en http://localhost:5000")
    print("🎮 La simulación 2D se abrirá automáticamente cuando se inicie una simulación")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
