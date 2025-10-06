import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getFiberPage } from "../../Api/api";

export default function SupplierSection() {
  const [supplier, setSupplier] = useState(null);
  const [current, setCurrent] = useState(0);
  const [activeLang, setActiveLang] = useState("en"); // ✅ Language state

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Detect language from body or localStorage
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

  // ✅ Helper to pick correct language
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  useEffect(() => {
    getFiberPage().then((res) => {
      if (res.data?.fiberSupplier) {
        setSupplier(res.data.fiberSupplier);
      }
    });
  }, []);

  useEffect(() => {
    if (!supplier?.fiberSupplierImg?.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % supplier.fiberSupplierImg.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [supplier]);

  if (!supplier) return null;

  return (
    <section className="bg-[#0A4A78] relative z-40 text-white py-6 md:py-20">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-10 page-width">
        {/* Left Text Content */}
        <div className="md:col-span-2">
          <TitleAnimation
            text={pick(supplier.fiberSupplierTitle) || "SUPPLIER"}
            className="mb-8 fontbold text-3xl font-extrabold tracking-wide text-white md:text-4xl"
            align="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <ul className="space-y-3 text-sm md:text-base text-white/90 leading-relaxed">
            {supplier.fiberSupplierDes?.map((d, idx) => (
              <li key={idx}>• {pick(d)}</li>
            ))}
          </ul>
        </div>

        {/* Right Slider Card */}
        <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden h-full fiber-section-slider place-content-center">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {supplier.fiberSupplierImg?.map((logo, index) => (
              <div
                key={index}
                className="min-w-full flex justify-center items-center"
              >
                <img
                  src={getFullUrl(logo)}
                  alt={`Supplier ${index}`}
                  className="w-60 h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
