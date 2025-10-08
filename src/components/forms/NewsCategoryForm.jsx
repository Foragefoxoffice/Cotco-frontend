import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import { slugify } from "../../utils/helpers";
import { createCategory, updateCategory, getMainBlogCategories } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";

const labels = {
  en: {
    edit: "Edit Category",
    create: "Create Category",
    name: "Category Name",
    slug: "Slug",
    mainCategory: "Main Category",
    selectMain: "-- Select Main Category --",
    cancel: "Cancel",
    saving: "Saving...",
    update: "Update Category",
    save: "Create Category",
    requiredEn: "English name is required",
    requiredVi: "Vietnamese name is required",
    requiredSlug: "Slug is required",
    requiredMain: "Main category is required",
    successCreate: "Category created successfully!",
    successUpdate: "Category updated successfully!",
    fail: "Failed to save category. Try again later.",
  },
  vi: {
    edit: "Chỉnh sửa Danh mục",
    create: "Tạo Danh mục",
    name: "Tên Danh mục",
    slug: "Đường dẫn",
    mainCategory: "Danh mục chính",
    selectMain: "-- Chọn Danh mục chính --",
    cancel: "Hủy",
    saving: "Đang lưu...",
    update: "Cập nhật Danh mục",
    save: "Tạo Danh mục",
    requiredEn: "Tên tiếng Anh là bắt buộc",
    requiredVi: "Tên tiếng Việt là bắt buộc",
    requiredSlug: "Đường dẫn là bắt buộc",
    requiredMain: "Danh mục chính là bắt buộc",
    successCreate: "Tạo danh mục thành công!",
    successUpdate: "Cập nhật danh mục thành công!",
    fail: "Lưu danh mục thất bại. Vui lòng thử lại sau.",
  },
};

const NewsCategoryForm = ({ category, onClose, onSave }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: category?.name || { en: "", vi: "" },
    slug: category?.slug || "",
    mainCategory: category?.mainCategory?._id || "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const isCreating = !category;

  // ✅ Auto-generate slug when creating
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

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.en?.trim()) newErrors["name-en"] = labels.en.requiredEn;
    if (!formData.name.vi?.trim()) newErrors["name-vi"] = labels.en.requiredVi;
    if (!formData.slug?.trim())
      newErrors.slug = labels[activeLanguage].requiredSlug;
    if (!formData.mainCategory)
      newErrors.mainCategory = labels[activeLanguage].requiredMain;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler
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
      console.error("Category save error:", error);
      setErrors({
        submit:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          labels[activeLanguage].fail,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Input styles
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

  const labelClasses = "block text-md font-medium text-gray-300 mb-2";

  return (
    <div className="p-6 bg-[#171717] rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">
          {category ? labels[activeLanguage].edit : labels[activeLanguage].create}
        </h3>
        <button onClick={onClose} className="text-gray-400 !bg-red-600 transition rounded-full p-1 cursor-pointer">
          <X size={24} />
        </button>
      </div>

      {/* Language Tabs */}
      <TranslationTabs
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* English Field */}
        {activeLanguage === "en" && (
          <div>
            <label className={labelClasses}>{labels.en.name}<span className="text-red-500 text-lg">*</span></label>
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
        )}

        {/* Vietnamese Field */}
        {activeLanguage === "vi" && (
          <div>
            <label className={labelClasses}>{labels.vi.name}<span className="text-red-500 text-lg">*</span></label>
            <input
              type="text"
              style={darkInputStyle}
              value={formData.name.vi}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, vi: e.target.value },
                }))
              }
              required
            />
            {errors["name-vi"] && (
              <p className="text-red-500 text-sm mt-1">{errors["name-vi"]}</p>
            )}
          </div>
        )}

        {/* Slug */}
        <div>
          <label className={labelClasses}>{labels[activeLanguage].slug} <span className="text-red-500 text-lg">*</span></label>
          <input
            type="text"
            style={darkInputStyle}
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
          />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
        </div>

        {/* Main Category */}
       {/* Main Category */}
<div>
  <label className={labelClasses}>
    {labels[activeLanguage].mainCategory}<span className="text-red-500 text-lg">*</span>
  </label>

  {/* Custom Floating Dropdown */}
  <div className="relative mt-2">
    <button
      type="button"
      onClick={() => setShowDropdown((prev) => !prev)}
      className="flex items-center justify-between w-full px-4 py-3 text-sm rounded-lg bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 focus:border-[#3A3A3A] transition-all cursor-pointer"
    >
      {formData.mainCategory
        ? mainCategories.find((mc) => mc._id === formData.mainCategory)?.name[activeLanguage] ||
          mainCategories.find((mc) => mc._id === formData.mainCategory)?.name.en
        : labels[activeLanguage].selectMain}

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
      <div
        className="absolute left-0 mt-2 w-full rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-20 animate-fadeIn"
        style={{ animation: "fadeIn 0.15s ease-in-out" }}
      >
        <p className="px-4 pt-2 text-gray-400 text-xs">
          {labels[activeLanguage].mainCategory}
        </p>

        {mainCategories.length > 0 ? (
          mainCategories.map((mc) => (
            <button
              key={mc._id}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  mainCategory: mc._id,
                }));
                setShowDropdown(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${
                formData.mainCategory === mc._id
                  ? "bg-[#2E2F2F] text-white rounded-lg"
                  : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
              }`}
            >
              {mc.name[activeLanguage] || mc.name.en}
            </button>
          ))
        ) : (
          <p className="px-4 py-2 text-gray-400 text-sm">
            No main categories found
          </p>
        )}

        <div className="pb-2" />
      </div>
    )}
  </div>

  {errors.mainCategory && (
    <p className="text-red-500 text-sm mt-1">{errors.mainCategory}</p>
  )}
</div>


        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-900/80 text-red-100 text-sm p-3 rounded-lg mb-4 border border-red-800">
            {errors.submit}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 border-t border-[#2E2F2F] pt-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-8 py-3 rounded-full bg-[#1F1F1F] text-white font-medium border border-[#2E2F2F] hover:bg-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300"
          >
            {labels[activeLanguage].cancel}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-full font-medium text-white transition-all duration-300 cursor-pointer ${
              isLoading
                ? "bg-[#0085C8]/70 cursor-not-allowed"
                : "bg-[#0085C8] hover:bg-[#009FE3]"
            }`}
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
