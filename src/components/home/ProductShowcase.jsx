import React, { useEffect, useState } from "react";
import { getHomepage } from "../../Api/api";
import TitleAnimation from "../common/AnimatedTitle";

export default function ProductShowcase() {
  const [data, setData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");
  const BASE_URL = import.meta.env.VITE_API_URL || "";

  // ✅ Detect language dynamically based on <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Watch for language class changes dynamically
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Helper for multilingual text
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch homepage data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.whatWeDoSection) {
        setData(res.data.whatWeDoSection);
      }
    });
  }, []);

  if (!data) return null;

  // ✅ Prepare categories dynamically with language support
  const categories = [
    {
      title: pick(data.whatWeDoTitle1, activeLang) || "COTTON",
      description:
        pick(data.whatWeDoDes1, activeLang) ||
        "Global cotton sourcing to power your production",
      image: data.whatWeDoImg1
        ? `${BASE_URL}${data.whatWeDoImg1}`
        : "/img/home/cotton.png",
      icon: data.whatWeDoIcon1
        ? `${BASE_URL}${data.whatWeDoIcon1}`
        : "/img/home/icon1.png",
    },
    {
      title: pick(data.whatWeDoTitle2, activeLang) || "FIBER",
      description:
        pick(data.whatWeDoDes2, activeLang) ||
        "Eco-friendly fibers for fashion and nonwoven innovation",
      image: data.whatWeDoImg2
        ? `${BASE_URL}${data.whatWeDoImg2}`
        : "/img/home/cotton1.png",
      icon: data.whatWeDoIcon2
        ? `${BASE_URL}${data.whatWeDoIcon2}`
        : "/img/home/icon2.png",
    },
    {
      title: pick(data.whatWeDoTitle3, activeLang) || "MACHINES",
      description:
        pick(data.whatWeDoDes3, activeLang) ||
        "Advanced machinery to elevate your textile operations",
      image: data.whatWeDoImg3
        ? `${BASE_URL}${data.whatWeDoImg3}`
        : "/img/home/cottonmac.png",
      icon: data.whatWeDoIcon3
        ? `${BASE_URL}${data.whatWeDoIcon3}`
        : "/img/home/icon3.png",
    },
  ];

  return (
    <section className="bg-white page-width md:pt-20 pt-6">
      <div className="mx-auto grid md:grid-cols-6 gap-10">
        {/* ---------- Left Section with Heading ---------- */}
        <div className="w-full col-span-3 place-content-center">
          <TitleAnimation
            text={pick(data.whatWeDoTitle, activeLang) || "WHAT WE DO?"}
            className="heading mb-4"
            align="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <p className="text-lg text-gray-600">
            {pick(data.whatWeDoDec, activeLang) ||
              "Explore our complete range of premium cotton, sustainable fibers, and advanced textile machines"}
          </p>
        </div>

        {/* ---------- Big First Card ---------- */}
        <div className="relative col-span-3 h-72 rounded-2xl shadow-lg pro-img">
          <img
            src={categories[0].image}
            alt={categories[0].title}
            className="inset-0 w-full h-full object-cover rounded-3xl"
          />
          <div className="absolute inset-0 bg-black/30 rounded-3xl" />
          <div className="absolute top-[-10px] left-[-10px] bg-white flex items-center justify-center z-10 pro-icon">
            <img src={categories[0].icon} alt="" />
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-4xl font-bold">{categories[0].title}</h3>
            <p className="text-[16px] mt-1">{categories[0].description}</p>
          </div>
        </div>
      </div>

      {/* ---------- Right Grid ---------- */}
      <div className="w-full pt-12">
        <div className="grid md:grid-cols-6 gap-10">
          {categories.slice(1).map((item, idx) => (
            <div
              key={idx}
              className="relative col-span-3 h-72 rounded-2xl shadow-lg pro-img"
            >
              <img
                src={item.image}
                alt={item.title}
                className="inset-0 w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-black/30 rounded-3xl" />
              <div className="absolute top-[-10px] left-[-10px] bg-white rounded-full flex items-center justify-center z-10 pro-icon">
                <img src={item.icon} alt="" />
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-4xl font-bold">{item.title}</h3>
                <p className="text-[16px] mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
