import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { getFiberPage } from "../../Api/api";

export default function FiberHero() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [fiberBanner, setFiberBanner] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  const controls = useAnimation();
  const shadowControls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  // ✅ Fetch Fiber Page data
  useEffect(() => {
    getFiberPage()
      .then((res) => {
        const banner = res.data?.fiberBanner || {};
        setFiberBanner(banner);
      })
      .catch((err) => console.error("Error fetching fiber page:", err));
  }, []);

  // ✅ Detect screen size and scroll
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrolled(window.scrollY > 10);

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ Language setup
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

  // ✅ Bubble animation
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
  }, [isInView, isMobile, controls, shadowControls, textControls]);

  if (!fiberBanner) return null;

  // ✅ Safe URL resolver
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // ✅ Pick multilingual field safely
  const pick = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[activeLang] || obj.en || obj.vi || "";
  };

  // ✅ Extract Data
  const videoUrl = getFullUrl(fiberBanner?.fiberBannerMedia);
  const imageUrl = getFullUrl(fiberBanner?.fiberBannerImg);

  // Handle possible array or single string
  const bannerSlides =
    Array.isArray(fiberBanner?.fiberBannerSlideImg) && fiberBanner.fiberBannerSlideImg.length
      ? fiberBanner.fiberBannerSlideImg.map(getFullUrl)
      : fiberBanner?.fiberBannerSlideImg
      ? [getFullUrl(fiberBanner.fiberBannerSlideImg)]
      : [];

  const bottomImg =
    getFullUrl(fiberBanner?.fiberBannerBottomImg) ||
    bannerSlides[0] ||
    imageUrl ||
    "";

  const title = pick(fiberBanner?.fiberBannerTitle);
  const description = pick(fiberBanner?.fiberBannerDes);
  const overview = pick(fiberBanner?.fiberBannerContent || fiberBanner?.fiberBannerOverview);

  const isVideo = /\.(mp4|webm|ogg)$/i.test(videoUrl || "");

  return (
    <section className="relative bg-white hero overflow-hidden">
      {/* ---------- Media Section ---------- */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={scrolled ? { scale: 0.9, opacity: 0.9 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : ""
        }`}
      >
        <motion.div className="w-full flex justify-center relative rounded-b-2xl">
          {/* ---------- Text Overlay ---------- */}
          <div className="absolute z-10 bottom-5 md:bottom-[200px] left-6 md:left-15 rounded-b-2xl">
            <h1 className="text-6xl md:text-[100px] text-white font-[700] !mb-0">
              {title || "FIBER"}
            </h1>
            <p className="text-white text-[14px] md:text-[20px] pl-1">
              {description}
            </p>
          </div>

          {/* ✅ Video or Image */}
          {isVideo && videoUrl ? (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                src={videoUrl}
                className="w-full hidden md:block object-cover rounded-b-2xl"
              />
              <div className="relative w-full h-screen block md:hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  src={videoUrl}
                  className="absolute top-0 left-0 w-screen h-screen object-cover"
                />
              </div>
            </>
          ) : (
            <motion.img
              src={imageUrl}
              alt="Fiber Banner"
              className="w-full object-cover"
            />
          )}

          {/* ✅ Left Bubble */}
          {bottomImg && (
            <motion.div
              initial={{ position: "absolute", left: "-170px", top: "10%" }}
              animate={controls}
              className="hidden md:block"
              style={{ position: "absolute" }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={bottomImg}
                alt="Fiber Bubble"
                className="rotate-45 rounded-xl w-[240px] sm:w-[200px] md:w-[180px] lg:w-[220px] xl:w-[280px] 2xl:w-[320px]"
              />
            </motion.div>
          )}

          {/* ✅ Right Bubble */}
          {bottomImg && (
            <motion.div
              initial={{ position: "absolute", right: "-170px", top: "30%" }}
              animate={controls}
              className="hidden md:block"
              style={{ position: "absolute" }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={bottomImg}
                alt="Fiber Bubble"
                className="-rotate-45 rounded-xl w-[240px] sm:w-[200px] md:w-[150px] lg:w-[170px] xl:w-[280px] 2xl:w-[320px]"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* ---------- Overview Section ---------- */}
      <div className="page-width md:pt-0 md:pb-30 p-6">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mt-10"
        >
          {/* LEFT: Overview Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[#4B4B4B] leading-relaxed md:pr-10"
          >
            <div
              className="banner-overview text-base md:text-[17px] text-justify md:text-left"
              dangerouslySetInnerHTML={{
                __html: (overview || "")
                  .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
                  .replace(/(<br\s*\/?>\s*){2,}/gi, "<br />")
                  .trim(),
              }}
            />
          </motion.div>

          {/* RIGHT: Fiber Image */}
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
            {bottomImg && (
              <img
                src={bottomImg}
                alt="Fiber Illustration"
                className="w-[280px] md:w-[420px] lg:w-[500px] xl:w-[550px] object-contain"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
