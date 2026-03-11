import React, { useEffect, useState, useMemo } from "react";
import { createRole, getRoles, updateRole, deleteRole } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "antd";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [modalLang, setModalLang] = useState("en");
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [status, setStatus] = useState("Active"); // default selected


  // 🌐 Translation helper
  const t = {
    az: isVietnamese ? "A → Z" : "A → Z",
    za: isVietnamese ? "Z → A" : "Z → A",
    newest: isVietnamese ? "Mới nhất" : "Newest",
    oldest: isVietnamese ? "Cũ nhất" : "Oldest",
    sortBy: isVietnamese ? "Sắp xếp theo" : "Sort by",
  };

  // ✅ Detect Language
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setStatusDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Sidebar Menu (matches actual Sidebar.jsx)
  const sidebarMenu = [
    {
      key: "dashboard",
      label: { en: "Dashboard", vi: "Bảng điều khiển" },
    },
    {
      key: "resources",
      label: { en: "Resources", vi: "Tài nguyên" },
      subItems: [
        { key: "maincategories", label: { en: "Main Categories", vi: "Danh mục chính" } },
        { key: "categories", label: { en: "Categories", vi: "Danh mục" } },
        { key: "resources", label: { en: "All Resources", vi: "Tất cả tài nguyên" } },
      ],
    },
    {
      key: "machines",
      label: { en: "Machines", vi: "Máy móc" },
      subItems: [
        { key: "machineCategories", label: { en: "Machine Categories", vi: "Danh mục máy móc" } },
        { key: "machineList", label: { en: "Machine List", vi: "Danh sách máy móc" } },
      ],
    },
    {
      key: "cms",
      label: { en: "CMS Settings", vi: "Cài đặt CMS" },
      subItems: [
        { key: "header", label: { en: "Header", vi: "Đầu trang" } },
        { key: "footer", label: { en: "Footer", vi: "Chân trang" } },
        { key: "home", label: { en: "Home", vi: "Trang chủ" } },
        { key: "about", label: { en: "About", vi: "Giới thiệu" } },
        { key: "cotton", label: { en: "Cotton", vi: "Bông" } },
        { key: "fiber", label: { en: "Fiber", vi: "Sợi" } },
        { key: "machine", label: { en: "Machine", vi: "Máy móc" } },
        { key: "contact", label: { en: "Contact", vi: "Liên hệ" } },
        { key: "privacy", label: { en: "Privacy Policy", vi: "Chính sách bảo mật" } },
        { key: "terms", label: { en: "Terms & Conditions", vi: "Điều khoản sử dụng" } },
        { key: "chatbot", label: { en: "Chatbot", vi: "Quản lý Chatbot" } },
      ],
    },
    {
      key: "users",
      label: { en: "User Management", vi: "Quản lý người dùng" },
      subItems: [
        { key: "roles", label: { en: "Roles", vi: "Vai trò" } },
        { key: "staff", label: { en: "Staff", vi: "Nhân viên" } },
      ],
    },
    {
      key: "enquiry",
      label: { en: "Enquiry Details", vi: "Chi tiết liên hệ" },
    },
  ];



  const generateDefaultPermissions = () => {
    const perms = {};
    sidebarMenu.forEach((item) => {
      if (item.subItems)
        item.subItems.forEach((sub) => (perms[sub.key] = false));
      else perms[item.key] = false;
    });
    return perms;
  };

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    permissions: generateDefaultPermissions(),
  });

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data);
    } catch {
      CommonToaster("Failed to load roles ❌", "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     const parsed = JSON.parse(userData);
  //     setIsSuperAdmin(parsed?.role?.name === "Super Admin");
  //   }
  // }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Search, Sort, Paginate
  const filteredRoles = useMemo(() => {
    let filtered = roles.filter((r) => {
      const name =
        typeof r.name === "object"
          ? (isVietnamese ? r.name.vi : r.name.en) || ""
          : r.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    filtered.sort((a, b) => {
      const getName = (r) =>
        typeof r.name === "object"
          ? (isVietnamese ? r.name.vi : r.name.en) || ""
          : r.name || "";
      const nameA = getName(a).toLowerCase();
      const nameB = getName(b).toLowerCase();

      if (sortOption === "az") return nameA.localeCompare(nameB);
      if (sortOption === "za") return nameB.localeCompare(nameA);
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

    return filtered;
  }, [roles, searchQuery, sortOption, isVietnamese]);

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
  const startIdx = (currentPage - 1) * rolesPerPage;
  const paginatedRoles = filteredRoles.slice(startIdx, startIdx + rolesPerPage);

  // ✅ Handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePermission = (key) =>
    setFormData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateRole(editId, formData);
        CommonToaster("Role updated successfully ✅", "success");
      } else {
        await createRole(formData);
        CommonToaster("Role created successfully ✅", "success");
      }
      setShowModal(false);
      setEditId(null);
      setFormData({
        name: "",
        status: "Active",
        permissions: generateDefaultPermissions(),
      });
      fetchRoles();
    } catch {
      CommonToaster("Failed to save role ❌", "error");
    }
  };

  const handleEdit = (role) => {
    const defaultPerms = generateDefaultPermissions();
    const mergedPerms = { ...defaultPerms, ...(role.permissions || {}) };
    setFormData({
      name: role.name,
      status: role.status,
      permissions: mergedPerms,
    });
    setEditId(role._id);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      CommonToaster("Role deleted successfully ✅", "success");
      fetchRoles();
    } catch {
      CommonToaster("Failed to delete role ❌", "error");
    }
  };

  // ✅ UI
  return (
    <div className="p-6 bg-[#171717] text-white min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">
          {isVietnamese ? "Quản lý vai trò" : "Role Management"}
        </h2>

        <div className="flex flex-wrap items-center gap-3 relative">
          {/* 🔍 Search */}
          <input
            type="text"
            placeholder={
              isVietnamese ? "Tìm kiếm vai trò..." : "Search roles..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#262626] border border-[#2E2F2F] rounded-full px-4 py-2 text-sm text-white w-56"
          />

          {/* 🧭 Sort Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 transition-all cursor-pointer"
            >
              {sortOption === "oldest"
                ? t.oldest
                : sortOption === "newest"
                  ? t.newest
                  : sortOption === "az"
                    ? t.az
                    : t.za}
              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${showDropdown ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-10 animate-fadeIn">
                <p className="px-4 text-gray-400 text-xs mt-2">{t.sortBy}</p>
                {[
                  { value: "newest", label: t.newest },
                  { value: "oldest", label: t.oldest },
                  { value: "az", label: t.az },
                  { value: "za", label: t.za },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${sortOption === option.value
                      ? "bg-[#2E2F2F] text-white rounded-xl"
                      : "text-gray-300 hover:bg-[#2E2F2F] hover:text-white rounded-xl"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#0085C8] hover:bg-[#009FE3] transition text-white rounded-full"
            onClick={() => {
              setShowModal(true);
              setEditId(null);
              setFormData({
                name: "",
                status: "Active",
                permissions: generateDefaultPermissions(),
              });
            }}
          >
            <Plus size={16} /> {isVietnamese ? "Thêm vai trò" : "Add Role"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#2E2F2F] rounded-lg shadow-sm">
        <table className="w-full divide-y divide-[#2E2F2F]">
          <thead className="bg-[#1F1F1F]">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                #
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                {isVietnamese ? "Tên vai trò" : "Name"}
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                {isVietnamese ? "Trạng thái" : "Status"}
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                {isVietnamese ? "Hành động" : "Action"}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  {isVietnamese ? "Không có vai trò nào" : "No roles found."}
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role, i) => (
                <tr
                  key={role._id}
                  className="hover:bg-[#2A2A2A] transition-colors border-b border-[#2E2F2F]"
                >
                  <td className="p-3">{startIdx + i + 1}</td>
                  <td className="p-3">
                    {typeof role.name === "object"
                      ? isVietnamese
                        ? role.name?.vi || "—"
                        : role.name?.en || "—"
                      : role.name || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${role.status === "Active"
                        ? "bg-green-700/30 text-green-400"
                        : "bg-red-700/30 text-red-400"
                        }`}
                    >
                      {document.body.classList.contains("vi-mode")
                        ? role.status === "Active"
                          ? "Hoạt động" // Vietnamese for Active
                          : "Không hoạt động" // Vietnamese for Inactive
                        : role.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-3">
                    {/* ✏️ Edit Button */}
                    <button
                      onClick={() => handleEdit(role)}
                      disabled={
                        role.name === "Super Admin" ||
                        role.name?.en === "Super Admin" ||
                        role.name?.vi === "Quản trị viên cao cấp"
                      }
                      className={`px-3 py-1 text-sm rounded-md ${role.name === "Super Admin" ||
                        role.name?.en === "Super Admin" ||
                        role.name?.vi === "Quản trị viên cao cấp"
                        ? "bg-gray-600 cursor-not-allowed opacity-60"
                        : "bg-[#0085C8] hover:bg-[#009FE3]"
                        }`}
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* 🗑 Delete Button */}
                    <button
                      onClick={() =>
                        handleDelete(
                          role._id,
                          typeof role.name === "object"
                            ? role.name?.en || role.name?.vi
                            : role.name
                        )
                      }
                      disabled={
                        role.name === "Super Admin" ||
                        role.name?.en === "Super Admin" ||
                        role.name?.vi === "Quản trị viên cao cấp"
                      }
                      className={`px-3 py-1 text-sm rounded-md ${role.name === "Super Admin" ||
                        role.name?.en === "Super Admin" ||
                        role.name?.vi === "Quản trị viên cao cấp"
                        ? "bg-gray-600 cursor-not-allowed opacity-60"
                        : "bg-[#E74C3C] hover:bg-[#FF6B5C]"
                        }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="py-2 px-4 rounded-full bg-[#2E2F2F] disabled:opacity-40 cursor-pointer"
          >
            {isVietnamese ? "Trước" : "Prev"}
          </button>

          <span className="text-sm text-gray-400">
            {isVietnamese ? "Trang" : "Page"} {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="py-2 px-4 rounded-full bg-[#2E2F2F] disabled:opacity-40 cursor-pointer"
          >
            {isVietnamese ? "Tiếp" : "Next"}
          </button>
        </div>
      )}

      {/* Modal (your existing one here) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 overflow-auto">
          <div className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-3xl p-6 my-10 h-fit">
            {/* 🌐 Language Toggle (for Role Name only) */}
            <div className="flex justify-center items-center bg-[#2E2F2F] rounded-full p-1 w-fit mx-auto mb-5">
              {[
                { code: "en", label: "English (EN)" },
                { code: "vi", label: "Tiếng Việt (VN)" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setModalLang(lang.code)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${modalLang === lang.code
                    ? "bg-white !text-black shadow-md"
                    : "bg-transparent text-gray-300 hover:text-white"
                    }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white text-center">
              {editId
                ? modalLang === "vi"
                  ? "Chỉnh sửa vai trò"
                  : "Edit Role"
                : modalLang === "vi"
                  ? "Thêm vai trò"
                  : "Add Role"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Name (Switches by Language) */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  {modalLang === "vi" ? "Tên vai trò" : "Role Name"} *
                </label>
                <input
                  type="text"
                  name={`name_${modalLang}`}
                  value={formData.name?.[modalLang] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: { ...prev.name, [modalLang]: e.target.value },
                    }))
                  }
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    width: "100%",
                  }}
                  placeholder={
                    modalLang === "vi"
                      ? "Nhập tên vai trò bằng tiếng Việt"
                      : "Enter role name in English"
                  }
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  {modalLang === "vi" ? "Trạng thái" : "Status"} *
                </label>
                <div className="relative status-dropdown-container">
                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatusDropdown((prev) => !prev);
                    }}
                    className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full
               bg-[#1F1F1F] border border-[#2E2F2F] text-white
               hover:border-gray-500 transition-all cursor-pointer w-full"
                  >
                    {status}

                    <svg
                      className={`ml-2 w-4 h-4 transform transition-transform ${statusDropdown ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {statusDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F]
                 border border-[#2E2F2F] shadow-lg z-10 animate-fadeIn w-full"
                    >
                      {/* Active */}
                      <button
                        onClick={() => {
                          setStatus("Active");
                          setStatusDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm
          ${status === "Active"
                            ? "bg-[#2E2F2F] text-white rounded-xl"
                            : "text-gray-300 hover:bg-[#2E2F2F] hover:text-white rounded-xl"
                          }`}
                      >
                        Active
                      </button>

                      {/* Inactive */}
                      <button
                        onClick={() => {
                          setStatus("Inactive");
                          setStatusDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm 
          ${status === "Inactive"
                            ? "bg-[#2E2F2F] text-white rounded-xl"
                            : "text-gray-300 hover:bg-[#2E2F2F] hover:text-white rounded-xl"
                          }`}
                      >
                        Inactive
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Sidebar Access */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  {modalLang === "vi"
                    ? "Quyền truy cập Sidebar"
                    : "Sidebar Access"}
                </label>
                <div className="space-y-4 max-h-[400px] overflow-y-auto border border-[#2E2F2F] p-3 rounded-lg">
                  {sidebarMenu.map((item) => (
                    <div key={item.key}>
                      <div className="flex items-center justify-between bg-[#1F1F1F] px-3 py-2 rounded-md mb-2">
                        <span className="font-medium">
                          {modalLang === "vi" ? item.label.vi : item.label.en}
                        </span>
                      </div>

                      {item.subItems ? (
                        <div className="ml-4 space-y-2">
                          {item.subItems.map((sub) => (
                            <div
                              key={sub.key}
                              className="flex items-center justify-between bg-[#1F1F1F] px-3 py-2 rounded-md"
                            >
                              <span className="text-sm text-gray-300">
                                {modalLang === "vi"
                                  ? sub.label.vi
                                  : sub.label.en}
                              </span>
                              <Switch
                                checked={formData.permissions[sub.key] || false}
                                onChange={() => togglePermission(sub.key)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-4 flex items-center justify-between bg-[#1F1F1F] px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-300">
                            {modalLang === "vi" ? item.label.vi : item.label.en}
                          </span>
                          <Switch
                            checked={formData.permissions[item.key] || false}
                            onChange={() => togglePermission(item.key)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2E2F2F]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-[#2E2F2F] text-gray-300 rounded-full hover:bg-[#2E2F2F]"
                >
                  {modalLang === "vi" ? "Hủy" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0085C8] text-white rounded-full hover:bg-[#009FE3]"
                >
                  {editId
                    ? modalLang === "vi"
                      ? "Cập nhật vai trò"
                      : "Update Role"
                    : modalLang === "vi"
                      ? "Tạo vai trò"
                      : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
