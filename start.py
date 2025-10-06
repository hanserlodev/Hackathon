#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick start script for Meteorite Impact Simulator
"""

import os
import sys
import subprocess
import webbrowser
import time
import threading

def check_dependencies():
    """Verify that dependencies are installed"""
    print("🔍 Verifying dependencies...")
    
    try:
        import flask # type: ignore
        print("✅ Flask installed")
    except ImportError:
        print("❌ Flask not installed. Running: pip install flask")
        subprocess.run([sys.executable, "-m", "pip", "install", "flask"])
    
    try:
        import pygame # type: ignore
        print("✅ Pygame installed")
    except ImportError:
        print("❌ Pygame not installed. Running: pip install pygame")
        subprocess.run([sys.executable, "-m", "pip", "install", "pygame"])
    
    try:
        import requests # type: ignore
        print("✅ Requests installed")
    except ImportError:
        print("❌ Requests not installed. Running: pip install requests")
        subprocess.run([sys.executable, "-m", "pip", "install", "requests"])

def start_server():
    """Initialize Flask server"""
    print("🚀 Starting server...")
    
    # Change to project directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Start server
    try:
        subprocess.run([sys.executable, "server.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def open_browser():
    """Open browser after brief delay"""
    time.sleep(3)  # Wait for server to start
    try:
        webbrowser.open('http://localhost:5000')
        print("🌐 Browser opened at http://localhost:5000")
    except Exception as e:
        print(f"⚠️ Could not open browser automatically: {e}")
        print("🌐 Open manually: http://localhost:5000")

def main():
    """Main function"""
    print("🌍 Meteorite Impact Simulator")
    print("=" * 50)
    
    # Verify dependencies
    check_dependencies()
    
    print("\n📋 Instructions:")
    print("1. Server will start at http://localhost:5000")
    print("2. Browser will open automatically")
    print("3. To stop server, press Ctrl+C")
    print("4. 2D simulation will launch when you start a simulation")
    
    print("\n🎮 2D View Controls:")
    print("- SPACE: Pause/Resume")
    print("- D: Show/Hide data")
    print("- E: Show/Hide effects")
    print("- R: Reset")
    print("- ESC: Exit")
    
    input("\n⏎ Press Enter to continue...")
    
    # Start browser in separate thread
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
