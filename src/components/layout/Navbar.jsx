import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiArrowDownRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import GoogleTranslate from "../GoogleTranslate";
import TranslateToggle from "../TranslateToggle";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/aboutus" },
  { label: "Cotton", href: "/cotton" },
  { label: "Fiber", href: "/fiber" },
  { label: "Machines", href: "/machines" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen((s) => !s);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 80);
      setScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navClasses = `top-0 left-0 w-full z-50 transition-all duration-300 ${
    showNavbar ? "translate-y-0" : "-translate-y-full"
  } ${scrolled ? "bg-[#0A1C2E] shadow-md fixed" : "bg-transparent fixed"}`;

  const getLinkClass = (href) =>
  `relative transition-colors duration-300 font-medium 
   ${
     location.pathname === href
       ? "text-white font-semibold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[3px] after:w-full after:bg-white after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
       : "text-[#fff] hover:text-[#fff] after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[3px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
   }`;


  // Contact pill styles (desktop + mobile)
  const contactClasses = (active = false) =>
    [
      "group inline-flex items-center gap-2 rounded-full",
      "bg-white px-5 py-2.5",
      "shadow-[0_1px_0_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.08)]",
      "ring-1 ring-black/10",
      "text-[#121E2B]",
      "hover:shadow-[0_2px_0_rgba(0,0,0,0.18),0_10px_24px_rgba(0,0,0,0.12)]",
      "transition-all duration-200",
      active ? "font-semibold" : "font-medium",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D3B66]/50",
    ].join(" ");

  return (
    <>
      <nav className={navClasses}>
        <div className="mx-auto px-6 md:px-20 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <Link to="/">
              <img src="/img/home/footerLogo.png" alt="Logo" className="h-22 w-auto" />
            </Link>
          </div>

          {/* Desktop: links + language toggle */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center  gap-6 md:gap-10">
              {menuLinks.map(({ label, href }) => {
                const isActive = location.pathname === href;

                if (label === "Contact") {
                  return (
                    <Link
                      key={label}
                      to={href}
                      aria-current={isActive ? "page" : undefined}
                      className={contactClasses(isActive)}
                    >
                      <span>Contact</span>
                      <FiArrowDownRight
                        className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:translate-y-1"
                        size={16}
                      />
                    </Link>
                  );
                }

                return (
                  <Link key={label} to={href} className={getLinkClass(href)}>
                    {label}
                  </Link>
                );
              })}
            </div>
            <TranslateToggle />
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden text-2xl cursor-pointer z-[60] ${
              isOpen ? "text-white" : "text-gray-800"
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mount Google widget ONCE (hidden but rendered) */}
        <GoogleTranslate
          defaultLang={localStorage.getItem("preferred_lang") || "en"}
        />
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-[#fff] text-[#0A1C2E] z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-6 right-6 text-[#0A1C2E] text-3xl focus:outline-none"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>

            {/* Language toggle (mobile) */}
            <div className="mb-10">
              <TranslateToggle />
            </div>

            {/* Links */}
            <div className="space-y-8 grid text-center">
              {menuLinks.map(({ label, href }, index) => {
                const isActive = location.pathname === href;

                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {label === "Contact" ? (
                      <Link
                        to={href}
                        onClick={toggleMenu}
                        className={`${contactClasses(isActive)} text-xl`}
                      >
                        <span>Contact</span>
                        <FiArrowDownRight
                          className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:translate-y-1"
                          size={18}
                        />
                      </Link>
                    ) : (
                      <Link
                        to={href}
                        onClick={toggleMenu}
                        className={`text-2xl font-semibold ${
                          isActive ? "text-blue-600" : "hover:text-blue-400"
                        }`}
                      >
                        {label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
