import React, { useEffect, useState } from "react";
import {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
  getRoles,
} from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import { Edit2, Trash2, Plus } from "lucide-react";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [languageTab, setLanguageTab] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffPerPage, setStaffPerPage] = useState(10);

  // ✅ Filter + Sort + Paginate Staff List
  const filteredStaff = staff
    .filter((s) => {
      const fullName = `${s.firstName?.en || ""} ${s.middleName?.en || ""} ${
        s.lastName?.en || ""
      }`.toLowerCase();
      const email = s.email?.toLowerCase() || "";
      const roleName =
        typeof s.role?.name === "object"
          ? (s.role?.name?.en || s.role?.name?.vi || "").toLowerCase()
          : (s.role?.name || "").toLowerCase();

      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        roleName.includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const nameA = `${a.firstName?.en || ""} ${
        a.lastName?.en || ""
      }`.toLowerCase();
      const nameB = `${b.firstName?.en || ""} ${
        b.lastName?.en || ""
      }`.toLowerCase();

      if (sortOption === "az") return nameA.localeCompare(nameB);
      if (sortOption === "za") return nameB.localeCompare(nameA);
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);
  const startIndex = (currentPage - 1) * staffPerPage;
  const paginatedStaff = filteredStaff.slice(
    startIndex,
    startIndex + staffPerPage
  );

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: { en: "", vi: "" },
    middleName: { en: "", vi: "" },
    lastName: { en: "", vi: "" },
    email: "",
    phone: "",
    status: "Active",
    role: "",
    department: { en: "", vi: "" },
    designation: { en: "", vi: "" },
    dateOfBirth: "",
    gender: "",
    dateOfJoining: "",
  });

  // ✅ Load logged in user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setCurrentUser(JSON.parse(userData));
  }, []);

  const isSuperAdmin =
    currentUser?.role?.name?.en === "Super Admin" ||
    currentUser?.role?.name?.vi === "Quản trị viên cao cấp" ||
    currentUser?.role?.name === "Super Admin";

  const fetchStaff = async () => {
    try {
      const res = await getUsers();
      setStaff(res.data.data || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
      CommonToaster("Failed to load staff ❌", "error");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      CommonToaster("Failed to load roles ❌", "error");
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle bilingual fields dynamically
    if (
      [
        "firstName",
        "middleName",
        "lastName",
        "department",
        "designation",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          [languageTab]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      firstName: { en: "", vi: "" },
      middleName: { en: "", vi: "" },
      lastName: { en: "", vi: "" },
      email: "",
      phone: "",
      status: "Active",
      role: "",
      department: { en: "", vi: "" },
      designation: { en: "", vi: "" },
      dateOfBirth: "",
      gender: "",
      dateOfJoining: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      return CommonToaster(
        "Only Super Admin can add or update staff ❌",
        "error"
      );
    }

    try {
      const payload = {
        employeeId: formData.employeeId,
        firstName: formData.firstName, // { en, vi }
        middleName: formData.middleName, // { en, vi }
        lastName: formData.lastName, // { en, vi }
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        department: formData.department, // { en, vi }
        designation: formData.designation, // { en, vi }
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        dateOfJoining: formData.dateOfJoining,
      };

      if (editId) {
        await updateUser(editId, payload);
        CommonToaster("Staff updated successfully ✅", "success");
      } else {
        await registerUser({
          ...payload,
          roleId: formData.role,
        });
        CommonToaster("Staff added successfully ✅", "success");
      }

      fetchStaff();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving staff:", err);
      CommonToaster("Failed to save staff ❌", "error");
    }
  };

  const [isVietnamese, setIsVietnamese] = useState(false);

  // Watch for changes in body class
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };

    // Initial check
    checkLang();

    // Observe body class changes
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const payload = {
    employeeId: formData.employeeId,
    nameEn: `${formData.firstNameEn} ${formData.middleNameEn || ""} ${
      formData.lastNameEn || ""
    }`.trim(),
    nameVi: `${formData.firstNameVi} ${formData.middleNameVi || ""} ${
      formData.lastNameVi || ""
    }`.trim(),
    email: formData.email,
    phone: formData.phone,
    role: formData.role,
    status: formData.status,
    departmentEn: formData.departmentEn,
    departmentVi: formData.departmentVi,
    designationEn: formData.designationEn,
    designationVi: formData.designationVi,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender,
    dateOfJoining: formData.dateOfJoining,
  };

  const handleDelete = async (id, name) => {
    if (!isSuperAdmin) {
      return CommonToaster("Only Super Admin can delete staff ❌", "error");
    }
    if (name?.toLowerCase().includes("super admin")) {
      return CommonToaster("Cannot delete Super Admin user ❌", "error");
    }

    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await deleteUser(id);
      CommonToaster("Staff deleted successfully ✅", "success");
      fetchStaff();
    } catch (err) {
      console.error("Error deleting staff:", err);

      if (err.response?.status === 403) {
        CommonToaster(
          "Access Denied: Only Super Admin can delete staff ❌",
          "error"
        );
      } else if (err.code === "ERR_NETWORK") {
        CommonToaster(
          "Server not reachable. Please check backend connection ❌",
          "error"
        );
      } else {
        CommonToaster("Failed to delete staff ❌", "error");
      }
    }
  };

  const handleEdit = (s) => {
    if (!isSuperAdmin) {
      return CommonToaster("Only Super Admin can edit staff ❌", "error");
    }
    if (s.role?.name === "Super Admin") {
      return CommonToaster("Super Admin cannot be edited ❌", "error");
    }

    setFormData({
      employeeId: s.employeeId || "",
      firstName: s.firstName || { en: "", vi: "" },
      middleName: s.middleName || { en: "", vi: "" },
      lastName: s.lastName || { en: "", vi: "" },
      email: s.email || "",
      phone: s.phone || "",
      status: s.status || "Active",
      role: s.role?._id || "",
      department: s.department || { en: "", vi: "" },
      designation: s.designation || { en: "", vi: "" },
      dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split("T")[0] : "",
      gender: s.gender || "",
      dateOfJoining: s.dateOfJoining ? s.dateOfJoining.split("T")[0] : "",
    });

    setEditId(s._id);
    setShowModal(true);
  };

  const inputStyle = {
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    transition: "all 0.3s ease",
  };

  return (
    <div className="p-6 bg-[#171717] text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isVietnamese ? "Quản lý nhân viên" : "Staff Management"}
        </h2>

        {/* 🔍 Search + Sort Bar */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <input
            type="text"
            placeholder={isVietnamese ? "Tìm kiếm..." : "Search staff..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#262626] border border-[#2E2F2F] rounded-full px-4 py-2 text-sm text-white w-56"
          />

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 transition-all cursor-pointer"
            >
              {sortOption === "oldest"
                ? "Oldest"
                : sortOption === "newest"
                ? "Newest"
                : sortOption === "az"
                ? "A → Z"
                : "Z → A"}
              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${
                  showDropdown ? "rotate-180" : ""
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
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-10">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "az", label: "A → Z" },
                  { value: "za", label: "Z → A" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === option.value
                        ? "bg-[#2E2F2F] text-white"
                        : "text-gray-300 hover:bg-[#2E2F2F] hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#0085C8] hover:bg-[#009FE3] transition text-white rounded-full cursor-pointer"
          >
            <Plus size={16} />
            {isVietnamese ? "Thêm nhân viên" : "Add Staff"}
          </button>
        )}
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto border border-[#2E2F2F] rounded-lg shadow-sm">
        <table className="w-full divide-y divide-[#2E2F2F]">
          <thead className="bg-[#1F1F1F]">
            <tr>
              {(isVietnamese
                ? [
                    "STT", // Sl
                    "Mã nhân viên", // Employee ID
                    "Họ và tên", // Name
                    "Email", // Email
                    "Số điện thoại", // Mobile
                    "Chức vụ", // Role
                    "Phòng ban", // Department
                    "Chức danh", // Designation
                    "Trạng thái", // Status
                    "Hành động", // Action
                  ]
                : [
                    "Sl",
                    "Employee ID",
                    "Name",
                    "Email",
                    "Mobile",
                    "Role",
                    "Department",
                    "Designation",
                    "Status",
                    "Action",
                  ]
              ).map((h) => (
                <th
                  key={h}
                  className="p-3 text-left text-sm font-semibold text-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedStaff.length > 0 ? (
              paginatedStaff.map((s, i) => (
                <tr
                  key={s._id}
                  className="hover:bg-[#2A2A2A] transition-colors border-b border-[#2E2F2F]"
                >
                  <td className="p-3 text-gray-300">{startIndex + i + 1}</td>
                  <td className="p-3 text-gray-200">{s.employeeId}</td>
                  <td className="p-3">
                    {isVietnamese
                      ? `${s.firstName?.vi || "-"} ${s.middleName?.vi || ""} ${
                          s.lastName?.vi || "-"
                        }`
                      : `${s.firstName?.en || "-"} ${s.middleName?.en || ""} ${
                          s.lastName?.en || "-"
                        }`}
                  </td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">
                    {typeof s.role?.name === "object"
                      ? isVietnamese
                        ? s.role?.name?.vi || s.role?.name?.en
                        : s.role?.name?.en || s.role?.name?.vi
                      : s.role?.name || "—"}
                  </td>
                  <td className="p-3">
                    {isVietnamese
                      ? s.department?.vi || "—"
                      : s.department?.en || "—"}
                  </td>
                  <td className="p-3">
                    {isVietnamese
                      ? s.designation?.vi || "—"
                      : s.designation?.en || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        s.status === "Active"
                          ? "bg-green-700/30 text-green-400"
                          : "bg-red-700/30 text-red-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 text-center">
                    <button
                      disabled={!isSuperAdmin || s.role?.name === "Super Admin"}
                      onClick={() => handleEdit(s)}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition ${
                        !isSuperAdmin || s.role?.name === "Super Admin"
                          ? "bg-gray-600 cursor-not-allowed text-gray-300"
                          : "bg-[#0085C8] hover:bg-[#009FE3] text-white"
                      }`}
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      disabled={
                        !isSuperAdmin ||
                        s.role?.name === "Super Admin" ||
                        s.role?.name?.en === "Super Admin" ||
                        s.role?.name?.vi === "Quản trị viên cao cấp"
                      }
                      onClick={() =>
                        handleDelete(
                          s._id,
                          typeof s.role?.name === "object"
                            ? s.role?.name?.en || s.role?.name?.vi
                            : s.role?.name
                        )
                      }
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition ${
                        !isSuperAdmin ||
                        s.role?.name === "Super Admin" ||
                        s.role?.name?.en === "Super Admin" ||
                        s.role?.name?.vi === "Quản trị viên cao cấp"
                          ? "bg-gray-600 cursor-not-allowed text-gray-300"
                          : "bg-[#E74C3C] hover:bg-[#FF6B5C] text-white"
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-6 text-gray-400">
                  {isVietnamese ? "Không có nhân viên nào" : "No staff found."}
                </td>
              </tr>
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
      className="px-4 py-2 bg-[#2E2F2F] rounded-full disabled:opacity-40 cursor-pointer"
    >
      Prev
    </button>
    <span className="text-sm text-gray-400">
      Page {currentPage} / {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-[#2E2F2F] rounded-full disabled:opacity-40 cursor-pointer"
    >
      Next
    </button>
  </div>
)}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-4xl p-6 my-10">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {isVietnamese
                ? editId
                  ? "Chỉnh sửa nhân viên"
                  : "Thêm nhân viên"
                : editId
                ? "Edit Staff"
                : "Add Staff"}
            </h3>

            {/* 🌐 Language Toggle */}
            <div className="flex justify-center items-center bg-[#2E2F2F] rounded-full p-1 w-fit ml-auto mb-6">
              {[
                { code: "en", label: "English (EN)" },
                { code: "vi", label: "Tiếng Việt (VN)" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguageTab(lang.code)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    languageTab === lang.code
                      ? "bg-white !text-black shadow-md"
                      : "bg-transparent text-gray-300 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              {/* Name (bilingual) */}
              {/* Names (bilingual) */}
              <div>
                <label className="block mb-1 text-gray-300">
                  {languageTab === "en"
                    ? "First Name (English)"
                    : "Họ (Tiếng Việt)"}{" "}
                  *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName?.[languageTab] || ""}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">
                  {languageTab === "en"
                    ? "Middle Name (English)"
                    : "Tên đệm (Tiếng Việt)"}
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName?.[languageTab] || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">
                  {languageTab === "en"
                    ? "Last Name (English)"
                    : "Tên (Tiếng Việt)"}{" "}
                  *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName?.[languageTab] || ""}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Email + Employee ID */}
              <div>
                <label className="block mb-1 text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Mobile + Role */}
              <div>
                <label className="block mb-1 text-gray-300">Mobile *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">
                  {languageTab === "en" ? "Role" : "Vai trò"} *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">
                    {languageTab === "en"
                      ? "-- Select Role --"
                      : "-- Chọn vai trò --"}
                  </option>

                  {roles
                    .filter(
                      (r) =>
                        r.name?.en !== "Super Admin" &&
                        r.name?.vi !== "Quản trị viên cao cấp"
                    )
                    .map((role) => (
                      <option key={role._id} value={role._id}>
                        {/* ✅ Auto-switch between languages */}
                        {typeof role.name === "object"
                          ? languageTab === "vi"
                            ? role.name?.vi || role.name?.en
                            : role.name?.en || role.name?.vi
                          : role.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Department (bilingual) */}
              <div>
                <label className="block mb-1 text-gray-300">
                  {languageTab === "en"
                    ? "Department (English)"
                    : "Phòng ban (Tiếng Việt)"}{" "}
                  *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department?.[languageTab] || ""}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Designation (bilingual) */}
              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">
                  {languageTab === "en"
                    ? "Designation (English)"
                    : "Chức vụ (Tiếng Việt)"}{" "}
                  *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation?.[languageTab] || ""}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* DOB + Gender + DOJ */}
              <div>
                <label className="block mb-1 text-gray-300">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-300">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 text-gray-300">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="col-span-3 flex justify-end gap-3 pt-4 border-t border-[#2E2F2F] mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-[#2E2F2F] text-gray-300 rounded-md hover:bg-[#2E2F2F] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isSuperAdmin}
                  className={`px-4 py-2 rounded-md transition ${
                    isSuperAdmin
                      ? "bg-[#0085C8] text-white hover:bg-[#009FE3]"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {editId ? "Update Staff" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
