"""
Simplified Flask server for Meteorite Impact Simulator
Production-ready for Render deployment
"""

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import json
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration for production (no pygame needed in cloud)
SIMULATION_DATA_FILE = 'simulation_data.json'

@app.route('/')
def index():
    """Main page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/simulation/start', methods=['POST'])
def start_simulation():
    """Initialize simulation (web-based, no pygame in production)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Save simulation data for reference
        with open(SIMULATION_DATA_FILE, 'w') as f:
            json.dump(data, f)
        
        return jsonify({
            'status': 'success',
            'message': 'Simulation data saved successfully',
            'data': data
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulation/status', methods=['GET'])
def simulation_status():
    """Get simulation status"""
    try:
        # Try to read saved simulation data
        if os.path.exists(SIMULATION_DATA_FILE):
            with open(SIMULATION_DATA_FILE, 'r') as f:
                data = json.load(f)
            return jsonify({
                'running': True,
                'data': data
            })
        else:
            return jsonify({
                'running': False,
                'data': None
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/nasa/neo', methods=['GET'])
def get_nasa_data():
    """Proxy for NASA API data"""
    try:
        import requests
        
        # Query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        api_key = request.args.get('api_key', 'DEMO_KEY')
        
        # Build URL
        url = f"https://api.nasa.gov/neo/rest/v1/feed"
        params = {
            'api_key': api_key
        }
        
        if start_date:
            params['start_date'] = start_date
        if end_date:
            params['end_date'] = end_date
        
        #   Make request to NASA
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
            return jsonify({'error': 'Parameter q required'}), 400
        
        # Use Nominatim API for geocoding
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

@app.route('/api/sbdb', methods=['GET'])
def nasa_sbdb_proxy():
    """Proxy para NASA Small-Body Database API"""
    try:
        # Get query parameters
        sstr = request.args.get('sstr')
        full_prec = request.args.get('full-prec', 'true')
        
        if not sstr:
            return jsonify({'error': 'Parameter sstr required'}), 400
        
        # Make URL
        url = 'https://ssd-api.jpl.nasa.gov/sbdb.api'
        params = {
            'sstr': sstr,
            'full-prec': full_prec
        }
        
        # Make request to NASA
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sbdb_query', methods=['POST'])
def nasa_sbdb_query_proxy():
    """Proxy para NASA SBDB Query API"""
    try:
        # Get JSON body
        query_data = request.get_json()
        
        if not query_data:
            return jsonify({'error': 'Query data required'}), 400
        
        # API URL
        url = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api'
        
        # Make POST request to NASA
        response = requests.post(url, json=query_data, timeout=30)
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/impact/calculate', methods=['POST'])
def calculate_impact():
    """Calcular efectos de impacto"""
    try:
        data = request.get_json()
        
        # Validate data input
        required_fields = ['diameter', 'velocity', 'density']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Simulated calculations
        diameter = float(data['diameter'])
        velocity = float(data['velocity'])
        density = data['density']
        
        # Simplified calculations
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
        
        # Calculate effects
        crater_diameter = (energy_megatons ** 0.294) * 800
        total_destruction_zone = (energy_megatons ** 0.33) * 2.5
        severe_destruction_zone = (energy_megatons ** 0.33) * 5
        moderate_destruction_zone = (energy_megatons ** 0.33) * 10
        
        # Estimate casualties (simplified)
        population_density = data.get('population_density', 1000)
        fatalities = int(total_destruction_zone * total_destruction_zone * 3.14159 * population_density * 0.5)
        injuries = int(fatalities * 3)
        
        # Secondary effects
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
                'description': 'Regional impact with significant damage' if energy_megatons < 10 else 'Continental impact with massive devastation'
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

OVERPASS_URL = "http://overpass-api.de/api/interpreter"

@app.route('/overpass', methods=['GET'])
def overpass():
    try:
        # Get request coordinates
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        radius = request.args.get('radius', default=1000, type=int)  # Radius in meters (default 1 km)

        # Overpass API query to get data within the specified radius
        overpass_query = f"""
        [out:json];
        (
          node(around:{radius},{lat},{lon});
          way(around:{radius},{lat},{lon});
          relation(around:{radius},{lat},{lon});
        );
        out body;
        """
        response = requests.get(OVERPASS_URL, params={'data': overpass_query})

        # Handle Overpass response
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Error fetching data from Overpass API"}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

def cleanup_on_exit():
    """Clean up resources on exit"""
    if os.path.exists(SIMULATION_DATA_FILE):
        try:
            os.remove(SIMULATION_DATA_FILE)
        except:
            pass

if __name__ == '__main__':
    import atexit
    atexit.register(cleanup_on_exit)
    
    # Get port from environment variable (Render provides this)
    port = int(os.environ.get('PORT', 5000))
    
    print("🌍 Initializing Meteorite Impact Simulator")
    print(f"📡 Flask server running on port {port}")
    print("📁 Serving files from:", os.getcwd())
    print("🚀 Production mode enabled")
    
    # Production settings
    app.run(debug=False, host='0.0.0.0', port=port)
