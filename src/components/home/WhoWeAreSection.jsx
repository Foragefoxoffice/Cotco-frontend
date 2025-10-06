import React, { useEffect, useState } from "react";
import { FiArrowDownRight } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api"; // adjust path if needed

const WhoWeAreSection = () => {
  const [data, setData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Detect and react to language changes (vi-mode)
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      // vi-mode → Vietnamese
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Watch for changes to body class dynamically
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch homepage data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.whoWeAreSection) {
        setData(res.data.whoWeAreSection);
      }
    });
  }, []);

  if (!data) return null;

  // ✅ Helper to safely pick multilingual content
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vn ?? "";

  return (
    <section className="w-full bg-white page-width md:pt-20 pt-6">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* ---------- Left Side: Illustration ---------- */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={
              data.whoWeArebannerImage
                ? `${BASE_URL}${data.whoWeArebannerImage}`
                : "/img/home/who.png"
            }
            alt="Who We Are"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* ---------- Right Side: Text ---------- */}
        <div className="w-full md:w-1/2 md:text-left">
          <TitleAnimation
            text={pick(data.whoWeAreheading, activeLang) || "WHO WE ARE?"}
            className="heading"
            align="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
            {pick(
              data.whoWeAredescription,
              activeLang
            ) ||
              "From Raw Materials to Technology – Our Journey to Elevate the Value of Textiles"}
          </p>

          {data.whoWeArebuttonLink?.[activeLang] && (
            <a
              href={data.whoWeArebuttonLink[activeLang]}
              className="w-36 px-5 py-2 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black hover:text-white transition-all text-sm font-semibold"
            >
              {pick(data.whoWeArebuttonText, activeLang) || "SEE MORE"}{" "}
              <FiArrowDownRight />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
