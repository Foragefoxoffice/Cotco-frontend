import React, { useState, useEffect } from "react";
import { Bell, User, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TranslateToggle from "./TranslateToggle";
import { getUserById, updatePassword } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

const Header = () => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Watch body class for language toggle
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

  // ✅ Load logged-in user details from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const fullName =
          parsedUser?.name || parsedUser?.username || "Admin User";
        const firstName = fullName.split(" ")[0];
        setUserName(firstName);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  // ✅ Fetch user details (real API call)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?._id || parsedUser?.id;
        if (!userId) return;

        const response = await getUserById(userId);
        if (response?.data?.data) setUserDetails(response.data.data);
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  // ✅ Translations
  const t = {
    dashboard: isVietnamese ? "Bảng điều khiển" : "Admin Dashboard",
    notifications: isVietnamese ? "Thông báo" : "Notifications",
    markAll: isVietnamese ? "Đánh dấu tất cả đã đọc" : "Mark all as read",
    profile: isVietnamese ? "Hồ sơ" : "Profile",
    viewProfile: isVietnamese ? "Xem hồ sơ" : "View Profile",
    changePassword: isVietnamese ? "Đổi mật khẩu" : "Change Password",
    signout: isVietnamese ? "Đăng xuất" : "Sign out",
  };

  // ✅ Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New contact form submission received",
      time: "10 minutes ago",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSignout = () => {
    localStorage.clear();
    setShowUserMenu(false);
    navigate("/login");
  };

  // ✅ Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return CommonToaster("All fields are required ⚠️", "error");
    }

    if (newPassword !== confirmPassword) {
      return CommonToaster("New passwords do not match ❌", "error");
    }

    try {
      await updatePassword({ currentPassword, newPassword });
      CommonToaster("Password updated successfully ✅", "success");
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      CommonToaster(
        error.response?.data?.error || "Failed to update password ❌",
        "error"
      );
    }
  };

  return (
    <header className="bg-[#171717] py-4 px-6 flex items-center justify-between sticky top-0 z-20 rounded-2xl">
      {/* ---------- LEFT: Title ---------- */}
      <div className="text-lg font-semibold text-white">{t.dashboard}</div>

      {/* ---------- RIGHT: Controls ---------- */}
      <div className="flex items-center space-x-4">
        <TranslateToggle />

        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-500 relative"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} className="text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.notifications}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {t.markAll}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-sm border-b ${
                      n.read ? "bg-gray-50" : "bg-white"
                    } text-gray-700`}
                  >
                    {n.message}
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
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
            <span className="ml-2 text-sm font-medium text-white hidden sm:block">
              {userName || "Admin User"}
            </span>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
              <ul className="py-1">
                <li
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {t.viewProfile}
                </li>
                <li
                  onClick={() => {
                    setShowChangePassword(true);
                    setShowUserMenu(false);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <Lock size={14} /> {t.changePassword}
                </li>
                <li
                  onClick={handleSignout}
                  className="px-4 py-2 text-red-600 cursor-pointer"
                >
                  {t.signout}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Profile Modal */}
      {showProfileModal && userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] text-white rounded-xl shadow-lg w-full max-w-md p-6 relative border border-gray-700">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
              👤 {t.profile}
            </h2>

            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400">Name:</span>{" "}
                {userDetails.name || "—"}
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{" "}
                {userDetails.email || "—"}
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{" "}
                {userDetails.phone || "—"}
              </p>
              <p>
                <span className="text-gray-400">Gender:</span>{" "}
                {userDetails.gender || "—"}
              </p>
              <p>
                <span className="text-gray-400">Employee ID:</span>{" "}
                {userDetails.employeeId || "—"}
              </p>
              <p>
                <span className="text-gray-400">Department:</span>{" "}
                {userDetails.department || "—"}
              </p>
              <p>
                <span className="text-gray-400">Designation:</span>{" "}
                {userDetails.designation || "—"}
              </p>
              <p>
                <span className="text-gray-400">Date of Birth:</span>{" "}
                {userDetails.dateOfBirth
                  ? new Date(userDetails.dateOfBirth).toLocaleDateString(
                      "en-GB"
                    )
                  : "—"}
              </p>

              <p>
                <span className="text-gray-400">Date of Joining:</span>{" "}
                {userDetails.dateOfJoining
                  ? new Date(userDetails.dateOfJoining).toLocaleDateString(
                      "en-GB"
                    )
                  : "—"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-[#0085C8] rounded-md hover:bg-[#009FE3]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] text-white rounded-xl shadow-lg w-full max-w-md p-6 relative border border-gray-700">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-md font-semibold mb-4 border-b border-gray-600 pb-2">
              🔒 Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white"
                  required
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-[#2E2F2F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0085C8] rounded-md hover:bg-[#009FE3]"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
