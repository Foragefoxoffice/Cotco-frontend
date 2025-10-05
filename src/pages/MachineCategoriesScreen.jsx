import React, { useEffect, useState } from "react";
import { Cpu, Plus, Edit2, Trash2 } from "lucide-react"; // 🔹 removed Eye, added Trash2
import { Modal, Button, Spin, Tag, Popconfirm, message } from "antd"; // 🔹 added Popconfirm + message
import MachineCategoryCreate from "../components/forms/MachineCategoryCreate";
import MachineCategoryEdit from "../components/forms/MachineCategoryEdit";
import { getMachineCategories, deleteMachineCategory } from "../Api/api"; // 🔹 import delete API

const MachineCategoriesScreen = () => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getMachineCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteMachineCategory(id);
      message.success("Machine category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      message.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 p-6 bg-[#171717] dark:bg-gray-800 rounded-lg shadow-sm border border-[#2E2F2F] dark:border-gray-700">
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Machine Categories</h1>
          <Button
            icon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              backgroundColor: "#0085C8",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "500",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#009FE3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#0085C8")
            }
          >
            Add Machine Category
          </Button>
        </div>
      </div>

      {/* Machine Categories List */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-[#171717] rounded-lg shadow-sm border border-[#2E2F2F] dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-indigo-500/10 transition-shadow transform hover:-translate-y-1 duration-200 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`http://localhost:5000${category.image}`}
                  alt={category.name?.[activeLanguage] || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <Cpu size={20} className="mr-2 text-white" />
                    {category.name?.[activeLanguage] || category.slug}
                  </h3>
                </div>

                {/* Parent Main Category */}
                <p className="text-xs mb-2">
                  <Tag color="blue">
                    {category.mainCategory?.name?.[activeLanguage] ||
                      category.mainCategory?.slug}
                  </Tag>
                </p>

                <p className="text-sm text-white h-10">
                  {category.description?.[activeLanguage] || ""}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {/* Edit Button */}
                  <Button
                    size="small"
                    icon={<Edit2 size={14} />}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsEditModalOpen(true);
                    }}
                    style={{
                      backgroundColor: "#0085C8",
                      border: "none",
                      borderRadius: "6px",
                      color: "#fff",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#009FE3")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#0085C8")
                    }
                  >
                    Edit
                  </Button>

                  {/* Delete Button */}
                  <Popconfirm
                    title="Are you sure you want to delete this category?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleDelete(category._id)}
                  >
                    <Button
                      size="small"
                      icon={<Trash2 size={14} />}
                      style={{
                        backgroundColor: "#E74C3C",
                        border: "none",
                        borderRadius: "6px",
                        color: "#fff",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FF6B5C")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E74C3C")
                      }
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create */}
      <Modal
        title={
          <h2
            style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: "600",
              margin: 0,
              background: "#171717",
            }}
          >
            Create Machine Category
          </h2>
        }
        open={isCreateModalOpen}
        footer={null}
        onCancel={() => setIsCreateModalOpen(false)}
        destroyOnClose
        bodyStyle={{
          backgroundColor: "#171717",
          borderTop: "1px solid #2E2F2F",
        }}
        style={{
          backgroundColor: "#171717",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <MachineCategoryCreate
          onSuccess={() => {
            fetchCategories();
            setIsCreateModalOpen(false);
          }}
        />
      </Modal>

      {/* Modal: Edit */}
      <Modal
        title={
          <h2
            style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: "600",
              margin: 0,
              background: "#171717",
            }}
          >
            Edit Machine Category
          </h2>
        }
        open={isEditModalOpen}
        footer={null}
        onCancel={() => setIsEditModalOpen(false)}
        destroyOnClose
      >
        {selectedCategory && (
          <MachineCategoryEdit
            category={selectedCategory}
            onSuccess={() => {
              fetchCategories();
              setIsEditModalOpen(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default MachineCategoriesScreen;
