import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import { slugify } from "../../utils/helpers";
import {
  createCategory,
  updateCategory,
  getMainBlogCategories,
} from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";

const labels = {
  en: {
    edit: "Edit Category",
    create: "Create New Category",
    categoryName: "Category Name",
    slug: "Slug",
    mainCategory: "Main Category",
    selectMain: "-- Select Main Category --",
    cancel: "Cancel",
    saving: "Saving...",
    update: "Update Category",
    save: "Create Category",
    requiredEn: "English name is required",
    requiredVn: "Vietnamese name is required",
    requiredSlug: "Slug is required",
    requiredMain: "Main category is required",
    successCreate: "Category created successfully!",
    successUpdate: "Category updated successfully!",
    fail: "Failed to save category. Try again later.",
  },
  vn: {
    edit: "Chỉnh sửa Danh mục",
    create: "Tạo Danh mục mới",
    categoryName: "Tên Danh mục",
    slug: "Đường dẫn",
    mainCategory: "Danh mục chính",
    selectMain: "-- Chọn Danh mục chính --",
    cancel: "Hủy",
    saving: "Đang lưu...",
    update: "Cập nhật Danh mục",
    save: "Tạo Danh mục",
    requiredEn: "Tên tiếng Anh là bắt buộc",
    requiredVn: "Tên tiếng Việt là bắt buộc",
    requiredSlug: "Đường dẫn là bắt buộc",
    requiredMain: "Danh mục chính là bắt buộc",
    successCreate: "Tạo danh mục thành công!",
    successUpdate: "Cập nhật danh mục thành công!",
    fail: "Lưu danh mục thất bại. Vui lòng thử lại sau.",
  },
};

const NewsCategoryForm = ({ category, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: category?.name || { en: "", vn: "" },
    slug: category?.slug || "",
    mainCategory: category?.mainCategory?._id || "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);

  const isCreating = !category;

  // ✅ Auto-generate slug
  useEffect(() => {
    if (isCreating && formData.name.en) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name.en) }));
    }
  }, [formData.name.en, isCreating]);

  // ✅ Fetch main categories
  useEffect(() => {
    const fetchMainCats = async () => {
      try {
        const res = await getMainBlogCategories();
        setMainCategories(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to load main categories", err);
      }
    };
    fetchMainCats();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.en?.trim()) newErrors["name-en"] = labels.en.requiredEn;
    if (!formData.name.vn?.trim()) newErrors["name-vn"] = labels.vn.requiredVn;
    if (!formData.slug?.trim()) newErrors.slug = labels[activeLanguage].requiredSlug;
    if (!formData.mainCategory) newErrors.mainCategory = labels[activeLanguage].requiredMain;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let savedCategory;
      if (isCreating) {
        const res = await createCategory(formData);
        savedCategory = res.data.data || res.data;
        CommonToaster(labels[activeLanguage].successCreate, "success");
      } else {
        const res = await updateCategory(category._id || category.id, formData);
        savedCategory = res.data.data || res.data;
        CommonToaster(labels[activeLanguage].successUpdate, "success");
      }
      if (onSave) onSave(savedCategory);
    } catch (error) {
      console.error("Category save error:", error.response || error);
      setErrors({
        submit:
          error.response?.data?.error ||
          error.response?.data?.message ||
          labels[activeLanguage].fail,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Unified dark input style
  const darkInputStyle = {
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    transition: "all 0.3s ease",
  };

  const labelClasses = "block text-sm font-medium text-gray-300";

  return (
    <div className="p-6 bg-[#171717] rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">
          {category
            ? labels[activeLanguage].edit
            : labels[activeLanguage].create}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Language Tabs */}
      <TranslationTabs
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6"
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      >
        {/* Name EN */}
        <div>
          <label className={labelClasses}>{labels.en.categoryName} (EN)</label>
          <input
            type="text"
            style={darkInputStyle}
            value={formData.name.en}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, en: e.target.value },
              }))
            }
            required
          />
          {errors["name-en"] && (
            <p className="text-red-500 text-sm mt-1">{errors["name-en"]}</p>
          )}
        </div>

        {/* Name VN */}
        <div>
          <label className={labelClasses}>{labels.vn.categoryName} (VN)</label>
          <input
            type="text"
            style={darkInputStyle}
            value={formData.name.vn}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, vn: e.target.value },
              }))
            }
            required
          />
          {errors["name-vn"] && (
            <p className="text-red-500 text-sm mt-1">{errors["name-vn"]}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className={labelClasses}>{labels[activeLanguage].slug}</label>
          <input
            type="text"
            style={darkInputStyle}
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Main Category */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].mainCategory}
          </label>
          <select
            style={darkInputStyle}
            value={formData.mainCategory}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                mainCategory: e.target.value,
              }))
            }
          >
            <option value="">{labels[activeLanguage].selectMain}</option>
            {mainCategories.map((mc) => (
              <option key={mc._id} value={mc._id}>
                {mc.name[activeLanguage] || mc.name.en}
              </option>
            ))}
          </select>
          {errors.mainCategory && (
            <p className="text-red-500 text-sm mt-1">{errors.mainCategory}</p>
          )}
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="bg-red-900 p-3 rounded text-red-200 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[#2E2F2F]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#2E2F2F] rounded-md text-gray-300 hover:bg-[#2E2F2F] transition"
          >
            {labels[activeLanguage].cancel}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#0085C8] text-white rounded-md hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isLoading
              ? labels[activeLanguage].saving
              : category
              ? labels[activeLanguage].update
              : labels[activeLanguage].save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsCategoryForm;
