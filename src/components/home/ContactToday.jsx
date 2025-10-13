import React, { useEffect, useState } from "react";
import { getHomepageBannerSection } from "../../Api/api"; // ✅ you'll add this in api.js

const ContactToday = () => {
  const [activeLang, setActiveLang] = useState("en");
  const [banner, setBanner] = useState({
    bannerTitle1: { en: "Ready to Grow with COTCO?", vi: "Sẵn sàng phát triển cùng COTCO?" },
    bannerTitle2: { en: "Contact Us Today", vi: "Liên hệ với chúng tôi ngay hôm nay" },
    bannerButtonText: { en: "Get Started", vi: "Bắt đầu ngay" },
    bannerButtonLink: "#contact",
    bannerBackgroundImage: "/img/home/upperFooter.jpg",
  });

  // ✅ Detect language dynamically from <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Helper for picking correct language text
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch banner section data
  useEffect(() => {
    getHomepageBannerSection().then((data) => {
      if (data) setBanner((prev) => ({ ...prev, ...data }));
    });
  }, []);

  // ✅ Helper to get full URL
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};


  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* ✅ Dynamic Background Image */}
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: `url(${getFullUrl(banner.bannerBackgroundImage)})`,
    backgroundAttachment: "fixed",
  }}
></div>


      {/* Overlay */}
      <div
        style={{ backgroundColor: "#1F90D8CC" }}
        className="absolute inset-0 bg-opacity-60"
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full page-width">
        <div>
          <h2 className="text-white text-4xl md:text-6xl font-semibold mb-1 leading-tight">
            {pick(banner.bannerTitle1, activeLang)}
          </h2>
          <p className="text-white text-xl md:text-3xl font-semibold mb-6">
            {pick(banner.bannerTitle2, activeLang)}
          </p>
          <a
            href={banner.bannerButtonLink || "#contact"}
            className="bg-white text-blue-900 font-medium px-5 py-3 rounded-md hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            {pick(banner.bannerButtonText, activeLang)}
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactToday;
