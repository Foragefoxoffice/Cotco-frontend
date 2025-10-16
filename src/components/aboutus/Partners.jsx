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

  // ✅ Detect active language from <body class="vi-mode">
  useEffect(() => {
    const detectLang = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLang());

    const observer = new MutationObserver(() => setActiveLang(detectLang()));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch Homepage data
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.companyLogosSection) {
        const section = res.data.companyLogosSection;

        // ✅ Handle multilingual heading
        if (section.companyLogosHeading) {
          setHeading(
            section.companyLogosHeading[activeLang] ||
              section.companyLogosHeading.en ||
              "PROUD PARTNERS OF GLOBAL LEADERS"
          );
        }

        let collected = [];

        // ✅ Prefer new array-based schema
        if (Array.isArray(section.logos) && section.logos.length > 0) {
          collected = section.logos
            .filter((logo) => logo.url)
            .map((logo, i) => ({
              name: `Partner ${i + 1}`,
              image: logo.url,
            }));
        } else {
          // ✅ Fallback for old schema (companyLogo1..6)
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
  }, [activeLang]); // refetch heading when language changes

  // ✅ Slider settings
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

  // ✅ Fallback Vietnamese translation if no API text provided
  const translatedHeading =
    activeLang === "vi"
      ? heading || "ĐỐI TÁC TỰ HÀO CỦA CÁC NHÀ LÃNH ĐẠO TOÀN CẦU"
      : heading || "PROUD PARTNERS OF GLOBAL LEADERS";

  return (
    <section className="md:pt-20 mb-20 pt-6 page-width bg-white rounded-md partner-section">
      <TitleAnimation
        text={translatedHeading}
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
                    : `${import.meta.env.VITE_API_URL || ""}${partner.image}`
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
