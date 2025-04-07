import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, hair_profile, recommendation } from "@/types/user";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  addProfile: (newProfile: hair_profile) => Promise<void>;
  loadHairProfiles: (hairProfiles: Array<hair_profile>) => Promise<void>;
  addRecommendation: (recommendation: recommendation) => Promise<void>;
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

  const addProfile = async (newProfile: hair_profile) => {
    const storedUser = await AsyncStorage.getItem('user');
    if (!storedUser) return;

    const parsedUser: User = JSON.parse(storedUser);
    // Append the new profile to the hair_profiles array
    const updatedProfiles = [newProfile, ...parsedUser.hair_profiles];
    
    // Update the user context with the new profile list
    const updatedUser = { ...parsedUser, hair_profiles: updatedProfiles };
    setUser(updatedUser); // Update the user in context

    // Save the updated user to AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addRecommendation = async (recommendation: recommendation) => {
    if (!user) return; // If there's no user, do nothing

    // finds the index of the recommendation/s associated hair profile
    const profileIndex = user.hair_profiles.findIndex(
      (profile) => profile.id === recommendation.profile_id
    )

    const updatedProfile = {
      ...user.hair_profiles[profileIndex],
      recommendation: recommendation
    }

    const updatedHairProfiles = [...user.hair_profiles];
    updatedHairProfiles[profileIndex] = updatedProfile;

    // Update the user context with the new profile list
    const updatedUser = {
      ...user,
      hair_profiles: updatedHairProfiles 
    };

    setUser(updatedUser); // Update the user in context

    // Save the updated user to AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const loadHairProfiles = async (hairProfiles: Array<hair_profile>) => {
    const storedUser = await AsyncStorage.getItem('user');
    if (!storedUser) return;
  
    const parsedUser: User = JSON.parse(storedUser);
    const loadedUser = { ...parsedUser, hair_profiles: hairProfiles };
    setUser(loadedUser);
    await AsyncStorage.setItem('user', JSON.stringify(loadedUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, logout, addProfile, loadHairProfiles, addRecommendation }}>
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