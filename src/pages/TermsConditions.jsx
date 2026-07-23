import React, { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/termsandconditions/HeroSection";
import TermsConditionsContent from "../components/termsandconditions/TermsContionsContent";
import SEO from "../components/SEO";
import { getTermsPage } from "../Api/api";

export default function TermsConditions() {
    const [seoData, setSeoData] = useState(null);

    useEffect(() => {
        getTermsPage().then((res) => {
            if (res.data?.seoMeta) {
                setSeoData(res.data.seoMeta);
            }
        }).catch(err => console.error(err));
    }, []);

    return (
        <>
            <SEO seoMeta={seoData} defaultTitle="COTCO Vietnam | Terms & Conditions" />
            <Navbar />
            <HeroSection />
            <TermsConditionsContent />
            <Footer />
        </>
    )
}