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

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
    role: "",
  });

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
    try {
      if (editId) {
        await updateUser(editId, {
          employeeId: formData.employeeId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
        });
        CommonToaster("Staff updated successfully ✅", "success");
      } else {
        await registerUser({
          employeeId: formData.employeeId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          roleId: formData.role,
          status: formData.status,
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
      lastName: "",
      email: "",
      phone: "",
      password: "",
      status: "Active",
      role: "",
    });
    setEditId(null);
  };

  const handleDelete = async (id) => {
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
    const [firstName, ...lastNameParts] = (s.name || "").split(" ");
    setFormData({
      employeeId: s.employeeId || "",
      firstName,
      lastName: lastNameParts.join(" "),
      email: s.email,
      phone: s.phone,
      password: "",
      status: s.status || "Active",
      role: s.role?._id || "",
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
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0085C8] hover:bg-[#009FE3] transition text-white rounded-md"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto border border-[#2E2F2F] rounded-lg shadow-sm">
        <table className="w-full divide-y divide-[#2E2F2F]">
          <thead className="bg-[#1F1F1F]">
            <tr>
              {["Sl", "Employee ID", "Name", "Email", "Mobile", "Role", "Status", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="p-3 text-left text-sm font-semibold text-gray-300"
                  >
                    {h}
                  </th>
                )
              )}
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
                    onClick={() => handleEdit(s)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-[#0085C8] rounded-md hover:bg-[#009FE3] transition"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-[#E74C3C] rounded-md hover:bg-[#FF6B5C] transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editId ? "Edit Staff" : "Add Staff"}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {/* Employee ID */}
              <div className="col-span-2">
                <label className="block mb-1 text-gray-300">Employee ID *</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

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

              {/* Email & Phone */}
              <div>
                <label className="block mb-1 text-gray-300">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
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

              {/* Password (only for add) */}
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

              {/* Status & Role */}
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

              <div>
                <label className="block mb-1 text-gray-300">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-[#2E2F2F]">
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
                  className="px-4 py-2 bg-[#0085C8] text-white rounded-md hover:bg-[#009FE3] transition"
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
