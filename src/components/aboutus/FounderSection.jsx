import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TitleAnimation from "../common/AnimatedTitle";

export default function FounderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const fadeLeft = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const fadeRight = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="bg-white">
      <div
        ref={ref}
        className=" mx-auto md:grid md:grid-cols-12 md:gap-10 items-center page-width pt-6 md:pt-20"
      >
        {/* LEFT: Founder text */}
        <motion.div
          className="col-span-12 md:col-span-6"
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={fadeLeft}
        >
         
           <TitleAnimation
            text={"Founder"}
            className="heading uppercase "
             align="center" mdAlign="left" lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          
          <h3 className="mt-1 text-xl md:text-2xl font-semibold text-slate-800 text-center md:text-left">
            Huan Dinh
          </h3>

          <div className="relative md:w-6/12 block md:hidden">
             <motion.div
            className="absolute z-1 md:right-[-16px]  top-10 w-[60%] h-[40%] bg-[#11456C] rounded-[28px] shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } } : {}}
          />

          {/* Main portrait */}
          <motion.img
            src="/img/about/founder.png" // transparent PNG looks best; replace path
            alt="Founder portrait"
            className="relative z-10  rounded-[22px] object-cover"
            initial={{ opacity: 0, y: 30 }}
            animate={
              inView
                ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  }
                : {}
            }
            whileHover={{ y: -4 }}
          />

         </div>

          <ul className="mt-5 space-y-2 text-slate-700 leading-relaxed list-disc pl-5 ">
            <li>
              Graduated with a Bachelor’s degree in Business English from the
              University of Finance and Marketing, Ho Chi Minh City, in 2004.
            </li>
            <li>
              Earned a Bachelor’s degree in Logistics and Supply Chain
              Management from SIMM, Singapore, in 2009.
            </li>
            <li>
              Obtained the Agent Training Certificate from the International
              Cotton Association in 2012.
            </li>
            <li>Over 18 years of experience in the cotton and yarn trading industry.</li>
            <li>
              One of the pioneering Vietnamese women to deliver a presentation
              at the ICA, sharing perspectives on Vietnam’s cotton market.
            </li>
          </ul>
        </motion.div>

        {/* RIGHT: Collage (3 images + color card) */}
        <motion.div
          className="hidden md:flex w-full  md:gap-10 gap-6 col-span-12 md:col-span-6 relative  "
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={fadeRight}
        >
         <div className="relative md:w-6/12 ">
             <motion.div
            className="absolute z-1 md:right-[-16px]  top-10 w-[60%] h-[40%] bg-[#11456C] rounded-[28px] shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } } : {}}
          />

          {/* Main portrait */}
          <motion.img
            src="/img/about/founder.png" // transparent PNG looks best; replace path
            alt="Founder portrait"
            className="relative z-10  rounded-[22px] object-cover"
            initial={{ opacity: 0, y: 30 }}
            animate={
              inView
                ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  }
                : {}
            }
            whileHover={{ y: -4 }}
          />

         </div>
         <div className="relative grid md:gap-8 gap-6 place-content-center md:w-6/12">
{/* Right column images */}
          <motion.img
            src="/img/about/founder1.png" // replace
            alt="Team"
            className=" rounded-[18px] object-cover shadow-lg ring-1 ring-black/5 bg-white"
            initial={{ opacity: 0, x: 30, y: -10 }}
            animate={
              inView
                ? { opacity: 1, x: 0, y: 0, transition: { delay: 0.35, duration: 0.55 } }
                : {}
            }
            whileHover={{ scale: 1.02 }}
          />
          <motion.img
            src="/img/about/founder2.png" // replace
            alt="Women in Cotton"
            className="rounded-[18px] object-cover shadow-lg ring-1 ring-black/5 bg-white"
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={
              inView
                ? { opacity: 1, x: 0, y: 0, transition: { delay: 0.45, duration: 0.55 } }
                : {}
            }
            whileHover={{ scale: 1.02 }}
          />
         </div>
        
        </motion.div>
      </div>
    </section>
  );
}
