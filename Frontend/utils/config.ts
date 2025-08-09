// Configuration for the app

export const CONFIG = {
  // Backend URLs to try in order
  BACKEND_URLS: [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://192.168.0.108:5000',
    'http://10.0.2.2:5000' // For Android emulator
  ],
  
  // API endpoints
  ENDPOINTS: {
    PREDICT: '/predict',
    PING: '/ping',
    HEALTH: '/'
  },
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // App settings
  APP_NAME: 'SkinOAI',
  VERSION: '1.0.0'
}; 