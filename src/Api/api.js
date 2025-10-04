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

export default API;

/* =========================================================
   AUTH
========================================================= */
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

/* =========================================================
   USERS (Admin only)
========================================================= */
export const getUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

/* =========================================================
   MACHINE CATEGORIES
   (Backend route: /machines/categories)
========================================================= */
export const createMachineCategory = (data) =>
  API.post("/machines/categories", data);
export const getMachineCategories = () => API.get("/machines/categories");
export const getMachineCategory = (id) => API.get(`/machines/categories/${id}`);
export const updateMachineCategory = (id, data) =>
  API.put(`/machines/categories/${id}`, data);
export const deleteMachineCategory = (id) =>
  API.delete(`/machines/categories/${id}`);

/* =========================================================
   MACHINE SECTIONS
   (Backend route: /machines/sections)
========================================================= */
export const createMachineSection = (data) =>
  API.post("/machines/sections", data);
export const getMachineSections = () => API.get("/machines/sections");
export const getMachineSection = (id) => API.get(`/machines/sections/${id}`);
export const updateMachineSection = (id, data) =>
  API.put(`/machines/sections/${id}`, data);
export const deleteMachineSection = (id) =>
  API.delete(`/machines/sections/${id}`);

/* =========================================================
   MACHINE PAGES
   (Backend route: /machines/pages)
========================================================= */
export const createMachinePage = (data) => API.post("/machines/pages", data);
export const getMachinePages = () => API.get("/machines/pages");
export const getMachinePageBySlug = (slug) =>
  API.get(`/machines/pages/${slug}`);
export const updateMachinePage = (id, data) =>
  API.put(`/machines/pages/${id}`, data);
export const deleteMachinePage = (id) => API.delete(`/machines/pages/${id}`);

// 🔹 Get all pages by category slug
export const getMachinePagesByCategorySlug = (categorySlug) =>
  API.get(`/machines/pages/category/${categorySlug}`);

/* =========================================================
   BLOGS
========================================================= */
export const getBlogs = async (params = {}) => {
  const { data } = await API.get("/blogs", { params });
  return data.data; // ✅ return only the array
};

export const getBlogBySlug = async (slug) => {
  const { data } = await API.get(`/blogs/${slug}`);
  return data.data; // ✅ return only the object
};

export const createBlog = (data) => API.post("/blogs", data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

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

/* =========================================================
   HOMEPAGE
   (Backend route: /homepage)
========================================================= */

// ✅ Correct
export const getHomepage = () => API.get("/homepage");
// Update homepage with file upload
export const updateHomepage = (formData) =>
  API.post("/homepage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
   ABOUT PAGE
   (Backend route: /aboutpage)
========================================================= */

// ✅ Get About Page content
export const getAboutPage = () => API.get("/aboutpage");

// ✅ Update About Page (supports file upload)
export const updateAboutPage = (formData) =>
  API.post("/aboutpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
 COTTON PAGE
========================================================= */
export const getCottonPage = () => API.get("/cottonpage");

export const updateCottonPage = (formData) =>
  API.post("/cottonpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
   FIBER PAGE
========================================================= */
export const getFiberPage = () => API.get("/fiberpage");

export const updateFiberPage = (formData) =>
  API.post("/fiberpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
   CONTACT PAGE
========================================================= */
export const getContactPage = () => API.get("/contactpage");

export const updateContactPage = (formData) =>
  API.post("/contactpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
