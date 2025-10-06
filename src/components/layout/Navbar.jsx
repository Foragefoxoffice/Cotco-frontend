import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiArrowDownRight, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import GoogleTranslate from "../GoogleTranslate";
import TranslateToggle from "../TranslateToggle";
import { getHeaderPage, getMainBlogCategories } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const staticLinks = [
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
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // ✅ Dynamic data
  const [headerLogo, setHeaderLogo] = useState("");
  const [mainCategories, setMainCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // ✅ Fetch header (logo)
  useEffect(() => {
    getHeaderPage().then((res) => {
      const data = res.data?.header || res.data;
      if (data?.headerLogo) setHeaderLogo(data.headerLogo);
    });
  }, []);

  // ✅ Fetch Resources categories
  useEffect(() => {
    (async () => {
      try {
        const res = await getMainBlogCategories();
        const cats = res.data?.data || res.data || [];
        setMainCategories(cats);
      } catch (err) {
        console.error("Failed to fetch main categories:", err);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  // ✅ Scroll behavior
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

  const toggleMenu = () => setIsOpen((s) => !s);

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
      {/* ---------- NAVBAR ---------- */}
      <nav className={navClasses}>
        <div className="mx-auto px-6 md:px-20 py-4 flex justify-between items-center">
          {/* ✅ Logo */}
          <div className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <Link to="/">
              {headerLogo ? (
                <img
                  src={`${API_BASE}${headerLogo}`}
                  alt="Logo"
                  className="md:h-22 h-14 w-auto"
                />
              ) : (
                <img
                  src="/img/home/footerLogo.png"
                  alt="Logo"
                  className="h-16 w-auto"
                />
              )}
            </Link>
          </div>

          {/* ---------- DESKTOP MENU ---------- */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 md:gap-10 relative">
              {staticLinks.map(({ label, href }) => {
                const isActive = location.pathname === href;

                // ✅ Machines + Resources dropdown
                if (label === "Machines") {
                  return (
                    <div key={label} className="flex items-center gap-8">
                      <Link to={href} className={getLinkClass(href)}>
                        {label}
                      </Link>

                      {/* ✅ Resources Dropdown */}
                      <div className="relative group">
                        <button
                          style={{
                            color: "#fff",
                          }}
                          className={
                            getLinkClass("#") +
                            " flex items-center gap-1 cursor-pointer"
                          }
                        >
                          Resources
                          <FiChevronDown className="transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute left-0 mt-2 hidden group-hover:block bg-white text-black rounded shadow-lg py-2 min-w-[200px]">
                          {loadingCats ? (
                            <span className="block px-4 py-2 text-gray-500">
                              Loading...
                            </span>
                          ) : mainCategories.length > 0 ? (
                            mainCategories.map((mc) => (
                              <Link
                                key={mc._id}
                                to={`/${mc.slug}`}
                                className="block px-4 py-2 hover:bg-gray-100"
                              >
                                {mc.name?.en || "Untitled"}
                              </Link>
                            ))
                          ) : (
                            <span className="block px-4 py-2 text-gray-400">
                              No Categories
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ✅ Contact button
                if (label === "Contact") {
                  return (
                    <Link
                      style={{
                        padding:"15px 10px"
                      }}
                      key={label}
                      to={href}
                      className={contactClasses(isActive)}
                    >
                      <span>Contact</span>
                      <FiArrowDownRight size={16} />
                    </Link>
                  );
                }

                // ✅ Default links
                return (
                  <Link key={label} to={href} className={getLinkClass(href)}>
                    {label}
                  </Link>
                );
              })}
            </div>
            <TranslateToggle />
          </div>

          {/* ---------- MOBILE: LANG + MENU TOGGLE ---------- */}
          <div className="flex items-center gap-4 md:hidden">
            {/* 🔹 Language Toggle */}
            <div className="translate-toggle-mobile">
              <TranslateToggle />
            </div>

            {/* 🔹 Hamburger Button */}
            <button
              style={{
                color: "#fff",
                fontSize: "28px",
              }}
              className="text-3xl cursor-pointer z-[60] text-white"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* ✅ Google Translate widget */}
        {/* <GoogleTranslate
          defaultLang={localStorage.getItem("preferred_lang") || "en"}
        /> */}
      </nav>

      {/* ---------- MOBILE MENU ---------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-[#fff] text-[#0A1C2E] z-50 flex flex-col items-center justify-center overflow-y-auto"
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

            <div className="mb-10">
              <TranslateToggle />
            </div>

            <div className="space-y-6 grid text-center w-full px-6">
              {staticLinks.map(({ label, href }, index) => {
                const isActive = location.pathname === href;

                // ✅ Machines + Resources collapsible submenu
                if (label === "Machines") {
                  return (
                    <div key={label}>
                      {/* Machines */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          to={href}
                          onClick={toggleMenu}
                          className="text-2xl font-semibold"
                        >
                          {label}
                        </Link>
                      </motion.div>

                      {/* Resources */}
                      <motion.div
                        key="Resources"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-left"
                      >
                        <button
                          onClick={() =>
                            setOpenSubmenu(
                              openSubmenu === "Resources" ? null : "Resources"
                            )
                          }
                          className="flex items-center justify-center w-full text-lg mt-6 font-semibold"
                        >
                          Resources
                          <FiChevronDown
                            className={`transition-transform ${
                              openSubmenu === "Resources" ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {openSubmenu === "Resources" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 mt-2 text-center space-y-2"
                            >
                              {loadingCats ? (
                                <span className="block text-lg text-gray-500">
                                  Loading...
                                </span>
                              ) : mainCategories.length > 0 ? (
                                mainCategories.map((mc) => (
                                  <Link
                                    key={mc._id}
                                    to={`/${mc.slug}`}
                                    onClick={toggleMenu}
                                    className="block text-lg text-gray-700 hover:text-blue-600"
                                  >
                                    {mc.name?.en || "Untitled"}
                                  </Link>
                                ))
                              ) : (
                                <span className="block text-gray-400 text-lg">
                                  No Categories
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  );
                }

                // ✅ Normal links
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={href}
                      onClick={toggleMenu}
                      className={`text-2xl font-semibold ${
                        isActive ? "text-blue-600" : "hover:text-blue-400"
                      }`}
                    >
                      {label}
                    </Link>
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
