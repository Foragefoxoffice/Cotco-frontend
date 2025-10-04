import React from "react";
import SlideIn from "../common/SlideIn";

const coreStrengths = [
  {
    title: "GLOBAL COTTON SOURCING",
    description: "We source high-quality cotton from around the globe.",
    image: "/img/home/cotton2.png",
  },
  {
    title: "INNOVATIVE FIBERS",
    description: "Eco-friendly and cutting-edge fiber technologies.",
    image: "/img/home/cotton3.png",
  },
  {
    title: "ADVANCED MACHINERY",
    description: "Modern machinery for efficient textile processing.",
    image: "/img/home/cotton4.png",
  },
];

export default function CoreStrengthSection() {
  return (
    <section className="page-width py-16 pb-30 bg-white core-strength">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">CORE STRENGTHS</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Large Left Card with Slide from Left */}
          <SlideIn direction="left" className="w-full md:w-1/2">
            <div className="relative rounded-xl overflow-hidden group h-[400px] md:h-auto">
              <img
                src={coreStrengths[0].image}
                alt={coreStrengths[0].title}
                className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-2">
                <h3 className="text-4xl font-semibold">{coreStrengths[0].title}</h3>
                <p className="hidden md:block opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {coreStrengths[0].description}
                </p>
                <p className="block md:hidden text-sm">{coreStrengths[0].description}</p>
              </div>
            </div>
          </SlideIn>

          {/* Right Two Cards with Slide from Right */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {coreStrengths.slice(1).map((item, index) => (
              <SlideIn key={index} direction="right">
                <div className="relative rounded-xl overflow-hidden group h-full md:h-full">
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
