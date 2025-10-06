import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

export default function CoreValuesSection() {
  const [data, setData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language dynamically based on <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Observe changes to body class (live updates)
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // ✅ Helper function for picking localized text
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch homepage data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.coreValuesSection) {
        setData(res.data.coreValuesSection);
      }
    });
  }, []);

  if (!data) return null;

  return (
    <section className="page-width md:pt-20 pt-6 bg-white overflow-hidden">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px] md:auto-rows-[330px] corevalues-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* ---------- 1. Section Title ---------- */}
        <motion.div
          variants={fadeInUp}
          className="relative bg-[#edf3fb] rounded-xl md:p-20 p-6 flex items-center justify-center text-center order-1"
        >
          <TitleAnimation
            text={pick(data.coreTitle, activeLang) || "CORE VALUES"}
            className="heading"
            align="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
        </motion.div>

        {/* ---------- 2. TRUST ---------- */}
        <motion.div
          variants={fadeInUp}
          className="bg-[#edf3fb] rounded-xl p-16 place-content-center order-2 core-values-box"
        >
          <h3 className="text-2xl font-bold mb-2">
            {pick(data.coreTitle1, activeLang) || "TRUST"}
          </h3>
          <p className="text-medium text-gray-700">
            {pick(data.coreDes1, activeLang) ||
              "We act with integrity, ensuring reliability in every transaction."}
          </p>
        </motion.div>

        {/* ---------- 3. QUALITY ---------- */}
        <motion.div
          variants={fadeInUp}
          className="bg-[#edf3fb] rounded-xl p-16 place-content-center order-3 core-values-box"
        >
          <h3 className="text-2xl font-bold mb-2">
            {pick(data.coreTitle2, activeLang) || "QUALITY"}
          </h3>
          <p className="text-medium text-gray-700">
            {pick(data.coreDes2, activeLang) ||
              "We insist on premium standards for all products and services."}
          </p>
        </motion.div>

        {/* ---------- 4. IMAGE (Right-side visual) ---------- */}
        <motion.div
          variants={fadeInUp}
          className="md:col-span-2 relative rounded-xl order-2 md:order-4"
        >
          <img
            src="/img/services/image5.png"
            alt="Cotton Field"
            className="w-full h-full relative cotton-flower-image1"
          />
          <img
            src="/img/services/image6.png"
            alt="Cotton Plant"
            className="absolute z-10 bottom-0"
          />
        </motion.div>

        {/* ---------- 5. SERVICE ---------- */}
        <motion.div
          variants={fadeInUp}
          className="bg-[#edf3fb] rounded-xl p-16 place-content-center order-5 core-values-box"
        >
          <h3 className="text-2xl font-bold mb-2">
            {pick(data.coreTitle3, activeLang) || "SERVICE"}
          </h3>
          <p className="text-medium text-gray-700">
            {pick(data.coreDes3, activeLang) ||
              "We provide attentive, expert support from inquiry to delivery and beyond."}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
