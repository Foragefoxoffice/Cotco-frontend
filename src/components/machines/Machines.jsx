import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { getMachineCMSPage } from "../../Api/api"; // ✅ Import API

export default function Machines() {
  const [machineData, setMachineData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bubbleRotation, setBubbleRotation] = useState("-16deg");
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState("en");

  const controls = useAnimation();
  const shadowControls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  // 🌐 Fetch Machine CMS data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMachineCMSPage();
        if (res.data?.machinePage) {
          setMachineData(res.data.machinePage);
        }
      } catch (err) {
        console.error("❌ Failed to load Machine CMS:", err);
      }
    };
    fetchData();
  }, []);

  // 🌐 Detect global language
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

  const pick = (en, vi) => (activeLang === "vi" ? vi || en : en);

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

  // 🌀 Animation for video + title
  useEffect(() => {
    if (isInView) {
      controls.start({
        right: isMobile ? "-23px" : "0%",
        top: isMobile ? "115%" : "110%",
        width: isMobile ? "50%" : "26%",
        opacity: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
      });
      shadowControls.start({ opacity: 0.3, scale: 1 });
      textControls.start("visible");
      setBubbleRotation("0deg");
    } else {
      controls.start({ right: "-200px", top: "50%", opacity: 1 });
      shadowControls.start({ opacity: 0, scale: 0.5 });
      textControls.start("hidden");
      setBubbleRotation("-16deg");
    }
  }, [isInView, isMobile, controls, shadowControls, textControls]);

  if (!machineData)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading machine content...
      </div>
    );

  return (
    <section className="relative bg-white hero md:pt-0 overflow-x-hidden overflow-hidden">
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={scrolled ? { scale: 0.89, opacity: 0.9 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : ""
        }`}
      >
        <motion.div
          className="w-full flex justify-center"
          initial="hidden"
          animate="visible"
        >
          <div className="absolute z-30 bottom-[190px] left-6 md:left-15">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-8xl uppercase text-white font-bold cotton-section-heading"
            >
              {machineData?.heroSection?.heroTitle?.[activeLang] ||
                pick("Machines", "Máy Móc")}
            </motion.h1>
          </div>

          {/* Hero Video */}
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/img/fallback/product.png"
            src={machineData?.heroSection?.heroVideo || "/video/products.webm"}
            className="w-full rounded-xl hidden md:block"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          />
          <div
            className={`absolute inset-0 bg-black/20 z-10 ${
              scrolled ? "rounded-3xl" : "rounded-none"
            }`}
          />
          <div className="relative w-full h-screen block md:hidden">
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              src={machineData?.heroSection?.heroVideo || "/video/fiber-mobile.mp4"}
              className="absolute top-0 left-0 w-screen h-screen object-cover rounded-xl"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
