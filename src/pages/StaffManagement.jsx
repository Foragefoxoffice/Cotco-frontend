import React, { useEffect, useState } from "react";
import {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
  getRoles,
} from "../Api/api";

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

  // ✅ Fetch staff list
  const fetchStaff = async () => {
    try {
      const res = await getUsers();
      setStaff(res.data.data || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  // ✅ Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  // ✅ Handle form input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update staff
        await updateUser(editId, {
          employeeId: formData.employeeId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
        });
      } else {
        // Register new staff
        await registerUser({
          employeeId: formData.employeeId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          roleId: formData.role,
          status: formData.status,
        });
      }

      fetchStaff();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving staff:", err.response?.data || err.message);
    }
  };

  // ✅ Reset form
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

  // ✅ Delete staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await deleteUser(id);
      fetchStaff();
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  // ✅ Edit staff
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Staff Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Sl</th>
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s, i) => (
            <tr key={s._id} className="text-center">
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{s.employeeId}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.phone}</td>
              <td className="border p-2">{s.role?.name || "—"}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded ${
                    s.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td className="border p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="text-blue-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded w-[600px]">
            <h3 className="text-lg font-bold mb-4">
              {editId ? "Edit Staff" : "Add Staff"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {/* Employee ID */}
              <div className="col-span-2">
                <label className="block">Employee ID *</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* First & Last Name */}
              <div>
                <label className="block">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Email & Mobile */}
              <div>
                <label className="block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block">Mobile *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Password */}
              {!editId && (
                <div className="col-span-2">
                  <label className="block">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
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

              {/* Submit */}
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? "Update" : "Submit"}
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
