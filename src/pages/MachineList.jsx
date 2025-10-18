import React, { useEffect, useState, useRef } from "react";
import { Spin, Row, Col } from "antd";
import { Link, useParams } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import {
  getMachinePagesByCategorySlug,
  getMachineCategories,
} from "../Api/api";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MachineList = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState("en");
  const containerRef = useRef(null);

  // ✅ Base API URL
  const API_URL = import.meta.env.VITE_API_URL || "";

  // ✅ Helper for uploads
  const getFullImageURL = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (!path.startsWith("/")) path = "/" + path;
    return `${API_URL}${path}`;
  };

  // ✅ Detect language toggle from Navbar (via body class)
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const setLang = () => setActiveLang(detectLang());
    setLang();

    // React to future class changes
    const observer = new MutationObserver(setLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch category and its pages
  useEffect(() => {
    (async () => {
      try {
        const [catRes, pagesRes] = await Promise.all([
          getMachineCategories(),
          getMachinePagesByCategorySlug(categorySlug),
        ]);

        const cats = catRes.data.data || [];
        const foundCat = cats.find((c) => c.slug === categorySlug);

        if (foundCat) {
          foundCat.icon = getFullImageURL(foundCat.icon);
          foundCat.image = getFullImageURL(foundCat.image);
          foundCat.createMachineCatBgImage = getFullImageURL(
            foundCat.createMachineCatBgImage
          );
        }

        const pages = (pagesRes.data.data || []).map((m) => ({
          ...m,
          banner: getFullImageURL(m.banner),
        }));

        setCategory(foundCat || null);
        setMachines(pages);
      } catch (err) {
        console.error("❌ Error fetching machine data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [categorySlug]);

  // ✅ Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Parallax scroll for banner
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, -60]);

  // ✅ Pick correct language text helper
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0B0B0B]">
        <Spin size="large" />
      </div>
    );

  // ✅ Background banner priority
  let bannerUrl = "/img/default-banner.jpg";
  if (category?.createMachineCatBgImage) {
    bannerUrl = getFullImageURL(category.createMachineCatBgImage);
  } else if (category?.image) {
    bannerUrl = getFullImageURL(category.image);
  } else if (category?.icon) {
    bannerUrl = getFullImageURL(category.icon);
  }

  console.log("🖼️ Banner URL:", bannerUrl);

  return (
    <div>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <motion.section
        ref={containerRef}
        style={{
          background: `url('${bannerUrl}') center/cover no-repeat`,
          y: yImage,
        }}
        initial={{ scale: 1, opacity: 1 }}
        animate={
          scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative h-[70vh] md:min-h-[80vh] overflow-hidden transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl" : ""
        }`}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Title and description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 flex flex-col justify-end items-start text-center z-20 p-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-widest drop-shadow-lg">
            {pick(category?.createMachineCatTitle) ||
              pick(category?.name) ||
              categorySlug.replace(/-/g, " ")}
          </h1>

        </motion.div>
      </motion.section>

      {/* ================= CATEGORY DESCRIPTION ================= */}
      <div className="page-width py-16">
        <Row gutter={[32, 32]} align="middle">
          {/* Left side - Description */}
          <Col xs={24} md={14}>
            <p className="text-gray-700 text-lg leading-relaxed">
              {pick(category?.createMachineCatDes)}
            </p>
          </Col>

          {/* Right side - Icon */}
          <Col xs={24} md={10} className="flex justify-center md:justify-end">
            {category?.icon && (
              <img
                src={getFullImageURL(category.icon)}
                alt={pick(category?.name)}
                className="max-h-40 object-contain"
              />
            )}
          </Col>
        </Row>
      </div>

      {/* ================= MAIN MACHINES TITLE ================= */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0D3B66] uppercase tracking-wide relative inline-block">
          {pick(category?.createMachineCatTitle)}
        </h2>
      </div>

      {/* ================= MACHINE LIST ================= */}
      <div className="page-width pb-20">
        <Row gutter={[24, 24]}>
          {machines.length > 0 ? (
            machines.map((machine) => (
              <Col xs={24} sm={12} md={12} key={machine._id}>
                <Link to={`/machines/${categorySlug}/${machine.slug}`}>
                  <div className="rounded-xl overflow-hidden transition duration-300">
                    {machine.banner ? (
                      <img
                        alt={pick(machine.title)}
                        src={getFullImageURL(machine.banner)}
                        className="h-[300px] w-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="h-[300px] w-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 text-sm rounded-xl">
                        No Banner
                      </div>
                    )}

                    <div className="flex justify-between items-center bg-[#0D3B66] text-white px-5 py-8 mt-4 rounded-xl">
                      <h3 className="font-semibold uppercase tracking-wide text-sm md:text-base">
                        {pick(machine.title)}
                      </h3>
                      <div className="w-9 h-9 flex items-center justify-center border border-white text-white rounded-full transition hover:bg-white hover:text-[#0D3B66]">
                        <FiArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div className="text-center text-gray-500 text-lg py-10">
                {activeLang === "vi"
                  ? "Không có máy nào trong danh mục này"
                  : "No machines found for this category."}
              </div>
            </Col>
          )}
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default MachineList;
