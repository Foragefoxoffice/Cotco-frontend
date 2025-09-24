import axios from "axios";

// In Vite, env vars must be prefixed with VITE_
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- Posts -----------------
export const getPosts = () => api.get("/api/posts");

export const addPost = (payload) => api.post("/api/posts", payload);

export const removePost = (id) => api.delete(`/api/posts/${id}`);

export const updatePost = (id, payload) => api.put(`/api/posts/${id}`, payload);

// ----------------- Auth -----------------
export const login = (payload) => api.post("/api/auth/login", payload);

// ----------------- Users (Admin Only) -----------------
export const getUsers = () => api.get("/api/users");

export const addUser = (payload) => api.post("/api/users", payload);

export const deleteUser = (id) => api.delete(`/api/users/${id}`);
