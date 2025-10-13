import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import MainCategoryForm from "../components/forms/MainCategoryForm";
import { getMainBlogCategories, deleteBlogMainCategory } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

const NewsMainCategoriesScreen = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("oldest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 🧩 Delete confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // ✅ Detect language
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Translations
  const t = {
    title: isVietnamese ? "Danh mục Chính" : "Main Categories",
    subtitle: isVietnamese
      ? "Quản lý danh mục chính cho tin tức"
      : "Manage main categories for news",
    create: isVietnamese ? "Tạo danh mục chính" : "Create Main Category",
    edit: isVietnamese ? "Chỉnh sửa" : "Edit",
    sno: isVietnamese ? "STT" : "S.No",
    name: isVietnamese ? "Tên danh mục chính" : "Main Category Name",
    actions: isVietnamese ? "Hành động" : "Actions",
    search: isVietnamese ? "Tìm kiếm..." : "Search...",
    loading: isVietnamese ? "Đang tải danh mục..." : "Loading categories...",
    empty: isVietnamese
      ? "Không tìm thấy danh mục nào."
      : "No categories found.",
    sortBy: isVietnamese ? "Sắp xếp theo" : "Sort by",
    newest: isVietnamese ? "Mới nhất" : "Newest",
    oldest: isVietnamese ? "Cũ nhất" : "Oldest",
    az: isVietnamese ? "Tên A-Z" : "Name A-Z",
    za: isVietnamese ? "Tên Z-A" : "Name Z-A",
    deleteConfirmTitle: isVietnamese
      ? "Xác nhận xóa"
      : "Confirm Deletion",
    deleteConfirmText: isVietnamese
      ? "Bạn có chắc chắn muốn xóa danh mục chính này không? Hành động này không thể hoàn tác."
      : "Are you sure you want to delete this main category? This action cannot be undone.",
    cancel: isVietnamese ? "Hủy" : "Cancel",
    delete: isVietnamese ? "Xóa" : "Delete",
    deleteSuccess: isVietnamese
      ? "Xóa danh mục chính thành công"
      : "Main category deleted successfully",
    deleteFail: isVietnamese
      ? "Xóa danh mục chính thất bại"
      : "Failed to delete main category",
    loadFail: isVietnamese
      ? "Không thể tải danh mục chính"
      : "Failed to load main categories",
  };

  // ✅ Fetch main categories
  const fetchMainCategories = async () => {
    try {
      const res = await getMainBlogCategories();
      setMainCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching main categories:", err);
      CommonToaster(t.loadFail, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  // 🧩 Show custom confirmation modal
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteBlogMainCategory(categoryToDelete._id);
      CommonToaster(t.deleteSuccess, "success");
      fetchMainCategories();
    } catch (err) {
      console.error("Delete error:", err);
      CommonToaster(t.deleteFail, "error");
    } finally {
      setShowConfirmModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSave = async () => {
    fetchMainCategories();
    handleCloseForm();
  };

  // 🔹 Filter + Sort
  const filteredCategories = mainCategories.filter((cat) => {
    const name = isVietnamese ? cat.name?.vn || cat.name?.en : cat.name?.en;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const nameA = isVietnamese ? a.name?.vn || a.name?.en : a.name?.en;
    const nameB = isVietnamese ? b.name?.vn || b.name?.en : b.name?.en;
    if (sortOption === "az") return nameA.localeCompare(nameB);
    if (sortOption === "za") return nameB.localeCompare(nameA);
    if (sortOption === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  // 🔹 Pagination
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);

  return (
    <div className="min-h-screen p-6 text-white bg-[#171717] rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-300">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                backgroundColor: "#1F1F1F",
                border: "1px solid #2E2F2F",
                borderRadius: "9999px",
                color: "#fff",
                padding: "15px 14px 15px 38px",
                fontSize: "14px",
                width: "200px",
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 transition-all cursor-pointer"
            >
              {sortOption === "oldest"
                ? t.oldest
                : sortOption === "newest"
                ? t.newest
                : sortOption === "az"
                ? t.az
                : t.za}
              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-10 animate-fadeIn">
                <p className="px-4 text-gray-400 text-xs">{t.sortBy}</p>
                {[
                  { value: "oldest", label: t.oldest },
                  { value: "newest", label: t.newest },
                  { value: "az", label: t.az },
                  { value: "za", label: t.za },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                      sortOption === option.value
                        ? "bg-[#2E2F2F] text-white rounded-xl"
                        : "text-gray-300 hover:bg-[#2E2F2F] hover:text-white rounded-xl"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="px-4 py-3 rounded-full flex items-center bg-[#0085C8] hover:bg-blue-600 transition cursor-pointer"
          >
            <Plus size={18} className="mr-1" />
            {t.create}
          </button>
        </div>
      </div>

      {/* Table */}
      {/* Table */}
{loading ? (
  <p className="p-4">{t.loading}</p>
) : (
  <div className="rounded-lg border border-[#2E2F2F] shadow-sm overflow-hidden">
    <table className="min-w-full divide-y divide-[#2E2F2F]">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-md uppercase font-medium text-[#fff]">
            {t.sno}
          </th>
          <th className="px-6 py-3 text-left text-md uppercase font-medium text-[#fff]">
            {t.name}
          </th>
          <th className="px-6 py-3 text-right text-md uppercase font-medium text-[#fff]  tracking-wider">
            {t.actions}
          </th>
        </tr>
      </thead>

      <tbody>
        {currentCategories.length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center py-6 text-gray-400">
              {t.empty}
            </td>
          </tr>
        ) : (
          currentCategories.map((category, index) => (
            <tr
              key={category._id}
              className="transition-colors hover:bg-[#1F1F1F]"
            >
              <td className="px-6 py-4 text-sm text-gray-400">
                {(indexOfFirst + index + 1).toString().padStart(2, "0")}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-white">
                {/* ✅ Corrected language switch (uses .vi not .vn) */}
                {isVietnamese
                  ? category.name?.vi || category.name?.en
                  : category.name?.en}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-right">
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-500 hover:opacity-80 p-1 transition cursor-pointer"
                    title={t.edit}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => confirmDelete(category)}
                    className="!text-red-500 hover:opacity-80 p-1 transition cursor-pointer"
                    title={t.delete}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}


      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded border border-[#2E2F2F] disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-[#2E2F2F] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Custom Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F1F1F] p-3 rounded-xl border border-[#2E2F2F] shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-start mb-4">
              <h6 className="text-2xl font-semibold text-white">
                {t.deleteConfirmTitle}
              </h6>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 bg-red-600 rounded-full p-1 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t.deleteConfirmText}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 transition text-white"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-auto">
          <div className="rounded-lg shadow-xl w-full max-w-lg bg-[#1F1F1F] overflow-auto scrollbar-hide">
            <MainCategoryForm
              mainCategory={editingCategory}
              onClose={handleCloseForm}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsMainCategoriesScreen;
