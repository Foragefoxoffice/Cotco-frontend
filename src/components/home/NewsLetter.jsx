import React, { useState } from "react";
import { FaArrowRightLong, FaArrowLeft } from "react-icons/fa6";
import { MdOutlineArrowOutward } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    position: "absolute",
  }),
};

const leftSlides = [
  {
    image: "/img/home/news1.jpg",
    title:
      "THE OPENING CEREMONY MARKS THE START OF A NEW YEAR WITH WISHES OF FORTUNE AND A CLEAR DIRECTION.",
  },
  {
    image: "/img/home/news1.jpg",
    title: "ANNUAL MEETING TO CELEBRATE SUCCESSFUL YEAR-END ACHIEVEMENTS.",
  },
];

const rightNews = [
  {
    image: "/img/home/news2.jpg",
    title:
      "SIGNING CEREMONY TO HANDOVER LAKSHMI RINGFRAME MACHINE INSTALLATION",
  },
  {
    image: "/img/home/news2.jpg",
    title: "PARTNERSHIP AGREEMENT WITH GLOBAL TEXTILE LEADERS",
  },
  {
    image: "/img/home/news2.jpg",
    title: "EXPANSION OF PRODUCTION CAPACITY IN SOUTH ASIA",
  },
  {
    image: "/img/home/news2.jpg",
    title: "NEW FACILITY INAUGURATION IN CENTRAL REGION",
  },
];

export default function NewsEventsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // +1 = next, -1 = prev

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % leftSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + leftSlides.length) % leftSlides.length
    );
  };

  return (
    <section
      style={{
        background: "linear-gradient(122.81deg, #91B2CD 0%, #041A34 30%)",
      }}
      className="text-white py-30 page-width newsLetter"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-2">NEWS & EVENTS</h2>
        <p className="text-center text-gray-300 mb-20 newsLetterH2">
          Conveniently located and surrounded by natural beauty, it's
          <br />
          the perfect spot for our celebration
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start newsLetterGrid">
          {/* Left Side Slider */}
<div className="relative h-[400px] md:h-[540px]">
  <AnimatePresence custom={direction} mode="wait">
    <motion.div
      key={"slide-" + currentSlide}
      variants={slideVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="relative rounded-xl shadow-lg w-full h-full overflow-hidden"
    >
      {/* Slide Image */}
      <img
        src={leftSlides[currentSlide].image}
        alt="Slide"
        className="w-full h-full object-cover rounded-tr-4xl rounded-tl-4xl rounded-br-4xl rounded-bl-4xl"
      />

      {/* Gradient Overlay + Text */}
      <div className="absolute bottom-0 left-0 right-0 rounded-br-4xl rounded-bl-4xl bg-gradient-to-t from-black/100 to-transparent p-6 z-10 h-[160px]">
        <p className="text-2xl font-semibold newsLetterMainH2">
          {leftSlides[currentSlide].title}
        </p>
      </div>
    </motion.div>
  </AnimatePresence>

  {/* Slider Controls (Not animated) */}
  <div className="absolute -bottom-20 left-4 flex gap-8 z-20">
    <button
      onClick={prevSlide}
      className="p-5 hover:cursor-pointer border rounded-full hover:bg-white hover:text-blue-900 transition"
    >
      <FaArrowLeft className="text-lg" />
    </button>
    <button
      onClick={nextSlide}
      className="p-5 hover:cursor-pointer border rounded-full hover:bg-white hover:text-blue-900 transition"
    >
      <FaArrowRightLong className="text-lg" />
    </button>
  </div>
</div>


          {/* Right Side Scrollable News */}
          <div className="news-scroll overflow-x-auto max-w-full scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
            <div className="flex gap-6 px-1 min-w-full">
              {rightNews.map((item, index) => (
                <div
                  key={index}
                  className="relative newsScroll rounded-xl overflow-hidden shadow-md min-w-[600px] max-w-[320px] bg-white"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[660px] object-cover"
                  />
                  <a
                    href="#"
                    className="absolute top-4 right-4 w-15 h-15 flex items-center justify-center rounded-full border border-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                  >
                    <MdOutlineArrowOutward className="text-white text-2xl" />
                  </a>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 to-transparent p-6">
                    <p className="text-white text-2xl font-semibold leading-snug newsLetterMainH2">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
