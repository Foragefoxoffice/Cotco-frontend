import React, { useEffect, useState } from "react";
import * as FiIcons from "react-icons/fi";
import {
  FaCloud,
  FaWater,
  FaHandHoldingHeart,
  FaPalette,
  FaSeedling,
  FaDollarSign,
} from "react-icons/fa6";
import TitleAnimation from "../common/AnimatedTitle";
import { getFiberPage } from "../../Api/api";

export default function WhyChooseViscose() {
  const [chooseUs, setChooseUs] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLang, setActiveLang] = useState("en"); // ✅ language state

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Detect language from body class or localStorage
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
      if (res.data?.fiberChooseUs) {
        setChooseUs(res.data.fiberChooseUs);
      }
    });
  }, []);

  if (!chooseUs) return null;

  return (
    <section className="bg-white py-6 md:py-20 page-width">
      <div className="mx-auto text-center">
        <TitleAnimation
          text={pick(chooseUs.fiberChooseUsTitle) || "WHY CHOOSE VISCOSE FIBER?"}
          className="heading -900 mb-2"
          align="center"
          delay={0.05}
          stagger={0.05}
          once={true}
        />
        <p className="text-gray-600 mb-10">
          {pick(chooseUs.fiberChooseUsDes) ||
            "Superior performance meets sustainability in our premium viscose fibers."}
        </p>

        {/* MOBILE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {chooseUs.fiberChooseUsBox.map((box, idx) => {
            const Icon =
              box.fiberChooseUsIcon && FiIcons[box.fiberChooseUsIcon]
                ? FiIcons[box.fiberChooseUsIcon]
                : FaCloud; // fallback icon
            return (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden shadow-md h-64"
                style={{
                  backgroundImage: `url(${getFullUrl(
                    box.fiberChooseUsBoxBg
                  )})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 p-6 text-left text-white flex flex-col justify-end h-full">
                  <div className="text-2xl text-blue-300 mb-2">
                    <Icon />
                  </div>
                  <h4 className="font-semibold text-lg">
                    {pick(box.fiberChooseUsBoxTitle)}
                  </h4>
                  <p className="text-sm text-gray-200 mt-1">
                    {pick(box.fiberChooseUsDes)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP FLEX */}
        <div className="hidden md:flex gap-4 h-64 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {chooseUs.fiberChooseUsBox.map((box, idx) => {
            const isActive = idx === activeIndex;
            const Icon =
              box.fiberChooseUsIcon && FiIcons[box.fiberChooseUsIcon]
                ? FiIcons[box.fiberChooseUsIcon]
                : FaCloud;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative overflow-hidden rounded-xl shadow-md group cursor-pointer flex-shrink-0 transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "flex-[2]" : "flex-[1]"
                }`}
              >
                {/* Background overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 group-hover:opacity-0 ${
                    isActive ? "bg-[#0c1b34]/60" : " bg-transparent"
                  }`}
                ></div>

                {/* Background image */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    backgroundImage: `url(${getFullUrl(
                      box.fiberChooseUsBoxBg
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                {/* Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 group-hover:opacity-0 ${
                    isActive ? "bg-transparent" : "  bg-[#11456C]"
                  }`}
                ></div>

                {/* Content */}
                <div className="relative z-10 p-6 text-left text-white flex flex-col justify-end h-full transition-all duration-700">
                  <div className="text-2xl text-white mb-2 bg-[#11456C]/80 w-8 h-8 flex items-center justify-center rounded-full p-2">
                    <Icon />
                  </div>
                  <h4 className="font-semibold text-lg">
                    {pick(box.fiberChooseUsBoxTitle)}
                  </h4>
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-out ${
                      isActive
                        ? "opacity-100 max-h-32 mt-1"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                    <p className="text-sm text-gray-200">
                      {pick(box.fiberChooseUsDes)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
