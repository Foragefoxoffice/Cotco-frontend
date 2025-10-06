import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TitleAnimation from "../common/AnimatedTitle";

const partners = [
  { name: { en: "Aditya Birla Group", vi: "Tập đoàn Aditya Birla" }, image: "/img/partners/logo1.png" },
  { name: { en: "Viterra", vi: "Viterra" }, image: "/img/partners/logo2.png" },
  { name: { en: "LDC", vi: "LDC" }, image: "/img/partners/logo3.png" },
  { name: { en: "LMW", vi: "LMW" }, image: "/img/partners/logo4.png" },
  { name: { en: "Devcot", vi: "Devcot" }, image: "/img/partners/logo5.png" },
];

export default function PartnerSection() {
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect current site language
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    if (saved === "vi" || saved === "en") {
      setActiveLang(saved);
      document.body.classList.toggle("vi-mode", saved === "vi");
    } else {
      setActiveLang(detectLang());
    }

    const observer = new MutationObserver(() => setActiveLang(detectLang()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

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
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  // ✅ Text in both languages
  const titleText = {
    en: "PROUD PARTNERS OF GLOBAL LEADERS",
    vi: "TỰ HÀO LÀ ĐỐI TÁC CỦA CÁC TẬP ĐOÀN TOÀN CẦU",
  };

  return (
    <section className="md:py-20 py-6 page-width bg-white rounded-md partner-section">
      <TitleAnimation
        text={titleText[activeLang]}
        className="text-center heading mb-8"
        align="center"
        delay={0.05}
        stagger={0.05}
        once={true}
      />

      <Slider {...settings}>
        {partners.map((partner, index) => (
          <div key={index} className="px-4">
            <div className="flex justify-center items-center">
              <img
                src={partner.image}
                alt={partner.name[activeLang]}
                className="h-16 md:h-20 object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
