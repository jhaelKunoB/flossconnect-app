import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  (__DEV__ ? 'http://192.168.100.134:4000' : 'http://192.168.100.134:4000');

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta token a cada request
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  
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
    console.log(`❌ Error Status: ${err.response?.status || 'No Response'}`);
    console.log(`❌ Error Message: ${err.message}`);
    console.log(`❌ Full URL attempted: ${err.config?.baseURL}${err.config?.url}`);
    
    return Promise.reject(err);
  }
);

// Helper para normalizar errores en texto
export function getErrorMessage(err: any) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Ocurrió un error. Intenta nuevamente.'
  );
}
