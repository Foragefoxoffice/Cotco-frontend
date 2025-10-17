import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  ChevronRight,
  Settings,
  Cog,
  UsersRound,
  NotepadTextDashed,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [openMenus, setOpenMenus] = useState({});

  /* ✅ Load permissions from logged-in user */
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      // setPermissions(parsed?.role?.permissions || {});
      const role = parsed?.role;
const roleName =
  typeof role?.name === "object" ? role.name.en || role.name.vi : role?.name;

if (roleName === "Super Admin") {
  // ✅ full access for legacy Super Admins
  setPermissions({
    dashboard: true,
    resources: true,
    machines: true,
    cms: true,
    users: true,
    roles: true,
    staff: true,
    enquiry: true,
    maincategories: true,
    categories: true,
    machineCategories: true,
    machineList: true,
    header: true,
    footer: true,
    home: true,
    about: true,
    cotton: true,
    fiber: true,
    contact: true,
    privacy: true,
    terms: true,
    machine: true, 
  });
} else {
  setPermissions(role?.permissions || {});
}

    }
  }, []);

  /* ✅ Detect language by body class */
  useEffect(() => {
    const checkLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* ✅ Translation dictionary */
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
    footerLabel: isVietnamese ? "Cotco Hệ thống quản trị" : "Cotco CMS",
    machine:isVietnamese ? "Máy Móc CMS" : "Machine CMS",
  };

  /* ✅ Menu items with permission keys */
 const menuItems = [
  {
    path: "/admin",
    key: "dashboard",
    label: t.dashboard,
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: t.newsEvents,
    key: "resources",
    icon: <Newspaper size={18} />,
    subItems: [
      {
        path: "/admin/resources/main-categories",
        label: t.maincategories,
        key: "maincategories", // ✅ unique key
      },
      {
        path: "/admin/resources/categories",
        label: t.categories,
        key: "categories", // ✅ unique key
      },
      {
        path: "/admin/resources",
        label: t.allNews,
        key: "resources", // ✅ unique key
      },
    ],
  },
  {
    label: t.machines,
    key: "machines",
    icon: <Cog size={18} />,
    subItems: [
      {
        path: "/admin/machines/categories",
        label: t.machineCategories,
        key: "machineCategories", // ✅ unique
      },
      {
        path: "/admin/machines/list",
        label: t.machineList,
        key: "machineList", // ✅ unique
      },
    ],
  },
  {
    label: t.cms,
    key: "cms",
    icon: <Settings size={18} />,
    subItems: [
      { path: "/admin/header", label: t.header, key: "header" },
      { path: "/admin/footer", label: t.footer, key: "footer" },
      { path: "/admin/home", label: t.home, key: "home" },
      { path: "/admin/about", label: t.about, key: "about" },
      { path: "/admin/cotton", label: t.cotton, key: "cotton" },
      { path: "/admin/fiber", label: t.fiber, key: "fiber" },
      { path: "/admin/machine", label: t.machine, key: "machine" },
      { path: "/admin/contact", label: t.contact, key: "contact" },
      { path: "/admin/privacy-policy", label: t.privacy, key: "privacy" },
      { path: "/admin/terms-conditions", label: t.terms, key: "terms" },
    ],
  },
  {
    label: t.roleManagement,
    key: "users",
    icon: <UsersRound size={18} />,
    subItems: [
      { path: "/admin/roles", label: t.roles, key: "roles" },
      { path: "/admin/staffmanagement", label: t.users, key: "staff" },
    ],
  },
  {
    path: "/admin/contacts",
    key: "enquiry",
    label: t.allContacts,
    icon: <NotepadTextDashed size={18} />,
  },
];


  /* ✅ Filter menu based on permissions */
  const filteredMenu = menuItems
    .map((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const visibleSubs = item.subItems.filter((sub) => permissions[sub.key]);
        if (visibleSubs.length > 0) return { ...item, subItems: visibleSubs };
        return null;
      } else {
        if (permissions[item.key]) return item;
        return null;
      }
    })
    .filter(Boolean);

  /* ✅ Toggle open/close */
  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ✅ NavLink */
  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    const activeClass = "bg-[#0085C8] text-white font-semibold";
    const inactiveClass = "text-gray-300 hover:bg-[#1E1E1E]";
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
          isActive ? activeClass : inactiveClass
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="w-64 h-full flex flex-col transition-colors duration-300 border-r bg-[#111111] border-gray-800 text-gray-200">
      {/* ---------- Logo ---------- */}
      <div className="p-5 flex flex-col items-center border-b border-gray-800">
        <img
          alt="Cotco Logo"
          src="/img/home/footerLogo.png"
          className="h-20 mb-2 transition filter brightness-100"
        />
        <p className="text-lg font-bold text-gray-200">COTCO Admin</p>
      </div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <ul className="space-y-1">
          {filteredMenu.map((item) => (
            <li key={item.key || item.path} className="px-2">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-full text-left transition-colors text-gray-300 hover:bg-[#1E1E1E] ${
                      openMenus[item.key] ? "font-semibold" : "font-normal"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${
                        openMenus[item.key] ? "rotate-90" : ""
                      }`}
                      style={{ color: "#fff" }}
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
      <div className="p-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-400">{t.footerLabel}</p>
      </div>
    </div>
  );
};

export default Sidebar;
