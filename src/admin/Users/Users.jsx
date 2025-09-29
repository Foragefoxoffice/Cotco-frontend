import React, { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser } from "../../Api/action";
import "../../assets/css/users.css";

export default function Users() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load logged-in user & fetch users
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchUsers();
  }, []);

  // Input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add editor (admins only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await addUser(form);
      showNotification(res.data.message, "success");
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Error adding user",
        "error"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Error fetching users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete editor (admins only)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await deleteUser(id);
        showNotification(res.data.message, "success");
        fetchUsers();
      } catch (err) {
        showNotification(
          err.response?.data?.message || "Error deleting user",
          "error"
        );
      }
    }
  };

  // Toast notification
  const showNotification = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  return (
    <div className="users-container">
      {/* Header */}
      <div className="users-header">
        <h1 className="users-title">User Management</h1>
        <p className="users-subtitle">
          {currentUser?.role === "admin"
            ? "Admins can add and manage editors"
            : "Editors can only view the user list"}
        </p>
      </div>

      <div className="users-content">
        {/* Add User Card - ONLY for Admins */}
        {currentUser?.role === "admin" && (
          <div className="card add-user-card">
            <div className="card-header">
              <h2>Add New Editor</h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="user-form"
              autoComplete="off"
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <div className="spinner"></div>
                    Adding Editor...
                  </>
                ) : (
                  "Add Editor"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="card users-list-card">
          <div className="card-header">
            <h2>Existing Users ({users.length})</h2>
            <button
              onClick={fetchUsers}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="users-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>No users found</p>
              </div>
            ) : (
              <div className="users-table">
                {users.map((user) => (
                  <div key={user.id} className="user-row">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>

                    <div className="user-role">
                      <span
                        className="role-badge"
                        style={{
                          backgroundColor:
                            user.role === "admin" ? "#ef4444" : "#3b82f6",
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="user-actions">
                      {/* Only admins can delete, editors cannot */}
                      {currentUser?.role === "admin" &&
                        user.role !== "admin" && (
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            Delete
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
