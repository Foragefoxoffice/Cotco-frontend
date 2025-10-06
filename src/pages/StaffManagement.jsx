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

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
    role: "",
    department: "",
    dateOfBirth: "",
    gender: "",
    dateOfJoining: "",
    designation: "",
  });

  // ✅ Load logged in user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setCurrentUser(JSON.parse(userData));
  }, []);

  const isSuperAdmin = currentUser?.role?.name === "Super Admin";

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        department: formData.department,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        dateOfJoining: formData.dateOfJoining,
        designation: formData.designation,
      };

      if (editId) {
        await updateUser(editId, payload);
        CommonToaster("Staff updated successfully ✅", "success");
      } else {
        await registerUser({
          ...payload,
          password: formData.password,
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

  const resetForm = () => {
    setFormData({
      employeeId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      status: "Active",
      role: "",
      department: "",
      dateOfBirth: "",
      gender: "",
      dateOfJoining: "",
      designation: "",
    });
    setEditId(null);
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
      CommonToaster("Failed to delete staff ❌", "error");
    }
  };

  const handleEdit = (s) => {
    if (!isSuperAdmin) {
      return CommonToaster("Only Super Admin can edit staff ❌", "error");
    }
    if (s.role?.name === "Super Admin") {
      return CommonToaster("Super Admin cannot be edited ❌", "error");
    }

    const [firstName, middleName, ...rest] = s.name.split(" ");
    setFormData({
      employeeId: s.employeeId,
      firstName: firstName || "",
      middleName: middleName || "",
      lastName: rest.join(" "),
      email: s.email,
      phone: s.phone,
      status: s.status,
      role: s.role?._id || "",
      password: "",
      department: s.department || "",
      dateOfBirth: s.dateOfBirth || "",
      gender: s.gender || "",
      dateOfJoining: s.dateOfJoining || "",
      designation: s.designation || "",
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
        <h2 className="text-2xl font-bold">Staff Management</h2>

        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0085C8] hover:bg-[#009FE3] transition text-white rounded-md"
          >
            <Plus size={16} /> Add Staff
          </button>
        )}
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto border border-[#2E2F2F] rounded-lg shadow-sm">
        <table className="w-full divide-y divide-[#2E2F2F]">
          <thead className="bg-[#1F1F1F]">
            <tr>
              {[
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
              ].map((h) => (
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
            {staff.map((s, i) => (
              <tr
                key={s._id}
                className="hover:bg-[#2A2A2A] transition-colors border-b border-[#2E2F2F]"
              >
                <td className="p-3 text-gray-300">{i + 1}</td>
                <td className="p-3 text-gray-200">{s.employeeId}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.role?.name || "—"}</td>
                <td className="p-3">{s.department || "—"}</td>
                <td className="p-3">{s.designation || "—"}</td>
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
                <td className="p-3 flex gap-2">
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
                    disabled={!isSuperAdmin || s.role?.name === "Super Admin"}
                    onClick={() => handleDelete(s._id, s.role?.name)}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition ${
                      !isSuperAdmin || s.role?.name === "Super Admin"
                        ? "bg-gray-600 cursor-not-allowed text-gray-300"
                        : "bg-[#E74C3C] hover:bg-[#FF6B5C] text-white"
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-4xl p-6 my-10">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editId ? "Edit Staff" : "Add Staff"}
            </h3>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              {/* Names */}
              <div>
                <label className="block mb-1 text-gray-300">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
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
                <label className="block mb-1 text-gray-300">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">-- Select Role --</option>
                  {roles
                    .filter((r) => r.name !== "Super Admin")
                    .map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Department + Designation */}
              <div>
                <label className="block mb-1 text-gray-300">Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
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

              {/* Status + Password */}
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

              {!editId && (
                <div className="col-span-2">
                  <label className="block mb-1 text-gray-300">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              )}

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
