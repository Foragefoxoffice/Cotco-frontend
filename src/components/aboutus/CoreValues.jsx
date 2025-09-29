import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api"; // adjust path

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
        {/* 1. Section Title */}
        <motion.div
          variants={fadeInUp}
          className="relative bg-[#edf3fb] rounded-xl md:p-20 p-6 flex items-center justify-center text-center order-1"
        >
          <TitleAnimation
            text={data.coreTitle?.en || "CORE VALUES"}
            className="heading"
            align="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
        </motion.div>

        {/* 2. Image */}
        <motion.div
          variants={fadeInUp}
          className="md:col-span-2 relative rounded-xl order-2 md:order-4"
        >
          <img
            src={data.coreImage || "/img/services/image5.png"}
            alt="Core Values Background"
            className="w-full h-full relative cotton-flower-image1"
          />
        </motion.div>

        {/* 3–6 Core Values */}
        {[1, 2, 3, 4].map((i, idx) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className={`bg-[#edf3fb] rounded-xl p-16 place-content-center core-values-box order-${
              idx + 3
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">
              {data[`coreTitle${i}`]?.en || `Core Value ${i}`}
            </h3>
            <p className="text-medium text-gray-700">
              {data[`coreDes${i}`]?.en || ""}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
