import React, { useEffect, useState } from "react";
import { Cpu, Plus, Edit2, Trash2 } from "lucide-react";
import { Modal, Button, Spin, Tag, Popconfirm } from "antd";
import MachineCategoryCreate from "../components/forms/MachineCategoryCreate";
import MachineCategoryEdit from "../components/forms/MachineCategoryEdit";
import { getMachineCategories, deleteMachineCategory } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

// ✅ Helper to get full image URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

const getFullImageURL = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) path = "/" + path;
  return `${BASE_URL}${path}`;
};

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

  // ✅ Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getMachineCategories();

      const fetched = res.data.data || [];

      // Normalize image paths to full URLs
      const fixed = fetched.map((cat) => ({
        ...cat,
        image: getFullImageURL(cat.image),
        icon: getFullImageURL(cat.icon),
        createMachineCatBgImage: getFullImageURL(cat.createMachineCatBgImage),
      }));

      setCategories(fixed);
    } catch (err) {
      console.error("❌ Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteMachineCategory(id);

      CommonToaster(
        isVietnamese
          ? "Xóa danh mục máy thành công"
          : "Machine category deleted successfully",
        "success"
      );

      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      CommonToaster(
        isVietnamese
          ? "Xóa danh mục máy thất bại"
          : "Failed to delete machine category",
        "error"
      );
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Language text map
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
      <style>{`
        .ant-modal .ant-modal-close-x {
          color: #fff;
        }
        .ant-modal-close {
          background-color: red !important;
          border-radius: 50% !important;
          color: white !important;
        }
      `}</style>

      {/* Header */}
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

      {/* Category list */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400">{lang.noCats}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .slice()
            .reverse()
            .map((category) => (
              <div
                key={category._id}
                className="bg-[#171717] rounded-lg shadow-sm border border-[#2E2F2F] overflow-hidden hover:shadow-md transition-transform transform hover:-translate-y-1 duration-200 group "
              >
                <div className="h-48 overflow-hidden">
                  {category.image ? (
                    <img
                      src={getFullImageURL(category.image)}
                      alt={
                        isVietnamese
                          ? category.name?.vi || ""
                          : category.name?.en || ""
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#222] text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white flex items-center">
                        {isVietnamese
                          ? category.name?.vi || category.slug
                          : category.name?.en || category.slug}
                      </h3>
                    </div>

                    <p
                      className="text-sm text-white"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {isVietnamese
                        ? category.description?.vi || ""
                        : category.description?.en || ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
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

      {/* 🟦 Create Modal */}
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
          isVietnamese={isVietnamese}
          onSuccess={() => {
            setTimeout(fetchCategories, 500);
            setIsCreateModalOpen(false);
            CommonToaster(
              isVietnamese
                ? "Danh mục máy đã được tạo thành công"
                : "Machine category created successfully",
              "success"
            );
          }}
        />
      </Modal>

      {/* 🟩 Edit Modal */}
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
            isVietnamese={isVietnamese}
            onSuccess={() => {
              fetchCategories();
              setIsEditModalOpen(false);
              CommonToaster(
                isVietnamese
                  ? "Cập nhật danh mục máy thành công"
                  : "Machine category updated successfully",
                "success"
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
