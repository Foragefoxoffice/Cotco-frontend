import React, { useState, useEffect } from "react";
import { getFiberPage } from "../../Api/api";

export default function FiberInfoBlocks() {
  const [products, setProducts] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLang, setActiveLang] = useState("en"); // ✅ Language state

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
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
      if (res.data?.fiberProducts) {
        setProducts(res.data.fiberProducts);
      }
    });
  }, []);

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

  if (!products) return null;

  return (
    <section className="w-full divide-y divide-gray-200">
      {products.fiberProduct.map((section, idx) => {
        const isActive = activeIndex === idx;

        return (
          <div
            key={idx}
            className={`group relative bg-white ${isActive ? "active" : ""}`}
            onClick={() => handleInteraction(idx)}
            onMouseEnter={() => !isMobile && handleInteraction(idx)}
            onMouseLeave={() => !isMobile && setActiveIndex(null)}
          >
            {/* BACKGROUND revealed when doors open */}
            <div className="absolute inset-0 z-0 bg-[#0A4A78]" />

            {/* VERTICAL DOUBLE DOORS */}
            <div className="pointer-events-none absolute inset-0 z-10">
              <div
                className={`absolute left-0 top-0 h-1/2 w-full bg-white transition-transform duration-700 ease-out
                ${isActive ? "-translate-y-full" : "translate-y-0"}`}
              />
              <div
                className={`absolute left-0 bottom-0 h-1/2 w-full bg-white transition-transform duration-700 ease-out
                ${isActive ? "translate-y-full" : "translate-y-0"}`}
              />
            </div>

            {/* FLOATING IMAGE (desktop) */}
            <div
              className={`absolute bottom-[-60px] right-0 z-30 w-48 -translate-x-1/2 transform transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={getFullUrl(section.fiberProductImg)}
                alt={pick(section.fiberProductTitle)}
                className="hidden h-auto w-full md:block"
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
                dangerouslySetInnerHTML={{ __html: pick(section.fiberProductTitle) }}
              />

              <ul className="md:col-span-2 space-y-3 text-sm leading-relaxed md:text-base">
                {section.fiberProductDes?.map((line, i) => (
                  <li
                    key={i}
                    className="relative pl-6 before:absolute before:left-0 before:top-1 before:content-['--']"
                  >
                    {pick(line)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      {/* Footer CTA */}
      <div className="page-width relative z-20 grid gap-8 pt-10 transition-all md:pt-26">
        <p className="text-center text-xl">{pick(products.fiberProductBottomCon)}</p>
        <a
          className="mx-auto w-60 rounded-xl bg-[#143A59] p-3 text-center text-white"
          href={products.fiberProductButtonLink || "/contact"}
        >
          {pick(products.fiberProductButtonText) || "Contact Our Team"}
        </a>
      </div>
    </section>
  );
}
