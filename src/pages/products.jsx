import React from "react";

import Navbar from "../components/layout/Navbar";
import ProductsHero from "../components/coctoproducts/ProductsHero";
import Footer from "../components/layout/Footer";
import MeetOurTeam from "../components/coctoproducts/OurTeam";
import LmwMachines from "../components/coctoproducts/LmwMachines";
import ContactToday from "../components/common/ContactToday";
import CustomerBenefits from "../components/coctoproducts/CustomerBenefits";
import PartnerSection from "../components/coctoproducts/PartnerSection";
const Products = () => {
  return (
    <div>
      <Navbar />
      <ProductsHero />
      <CustomerBenefits />
      <LmwMachines />
      <PartnerSection />
      <MeetOurTeam />
      <ContactToday />
      
      <Footer />
    </div>
  );
};

export default Products;
