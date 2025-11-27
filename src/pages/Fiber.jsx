import React, { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Lazy load each fiber section for performance
const FiberHero = lazy(() => import("../components/fiber/FiberHero"));
const CertificationSliderSection = lazy(() => import("../components/fiber/CertificationSliderSection"));
const MeetOurTeam = lazy(() => import("../components/fiber/OurTeam"));
const SupplierSection = lazy(() => import("../components/fiber/SuppliersSection"));
const FiberHighlightsSection = lazy(() => import("../components/fiber/FiberHighlightsSection"));
const SustainabilitySection = lazy(() => import("../components/fiber/SustainabilitySection"));
const WhyChooseViscose = lazy(() => import("../components/fiber/WhyChooseViscose"));

// 💫 Premium Brand Loader (unified with Home, About & Cotton)
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out">
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

const Fiber = () => {
  const [loading, setLoading] = useState(true);

  // Add slight preloader delay for premium smoothness
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
          <FiberHero />
          <SustainabilitySection />
          <WhyChooseViscose />
          <SupplierSection />
          <FiberHighlightsSection />
          <CertificationSliderSection />
          <MeetOurTeam />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Fiber;
