#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de inicio rápido para el Simulador de Impacto de Meteoritos
"""

import os
import sys
import subprocess
import webbrowser
import time
import threading

def check_dependencies():
    """Verificar que las dependencias estén instaladas"""
    print("🔍 Verificando dependencias...")
    
    try:
        import flask
        print("✅ Flask instalado")
    except ImportError:
        print("❌ Flask no instalado. Ejecutando: pip install flask")
        subprocess.run([sys.executable, "-m", "pip", "install", "flask"])
    
    try:
        import pygame
        print("✅ Pygame instalado")
    except ImportError:
        print("❌ Pygame no instalado. Ejecutando: pip install pygame")
        subprocess.run([sys.executable, "-m", "pip", "install", "pygame"])
    
    try:
        import requests
        print("✅ Requests instalado")
    except ImportError:
        print("❌ Requests no instalado. Ejecutando: pip install requests")
        subprocess.run([sys.executable, "-m", "pip", "install", "requests"])

def start_server():
    """Iniciar el servidor Flask"""
    print("🚀 Iniciando servidor...")
    
    # Cambiar al directorio del proyecto
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Iniciar servidor
    try:
        subprocess.run([sys.executable, "server.py"])
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido por el usuario")
    except Exception as e:
        print(f"❌ Error al iniciar servidor: {e}")

def open_browser():
    """Abrir navegador después de un breve delay"""
    time.sleep(3)  # Esperar a que el servidor inicie
    try:
        webbrowser.open('http://localhost:5000')
        print("🌐 Navegador abierto en http://localhost:5000")
    except Exception as e:
        print(f"⚠️ No se pudo abrir el navegador automáticamente: {e}")
        print("🌐 Abre manualmente: http://localhost:5000")

def main():
    """Función principal"""
    print("🌍 Simulador de Impacto de Meteoritos")
    print("=" * 50)
    
    # Verificar dependencias
    check_dependencies()
    
    print("\n📋 Instrucciones:")
    print("1. El servidor se iniciará en http://localhost:5000")
    print("2. El navegador se abrirá automáticamente")
    print("3. Para detener el servidor, presiona Ctrl+C")
    print("4. La simulación 2D se abrirá cuando inicies una simulación")
    
    print("\n🎮 Controles de la Vista 2D:")
    print("- ESPACIO: Pausar/Reanudar")
    print("- D: Mostrar/Ocultar datos")
    print("- E: Mostrar/Ocultar efectos")
    print("- R: Reiniciar")
    print("- ESC: Salir")
    
    input("\n⏎ Presiona Enter para continuar...")
    
    # Iniciar navegador en hilo separado
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Iniciar servidor
    start_server()

if __name__ == "__main__":
    main()
