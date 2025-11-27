import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { getMachineCMSPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

export default function Machines() {
  const [machineData, setMachineData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState("en");

  const controls = useAnimation();
  const shadowControls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  // ✅ Fetch machine CMS data
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

  // 🌐 Detect active language
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";
    const saved = localStorage.getItem("preferred_lang");
    setActiveLang(saved === "vi" || saved === "en" ? saved : detectLang());

    const observer = new MutationObserver(() =>
      setActiveLang(detectLang())
    );
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

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

  if (!machineData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading machine content...
      </div>
    );
  }

  const heroTitle = machineData?.heroSection?.heroTitle?.[activeLang];
  const heroVideo = machineData?.heroSection?.heroVideo
    ? getFullUrl(machineData.heroSection.heroVideo)
    : null;

  return (
    <section className="relative bg-white overflow-hidden">
      <motion.div
        animate={scrolled ? { scale: 0.9, opacity: 0.9 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : ""
        }`}
      >
        <div className="w-full flex justify-center relative">
          {/* ✅ Hero Title */}
          {heroTitle && (
            <div className="absolute z-30 bottom-[190px] left-6 md:left-15">
              <h1 className="text-8xl uppercase text-white font-bold cotton-section-heading">
                {heroTitle}
              </h1>
            </div>
          )}

          {/* ✅ Hero Video (only if uploaded) */}
          {heroVideo ? (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                src={heroVideo}
                className="w-full h-screen object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/20 z-10" />
            </>
          ) : (
            <div className="w-full h-[60vh] flex items-center justify-center bg-gray-100 text-gray-500 text-lg">
              No video uploaded yet
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
