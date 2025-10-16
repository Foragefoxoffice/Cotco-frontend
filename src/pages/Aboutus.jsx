import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/aboutus/HeroSection";
import AboutUsSection from "../components/aboutus/about";
import FounderSection from "../components/aboutus/FounderSection";
import VissionMission from "../components/aboutus/VissionMission";
import CoreStrengthSection from "../components/aboutus/CoreStrengthSection";
import ExpertiseTimeline from "../components/aboutus/ExpertiseTimeline";
import OurTeam from "../components/aboutus/OurTeam";
import Certification from "../components/aboutus/Certification";
import Partner from "../components/aboutus/Partners";

import { getAboutPage } from "../Api/api";

// 🌈 Stylish Loader Component
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
        Loading About Page...
      </p>
    </div>
  );
};

const Aboutus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all About page data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAboutPage();
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load About Page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <StylishLoader />;

  return (
    <div>
      <Navbar />

      {/* Pass each section's data as props */}
      <HeroSection data={data.aboutHero} />
      <AboutUsSection data={data.aboutOverview} />
      <FounderSection data={data.aboutFounder} />
      <VissionMission data={data.aboutMissionVission} />
      <CoreStrengthSection data={data.aboutCore} />
      <ExpertiseTimeline data={data.aboutHistorySection} />
      <OurTeam data={data.aboutTeam} />
      <Certification data={data.aboutAlliances} />
      <Partner data={data.aboutAlliances} />

      <Footer />
    </div>
  );
};

export default Aboutus;
