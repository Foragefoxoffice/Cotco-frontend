import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TitleAnimation from "../common/AnimatedTitle";
import { getHomepage } from "../../Api/api"; // adjust path

export default function PartnerSection() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.companyLogosSection) {
        const section = res.data.companyLogosSection;
        // Collect non-empty logos
        const collected = [];
        for (let i = 1; i <= 6; i++) {
          if (section[`companyLogo${i}`]) {
            collected.push({
              name: `Logo ${i}`,
              image: section[`companyLogo${i}`],
            });
          }
        }
        setLogos(collected);
      }
    });
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
        settings: { slidesToShow: 2 },
      },
    ],
  };

  if (!logos.length) return null;

  return (
    <section className="md:pt-20 pt-6 page-width bg-white rounded-md partner-section">
      <TitleAnimation
        text={"PROUD PARTNERS OF GLOBAL LEADERS"}
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
                  partner.image.startsWith("http")
                    ? partner.image
                    : `http://localhost:5000${partner.image}`
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
