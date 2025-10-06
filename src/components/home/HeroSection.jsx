import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowDownRight } from "react-icons/fi";
import { getHomepage } from "../../Api/api";

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [activeLang, setActiveLang] = useState("en"); // ✅ language state
  const videoRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Detect scroll for animation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Detect body language class
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    if (saved === "vi" || saved === "en") {
      setActiveLang(saved);
      document.body.classList.toggle("vi-mode", saved === "vi");
    } else {
      setActiveLang(detectLanguage());
    }

    // Watch for changes
    const observer = new MutationObserver(() =>
      setActiveLang(detectLanguage())
    );
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Fetch homepage hero data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.heroSection) {
        setHeroData(res.data.heroSection);
      }
    });
  }, []);

  if (!heroData) return null;

  const isVideo =
    heroData.bgType === "video" ||
    /\.(mp4|webm|mov)$/i.test(heroData.bgUrl || "");

  // ✅ Helper to pick correct language field
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Language toggle handler
  const toggleLanguage = () => {
    const newLang = activeLang === "en" ? "vi" : "en";
    setActiveLang(newLang);
    localStorage.setItem("preferred_lang", newLang);

    // Update body class so other pages react too
    document.body.classList.toggle("vi-mode", newLang === "vi");
  };

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      animate={scrolled ? { scale: 0.95, opacity: 0.9 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden hero min-h-screen transition-all duration-500 ease-out ${
        scrolled ? "rounded-2xl shadow-2xl" : ""
      }`}
    >
      {/* ---------- Background ---------- */}
      {isVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/img/fallback/home.jpg"
        >
          <source
            src={`${BASE_URL}${heroData.bgUrl}`}
            type={`video/${(heroData.bgUrl.split(".").pop() || "mp4").split("?")[0]}`}
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={`${BASE_URL}${heroData.bgUrl}`}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ---------- Dark Overlay ---------- */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ---------- Language Switcher ---------- */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium text-white backdrop-blur-md transition"
        >
          {activeLang === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
        </button>
      </div>

      {/* ---------- Text Content ---------- */}
      <div className="absolute md:bottom-0 bottom-10 md:px-12 p-6 pb-20 text-white max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          {pick(heroData.heroTitle) || "Your Trusted Partner"} <br />
        </h1>
        <p className="mt-4 text-lg">
          {pick(heroData.heroDescription) || "Empowering Vietnam’s Textile Industry"}
        </p>

        {heroData.heroButtonLink?.[activeLang] && (
          <a
            href={heroData.heroButtonLink[activeLang]}
            className="w-60 mt-6 px-5 py-2 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black hover:text-white transition-all text-xl font-semibold"
          >
            {pick(heroData.heroButtonText) || "Explore Products"}{" "}
            <FiArrowDownRight />
          </a>
        )}
      </div>
    </motion.div>
  );
}
