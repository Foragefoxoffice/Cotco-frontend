import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  ChevronRight,
  Settings,
  Cog,
  Shield,
  UsersRound
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Language detection (body class watch)
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Translation dictionary
  const t = {
    dashboard: isVietnamese ? "Bảng điều khiển" : "Dashboard",
    newsEvents: isVietnamese ? "Tin tức & Sự kiện" : "Resources",
    maincategories: isVietnamese ? "Danh mục chính" : "Main Categories",
    categories: isVietnamese ? "Danh mục" : "Categories",
    allNews: isVietnamese ? "Tất cả tin tức & sự kiện" : "All Resources",
    cms: isVietnamese ? "Cài đặt CMS" : "CMS Settings",
    header: isVietnamese ? "Tiêu đề" : "Header",
    footer: isVietnamese ? "Chân trang" : "Footer",
    home: isVietnamese ? "Trang chủ" : "Home",
    about: isVietnamese ? "Giới thiệu" : "About",
    cotton: isVietnamese ? "Bông" : "Cotton",
    fiber: isVietnamese ? "Sợi" : "Fiber",
    contact: isVietnamese ? "Liên hệ" : "Contact",
    privacy: isVietnamese ? "Chính sách bảo mật" : "Privacy Policy",
    terms: isVietnamese ? "Điều khoản sử dụng" : "Terms & Conditions",
    machines: isVietnamese ? "Máy móc" : "Machines",
    machineCategories: isVietnamese ? "Danh mục máy móc" : "Categories",
    machineList: isVietnamese ? "Danh sách máy móc" : "List",
    roleManagement: isVietnamese ? "Quản lý Vai trò" : "Manage Staffs",
    roles: isVietnamese ? "Vai trò" : "Roles",
    users: isVietnamese ? "Người dùng" : "Users",
    allContacts: isVietnamese ? "Tất cả liên hệ" : "Enquiry Details",
    footerLabel: isVietnamese
      ? "Cotco Hệ thống quản trị"
      : "Cotco CMS",
  };

  // ✅ Initial open menus
  const getInitialMenuState = () => ({
    resources: location.pathname.startsWith("/admin/resources"),
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
    ].some((p) => location.pathname.startsWith(p)),
    machines: location.pathname.startsWith("/admin/machines"),
    roles: location.pathname.startsWith("/admin/roles"),
  });

  const [openMenus, setOpenMenus] = useState(getInitialMenuState);
  useEffect(() => setOpenMenus(getInitialMenuState()), [location.pathname]);

  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  // ✅ Menu structure
  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={18} />, label: t.dashboard },

    {
      label: t.newsEvents,
      icon: <Newspaper size={18} />,
      key: "resources",
      subItems: [
        { path: "/admin/resources/main-categories", label: t.maincategories },
        { path: "/admin/resources/categories", label: t.categories },
        { path: "/admin/resources", label: t.allNews },
      ],
    },

    {
      label: t.machines,
      icon: <Cog size={18} />,
      key: "machines",
      subItems: [
        { path: "/admin/machines/categories", label: t.machineCategories },
        { path: "/admin/machines/list", label: t.machineList },
      ],
    },

    {
      label: t.cms,
      icon: <Settings size={18} />,
      key: "pages",
      subItems: [
        { path: "/admin/header", label: t.header },
        { path: "/admin/footer", label: t.footer },
        { path: "/admin/home", label: t.home },
        { path: "/admin/about", label: t.about },
        { path: "/admin/cotton", label: t.cotton },
        { path: "/admin/fiber", label: t.fiber },
        { path: "/admin/contact", label: t.contact },
        { path: "/admin/privacy-policy", label: t.privacy },
        { path: "/admin/terms-conditions", label: t.terms },
      ],
    },

    {
      label: t.roleManagement,
      icon: <UsersRound size={18} />,
      key: "roles",
      subItems: [
        { path: "/admin/roles", label: t.roles },
        { path: "/admin/staffmanagement", label: t.users },
      ],
    },

    { path: "/admin/contacts", label: t.allContacts },
  ];

  // ✅ Custom NavLink
  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors duration-200
          ${
            isActive
              ? theme === "light"
                ? "bg-indigo-50 text-[#101828] font-medium"
                : "bg-[#0085C8] text-white font-medium"
              : theme === "light"
              ? "text-gray-700 hover:bg-indigo-50"
              : "text-gray-300 hover:bg-[#0085C8]"
          }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div
      className={`w-64 h-full flex flex-col transition-colors duration-300 border-r
      ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-[#171717] border-[#2E2F2F]"
      }`}
    >
      {/* ---------- Logo ---------- */}
      <div
        className={`p-5 flex flex-col items-center border-b 
        ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
      >
        <img
          alt="Cotco Logo"
          src="/img/home/footerLogo.png"
          className={`h-20 mb-2 transition filter ${
            theme === "light" ? "brightness-50" : "brightness-100"
          }`}
        />
        <p
          className={`text-lg font-bold ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          COTCO Admin
        </p>
      </div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key || item.path} className="px-2">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md text-left transition-colors
                      ${
                        theme === "light"
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-300 hover:bg-[#0085C8]"
                      } ${
                      openMenus[item.key] ? "font-semibold" : "font-normal"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-white">
                      {item.icon}
                      {item.label}
                    </div>
                    <ChevronRight
                      style={{
                        color:"#fff"
                      }}
                      size={16}
                      className={`transition-transform ${
                        openMenus[item.key] ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {openMenus[item.key] && (
                    <ul className="pl-6 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink to={subItem.path}>
                            <span>{subItem.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={item.path}>
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------- Footer ---------- */}
      <div
        className={`p-4 border-t text-center ${
          theme === "light" ? "border-gray-200" : "border-gray-700"
        }`}
      >
        <p
          className={`text-xs ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {t.footerLabel}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
