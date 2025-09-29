import React from "react";

import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/contactus/HeroSection";
import GetinTouch from "../components/contactus/GetinTouch";
import Form from "../components/contactus/Form";
import ContactMap from "../components/contactus/ContactMap";
import MeetOurTeam from "../components/contactus/OurTeam";
import ContactToday from "../components/common/ContactToday";
import Footer from "../components/layout/Footer";

const Contactus = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <MeetOurTeam />
      <Form />
      <GetinTouch />
      <ContactMap />
      <ContactToday />
      <Footer />
    </div>
  );
};

export default Contactus;
