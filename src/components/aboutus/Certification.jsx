import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

export default function Certification() {
  const [logos, setLogos] = useState([]);
  const [heading, setHeading] = useState("STRATEGIC ALLIANCES");
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect current language from <body class="vi-mode">
  useEffect(() => {
    const detectLang = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLang());

    const observer = new MutationObserver(() => setActiveLang(detectLang()));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Helper for image URLs
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || ""}${path}`;
  };

  // ✅ Fetch About Page Data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAboutPage();
        const aboutData = res?.data;

        if (aboutData?.aboutAlliances) {
          const section = aboutData.aboutAlliances;

          // ✅ Handle multilingual title
          const fetchedTitle =
            section.aboutAlliancesTitle?.[activeLang] ||
            section.aboutAlliancesTitle?.en ||
            (activeLang === "vi"
              ? "LIÊN MINH CHIẾN LƯỢC"
              : "STRATEGIC ALLIANCES");

          setHeading(fetchedTitle);

          // ✅ Handle logos array (safe parsing)
          if (Array.isArray(section.aboutAlliancesImg)) {
            setLogos(section.aboutAlliancesImg);
          } else if (section.aboutAlliancesImg) {
            setLogos(Object.values(section.aboutAlliancesImg));
          } else {
            setLogos([]);
          }
        } else {
          // fallback when section missing
          setHeading(
            activeLang === "vi"
              ? "LIÊN MINH CHIẾN LƯỢC"
              : "STRATEGIC ALLIANCES"
          );
          setLogos([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch alliances:", err);
      }
    }

    fetchData();
  }, [activeLang]); // refetch if language changes

  return (
    <section className="md:pt-20 pt-6 bg-white">
      <div className="page-width">
        {/* ✅ Title */}
        <div className="text-center mb-12">
          <TitleAnimation
            text={heading}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
        </div>

        {/* ✅ Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {logos.length > 0 ? (
            logos.map((src, index) => (
              <img
                key={index}
                src={getImageUrl(src)}
                alt={`Alliance ${index + 1}`}
                className="h-28 w-[250px] object-contain"
                loading="lazy"
              />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">
              {activeLang === "vi"
                ? "Chưa có liên minh nào được tải lên."
                : "No alliances uploaded yet."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
