import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowDownRight } from "react-icons/fi";
import { getHomepage } from "../../Api/api"; // adjust path if needed

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const videoRef = useRef(null);

  // Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Hero data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.heroSection) {
        setHeroData(res.data.heroSection);
      }
    });
  }, []);

  if (!heroData) return null;

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      animate={
        scrolled ? { scale: 0.95, opacity: 0.9 } : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden hero min-h-screen transition-all duration-500 ease-out ${
        scrolled ? "rounded-2xl shadow-2xl" : ""
      }`}
    >
      {/* Background */}
      {heroData.bgType === "video" ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/img/fallback/home.jpg"
          src={heroData.bgUrl || "/video/hero.webm"}
        />
      ) : (
        <img
          src={heroData.bgUrl || "/img/fallback/home.jpg"}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Content */}
      <div className="absolute md:bottom-0 bottom-10 md:px-12 p-6 pb-20 text-white max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          {heroData.heroTitle?.en || "Your Trusted Partner"} <br />
        </h1>
        <p className="mt-4 text-lg">
          {heroData.heroDescription?.en ||
            "Empowering Vietnam’s Textile Industry"}
        </p>

        {heroData.heroButtonLink?.en && (
          <a
            href={heroData.heroButtonLink.en}
            className="w-60 mt-6 px-5 py-2 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black hover:text-white transition-all text-xl font-semibold"
            style={{ fontSize: "20px" }}
          >
            {heroData.heroButtonText?.en || "Explore Products"}{" "}
            <FiArrowDownRight />
          </a>
        )}
      </div>
    </motion.div>
  );
}
