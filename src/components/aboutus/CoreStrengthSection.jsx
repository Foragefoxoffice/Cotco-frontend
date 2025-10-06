import React, { useEffect, useState } from "react";
import SlideIn from "../common/SlideIn";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

export default function CoreStrengthSection() {
  const [coreData, setCoreData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect active language dynamically via body class
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

  // ✅ Fetch data
  useEffect(() => {
    getAboutPage()
      .then((res) => {
        if (res.data?.aboutCore) {
          setCoreData(res.data.aboutCore);
        }
      })
      .catch((err) => console.error("Failed to fetch core strengths:", err));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`;
  };

  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  if (!coreData) return null;

  // ✅ Normalize strengths with multilingual text
  const strengths = [
    {
      title: pick(coreData.aboutCoreTitle1, activeLang) || "GLOBAL COTTON SOURCING",
      description:
        pick(coreData.aboutCoreDes1, activeLang) ||
        "We source high-quality cotton from around the globe.",
      image: getImageUrl(coreData.aboutCoreBg1) || "/img/home/cotton2.png",
    },
    {
      title: pick(coreData.aboutCoreTitle2, activeLang) || "INNOVATIVE FIBERS",
      description:
        pick(coreData.aboutCoreDes2, activeLang) ||
        "Eco-friendly and cutting-edge fiber technologies.",
      image: getImageUrl(coreData.aboutCoreBg2) || "/img/home/cotton3.png",
    },
    {
      title: pick(coreData.aboutCoreTitle3, activeLang) || "ADVANCED MACHINERY",
      description:
        pick(coreData.aboutCoreDes3, activeLang) ||
        "Modern machinery for efficient textile processing.",
      image: getImageUrl(coreData.aboutCoreBg3) || "/img/home/cotton4.png",
    },
  ];

  return (
    <section className="page-width md:py-20 py-6 bg-white core-strength">
      <div className="container mx-auto px-4">
        <TitleAnimation
          text={activeLang === "vi" ? "THẾ MẠNH CỐT LÕI" : "CORE STRENGTHS"}
          className="heading uppercase"
          align="center"
          delay={0.05}
          stagger={0.05}
          once={true}
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* ---------- Large Left Card ---------- */}
          <SlideIn direction="left" className="w-full md:w-1/2">
            <div className="relative rounded-xl overflow-hidden group h-[400px] md:h-auto">
              <img
                src={strengths[0].image}
                alt={strengths[0].title}
                className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-2">
                <h3 className="text-4xl font-semibold">{strengths[0].title}</h3>
                <p className="hidden md:block opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {strengths[0].description}
                </p>
                <p className="block md:hidden text-sm">
                  {strengths[0].description}
                </p>
              </div>
            </div>
          </SlideIn>

          {/* ---------- Right Two Cards ---------- */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {strengths.slice(1).map((item, index) => (
              <SlideIn key={index} direction="right">
                <div className="relative rounded-xl overflow-hidden group h-52 md:h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-2">
                    <h3 className="text-4xl font-semibold">{item.title}</h3>
                    <p className="hidden md:block opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {item.description}
                    </p>
                    <p className="block md:hidden text-sm">{item.description}</p>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
