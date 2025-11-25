// hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { id: number; name: string; email?: string; role?: string, firstname?: string; lastname?: string };

type AuthContextShape = {
  initializing: boolean;
  isLoggedIn: boolean;
  user: User | null;
  login: (payload: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape>({
  initializing: true,
  isLoggedIn: false,
  user: null,
  login: async () => {},
  logout: async () => {},
});

const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Cargar sesión al arrancar
  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
        const tok = t[1] || null;
        const usr = u[1] ? (JSON.parse(u[1]!) as User) : null;
        setToken(tok);
        setUser(usr);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = async ({ token: newToken, user: newUser }: { token: string; user: User }) => {
    await AsyncStorage.multiSet([[TOKEN_KEY, newToken], [USER_KEY, JSON.stringify(newUser)]]);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      initializing,
      isLoggedIn: !!token,
      user,
      login,
      logout,
    }),
    [initializing, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
