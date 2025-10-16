import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getFiberPage } from "../../Api/api";

export default function FiberHero() {
  const [fiberBanner, setFiberBanner] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bubbleRotation, setBubbleRotation] = useState("-16deg");
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState("en");

  const controls = useAnimation();
  const shadowControls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); // remove trailing slash

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // ✅ Detect and sync language
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
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch Fiber page content
  useEffect(() => {
    getFiberPage()
      .then((res) => {
        console.log("Fiber Page Response:", res.data); // Debug
        if (res.data?.fiberBanner) {
          setFiberBanner(res.data.fiberBanner);
        } else {
          console.warn("fiberBanner missing in API response");
        }
      })
      .catch((err) => console.error("Error fetching fiber page:", err));
  }, []);

  // ✅ Detect mobile + scroll
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

  // ✅ Animate bubble
  useEffect(() => {
    if (isInView) {
      controls.start({
        right: isMobile ? "-23px" : "0%",
        top: isMobile ? "115%" : "110%",
        width: isMobile ? "50%" : "26%",
        opacity: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
      });
      shadowControls.start({
        opacity: 0.3,
        scale: 1,
        transition: { duration: 1, ease: "easeOut" },
      });
      textControls.start("visible");
      setBubbleRotation("0deg");
    } else {
      controls.start({
        right: "-200px",
        top: "50%",
        width: isMobile ? "239px" : "240px",
        opacity: 1,
        transition: { duration: 0.8, ease: "easeIn" },
      });
      shadowControls.start({
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.8, ease: "easeIn" },
      });
      textControls.start("hidden");
      setBubbleRotation("-16deg");
    }
  }, [isInView, isMobile, controls, shadowControls, textControls]);

  // ✅ Animation Variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.3, duration: 0.8, ease: "easeOut" },
    },
  };
  const paragraphVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
  };

  // ✅ Background Media URL
  const mediaUrl = getFullUrl(fiberBanner?.fiberBannerMedia);
  const posterUrl = getFullUrl(fiberBanner?.fiberBannerImg) || "/img/fallback/fiber.jpg";

  console.log("Resolved Media URL:", mediaUrl);

  return (
    <section className="relative bg-white hero overflow-hidden">
      {/* Video / Media Section */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={scrolled ? { scale: 0.89, opacity: 0.9 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : "rounded-none"
        }`}
      >
        {/* Title / Subtitle */}
        <div className="absolute z-10 bottom-5 md:bottom-[200px] left-6 md:left-15">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-[100px] text-white font-[700] !mb-0 cotton-section-heading"
          >
            {pick(fiberBanner?.fiberBannerTitle) || "FIBER"}
          </motion.h1>
          <p className="text-white text-[14px] md:text-[20px] pt-3 cotton-section-subheading">
            {pick(fiberBanner?.fiberBannerDes) || "Empowering Vietnam’s Textile Industry Since 2016"}
          </p>
        </div>

        {/* ✅ Media (video or image) */}
        <motion.div className="w-full flex justify-center" initial="hidden" animate="visible" variants={heroVariants}>
          {fiberBanner?.fiberBannerMedia && mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <>
              {/* Desktop Video */}
              <motion.video
                key={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={posterUrl}
                src={mediaUrl}
                onError={(e) => console.error("Desktop video load error:", e)}
                className={`w-full hidden md:block object-cover ${
                  scrolled ? "rounded-3xl" : "rounded-none"
                }`}
              />

              {/* Mobile Video */}
              <div className="relative w-full h-screen block md:hidden">
                <motion.video
                  key={mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={posterUrl}
                  src={mediaUrl}
                  onError={(e) => console.error("Mobile video load error:", e)}
                  className={`absolute top-0 left-0 w-screen h-screen object-cover ${
                    scrolled ? "rounded-xl" : "rounded-none"
                  }`}
                />
              </div>
            </>
          ) : (
            <img src={posterUrl} alt="Fiber Banner" className="w-full object-cover" />
          )}

          {/* Bubble animation */}
          <motion.div
            initial={{
              position: "absolute",
              right: "-200px",
              top: "70%",
              rotate: bubbleRotation,
            }}
            animate={controls}
            style={{ rotate: bubbleRotation, position: "absolute" }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/img/fiber/fiber.png"
              alt="Fiber Ball"
              className="rounded-xl w-[240px] sm:w-[200px] md:w-[180px] lg:w-[220px] xl:w-[280px] 2xl:w-[320px]"
            />
            <motion.div
              animate={shadowControls}
              className="w-[80%] h-6 bg-black rounded-md mt-[-10px] blur-xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Text / Info Section */}
      <div className="page-width pt-6 md:pt-10">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto px-4 mt-10 items-center"
        >
          <motion.div initial="hidden" animate={textControls} variants={textVariants}>
            <motion.p
              className="text-[#4B4B4B] mb-6 pr-30 md:pr-0"
              variants={paragraphVariants}
            >
              {pick(fiberBanner?.fiberBannerContent) ||
                "To promote sustainability in Vietnam’s textile and nonwoven sectors, COTCO expanded into distributing viscose and specialty fibers for nonwovens through a partnership with Birla Cellulose."}
            </motion.p>
            <motion.h3
              className="text-2xl md:text-md font-semibold mb-4 text-[#1C1C1C]"
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              {pick(fiberBanner?.fiberBannerSubTitle) ||
                "The role of viscose fiber in yarn and textile manufacturing"}
            </motion.h3>
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
