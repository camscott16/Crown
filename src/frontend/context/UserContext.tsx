import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define user context shape
interface User {
  user_id: number;
  username: string;
  email: string;
  role : number;
  // will add properties later...
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
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

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useAuth must be used within an UserProvider');
    }
    return context;
};