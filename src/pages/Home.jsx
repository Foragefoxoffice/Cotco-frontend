import HeroSection from "../components/home/HeroSection";
import ProductShowcase from "../components/home/ProductShowcase";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import PartnerSection from "../components/home/PartnerSection";
import ContactToday from "../components/home/ContactToday";
import WhoWeAreSection from "../components/home/WhoWeAreSection";
import WhatDefineUs from "../components/home/WhatDefineUs";
import CoreValues from "../components/aboutus/CoreValues";
import NewSection from "../components/home/NewSection";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhoWeAreSection/>
        <ProductShowcase />
        {/* <VisionMissionSection /> */}
        <PartnerSection />
        {/* <CoreStrengthSection /> */}
        {/* <NewsEventsSection /> */}
        <WhatDefineUs />
        <CoreValues />
        <NewSection/>
        <ContactToday />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
