// components/machines/TextileMachines.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function TextileMachines({ category }) {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const controls = useAnimation();
  const shadowControls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start({
        right: isMobile ? "-23px" : "0%",
        top: isMobile ? "115%" : "110%",
        width: isMobile ? "50%" : "26%",
        opacity: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
      });
      shadowControls.start({
        opacity: 0.3,
        scale: 1,
        transition: { duration: 1, ease: "easeOut" },
      });
      textControls.start("visible");
    } else {
      controls.start({
        right: "-200px",
        top: "50%",
        width: isMobile ? "239px" : "240px",
        opacity: 1,
        transition: { duration: 0.8, ease: "easeIn" },
      });
      shadowControls.start({
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.8, ease: "easeIn" },
      });
      textControls.start("hidden");
    }
  }, [isInView, isMobile, controls, shadowControls, textControls]);

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <main>
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-white hero md:pt-0 overflow-x-hidden overflow-hidden">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={
            scrolled ? { scale: 0.95, opacity: 0.9 } : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`relative z-10 transition-all duration-500 ease-out ${
            scrolled ? "rounded-2xl shadow-lg" : ""
          }`}
        >
          <motion.div
            className="w-full flex justify-center relative"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            {/* Dynamic Heading */}
            <div className="absolute z-30 bottom-[60px] left-6 md:left-16">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl md:text-8xl uppercase text-white font-bold cotton-section-heading"
              >
                {category?.name?.en || "Machines"}
              </motion.h1>
            </div>

            {/* Background Image (category.image) */}
            <motion.img
              src={
                category?.image
                  ? `${category.image}`
                  : "/img/textiles/textiles-bg.jpg"
              }
              alt={category?.name?.en || "Machines"}
              className="w-full h-screen object-cover rounded-xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            />

            {/* Dark Overlay */}
            <div
              className={`absolute inset-0 bg-black/40 z-10 ${
                scrolled ? "rounded-3xl " : "rounded-none"
              }`}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= DESCRIPTION + IMAGE2 SECTION ================= */}
      <section className="page-width py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Description */}
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {category?.description?.en ||
                "Description will be available soon for this machine."}
            </p>
          </div>

          {/* Right Side - Image2 */}
          <div className="flex justify-center">
            <img
              src={
                category?.image2
                  ? `${category.image2}`
                  : "/img/textiles/category.png" // ✅ fallback default
              }
              alt={`${category?.name?.en || "Machine"} image`}
              className="max-w-sm md:max-w-md object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
