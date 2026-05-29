import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (baseURL) {
  if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1);
  }
  if (!baseURL.endsWith('/api')) {
    baseURL = `${baseURL}/api`;
  }
}

const API = axios.create({
  baseURL,
});

// 🔥 INI PENTING BANGET
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;