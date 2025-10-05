#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor Flask simplificado para el Simulador de Impacto de Meteoritos
"""

from flask import Flask, send_from_directory, request, jsonify
import json
import subprocess
import os
import threading
import time

app = Flask(__name__)

# Configuración
PYGAME_SCRIPT_PATH = os.path.join('python', 'meteor_impact_2d.py')
SIMULATION_DATA_FILE = 'simulation_data.json'

class SimulationManager:
    def __init__(self):
        self.current_process = None
        self.simulation_data = None
    
    def start_simulation(self, data):
        """Iniciar simulación 2D con datos específicos"""
        try:
            # Guardar datos en archivo JSON
            with open(SIMULATION_DATA_FILE, 'w') as f:
                json.dump(data, f)
            
            # Terminar simulación anterior si existe
            if self.current_process:
                self.current_process.terminate()
                self.current_process.wait()
            
            # Iniciar nueva simulación
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

# Instancia global del administrador de simulación
sim_manager = SimulationManager()

@app.route('/')
def index():
    """Página principal"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Servir archivos estáticos"""
    return send_from_directory('.', filename)

@app.route('/api/simulation/start', methods=['POST'])
def start_simulation():
    """Iniciar simulación 2D"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        # Validar datos requeridos
        required_fields = ['effects']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido faltante: {field}'}), 400
        
        # Iniciar simulación
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

@app.route('/api/nasa/neo', methods=['GET'])
def get_nasa_data():
    """Proxy para datos de la NASA API"""
    try:
        import requests
        
        # Parámetros de la consulta
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        api_key = request.args.get('api_key', 'DEMO_KEY')
        
        # Construir URL
        url = f"https://api.nasa.gov/neo/rest/v1/feed"
        params = {
            'api_key': api_key
        }
        
        if start_date:
            params['start_date'] = start_date
        if end_date:
            params['end_date'] = end_date
        
        # Realizar consulta
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/geocoding', methods=['GET'])
def geocoding():
    """Proxy para geocoding"""
    try:
        import requests
        
        query = request.args.get('q')
        if not query:
            return jsonify({'error': 'Parámetro q requerido'}), 400
        
        # Usar OpenStreetMap Nominatim
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'format': 'json',
            'q': query,
            'limit': 5
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/impact/calculate', methods=['POST'])
def calculate_impact():
    """Calcular efectos de impacto"""
    try:
        data = request.get_json()
        
        # Validar datos de entrada
        required_fields = ['diameter', 'velocity', 'density']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido faltante: {field}'}), 400
        
        # Simular cálculos (en una implementación real, usarías las funciones de JavaScript)
        diameter = float(data['diameter'])
        velocity = float(data['velocity'])
        density = data['density']
        
        # Cálculos simplificados
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
        
        # Calcular efectos
        crater_diameter = (energy_megatons ** 0.294) * 800
        total_destruction_zone = (energy_megatons ** 0.33) * 2.5
        severe_destruction_zone = (energy_megatons ** 0.33) * 5
        moderate_destruction_zone = (energy_megatons ** 0.33) * 10
        
        # Estimar víctimas (simplificado)
        population_density = data.get('population_density', 1000)
        fatalities = int(total_destruction_zone * total_destruction_zone * 3.14159 * population_density * 0.5)
        injuries = int(fatalities * 3)
        
        # Efectos secundarios
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
    

@app.route('/api/overpass', methods=['POST'])  # Debe aceptar POST, no GET
def get_overpass_data():
    """Proxy para Overpass API"""
    try:
        import requests  # Importar requests para usarlo en esta función
        # Obtener parámetros de consulta del frontend
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        square_size = int(request.args.get('squareSize', 5000))  # Tamaño del área de impacto en metros (ajustable)

        # Validar que las coordenadas sean válidas
        if not lat or not lon:
            return jsonify({'error': 'Coordenadas lat/lon son necesarias'}), 400

        # URL de Overpass API
        

        # Consulta Overpass API para obtener edificios, infraestructura y población
        query = f"""
            [out:json];
            (
              node["building"](around:{lat},{lon},{square_size});
              way["building"](around:{lat},{lon},{square_size});
              relation["building"](around:{lat},{lon},{square_size});
              
              node["amenity"](around:{lat},{lon},{square_size});
              way["amenity"](around:{lat},{lon},{square_size});
              relation["amenity"](around:{lat},{lon},{square_size});
              
              node["population"](around:{lat},{lon},{square_size});
            );
            out body;
            >;
            out skel qt;
        """
        overpass_url = "https://overpass-api.de/api/interpreter"
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
    print("📁 Sirviendo archivos desde:", os.getcwd())
    
    app.run(debug=True, host='0.0.0.0', port=5000)
