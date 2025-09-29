import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function FiberHero() {
  const [isMobile, setIsMobile] = useState(false);
  const [bubbleRotation, setBubbleRotation] = useState("-16deg");
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
      setBubbleRotation("0deg");
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
      setBubbleRotation("-16deg");
    }
  }, [isInView, isMobile, controls, shadowControls, textControls]);

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
          scrolled ? { scale: 0.89, opacity: 0.9 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl shadow-2xl" : "rounded-none"
        }`}
      >
        <div className="absolute z-10 bottom-[190px] left-6 md:left-15">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-9xl text-white font-bold cotton-section-heading"
          >
            FIBER
          </motion.h1>
          <p className="text-white text-xl pl-6.5 pt-3 cotton-section-subheading">
            Empowering Vietnam’s Textile Industry Since 2016
          </p>
        </div>
        {/* Top Hero Video */}
        <motion.div
          className="w-full flex justify-center"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          {/* Desktop Video */}
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
        poster="/img/fallback/fiber.jpg"
            src="/video/fiber.webm"
            className={`w-full rounded-xl  hidden md:block  ${
              scrolled ? "rounded-3xl " : "rounded-none"
            }`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          />

          {/* Mobile Fullscreen Video */}
          <div className="relative w-full h-screen block md:hidden">
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
        poster="/img/fallback/fiber.jpg"
              src="/video/fiber-mobile.webm"
              className={`absolute top-0 left-0 w-screen h-screen object-cover  ${
                scrolled ? "rounded-xl " : "rounded-none"
              }`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Animated Bubble (shared for both) */}
          {/* Animated Bubble (shared for both) */}
<motion.div
  initial={{
    position: "absolute",
    right: "-200px",
    top: "70%",
    rotate: bubbleRotation,
  }}
  animate={controls}
  style={{ rotate: bubbleRotation, position: "absolute" }}
  whileHover={{ scale: 1.05 }}
>
  <img
    src="/img/fiber/fiber.png"
    alt="fiber Ball"
    className="rounded-xl w-[240px] sm:w-[200px] md:w-[180px] lg:w-[220px] xl:w-[280px] 2xl:w-[320px]"
  />
  <motion.div
    animate={shadowControls}
    className="w-[80%] h-6 bg-black rounded-md mt-[-10px] blur-xl"
  />
</motion.div>

        </motion.div>
      </motion.div>

      {/* Text + Info Section (unaffected by scroll) */}
      <div className="page-width pt-6 md:pt-10">


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
              To promote sustainability in Vietnam’s textile and nonwoven sectors, COTCO expanded into distributing viscose and specialty fibers for nonwovens through a partnership with Birla Cellulose.
            </motion.p>
        <motion.h3
          className="text-2xl  md:text-md font-semibold mb-4 text-[#1C1C1C]"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          The role of viscose fiber in yarn and textile manufacturing
        </motion.h3>
         
            <motion.p
              className="text-[#4B4B4B] mb-6  md:pr-0"
              variants={paragraphVariants}
            >
             In yarn and fabric production, viscose fiber plays a vital role:
            </motion.p>
             <motion.ul
        className=" text-[#4B4B4B] space-y-2 pl-6"
        variants={paragraphVariants}
      >
        <li className="relative before:absolute before:left-[-20px] before:content-['-']">Easily spun into various yarn types such as ring-spun, siro-spun, and vortex, suitable for both weaving and knitting applications.</li>
        <li className="relative before:absolute before:left-[-20px] before:content-['-']">An ideal choice for a wide range of fabrics, including shirts, dresses, sleepwear, linings, as well as home textiles, technical textiles, and medical supplies</li>
        <li className="relative before:absolute before:left-[-20px] before:content-['-']">Easily blended with other fibers such as polyester, cotton, or spandex to enhance durability, drape, and the overall value of the final product.</li>
      </motion.ul>
          </motion.div>

          {/* Placeholder Right Column */}
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
