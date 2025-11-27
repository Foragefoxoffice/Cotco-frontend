import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { getMachineCategories } from "../Api/api";
import MachineBenifie from "../components/machines/MachinesBenifite";
import Machines from "../components/machines/Machines";
import Navbar from "../components/layout/Navbar";
import Partner from "../components/aboutus/Partners";
import Footer from "../components/layout/Footer";
import OurTeam from "../components/coctoproducts/OurTeam";

// 💫 Premium Brand Loader (unified across all pages)
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out">
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

// ✅ Helper: prepend base URL for local uploads
const BASE_URL = import.meta.env.VITE_API_URL;
const getFullImageURL = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) path = "/" + path;
  return `${BASE_URL}${path}`;
};

const MachinesMain = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language (based on body class)
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    if (saved === "vi" || saved === "en") {
      setActiveLang(saved);
      document.body.classList.toggle("vi-mode", saved === "vi");
    } else {
      setActiveLang(detectLang());
    }

    const observer = new MutationObserver(() => setActiveLang(detectLang()));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch machine categories with proper image URLs
  useEffect(() => {
    (async () => {
      try {
        const res = await getMachineCategories();
        const fetched = res.data.data || [];

        // Normalize image URLs
        const fixed = fetched.map((cat) => ({
          ...cat,
          image: getFullImageURL(cat.image),
          icon: getFullImageURL(cat.icon),
          createMachineCatBgImage: getFullImageURL(cat.createMachineCatBgImage),
        }));

        setCategories(fixed);
      } catch (err) {
        console.error("❌ Error fetching machine categories:", err);
      } finally {
        // ✅ Add a short delay for a smooth loader transition
        setTimeout(() => setLoading(false), 1200);
      }
    })();
  }, []);

  // ✅ Show premium loader until data fetched
  if (loading) return <PageLoader />;

  // ✅ Translation helper
  const pick = (en, vi) => (activeLang === "vi" ? vi || en : en);

  return (
    <main>
      <Navbar />
      <Machines />
      <MachineBenifie />

      {/* Machine Categories Grid */}
      <div className="page-width py-3">
        <Row gutter={[16, 16]}>
          {categories
            .slice()
            .reverse()
            .map((cat) => (
              <Col xs={24} md={12} lg={12} key={cat._id}>
                <Link to={`/machines/${cat.slug}`}>
                  <div className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    {cat.image ? (
                      <img
                        src={getFullImageURL(cat.image)}
                        alt={pick(cat.name?.en, cat.name?.vi)}
                        className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-[400px] flex items-center justify-center bg-[#222] text-gray-400 text-sm">
                        No Image Available
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                    <div className="absolute top-3 right-3 text-white/80 group-hover:text-white transition border p-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-3xl font-semibold">
                        {pick(cat.name?.en, cat.name?.vi)}
                      </h3>
                      <p className="text-white/80 text-md font-light">
                        {pick(cat.description?.en, cat.description?.vi)}
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
        </Row>
      </div>
      <Partner />
      <OurTeam />
      <Footer />
    </main>
  );
};

export default MachinesMain;
