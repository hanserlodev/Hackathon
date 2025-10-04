#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para verificar que el servidor funciona correctamente
"""

import requests
import time
import subprocess
import sys
import os
import threading

def test_server():
    """Probar que el servidor funciona correctamente"""
    print("🧪 Probando servidor...")
    
    # Esperar un poco para que el servidor inicie
    time.sleep(2)
    
    try:
        # Probar endpoint principal
        response = requests.get('http://localhost:5000/', timeout=5)
        if response.status_code == 200:
            print("✅ Página principal cargada correctamente")
        else:
            print(f"❌ Error en página principal: {response.status_code}")
            return False
        
        # Probar archivos estáticos
        response = requests.get('http://localhost:5000/styles.css', timeout=5)
        if response.status_code == 200:
            print("✅ Archivos CSS cargados correctamente")
        else:
            print(f"❌ Error en archivos CSS: {response.status_code}")
        
        # Probar API
        response = requests.get('http://localhost:5000/api/simulation/status', timeout=5)
        if response.status_code == 200:
            print("✅ API funcionando correctamente")
        else:
            print(f"❌ Error en API: {response.status_code}")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def start_server_background():
    """Iniciar servidor en segundo plano"""
    try:
        process = subprocess.Popen([sys.executable, "server.py"])
        return process
    except Exception as e:
        print(f"❌ Error al iniciar servidor: {e}")
        return None

def main():
    """Función principal de prueba"""
    print("🔍 Verificando archivos del proyecto...")
    
    # Verificar que los archivos principales existen
    required_files = [
        'index.html',
        'styles.css',
        'server.py',
        'js/main.js',
        'js/earth3d.js',
        'python/meteor_impact_2d.py'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Archivos faltantes:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ Todos los archivos principales están presentes")
    
    # Iniciar servidor en segundo plano
    print("🚀 Iniciando servidor...")
    server_process = start_server_background()
    
    if not server_process:
        return False
    
    try:
        # Probar servidor
        success = test_server()
        
        if success:
            print("\n🎉 ¡Servidor funcionando correctamente!")
            print("🌐 Abre http://localhost:5000 en tu navegador")
            print("⏹️ Presiona Ctrl+C para detener el servidor")
            
            # Mantener el servidor ejecutándose
            try:
                server_process.wait()
            except KeyboardInterrupt:
                print("\n👋 Deteniendo servidor...")
                server_process.terminate()
                server_process.wait()
                print("✅ Servidor detenido")
        else:
            print("\n❌ El servidor no está funcionando correctamente")
            server_process.terminate()
            return False
            
    except KeyboardInterrupt:
        print("\n👋 Deteniendo servidor...")
        server_process.terminate()
        server_process.wait()
        print("✅ Servidor detenido")
    
    return True

if __name__ == "__main__":
    main()
