import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getCottonPage } from "../../Api/api";

export default function CottonTrustSection() {
  const [trust, setTrust] = useState(null);

  // fetch trust data
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonTrust) {
        setTrust(res.data.cottonTrust);
      }
    });
  }, []);

  if (!trust) return null; // ⏳ don't render until data arrives

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  return (
    <section className="pt-20 page-width bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Left Text + Logos */}
        <div>
          <TitleAnimation
            text={
              trust.cottonTrustTitle?.en || "GROW IN TRUST, QUALITY AND SERVICE"
            }
            className="heading"
            align="center"
            mdAlign="left"
            lgAlign="right"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          <p className="text-gray-600 mb-6 max-w-lg">
            {trust.cottonTrustDes?.en ||
              "Besides marketing cotton from major production regions worldwide, COTCO enhances product value through stable quality control and professional logistics, ensuring efficient supply."}
          </p>

          {/* Logos (multiple) */}
          <div className="flex flex-wrap items-center gap-6">
            {trust.cottonTrustLogo?.length > 0 ? (
              trust.cottonTrustLogo.map((logo, idx) => (
                <img
                  key={idx}
                  src={getFullUrl(logo)}
                  alt={`Trust Logo ${idx + 1}`}
                  className="w-24 h-24 object-contain border-2 border-[#74AFDF66] p-2 rounded-md bg-white"
                />
              ))
            ) : (
              <p className="text-gray-400">No trust logos added</p>
            )}
          </div>
        </div>

        {/* Right Trust Image */}
        <div className="flex justify-center md:justify-center">
          {trust.cottonTrustImg ? (
            <img
              src={getFullUrl(trust.cottonTrustImg)}
              alt="Trust Image"
              className="w-4/7 h-auto object-contain"
            />
          ) : (
            <div className="w-64 h-40 flex items-center justify-center border border-dashed text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
