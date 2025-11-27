import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../Blogs/HeroSection";
import BlogList from "../Blogs/BlogList";

const Blogs = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Logo in center */}
            <img
              src="/logo/logo.png" // ✅ Ensure this path is correct
              alt="Loading..."
              className="w-20 h-20 object-contain z-10"
            />
            {/* Spinning ring */}
            <div className="absolute inset-0 border-[6px] border-[#e5e7eb] border-t-[#164B8B] rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <Navbar />
      <HeroSection />
      {/* ✅ BlogList controls loader visibility */}
      <BlogList onLoaded={() => setIsLoading(false)} />
      <Footer />
    </div>
  );
};

export default Blogs;
