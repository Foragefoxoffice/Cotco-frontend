import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getMachineCMSPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

export default function MachinesBenefits() {
  const [machineData, setMachineData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMachineCMSPage();
        if (res.data?.machinePage) setMachineData(res.data.machinePage);
      } catch (err) {
        console.error("❌ Failed to load Machine CMS:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";
    const saved = localStorage.getItem("preferred_lang");
    setActiveLang(saved === "vi" || saved === "en" ? saved : detectLang());
  }, []);

  if (!machineData)
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        Loading machine content...
      </div>
    );

  const introText = machineData?.introSection?.introDescription?.[activeLang];
  const benefitTitle = machineData?.benefitsSection?.benefitTitle?.[activeLang];
  const benefitBullets =
    machineData?.benefitsSection?.benefitBullets?.[activeLang] || [];
  const benefitImage = machineData?.benefitsSection?.benefitImage
    ? getFullUrl(machineData.benefitsSection.benefitImage)
    : null;

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="page-width px-4 md:px-6">
        {/* ✅ Intro Section */}
        {introText && (
          <p className="md:mb-32 mb-10 text-[15px] leading-7 text-slate-600 md:text-base">
            {introText}
          </p>
        )}

        {/* ✅ Benefits Section */}
        <div className="relative mt-16">
          <div className="relative z-10 w-full md:max-w-[880px] rounded-2xl bg-[#163A63] p-6 pr-24 text-white shadow-xl md:p-8 md:pr-44">
            {benefitTitle && (
              <TitleAnimation
                text={benefitTitle}
                className="mb-4 text-xl font-extrabold tracking-wide md:text-3xl"
                align="left"
                delay={0.05}
                stagger={0.05}
                once
              />
            )}

            {benefitBullets.length > 0 ? (
              <ul className="space-y-2 text-sm leading-6 md:text-[15px]">
                {benefitBullets.map((b, i) => (
                  <li key={i} className="pl-4 relative">
                    <span className="absolute left-0 top-2 block h-2 w-2 rounded-full bg-sky-200" />
                    <span className="text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70 text-sm italic">
                No benefit points added yet.
              </p>
            )}
          </div>

          {/* ✅ Benefit Image */}
          {benefitImage ? (
            <div className="pointer-events-none md:absolute right-0 md:top-1/2 z-20 md:-translate-y-1/2">
              <img
                src={benefitImage}
                alt="Machine Benefit"
                className="w-[320px] md:w-[420px] lg:w-[520px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
              />
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-6">
              No benefit image uploaded yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
