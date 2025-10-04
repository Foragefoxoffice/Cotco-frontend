import React from "react";

import Navbar from "../components/layout/Navbar";
import CottonHero from "../components/cotton/CottonHero";
import Footer from "../components/layout/Footer";
import MeetOurTeam from "../components/cotton/OurTeam";
import SuppliersSection from "../components/cotton/SuppliersSection";
import CottonTrustSection from "../components/cotton/CottonTrustSection";
import CertificationSliderSection from "../components/cotton/CertificationSliderSection";
const Cotton = () => {
  return (
    <div>
      <Navbar />
      <CottonHero />
      <SuppliersSection />
      <CottonTrustSection />
      <CertificationSliderSection />
      <MeetOurTeam />
      <Footer />
    </div>
  );
};

export default Cotton;
