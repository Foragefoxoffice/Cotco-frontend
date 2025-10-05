import React, { useEffect, useState } from "react";
import { createRole, getRoles, updateRole, deleteRole } from "../Api/api";

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
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle permission toggle
  const handlePermissionChange = (group, key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [group]: { ...prev.permissions[group], [key]: !prev.permissions[group][key] },
      },
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await updateRole(editId, formData);
      else await createRole(formData);

      setShowModal(false);
      setFormData({ name: "", status: "Active", permissions: defaultPermissions });
      setEditId(null);
      fetchRoles();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit role
  const handleEdit = (role) => {
    setFormData({
      name: role.name,
      status: role.status,
      permissions: role.permissions,
    });
    setEditId(role._id);
    setShowModal(true);
  };

  // Delete role
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      fetchRoles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Role Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Role
        </button>
      </div>

      {/* Roles Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Sl</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, i) => (
            <tr key={role._id} className="text-center">
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{role.name}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded ${
                    role.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {role.status}
                </span>
              </td>
              <td className="border p-2 flex justify-center gap-2">
                <button onClick={() => handleEdit(role)} className="text-blue-600">✏️</button>
                <button onClick={() => handleDelete(role._id)} className="text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex z-20 justify-center items-center">
          <div className="bg-white p-6 rounded w-[600px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editId ? "Edit Role" : "Add Role"}</h3>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="block mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="block mb-1">Status *</label>
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

              {/* Permissions */}
              <div className="mb-3">
                <label className="block font-semibold mb-2">Permissions</label>
                {Object.keys(formData.permissions).map((group) => (
                  <div key={group} className="mb-2">
                    <h4 className="font-medium capitalize mb-1">{group}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(formData.permissions[group]).map((perm) => (
                        <label key={perm} className="flex items-center gap-2 border p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.permissions[group][perm]}
                            onChange={() => handlePermissionChange(group, perm)}
                          />
                          <span>{perm.charAt(0).toUpperCase() + perm.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => { setShowModal(false); setEditId(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
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

export default RoleManagement;
