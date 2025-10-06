import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api";

export default function PartnerSection() {
  const [logos, setLogos] = useState([]);
  const [heading, setHeading] = useState("PROUD PARTNERS OF GLOBAL LEADERS");
  const [activeLang, setActiveLang] = useState("en");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Detect language dynamically from <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Watch for dynamic changes to body class
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Helper function for multilingual content
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch homepage data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.companyLogosSection) {
        const section = res.data.companyLogosSection;

        // Set heading dynamically based on language
        setHeading(pick(section.companyLogosHeading, activeLang));

        let collected = [];

        // Prefer new array-based schema
        if (Array.isArray(section.logos) && section.logos.length > 0) {
          collected = section.logos
            .filter((logo) => logo.url)
            .map((logo, i) => ({
              name: `Partner ${i + 1}`,
              image: logo.url,
            }));
        } else {
          // Fallback for old schema (companyLogo1...6)
          for (let i = 1; i <= 6; i++) {
            if (section[`companyLogo${i}`]) {
              collected.push({
                name: `Logo ${i}`,
                image: section[`companyLogo${i}`],
              });
            }
          }
        }

        setLogos(collected);
      }
    });
  }, [activeLang]); // refetch when language changes

  const settings = {
    dots: false,
    infinite: true,
    speed: 4000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  if (!logos.length) return null;

  return (
    <section className="md:pt-20 pt-6 page-width bg-white rounded-md partner-section">
      <TitleAnimation
        text={heading || "PROUD PARTNERS OF GLOBAL LEADERS"}
        className="heading text-center mb-14"
        align="center"
        delay={0.05}
        stagger={0.05}
        once={true}
      />

      <Slider {...settings}>
        {logos.map((partner, index) => (
          <div key={index} className="px-4">
            <div className="flex justify-center items-center">
              <img
                src={
                  partner.image?.startsWith("http")
                    ? partner.image
                    : `${BASE_URL}${partner.image}`
                }
                alt={partner.name}
                className="h-16 md:h-20 object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
