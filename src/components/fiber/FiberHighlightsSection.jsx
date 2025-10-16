import React, { useState, useEffect } from "react";
import { getFiberPage } from "../../Api/api";

export default function FiberInfoBlocks() {
  const [fiberProducts, setFiberProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLang, setActiveLang] = useState("en");

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const getFullUrl = (path) => {
    if (!path) return "/img/fallback.png";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // ✅ Detect and sync language (same logic as FiberHero)
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

  // ✅ Helper for picking localized text
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch fiber products dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFiberPage();
        if (res.data?.fiberProducts?.fiberProduct?.length > 0) {
          setFiberProducts(res.data.fiberProducts.fiberProduct);
        }
      } catch (err) {
        console.error("Failed to load fiber products:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleInteraction = (index) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index); // toggle on tap
    } else {
      setActiveIndex(index); // show on hover
    }
  };

  if (!fiberProducts.length) {
    return (
      <section className="py-20 text-center text-gray-400">
        {activeLang === "vi" ? "Đang tải sản phẩm..." : "Loading fiber products..."}
      </section>
    );
  }

  return (
    <section className="w-full divide-y divide-gray-200 relative">
      {fiberProducts.map((product, idx) => {
        const isActive = activeIndex === idx;

        return (
          <div
            key={idx}
            className={`group relative bg-white ${isActive ? "active" : ""}`}
            onClick={() => handleInteraction(idx)}
            onMouseEnter={() => !isMobile && handleInteraction(idx)}
            onMouseLeave={() => !isMobile && setActiveIndex(null)}
          >
            {/* BACKGROUND when active */}
            <div className="absolute inset-0 z-0 bg-[#0A4A78]" />

            {/* ANIMATED DOORS */}
            <div className="pointer-events-none absolute inset-0 z-10">
              <div
                className={`absolute left-0 top-0 h-1/2 w-full bg-white transition-transform duration-700 ease-out ${
                  isActive ? "-translate-y-full" : "translate-y-0"
                }`}
              />
              <div
                className={`absolute left-0 bottom-0 h-1/2 w-full bg-white transition-transform duration-700 ease-out ${
                  isActive ? "translate-y-full" : "translate-y-0"
                }`}
              />
            </div>

            {/* FLOATING IMAGE (desktop) */}
            <div
              className={`absolute bottom-[-60px] right-0 z-30 w-48 -translate-x-1/2 transform transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={getFullUrl(product.fiberProductImg)}
                alt={pick(product.fiberProductTitle) || "Fiber Product"}
                className="hidden h-auto w-full md:block"
                onError={(e) => (e.currentTarget.src = "/img/fallback.png")}
              />
            </div>

            {/* CONTENT */}
            <div
              className={`relative z-20 page-width grid gap-10 py-20 transition-colors duration-500 md:grid-cols-4 md:gap-20 ${
                isActive ? "text-white" : "text-black"
              }`}
            >
              <h3
                className="outlined-text flex min-w-[180px] items-center text-4xl font-extrabold uppercase tracking-wide md:col-span-2 md:text-6xl"
                dangerouslySetInnerHTML={{
                  __html: pick(product.fiberProductTitle),
                }}
              />

              <ul className="md:col-span-2 space-y-3 text-sm leading-relaxed md:text-base">
                {product.fiberProductDes?.map((d, i) => (
                  <li
                    key={i}
                    className="relative pl-6 before:absolute before:left-0 before:top-1 before:content-['--']"
                  >
                    {pick(d)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}
