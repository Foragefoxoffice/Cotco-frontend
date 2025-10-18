import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./assets/css/main.css";
import "./assets/css/service.css";
import "antd/dist/reset.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🌐 Public Pages
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

// 🛠️ Admin Core
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/Login/Login";

// 🧭 Admin Dashboard Pages
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

// 📰 Admin Blog / Resources
import NewsScreen from "./pages/NewsScreen";
import NewsCategoriesScreen from "./pages/NewsCategoriesScreen";
import NewsMainCategoriesScreen from "./pages/NewsMainCategoriesScreen";

// 🧾 Admin CMS & Global Settings
import PagesScreen from "./pages/PagesScreen";
import PageEditScreen from "./pages/PageEditScreen";
import ProductsScreen from "./pages/ProductsScreen";
import ProductListScreen from "./pages/ProductListScreen";
import GlobalSettingsScreen from "./pages/GlobalSettingsScreen";
import ContactEntriesScreen from "./pages/ContactEntriesScreen";

// ⚙️ Role / Staff Management
import RoleManagement from "./pages/RoleManagement";
import StaffManagement from "./pages/StaffManagement";

// 🏭 Machines
import MachineCategoriesScreen from "./pages/MachineCategoriesScreen";
import MachineListScreen from "./pages/MachineListScreen";
import MachineEditScreen from "./pages/MachineEditScreen";
import EditMachinePage from "./pages/EditMachinePage";
import MachinesMain from "./pages/MachinesMain";
import MachineCategories from "./pages/MachineCategories";
import MachineList from "./pages/MachineList";
import MachinePage from "./pages/MachinePage";

// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 🚀 Render App
createRoot(document.getElementById("root")).render(
  <StrictMode>
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
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/cotton" element={<Cotton />} />
        <Route path="/fiber" element={<Fiber />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        {/* 🏭 Machines (Public) */}
        <Route path="/machines" element={<MachinesMain />} />
        <Route path="/machines/:categorySlug" element={<MachineList />} />
        <Route
          path="/machines/:categorySlug/:pageSlug"
          element={<MachinePage />}
        />

        {/* 🔐 Login */}
        <Route path="/login" element={<Login />} />

        {/* 🧭 ADMIN SECTION (must come BEFORE wildcard blog routes) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* 📊 Dashboard */}
          <Route index element={<Dashboard />} />

          {/* 📄 CMS Pages */}
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
          <Route path="knowledge" element={<KnowledgeManagementPage />} /> {/* ✅ Fixed lowercase 'path' */}

          {/* 📰 Resources / Blog Management */}
          <Route path="resources" element={<NewsScreen />} />
          <Route
            path="resources/main-categories"
            element={<NewsMainCategoriesScreen />}
          />
          <Route
            path="resources/categories"
            element={<NewsCategoriesScreen />}
          />

          {/* ⚙️ CMS & Settings */}
          <Route path="pages" element={<PagesScreen />} />
          <Route path="pages/:pageSlug" element={<PageEditScreen />} />
          <Route path="products" element={<ProductsScreen />} />
          <Route path="products/:categorySlug" element={<ProductListScreen />} />
          <Route path="settings" element={<GlobalSettingsScreen />} />

          {/* 🏭 Machine Management */}
          <Route path="machines/categories" element={<MachineCategoriesScreen />} />
          <Route path="machines/list" element={<MachineListScreen />} />
          <Route path="machines/new" element={<MachineEditScreen />} />
          <Route path="machines/pages/:id/edit" element={<EditMachinePage />} />

          {/* 📬 Contact Entries */}
          <Route path="contacts" element={<ContactEntriesScreen />} />

          {/* 👥 Roles & Staff */}
          <Route path="roles" element={<RoleManagement />} />
          <Route path="staffmanagement" element={<StaffManagement />} />
        </Route>

        {/* 📰 BLOGS / RESOURCES (placed AFTER /admin to prevent collisions) */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/:mainCategorySlug" element={<Blogs />} />
        <Route path="/:mainCategorySlug/:slug" element={<BlogOverview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
