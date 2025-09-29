import React from "react";
import TitleAnimation from "../common/AnimatedTitle";

export default function Certification() {
  const logos = [
    "/img/services/certificate1.png",
    "/img/services/certificate2.png",
    "/img/services/certificate3.png",
    "/img/services/certificate4.png",
  ];

  return (
    <section className="md:pt-20 pt-6 bg-white">
      <div className=" page-width">
        {/* Heading */}
        <div className="text-center mb-12">

       
           <TitleAnimation
            text={"STRATEGIC ALLIANCES"}
            className="heading uppercase "
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          
        </div>

        {/* Logo Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {logos.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Certification ${index + 1}`}
              className="h-30 w-[250px] object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
