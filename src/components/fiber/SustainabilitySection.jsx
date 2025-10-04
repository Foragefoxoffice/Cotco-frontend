import React, { useEffect, useState } from "react";
import { FaRecycle, FaDroplet, FaEarthAmericas } from "react-icons/fa6";
import TitleAnimation from "../common/AnimatedTitle";
import { getFiberPage } from "../../Api/api";

const SustainabilitySection = () => {
  const [data, setData] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  useEffect(() => {
    getFiberPage().then((res) => {
      if (res.data?.fiberSustainability) {
        setData(res.data.fiberSustainability);
      }
    });
  }, []);

  if (!data) return null; // wait until loaded

  return (
    <section className="bg-white page-width pt-6 md:pt-20">
      <div className="mx-auto text-center">
        {/* Label */}
        <span className="text-sm font-semibold text-black px-4 py-1 bg-blue-100 rounded-full mb-4 inline-block">
          {data.fiberSustainabilitySubText?.en || "Sustainability"}
        </span>

        {/* Title */}
        <TitleAnimation
          text={data.fiberSustainabilityTitle?.en || "ECO-FRIENDLY FROM PRODUCTION TO DISPOSAL"}
          className="heading mb-4"
          align="center"
          delay={0.05}
          stagger={0.05}
          once={true}
        />

        {/* Description */}
        <p className="text-gray-600 text-lg mb-10">
          {data.fiberSustainabilityDes?.en ||
            "Our viscose fibers are designed with the environment in mind at every stage of their lifecycle."}
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="h-full">
            <img
              src={getFullUrl(data.fiberSustainabilityImg) || "/img/fiber/eco.jpg"}
              alt="Eco Fabrics"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>

          {/* Cards (Subtitles + Descriptions) */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-left flex items-start gap-4 hover:shadow-sm hover:border hover:border-[#9ABFE1]">
              <FaRecycle className="text-blue-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {data.fiberSustainabilitySubTitle1?.en || "Biodegradable"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {data.fiberSustainabilitySubDes1?.en ||
                    "Naturally breaks down without leaving microplastics in the environment after disposal."}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-sm text-left flex items-start gap-4 hover:shadow-sm hover:border hover:border-[#9ABFE1]">
              <FaDroplet className="text-blue-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {data.fiberSustainabilitySubTitle2?.en || "Efficient Production"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {data.fiberSustainabilitySubDes2?.en ||
                    "Manufactured using increasingly energy- and water-efficient processes to minimize environmental impact."}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-sm text-left flex items-start gap-4 hover:shadow-sm hover:border hover:border-[#9ABFE1]">
              <FaEarthAmericas className="text-blue-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {data.fiberSustainabilitySubTitle3?.en || "Sustainable Fashion"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {data.fiberSustainabilitySubDes3?.en ||
                    "Supports the global shift towards greener fashion alternatives without compromising quality."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
