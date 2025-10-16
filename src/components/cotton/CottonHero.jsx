import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { getCottonPage } from "../../Api/api";

export default function CottonHero() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const [activeLang, setActiveLang] = useState("en"); // ✅ bilingual support

  const controls = useAnimation();
  const shadowControls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  // ✅ Fetch CMS data
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonBanner) {
        setBannerData(res.data.cottonBanner);
      }
    });
  }, []);

  // ✅ Detect screen size + scroll
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ Language Detection + Sync with body + LocalStorage
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

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // ✅ Language switcher handler
  const toggleLanguage = () => {
    const newLang = activeLang === "en" ? "vi" : "en";
    setActiveLang(newLang);
    localStorage.setItem("preferred_lang", newLang);
    document.body.classList.toggle("vi-mode", newLang === "vi");
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        right: isMobile ? "-23px" : "0%",
        top: isMobile ? "125%" : "110%",
        width: isMobile ? "50%" : "30%",
        opacity: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
      });
      shadowControls.start({
        opacity: 0.3,
        scale: 1,
        transition: { duration: 1, ease: "easeOut" },
      });
      textControls.start("visible");
    } else {
      controls.start({
        right: "-200px",
        top: "50%",
        width: isMobile ? "239px" : "240px",
        opacity: 1,
        transition: { duration: 0.8, ease: "easeIn" },
      });
      shadowControls.start({
        opacity: 1,
        scale: 0.5,
        transition: { duration: 0.8, ease: "easeIn" },
      });
      textControls.start("hidden");
    }
  }, [isInView, controls, shadowControls, textControls, isMobile]);

  const textVariants = {
    hidden: { opacity: 1, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.3, duration: 0.8, ease: "easeOut" },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 1, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (!bannerData) return null;

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Helper to get correct language text
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  const bannerMedia = getFullUrl(bannerData.cottonBannerImg);
  const bannerSlides = (bannerData.cottonBannerSlideImg || []).map(getFullUrl);

  const title = pick(bannerData.cottonBannerTitle);
  const description = pick(bannerData.cottonBannerDes);
  const overview = pick(bannerData.cottonBannerOverview);

  const isVideo =
    bannerMedia?.endsWith(".mp4") ||
    bannerMedia?.endsWith(".webm") ||
    bannerMedia?.endsWith(".ogg");

  const overviewParagraphs = overview.split("\n").filter((p) => p.trim() !== "");

  return (
    <section className="relative bg-white hero overflow-hidden">
      {/* ✅ Language Switcher */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium text-white backdrop-blur-md transition"
        >
          {activeLang === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
        </button>
      </div>

      {/* ---------- Media Section ---------- */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={scrolled ? { scale: 0.9, opacity: 0.9 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : ""
        }`}
      >
        <motion.div className="w-full flex justify-center">
          <div className="absolute z-10 bottom-5 md:bottom-[200px] left-6 md:left-15">
            <h1 className="text-6xl md:text-[100px] text-white font-[700] !mb-0 cotton-section-heading">
              {title}
            </h1>
            <p className="text-white text-[14px] md:text-[20px] pl-1 cotton-section-subheading">
              {description}
            </p>
          </div>

          {/* ✅ Show video if uploaded, else image */}
          {isVideo ? (
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              src={bannerMedia}
              className={`w-full hidden md:block ${
                scrolled ? "rounded-3xl" : "rounded-none"
              }`}
            />
          ) : (
            <motion.img
              src={bannerMedia}
              alt="Cotton Banner"
              className={`w-full hidden md:block ${
                scrolled ? "rounded-3xl" : "rounded-none"
              }`}
            />
          )}

          {/* Mobile Media */}
          <div className="relative w-full h-screen block md:hidden">
            {isVideo ? (
              <motion.video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                src={bannerMedia}
                className="absolute top-0 left-0 w-screen h-screen object-cover"
              />
            ) : (
              <motion.img
                src={bannerMedia}
                alt="Cotton Banner"
                className="absolute top-0 left-0 w-screen h-screen object-cover"
              />
            )}
          </div>

          {/* ✅ Left Bubble */}
          {bannerSlides[0] && (
            <motion.img
              src={bannerSlides[0]}
              alt="Cotton Left"
              className="absolute left-[-11%] top-[25%] -translate-y-1/2 w-60 hidden md:block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          )}

          {/* ✅ Right Bubble + Shadow */}
          {(bannerSlides[1] || bannerSlides[0]) && (
            <motion.div
              initial={{ position: "absolute", right: "-200px", top: "70%" }}
              animate={controls}
              className="hidden md:block"
              style={{ position: "absolute" }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={bannerSlides[1] || bannerSlides[0]}
                alt="Cotton Right"
                className="rounded-xl w-[240px] sm:w-[200px] md:w-[180px] lg:w-[220px] xl:w-[280px] 2xl:w-[320px]"
              />
              <motion.div
                animate={shadowControls}
                className="w-[60%] h-6 bg-black rounded-full mx-auto mt-[-12px] blur-md"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* ✅ Overview Text Section */}
      <div className="page-width md:pt-20 md:pb-30 p-6">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto px-4 mt-10 items-center">
          <motion.div initial="hidden" animate={textControls} variants={textVariants}>
            {overviewParagraphs.map((p, idx) => (
              <motion.p key={idx} className="text-[#4B4B4B] mb-6" variants={paragraphVariants}>
                {p}
              </motion.p>
            ))}
          </motion.div>
          <motion.div
            className="flex justify-center items-center md:h-[300px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.4, duration: 0.8 },
            }}
          />
        </div>
      </div>
    </section>
  );
}
