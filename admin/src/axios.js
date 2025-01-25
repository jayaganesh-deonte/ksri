import axios from "axios";
import { getUserIdToken } from "./services/auth";

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // Optional timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from localStorage or your auth store
    const token = await getUserIdToken();

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
