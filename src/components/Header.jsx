import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "New contact form submission received",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "Product 'Cotton Yarn' was updated",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      message: "New comment on news article 'Sustainable Fiber Innovation'",
      time: "5 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="bg-[#171717] text-white border border-[#2E2F2F]
                 py-4 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 rounded-2xl"
    >
      {/* Left side */}
      <div className="text-lg font-semibold text-white">
        Admin Dashboard
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* <ThemeToggle /> */}
        <LanguageSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full border hover:bg-white hover:text-black cursor-pointer relative transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 text-sm border-b border-gray-200 dark:border-gray-700 
                               text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {n.message}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {n.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="ml-2 text-sm font-medium text-white hidden sm:block">
              Admin User
            </span>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <ul className="py-1">
                <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  Profile
                </li>
                <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  Account Settings
                </li>
                <li className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  Sign out
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
