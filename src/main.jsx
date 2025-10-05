import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./assets/css/main.css";
import "./assets/css/service.css";
import "antd/dist/reset.css";

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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
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
import MachineListScreen from "./pages/MachineListScreen";
import MachineEditScreen from "./pages/MachineEditScreen"; // create new page
import EditMachinePage from "./pages/EditMachinePage";     // edit existing page
import NewsCategoriesScreen from "./pages/NewsCategoriesScreen";

import Login from "./admin/Login/Login";
import Homepage from "./admin/Dashboard/HomePage";
import AboutPage from "./admin/Dashboard/AboutPage";
import CottonPage from "./admin/Dashboard/CottonPage";
import FiberPage from "./admin/Dashboard/FiberPage";
import HeaderPage from "./admin/Dashboard/HeaderPage";

import AddBlogs from "./admin/Blog/AddBlogs";
import BlogLists from "./admin/Blog/BlogLists";
import CategoriesCreate from "./admin/Blog/CategoriesCreate";
import Users from "./admin/Users/Users";
import CategoriesList from "./admin/Blog/CategoriesList";
import CategoryEdit from "./admin/Blog/CategoryEdit";
import SectionCreate from "./admin/SectionCreate";
import AdminLayout from "./admin/AdminLayout";

// Machines public pages
import MachineCategoriesScreen from "./pages/MachineCategoriesScreen";
import MachinesMain from "./pages/MachinesMain";
import MachineCategories from "./pages/MachineCategories";
import MachineDetail from "./pages/MachineDetail";
import MachineList from "./pages/MachineList";

// Toast
import { ToastContainer } from "react-toastify";
import MachinePage from "./pages/MachinePage";
import ContactPage from "./admin/Dashboard/ContactPage";
import PrivacyPage from "./admin/Dashboard/PrivacyPage";
import TermsConditionsPage from "./admin/Dashboard/TermsConditionsPage";
import FooterPage from "./admin/Dashboard/FooterPage";

// 🔒 Protect dashboard-related routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const root = createRoot(document.getElementById("root"));
root.render(
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
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogOverview />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/login" element={<Login />} />

          {/* 🏭 Machines routes (public) */}
          <Route path="/machines" element={<MachinesMain />} />
          <Route path="/machines/:categorySlug" element={<MachineList />} />
          <Route
            path="/machines/:categorySlug/:pageSlug"
            element={<MachinePage />}
          />

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

            {/* ✅ Admin dashboard pages */}
            <Route path="header" element={<HeaderPage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="cotton" element={<CottonPage />} />
            <Route path="fiber" element={<FiberPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPage />} />
            <Route path="terms-conditions" element={<TermsConditionsPage />} />
            <Route path="footer" element={<FooterPage />} />

            {/* ✅ Machines (Admin) */}
            <Route path="machines/categories" element={<MachineCategoriesScreen />} />
            <Route path="machines/list" element={<MachineListScreen />} />
            <Route path="machines/new" element={<MachineEditScreen />} />
            <Route path="machines/pages/:id/edit" element={<EditMachinePage />} />

            {/* Other admin */}
            <Route path="news" element={<NewsScreen />} />
            <Route path="news/categories" element={<NewsCategoriesScreen />} />
            <Route path="settings" element={<GlobalSettingsScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
