import React, { useEffect, useState } from "react";
import { FaRecycle, FaDroplet, FaEarthAmericas } from "react-icons/fa6";
import TitleAnimation from "../common/AnimatedTitle";
import { getFiberPage } from "../../Api/api";

const SustainabilitySection = () => {
  const [data, setData] = useState(null);
  const [activeLang, setActiveLang] = useState("en"); // ✅ Language state

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Language detection from body class or localStorage
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

  // ✅ Helper to pick correct language field
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  useEffect(() => {
    getFiberPage().then((res) => {
      if (res.data?.fiberSustainability) {
        setData(res.data.fiberSustainability);
      }
    });
  }, []);

  if (!data) return null; // wait until loaded

  return (
    <section className="bg-white page-width pt-6 md:pt-20">
      <div className="mx-auto text-center">
        {/* Label */}
        <span className="text-sm font-semibold text-black px-4 py-1 bg-blue-100 rounded-full mb-4 inline-block">
          {pick(data.fiberSustainabilitySubText) || "Sustainability"}
        </span>

        {/* Title */}
        <TitleAnimation
          text={
            pick(data.fiberSustainabilityTitle) ||
            "ECO-FRIENDLY FROM PRODUCTION TO DISPOSAL"
          }
          className="heading mb-4"
          align="center"
          delay={0.05}
          stagger={0.05}
          once={true}
        />

        {/* Description */}
        <p className="text-gray-600 text-lg mb-10">
          {pick(data.fiberSustainabilityDes) ||
            "Our viscose fibers are designed with the environment in mind at every stage of their lifecycle."}
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="h-full">
            <img
              src={
                getFullUrl(data.fiberSustainabilityImg) ||
                "/img/fiber/eco.jpg"
              }
              alt="Eco Fabrics"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>

          {/* Cards (Subtitles + Descriptions) */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-left flex items-start gap-4 hover:shadow-sm hover:border hover:border-[#9ABFE1]">
              <FaRecycle className="text-blue-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {pick(data.fiberSustainabilitySubTitle1) || "Biodegradable"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {pick(data.fiberSustainabilitySubDes1) ||
                    "Naturally breaks down without leaving microplastics in the environment after disposal."}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-sm text-left flex items-start gap-4 hover:shadow-sm hover:border hover:border-[#9ABFE1]">
              <FaDroplet className="text-blue-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {pick(data.fiberSustainabilitySubTitle2) ||
                    "Efficient Production"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {pick(data.fiberSustainabilitySubDes2) ||
                    "Manufactured using increasingly energy- and water-efficient processes to minimize environmental impact."}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-sm text-left flex items-start gap-4 hover:shadow-sm hover:border hover:border-[#9ABFE1]">
              <FaEarthAmericas className="text-blue-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {pick(data.fiberSustainabilitySubTitle3) ||
                    "Sustainable Fashion"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {pick(data.fiberSustainabilitySubDes3) ||
                    "Supports the global shift towards greener fashion alternatives without compromising quality."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
