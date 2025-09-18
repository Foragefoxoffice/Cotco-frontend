import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import SlideButton from "../common/SlideButton";
import { FiArrowDownRight } from "react-icons/fi";

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      animate={scrolled ? { scale: 0.95, opacity: 0.9 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden hero min-h-screen transition-all duration-500 ease-out ${
        scrolled ? "rounded-2xl shadow-2xl" : ""
      }`}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="/img/fallback/home.png"
        src="/video/hero.webm"
      />

      {/* Dark overlay */}
       <div className="absolute inset-0 bg-black/40" />

      {/* Text Content */}
      <div className="absolute md:bottom-0 bottom-10 md:px-12 p-6 pb-20 text-white max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Your Trusted Partner <br /> in Quality Cotton, Fibers & Textile Machinery
        </h1>
        <p className="mt-4 text-lg">
          Empowering Vietnam’s Textile Industry Since 2016
        </p>

        <a href="/products" className="w-60 mt-6 px-5 py-2 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black hover:text-white transition-all text-xl font-semibold" style={{fontSize: '20px'}}>
          Explore Products <FiArrowDownRight />
        </a>
      </div>
    </motion.div>
  );
}
