import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useUser } from '@/context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { setUser } = useUser()

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const storedToken = await SecureStore.getItemAsync("bearer");

      if (storedToken) {
        // Try fetching user info with stored token
        try {
          const response = await fetch("https://crown-api-production.up.railway.app/validate/", {
            method: 'GET',
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          const data = await response.json();
          const user = {
            user_id: data.user_id,  // Convert to string if necessary
            username: data.username,
            email: data.email,
            role: data.role, 
            hair_profiles: [],
          }
          if (response.ok) {
            setToken(storedToken); // set token
            setUser(user)
            const valStore = await AsyncStorage.getItem('user');
            router.replace("/(tabs)/home");
          } else {
            await SecureStore.deleteItemAsync("bearer"); // Remove invalid token
            router.replace("/(login)"); // Redirect to login
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          await SecureStore.deleteItemAsync("bearer");
          router.replace("/(login)");
        }
      } else {
        router.replace("/(login)"); // No token, go to login
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (jwt: string) => {
    await SecureStore.setItemAsync("bearer", jwt);
    try {
        const response = await fetch("https://crown-api-production.up.railway.app/validate/", {
          method: 'GET',
          headers: { Authorization: `Bearer ${jwt}` },
        });

        const data = await response.json();
        const user = {
          user_id: data.user_id,  // Convert to string if necessary
          username: data.username,
          email: data.email,
          role: data.role, 
          hair_profiles: [],
        }
        if (response.ok) {
          setToken(jwt); // set token
          setUser(user)
          console.log("success")
        } else {
          await SecureStore.deleteItemAsync("bearer"); // Remove invalid token
          router.replace("/(login)"); // Redirect to login
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        await SecureStore.deleteItemAsync("bearer");
        router.replace("/(login)");
      }

    router.replace("/(tabs)/home"); // Redirect to home after login
  };

  const logout = async () => {
    const user = {
        user_id: -1,  // Convert to string if necessary
        username: "guest",
        email: "N/A",
        role: 0, 
        hair_profiles: [],
      }
    await SecureStore.deleteItemAsync("bearer"); 
    setToken(null);
    setUser(user)
    router.replace("/(login)");
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};