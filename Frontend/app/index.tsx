import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { AuthContext } from './_layout';

export default function IndexScreen() {
  const { isAuthenticated } = useContext(AuthContext);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Small delay to ensure AuthContext has finished its initial check
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  console.log('Index Screen - isAuthenticated:', isAuthenticated, 'initialLoad:', initialLoad);

  if (initialLoad) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    console.log('Redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  } else {
    console.log('Redirecting to login');
    return <Redirect href="/login" />;
  }
}
