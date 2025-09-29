import React, { useState } from "react";
import {
  FaCloud,
  FaWater,
  FaHandHoldingHeart,
  FaPalette,
  FaSeedling,
  FaDollarSign,
} from "react-icons/fa6";
import TitleAnimation from "../common/AnimatedTitle";

const features = [
  {
    title: "Soft & Breathable",
    description:
      "Provides all-day comfort with its naturally cool and breathable properties.",
    image: "/img/fiber/why.jpg",
    icon: <FaCloud />,
  },
  {
    title: "Moisture Absorption",
    description:
      "Superior to cotton, keeping the body dry and helping reduce odor.",
    image: "/img/fiber/why.jpg",
    icon: <FaWater />,
  },
  {
    title: "Gentle on Skin",
    description:
      "Smooth fiber surface makes it ideal even for sensitive skin types.",
    image: "/img/fiber/why.jpg",
    icon: <FaHandHoldingHeart />,
  },
  {
    title: "Vibrant Colors",
    description:
      "Excellent dyeability and color fastness ensure long-lasting, vibrant colors.",
    image: "/img/fiber/why.jpg",
    icon: <FaPalette />,
  },
  {
    title: "Biodegradable",
    description:
      "The perfect sustainable choice for eco-conscious fashion brands.",
    image: "/img/fiber/why.jpg",
    icon: <FaSeedling />,
  },
  {
    title: "Cost-Effective",
    description:
      "High-quality performance at competitive prices for manufacturers.",
    image: "/img/fiber/why.jpg",
    icon: <FaDollarSign />,
  },
];

export default function WhyChooseViscose() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-6 md:py-20 page-width">
      <div className="mx-auto text-center">
        <TitleAnimation
          text={"WHY CHOOSE VISCOSE FIBER?"}
          className="heading -900 mb-2"
          align="center"
          delay={0.05}
          stagger={0.05}
          once={true}
        />
        <p className="text-gray-600 mb-10">
          Superior performance meets sustainability in our premium viscose fibers.
        </p>

        {/* MOBILE GRID: hidden on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden shadow-md h-64"
              style={{
                backgroundImage: `url(${feature.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="relative z-10 p-6 text-left text-white flex flex-col justify-end h-full">
                <div className="text-2xl text-blue-300 mb-2">{feature.icon}</div>
                <h4 className="font-semibold text-lg">{feature.title}</h4>
                <p className="text-sm text-gray-200 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP FLEX: hidden on <md */}
        <div className="hidden md:flex gap-4 h-64 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {features.map((feature, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative overflow-hidden rounded-xl shadow-md group cursor-pointer flex-shrink-0 transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "flex-[2]" : "flex-[1]"
                }`}
              >
                <div className={`absolute inset-0  transition-opacity duration-700 group-hover:opacity-0 ${isActive ? "bg-[#0c1b34]/60" : " bg-transparent"}`}></div>

                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    backgroundImage: `url(${feature.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <div className={`absolute inset-0  transition-opacity duration-700 group-hover:opacity-0 ${isActive ? "bg-transparent" : "  bg-[#11456C]"}`}></div>

                <div className="relative z-10 p-6 text-left text-white flex flex-col justify-end h-full transition-all duration-700">
                  <div className="text-2xl text-white mb-2 bg-[#11456C]/80 w-8 h-8 flex items-center justify-center rounded-full p-2">{feature.icon}</div>
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-out ${
                      isActive ? "opacity-100 max-h-32 mt-1" : "opacity-0 max-h-0"
                    }`}
                  >
                    <p className="text-sm text-gray-200">{feature.description}</p>
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
