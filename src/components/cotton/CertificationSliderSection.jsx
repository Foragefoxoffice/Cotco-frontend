import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TitleAnimation from "../common/AnimatedTitle";
import { FiArrowDownRight } from "react-icons/fi";
import { getCottonPage } from "../../Api/api";

export default function CertificationSliderSection() {
  const [certData, setCertData] = useState(null);
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  const controls = useAnimation();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Fetch from cottonMember
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonMember) {
        setCertData(res.data.cottonMember);
      }
    });
  }, []);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? (certData?.cottonMemberImg?.length || 1) - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === (certData?.cottonMemberImg?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (inView && certData?.cottonMemberImg?.length > 0) {
      controls.start({ opacity: 1, x: 0 });
      startAutoSlide();
    } else {
      controls.start({ opacity: 0, x: 100 });
      stopAutoSlide();
    }
    return stopAutoSlide;
  }, [inView, certData?.cottonMemberImg?.length]);

  if (!certData) return null; // don’t render until loaded

  return (
    <section
      ref={sectionRef}
      className="py-20 page-width bg-white overflow-x-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Left Side */}
        <div>
          <TitleAnimation
            text={certData.cottonMemberTitle?.en || "Our Certifications"}
            className="heading mb-6 leading-snug text-black"
            align="center"
            mdAlign="left"
            lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {certData.cottonMemberButtonText?.en &&
            certData.cottonMemberButtonLink && (
              <a
                href={certData.cottonMemberButtonLink}
                className="w-72 mt-6 px-5 py-2 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black hover:text-white transition-all text-xl font-semibold"
                style={{ fontSize: "20px" }}
              >
                {certData.cottonMemberButtonText?.en} <FiArrowDownRight />
              </a>
            )}
        </div>

        {/* Right Side - Slider */}
        <motion.div
          ref={inViewRef}
          animate={controls}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center justify-center"
        >
          {/* Certificate Stack */}
          <div className="relative w-full h-full md:h-100">
            {certData.cottonMemberImg?.map((src, i) => {
              const isActive = i === current;

              return (
                <img
                  key={i}
                  src={getFullUrl(src)}
                  alt={`Certificate ${i + 1}`}
                  className={`absolute certificate-slider-img top-0 left-0 w-[600px] h-[200px] md:h-[450px] rounded-2xl transition-all duration-700 ease-in-out
                    ${
                      isActive
                        ? "z-30 scale-100 rotate-0 opacity-100"
                        : "z-10 opacity-40 scale-[0.95]"
                    }
                  `}
                  style={{
                    transform: isActive
                      ? "rotate(0deg) translateX(0)"
                      : "rotate(-7deg) translateX(25px)",
                  }}
                />
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-33 certification-slider-controls">
            <button
              onClick={() => {
                prevSlide();
                startAutoSlide();
              }}
              aria-label="Previous"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => {
                nextSlide();
                startAutoSlide();
              }}
              aria-label="Next"
              className="w-10 h-10 rounded-full bg-[#0A1C2E] text-white flex items-center justify-center hover:bg-[#122b45] transition-colors duration-300"
            >
              <FaArrowRight />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
