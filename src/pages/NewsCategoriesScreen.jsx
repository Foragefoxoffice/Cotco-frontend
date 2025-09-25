import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import NewsCategoryForm from "../components/forms/NewsCategoryForm";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import { useTheme } from "../contexts/ThemeContext"; // ✅ import theme context

const NewsCategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme(); // ✅ get theme

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []); // assuming backend returns { data: [...] }
    } catch (err) {
      console.error("Error fetching categories:", err);
      CommonToaster("Failed to load categories", "error");
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
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await deleteCategory(id);
      CommonToaster("Category deleted successfully", "success");
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
      CommonToaster("Failed to delete category", "error");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSave = async (categoryData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryData);
        CommonToaster("Category updated successfully", "success");
      } else {
        await createCategory(categoryData);
        CommonToaster("Category created successfully", "success");
      }
      fetchCategories();
      handleCloseForm();
    } catch (error) {
      console.error("Save error:", error);
      CommonToaster("Failed to save category", "error");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 
        ${
          theme === "light"
            ? "bg-gray-50 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">News Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage categories for news articles
          </p>
        </div>
        <button
          onClick={handleCreate}
          className={`px-4 py-2 rounded-md flex items-center transition
            ${
              theme === "light"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-gray-900 hover:bg-indigo-400"
            }`}
        >
          <Plus size={18} className="mr-1" />
          Create Category
        </button>
      </div>

      {loading ? (
        <p className="p-4">Loading categories...</p>
      ) : (
        <div
          className={`rounded-lg shadow-sm overflow-hidden border transition-colors duration-300 
            ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000] dark:text-[#fff] uppercase tracking-wider">
                  Category Name (EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000] dark:text-[#fff] uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#000] dark:text-[#fff] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {category.name.en}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-indigo-600 dark:text-indigo-400 hover:opacity-80 p-1 transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 dark:text-red-400 hover:opacity-80 p-1 transition"
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={`rounded-lg shadow-xl w-full max-w-lg transition-colors duration-300
              ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
          >
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
