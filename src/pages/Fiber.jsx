import React, { lazy, Suspense } from "react";
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

// 💫 Stylish Loader (same as Cotton & Home)
const StylishLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B] text-white">
      <div className="relative">
        {/* Spinner Ring */}
        <div className="w-16 h-16 border-4 border-transparent border-t-[#00B0F0] rounded-full animate-spin" />
        {/* Inner Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 bg-[#00B0F0] rounded-full animate-ping" />
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold tracking-wide animate-pulse">
        Loading Fiber Page...
      </p>
    </div>
  );
};

const Fiber = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<StylishLoader />}>
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
