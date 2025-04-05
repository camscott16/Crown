import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define user context shape
interface User {
  user_id: number;
  username: string;
  email: string;
  role: number;
  hair_profiles: Array<{ curl_type: string; porosity: string; volume: string; desired_outcome: string }>; // Changed to array
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  addProfile: (newProfile: { curl_type: string; porosity: string; volume: string; desired_outcome: string }) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from storage on app start
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const saveUser = async (user: User | null) => {
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('user');
    }
    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('bearer'); // Remove token as well
    setUser(null);
  };

  const addProfile = async (newProfile: { curl_type: string; porosity: string; volume: string; desired_outcome: string }) => {
    if (!user) return; // If there's no user, do nothing

    // Append the new profile to the hair_profiles array
    const updatedProfiles = [...user.hair_profiles, newProfile];

    // Update the user context with the new profile list
    const updatedUser = { ...user, hair_profiles: updatedProfiles };
    setUser(updatedUser); // Update the user in context

    // Save the updated user to AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, logout, addProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};