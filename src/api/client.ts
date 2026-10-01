import { notifyAuthExpired } from "@/api/auth-events";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "patient_access_token";

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim() || (__DEV__ ? "http://192.168.100.134:4000" : "http://192.168.100.134:4000");

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Adjunta token a cada request
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log(`🔑 Retrieved token from SecureStore: ${token ? "Token found" : "No token found"}`);
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
      console.log("🔐 Authorization header attached: yes");
    } else {
      console.log("🔐 Authorization header attached: no");
    }
  } catch (error) {
    console.error(`❌ Error retrieving token from SecureStore: ${error}`);
  }

  // Debug logging
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log(`📍 Base URL: ${config.baseURL}`);
  console.log(`📍 Endpoint: ${config.url}`);

  return config;
});

// Manejo simple de errores
api.interceptors.response.use(
  (res) => {
    console.log(`✅ API Success: ${res.config.method?.toUpperCase()} ${res.config.url} - Status: ${res.status}`);
    return res;
  },
  (err) => {
    console.log(`❌ API Error: ${err.config?.method?.toUpperCase()} ${err.config?.url}`);
    console.log(`❌ Error Status: ${err.response?.status || "No Response"}`);
    console.log(`❌ Error Message: ${err.message}`);
    console.log(`❌ Full URL attempted: ${err.config?.baseURL}${err.config?.url}`);

    if (err.response?.status === 401 && !err.config?.url?.includes("/auth/patient/login")) {
      notifyAuthExpired();
    }

    return Promise.reject(err);
  },
);

// Helper para normalizar errores en texto
export function getErrorMessage(err: any) {
  return err?.response?.data?.message || err?.message || "Ocurrió un error. Intenta nuevamente.";
}
