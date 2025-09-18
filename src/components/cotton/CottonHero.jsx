import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function CottonHero() {
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
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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
        top: isMobile ? "125%" : "110%",
        width: isMobile ? "50%" : "30%",
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
  }, [isInView, controls, shadowControls, textControls, isMobile]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
  };

  return (
    <section className="relative bg-white hero overflow-hidden">
      {/* Video Section with Scroll Effect */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={
          scrolled ? { scale: 0.9, opacity: 0.9 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : ""
        }`}
      >
        {/* Top Hero Video */}
        <motion.div
          className="w-full flex justify-center"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <div className="absolute z-10 bottom-[190px] left-6 md:left-15">
            <h1 className="text-9xl text-white font-bold cotton-section-heading">
              COTTON
            </h1>
            <p className="text-white text-xl pl-6.5 pt-3 cotton-section-subheading">
              Empowering Vietnam’s Textile Industry Since 2016
            </p>
          </div>
          {/* Desktop Video */}
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/img/fallback/cotton.jpg"
            src="/video/cotton.webm"
            className={`w-full hidden md:block ${
              scrolled ? "rounded-3xl " : "rounded-none"
            }`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          />
          {/* Mobile Video */}
          <div className="relative w-full h-screen block md:hidden">
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
        poster="/img/fallback/cotton.jpg"
              src="/video/cotton-mobile.webm"
              className={`absolute top-0 left-0 w-screen h-screen object-cover  ${
                scrolled ? "rounded-xl " : "rounded-none"
              }`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Left Static Cotton Bubble */}
          <motion.img
            src="/img/cotton/cotton.png"
            alt=""
            className="absolute left-[-11%] top-[25%] -translate-y-1/2 w-60 hidden md:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          />

          {/* Right Animated Cotton Bubble with Shadow */}
          <motion.div
            initial={{ position: "absolute", right: "-200px", top: "70%" }}
            animate={controls}
            className="hidden md:block"
            style={{ position: "absolute" }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/img/cotton/cotton.png"
              alt="Cotton Ball"
              className="rounded-xl w-[240px] sm:w-[200px] md:w-[180px] lg:w-[220px] xl:w-[280px] 2xl:w-[320px] "
            />
            <motion.div
              animate={shadowControls}
              className="w-[60%] h-6 bg-black rounded-full mx-auto mt-[-12px] blur-md"
            />
          </motion.div>

          {/* Mobile-only Animated Cotton Bubble */}
          <motion.div
            initial={{ position: "absolute", right: "-200px", top: "70%" }}
            animate={controls}
            className="block md:hidden"
            style={{ position: "absolute" }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/img/cotton/cotton.png"
              alt="Cotton Ball"
              className="rounded-xl w-full"
            />
            <motion.div
              animate={shadowControls}
              className="w-full h-6 bg-black rounded-full mx-auto mt-[-12px] blur-md"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Text + Image Target Section (unaffected by scroll) */}
      <div className="page-width md:pt-20 md:pb-30 p-6">
        {/* <motion.h1
          className="text-2xl text-center md:text-3xl font-semibold mb-4 text-[#1C1C1C]"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          COTTON
        </motion.h1> */}

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto px-4 mt-10 items-center"
        >
          <motion.div
            initial="hidden"
            animate={textControls}
            variants={textVariants}
          >
            <motion.p
              className="text-[#4B4B4B] mb-6 pr-30 md:pr-0"
              variants={paragraphVariants}
            >
              COTCO is a partner supplying sustainable natural raw cotton from
              major cotton-growing regions such as the USA, Australia, and
              Brazil, while supporting mills across Vietnam.
            </motion.p>
            <motion.p
              className="text-[#4B4B4B] mb-6 pr-30 md:pr-0"
              variants={paragraphVariants}
            >
              In addition to introducing cotton from reputable sources, COTCO
              focuses on consistent quality control and providing logistics
              services, helping customers access supply and save time.
            </motion.p>
            <motion.p
              className="text-[#4B4B4B] mb-6"
              variants={paragraphVariants}
            >
              We aim for long-term, transparent, and effective cooperation,
              meeting the demand for high-quality cotton and supporting
              sustainable production.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex justify-center items-center md:h-[300px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.4, duration: 0.8 },
            }}
          />
        </div>
      </div>
    </section>
  );
}
