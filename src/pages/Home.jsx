import { lazy, Suspense } from "react";
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

// 💫 Stylish Loader
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
        Loading Home Page...
      </p>
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<StylishLoader />}>
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
