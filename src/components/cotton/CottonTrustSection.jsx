import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getCottonPage } from "../../Api/api";

export default function CottonTrustSection() {
  const [trust, setTrust] = useState(null);
  const [activeLang, setActiveLang] = useState("en"); // ✅ language state

  // ✅ Detect and sync language with body + localStorage
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

  // ✅ Fetch CMS data
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonTrust) {
        setTrust(res.data.cottonTrust);
      }
    });
  }, []);

  if (!trust) return null; // Wait for API

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Pick helper for bilingual text
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Optional toggle button
  const toggleLanguage = () => {
    const newLang = activeLang === "en" ? "vi" : "en";
    setActiveLang(newLang);
    localStorage.setItem("preferred_lang", newLang);
    document.body.classList.toggle("vi-mode", newLang === "vi");
  };

  return (
    <section className="pt-20 page-width bg-white relative">
      {/* 🔘 Language switch button */}
      {/* <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium text-gray-800 backdrop-blur-md transition"
        >
          {activeLang === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* ---------- Left Text + Logos ---------- */}
        <div>
          <TitleAnimation
            text={pick(trust.cottonTrustTitle) || "GROW IN TRUST, QUALITY AND SERVICE"}
            className="heading"
            align="center"
            mdAlign="left"
            lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          <p className="text-gray-600 mb-6 max-w-lg">
            {pick(trust.cottonTrustDes) ||
              "Besides marketing cotton from major production regions worldwide, COTCO enhances product value through stable quality control and professional logistics, ensuring efficient supply."}
          </p>

          {/* Logos */}
          <div className="flex flex-wrap items-center gap-6">
            {trust.cottonTrustLogo?.length > 0 ? (
              trust.cottonTrustLogo.map((logo, idx) => (
                <img
                  key={idx}
                  src={getFullUrl(logo)}
                  alt={`Trust Logo ${idx + 1}`}
                  className="w-24 h-24 object-contain border-2 border-[#74AFDF66] p-2 rounded-md bg-white"
                />
              ))
            ) : (
              <p className="text-gray-400">No trust logos added</p>
            )}
          </div>
        </div>

        {/* ---------- Right Image ---------- */}
        <div className="flex justify-center md:justify-center">
          {trust.cottonTrustImg ? (
            <img
              src={getFullUrl(trust.cottonTrustImg)}
              alt="Trust Image"
              className="w-4/7 h-auto object-contain"
            />
          ) : (
            <div className="w-64 h-40 flex items-center justify-center border border-dashed text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
