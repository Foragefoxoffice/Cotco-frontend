import axios from "axios";
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`,
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
export const updatePassword = (data) => API.put("/auth/update-password", data);
export const logoutUser = () => API.get("/auth/logout");
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (data) =>
  API.post("/auth/resetpassword", data);  // ✅ correct endpoint

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
export const createMachineCategory = (formData) =>
  API.post("/machines/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMachineCategories = (params = {}) => API.get("/machines/categories", { params });

export const getMachineCategory = (id) =>
  API.get(`/machines/categories/${id}`);

export const updateMachineCategory = (id, formData) =>
  API.put(`/machines/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

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
export const createMachinePage = (formData) =>
  API.post("/machines/pages", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getMachinePages = (params = {}) => API.get("/machines/pages", { params });
export const getMachinePageBySlug = (slug) =>
  API.get(`/machines/pages/${slug}`);
export const updateMachinePage = (id, formData) =>
  API.put(`/machines/pages/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteMachinePage = (id) => API.delete(`/machines/pages/${id}`);

// 🔹 Get all pages by category slug
export const getMachinePagesByCategorySlug = (categorySlug) =>
  API.get(`/machines/pages/category/${categorySlug}`);

export const getMachinePageById = (id) => API.get(`/machines/pages/${id}`);



/* =========================================================
   BLOGS
========================================================= */
let blogsPromise = null;
export const getBlogs = (params = {}) => {
  if (Object.keys(params).length === 0) {
    if (!blogsPromise) {
      blogsPromise = API.get("/blogs", { params }).finally(() => setTimeout(() => blogsPromise = null, 5000));
    }
    return blogsPromise;
  }
  return API.get("/blogs", { params });
};
export const getBlogBySlug = (slug) => API.get(`/blogs/${slug}`);
export const createBlog = (data) => API.post("/blogs", data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);



// ================= CATEGORIES ================= //
export const createCategory = (data) => API.post("/categories", data);
let categoriesPromise = null;
export const getCategories = () => {
  if (!categoriesPromise) {
    categoriesPromise = API.get("/categories").finally(() => setTimeout(() => categoriesPromise = null, 5000));
  }
  return categoriesPromise;
};
export const getCategory = (id) => API.get(`/categories/${id}`);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ================= SECTIONS ================= //
export const createSection = (data) => API.post("/sections", data);
export const getSections = () => API.get("/sections");
export const getSection = (id) => API.get(`/sections/${id}`);
export const updateSection = (id, data) => API.put(`/sections/${id}`, data);
export const deleteSection = (id) => API.delete(`/sections/${id}`);

/* =========================================================
   MAIN CATEGORIES (Generic for blog/news/categories)
   Backend route: /main-categories
========================================================= */
export const createBlogMainCategory = (data, isFormData = false) =>
  API.post("/maincategories", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

export const updateBlogMainCategory = (id, data, isFormData = false) =>
  API.put(`/maincategories/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

let mainBlogCategoriesPromise = null;
export const getMainBlogCategories = () => {
  if (!mainBlogCategoriesPromise) {
    mainBlogCategoriesPromise = API.get("/maincategories").finally(() => setTimeout(() => mainBlogCategoriesPromise = null, 5000));
  }
  return mainBlogCategoriesPromise;
};

export const getMainBlogCategory = (id) => API.get(`/maincategories/${id}`);

// export const updateBlogMainCategory = (id, data, isFormData = false) =>
//   axios.put(`/api/blog-main-categories/${id}`, data, {
//     headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
//   });

export const deleteBlogMainCategory = (id) =>
  API.delete(`/maincategories/${id}`);

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
let homepagePromise = null;

export const getHomepage = () => {
  if (!homepagePromise) {
    homepagePromise = API.get("/homepage").finally(() => {
      setTimeout(() => {
        homepagePromise = null;
      }, 5000);
    });
  }
  return homepagePromise;
};

// Update homepage with file upload
export const updateHomepage = (formData) =>
  API.post("/homepage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Get Homepage Blog Section
export const getHomepageBlogSection = async () => {
  try {
    const res = await getHomepage();
    // Adjust depending on backend response structure
    return res.data?.homepage?.blogSection || res.data?.blogSection || {};
  } catch (error) {
    console.error("❌ Error fetching homepage blog section:", error);
    return {};
  }
};

export const getHomepageBannerSection = async () => {
  try {
    const res = await getHomepage();
    return res.data?.homepage?.bannerSection || res.data?.bannerSection || {};
  } catch (error) {
    console.error("❌ Error fetching homepage banner section:", error);
    return {};
  }
};

/* =========================================================
   ABOUT PAGE
   (Backend route: /aboutpage)
========================================================= */

// ✅ Get About Page content
let aboutPagePromise = null;

export const getAboutPage = () => {
  if (!aboutPagePromise) {
    aboutPagePromise = API.get("/aboutpage").finally(() => {
      setTimeout(() => {
        aboutPagePromise = null;
      }, 5000);
    });
  }
  return aboutPagePromise;
};

// ✅ Update About Page (supports file upload)
export const updateAboutPage = (formData) =>
  API.post("/aboutpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
 COTTON PAGE
========================================================= */
let cottonPagePromise = null;
export const getCottonPage = () => {
  if (!cottonPagePromise) {
    cottonPagePromise = API.get("/cottonpage").finally(() => setTimeout(() => cottonPagePromise = null, 5000));
  }
  return cottonPagePromise;
};

export const updateCottonPage = (formData) =>
  API.post("/cottonpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
   FIBER PAGE
========================================================= */
let fiberPagePromise = null;
export const getFiberPage = () => {
  if (!fiberPagePromise) {
    fiberPagePromise = API.get("/fiberpage").finally(() => setTimeout(() => fiberPagePromise = null, 5000));
  }
  return fiberPagePromise;
};

export const updateFiberPage = (formData) =>
  API.post("/fiberpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
   CONTACT PAGE
========================================================= */
let contactPagePromise = null;
export const getContactPage = () => {
  if (!contactPagePromise) {
    contactPagePromise = API.get("/contactpage").finally(() => setTimeout(() => contactPagePromise = null, 5000));
  }
  return contactPagePromise;
};

export const updateContactPage = (formData) =>
  API.post("/contactpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
 PRIVACY PAGE
========================================================= */
let privacyPagePromise = null;
export const getPrivacyPage = () => {
  if (!privacyPagePromise) {
    privacyPagePromise = API.get("/privacypage").finally(() => setTimeout(() => privacyPagePromise = null, 5000));
  }
  return privacyPagePromise;
};

export const updatePrivacyPage = (formData) =>
  API.post("/privacypage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
 TERMS & CONDITIONS PAGE
========================================================= */
let termsPagePromise = null;
export const getTermsPage = () => {
  if (!termsPagePromise) {
    termsPagePromise = API.get("/termspage").finally(() => setTimeout(() => termsPagePromise = null, 5000));
  }
  return termsPagePromise;
};

export const updateTermsPage = (formData) =>
  API.post("/termspage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
HEADER
========================================================= */
export const getHeaderPage = () => API.get("/headerpage");

export const updateHeaderPage = (formData) =>
  API.post("/headerpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
 FOOTER PAGE
========================================================= */
export const getFooterPage = () => API.get("/footerpage");

export const updateFooterPage = (formData) =>
  API.post("/footerpage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================================================
   CONTACT FORM
========================================================= */
// Create a new contact entry (with file)
export const submitContactForm = (formData) =>
  API.post("/contactentries", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

let machineCMSPromise = null;
export const getMachineCMSPage = () => {
  if (!machineCMSPromise) {
    machineCMSPromise = API.get("/machinescms").finally(() => setTimeout(() => machineCMSPromise = null, 5000));
  }
  return machineCMSPromise;
};
export const updateMachineCMSPage = (formData) =>
  API.post("/machinescms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const getKnowledge = (params = {}) => API.get("/knowledge", { params });
export const updateKnowledge = (data) => API.post("/knowledge", data);


// Get all contact entries (admin)
export const getAllContacts = () => API.get("/contactentries");

// Delete a contact entry by ID (admin)
export const deleteContact = (id) => API.delete(`/contactentries/${id}`);

/* =========================================================
   ROLES (Admin only)
========================================================= */
export const createRole = (data) => API.post("/roles", data);
export const getRoles = () => API.get("/roles");
export const getRoleById = (id) => API.get(`/roles/${id}`);
export const updateRole = (id, data) => API.put(`/roles/${id}`, data);
export const deleteRole = (id) => API.delete(`/roles/${id}`);



