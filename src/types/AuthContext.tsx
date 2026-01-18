import React, { createContext, useState, useContext, ReactNode } from 'react';
import { API_URL } from '../components/config';
import { calculateUserStats } from '../components/statsCalculator';

interface User {
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser?: (user: User) => void;
  refreshUserData?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUserData = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_URL}/users/${user.id}?_embed=trips`);
      
      if (!response.ok) {
        throw new Error('Błąd pobierania danych użytkownika');
      }
      
      const rawUser = await response.json();
      const updatedUser = calculateUserStats(rawUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Błąd podczas odświeżania danych użytkownika:', error);
      // Ciche niepowodzenie - użytkownik pozostaje zalogowany z obecnymi danymi
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  }
  return context;
};

export default AuthProvider;