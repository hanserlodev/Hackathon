#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script modificado para recibir datos desde el servidor Flask / Script adapted to receive data from the Flask server.
"""

import pygame
import math
import random
import json
import sys
import os
import argparse
from datetime import datetime

# Importar la clase principal / Import the main class.
from meteor_impact_2d import MeteorImpact2D

def main():
    """Función principal modificada para recibir datos del servidor"""
    parser = argparse.ArgumentParser(description='Simulador de Impacto de Meteoritos 2D')
    parser.add_argument('--data-file', help='Archivo JSON con datos de simulación')
    args = parser.parse_args()
    
    # Crear instancia del simulador / Create simulator instance.
    simulator = MeteorImpact2D()
    
    # Cargar datos si se proporciona un archivo / Load data file when provided.
    simulation_data = None
    if args.data_file and os.path.exists(args.data_file):
        try:
            with open(args.data_file, 'r') as f:
                simulation_data = json.load(f)
            print(f"✅ Datos de simulación cargados desde {args.data_file}")
        except Exception as e:
            print(f"❌ Error al cargar datos: {e}")
            simulation_data = None
    
    # Si no hay datos, usar datos de ejemplo / Use sample data when no file is provided.
    if not simulation_data:
        print("⚠️ No se encontraron datos de simulación, usando datos de ejemplo")
        simulation_data = {
            "effects": {
                "energyMegatons": 15.5,
                "totalDestructionZone": 5.2,
                "severeDestructionZone": 12.8,
                "moderateDestructionZone": 25.6,
                "casualties": {
                    "fatalities": 125000,
                    "injuries": 375000
                },
                "earthquake": {
                    "magnitude": 7.8
                },
                "tsunami": {
                    "height": 45.2
                },
                "fire": {
                    "radius": 8.5
                },
                "dust": {
                    "radius": 18.3
                }
            }
        }
    
    # Ejecutar simulación / Run simulation.
    print("🚀 Iniciando simulación 2D...")
    print("📋 Instrucciones:")
    print("- ESPACIO: Pausar/Reanudar")
    print("- D: Mostrar/Ocultar datos")
    print("- E: Mostrar/Ocultar efectos")
    print("- R: Reiniciar")
    print("- ESC: Salir")
    
    try:
        simulator.run_simulation(simulation_data)
    except Exception as e:
        print(f"❌ Error en la simulación: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()