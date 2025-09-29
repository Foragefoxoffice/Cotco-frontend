import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";

const expertiseData = [
  {
    year: "2016",
    description:
      "COTCO launched as a cotton trading agent for reputable international suppliers such as Viterra B.V. and Devcot S.A., establishing our initial sourcing network.",
    image: "/img/timeline/2016.png",
  },
  {
    year: "2019",
    description:
      "Became agency of Louis Dreyfus Company (LDC) for premium cotton supply; joined and maintained membership in the International Cotton Association (ICA), affirming global credibility.",
    image: "/img/timeline/2019.png",
  },
  {
    year: "2021",
    description:
      "Expanded business into yarn supply solutions for Vietnamese spinning mills.",
    image: "/img/timeline/2021.png",
  },
  {
    year: "2022",
    description:
      "Officially appointed as Lakshmi Machine Works (LMW) distributor in Vietnam, adding advanced spinning machinery to our offerings.",
    image: "/img/timeline/2022.png",
  },
  {
    year: "2023",
    description:
      "Further extended supply network through collaborations with Ecom Agroindustrial Corp and Reinhart & Co., reinforcing our role as a trusted textile partner in Vietnam.",
    image: "/img/timeline/2023.png",
  },
];

export default function PinnedExpertiseTimeline() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const stepCount = expertiseData.length;

  const scrollSteps = useTransform(scrollYProgress, (progress) => {
    return Math.min(Math.floor(progress * stepCount), stepCount - 1);
  });

  useEffect(() => {
    return scrollSteps.on("change", (latest) => {
      if (latest !== currentIndex) {
        setPrevIndex(currentIndex);    // keep old image for base
        setCurrentIndex(latest);       // sync year + description
      }
    });
  }, [scrollSteps, currentIndex]);

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-[#E7EDF5]">
     
      {/* Desktop Layout */}
      <div className="hidden md:grid sticky top-0 h-screen grid-cols-1 md:grid-cols-2 gap-20 justify-center w-full px-6 md:pr-0 md:px-20">
        {/* Left: Years + Description */}
        <div className="flex flex-col justify-center space-y-4 h-full py-20">
          <div className="space-y-4">
             <h3 className="absolute left-[-100px] top-3/6 text-[#19191940] z-2 rotate-[270deg] text-6xl font-bold  text-center">OUR HISTORY</h3>
            {expertiseData.slice(0, currentIndex + 1).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="text-3xl text-end font-semibold text-[#000]"
              >
                {item.year}
              </motion.div>
            ))}
          </div>

          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg text-end text-black max-w-2xl ml-auto font-normal pt-6 pl-16"
          >
            {expertiseData[currentIndex].description}
          </motion.p>
        </div>

        {/* Right: Static old image + new sliding image */}
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={expertiseData[prevIndex].image}
            alt={expertiseData[prevIndex].year}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <AnimatePresence mode="wait">
            <motion.img
              key={expertiseData[currentIndex].image}
              src={expertiseData[currentIndex].image}
              alt={expertiseData[currentIndex].year}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden sticky top-0 h-screen w-full overflow-hidden">
        <img
          src={expertiseData[prevIndex].image}
          alt={expertiseData[prevIndex].year}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <AnimatePresence mode="wait">
          <motion.img
            key={expertiseData[currentIndex].image}
            src={expertiseData[currentIndex].image}
            alt={expertiseData[currentIndex].year}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        </AnimatePresence>

        {/* Overlay */}
        <motion.div
          key={`overlay-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-black/40 z-20"
        />

        {/* Top Text Left */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute top-24 md:top-10 left-10 md:right-6 z-30"
        >
          <p className="text-white font-semibold text-3xl uppercase mb-2">Our History</p>
        </motion.div>

        {/* Top Text Right */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="absolute top-24 md:top-10 right-6 z-30"
        >
          <p className="text-white font-bold text-2xl">{expertiseData[currentIndex].year}</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute bottom-24 md:bottom-10  right-0 p-6 z-30"
        >
          <p className="text-white text-sm leading-relaxed">
            {expertiseData[currentIndex].description}
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}
