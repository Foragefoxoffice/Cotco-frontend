import { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import { getAboutPage } from "../../Api/api";

export default function PinnedExpertiseTimeline() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [historyData, setHistoryData] = useState([]);
  const [historyTitle, setHistoryTitle] = useState({ en: "", vi: "" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect active language dynamically via body class
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ API base
  const API_BASE = import.meta.env.VITE_API_URL;
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Fetch History Data
  useEffect(() => {
    getAboutPage()
      .then((res) => {
        const section = res.data?.aboutHistorySection;
        if (section?.aboutHistory?.length) {
          const sorted = [...section.aboutHistory].sort(
            (a, b) => Number(a.year) - Number(b.year)
          );
          setHistoryData(sorted);
          setHistoryTitle(section.aboutHistoryTitle || { en: "", vi: "" });
        }
      })
      .catch((err) => console.error("❌ Failed to load history:", err));
  }, []);

  // ✅ Helper to pick correct language safely
  const pick = (obj) =>
    typeof obj === "object"
      ? obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? ""
      : obj ?? "";

  // ✅ Scroll-driven step index
  const stepCount = historyData.length;

  const scrollSteps = useTransform(scrollYProgress, (progress) => {
    if (stepCount === 0) return 0;
    return Math.min(Math.floor(progress * stepCount), stepCount - 1);
  });

  useEffect(() => {
    const unsubscribe = scrollSteps.on("change", (latest) => {
      if (latest !== currentIndex) {
        setPrevIndex(currentIndex);
        setCurrentIndex(latest);
      }
    });
    return unsubscribe;
  }, [scrollSteps, currentIndex]);

  // 🔒 Guard if no data yet
  if (!historyData.length) {
    return (
      <section
        ref={sectionRef}
        className="relative h-[100vh] flex items-center justify-center bg-[#E7EDF5]"
      >
        <p className="text-lg font-semibold text-gray-600">
          Loading history...
        </p>
      </section>
    );
  }

  // ✅ Use dynamic heading (fallback if empty)
  const headingText =
    pick(historyTitle) ||
    (activeLang === "vi" ? "Lịch sử công ty" : "Our History");

  return (
    <section
      ref={sectionRef}
      style={{ height: `${100 * (historyData.length + 1)}vh` }}
      className="relative bg-[#E7EDF5]"
    >
      {/* ---------- Desktop Layout ---------- */}
      <div className="hidden md:grid sticky top-0 h-screen grid-cols-1 md:grid-cols-2 gap-20 justify-center w-full px-6 md:pr-0 md:px-20">
        {/* Left: Years + Description */}
        <div className="flex flex-col justify-center space-y-4 h-full py-20 relative">
          <h3 className="absolute left-[-100px] top-1/2 -translate-y-1/2 text-[#19191940] z-2 rotate-[270deg] text-6xl font-bold text-center uppercase">
            {headingText}
          </h3>

          <div className="space-y-4">
            {historyData.slice(0, currentIndex + 1).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="text-3xl text-end font-semibold text-[#000]"
              >
                {item.year}
              </motion.div>
            ))}
          </div>

          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg text-end text-black max-w-2xl ml-auto font-normal pt-6 pl-16"
          >
            {pick(historyData[currentIndex]?.content)}
          </motion.p>
        </div>

        {/* Right: Static + Animated Image */}
        <div className="relative h-full w-full overflow-hidden">
          {historyData[prevIndex]?.image && (
            <img
              src={getFullUrl(historyData[prevIndex].image)}
              alt={historyData[prevIndex].year}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}

          <AnimatePresence mode="wait">
            {historyData[currentIndex]?.image && (
              <motion.img
                key={historyData[currentIndex].image}
                src={getFullUrl(historyData[currentIndex].image)}
                alt={historyData[currentIndex].year}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Mobile Layout ---------- */}
      <div className="md:hidden sticky top-0 h-screen w-full overflow-hidden">
        {/* Background image transition */}
        {historyData[prevIndex]?.image && (
          <img
            src={getFullUrl(historyData[prevIndex].image)}
            alt={historyData[prevIndex].year}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        <AnimatePresence mode="wait">
          {historyData[currentIndex]?.image && (
            <motion.img
              key={historyData[currentIndex].image}
              src={getFullUrl(historyData[currentIndex].image)}
              alt={historyData[currentIndex].year}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
        </AnimatePresence>

        {/* Gradient overlay for readability */}
        <motion.div
          key={`overlay-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 z-20"
        />

        {/* Top Left Heading */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute top-24 left-6 z-30"
        >
          <p className="text-white font-semibold text-3xl uppercase mb-2 tracking-wide">
            {headingText}
          </p>
        </motion.div>

        {/* Top Right Year */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="absolute top-24 right-6 z-30"
        >
          <p className="text-white font-bold text-2xl">
            {historyData[currentIndex]?.year}
          </p>
        </motion.div>

        {/* Bottom Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute bottom-24 right-0 p-6 z-30"
        >
          <p className="text-white text-sm leading-relaxed max-w-sm">
            {pick(historyData[currentIndex]?.content)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
