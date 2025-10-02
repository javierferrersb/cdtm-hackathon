import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect automatically on 401 - let the components handle it
    // This prevents infinite loops during the initial auth check
    return Promise.reject(error);
  }
);

export default api;
