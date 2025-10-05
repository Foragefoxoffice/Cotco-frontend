import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import MainCategoryForm from "../components/forms/MainCategoryForm";
import { getMainBlogCategories, deleteBlogMainCategory } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import { useTheme } from "../contexts/ThemeContext";

const NewsMainCategoriesScreen = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("newest");

  const { theme } = useTheme();

  // ✅ Watch language mode
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
    name: isVietnamese ? "Tên danh mục chính" : "Main Category Name",
    actions: isVietnamese ? "Hành động" : "Actions",
    loading: isVietnamese ? "Đang tải danh mục..." : "Loading categories...",
    empty: isVietnamese
      ? "Không tìm thấy danh mục nào."
      : "No categories found.",
    sortBy: isVietnamese ? "Sắp xếp theo" : "Sort by",
    newest: isVietnamese ? "Mới nhất" : "Newest",
    oldest: isVietnamese ? "Cũ nhất" : "Oldest",
    az: isVietnamese ? "Tên A-Z" : "Name A-Z",
    za: isVietnamese ? "Tên Z-A" : "Name Z-A",
    deleteConfirm: isVietnamese
      ? "Bạn có chắc muốn xóa danh mục chính này?"
      : "Are you sure you want to delete this main category?",
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

  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      await deleteBlogMainCategory(id);
      CommonToaster(t.deleteSuccess, "success");
      fetchMainCategories();
    } catch (err) {
      console.error("Delete error:", err);
      CommonToaster(t.deleteFail, "error");
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

  // 🔹 Sort
  const sortedCategories = [...mainCategories].sort((a, b) => {
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
    <div className="min-h-screen p-6 transition-colors duration-300 text-white bg-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-200">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-sm border border-gray-600 bg-[#1F1F1F] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#0085C8] transition-all duration-150 cursor-pointer"
          >
            <option className="bg-[#1F1F1F] text-white" value="newest">
              {t.newest}
            </option>
            <option className="bg-[#1F1F1F] text-white" value="oldest">
              {t.oldest}
            </option>
            <option className="bg-[#1F1F1F] text-white" value="az">
              {t.az}
            </option>
            <option className="bg-[#1F1F1F] text-white" value="za">
              {t.za}
            </option>
          </select>

          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-md flex items-center transition bg-[#0085C8] cursor-pointer"
          >
            <Plus size={18} className="mr-1" />
            {t.create}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="p-4">{t.loading}</p>
      ) : (
        <div className="rounded-lg border border-[#2E2F2F] shadow-sm overflow-hidden transition-colors duration-300">
          <table className="min-w-full divide-y divide-[#2E2F2F]">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#fff]">
                  {t.name}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#fff] uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-white">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                currentCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="transition-colors px-6 py-4 text-white hover:bg-[#1F1F1F]"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {isVietnamese
                        ? category.name?.vn || category.name?.en
                        : category.name?.en}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-500 hover:opacity-80 p-1 transition"
                          title={t.edit}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          style={{
                            color: "red",
                          }}
                          onClick={() => handleDelete(category._id)}
                          className="text-red-500 hover:opacity-80 p-1 transition"
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
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
          <div
            className={`rounded-lg shadow-xl w-full max-w-lg transition-colors duration-300 overflow-auto
              ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
          >
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
