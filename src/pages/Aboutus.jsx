import React from "react";

import Navbar from "../components/layout/Navbar";
import AboutUsSection from "../components/aboutus/about";
import CoreStrengthSection from "../components/aboutus/CoreStrengthSection";
import FounderSection from "../components/aboutus/FounderSection";
import HeroSection from "../components/aboutus/HeroSection";
import VissionMission from "../components/aboutus/VissionMission";
import OurTeam from "../components/aboutus/OurTeam";
import Certification from "../components/aboutus/Certification";
import Partner from "../components/aboutus/Partners";
import Footer from "../components/layout/Footer";
import ExpertiseTimeline from "../components/aboutus/ExpertiseTimeline";

const Aboutus = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutUsSection />
      <FounderSection />
      <VissionMission />
      <CoreStrengthSection />
      <ExpertiseTimeline />
      <OurTeam />
      <Certification />
      <Partner />
      <Footer />
    </div>
  );
};

export default Aboutus;
