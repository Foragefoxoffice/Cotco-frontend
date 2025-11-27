import React, { useEffect, useState, lazy, Suspense } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAboutPage } from "../Api/api";

// ✅ Lazy load components
const HeroSection = lazy(() => import("../components/aboutus/HeroSection"));
const AboutUsSection = lazy(() => import("../components/aboutus/about"));
const FounderSection = lazy(() => import("../components/aboutus/FounderSection"));
const VissionMission = lazy(() => import("../components/aboutus/VissionMission"));
const CoreStrengthSection = lazy(() => import("../components/aboutus/CoreStrengthSection"));
const ExpertiseTimeline = lazy(() => import("../components/aboutus/ExpertiseTimeline"));
const OurTeam = lazy(() => import("../components/aboutus/OurTeam"));
const Certification = lazy(() => import("../components/aboutus/Certification"));
const Partner = lazy(() => import("../components/aboutus/Partners"));

// ✅ Shared Page Loader
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="relative w-40 h-40 flex items-center justify-center">
      <img
        src="/logo/logo.png"
        alt="Loading..."
        className="w-20 h-20 object-contain z-10"
      />
      <div className="absolute inset-0 border-[6px] border-[#e5e7eb] border-t-[#164B8B] rounded-full animate-spin"></div>
    </div>
  </div>
);

const Aboutus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAboutPage();
        console.log("✅ About Page Data:", res.data);
        if (res.data) setData(res.data);
      } catch (err) {
        console.error("❌ Failed to load About Page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Loader while waiting for API
  if (loading || !data) return <PageLoader />;

  // ✅ Safely pass props only if they exist
  return (
    <div>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        {data.aboutHero && <HeroSection data={data.aboutHero} />}
        {data.aboutOverview && <AboutUsSection data={data.aboutOverview} />}
        {data.aboutFounder && <FounderSection data={data.aboutFounder} />}
        {data.aboutMissionVission && (
          <VissionMission data={data.aboutMissionVission} />
        )}
        {data.aboutCore && <CoreStrengthSection data={data.aboutCore} />}
        {data.aboutHistorySection && (
          <ExpertiseTimeline data={data.aboutHistorySection} />
        )}
        {data.aboutTeam && <OurTeam data={data.aboutTeam} />}
        {data.aboutAlliances && <Certification data={data.aboutAlliances} />}
        {data.aboutAlliances && <Partner data={data.aboutAlliances} />}
      </Suspense>
      <Footer />
    </div>
  );
};

export default Aboutus;
