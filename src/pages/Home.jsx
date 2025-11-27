import React, { lazy, Suspense, useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Lazy imports for performance
const HeroSection = lazy(() => import("../components/home/HeroSection"));
const ProductShowcase = lazy(() => import("../components/home/ProductShowcase"));
const PartnerSection = lazy(() => import("../components/home/PartnerSection"));
const ContactToday = lazy(() => import("../components/home/ContactToday"));
const WhoWeAreSection = lazy(() => import("../components/home/WhoWeAreSection"));
const WhatDefineUs = lazy(() => import("../components/home/WhatDefineUs"));
const CoreValues = lazy(() => import("../components/aboutus/CoreValues"));
const NewSection = lazy(() => import("../components/home/NewSection"));

// ✅ Shared Premium Page Loader
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Center Logo */}
      <img
        src="/logo/logo.png"
        alt="Loading..."
        className="w-20 h-20 object-contain z-10 animate-pulse"
      />
      {/* Spinning Border */}
      <div className="absolute inset-0 border-[6px] border-[#e5e7eb] border-t-[#164B8B] rounded-full animate-spin"></div>
    </div>
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);

  // ✅ Simulate a minimal preloader (1–1.5s) for smoother UX
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <main className="flex-grow">
          <HeroSection />
          <WhoWeAreSection />
          <ProductShowcase />
          <PartnerSection />
          <WhatDefineUs />
          <CoreValues />
          <NewSection />
          <ContactToday />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Home;
