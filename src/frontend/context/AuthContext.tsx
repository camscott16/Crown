import React, { createContext, useState, useEffect, useContext } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from '@/context/UserContext';
import { User, hair_profile, recommendation } from "@/types/user";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper functions for secure storage operations
const getItem = async (key: string) => {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

const setItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    return AsyncStorage.setItem(key, value);
  }
  return SecureStore.setItemAsync(key, value);
};

const deleteItem = async (key: string) => {
  if (Platform.OS === "web") {
    return AsyncStorage.removeItem(key);
  }
  return SecureStore.deleteItemAsync(key);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setUser, loadHairProfiles } = useUser();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const storedToken = await getItem("bearer");

      if (storedToken) {
        // Try fetching user info with stored token
        try {
          const response = await fetch("https://crown-api-production.up.railway.app/validate/", {
            method: "GET",
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          const data = await response.json();
          if (response.ok) {
            const user = {
              user_id: data.user_id,
              username: data.username,
              email: data.email,
              role: data.role,
              hair_profiles: [],
            };
            setToken(storedToken);
            setUser(user);
            fetchUserData(data.user_id);

            router.replace("/(tabs)/home");
          } else {
            await deleteItem("bearer");
            router.replace("/(login)");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          await deleteItem("bearer");
          router.replace("/(login)");
        }
      } else {
        router.replace("/(login)");
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (jwt: string) => {
    await setItem("bearer", jwt);
    try {
      const response = await fetch("https://crown-api-production.up.railway.app/validate/", {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const data = await response.json();
      if (response.ok) {
        // Get stored user data to preserve profile image
        const storedUserJson = await AsyncStorage.getItem('user');
        const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;
        
        // Also check for lastProfileImage
        const lastProfileImage = await AsyncStorage.getItem('lastProfileImage');
        console.log('Last profile image from storage:', lastProfileImage);
        
        const user = {
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          role: data.role,
          hair_profiles: [],
          profileImage: storedUser?.profileImage || lastProfileImage || '',
        };
        console.log('User with profile image:', user);
        setToken(jwt);
        setUser(user);
        fetchUserData(data.user_id);
        console.log("success");
      } else {
        await deleteItem("bearer");
        router.replace("/(login)");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      await deleteItem("bearer");
      router.replace("/(login)");
    }

    router.replace("/(tabs)/home");
  };

  const fetchUserData = async (user_id: number) => {
    const storedToken = await getItem("bearer");

    try {
      const response = await fetch(`https://crown-api-production.up.railway.app/users/${user_id}/fetch`, {
        method: "GET",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await response.json();
      // if backend returns an object with a `message` and empty data array
      if (Array.isArray(data)) {
        const profileArr = data.map((profile: hair_profile) => ({
          ...profile,
          recommendation: null,
        }));
        
        // Get current user to preserve profile image
        const currentUser = await AsyncStorage.getItem('user');
        const parsedCurrentUser = currentUser ? JSON.parse(currentUser) : null;
        const profileImage = parsedCurrentUser?.profileImage || '';
        
        // Load profiles while preserving profile image
        const updatedUser = {
          ...parsedCurrentUser,
          hair_profiles: profileArr,
          profileImage: profileImage, // Ensure profile image is preserved
        };
        
        console.log('Updated user with profile image:', updatedUser);
        loadHairProfiles(profileArr);
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        console.log("success");
      } else {
        console.log("No profiles:", data.message); // e.g. "User has no hair profiles"
        loadHairProfiles([]); // load empty array into context
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = async () => {
    try {
      // Store the current user's profile image before logout
      const currentUser = await AsyncStorage.getItem('user');
      const parsedCurrentUser = currentUser ? JSON.parse(currentUser) : null;
      const profileImage = parsedCurrentUser?.profileImage || '';
      
      // Clear user data
      await deleteItem("bearer");
      setToken(null);
      
      // Store just the profile image for future use
      if (profileImage) {
        await AsyncStorage.setItem('lastProfileImage', profileImage);
      }
      
      // Set user to null
      setUser(null);
      router.replace("/(login)");
    } catch (error) {
      console.error('Error during logout:', error);
      // Still try to logout even if there's an error
      await deleteItem("bearer");
      setToken(null);
      setUser(null);
      router.replace("/(login)");
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
