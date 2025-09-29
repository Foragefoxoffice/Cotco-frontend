import React, { useEffect, useState } from "react";
import { FiArrowDownRight } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api"; // adjust path

const WhoWeAreSection = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.whoWeAreSection) {
        setData(res.data.whoWeAreSection);
      }
    });
  }, []);

  if (!data) return null;

  return (
    <section className="w-full bg-white page-width md:pt-20 pt-6">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side - Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={data.whoWeArebannerImage || "/img/home/who.png"}
            alt="Who We Are"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Right Side - Text */}
        <div className="w-full md:w-1/2 md:text-left">
          <TitleAnimation
            text={data.whoWeAreHeading?.en || "WHO WE ARE?"}
            className="heading"
            align="left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
            {data.whoWeAredescription?.en ||
              "From Raw Materials to Technology – Our Journey to Elevate the Value of Textiles"}
          </p>

          {data.whoWeArebuttonLink?.en && (
            <a
              href={data.whoWeArebuttonLink.en}
              className="w-36 px-5 py-2 rounded-full flex gap-2 items-center border border-gray-400 hover:bg-black hover:text-white transition-all text-sm font-semibold"
            >
              {data.whoWeArebuttonText?.en || "SEE MORE"} <FiArrowDownRight />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
