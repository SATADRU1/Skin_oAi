// Demo credentials for testing purposes
// In a real app, these would be validated against a backend

export const DEMO_CREDENTIALS = {
  // Demo user 1
  user1: {
    email: 'demo@skinoai.com',
    password: 'demo123',
    name: 'Demo User'
  },
  // Demo user 2
  user2: {
    email: 'test@skinoai.com',
    password: 'test123',
    name: 'Test User'
  }
};

// Function to validate demo credentials
export const validateDemoCredentials = (email: string, password: string) => {
  const users = Object.values(DEMO_CREDENTIALS);
  return users.find(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.password === password
  );
};

// Function to check if email exists in demo data
export const isDemoEmail = (email: string) => {
  const users = Object.values(DEMO_CREDENTIALS);
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};
