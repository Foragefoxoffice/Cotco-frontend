import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./assets/css/main.css";
import "./assets/css/service.css";

// Public pages
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Cotton from "./pages/Cotton";
import Fiber from "./pages/Fiber";
import Contactus from "./pages/Contactus";
import Products from "./pages/products";
import ScrollToTop from "./ScrollToTop";
import BlogList from "./pages/BlogList";
import Blogs from "./pages/Blogs";
import BlogOverview from "./Blogs/BlogOverview";
import { ThemeProvider } from "./contexts/ThemeContext";

// Admin pages
import Dashboard from "./components/Dashboard";
import PagesScreen from "./pages/PagesScreen";
import PageEditScreen from "./pages/PageEditScreen";
import ProductsScreen from "./pages/ProductsScreen";
import NewsScreen from "./pages/NewsScreen";
import ContactScreen from "./pages/ContactScreen";
import GlobalSettingsScreen from "./pages/GlobalSettingsScreen";
import ProductListScreen from "./pages/ProductListScreen";
import MachinesScreen from "./pages/MachinesScreen";
import MachineListScreen from "./pages/MachineListScreen";
import MachineEditScreen from "./pages/MachineEditScreen";
import NewsCategoriesScreen from "./pages/NewsCategoriesScreen";

import Login from "./admin/Login/Login";
import Homepage from "./admin/Dashboard/HomePage";
import AddBlogs from "./admin/Blog/AddBlogs";
import BlogLists from "./admin/Blog/BlogLists";
import CategoriesCreate from "./admin/Blog/CategoriesCreate";
import Users from "./admin/Users/Users";
import CategoriesList from "./admin/Blog/CategoriesList";
import CategoryEdit from "./admin/Blog/CategoryEdit";
import SectionCreate from "./admin/SectionCreate";
import AdminLayout from "./admin/AdminLayout";

// Toast
import { ToastContainer } from "react-toastify";

// 🔒 Protect dashboard-related routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>  
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* 🌐 Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/cotton" element={<Cotton />} />
        <Route path="/fiber" element={<Fiber />} />
        <Route path="/machines" element={<Products />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogOverview />} />
        <Route path="/login" element={<Login />} />

        {/* 🛠 Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pages" element={<PagesScreen />} />
          <Route path="pages/:pageSlug" element={<PageEditScreen />} />
          <Route path="products" element={<ProductsScreen />} />
          <Route path="products/:categorySlug" element={<ProductListScreen />} />
          <Route path="machines" element={<MachinesScreen />} />
          <Route path="machines/:categorySlug" element={<MachineListScreen />} />
          <Route path="machines/:categorySlug/:machineSlug" element={<MachineEditScreen />} />
          <Route path="news" element={<NewsScreen />} />
          <Route path="news/categories" element={<NewsCategoriesScreen />} />
          <Route path="contact" element={<ContactScreen />} />
          <Route path="settings" element={<GlobalSettingsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
