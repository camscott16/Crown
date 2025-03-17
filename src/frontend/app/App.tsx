import React, { useState, useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { UserProvider } from '../context/UserContext';
import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('bearer');
      setIsAuthenticated(!!token);
      setIsLoading(false);
      
      if (!token) {
        router.replace('/(login)');
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return null; // Prevent flickering

  return (
    <AuthProvider>
        <UserProvider>
            <Slot /> {/* This renders the correct route (login or tabs) */}
        </UserProvider>
    </AuthProvider>
  );
}