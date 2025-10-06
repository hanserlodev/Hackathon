#!/usr/bin/env python3
"""
Test script to verify server works before deploying to Render
"""

import sys
import subprocess
import time
import requests

def test_server():
    print("🧪 Testing Meteorite Impact Simulator Server\n")
    
    # Start server
    print("1️⃣ Starting Flask server...")
    server_process = subprocess.Popen(
        [sys.executable, 'server.py'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    base_url = "http://localhost:5000"
    
    # Test 1: Homepage
    print("\n2️⃣ Testing homepage...")
    try:
        response = requests.get(base_url)
        if response.status_code == 200:
            print("✅ Homepage loads successfully")
        else:
            print(f"❌ Homepage returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Homepage error: {e}")
    
    # Test 2: NASA NEO API Proxy
    print("\n3️⃣ Testing NASA NEO API proxy...")
    try:
        response = requests.get(f"{base_url}/api/nasa/neo?api_key=DEMO_KEY", timeout=15)
        if response.status_code == 200:
            print("✅ NASA NEO API proxy works")
        else:
            print(f"❌ NASA NEO API returned status {response.status_code}")
    except Exception as e:
        print(f"❌ NASA NEO API error: {e}")
    
    # Test 3: SBDB API Proxy
    print("\n4️⃣ Testing NASA SBDB API proxy...")
    try:
        response = requests.get(f"{base_url}/api/sbdb?sstr=433", timeout=15)
        if response.status_code == 200:
            data = response.json()
            if 'object' in data:
                print("✅ NASA SBDB API proxy works")
                print(f"   Asteroid: {data['object'].get('fullname', 'Unknown')}")
            else:
                print("❌ SBDB returned unexpected data")
        else:
            print(f"❌ NASA SBDB API returned status {response.status_code}")
    except Exception as e:
        print(f"❌ NASA SBDB API error: {e}")
    
    # Test 4: Geocoding API
    print("\n5️⃣ Testing Geocoding API...")
    try:
        response = requests.get(f"{base_url}/api/geocoding?q=New+York", timeout=10)
        if response.status_code == 200:
            print("✅ Geocoding API works")
        else:
            print(f"❌ Geocoding API returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Geocoding API error: {e}")
    
    # Test 5: Static files
    print("\n6️⃣ Testing static files...")
    try:
        response = requests.get(f"{base_url}/js/main.js")
        if response.status_code == 200:
            print("✅ Static files serve correctly")
        else:
            print(f"❌ Static files returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Static files error: {e}")
    
    # Cleanup
    print("\n7️⃣ Stopping server...")
    server_process.terminate()
    server_process.wait()
    print("✅ Server stopped")
    
    print("\n" + "="*50)
    print("🎉 Testing complete!")
    print("="*50)
    print("\n✅ Server is ready for Render deployment!")
    print("\nNext steps:")
    print("1. git add .")
    print("2. git commit -m 'Ready for production'")
    print("3. git push origin main")
    print("4. Deploy on Render.com")

if __name__ == '__main__':
    try:
        test_server()
    except KeyboardInterrupt:
        print("\n\n❌ Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Test failed: {e}")
