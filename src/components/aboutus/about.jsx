import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

export default function AboutUsSection() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getAboutPage()
      .then((res) => {
        if (res.data?.aboutOverview) {
          setOverview(res.data.aboutOverview);
        }
      })
      .catch((err) => console.error("Failed to load about overview:", err));
  }, []);

  if (!overview) return null; // Wait until API loads

  return (
    <section className="bg-white">
      <div className="grid grid-cols-12 gap-8 md:gap-18 items-start page-width pt-6 md:pt-20">
        {/* LEFT: Image */}
        <div className="col-span-12 md:col-span-5">
          <div className="aspect-square w-full max-w-[420px] md:max-w-full rounded-[24px] overflow-hidden ring-1 ring-black/5 shadow-sm">
            {overview.aboutOverviewImg ? (
              <img
                src={overview.aboutOverviewImg}
                alt={overview.aboutOverviewTitle?.en || "About Overview"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Text */}
        <div className="col-span-12 md:col-span-7 grid h-full place-content-center">
          <TitleAnimation
            text={overview.aboutOverviewTitle?.en || "About Us"}
            className="heading uppercase"
            align="center"
            mdAlign="left"
            lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          <div className="mt-4 space-y-4 text-slate-700 leading-relaxed max-w-2xl">
            <p className="font-medium">
              {overview.aboutOverviewDes?.en ||
                "Default description goes here..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
