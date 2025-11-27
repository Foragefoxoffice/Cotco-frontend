import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useParams } from "react-router-dom";
import { getMainBlogCategories } from "../Api/api";


const HeroSection = () => {
  const [mainCategory, setMainCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState("en"); // ✅ Language state
  const containerRef = useRef(null);
  const { mainCategorySlug } = useParams(); // ✅ e.g. /resources/cotton

  // ✅ Detect language dynamically via <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

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

  // ✅ Handle scroll scaling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getMainBlogCategories();
        const found = res.data.data.find((mc) => mc.slug === mainCategorySlug);
        setMainCategory(found || null);
      } catch (err) {
        console.error("❌ Error fetching main category:", err);
      }
    };
    fetchCategory();
  }, [mainCategorySlug]);

  // ✅ Parallax setup
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]);

  // ✅ Language-safe getter
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  return (
    <motion.div
      ref={containerRef}
      style={{
        background: mainCategory?.bgImage?.url
          ? `url('https://api.cotco-vn.com${mainCategory.bgImage.url}') center/cover no-repeat`
          : "url('/img/fallback-bg.jpg') center/cover no-repeat",
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
      <h3
        className=" !text-[100px] max-md:!text-6xl z-20 absolute bottom-24 left-24 text-[#fff]  !font-[700] tracking-wider uppercase"
        style={{ y: yTitle }}
      >
        {pick(mainCategory?.name) || ""}
      </h3>
      <div className="absolute inset-0 bg-black/20 z-10" />
    </motion.div>
  );
};

export default HeroSection;
