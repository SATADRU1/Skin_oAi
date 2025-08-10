# Authentication Troubleshooting Guide

## Issue: "auth/invalid-credential" Error

This error typically occurs when:
1. The password is incorrect
2. The user account doesn't exist
3. There's a mismatch between stored and entered credentials

## Solutions

### 1. Check Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-login-95c33`
3. Navigate to **Authentication > Users**
4. Check if the user exists and verify the email

### 2. Reset User Password
If the user exists but login fails:
1. In Firebase Console > Authentication > Users
2. Find the user account
3. Click the three dots menu
4. Select "Reset password"
5. The user will receive a password reset email

### 3. Create New User Account
Instead of using demo credentials:
1. Use the **"Create New Account"** button on the login page
2. Enter a new email and password
3. This will create a fresh account in Firebase

### 4. Verify Firebase Configuration
Check that your `firebaseConfig` in `Frontend/app/firebase/index.ts` matches:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCkgxug0fdKvcS8ZJwD3TfYabfUxasWHaY",
  authDomain: "my-login-95c33.firebaseapp.com",
  projectId: "my-login-95c33",
  storageBucket: "my-login-95c33.firebasestorage.app",
  messagingSenderId: "425531427167",
  appId: "1:425531427167:web:6ea79ba9e46c4958ae0eea"
};
```

### 5. Check Firestore Rules
Ensure your Firestore rules allow user creation:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Testing Authentication

### Option 1: Create New Account
1. Open the app
2. Click **"Create New Account"**
3. Fill in the form with a new email and password
4. This bypasses any existing credential issues

### Option 2: Use Firebase Console
1. Go to Firebase Console > Authentication > Users
2. Click "Add User"
3. Enter email and password
4. Use these credentials in the app

### Option 3: Reset Existing User
1. Find the user in Firebase Console
2. Reset their password
3. Use the new password in the app

## Common Error Codes

- `auth/invalid-credential`: Wrong password or user doesn't exist
- `auth/user-not-found`: No account with this email
- `auth/wrong-password`: Password is incorrect
- `auth/email-already-in-use`: Email is already registered
- `auth/weak-password`: Password is too short

## Best Practice

**Always use the signup flow for new users** rather than trying to guess existing credentials. This ensures:
1. Fresh, valid accounts
2. Proper data storage in Firestore
3. No authentication conflicts
4. Better user experience

## Need Help?

If issues persist:
1. Check the console logs for detailed error messages
2. Verify Firebase project settings
3. Ensure all dependencies are properly installed
4. Test with a completely new email/password combination

