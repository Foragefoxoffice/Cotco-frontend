import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Newspaper,
  ChevronRight,
  Settings,
  Cog,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // ✅ Adjust menu open logic
  const getInitialMenuState = () => ({
    pages: [
      "/admin/header",
      "/admin/footer",
      "/admin/home",
      "/admin/about",
      "/admin/cotton",
      "/admin/fiber",
      "/admin/contact",
      "/admin/privacy-policy",
      "/admin/terms-conditions",
    ].some((path) => location.pathname.startsWith(path)),
    products: location.pathname.startsWith("/admin/products"),
    news: location.pathname.startsWith("/admin/news"),
    machines: location.pathname.startsWith("/admin/machines"),
  });

  const [openMenus, setOpenMenus] = React.useState(getInitialMenuState);

  React.useEffect(() => {
    setOpenMenus(getInitialMenuState());
  }, [location.pathname]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    {
      label: "News",
      icon: <Newspaper size={18} />,
      key: "news",
      subItems: [
        { path: "/admin/news", label: "All Articles" },
        { path: "/admin/news/categories", label: "Categories" },
      ],
    },
    {
      label: "Machines",
      icon: <Cog size={20} />,
      key: "machines",
      subItems: [
        { path: "/admin/machines/categories", label: "Categories" },
        { path: "/admin/machines/list", label: "List" },
      ],
    },
    {
      label: "CMS Settings",
      icon: <Settings size={18} />,
      key: "pages",
      subItems: [
        { path: "/admin/header", label: "Header" },
        { path: "/admin/footer", label: "Footer" },
        { path: "/admin/home", label: "Home" },
        { path: "/admin/about", label: "About" },
        { path: "/admin/cotton", label: "Cotton" },
        { path: "/admin/fiber", label: "Fiber" },
        { path: "/admin/contact", label: "Contact" },
        { path: "/admin/privacy-policy", label: "Privacy Policy" },
        { path: "/admin/terms-conditions", label: "Terms and Conditions" },
      ],
    },
  ];

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="w-60 h-full flex flex-col transition-colors duration-300 bg-[#171717] border-r border-[#2E2F2F] text-white">
      {/* Logo */}
      <div className="p-5 flex flex-col items-center border-b border-gray-700">
        <img alt="Cotco Logo" src="/img/home/footerLogo.png" className="h-20 mb-2" />
        <p className="text-lg font-bold text-gray-200">COTCO Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key || item.path} className="px-3">
              {item.subItems ? (
                <>
                  <button
                    style={{
                      marginTop:"10px",
                    }}
                    onClick={() => toggleMenu(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      openMenus[item.key]
                        ? "bg-blue-500 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 py-3">
                      {item.icon}
                      {item.label}
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${
                        openMenus[item.key] ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {openMenus[item.key] && (
                    <ul className="pl-6 pt-3 mt-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink to={subItem.path}>{subItem.label}</NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={item.path}>
                  {item.icon}
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">Cotco CMS</p>
      </div>
    </div>
  );
};

export default Sidebar;
