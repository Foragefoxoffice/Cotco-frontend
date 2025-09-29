import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax setup
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]); // background moves slower
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]); // title moves slightly

  return (
    <motion.div
      ref={containerRef}
      style={{
        background:
          "url('/img/cotton/suppliers/ecom-bg.jpg') center/cover no-repeat",
        y: yImage,
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={
        scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative h-[90vh] rounded-br-2xl bg-gradient-to-br overflow-hidden hero transition-all duration-500 ease-out ${
        scrolled ? "rounded-2xl" : ""
      }`}
    >
      <h3 className="text-4xl z-20 absolute bottom-24 left-24 text-[#fff] md:text-6xl font-bold tracking-wider uppercase">
        BLOGS
      </h3>
      <div className="absolute inset-0 bg-black/20 z-10" />
    </motion.div>
  );
};

export default HeroSection;
