import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import TitleAnimation from "../common/AnimatedTitle";

/* ---------- DATA ---------- */
const suppliers = [
  {
    name: "Louis Dreyfus Company (LDC)",
    logo: "/img/cotton/suppliers/louis_logo.png",
    background: "/img/cotton/suppliers/louis_bg.jpg",
    content: [
      "Founded: 1851, Netherlands",
      "Operations: Over 100 countries",
      "One of the world’s largest cotton suppliers, holding a significant share of global raw cotton exports",
      "Extensive procurement network in the USA, Brazil, India, and Africa",
      "Strong financial position and optimized logistics costs",
      "Member of the Better Cotton Initiative (BCI), committed to emission reduction and sustainable development",
    ],
  },
  {
    name: "Viterra",
    logo: "/img/cotton/suppliers/viterra_logo.png",
    background: "/img/cotton/suppliers/viterra-bg.png",
    content: [
      "Founded: 2016 (from Glencore Agriculture), Netherlands",
      "Operations: Over 37 countries",
      "Leading cotton trading group with a large market share in Asia, Europe, and North America",
      "Strong sourcing from the USA, Australia, and West Africa",
      "Integrated supply chain: warehousing, processing, modern transportation",
      "Solid finances ensuring stable supply and large delivery capacity",
      "BCI member, committed to environmental protection and community investment",
    ],
  },
  {
    name: "ECOM",
    logo: "/img/cotton/suppliers/ecom_logo.png",
    background: "/img/cotton/suppliers/ecom-bg.jpg",
    content: [
      "Founded: 1849, Switzerland",
      "One of the oldest and most reputable companies in the international cotton industry",
      "Procures and distributes a large volume of diverse cotton from the USA, Brazil, India, and Africa",
      "Strict quality control, serving many leading global textile groups",
      "BCI member, reducing environmental impact and supporting farming communities",
    ],
  },
  {
    name: "REINHART",
    logo: "/img/cotton/suppliers/reinhart_logo.jpg",
    background: "/img/cotton/suppliers/paul-bg.jpg",
    content: [
      "Founded: 1788, Switzerland",
      "Over 230 years of experience as one of the world’s largest and oldest cotton suppliers",
      "Stable supply from the USA, West Africa, Brazil, and India",
      "Extensive logistics network, rigorous quality control",
      "Highly regarded by partners for reputation, quality, and timely delivery",
      "BCI member, focused on sustainable development and efficient resource use",
    ],
  },
  {
    name: "DEVCOT",
    logo: "/img/cotton/suppliers/devcot_logo.png",
    background: "/img/cotton/suppliers/devcot-bg.jpg",
    content: [
      "Headquarters: Le Havre, France",
      "One of Europe’s leading cotton trading companies",
      "Strong sourcing from the USA, Brazil, West Africa, and India",
      "Clients include high-end textile manufacturers in France, Germany, Italy, and Spain",
      "Strategic location in Le Havre port, optimizing delivery costs and time",
      "BCI member, committed to a green supply chain and supporting agricultural communities",
    ],
  },
  {
    name: "CAM NEGOCE",
    logo: "/img/cotton/suppliers/cam_logo.png",
    background: "/img/cotton/suppliers/cam-bg1.png",
    content: [
      "Headquarters: France",
      "A reputable cotton trading company in Europe",
      "Main sourcing from the USA, Brazil, and West Africa",
      "Clients: textile manufacturers in France, Spain, Portugal, Morocco, Tunisia",
      "Wide procurement network, professional logistics and documentation services",
      "BCI member, committed to sustainable development and supporting farming communities",
    ],
  },
];

/* ---------- COMPONENT ---------- */
export default function SuppliersSection() {
  const [index, setIndex] = useState(0);

  const sectionRef = useRef(null);
  const indexRef = useRef(0);
  const wheelIdleTimer = useRef(null);
  const gestureActive = useRef(false);
  const touchStartY = useRef(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const clamp = (n) => Math.max(0, Math.min(n, suppliers.length - 1));
  const atStart = () => indexRef.current === 0;
  const atEnd = () => indexRef.current === suppliers.length - 1;

  // 🆕 Keep document scroll in sync with slide index
  const syncScrollToIndex = (idx) => {
    if (!sectionRef.current || typeof window === "undefined") return;
    // Top of the whole section in the document
    const sectionTop =
      sectionRef.current.getBoundingClientRect().top + window.scrollY;
    // Each slide corresponds to +1 * viewport height of scroll progress
    const target = sectionTop + idx * window.innerHeight;
    // Instant jump (use smooth if you want easing)
    window.scrollTo({ top: target, behavior: "auto" });
  };

  const goNext = () => {
    const next = clamp(indexRef.current + 1);
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
      syncScrollToIndex(next); // 🆕
    }
  };

  const goPrev = () => {
    const prev = clamp(indexRef.current - 1);
    if (prev !== indexRef.current) {
      indexRef.current = prev;
      setIndex(prev);
      syncScrollToIndex(prev); // 🆕
    }
  };

  const isPinned = () => {
    const el = sectionRef.current;
    if (!el) return false;
    const b = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // "pinned" while sticky child is occupying the viewport
    return b.top <= 0 && b.bottom - 1 >= vh;
  };

  useEffect(() => {
    const WHEEL_IDLE_MS = 260;
    const SWIPE_THRESHOLD = 30;

    const startIdle = () => {
      if (wheelIdleTimer.current) clearTimeout(wheelIdleTimer.current);
      wheelIdleTimer.current = setTimeout(() => {
        gestureActive.current = false;
      }, WHEEL_IDLE_MS);
    };

    const onWheel = (e) => {
      if (!isPinned()) return;

      const dir = Math.sign(e.deltaY); // 1 down, -1 up
      const canMoveInside = (dir > 0 && !atEnd()) || (dir < 0 && !atStart());

      if (canMoveInside) {
        e.preventDefault(); // capture & step slide
        if (!gestureActive.current) {
          gestureActive.current = true;
          dir > 0 ? goNext() : goPrev();
        }
        startIdle();
      } else {
        // At the boundary — don't prevent default so the page can continue.
        // Because we sync scroll during steps, you'll already be at the section end
        // on the last slide, so the very next tick releases smoothly.
      }
    };

    const onTouchStart = (e) => {
      if (!isPinned()) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (!isPinned()) return;
      if (touchStartY.current == null) return;

      const y = e.touches[0].clientY;
      const dy = touchStartY.current - y; // swipe up = positive
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;

      const dir = Math.sign(dy);
      const canMoveInside = (dir > 0 && !atEnd()) || (dir < 0 && !atStart());

      if (canMoveInside) {
        e.preventDefault();
        if (!gestureActive.current) {
          gestureActive.current = true;
          dir > 0 ? goNext() : goPrev();
        }
        touchStartY.current = y;
        startIdle();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    const sec = sectionRef.current;
    if (sec) {
      sec.addEventListener("touchstart", onTouchStart, { passive: true });
      sec.addEventListener("touchmove", onTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener("wheel", onWheel);
      if (sec) {
        sec.removeEventListener("touchstart", onTouchStart);
        sec.removeEventListener("touchmove", onTouchMove);
      }
      if (wheelIdleTimer.current) clearTimeout(wheelIdleTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      // Height equals (#slides * 100vh) so the sticky content can consume scroll
      style={{ height: `${suppliers.length * 100}vh` }}
      className="relative"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ overscrollBehavior: "auto", touchAction: "pan-y" }}
      >
        {/* Backgrounds cross-fade */}
        {suppliers.map((s, i) => (
          <motion.img
            key={s.name}
            src={s.background}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={{ opacity: index === i ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}

        {/* dim layer */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full w-full flex-col items-start justify-between gap-8 page-width md:flex-row md:items-center">
          {/* Left info */}
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-24 max-w-2xl md:mt-0"
          >
            <TitleAnimation
              text={"SUPPLIERS"}
              className="mb-8 text-3xl fontbold tracking-wide text-white md:text-4xl"
              align="left"
              delay={0.05}
              stagger={0.05}
              once={true}
            />
            <div className="mb-4 inline-block rounded-full bg-white/95 px-5 py-2 font-medium text-black shadow">
              {suppliers[index].name}
            </div>

            <img
              src={suppliers[index].logo}
              alt="Logo"
              className="mb-6 bg-white p-4 rounded-md h-auto w-40 md:hidden"
            />

            <hr className="my-4 w-4/6 border-white/90" />

            <ul className="pt-4 text-base leading-relaxed text-white/90 md:text-lg">
              {suppliers[index].content.map((line, i) => (
                <li key={i} className="mb-2">
                  • {line}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right logos (desktop) */}
          <div className="my-auto hidden rounded-lg bg-white/30 p-4 shadow backdrop-blur-md md:flex md:flex-col md:items-end md:gap-4">
            {suppliers.map((s, i) => (
              <button
                key={s.name}
                onClick={() => {
                  setIndex(i);
                  syncScrollToIndex(i); // 🆕 keep scroll aligned if user clicks a logo
                }}
                className={clsx(
                  "w-40 cursor-pointer rounded-md bg-white p-2 shadow-md transition-all duration-300",
                  i === index ? "scale-105 ring-2 ring-blue-500" : "opacity-70 hover:opacity-100"
                )}
              >
                <img src={s.logo} alt={s.name} className="h-16 w-full object-contain" />
              </button>
            ))}
          </div>

          {/* Mobile dots */}
          <div className="absolute bottom-4 left-0 right-0 z-10 mx-auto flex justify-center gap-2 md:hidden">
            {suppliers.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  syncScrollToIndex(i); // 🆕 clicking dots also syncs scroll
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={clsx(
                  "h-2.5 w-2.5 rounded-full",
                  i === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
