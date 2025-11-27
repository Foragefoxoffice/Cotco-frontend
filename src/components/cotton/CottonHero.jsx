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
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

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
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
        duration: 0.8,
        ease: "easeOut",
      },
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

  return (
    <section className="relative bg-white hero overflow-hidden">
      {/* ✅ Language Switcher */}

      {/* ---------- Media Section ---------- */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={
          scrolled ? { scale: 0.9, opacity: 0.9 } : { scale: 1, opacity: 1 }
        }
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
              className={`w-full hidden md:block ${
                scrolled ? "rounded-3xl" : "rounded-none"
              }`}
            >
              <source
                src={bannerMedia}
                type={
                  bannerMedia.endsWith(".webm") ? "video/webm" : "video/mp4"
                }
              />
              Your browser does not support the video tag.
            </motion.video>
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
         {/* ✅ Fixed Mobile Media */}
<div className="relative w-full h-screen block md:hidden rounded-b-2xl">
  {isVideo ? (
    <motion.video
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className="absolute top-0 left-0 w-screen h-screen object-cover rounded-b-2xl"
    >
      <source
        src={bannerMedia}
        type={
          bannerMedia.endsWith(".webm") ? "video/webm" : "video/mp4"
        }
      />
      Your browser does not support the video tag.
    </motion.video>
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
              initial={{ position: "absolute", right: "-120px", top: "70%" }}
              animate={controls}
              className="hidden md:block"
              style={{ position: "absolute" }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={bannerSlides[1] || bannerSlides[0]}
                alt="Cotton Right"
                className="rounded-xl w-[240px] sm:w-[200px] md:w-[200px] lg:w-[260px] xl:w-[280px] 2xl:w-[320px]"
              />
              
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* ✅ Overview Text Section (Updated Layout) */}
      <div className="page-width md:pt-0 md:pb-30 p-6">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mt-10"
        >
          {/* ---------- LEFT: Overview Text ---------- */}
          <motion.div
            initial="hidden"
            animate={textControls}
            variants={textVariants}
            className="text-[#4B4B4B] leading-relaxed md:pr-10"
          >
            <div
              className="banner-overview text-base md:text-[17px] text-justify md:text-left"
              dangerouslySetInnerHTML={{
                __html: (overview || "")
                  .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "") // remove empty <p> or <p><br>
                  .replace(/(<br\s*\/?>\s*){2,}/gi, "<br />") // collapse multiple <br> into one
                  .trim(),
              }}
            />
          </motion.div>

          {/* ---------- RIGHT: Cotton Ball Image ---------- */}
          <motion.div
            className="flex justify-center md:justify-end items-center relative"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { delay: 0.3, duration: 0.8, ease: "easeOut" },
            }}
          >
            {bannerSlides[2] ? (
              <img
                src={bannerSlides[2]} // ✅ third image or fallback
                alt="Cotton Illustration"
                className="w-[280px] md:w-[420px] lg:w-[500px] xl:w-[550px] object-contain"
              />
            ) : (
              <img
                src={bannerSlides[0]}
                alt="Cotton Illustration"
                className="w-[280px] md:w-[420px] lg:w-[500px] xl:w-[550px] object-contain"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
