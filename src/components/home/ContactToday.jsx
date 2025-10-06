import React, { useEffect, useState } from "react";

const ContactToday = () => {
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language dynamically from <body class="vi-mode">
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    // Watch for live language toggle
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Translations
  const text = {
    en: {
      title: "Ready to Grow with COTCO?",
      subtitle: "Contact Us Today",
      button: "Get Started",
    },
    vi: {
      title: "Sẵn sàng phát triển cùng COTCO?",
      subtitle: "Liên hệ với chúng tôi ngay hôm nay",
      button: "Bắt đầu ngay",
    },
  };

  const t = text[activeLang];

  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/home/upperFooter.jpg')",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Overlay */}
      <div
        style={{ backgroundColor: "#1F90D8CC" }}
        className="absolute inset-0 bg-opacity-60"
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full page-width">
        <div>
          <h2 className="text-white text-4xl md:text-6xl font-semibold mb-1 leading-tight">
            {t.title}
          </h2>
          <p className="text-white text-xl md:text-3xl font-semibold mb-6">
            {t.subtitle}
          </p>
          <a
            href="#contact"
            className="bg-white text-blue-900 font-medium px-5 py-3 rounded-md hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            {t.button}
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactToday;
