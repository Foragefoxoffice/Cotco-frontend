import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import SlideIn from "../common/SlideIn";
import TitleAnimation from "../common/AnimatedTitle";

/* ---------- small count-up utility ---------- */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function useCountUp({ end = 0, duration = 1200, start = 0, inView = false }) {
  const [val, setVal] = useState(start);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let startTs;

    const step = (ts) => {
      if (startTs == null) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const next = start + (end - start) * easeOutCubic(p);
      setVal(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start, inView]);

  return val;
}

function Stat({ value, label, suffix = "", prefix = "", duration = 1200, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const v = useCountUp({ end: value, duration, inView });
  const display = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;

  return (
    <div ref={ref} className={className}>
      <div className="grid items-baseline gap-4">
        <span className="text-4xl md:text-5xl font-extrabold leading-none">{display}</span>
        <span className="text-[11px] md:text-xs uppercase tracking-wide text-white/80 max-w-[10rem]">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ---------- section ---------- */
export default function VissionMission() {
  return (
    <section className="bg-white">
      <div className="page-width pt-6 md:pt-20">
        <div className="relative rounded-[22px] md:rounded-[28px] bg-[#0E3E62] text-white shadow-xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 p-6 sm:p-8 md:p-12">
            {/* LEFT: title + blurbs */}
            <SlideIn direction="left" className="col-span-12 md:col-span-7 lg:col-span-8 md:pr-20">
              <div>

                        <TitleAnimation
                            text={"VISSION & MISSION "}
                            className="font-extrabold text-white md:text-4xl text-3xl "
                            align="left"
                            delay={0.05}
                        stagger={0.05}   // slower/faster per letter
                        once={true}
                        
                      />
                      
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="uppercase text-sm font-bold tracking-wider">Developed From Trust</h3>
                    <p className="mt-2 text-[15px] text-white/90 leading-relaxed ">
                      We build lasting and transparent relationships with suppliers and customers worldwide,
                      becoming a reliable partner in the fields of cotton, yarn, and machinery.
                    </p>
                  </div>

                  <div>
                    <h3 className="uppercase text-sm font-bold tracking-wider">Quality</h3>
                    <p className="mt-2 text-[15px] text-white/90 leading-relaxed ">
                      We are committed to supplying and distributing premium products, ensuring our customers
                      always receive the highest-quality raw materials and equipment.
                    </p>
                  </div>

                  <div>
                    <h3 className="uppercase text-sm font-bold tracking-wider">Service</h3>
                    <p className="mt-2 text-[15px] text-white/90 leading-relaxed ">
                      We guide customers with expert advice to choose the best in cotton, yarn, and machinery,
                      backed by professional logistics that ensure smooth shipment tracking from start to finish.
                    </p>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* RIGHT: metrics (layout like the image) */}
            <SlideIn direction="right" className="col-span-12 md:col-span-5 lg:col-span-4">
              {/* 2-column grid so 18+ and 60%+ are on the left, 1,000+ centered on the right */}
              <div className="grid  gap-y-10 md:gap-y-12">
                <Stat
                  value={18}
                  suffix="+"
                  label="Years of experience"
                  className="col-span-1 counters"
                />

                <Stat
                  value={1000}
                  suffix="+"
                  label="Customer market share in Vietnam"
                  className="col-span-1 counters "
                />

                <Stat
                  value={60}
                  suffix="%+"
                  label="Years of experience"
                  className="col-span-1 counters"
                />

                {/* spacer to balance grid on md+ (optional) */}
                <div className="hidden md:block" />
              </div>
            </SlideIn>
          </div>

          {/* small top accent like the mock */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-24 bg-white/60 rounded-b-full" />
        </div>
      </div>
    </section>
  );
}
