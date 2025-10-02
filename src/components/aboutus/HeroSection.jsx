import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getAboutPage } from "../../Api/api";

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    getAboutPage()
      .then((res) => {
        if (res.data?.aboutHero) {
          setHeroData(res.data.aboutHero); // ✅ correct key
        }
      })
      .catch((err) => {
        console.error("Failed to fetch About page hero:", err);
      });
  }, []);

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]);

  if (!heroData) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 1, opacity: 1 }}
      animate={
        scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden hero transition-all duration-500 ease-out ${scrolled ? "rounded-2xl" : ""
        }`}
    >
      {/* Title */}
      <motion.div
        style={{ y: yTitle }}
        className="absolute top-[18%] w-full z-10 flex flex-col justify-center items-center text-center px-6 text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, scale: scrolled ? 0.95 : 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            scale: { duration: 0.6 },
          }}
          className="max-w-6xl"
        >
          <h3 className="text-4xl text-[#143A59] md:text-6xl font-bold tracking-wider uppercase">
            {heroData.aboutTitle?.en || "Default Title"}
          </h3>
        </motion.div>
      </motion.div>

      {/* Background Image */}
      <div className="relative overflow-hidden">
        {heroData.aboutBanner && (
          <motion.img
            style={{ y: yImage }}
            src={getFullUrl(heroData.aboutBanner)}
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>
    </motion.div>
  );
};

export default HeroSection;
