"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { RxArrowTopRight } from "react-icons/rx";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import TitleAnimation from "../common/AnimatedTitle";

const NEWS = [
  {
    img: "/img/home/news1.jpg",
    title:
      "Now the pain is very important, and the teaching is consistent.",
    excerpt:
      "Reflections on process and value: behind our latest milestone and community gathering.",
    href: "#",
  },
  {
    img: "/img/home/news3.png",
    title: "Workshop highlights: sharing, learning, and building together.",
    excerpt:
      "Collaborative sessions focused on practical skills and long-term impact.",
    href: "#",
  },
  {
    img: "/img/home/news2.jpg",
    title: "Campus event recap: momentum for the next quarter.",
    excerpt:
      "A quick look at what’s next and how we’re aligning teams around goals.",
    href: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    title: "Design talks: systems, patterns, and velocity.",
    excerpt:
      "From components to culture—notes from our latest internal meetup.",
    href: "#",
  },
];

export default function NewsSection() {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",          // center the active slide
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,        // move one card per interaction
  });
const [isWide, setIsWide] = useState(() => window.innerWidth > 700);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
 useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 700);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  return (
    <section className="bg-white overflow-x-hidden">
      <div className={` gap-10 items-start mr-0 p-6 md:py-20 ${
        isWide ? "page-width grid grid-cols-12" : ""
      }`}>
        {/* Left column */}
        <div className="col-span-12 md:col-span-3 h-full grid place-content-center">
          <TitleAnimation
            text={"NEWS"}
            className="heading"
            align="heading text-center md:text-left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <p className="mt-4 text-slate-600 text-center md:text-left leading-relaxed max-w-sm">
            Conveniently located and surrounded by natural beauty, it's the
            perfect spot for our celebration.
          </p>
        </div>

        {/* Right: dark panel + slider */}
        <div className="col-span-12 md:col-span-9 overflow-x-hidden relative md:mt-0 mt-6">
          {/* Dark rounded panel */}
          <div className="absolute inset-y-0 right-0 w-[92%] bg-[#0E2F47] rounded-[36px] md:rounded-l-[48px]" />

          {/* Slider container */}
          <div className="relative pt-20 pb-10 pl-2 pr-2 md:pl-6 md:pr-6 overflow-hidden">
            {/* Arrows */}
            <div className="absolute top-5 md:top-2 right-6 z-30 flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canPrev}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/5 shadow ${
                  !canPrev ? "cursor-not-allowed opacity-40" : "hover:shadow-md"
                }`}
                aria-label="Previous"
              >
                <HiOutlineChevronLeft className="text-xl" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canNext}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/5 shadow ${
                  !canNext ? "cursor-not-allowed opacity-40" : "hover:shadow-md"
                }`}
                aria-label="Next"
              >
                <HiOutlineChevronRight className="text-xl" />
              </button>
            </div>

            {/* Embla viewport */}
            <div ref={emblaRef}>
              {/* Track */}
              <div className="flex gap-3 md:gap-3">
                {NEWS.map((n, i) => {
                  const isActive = selectedIndex === i;

                  return (
                    // 1 per view on mobile, 2 on md, 3 on lg+
                    <div
                      key={i}
                      className="flex-none   basis-8/12 lg:basis-1/3"
                    >
                      <article
                        className={[
                          "origin-center rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden p-4 shadow-md transition-transform duration-300 will-change-transform",
                          isActive
                            ? "scale-100 z-20"
                            : "scale-90 z-10", // side cards shrink by 0.1
                        ].join(" ")}
                      >
                        <img
                          src={n.img}
                          alt={n.title}
                          className="h-44 w-full rounded-xl object-cover md:h-56 lg:h-60"
                        />
                        <div className="py-4">
                          <h3 className="text-[18px] font-semibold leading-snug text-slate-900">
                            {n.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {n.excerpt}
                          </p>
                          <a
                            href={n.href}
                            className={[
                              "mt-4 inline-flex items-center gap-2 text-sm font-medium",
                              isActive
                                ? "text-[#0F3A56]"
                                : "text-[#0F3A56]/80",
                            ].join(" ")}
                          >
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1276BD] text-white text-[16px]">
                              <RxArrowTopRight />
                            </span>
                            Learn More
                          </a>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2 pr-2 relative z-20">
              {NEWS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedIndex === i ? "w-6 bg-white" : "w-3 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
