import React, { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TranslateToggle from "./TranslateToggle";

const Header = () => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Watch body class to detect Vietnamese mode
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ EN / VN text dictionary
  const t = {
    dashboard: isVietnamese ? "Bảng điều khiển" : "Admin Dashboard",
    notifications: isVietnamese ? "Thông báo" : "Notifications",
    markAll: isVietnamese ? "Đánh dấu tất cả đã đọc" : "Mark all as read",
    profile: isVietnamese ? "Hồ sơ" : "Profile",
    settings: isVietnamese ? "Cài đặt tài khoản" : "Account Settings",
    signout: isVietnamese ? "Đăng xuất" : "Sign out",
    user: isVietnamese ? "Người quản trị" : "Admin User",
  };

  // ✅ Notifications mock data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: isVietnamese
        ? "Nhận được biểu mẫu liên hệ mới"
        : "New contact form submission received",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: isVietnamese
        ? "Sản phẩm 'Sợi bông' đã được cập nhật"
        : "Product 'Cotton Yarn' was updated",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      message: isVietnamese
        ? "Có bình luận mới trong 'Đổi mới sợi bền vững'"
        : "New comment on 'Sustainable Fiber Innovation'",
      time: "5 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Signout handler
  const handleSignout = () => {
    localStorage.clear();
    setShowUserMenu(false);
    navigate("/login");
  };

  return (
    <header
      className="bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-[#2E2F2F]
                 py-4 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 rounded-2xl"
    >
      {/* ---------- LEFT: Title ---------- */}
      <div className="text-lg font-semibold text-gray-800 dark:text-white">
        {t.dashboard}
      </div>

      {/* ---------- RIGHT: Controls ---------- */}
      <div className="flex items-center space-x-4">
        {/* 🌐 Translate Toggle */}
        <TranslateToggle />

        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white 
                       cursor-pointer relative transition-colors duration-200"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 transition-all duration-200">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.notifications}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                  >
                    {t.markAll}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-sm border-b border-gray-200 dark:border-gray-700 
                               ${n.read ? "bg-gray-50 dark:bg-[#1e1e1e]" : "bg-white dark:bg-gray-900"}
                               text-gray-700 dark:text-gray-300 transition`}
                  >
                    {n.message}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 👤 User Menu */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {t.user}
            </span>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 transition-all duration-200">
              <ul className="py-1">
                <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  {t.profile}
                </li>
                <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  {t.settings}
                </li>
                <li
                  onClick={handleSignout}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                >
                  {t.signout}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
