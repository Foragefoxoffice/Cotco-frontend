import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import NewsCategoryForm from "../components/forms/NewsCategoryForm";
import { getCategories, deleteCategory } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

const NewsCategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Detect language (EN/VN)
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
    title: isVietnamese ? "Danh mục Tin tức" : "News Categories",
    subtitle: isVietnamese
      ? "Quản lý danh mục cho bài viết tin tức"
      : "Manage categories for news articles",
    create: isVietnamese ? "Tạo danh mục" : "Create Category",
    edit: isVietnamese ? "Chỉnh sửa" : "Edit",
    sno: isVietnamese ? "STT" : "S.No",
    name: isVietnamese ? "Tên danh mục" : "Category Name",
    parent: isVietnamese ? "Danh mục chính" : "Main Category",
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
      ? "Bạn có chắc muốn xóa danh mục này?"
      : "Are you sure you want to delete this category?",
    deleteSuccess: isVietnamese
      ? "Xóa danh mục thành công"
      : "Category deleted successfully",
    deleteFail: isVietnamese
      ? "Xóa danh mục thất bại"
      : "Failed to delete category",
    loadFail: isVietnamese
      ? "Không thể tải danh mục"
      : "Failed to load categories",
    search: isVietnamese ? "Tìm kiếm..." : "Search...",
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      CommonToaster(t.loadFail, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
      await deleteCategory(id);
      CommonToaster(t.deleteSuccess, "success");
      fetchCategories();
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
    fetchCategories();
    handleCloseForm();
  };

  // 🔹 Filter + Sort
  const filteredCategories = categories.filter((cat) => {
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
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
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

          <select
            style={{
              backgroundColor: "#1F1F1F",
              border: "1px solid #2E2F2F",
            }}
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 text-sm border border-gray-600 bg-[#1F1F1F] text-white rounded-full focus:outline-none transition-all cursor-pointer"
          >
            <option value="newest">{t.newest}</option>
            <option value="oldest">{t.oldest}</option>
            <option value="az">{t.az}</option>
            <option value="za">{t.za}</option>
          </select>

          <button
            onClick={handleCreate}
            className="px-4 py-3 rounded-full flex items-center bg-[#0085C8] hover:bg-blue-600 transition"
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
        <div className="rounded-lg border border-[#2E2F2F] shadow-sm overflow-hidden transition-colors">
          <table className="min-w-full divide-y divide-[#2E2F2F]">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#fff]">
                  {t.sno}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#fff]">
                  {t.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#fff]">
                  {t.parent}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#fff] uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
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
                      {isVietnamese
                        ? category.name?.vn || category.name?.en
                        : category.name?.en}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {category.mainCategory
                        ? isVietnamese
                          ? category.mainCategory.name?.vn ||
                            category.mainCategory.name?.en
                          : category.mainCategory.name?.en
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-500 hover:opacity-80 p-1 transition cursor-pointer"
                          title={t.edit}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          style={{
                            color: "red",
                          }}
                          onClick={() => handleDelete(category._id)}
                          className="text-red-500 hover:opacity-80 p-1 transition cursor-pointer"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
          <div className="rounded-lg shadow-xl w-full max-w-lg bg-[#1F1F1F] overflow-auto">
            <NewsCategoryForm
              category={editingCategory}
              onClose={handleCloseForm}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCategoriesScreen;
