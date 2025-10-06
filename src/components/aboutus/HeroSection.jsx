import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getAboutPage } from "../../Api/api";

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");
  const containerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ Helper to build full URL safely
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Detect and react to <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Observe for changes in language mode
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch hero data
  useEffect(() => {
    getAboutPage()
      .then((res) => {
        if (res.data?.aboutHero) {
          setHeroData(res.data.aboutHero);
        }
      })
      .catch((err) => console.error("Failed to fetch About page hero:", err));
  }, []);

  // ✅ Scroll state for zoom/shrink animation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]);

  // ✅ Multilingual text selector
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  if (!heroData) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 1, opacity: 1 }}
      animate={scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden hero transition-all duration-500 ease-out ${
        scrolled ? "rounded-2xl" : ""
      }`}
    >
      {/* ---------- Title ---------- */}
      <motion.div
        style={{ y: yTitle }}
        className="absolute top-[18%] w-full z-10 flex flex-col justify-center items-center text-center px-6 text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, scale: scrolled ? 0.95 : 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            scale: { duration: 0.6 },
          }}
          className="max-w-6xl"
        >
          <h3 className="text-4xl text-[#143A59] md:text-6xl font-bold tracking-wider uppercase">
            {pick(heroData.aboutTitle, activeLang) || "About Us"}
          </h3>
        </motion.div>
      </motion.div>

      {/* ---------- Background Image ---------- */}
      <div className="relative overflow-hidden md:pt-72">
        {heroData.aboutBanner && (
          <motion.img
            style={{ y: yImage }}
            src={getFullUrl(heroData.aboutBanner)}
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>
    </motion.div>
  );
};

export default HeroSection;
