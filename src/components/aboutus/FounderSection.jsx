import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

export default function FounderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [founder, setFounder] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language using body class
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch founder data
  useEffect(() => {
    getAboutPage()
      .then((res) => {
        if (res.data?.aboutFounder) {
          setFounder(res.data.aboutFounder);
        }
      })
      .catch((err) => console.error("Failed to fetch founder:", err));
  }, []);

  // ✅ Helper: pick language field safely
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Get full image URL
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || ""}${path}`;
  };

  // ✅ Animation variants
  const fadeLeft = {
    initial: { opacity: 1, x: 0 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeRight = {
    initial: { opacity: 1, x: 40 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (!founder) return null;

  return (
    <section className="bg-white">
  <div
    ref={ref}
    className="mx-auto md:grid md:grid-cols-12 md:gap-0 items-center pt-6 md:pt-20 page-width"
  >
    {/* ---------- LEFT: Founder Text ---------- */}
    <motion.div
      className="col-span-12 md:col-span-6 px-4 md:pl-12 md:pr-8"
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeLeft}
    >
      <TitleAnimation
        text={pick(founder.aboutFounderTitle, activeLang) || "Founder"}
        className="heading uppercase"
        align="center"
        mdAlign="left"
        lgAlign="right"
        delay={0.05}
        stagger={0.05}
        once={true}
      />

      <h3 className="mt-1 text-xl md:text-2xl font-semibold text-slate-800 text-center md:text-left">
        {pick(founder.aboutFounderName, activeLang)}
      </h3>

      {/* ---------- MOBILE IMAGE ---------- */}
      <div className="relative md:w-6/12 block md:hidden mt-4">
        {founder.founderImg1 && (
          <motion.img
            src={getImageUrl(founder.founderImg1)}
            alt="Founder portrait"
            className="relative z-10 rounded-[22px] object-cover"
            initial={{ opacity: 1, y: 30 }}
            animate={
              inView
                ? {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.2,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }
                : {}
            }
            whileHover={{ y: -4 }}
          />
        )}
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      {Array.isArray(founder.aboutFounderDes) &&
        founder.aboutFounderDes.length > 0 && (
          <ul className="mt-5 space-y-2 text-slate-700 leading-relaxed list-disc pl-5">
            {founder.aboutFounderDes.map((desc, idx) => (
              <li key={idx} style={{ fontSize: 18 }}>
                {pick(desc, activeLang)}
              </li>
            ))}
          </ul>
        )}
    </motion.div>


    {/* ---------- RIGHT: IMAGE COLLAGE ---------- */}
<motion.div
  className="hidden md:flex col-span-12 md:col-span-6 pr-8 items-center justify-center gap-10"
  initial="initial"
  animate={inView ? "animate" : "initial"}
  variants={fadeRight}
>
  {/* Main Portrait */}
  <div className="relative w-1/2 flex-shrink-0 flex justify-end">
    {founder.founderImg1 && (
      <motion.img
        src={getImageUrl(founder.founderImg1)}
        alt="Founder"
        className="relative z-10 rounded-[22px] object-cover w-full max-w-sm"
        initial={{ opacity: 1, y: 30 }}
        animate={
          inView
            ? {
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.6 },
              }
            : {}
        }
        whileHover={{ y: -4 }}
      />
    )}
  </div>

  {/* Secondary Images (stacked vertically, centered beside main image) */}
  <div className="flex flex-col justify-between gap-6 w-1/2">
    {founder.founderImg2 && (
      <motion.img
        src={getImageUrl(founder.founderImg2)}
        alt="Founder moment 1"
        className="rounded-[18px] object-cover shadow-lg ring-1 ring-black/5 bg-white w-full"
        initial={{ opacity: 1, x:0, y:0 }}
        animate={
          inView
            ? {
                opacity: 1,
                x: -10,
                y: -10,
                transition: { delay: 0.35, duration: 0.55 },
              }
            : {}
        }
        whileHover={{ scale: 1.02 }}
      />
    )}

    {founder.founderImg3 && (
      <motion.img
        src={getImageUrl(founder.founderImg3)}
        alt="Founder moment 2"
        className="rounded-[18px] object-cover shadow-lg ring-1 ring-black/5 bg-white w-full"
        initial={{ opacity: 1, x:0, y:0 }}
        animate={
          inView
            ? {
                opacity: 1,
                x: 0,
                y: 0,
                transition: { delay: 0.45, duration: 0.55 },
              }
            : {}
        }
        whileHover={{ scale: 1.02 }}
      />
    )}
  </div>
</motion.div>

  </div>
</section>

  );
}
