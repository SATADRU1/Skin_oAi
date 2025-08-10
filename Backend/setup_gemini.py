#!/usr/bin/env python3
"""
Gemini AI Setup Script

This script helps you set up the Gemini AI integration for SkinOAI.
It will guide you through the process of getting an API key and configuring the environment.

Usage:
    python setup_gemini.py
"""

import os
import sys
import subprocess
from pathlib import Path

def print_banner():
    """Print the setup banner"""
    print("=" * 60)
    print("🧠 SkinOAI - Gemini AI Integration Setup")
    print("=" * 60)
    print()

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    print("\n📦 Checking dependencies...")
    
    required_packages = [
        'google-generativeai',
        'python-dotenv',
        'flask',
        'flask-cors',
        'Pillow',
        'roboflow'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} (missing)")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        install = input("Would you like to install missing packages? (y/n): ").lower().strip()
        
        if install == 'y':
            print("\n📥 Installing missing packages...")
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + missing_packages)
                print("✅ Packages installed successfully!")
                return True
            except subprocess.CalledProcessError:
                print("❌ Failed to install packages. Please install them manually:")
                print(f"   pip install {' '.join(missing_packages)}")
                return False
        else:
            print("Please install the missing packages before continuing.")
            return False
    
    return True

def get_gemini_api_key():
    """Guide user to get Gemini API key"""
    print("\n🔑 Setting up Gemini API Key")
    print("-" * 40)
    print("To get your Gemini API key:")
    print("1. Visit: https://makersuite.google.com/app/apikey")
    print("2. Sign in with your Google account")
    print("3. Click 'Create API Key'")
    print("4. Copy the generated API key")
    print()
    
    api_key = input("AIzaSyDLGxa4DaIODe920y3euj4jeh2SieDsjow").strip()
    
    if not api_key:
        print("❌ No API key provided")
        return None
    
    if not api_key.startswith('AIza'):
        print("⚠️  Warning: API key doesn't look like a valid Gemini key")
        print("   Valid keys usually start with 'AIza'")
        continue_anyway = input("Continue anyway? (y/n): ").lower().strip()
        if continue_anyway != 'y':
            return None
    
    return api_key

def create_env_file(api_key):
    """Create the .env file with the API key"""
    print("\n📝 Creating .env file...")
    
    env_content = f"""# Gemini AI API Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY={api_key}

# Roboflow API Configuration (already configured in app.py)
# ROBOFLOW_API_KEY=your_roboflow_api_key_here
"""
    
    env_path = Path('.env')
    
    if env_path.exists():
        print("⚠️  .env file already exists")
        overwrite = input("Overwrite existing .env file? (y/n): ").lower().strip()
        if overwrite != 'y':
            print("Skipping .env file creation")
            return True
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print("✅ .env file created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def test_integration():
    """Test the Gemini integration"""
    print("\n🧪 Testing Gemini integration...")
    
    try:
        # Import and test the service
        from dotenv import load_dotenv
        load_dotenv()
        
        from gemini_service import gemini_service
        
        health_status = gemini_service.get_health_status()
        
        if health_status['initialized']:
            print("✅ Gemini service initialized successfully!")
            
            # Test with a simple condition
            try:
                recommendations = gemini_service.generate_recommendations("acne", 0.8)
                if 'immediate_actions' in recommendations:
                    print("✅ Recommendations generation working!")
                    print(f"   Generated {len(recommendations['immediate_actions'])} immediate actions")
                else:
                    print("⚠️  Recommendations generated but structure may be incomplete")
            except Exception as e:
                print(f"⚠️  Recommendations test failed: {e}")
                print("   This might be due to API quota or network issues")
        else:
            print("❌ Gemini service failed to initialize")
            print("   Check your API key and internet connection")
            return False
            
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        return False
    
    return True

def run_server_test():
    """Test if the server can start"""
    print("\n🌐 Testing server startup...")
    
    try:
        # Try to import the app
        from app import app
        
        print("✅ Flask app imported successfully!")
        print("   You can now start the server with: python app.py")
        
        # Test health endpoint if server is running
        import requests
        try:
            response = requests.get("http://localhost:5000/health", timeout=2)
            if response.status_code == 200:
                print("✅ Server is already running!")
                health_data = response.json()
                gemini_status = health_data.get('services', {}).get('gemini', {}).get('status', 'unknown')
                print(f"   Gemini status: {gemini_status}")
            else:
                print("⚠️  Server responded but with unexpected status")
        except requests.exceptions.ConnectionError:
            print("ℹ️  Server not running (this is normal)")
            print("   Start it with: python app.py")
        except Exception as e:
            print(f"⚠️  Server test failed: {e}")
            
    except Exception as e:
        print(f"❌ Server test failed: {e}")
        return False
    
    return True

def main():
    """Main setup function"""
    print_banner()
    
    # Step 1: Check Python version
    if not check_python_version():
        return False
    
    # Step 2: Check dependencies
    if not check_dependencies():
        return False
    
    # Step 3: Get API key
    api_key = get_gemini_api_key()
    if not api_key:
        print("❌ Setup cancelled - no API key provided")
        return False
    
    # Step 4: Create .env file
    if not create_env_file(api_key):
        return False
    
    # Step 5: Test integration
    if not test_integration():
        print("⚠️  Integration test failed, but setup may still work")
        print("   Try running the server and test manually")
    
    # Step 6: Test server
    run_server_test()
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Start the server: python app.py")
    print("2. Test the health endpoint: http://localhost:5000/health")
    print("3. Use your frontend app to test predictions")
    print("4. Check the README_GEMINI_SETUP.md for detailed documentation")
    print("\nFor troubleshooting, run: python test_gemini_integration.py")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n❌ Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1) 