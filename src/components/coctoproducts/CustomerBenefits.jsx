import React from "react";
import TitleAnimation from "../common/AnimatedTitle";
const bullets = [
  "Lower production costs & improved quality standards.",
  "Genuine spare parts at competitive prices to optimize equipment reliability.",
  "Guaranteed machine quality & performance.",
  "Precise interaction between machinery components.",
  "Smart tech applications for automated production, offering efficient management solutions.",
  "Global footprint with strong after-sales service.",
];

export default function CustomerBenefits({
  imageSrc = "/img/products/hero.png", // <-- change to your image path
}) {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="page-width px-4 md:px-6">
        {/* Intro copy */}
        <p className="md:mb-32 mb-10 text-[15px] leading-7 text-slate-600 md:text-base">
          With an agreement signed in 2022, COTCO became the official agent of Lakshmi
          Machine Works (LMW), India’s largest textile machinery manufacturer, for Vietnam’s
          spinning mills, including export-oriented factories from Korea, Taiwan, China, etc.
          LMW is one of the few companies worldwide capable of manufacturing a complete range
          of spinning machinery, from blowroom systems to ring frames, providing integrated
          solutions for various applications and processing diverse raw materials.
        </p>

        {/* Card + image block */}
        <div className="relative">
          {/* angled blue card */}
          <div
            className="
              relative z-10 w-full md:max-w-[880px] rounded-2xl
              bg-[#163A63] p-6 pr-24 text-white shadow-xl md:p-8 md:pr-44
            "
           
          >
           
            <TitleAnimation
              text={"CUSTOMER BENEFITS"}
              className="mb-4 text-xl font-extrabold tracking-wide md:text-3xl fontbold"
              align="left"
              delay={0.05}
              stagger={0.05}
              once={true}
            />
          

            <ul className="space-y-2 text-sm leading-6 md:text-[15px]">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="pl-4"
                  style={{ listStyle: "none", position: "relative" }}
                >
                  <span
                    className="absolute left-0 top-2 block h-2 w-2 rounded-full bg-sky-200"
                    aria-hidden="true"
                  />
                  <span className="text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* small base shadow block (matches screenshot) */}
          <div className=" absolute -bottom-3 left-6 h-4 w-24 rounded bg-slate-300/70 blur-[1px]" />

          {/* machine image on the right, overlapping the card */}
          <div className="pointer-events-none md:absolute right-0 md:top-1/2 z-20 md:-translate-y-1/2">
            <img
              src={imageSrc}
              alt="LMW Machine"
              className="
                w-[320px] md:w-[420px] lg:w-[520px]
                drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
