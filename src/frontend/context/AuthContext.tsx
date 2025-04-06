import React, { createContext, useState, useEffect, useContext } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";

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
        const user = {
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          role: data.role,
          hair_profiles: [],
        };
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

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data: Array<{
        curl_type: string;
        porosity: string;
        volume: string;
        desired_outcome: string;
      }> = await response.json();

      const profileArr = data.map(profile => ({
        curl_type: profile.curl_type,
        porosity: profile.porosity,
        volume: profile.volume,
        desired_outcome: profile.desired_outcome,
      }));

      loadHairProfiles(profileArr);
      console.log("success");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = async () => {
    const user = {
      user_id: -1,
      username: "guest",
      email: "N/A",
      role: 0,
      hair_profiles: [],
    };
    await deleteItem("bearer");
    setToken(null);
    setUser(user);
    router.replace("/(login)");
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
