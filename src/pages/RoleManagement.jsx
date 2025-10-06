import React, { useEffect, useState } from "react";
import { createRole, getRoles, updateRole, deleteRole } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Switch } from "antd";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // ✅ Sidebar structure matching Sidebar.jsx
  const sidebarMenu = [
    { key: "dashboard", label: "Dashboard" },
    {
      key: "resources",
      label: "Resources",
      subItems: [
        { key: "maincategories", label: "Main Categories" },
        { key: "categories", label: "Categories" },
        { key: "resources", label: "All Resources" },
      ],
    },
    {
      key: "machines",
      label: "Machines",
      subItems: [
        { key: "machineCategories", label: "Categories" },
        { key: "machineList", label: "List" },
      ],
    },
    {
      key: "cms",
      label: "CMS Settings",
      subItems: [
        { key: "header", label: "Header" },
        { key: "footer", label: "Footer" },
        { key: "home", label: "Home" },
        { key: "about", label: "About" },
        { key: "cotton", label: "Cotton" },
        { key: "fiber", label: "Fiber" },
        { key: "contact", label: "Contact" },
        { key: "privacy", label: "Privacy Policy" },
        { key: "terms", label: "Terms & Conditions" },
      ],
    },
    {
      key: "users",
      label: "Manage Staffs",
      subItems: [
        { key: "roles", label: "Roles" },
        { key: "staff", label: "Users" },
      ],
    },
    { key: "enquiry", label: "Enquiry Details" },
  ];

  const generateDefaultPermissions = () => {
    const perms = {};
    sidebarMenu.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          perms[sub.key] = false;
        });
      } else {
        perms[item.key] = false;
      }
    });
    return perms;
  };

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    permissions: generateDefaultPermissions(),
  });

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data);
    } catch (err) {
      CommonToaster("Failed to load roles ❌", "error");
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setIsSuperAdmin(parsed?.role?.name === "Super Admin");
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePermission = (key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      CommonToaster("Only Super Admin can create or update roles ❌", "error");
      return;
    }

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
    if (role.name === "Super Admin") {
      CommonToaster("You cannot edit the Super Admin role ❌", "error");
      return;
    }
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
    if (name === "Super Admin") {
      CommonToaster("Super Admin cannot be deleted ❌", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      CommonToaster("Role deleted successfully ✅", "success");
      fetchRoles();
    } catch {
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
  };

  return (
    <div className="p-6 bg-[#171717] text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Role Management</h2>

        {isSuperAdmin && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#0085C8] hover:bg-[#009FE3] transition text-white rounded-md"
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
            <Plus size={16} /> Add Role
          </button>
        )}
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
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{role.name}</td>
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
                    disabled={role.name === "Super Admin" || !isSuperAdmin}
                    className={`px-3 py-1 text-sm rounded-md ${
                      role.name === "Super Admin" || !isSuperAdmin
                        ? "bg-gray-600 cursor-not-allowed opacity-60"
                        : "bg-[#0085C8] hover:bg-[#009FE3]"
                    }`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(role._id, role.name)}
                    disabled={role.name === "Super Admin" || !isSuperAdmin}
                    className={`px-3 py-1 text-sm rounded-md ${
                      role.name === "Super Admin" || !isSuperAdmin
                        ? "bg-gray-600 cursor-not-allowed opacity-60"
                        : "bg-[#E74C3C] hover:bg-[#FF6B5C]"
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

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 overflow-auto">
          <div className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-3xl p-6 my-10 h-fit">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editId ? "Edit Role" : "Add Role"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Name *
                </label>
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
                <label className="block text-sm mb-1 text-gray-300">
                  Status *
                </label>
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

              {/* Sidebar Access */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Sidebar Access
                </label>
                <div className="space-y-4 max-h-[400px] overflow-y-auto border border-[#2E2F2F] p-3 rounded-lg">
                  {sidebarMenu.map((item) => (
                    <div key={item.key}>
                      <div className="flex items-center justify-between bg-[#1F1F1F] px-3 py-2 rounded-md mb-2">
                        <span className="font-medium">{item.label}</span>
                      </div>

                      {item.subItems ? (
                        <div className="ml-4 space-y-2">
                          {item.subItems.map((sub) => (
                            <div
                              key={sub.key}
                              className="flex items-center justify-between bg-[#1F1F1F] px-3 py-2 rounded-md"
                            >
                              <span className="text-sm text-gray-300">
                                {sub.label}
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
                            {item.label}
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

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2E2F2F]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#2E2F2F] text-gray-300 rounded-md hover:bg-[#2E2F2F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0085C8] text-white rounded-md hover:bg-[#009FE3]"
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
