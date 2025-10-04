import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { getFooterPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const Footer = () => {
  const [footerLogo, setFooterLogo] = useState("");
  const [footerSocials, setFooterSocials] = useState([]);

  useEffect(() => {
    getFooterPage().then((res) => {
      const data = res.data?.footer || res.data;
      if (data?.footerLogo) setFooterLogo(data.footerLogo);
      if (data?.footerSocials) setFooterSocials(data.footerSocials);
    });
  }, []);

  const getLucideIcon = (name) => {
    if (!name) return LucideIcons.HelpCircle;
    // ✅ Convert "facebook" → "Facebook"
    const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return LucideIcons[formatted] || LucideIcons.HelpCircle;
  };

  return (
    <footer className="bg-[#0A1C2E] text-white pt-40 pb-20 footer-section">
      <div className="page-width mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Logo + Social */}
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
                footerSocials.map((social, idx) => {
                  const Icon = getLucideIcon(social.icon);
                  return (
                    <a
                      key={idx}
                      href={social.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded border border-gray-500 hover:bg-white group"
                    >
                      <Icon size={20} className="text-white group-hover:text-[#0A1C2E]" />
                    </a>
                  );
                })
              ) : (
                <span className="text-gray-400">No Social Icons</span>
              )}
            </div>
          </div>

          {/* Middle: Navigation */}
          <div className="grid grid-cols-2 gap-10 text-sm md:pl-20">
            <ul className="space-y-5">
              <li>
                <a
                  href="/aboutus"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/cotton"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  Cotton
                </a>
              </li>
              <li>
                <a
                  href="/fiber"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  Fiber
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>

            <ul className="space-y-5">
              <li>
                <a
                  href="/privacy"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="font-medium text-white text-lg hover:text-gray-300 transition"
                >
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
