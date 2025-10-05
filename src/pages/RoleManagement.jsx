import React, { useEffect, useState } from "react";
import { createRole, getRoles, updateRole, deleteRole } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import { Edit2, Trash2, Plus } from "lucide-react";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const defaultPermissions = {
    users: { create: false, read: false, update: false, delete: false },
    machines: { create: false, read: false, update: false, delete: false },
    pages: { create: false, read: false, update: false, delete: false },
    settings: { update: false },
    contactEntries: { read: false, delete: false },
    resources: { create: false, read: false, update: false, delete: false },
  };

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    permissions: defaultPermissions,
  });

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data);
    } catch (err) {
      console.error(err);
      CommonToaster("Failed to load roles ❌", "error");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (group, key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [group]: {
          ...prev.permissions[group],
          [key]: !prev.permissions[group][key],
        },
      },
    }));
  };

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
        permissions: defaultPermissions,
      });
      fetchRoles();
    } catch (err) {
      console.error(err);
      CommonToaster("Failed to save role ❌", "error");
    }
  };

  const handleEdit = (role) => {
    setFormData({
      name: role.name,
      status: role.status,
      permissions: role.permissions,
    });
    setEditId(role._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      CommonToaster("Role deleted successfully ✅", "success");
      fetchRoles();
    } catch (err) {
      console.error(err);
      CommonToaster("Failed to delete role ❌", "error");
    }
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
        <h2 className="text-2xl font-bold">Role Management</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#0085C8] hover:bg-[#009FE3] transition text-white rounded-md"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Add Role
        </button>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto border border-[#2E2F2F] rounded-lg shadow-sm">
        <table className="w-full divide-y divide-[#2E2F2F]">
          <thead className="bg-[#1F1F1F]">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                Sl
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300">
                Status
              </th>
              <th className="p-3 text-center text-sm font-semibold text-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => (
              <tr
                key={role._id}
                className="hover:bg-[#2A2A2A] transition-colors border-b border-[#2E2F2F]"
              >
                <td className="p-3 text-gray-300">{i + 1}</td>
                <td className="p-3 text-white">{role.name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      role.status === "Active"
                        ? "bg-green-700/30 text-green-400"
                        : "bg-red-700/30 text-red-400"
                    }`}
                  >
                    {role.status}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(role)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-[#0085C8] rounded-md hover:bg-[#009FE3] transition"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-top justify-center z-50 overflow-auto">
          <div className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-xl p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editId ? "Edit Role" : "Add Role"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Status *</label>
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

              {/* Permissions */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Permissions
                </label>
                {Object.keys(formData.permissions).map((group) => (
                  <div key={group} className="mb-3">
                    <h4 className="font-medium capitalize mb-2 text-gray-200">
                      {group}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(formData.permissions[group]).map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 bg-[#1F1F1F] px-3 py-1 rounded-md border border-[#2E2F2F]"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions[group][perm]}
                            onChange={() =>
                              handlePermissionChange(group, perm)
                            }
                            className="accent-[#0085C8]"
                          />
                          <span className="text-gray-300">
                            {perm.charAt(0).toUpperCase() + perm.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2E2F2F]">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                  className="px-4 py-2 border border-[#2E2F2F] text-gray-300 rounded-md hover:bg-[#2E2F2F] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0085C8] text-white rounded-md hover:bg-[#009FE3] transition"
                >
                  {editId ? "Update Role" : "Create Role"}
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
