import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { HeadProvider } from "react-head";   // ⭐ Add this line

import "./index.css";
import "./assets/css/main.css";
import "./assets/css/service.css";
import "antd/dist/reset.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
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

// Admin Core
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/Login/Login";

// Admin Pages
import Dashboard from "./components/Dashboard";
import Homepage from "./admin/Dashboard/HomePage";
import AboutPage from "./admin/Dashboard/AboutPage";
import CottonPage from "./admin/Dashboard/CottonPage";
import FiberPage from "./admin/Dashboard/FiberPage";
import HeaderPage from "./admin/Dashboard/HeaderPage";
import FooterPage from "./admin/Dashboard/FooterPage";
import ContactPage from "./admin/Dashboard/ContactPage";
import MachineCMSPage from "./admin/Dashboard/MachineCMSPage";
import PrivacyPage from "./admin/Dashboard/PrivacyPage";
import TermsConditionsPage from "./admin/Dashboard/TermsConditionsPage";
import KnowledgeManagementPage from "./admin/Dashboard/KnowledgeManagementPage";

import NewsScreen from "./pages/NewsScreen";
import NewsCategoriesScreen from "./pages/NewsCategoriesScreen";
import NewsMainCategoriesScreen from "./pages/NewsMainCategoriesScreen";

import PagesScreen from "./pages/PagesScreen";
import PageEditScreen from "./pages/PageEditScreen";
import ProductsScreen from "./pages/ProductsScreen";
import ProductListScreen from "./pages/ProductListScreen";
import GlobalSettingsScreen from "./pages/GlobalSettingsScreen";
import ContactEntriesScreen from "./pages/ContactEntriesScreen";

import RoleManagement from "./pages/RoleManagement";
import StaffManagement from "./pages/StaffManagement";

import MachineCategoriesScreen from "./pages/MachineCategoriesScreen";
import MachineListScreen from "./pages/MachineListScreen";
import MachineEditScreen from "./pages/MachineEditScreen";
import EditMachinePage from "./pages/EditMachinePage";
import MachinesMain from "./pages/MachinesMain";
import MachineList from "./pages/MachineList";
import MachinePage from "./pages/MachinePage";

import Maintenance from "./pages/Maintenance";

// ================================
// 🛠 FIXED MAINTENANCE MODE
// ================================
const MaintenanceMode = () => {
  const isMaintenance = localStorage.getItem("maintenance") === "true";

  const isAdminPath = window.location.pathname.startsWith("/admin");
  const isMaintenancePage = window.location.pathname === "/maintenance";

  if (isAdminPath) return <Outlet />;
  if (isMaintenancePage) return <Outlet />;

  return isMaintenance ? <Navigate to="/maintenance" replace /> : <Outlet />;
};

// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 🚀 Render App With HEAD PROVIDER FIXED ✔
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeadProvider>
      {/* ⭐ IMPORTANT: Helmet / Title / Meta now works everywhere */}
      <BrowserRouter>
        <ScrollToTop />
        <ToastContainer />

        <Routes>
          {/* Maintenance Page */}
          <Route path="/maintenance" element={<Maintenance />} />

          {/* PUBLIC ROUTES - Wrapped by MaintenanceMode */}
          <Route element={<MaintenanceMode />}>
            {/* <Route path="/" element={<Maintenance />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/cotton" element={<Cotton />} />
            <Route path="/fiber" element={<Fiber />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contactus />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />

            {/* Machines */}
            <Route path="/machines" element={<MachinesMain />} />
            <Route path="/machines/:categorySlug" element={<MachineList />} />
            <Route path="/machines/:categorySlug/:pageSlug" element={<MachinePage />} />

            {/* Blogs */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/:mainCategorySlug" element={<Blogs />} />
            <Route path="/:mainCategorySlug/:slug" element={<BlogOverview />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* CMS */}
            <Route path="header" element={<HeaderPage />} />
            <Route path="footer" element={<FooterPage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="cotton" element={<CottonPage />} />
            <Route path="fiber" element={<FiberPage />} />
            <Route path="machine" element={<MachineCMSPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPage />} />
            <Route path="terms-conditions" element={<TermsConditionsPage />} />
            <Route path="knowledge" element={<KnowledgeManagementPage />} />

            {/* Resources */}
            <Route path="resources" element={<NewsScreen />} />
            <Route path="resources/main-categories" element={<NewsMainCategoriesScreen />} />
            <Route path="resources/categories" element={<NewsCategoriesScreen />} />

            {/* CMS Content */}
            <Route path="pages" element={<PagesScreen />} />
            <Route path="pages/:pageSlug" element={<PageEditScreen />} />
            <Route path="products" element={<ProductsScreen />} />
            <Route path="products/:categorySlug" element={<ProductListScreen />} />
            <Route path="settings" element={<GlobalSettingsScreen />} />

            {/* Machines */}
            <Route path="machines/categories" element={<MachineCategoriesScreen />} />
            <Route path="machines/list" element={<MachineListScreen />} />
            <Route path="machines/new" element={<MachineEditScreen />} />
            <Route path="machines/pages/:id/edit" element={<EditMachinePage />} />

            {/* Contacts */}
            <Route path="contacts" element={<ContactEntriesScreen />} />

            {/* Staff */}
            <Route path="roles" element={<RoleManagement />} />
            <Route path="staffmanagement" element={<StaffManagement />} />
          </Route>

          {/* Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
);
