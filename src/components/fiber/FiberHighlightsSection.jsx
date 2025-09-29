import React, { useState, useEffect } from "react";

const sections = [
  {
    title: "Birla Viscose",
    lines: [
      "Standard viscose fiber,produced from wood pulp using a closed-loop process",
      "100%plant-based (wood)",
      "Breathable,soft,skin-friendly,natural drape",
    ],
    image: "/img/fiber/products/birla.png",
  },
  {
    title: "Liva Eco",
    lines: [
      "Enhanced viscose - eco-friendly with traceability",
      "100% plant-based (FSC-certified)",
      "Lower environmental impact, soft, easy to design with",
    ],
    image: "/img/fiber/products/liva.png",
  },
  {
    title: "birla Modal",
    lines: [
      "Premium fiber, softer than viscose, glossy, produced in closed-loop system",
      "100% plant-based",
      "Ideal for high-end fabrics, strong when wet, good crease recovery",
    ],
    image: "/img/fiber/products/model.png",
  },
  {
    title: "Birla Excel",
    lines: [
      "Next-gen fiber, made with NMMO solvent, 99.7% recovered, nearly zero waste",
      "100% plant-based (with molecular marker)",
      "Glossy, durable in both dry & wet states, highly absorbent, biodegradable",
    ],
    image: "/img/fiber/products/excel.png",
  },
  {
    title: "Spunshades<sup>TM</sup>",
    lines: [
      "Pre-dyed viscose, excellent color fastness, no post-dyeing needed",
      "100% plant-based",
      "Uniform color, pollution-free, cost-saving",
    ],
    image: "/img/fiber/products/spun.png",
  },
  {
    title: "Liva Reviva",
    lines: [
      "Recycled from pre-/post-consumer textile waste (up to 30%), uses both viscose & Excel",
      "Wood + recycled fabric (FSC-certified)",
      "Promotes circularity, eco-friendly, good drape and breathability",
    ],
    image: "/img/fiber/products/reviva.png",
  },
  {
    title: "EcoSoft",
    lines: [
      "Viscose derived from bamboo - fast growth, low resource use",
      "100% bamboo pulp",
      "Soft, light, breathable, good moisture control",
    ],
    image: "/img/fiber/products/birla.png",
  },
  {
    title: "SaFR",
    lines: [
      "Natural flame-retardant cellulose fiber, meets ISO 15025 standard",
      "100% plant-based (wood)",
      "Used in PPE, firefighting gear, OEKO-TEX certified, does not emit toxic gas when burning",
    ],
    image: "/img/fiber/products/birla.png",
  },
  {
    title: "Intellicolor",
    lines: [
      "Dyed using cationic or alkaline dyes, no post-rinsing needed",
      "Dye additives on viscose base",
      "Efficient dyeing, vibrant colors, less salt and environmental impact",
    ],
    image: "/img/fiber/products/birla.png",
  },
];

export default function FiberInfoBlocks() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleInteraction = (index) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index); // toggle on tap
    } else {
      setActiveIndex(index); // show on hover
    }
  };

  return (
    <section className="w-full divide-y divide-gray-200">
      {sections.map((section, idx) => {
        const isActive = activeIndex === idx;

        return (
          <div
            key={idx}
            className={`group relative bg-white ${isActive ? "active" : ""}`}
            onClick={() => handleInteraction(idx)}
            onMouseEnter={() => !isMobile && handleInteraction(idx)}
            onMouseLeave={() => !isMobile && setActiveIndex(null)}
          >
            {/* BACKGROUND revealed when doors open */}
            <div className="absolute inset-0 z-0 bg-[#0A4A78]" />

            {/* VERTICAL DOUBLE DOORS */}
            <div className="pointer-events-none absolute inset-0 z-10">
              {/* top door */}
              <div
                className={`absolute left-0 top-0 h-1/2 w-full bg-white transition-transform duration-700 ease-out will-change-transform
                ${isActive ? "-translate-y-full" : "translate-y-0"}`}
              />
              {/* bottom door */}
              <div
                className={`absolute left-0 bottom-0 h-1/2 w-full bg-white transition-transform duration-700 ease-out will-change-transform
                ${isActive ? "translate-y-full" : "translate-y-0"}`}
              />
            </div>

            {/* FLOATING IMAGE (desktop) */}
            <div
              className={`absolute bottom-[-60px] right-0 z-30 w-48 -translate-x-1/2 transform transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={section.image} alt="fiber" className="hidden h-auto w-full md:block" />
            </div>

            {/* CONTENT */}
            <div
              className={`relative z-20 page-width grid gap-10 py-20 transition-colors duration-500 md:grid-cols-4 md:gap-20 ${
                isActive ? "text-white" : "text-black"
              }`}
            >
              <h3
                className="outlined-text flex min-w-[180px] items-center text-4xl font-extrabold uppercase tracking-wide md:col-span-2 md:text-6xl"
                dangerouslySetInnerHTML={{ __html: section.title }}
              />

              <ul className="md:col-span-2 space-y-3 text-sm leading-relaxed md:text-base">
                {section.lines.map((line, i) => (
                  <li key={i} className="relative pl-6 before:absolute before:left-0 before:top-1 before:content-['--']">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      {/* Footer CTA */}
      <div className="page-width relative z-20 grid gap-8 pt-10 transition-all md:pt-26">
        <p className="text-center text-xl">
          If you are looking for a raw material solution that combines performance with environmental responsibility,
          viscose fiber is the ideal choice. With its advantages in quality, cost-effectiveness, and sustainability,
          viscose is increasingly favored by manufacturers and fashion brands worldwide.
        </p>
        <a  className="mx-auto w-60 rounded-xl bg-[#143A59] p-3 text-center text-white" href="/contact">
          Contact Our Team
        </a>
      </div>
    </section>
  );
}
