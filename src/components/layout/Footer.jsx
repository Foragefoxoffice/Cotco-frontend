import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaYoutube,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer = () => {
  return (
   <footer className="bg-[#0A1C2E] text-white  pt-40 pb-20 footer-section">
      <div className="page-width mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Logo + Social */}
          <div className="space-y-8">
            <div>
              <img src="/img/home/footerLogo.png" alt="Cotco Logo" className="h-26" />
            </div>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/COTCO-Cotton-Yarn-Textile-Machine-111059494909474" className="p-2 rounded border border-gray-500 hover:bg-white group">
                <FaFacebookF className="text-white group-hover:text-[#0A1C2E]" />
              </a>
              
               <a href="https://www.youtube.com/@CotcoCompanyLimited" className="p-2 rounded border border-gray-500 hover:bg-white group">
                <FaYoutube className="text-white group-hover:text-[#0A1C2E]" />
              </a>
              <a href="https://zalo.me/576585541050449132" className="p-2 rounded border border-gray-500 hover:bg-white group">
                <SiZalo  className="text-white group-hover:text-[#0A1C2E]" />
              </a>
              <a href="trading@cotco-vn.com" className="p-2 rounded border border-gray-500 hover:bg-white group">
                <FaEnvelope className="text-white group-hover:text-[#0A1C2E]" />
              </a>
              <a href="https://www.instagram.com/cotco_offical/" className="p-2 rounded border border-gray-500 hover:bg-white group">
                <FaInstagram className="text-white group-hover:text-[#0A1C2E]" />
              </a>
              <a href="https://www.linkedin.com/company/65574506/admin/" className="p-2 rounded border border-gray-500 hover:bg-white group">
                <FaLinkedinIn className="text-white group-hover:text-[#0A1C2E]" />
              </a>
            </div>
          </div>

          {/* Middle: Navigation */}
          <div className="grid grid-cols-2 gap-10 text-sm md:pl-20">
          <ul className="space-y-5">
  <li>
    <a href="/aboutus" className="font-medium text-white text-lg hover:text-gray-300 transition">
      About Us
    </a>
  </li>
  <li>
    <a href="/cotton" className="font-medium text-white text-lg hover:text-gray-300 transition">
      Cotton
    </a>
  </li>
  <li>
    <a href="/fiber" className="font-medium text-white text-lg hover:text-gray-300 transition">
      Fiber
    </a>
  </li>
  <li>
    <a href="/products" className="font-medium text-white text-lg hover:text-gray-300 transition">
      Products
    </a>
  </li>
  <li>
    <a href="/contact" className="font-medium text-white text-lg hover:text-gray-300 transition">
      Contact Us
    </a>
  </li>
</ul>

<ul className="space-y-5">
  <li>
    <a href="/aboutus" className="font-medium text-white text-lg hover:text-gray-300 transition">
      Privacy Policy
    </a>
  </li>
  <li>
    <a href="/aboutus" className="font-medium text-white text-lg hover:text-gray-300 transition">
      Terms and Conditions
    </a>
  </li>
</ul>

          </div>
        </div>

        {/* Newsletter Form: Right Bottom Corner */}
        <div className="flex justify-end mt-12">
          <div className="w-full md:w-[540px]">
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 md:px-4 px-2 py-3 bg-transparent text-white border border-gray-400 rounded-l-md placeholder-gray-300 focus:outline-none"
              />
              <button className="bg-white text-[#0A1C2E] md:px-6 px-3 py-3 rounded-r-md hover:bg-gray-100 font-medium flex items-center gap-2">
                Get Started <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="border-t border-gray-700 mt-20 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
