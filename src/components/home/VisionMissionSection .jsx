import React from "react";
import SlideIn from "../common/SlideIn";

const VisionMissionSection = () => {
  return (
    <section className="py-16 bg-white vision-mission-section">
      <div className="md:grid flex flex-col-reverse grid-cols-1 md:grid-cols-2 items-center">
        {/* Left Text Content */}
        <div className="text-white w-full flex-1 z-10 opacity-90 bg-[#143A59] p-10 md:p-20 pr-10 md:pr-30 vision-mission">
       <SlideIn  direction="left" >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">VISSION & MISSION</h2>
          <p className="mb-4">
            Make an impression with non-stop business, increase customer satisfaction,
            and aim first through professional sales and logistics products and services.
          </p>
          <p className="mb-6">
            Deliver added value to customers by providing complete information,
            competitive solutions through excellent sales and logistics guidance,
            adapting and responding to market capacity needs.
          </p>
          <button className="border text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#0D3B66] transition-all">
            Learn More →
          </button>
        </SlideIn>
        </div>
 

        {/* Right Video Content */}
        <SlideIn direction="right" className="flex-1 w-[90%] md:w-5/6 pl-0 ml-[-80px] vission-mission-video">
          <video
            className="w-full h-auto"
            playsInline
            loop
            autoPlay
            muted
            src="/video/hero.mp4"
          />
        </SlideIn>
      </div>
    </section>
  );
};

export default VisionMissionSection;
