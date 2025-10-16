import React, { lazy, Suspense } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Lazy load all sections for smoother initial load
const HeroSection = lazy(() => import("../components/contactus/HeroSection"));
const GetinTouch = lazy(() => import("../components/contactus/GetinTouch"));
const Form = lazy(() => import("../components/contactus/Form"));
const ContactMap = lazy(() => import("../components/contactus/ContactMap"));
const MeetOurTeam = lazy(() => import("../components/contactus/OurTeam"));
const ContactToday = lazy(() => import("../components/common/ContactToday"));

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
        Loading Contact Page...
      </p>
    </div>
  );
};

const Contactus = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<StylishLoader />}>
        <main className="flex-grow">
          <HeroSection />
          <MeetOurTeam />
          <Form />
          <GetinTouch />
          <ContactMap />
          <ContactToday />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Contactus;
