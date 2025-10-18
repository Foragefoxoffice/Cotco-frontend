import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getContactPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [banner, setBanner] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const containerRef = useRef(null);

  // ✅ Language detection (same system as other components)
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch banner data
  useEffect(() => {
    getContactPage().then((res) => {
      if (res.data?.contactBanner) {
        setBanner(res.data.contactBanner);
      }
    });
  }, []);

  // ✅ Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Parallax setup
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]);

  // ✅ Check if media is video
  const isVideo = banner?.contactBannerBg
    ? /\.(mp4|webm|ogg)$/i.test(banner.contactBannerBg)
    : false;

  // ✅ Helper: translation
  const t = (en, vi) => (isVietnamese ? vi || en : en);

  return (
    <motion.div
      ref={containerRef}
      style={{ y: yImage }}
      initial={{ scale: 1, opacity: 1 }}
      animate={
        scrolled
          ? { scale: 0.93, opacity: 0.95 }
          : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative h-[90vh] rounded-br-2xl overflow-hidden hero transition-all duration-500 ease-out ${
        scrolled ? "rounded-2xl" : ""
      }`}
    >
      {/* ✅ Background video or image */}
      {isVideo ? (
        <video
          src={getFullUrl(banner?.contactBannerBg)}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: banner?.contactBannerBg
              ? `url('${getFullUrl(banner.contactBannerBg)}')`
              : "url('/img/cotton/banner.jpg')",
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Title */}
      <motion.h3
        style={{ y: yTitle }}
        className="text-4xl z-20 absolute bottom-2 md:bottom-24 left-2 md:left-24 text-white md:text-[100px] font-[700] tracking-wider uppercase"
      >
        {t(
          banner?.contactBannerTitle?.en || "CONTACT",
          banner?.contactBannerTitle?.vi || "LIÊN HỆ"
        )}
      </motion.h3>
    </motion.div>
  );
};

export default HeroSection;
