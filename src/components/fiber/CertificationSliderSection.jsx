import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TitleAnimation from "../common/AnimatedTitle";
import { ArrowUpRight } from "lucide-react";
import { getFiberPage } from "../../Api/api";

export default function FiberCertificationSliderSection() {
  const [certData, setCertData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [activeLang, setActiveLang] = useState("en");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  const sectionRef = useRef(null);
  const controls = useAnimation();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // 🌐 Sync language from body or localStorage
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    const lang = saved === "vi" || saved === "en" ? saved : detectLang();
    setActiveLang(lang);
    document.body.classList.toggle("vi-mode", lang === "vi");

    const observer = new MutationObserver(() => setActiveLang(detectLang()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // 🧠 Fetch data
  useEffect(() => {
    getFiberPage()
      .then((res) => {
        if (res.data?.fiberCertification)
          setCertData(res.data.fiberCertification);
      })
      .catch(console.error);
  }, []);

  const images = certData?.fiberCertificationImg || [];

  // 🧭 Manual navigation
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // 👀 Animate only when in view
  useEffect(() => {
    if (inView && images.length > 0) {
      controls.start({ opacity: 1, x: 0 });
    } else {
      controls.start({ opacity: 0, x: 100 });
    }
  }, [inView, images.length, controls]);

  // 🪟 Popup handlers
  const openPopup = (index = 0) => {
    setPopupIndex(index);
    setPopupOpen(true);
  };
  const closePopup = () => setPopupOpen(false);
  const prevPopup = () =>
    setPopupIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextPopup = () => setPopupIndex((i) => (i + 1) % images.length);

  if (!certData) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 page-width bg-white overflow-x-hidden relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* ---------- LEFT SIDE ---------- */}
        <div>
          <TitleAnimation
            text={pick(certData?.fiberCertificationTitle) || "Our Certifications"}
            className="heading mb-6 leading-snug text-black"
            align="center"
            mdAlign="left"
            lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {certData?.fiberCertificationButtonText && (
            <div className="flex justify-center md:block">
              <button
              onClick={() => openPopup(0)}
              className="w-fit mt-6 px-5 py-4 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black/40 cursor-pointer hover:text-white transition-all text-xl font-semibold"
            >
              {pick(certData.fiberCertificationButtonText)} <ArrowUpRight />
            </button>
            </div>
          )}
        </div>

        {/* ---------- RIGHT SIDE (Manual Slider) ---------- */}
        <motion.div
          ref={inViewRef}
          animate={controls}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center justify-center"
        >
          <div className="relative w-full h-[350px] md:h-100">
            {images.map((src, i) => {
              const isActive = i === current;
              return (
                <img
                  key={i}
                  src={getFullUrl(src)}
                  alt={`Certificate ${i + 1}`}
                  className={`absolute top-0 left-0 w-[600px] h-[350px] md:h-[450px] rounded-2xl transition-all duration-700 ease-in-out cursor-pointer ${
                    isActive
                      ? "z-30 scale-100 rotate-0 opacity-100"
                      : "z-10 opacity-40 scale-[0.95]"
                  }`}
                  style={{
                    transform: isActive
                      ? "rotate(0deg) translateX(0)"
                      : "rotate(-7deg) translateX(25px)",
                  }}
                  onClick={() => openPopup(i)}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ---------- POPUP MODAL ---------- */}
      {popupOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ❌ Close Button */}
          <button
            onClick={closePopup}
            className="absolute top-6 right-6 text-white text-3xl bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition"
          >
            <FaTimes />
          </button>

          {/* 🖼 Image Viewer */}
          <div className="relative w-full max-w-4xl flex items-center justify-center px-6">
            <motion.img
              key={popupIndex}
              src={getFullUrl(images[popupIndex])}
              alt={`Certificate ${popupIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            />

            {/* ⬅️ Prev */}
            <button
              onClick={prevPopup}
              className="absolute left-3 md:-left-10 text-black text-3xl p-2 rounded-full bg-white cursor-pointer transition hover:bg-gray-200"
            >
              <FaArrowLeft />
            </button>

            {/* ➡️ Next */}
            <button
              onClick={nextPopup}
              className="absolute right-3 md:-right-10 text-black text-3xl p-2 rounded-full bg-white cursor-pointer transition hover:bg-gray-200"
            >
              <FaArrowRight />
            </button>
          </div>

          {/* 🔢 Counter */}
          <div className="mt-4 text-gray-300 text-sm">
            {popupIndex + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </section>
  );
}
