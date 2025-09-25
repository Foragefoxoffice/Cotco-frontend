import axios from "axios";

// ✅ Setup axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // change to your backend URL
  withCredentials: true, // if you use cookies
});

// ✅ Attach JWT token automatically if stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= AUTH ================= //
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateDetails = (data) => API.put("/auth/updatedetails", data);
export const updatePassword = (data) => API.put("/auth/updatepassword", data);
export const logoutUser = () => API.get("/auth/logout");
export const forgotPassword = (data) => API.post("/auth/forgotpassword", data);
export const resetPassword = (data) => API.post("/auth/resetpassword", data);
export const resendVerification = (data) =>
  API.post("/auth/resend-verification", data);

// ================= USERS (Admin only) ================= //
export const getUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ================= CATEGORIES ================= //
export const createCategory = (data) => API.post("/categories", data);
export const getCategories = () => API.get("/categories");
export const getCategory = (id) => API.get(`/categories/${id}`);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ================= SECTIONS ================= //
export const createSection = (data) => API.post("/sections", data);
export const getSections = () => API.get("/sections");
export const getSection = (id) => API.get(`/sections/${id}`);
export const updateSection = (id, data) => API.put(`/sections/${id}`, data);
export const deleteSection = (id) => API.delete(`/sections/${id}`);

// ================= PAGES ================= //
export const createPage = (data) => API.post("/pages", data);
export const getPages = () => API.get("/pages");
export const getPageBySlug = (slug) => API.get(`/pages/${slug}`);
export const updatePage = (id, data) => API.put(`/pages/${id}`, data);
export const deletePage = (id) => API.delete(`/pages/${id}`);

// ================= BLOGS ================= //
// Get all blogs (with optional filters: status, category, tag, author, search, page, limit)
export const getBlogs = (params = {}) => API.get("/blogs", { params });

// Get single blog by slug
export const getBlogBySlug = (slug) => API.get(`/blogs/${slug}`);

// Create blog
export const createBlog = (data) => API.post("/blogs", data);

// Update blog
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);

// Delete blog
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);
