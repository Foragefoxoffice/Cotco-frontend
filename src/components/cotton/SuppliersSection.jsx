import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import TitleAnimation from "../common/AnimatedTitle";
import { getCottonPage } from "../../Api/api";

export default function SuppliersSection() {
  const [suppliers, setSuppliers] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeLang, setActiveLang] = useState("en"); // ✅ language state

  const sectionRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ Helper to build full URLs
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Detect and sync language (with body + localStorage)
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

    const observer = new MutationObserver(() => setActiveLang(detectLanguage()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch suppliers data
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonSupplier) {
        setSuppliers(res.data.cottonSupplier);
      }
    });
  }, []);

  // ✅ pick helper for bilingual content
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  const clamp = (n) => Math.max(0, Math.min(n, suppliers.length - 1));

  /* ---------- Scroll listener ---------- */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const scrollY = window.scrollY - sectionTop;
      const vh = window.innerHeight;
      const idx = Math.round(scrollY / vh);
      setIndex(clamp(idx));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [suppliers.length]);

  if (!suppliers.length) return null;

  // ✅ Language toggle (optional)
  const toggleLanguage = () => {
    const newLang = activeLang === "en" ? "vi" : "en";
    setActiveLang(newLang);
    localStorage.setItem("preferred_lang", newLang);
    document.body.classList.toggle("vi-mode", newLang === "vi");
  };

  return (
    <section
      ref={sectionRef}
      style={{ height: `${suppliers.length * 100}vh` }}
      className="relative"
    >
      {/* ✅ Language switch button */}
      {/* <div className="absolute top-6 right-6 z-30">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium text-white backdrop-blur-md transition"
        >
          {activeLang === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
        </button>
      </div> */}

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ---------- Background Crossfade ---------- */}
        <div className="absolute inset-0">
          {suppliers.map((s, i) => {
            const bg = s.cottonSupplierBg?.trim()
              ? getFullUrl(s.cottonSupplierBg)
              : "/img/cotton/placeholder.jpg";
            return (
              <motion.img
                key={s._id || i}
                src={bg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                initial={{ opacity: i === 0 ? 1 : 0 }}
                animate={{ opacity: index === i ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
            );
          })}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* ---------- Content ---------- */}
        <div className="relative z-10 mx-auto flex h-full w-full flex-col items-start justify-between gap-8 page-width md:flex-row md:items-center">
          {/* ---------- Left info ---------- */}
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-5 max-w-2xl md:mt-0"
          >
            <TitleAnimation
              text={pick(suppliers[index].cottonSupplierTitle) || "Supplier"}
              className="!mb-0 text-3xl font-bold tracking-wide text-white md:text-4xl"
              align="left"
              delay={0.05}
              stagger={0.05}
              once={true}
            />

            <div className="mb-4 inline-block rounded-full bg-white/95 px-5 py-2 font-medium text-black shadow">
              {pick(suppliers[index].cottonSupplierLogoName) ||
                pick(suppliers[index].cottonSupplierTitle)}
            </div>

            {/* Mobile logo */}
            {suppliers[index].cottonSupplierLogo?.trim() ? (
              <img
                src={getFullUrl(suppliers[index].cottonSupplierLogo)}
                alt="Logo"
                className="mb-6 bg-white p-4 rounded-md h-auto w-30 md:hidden"
              />
            ) : null}

            <hr className="my-4 w-4/6 border-white/90" />

            {/* Descriptions */}
            {Array.isArray(suppliers[index].cottonSupplierDes) &&
              suppliers[index].cottonSupplierDes.length > 0 && (
                <ul className="pt-0 list-disc text-base leading-relaxed text-white/90 md:text-lg">
                  {suppliers[index].cottonSupplierDes.map((desc, dIdx) => (
                    <li className="ml-3 text-[16px] mb-3" key={dIdx}>
                      {pick(desc)}
                    </li>
                  ))}
                </ul>
              )}
          </motion.div>

          {/* ---------- Right logos (desktop) ---------- */}
          <div className="my-auto hidden rounded-lg bg-white/30 p-4 shadow backdrop-blur-md md:flex md:flex-col md:items-end md:gap-4">
            {suppliers.map((s, i) => (
              <button
                key={s._id || i}
                onClick={() => {
                  setIndex(i);
                  const sectionTop =
                    sectionRef.current.getBoundingClientRect().top +
                    window.scrollY;
                  const target = sectionTop + i * window.innerHeight;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
                className={clsx(
                  "w-40 cursor-pointer rounded-md bg-white p-2 shadow-md transition-all duration-300",
                  i === index
                    ? "scale-105 ring-2 ring-blue-500"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                {s.cottonSupplierLogo?.trim() ? (
                  <img
                    src={getFullUrl(s.cottonSupplierLogo)}
                    alt={pick(s.cottonSupplierTitle) || "Supplier"}
                    className="h-16 w-full object-contain"
                  />
                ) : (
                  <div className="h-16 w-full flex items-center justify-center text-gray-500 text-sm">
                    No Logo
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ---------- Mobile dots ---------- */}
          {/* <div className="absolute bottom-4 left-0 right-0 z-10 mx-auto flex justify-center gap-2 md:hidden">
            {suppliers.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  const sectionTop =
                    sectionRef.current.getBoundingClientRect().top +
                    window.scrollY;
                  const target = sectionTop + i * window.innerHeight;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={clsx(
                  "h-2.5 w-2.5 rounded-full",
                  i === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
