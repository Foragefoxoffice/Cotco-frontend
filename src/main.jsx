import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import './assets/css/main.css'
import './assets/css/service.css'
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Cotton from './pages/Cotton';
import Fiber from './pages/Fiber';
import Contactus from './pages/Contactus';
import Products from './pages/products';
import ScrollToTop from './ScrollToTop';
import BlogList from './pages/BlogList';
import Login from './admin/Login/Login';
import Homepage from './admin/Dashboard/HomePage';
import Dashboard from './admin/Dashboard/Dashboard';
import Blogs from './admin/Blog/Blog';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/cotton" element={<Cotton />} />
        <Route path="/fiber" element={<Fiber />} />
        <Route path="/machines" element={<Products />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/blogs" element={<Blogs />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
