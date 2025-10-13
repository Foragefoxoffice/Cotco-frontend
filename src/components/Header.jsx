import React, { useState, useEffect } from "react";
import { Bell, User, X, Lock, Eye, EyeOff, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TranslateToggle from "./TranslateToggle";
import { getMe, updatePassword } from "../Api/api";
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
    showCurrent: false,
    showNew: false,
    showConfirm: false,
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
        const response = await getMe(); // ✅ Uses /auth/me instead of /users/:id
        if (response?.data?.data) {
          setUserDetails(response.data.data);
        } else {
          console.warn("⚠️ No user data returned from /auth/me");
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);

        // Optional: handle unauthorized (e.g., token expired)
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
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
        <a
          href="https://cotco-vn.com/"
          target="_blank"
          className="text-white bg-[#0284c7] px-5 py-6 rounded-full leading-0"
        >
          {document.body.classList.contains("vi-mode")
            ? "Truy cập trang web"
            : "Visit Site"}
        </a>
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
            <div className="absolute right-0 mt-3 w-48 bg-[#171717] rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
              <ul className="pt-3">
                <li
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="px-4 py-2 text-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <Eye size={14}/>
                  {t.viewProfile}
                </li>
                <li
                  onClick={() => {
                    setShowChangePassword(true);
                    setShowUserMenu(false);
                  }}
                  className="px-4 py-2 text-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <Lock size={14} /> {t.changePassword}
                </li>
                <li
                  onClick={handleSignout}
                  className="px-4 py-2 text-red-500 cursor-pointer flex items-center gap-2"
                >
                  <LogOut size={14} />
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
              className="absolute top-3 right-3 text-white bg-red-600 rounded-full p-1 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* 🌐 Language Toggle */}
            <div className="flex justify-center items-center bg-[#2E2F2F] rounded-full p-1 w-fit mx-auto mb-5">
              {[
                { code: "en", label: "English (EN)" },
                { code: "vi", label: "Tiếng Việt (VN)" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    if (lang.code === "vi") {
                      document.body.classList.add("vi-mode");
                    } else {
                      document.body.classList.remove("vi-mode");
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    document.body.classList.contains("vi-mode") ===
                    (lang.code === "vi")
                      ? "bg-white !text-black shadow-md"
                      : "bg-transparent text-gray-300 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <h3 className="flex items-center justify-center gap-2 text-3xl font-semibold mb-4 border-b border-gray-600 pb-2 text-center">
              <User size={24} className="text-[#0085C8]" />
              {document.body.classList.contains("vi-mode")
                ? "Hồ sơ nhân viên"
                : "Staff Profile"}
            </h3>

            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Họ và tên:"
                    : "Name:"}
                </span>{" "}
                {document.body.classList.contains("vi-mode")
                  ? `${userDetails.firstName?.vi || ""} ${
                      userDetails.middleName?.vi || ""
                    } ${userDetails.lastName?.vi || ""}`.trim() || "—"
                  : `${userDetails.firstName?.en || ""} ${
                      userDetails.middleName?.en || ""
                    } ${userDetails.lastName?.en || ""}`.trim() || "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Email:"
                    : "Email:"}
                </span>{" "}
                {userDetails.email || "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Số điện thoại:"
                    : "Phone:"}
                </span>{" "}
                {userDetails.phone || "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Giới tính:"
                    : "Gender:"}
                </span>{" "}
                {userDetails.gender
                  ? document.body.classList.contains("vi-mode")
                    ? userDetails.gender === "Male"
                      ? "Nam"
                      : userDetails.gender === "Female"
                      ? "Nữ"
                      : "Khác"
                    : userDetails.gender
                  : "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Mã nhân viên:"
                    : "Employee ID:"}
                </span>{" "}
                {userDetails.employeeId || "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Phòng ban:"
                    : "Department:"}
                </span>{" "}
                {document.body.classList.contains("vi-mode")
                  ? userDetails.department?.vi || "—"
                  : userDetails.department?.en || "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Chức vụ:"
                    : "Designation:"}
                </span>{" "}
                {document.body.classList.contains("vi-mode")
                  ? userDetails.designation?.vi || "—"
                  : userDetails.designation?.en || "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Ngày sinh:"
                    : "Date of Birth:"}
                </span>{" "}
                {userDetails.dateOfBirth
                  ? new Date(userDetails.dateOfBirth).toLocaleDateString(
                      "en-GB"
                    )
                  : "—"}
              </p>

              <p>
                <span className="text-gray-400">
                  {document.body.classList.contains("vi-mode")
                    ? "Ngày gia nhập:"
                    : "Date of Joining:"}
                </span>{" "}
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
                className="px-6 py-3 bg-[#0085C8] rounded-full hover:bg-[#009FE3]"
              >
                {document.body.classList.contains("vi-mode") ? "Đóng" : "Close"}
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
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 bg-red-600 p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-md font-semibold mb-4 border-b border-gray-600 pb-2">
              Change Password
            </h2>

            {/* 👁️ Add show/hide logic */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showCurrent ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordForm({
                        ...passwordForm,
                        showCurrent: !passwordForm.showCurrent,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {passwordForm.showCurrent ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showNew ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordForm({
                        ...passwordForm,
                        showNew: !passwordForm.showNew,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {passwordForm.showNew ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordForm({
                        ...passwordForm,
                        showConfirm: !passwordForm.showConfirm,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {passwordForm.showConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-6 py-3 border border-gray-600 rounded-full hover:bg-[#2E2F2F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0085C8] rounded-full hover:bg-[#009FE3] cursor-pointer"
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
