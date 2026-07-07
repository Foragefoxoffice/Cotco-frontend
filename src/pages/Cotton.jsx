import React, { lazy, Suspense, useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Lazy load each heavy section for performance
const CottonHero = lazy(() => import("../components/cotton/CottonHero"));
const SuppliersSection = lazy(() => import("../components/cotton/SuppliersSection"));
const CottonTrustSection = lazy(() => import("../components/cotton/CottonTrustSection"));
const CertificationSliderSection = lazy(() => import("../components/cotton/CertificationSliderSection"));
const MeetOurTeam = lazy(() => import("../components/cotton/OurTeam"));

// 💫 Premium Brand Loader (same as Home & About)
const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
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

import { getCottonPage } from "../Api/api";

const Cotton = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCottonPage()
      .then((res) => {
        const bannerImg = res.data?.cottonBanner?.cottonBannerImg;
        if (bannerImg) {
          const url = bannerImg.startsWith("http")
            ? bannerImg
            : `${import.meta.env.VITE_API_URL}${bannerImg}`;

          const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
          if (isVideo) {
            const video = document.createElement("video");
            video.muted = true;
            video.playsInline = true;
            video.oncanplaythrough = () => setLoading(false);
            video.onerror = () => setLoading(false);
            video.src = url;
            video.load();
          } else {
            const img = new Image();
            img.onload = () => setLoading(false);
            img.onerror = () => setLoading(false);
            img.src = url;
          }
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <main className="flex-grow">
          <CottonHero />
          <SuppliersSection />
          <CottonTrustSection />
          <CertificationSliderSection />
          <MeetOurTeam />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Cotton;
