// Test script to debug Firebase authentication
// Run this in your browser console or Node.js environment

const firebaseConfig = {
  apiKey: "AIzaSyCkgxug0fdKvcS8ZJwD3TfYabfUxasWHaY",
  authDomain: "my-login-95c33.firebaseapp.com",
  projectId: "my-login-95c33",
  storageBucket: "my-login-95c33.firebasestorage.app",
  messagingSenderId: "425531427167",
  appId: "1:425531427167:web:6ea79ba9e46c4958ae0eea"
};

// Test authentication
async function testAuth() {
  try {
    // Test with demo credentials
    const email = "demo@skinoai.com";
    const password = "demo123";
    
    console.log(`Testing authentication with: ${email}`);
    
    // You can test this in Firebase Console or use the Firebase Admin SDK
    console.log("To test authentication:");
    console.log("1. Go to Firebase Console > Authentication > Users");
    console.log("2. Check if demo@skinoai.com exists");
    console.log("3. If it doesn't exist, create it manually");
    console.log("4. If it exists, reset the password");
    
    return "Check Firebase Console for user details";
  } catch (error) {
    console.error("Test failed:", error);
    return error.message;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAuth };
} else {
  // Browser environment
  window.testAuth = testAuth;
}
