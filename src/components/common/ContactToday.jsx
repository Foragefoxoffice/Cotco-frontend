import React from "react";

const ContactToday = () => {
  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden ">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/home/upperFooter.jpg')", backgroundAttachment: "fixed"}}
      ></div>

      <div style={{backgroundColor: "#1F90D8CC"}} className="absolute inset-0 bg-opacity-60"></div>

      <div className="relative z-10 flex items-center h-full page-width">
        <div>
          <h2 className="text-white text-6xl md:text-6xl font-semibold mb-1">
            Ready to Grow with COTCO?
          </h2>
          <p className="text-white text-lg md:text-4xl font-semibold mb-6">
            Contact Us Today
          </p>
          <a
            href="#"
            className="bg-white text-blue-900 font-medium px-5 py-3 rounded-md hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            Get Started
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactToday;
