import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../Blogs/HeroSection";
import BlogList from "../Blogs/BlogList";
const Blogs = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BlogList />
      <Footer />
    </div>
  );
};

export default Blogs;
