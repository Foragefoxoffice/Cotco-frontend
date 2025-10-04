import React, { useEffect, useState } from "react";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

export default function Certification() {
  const [logos, setLogos] = useState([]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAboutPage();
        if (res.data?.aboutAlliances?.aboutAlliancesImg) {
          setLogos(res.data.aboutAlliances.aboutAlliancesImg);
        }
      } catch (err) {
        console.error("Failed to fetch alliances:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="md:pt-20 pt-6 bg-white">
      <div className="page-width">
        {/* Heading */}
        <div className="text-center mb-12">
          <TitleAnimation
            text={"STRATEGIC ALLIANCES"}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
        </div>

        {/* Logo Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {logos.length > 0 ? (
            logos.map((src, index) => (
              <img
                key={index}
                src={getImageUrl(src)}
                alt={`Alliance ${index + 1}`}
                className="h-30 w-[250px] object-contain"
              />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">
              No alliances uploaded yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
