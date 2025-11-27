import React, { useState, useEffect } from "react";
import { getFooterPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const Footer = () => {
  const [footerLogo, setFooterLogo] = useState("");
  const [footerSocials, setFooterSocials] = useState([]);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [copyrights, setCopyrights] = useState("");

  // ✅ Detect language (based on body class)
  useEffect(() => {
    const detectLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    detectLang();

    const observer = new MutationObserver(detectLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const lang = isVietnamese ? "vi" : "en";

  // ✅ Fetch footer data
  useEffect(() => {
    getFooterPage().then((res) => {
      const data = res.data?.footer || res.data;

      if (data?.footerLogo) setFooterLogo(data.footerLogo);
      if (data?.footerSocials) setFooterSocials(data.footerSocials);
      if (data?.copyrights) setCopyrights(data.copyrights); // ✅ ADD THIS
    });
  }, []);

  // ✅ Translations for all links
  const links = {
    en: {
      about: "About Us",
      cotton: "Cotton",
      fiber: "Fiber",
      products: "Products",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      terms: "Terms and Conditions",
    },
    vi: {
      about: "Về Chúng Tôi",
      cotton: "Bông",
      fiber: "Xơ",
      products: "Sản Phẩm",
      contact: "Liên Hệ",
      privacy: "Chính Sách Bảo Mật",
      terms: "Điều Khoản & Điều Kiện",
    },
  };

  const t = links[lang];

  return (
    <footer className="bg-[#0A1C2E] text-white pt-40 pb-20 footer-section">
      <div className="page-width mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Logo + Socials */}
          <div className="space-y-8">
            <div>
              {footerLogo ? (
                <img
                  src={`${API_BASE}${footerLogo}`}
                  alt="Footer Logo"
                  className="h-26"
                />
              ) : (
                <span className="text-gray-400">No Logo</span>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              {footerSocials.length > 0 ? (
                footerSocials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded border border-gray-500 hover:bg-white group"
                  >
                    {social.iconImage ? (
                      <img
                        src={`${API_BASE}${social.iconImage}`}
                        alt="Social icon"
                        className="w-6 h-6 object-contain group-hover:brightness-0"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Icon</span>
                    )}
                  </a>
                ))
              ) : (
                <span className="text-gray-400">
                  {isVietnamese ? "Không có mạng xã hội" : "No Social Icons"}
                </span>
              )}
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div className="grid grid-cols-2 gap-10 text-sm md:pl-20">
            <ul className="space-y-5">
              <li>
                <a
                  href="/aboutus"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.about}
                </a>
              </li>
              <li>
                <a
                  href="/cotton"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.cotton}
                </a>
              </li>
              <li>
                <a
                  href="/fiber"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.fiber}
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.products}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.contact}
                </a>
              </li>
            </ul>

            <ul className="space-y-5">
              <li>
                <a
                  href="/privacy-policy"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.privacy}
                </a>
              </li>
              <li>
                <a
                  href="/terms-conditions"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  {t.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyrights (Rich Text) */}
        <div
          className="mt-16 text-center text-gray-400 text-sm px-4 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              copyrights ||
              (isVietnamese
                ? "© <strong>Nội dung bản quyền</strong> đang chờ cập nhật"
                : "© <strong>Copyright text</strong> pending"),
          }}
        ></div>
      </div>
    </footer>
  );
};

export default Footer;
