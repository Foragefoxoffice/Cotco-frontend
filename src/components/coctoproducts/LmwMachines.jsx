import React from "react";
import { FiArrowRight, FiClock } from "react-icons/fi";
import SlideIn from "../common/SlideIn";

const CATEGORIES = [
  { title: "MACHINES",              img: "/img/products/blowroom.jpg", href: "#", comingSoon: true },
  { title: "CARD CLOTHING",         img: "/img/products/carding.jpg",  href: "#", comingSoon: true  }, // ← example
  { title: "CARD SERVICE MACHINES", img: "/img/products/mill.jpg",     href: "#", comingSoon: true },
  { title: "RING SYSTEM",           img: "/img/products/ring.jpg",     href: "#", comingSoon: true },
];

export default function LmwMachines() {
  return (
    <section className="bg-white md:pt-20 pt-6 page-width">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {CATEGORIES.map((item, i) => {
          const soon = item.comingSoon;
          const Card = ({ children }) =>
            soon ? (
              <div className="group block select-none cursor-not-allowed">{children}</div>
            ) : (
              <a href={item.href || "#"} className="group block">{children}</a>
            );

          return (
            <SlideIn direction="up" key={i}>
              <Card>
                <div className="relative rounded-2xl overflow-hidden bg-[#0E2F47] aspect-[4/3] shadow-md">
                  {/* image */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500
                      ${soon ? "opacity-60 grayscale" : "opacity-70 group-hover:scale-105"}`}
                  />

                  {/* tint */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E2F47]/10 to-[#0E2F47]/40" />

                  {/* arrow / clock */}
                  <span
                    className={`absolute top-3 right-3 h-9 w-9 rounded-full border border-white/50
                                grid place-items-center text-white/90 backdrop-blur-sm transition-all duration-300
                                ${soon ? "opacity-60" : "group-hover:bg-white/10 group-hover:rotate-[-35deg]"}`}
                    aria-hidden
                  >
                    {soon ? <FiClock /> : <FiArrowRight />}
                  </span>

                  {/* text lockup */}
                  <div className="absolute left-4 right-4 bottom-4">
                    <h3 className="text-white uppercase font-semibold tracking-wide text-lg md:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-white/80 text-xs md:text-sm max-w-[90%]">
                      Advanced machinery to elevate your textile operations.
                    </p>
                  </div>

                  {/* COMING SOON overlay */}
                  {soon && (
                    <div className="absolute inset-0 bg-[#0E2F47]/55 backdrop-blur-[2px] flex items-end">
                      <span className="m-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-[#0E2F47] text-xs font-semibold">
                        <FiClock className="text-sm" />
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </SlideIn>
          );
        })}
      </div>
    </section>
  );
}
