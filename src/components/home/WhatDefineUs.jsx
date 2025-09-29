import React, { useEffect, useState } from "react";
import { TbCheckbox } from "react-icons/tb";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api"; // adjust path

const WhatDefineUs = () => {
  const [items, setItems] = useState([]);
  const [heading, setHeading] = useState("WHAT DEFINES US");

  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.definedUsSection) {
        const section = res.data.definedUsSection;

        // ✅ Set heading
        if (section.definedUsHeading?.en) {
          setHeading(section.definedUsHeading.en);
        }

        // ✅ Collect items (ignore logos now)
        const collected = [];
        for (let i = 1; i <= 6; i++) {
          if (
            section[`definedUsTitle${i}`]?.en ||
            section[`definedUsDes${i}`]?.en
          ) {
            collected.push({
              title: section[`definedUsTitle${i}`]?.en || `Title ${i}`,
              desc: section[`definedUsDes${i}`]?.en || "",
            });
          }
        }
        setItems(collected);
      }
    });
  }, []);

  if (!items.length) return null;

  return (
    <section className="page-width bg-white rounded-md md:pt-20 pt-6">
      <div className="bg-[var(--secondary)] rounded-2xl md:py-16 p-6 md:px-22">
        <h2 className="text-center heading mb-8" style={{ color: "white" }}>
          <TitleAnimation
            text={heading}
            className="text-white md:text-4xl text-3xl font-bold mb-8"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
        </h2>
        <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {items.map((item, i) => (
            <article
              key={i}
              className="rounded-xl bg-white text-slate-900 shadow-[0_6px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5 px-5 py-6"
            >
              <div className="flex items-center gap-3">
                {/* ✅ Always show hardcoded icon */}
                <TbCheckbox className="h-8 w-8 text-[var(--secondary)]" />

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
