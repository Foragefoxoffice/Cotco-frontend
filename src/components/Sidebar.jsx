import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  ChevronRight,
  Package,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext"; // ✅ use your theme

const Sidebar = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const getInitialMenuState = () => ({
    pages: location.pathname.startsWith("/admin/pages"),
    products: location.pathname.startsWith("/admin/products"),
    news: location.pathname.startsWith("/admin/news"),
  });

  const [openMenus, setOpenMenus] = React.useState(getInitialMenuState);

  React.useEffect(() => {
    setOpenMenus(getInitialMenuState());
  }, [location.pathname]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    {
      label: "News",
      icon: <Newspaper size={20} />,
      key: "news",
      subItems: [
        { path: "/admin/news", label: "All Articles" },
        { path: "/admin/news/categories", label: "Categories" },
      ],
    },
    {
      label: "Machines",
      icon: <Package size={20} />,
      key: "machines",
      subItems: [
        { path: "/admin/machines/categories", label: "Categories" },
        { path: "/admin/machines/list", label: "List" },
      ],
    },
    {
      label: "Pages",
      icon: <Newspaper size={20} />,
      key: "pages",
      subItems: [
        { path: "/admin/home", label: "Home" },
        { path: "/admin/about", label: "About" },
        { path: "/admin/cotton", label: "Cotton" },
        { path: "/admin/fiber", label: "Fiber" },
        { path: "/admin/contact", label: "Contact" },
      ],
    },
  ];

  // ✅ Custom NavLink with theme awareness
  const NavLink = ({ to, children, className = "" }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-2 mb-2 mt-2 text-sm rounded-md transition-colors duration-200 ${isActive
          ? theme === "light"
            ? "bg-indigo-50 text-[#101828] font-medium"
            : "bg-gray-700 text-white font-medium"
          : theme === "light"
            ? "text-gray-700 hover:bg-gray-100"
            : "text-gray-300 hover:bg-gray-700"
          } ${className}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div
      className={`w-64 border-r h-full flex flex-col transition-colors duration-300 ${theme === "light"
        ? "bg-white border-gray-200"
        : "bg-gray-800 border-gray-700"
        }`}
    >
      {/* Logo */}
      <div
        className={`p-4 border-b ${theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
      >
        <img
          alt="Cotco Logo"
          src="/img/home/footerLogo.png"
          className={`h-22 transition filter 
    ${theme === "light" ? "brightness-50" : "brightness-100"}`}
        />

        <p
          className={`text-sm text-center ${theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
        >
          COTCO Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key || item.path} className="px-2 py-1">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md text-left transition-colors ${theme === "light"
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-300 hover:bg-gray-700"
                      } ${location.pathname.startsWith(`/admin/${item.key}`) &&
                      "font-medium"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${openMenus[item.key] ? "rotate-90" : ""
                        }`}
                    />
                  </button>
                  {openMenus[item.key] ||
                    location.pathname.startsWith(`/admin/${item.key}`) ? (
                    <ul className="pl-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink to={subItem.path}>{subItem.label}</NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <NavLink to={item.path}>
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`p-4 border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
      >
        <p
          className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
        >
          Cotco CMS
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
