import React, { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/privacyPolicy/HeroSection";
import PrivacyPolicyContent from "../components/privacyPolicy/PrivacyPolicyContent";
import SEO from "../components/SEO";
import { getPrivacyPage } from "../Api/api";

export default function PrivacyPolicy() {
    const [seoData, setSeoData] = useState(null);

    useEffect(() => {
        getPrivacyPage().then((res) => {
            if (res.data?.seoMeta) {
                setSeoData(res.data.seoMeta);
            }
        }).catch(err => console.error(err));
    }, []);

    return (
        <>
            <SEO seoMeta={seoData} defaultTitle="COTCO Vietnam | Privacy Policy" />
            <Navbar />
            <HeroSection />
            <PrivacyPolicyContent />
            <Footer />
        </>
    )
}