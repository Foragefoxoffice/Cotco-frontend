import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // ✅ added Navigate
import "./index.css";
import "./assets/css/main.css";
import "./assets/css/service.css";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Cotton from "./pages/Cotton";
import Fiber from "./pages/Fiber";
import Contactus from "./pages/Contactus";
import Products from "./pages/products";
import ScrollToTop from "./ScrollToTop";
import BlogList from "./pages/BlogList";
import Login from "./admin/Login/Login";
import Homepage from "./admin/Dashboard/HomePage";
import Dashboard from "./admin/Dashboard/Dashboard";
import AddBlogs from "./admin/Blog/AddBlogs";
import { ToastContainer } from "react-toastify";
import BlogOverview from "./Blogs/BlogOverview";
import BlogLists from "./admin/Blog/BlogLists";
import Users from "./admin/Users/Users";
import Blogs from "./pages/Blogs";

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
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/cotton" element={<Cotton />} />
        <Route path="/fiber" element={<Fiber />} />
        <Route path="/machines" element={<Products />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogOverview />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog-widgets"
          element={
            <ProtectedRoute>
              <AddBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bloglist"
          element={
            <ProtectedRoute>
              <BlogLists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
