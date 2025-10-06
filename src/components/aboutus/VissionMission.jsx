import React, { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import SlideIn from "../common/SlideIn";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

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

function Stat({
  value,
  label,
  suffix = "",
  prefix = "",
  duration = 1200,
  className = "",
}) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const v = useCountUp({ end: value, duration, inView });
  const display = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;

  return (
    <div ref={ref} className={className}>
      <div className="grid items-baseline gap-4">
        <span className="text-4xl md:text-5xl font-extrabold leading-none">
          {display}
        </span>
        <span className="text-[11px] md:text-xs uppercase tracking-wide text-white/80 max-w-[10rem]">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ---------- section ---------- */
export default function VissionMission() {
  const [data, setData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect and react to <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch Mission & Vision data
  useEffect(() => {
    getAboutPage()
      .then((res) => {
        if (res.data?.aboutMissionVission) {
          setData(res.data.aboutMissionVission);
        }
      })
      .catch((err) => console.error("Failed to fetch mission & vision:", err));
  }, []);

  // ✅ Helper to pick multilingual content safely
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  if (!data) return null;

  const blocks = [1, 2, 3];

  return (
    <section className="bg-white">
      <div className="page-width pt-6 md:pt-20">
        <div className="relative rounded-[22px] md:rounded-[28px] bg-[#0E3E62] text-white shadow-xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 p-6 sm:p-8 md:p-12">
            {/* ---------- LEFT: title + blurbs ---------- */}
            <SlideIn
              direction="left"
              className="col-span-12 md:col-span-7 lg:col-span-8 md:pr-20"
            >
              <div>
                <TitleAnimation
                  text={
                    pick(data.aboutMissionVissionTitle, activeLang) ||
                    "Mission & Vision"
                  }
                  className="font-extrabold text-white md:text-4xl text-3xl"
                  align="left"
                  delay={0.05}
                  stagger={0.05}
                  once={true}
                />

                <div className="mt-6 space-y-6">
                  {blocks.map((i) => (
                    <div key={i}>
                      <h3 className="uppercase text-md font-bold tracking-wider">
                        {pick(data[`aboutMissionVissionSubhead${i}`], activeLang) ||
                          `Subhead ${i}`}
                      </h3>
                      <p className="mt-2 text-[16px] text-white/90 leading-relaxed">
                        {pick(data[`aboutMissionVissionDes${i}`], activeLang) || ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>

            {/* ---------- RIGHT: metrics ---------- */}
            <SlideIn
              direction="right"
              className="col-span-12 md:col-span-5 lg:col-span-4"
            >
              <div className="grid gap-y-10 md:gap-y-12">
                {blocks.map((i) => (
                  <Stat
                    key={i}
                    value={data[`aboutMissionVissionBoxCount${i}`] || 0}
                    suffix={i === 3 ? "%+" : "+"}
                    label={
                      pick(data[`aboutMissionBoxDes${i}`], activeLang) || ""
                    }
                    className="col-span-1 counters"
                  />
                ))}
              </div>
            </SlideIn>
          </div>

          {/* ---------- small top accent ---------- */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-24 bg-white/60 rounded-b-full" />
        </div>
      </div>
    </section>
  );
}
