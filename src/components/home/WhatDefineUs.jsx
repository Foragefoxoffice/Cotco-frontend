import React, { useEffect, useState } from "react";
import { TbCheckbox } from "react-icons/tb";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api"; // adjust path if needed

const WhatDefineUs = () => {
  const [items, setItems] = useState([]);
  const [heading, setHeading] = useState("WHAT DEFINES US");
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language dynamically from <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Watch for live changes in body class
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Helper to pick language safely
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch homepage data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.definedUsSection) {
        const section = res.data.definedUsSection;

        // Set heading
        setHeading(pick(section.definedUsHeading, activeLang));

        // Collect all items (titles + descriptions)
        const collected = [];
        for (let i = 1; i <= 6; i++) {
          const title = pick(section[`definedUsTitle${i}`], activeLang);
          const desc = pick(section[`definedUsDes${i}`], activeLang);
          if (title || desc) {
            collected.push({ title, desc });
          }
        }
        setItems(collected);
      }
    });
  }, [activeLang]); // refetch when language changes

  if (!items.length) return null;

  return (
    <section className="page-width bg-white rounded-md md:pt-20 pt-6">
      <div className="bg-[var(--secondary)] rounded-2xl md:py-16 p-6 md:px-22">
        <h2 className="text-center heading mb-8" style={{ color: "white" }}>
          <TitleAnimation
            text={heading || "WHAT DEFINES US"}
            className="text-white md:text-4xl text-3xl font-bold mb-8"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
        </h2>

        {/* ✅ Content Cards */}
        <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {items.map((item, i) => (
            <article
              key={i}
              className="rounded-xl bg-white text-slate-900 shadow-[0_6px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5 px-5 py-6"
            >
              <div className="flex items-start gap-3">
                {/* Always show icon */}
                <TbCheckbox className="h-8 w-8 text-[var(--secondary)] mt-1" />
                <div>
                  <h3 className="text-sm sm:text-xl font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatDefineUs;
