import React, { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Lazy load all sections for smoother initial load
const HeroSection = lazy(() => import("../components/contactus/HeroSection"));
const GetinTouch = lazy(() => import("../components/contactus/GetinTouch"));
const Form = lazy(() => import("../components/contactus/Form"));
const ContactMap = lazy(() => import("../components/contactus/ContactMap"));
const MeetOurTeam = lazy(() => import("../components/contactus/OurTeam"));
const ContactToday = lazy(() => import("../components/common/ContactToday"));

// 💫 Premium Unified Brand Loader (same as other main pages)
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out">
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Center Logo */}
      <img
        src="/logo/logo.png"
        alt="Loading..."
        className="w-20 h-20 object-contain z-10 animate-pulse"
      />
      {/* Spinning Ring */}
      <div className="absolute inset-0 border-[6px] border-[#e5e7eb] border-t-[#164B8B] rounded-full animate-spin"></div>
    </div>
  </div>
);

const Contactus = () => {
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
          <HeroSection />
          <MeetOurTeam />
          <Form />
          <GetinTouch />
          <ContactMap />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Contactus;
