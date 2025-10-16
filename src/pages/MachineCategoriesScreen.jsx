import React, { useEffect, useState } from "react";
import { Cpu, Plus, Edit2, Trash2 } from "lucide-react";
import { Modal, Button, Spin, Tag, Popconfirm, message } from "antd";
import MachineCategoryCreate from "../components/forms/MachineCategoryCreate";
import MachineCategoryEdit from "../components/forms/MachineCategoryEdit";
import { getMachineCategories, deleteMachineCategory } from "../Api/api";

const MachineCategoriesScreen = () => {
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Detect language mode (linked to TranslateToggle)
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
      message.success(
        isVietnamese
          ? "Xóa danh mục máy thành công ✅"
          : "Machine category deleted successfully ✅"
      );
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      message.error(
        isVietnamese
          ? "Xóa danh mục máy thất bại ❌"
          : "Failed to delete category ❌"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const lang = {
    title: isVietnamese ? "Danh Mục Máy" : "Machine Categories",
    add: isVietnamese ? "Thêm Danh Mục Máy" : "Add Machine Category",
    edit: isVietnamese ? "Chỉnh sửa" : "Edit",
    delete: isVietnamese ? "Xóa" : "Delete",
    confirmDelete: isVietnamese
      ? "Bạn có chắc muốn xóa danh mục này không?"
      : "Are you sure you want to delete this category?",
    yes: isVietnamese ? "Có" : "Yes",
    no: isVietnamese ? "Không" : "No",
    createTitle: isVietnamese ? "Tạo Danh Mục Máy" : "Create Machine Category",
    editTitle: isVietnamese
      ? "Chỉnh Sửa Danh Mục Máy"
      : "Edit Machine Category",
    loading: isVietnamese ? "Đang tải..." : "Loading...",
    noCats: isVietnamese ? "Không có danh mục nào" : "No categories found",
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 p-6 bg-[#171717] rounded-lg shadow-sm border border-[#2E2F2F] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          {lang.title}
        </h1>

        <Button
          icon={<Plus size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            backgroundColor: "#0085C8",
            border: "none",
            borderRadius: "2rem",
            color: "#fff",
            fontWeight: "500",
            padding: "22px",
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
          {lang.add}
        </Button>
      </div>

      {/* Machine Categories List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400">{lang.noCats}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-[#171717] rounded-lg shadow-sm border border-[#2E2F2F] overflow-hidden hover:shadow-md transition-transform transform hover:-translate-y-1 duration-200 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`${category.image}`}
                  alt={
                    isVietnamese
                      ? category.name?.vi || ""
                      : category.name?.en || ""
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    {isVietnamese
                      ? category.name?.vi || category.slug
                      : category.name?.en || category.slug}
                  </h3>
                </div>

                {/* Parent Main Category */}
                <p className="text-xs mb-2">
                  <Tag color="blue">
                    {isVietnamese
                      ? category.mainCategory?.name?.vi ||
                        category.mainCategory?.slug
                      : category.mainCategory?.name?.en ||
                        category.mainCategory?.slug}
                  </Tag>
                </p>

                <p className="text-sm text-white h-10">
                  {isVietnamese
                    ? category.description?.vi || ""
                    : category.description?.en || ""}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {/* ✏️ Edit Button */}
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
                      borderRadius: "2rem",
                      padding: "20px",
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
                    {lang.edit}
                  </Button>

                  {/* 🗑 Delete Button */}
                  <Popconfirm
                    title={lang.confirmDelete}
                    okText={lang.yes}
                    cancelText={lang.no}
                    onConfirm={() => handleDelete(category._id)}
                  >
                    <Button
                      size="small"
                      icon={<Trash2 size={14} />}
                      style={{
                        backgroundColor: "#E74C3C",
                        border: "none",
                        borderRadius: "2rem",
                        padding: "20px",
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
                      {lang.delete}
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟦 Create Machine Category Modal */}
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
            {lang.createTitle}
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
      >
        <MachineCategoryCreate
          isVietnamese={isVietnamese} // 🔹 pass language state
          onSuccess={() => {
            fetchCategories();
            setIsCreateModalOpen(false);
            message.success(
              isVietnamese
                ? "Danh mục máy đã được tạo thành công ✅"
                : "Machine category created successfully ✅"
            );
          }}
        />
      </Modal>

      {/* 🟩 Edit Machine Category Modal */}
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
            {lang.editTitle}
          </h2>
        }
        open={isEditModalOpen}
        footer={null}
        onCancel={() => setIsEditModalOpen(false)}
        destroyOnClose
        bodyStyle={{
          backgroundColor: "#171717",
          borderTop: "1px solid #2E2F2F",
        }}
      >
        {selectedCategory ? (
          <MachineCategoryEdit
            category={selectedCategory}
            isVietnamese={isVietnamese} // 🔹 pass language state
            onSuccess={() => {
              fetchCategories();
              setIsEditModalOpen(false);
              message.success(
                isVietnamese
                  ? "Cập nhật danh mục máy thành công ✅"
                  : "Machine category updated successfully ✅"
              );
            }}
          />
        ) : (
          <div className="text-center text-gray-400 py-6">
            {isVietnamese ? "Đang tải dữ liệu..." : "Loading category data..."}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MachineCategoriesScreen;
