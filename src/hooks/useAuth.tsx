// hooks/usePatientAuth.tsx

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as SecureStore from "expo-secure-store";

import { setAuthExpiredListener } from "@/api/auth-events";
import { PatientUser } from "@/types/auth";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

type LoginPayload = {
  token: string;
  user: PatientUser;
};

type PatientAuthContextShape = {
  initializing: boolean;

  isLoggedIn: boolean;

  token: string | null;

  user: PatientUser | null;

  login: (payload: LoginPayload) => Promise<void>;

  logout: () => Promise<void>;
};

/* ========================================================================== */
/* CONSTANTS                                                                  */
/* ========================================================================== */

const TOKEN_KEY = "patient_access_token";

const USER_KEY = "patient_user";

/* ========================================================================== */
/* CONTEXT                                                                    */
/* ========================================================================== */

const PatientAuthContext = createContext<PatientAuthContextShape>({
  initializing: true,
  isLoggedIn: false,
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
});

/* ========================================================================== */
/* PROVIDER                                                                   */
/* ========================================================================== */

export const PatientAuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);

  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<PatientUser | null>(null);

  /* ====================================================================== */
  /* RESTORE SESSION                                                        */
  /* ====================================================================== */

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([SecureStore.getItemAsync(TOKEN_KEY), AsyncStorage.getItem(USER_KEY)]);

        const parsedUser = storedUser ? (JSON.parse(storedUser) as PatientUser) : null;

        setToken(storedToken);

        setUser(parsedUser);
      } catch (error) {
        console.error("Error restaurando sesión:", error);

        setToken(null);

        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  /* ====================================================================== */
  /* LOGIN                                                                  */
  /* ====================================================================== */

  const login = async ({ token: newToken, user: newUser }: LoginPayload) => {
    await Promise.all([SecureStore.setItemAsync(TOKEN_KEY, newToken), AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser))]);
    setToken(newToken);
    setUser(newUser);
  };

  /* ====================================================================== */
  /* LOGOUT                                                                 */
  /* ====================================================================== */

  const logout = useCallback(async () => {
    await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setAuthExpiredListener(() => {
      void logout();
    });

    return () => setAuthExpiredListener(null);
  }, [logout]);

  /* ====================================================================== */
  /* VALUE                                                                  */
  /* ====================================================================== */

  const value = useMemo(
    () => ({
      initializing,
      isLoggedIn: !!token,
      token,
      user,
      login,
      logout,
    }),

    [initializing, token, user],
  );

  return <PatientAuthContext.Provider value={value}>{children}</PatientAuthContext.Provider>;
};

/* ========================================================================== */
/* HOOK                                                                       */
/* ========================================================================== */

export const usePatientAuth = () => useContext(PatientAuthContext);
