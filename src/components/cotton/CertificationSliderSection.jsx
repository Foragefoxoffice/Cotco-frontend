import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TitleAnimation from "../common/AnimatedTitle";
import { FiArrowDownRight } from "react-icons/fi";
import { getCottonPage } from "../../Api/api";

export default function CertificationSliderSection() {
  const [certData, setCertData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [activeLang, setActiveLang] = useState("en");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const controls = useAnimation();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Detect and sync language
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    const lang = saved === "vi" || saved === "en" ? saved : detectLanguage();
    setActiveLang(lang);
    document.body.classList.toggle("vi-mode", lang === "vi");

    const observer = new MutationObserver(() =>
      setActiveLang(detectLanguage())
    );
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch data from API
  useEffect(() => {
    getCottonPage()
      .then((res) => {
        if (res.data?.cottonMember) setCertData(res.data.cottonMember);
      })
      .catch(console.error);
  }, []);

  // ✅ Slider navigation logic
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? (certData?.cottonMemberImg?.length || 1) - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === (certData?.cottonMemberImg?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => nextSlide(), 4000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // ✅ Animation control when in view
  useEffect(() => {
    if (inView && certData?.cottonMemberImg?.length > 0) {
      controls.start({ opacity: 1, x: 0 });
      startAutoSlide();
    } else {
      controls.start({ opacity: 0, x: 100 });
      stopAutoSlide();
    }
    return stopAutoSlide;
  }, [inView, certData?.cottonMemberImg?.length]);

  const openPopup = (index = 0) => {
    setPopupIndex(index);
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);
  const prevPopup = () =>
    setPopupIndex((i) =>
      i === 0 ? certData.cottonMemberImg.length - 1 : i - 1
    );
  const nextPopup = () =>
    setPopupIndex((i) => (i + 1) % certData.cottonMemberImg.length);

  const images = certData?.cottonMemberImg || [];

  return (
    <section
      ref={sectionRef}
      className="py-20 page-width bg-white overflow-x-hidden relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* ---------- LEFT SIDE ---------- */}
        <div>
          <TitleAnimation
            text={pick(certData?.cottonMemberTitle) || "Our Certifications"}
            className="heading mb-6 leading-snug text-black"
            align="center"
            mdAlign="left"
            lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {certData?.cottonMemberButtonText &&
            certData?.cottonMemberButtonLink && (
              <button
                onClick={() => openPopup(0)}
                className="w-72 mt-6 px-5 py-3 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black/40 cursor-pointer hover:text-white transition-all text-xl font-semibold"
                style={{ fontSize: "20px" }}
              >
                {pick(certData.cottonMemberButtonText)} <FiArrowDownRight />
              </button>
            )}
        </div>

        {/* ---------- RIGHT SIDE (SLIDER) ---------- */}
        <motion.div
          ref={inViewRef}
          animate={controls}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center justify-center"
        >
          <div className="relative w-full h-full md:h-100">
            {images.map((src, i) => {
              const isActive = i === current;
              return (
                <img
                  key={i}
                  src={getFullUrl(src)}
                  alt={`Certificate ${i + 1}`}
                  className={`absolute top-0 left-0 w-[600px] h-[200px] md:h-[450px] rounded-2xl transition-all duration-700 ease-in-out cursor-pointer ${
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

          {/* ---------- Navigation Buttons ---------- */}
          {images.length > 1 && (
            <div className="flex gap-4 mt-33 certification-slider-controls">
              <button
                onClick={() => {
                  prevSlide();
                  startAutoSlide();
                }}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={() => {
                  nextSlide();
                  startAutoSlide();
                }}
                aria-label="Next"
                className="w-10 h-10 rounded-full bg-[#0A1C2E] text-white flex items-center justify-center hover:bg-[#122b45] transition-colors duration-300"
              >
                <FaArrowRight />
              </button>
            </div>
          )}
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
            className="absolute top-6 right-6 !text-white text-3xl bg-red-600 p-2 rounded-full cursor-pointer hover:text-gray-400 transition"
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

            {/* ⬅️ Previous */}
            <button
              onClick={prevPopup}
              className="absolute left-3 md:left-10 !text-black text-3xl p-2 rounded-full bg-white cursor-pointer transition"
            >
              <FaArrowLeft />
            </button>

            {/* ➡️ Next */}
            <button
              onClick={nextPopup}
              className="absolute right-3 md:right-10 !text-black text-3xl p-2 rounded-full bg-white cursor-pointer transition"
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
