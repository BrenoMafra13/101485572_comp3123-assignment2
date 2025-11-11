import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiRoot = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export const uploadUrl = (filename) =>
  filename ? `${apiRoot}/uploads/${filename}` : "";

export default api;
