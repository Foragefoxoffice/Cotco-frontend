import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getCottonPage } from "../../Api/api";

export default function CottonTrustSection() {
  const [trust, setTrust] = useState(null);
  const [activeLang, setActiveLang] = useState("en");
  const [hoverImage, setHoverImage] = useState(null); // 🆕 current hovered image
  const [defaultImage, setDefaultImage] = useState(null); // 🆕 first logo

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

  // ✅ Fetch CMS data
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonTrust) {
        const trustData = res.data.cottonTrust;
        setTrust(trustData);

        // 🧩 Set first logo as default image
        if (trustData.cottonTrustLogo?.length > 0) {
          setDefaultImage(trustData.cottonTrustLogo[0]);
        }
      }
    });
  }, []);

  if (!trust) return null;

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // 🧩 The image currently shown (default = first logo)
  const displayImage = hoverImage || defaultImage;

  return (
    <section className="py-20 page-width bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* ---------- LEFT: Text + Logos ---------- */}
        <div>
          {/* Title */}
          <TitleAnimation
            text={pick(trust.cottonTrustTitle) || "GROW IN TRUST, QUALITY AND SERVICE"}
            className="heading mb-6 text-[#0A1C2E]"
            align="center"
            mdAlign="left"
            lgAlign="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {/* Description */}
          <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
            {pick(trust.cottonTrustDes) ||
              "Besides marketing cotton from major production regions worldwide, COTCO enhances product value through stable quality control and professional logistics, ensuring efficient supply."}
          </p>

          {/* Logos */}
          <div className="flex flex-wrap gap-6">
            {trust.cottonTrustLogo?.length > 0 ? (
              trust.cottonTrustLogo.map((logo, idx) => (
                <img
                  key={idx}
                  src={getFullUrl(logo)}
                  alt={`Trust Logo ${idx + 1}`}
                  onMouseEnter={() => setHoverImage(logo)} // 🆕 change image on hover
                  onMouseLeave={() => setHoverImage(null)} // 🆕 reset on hover leave
                  className="w-20 h-20 object-contain border border-gray-300 p-2 rounded-md cursor-pointer transition-transform duration-300 hover:scale-105"
                />
              ))
            ) : (
              <p className="text-gray-400">No logos available</p>
            )}
          </div>
        </div>

        {/* ---------- RIGHT: Main Image ---------- */}
        <div className="flex justify-center md:justify-end">
          {displayImage ? (
            <img
              src={getFullUrl(displayImage)}
              alt="Trust Display"
              className="w-[380px] h-[380px] object-contain transition-all duration-500 ease-in-out"
            />
          ) : (
            <div className="w-[380px] h-[380px] flex items-center justify-center border border-dashed text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
