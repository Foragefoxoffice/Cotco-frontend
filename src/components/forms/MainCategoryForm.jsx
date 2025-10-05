import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import { slugify } from "../../utils/helpers";
import {
  createBlogMainCategory,
  updateBlogMainCategory,
} from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";

const labels = {
  en: {
    edit: "Edit Main Category",
    create: "Create Main Category",
    name: "Main Category Name",
    slug: "Slug",
    bgImage: "Background Image",
    bgAlt: "Background Image Alt Text",
    cancel: "Cancel",
    saving: "Saving...",
    update: "Update Main Category",
    save: "Create Main Category",
    requiredEn: "English name is required",
    requiredVn: "Vietnamese name is required",
    requiredSlug: "Slug is required",
    successCreate: "Main Category created successfully!",
    successUpdate: "Main Category updated successfully!",
    fail: "Failed to save main category. Try again later.",
  },
  vn: {
    edit: "Chỉnh sửa Danh mục chính",
    create: "Tạo Danh mục chính",
    name: "Tên Danh mục chính",
    slug: "Đường dẫn",
    bgImage: "Ảnh nền",
    bgAlt: "Mô tả ảnh nền",
    cancel: "Hủy",
    saving: "Đang lưu...",
    update: "Cập nhật Danh mục chính",
    save: "Tạo Danh mục chính",
    requiredEn: "Tên tiếng Anh là bắt buộc",
    requiredVn: "Tên tiếng Việt là bắt buộc",
    requiredSlug: "Đường dẫn là bắt buộc",
    successCreate: "Tạo danh mục chính thành công!",
    successUpdate: "Cập nhật danh mục chính thành công!",
    fail: "Lưu danh mục chính thất bại. Vui lòng thử lại sau.",
  },
};

const MainCategoryForm = ({ mainCategory, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: mainCategory?.name || { en: "", vn: "" },
    slug: mainCategory?.slug || "",
    bgImage: mainCategory?.bgImage || { url: "", alt: "" },
  });
  const [preview, setPreview] = useState(mainCategory?.bgImage?.url || "");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isCreating = !mainCategory;

  useEffect(() => {
    if (isCreating && formData.name.en) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name.en) }));
    }
  }, [formData.name.en, isCreating]);

  const handleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [activeLanguage]: value,
      },
    }));
  };

  const handleSlugChange = (value) => {
    setFormData((prev) => ({ ...prev, slug: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        bgImage: { ...prev.bgImage, file },
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAltChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      bgImage: { ...prev.bgImage, alt: value },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // ✅ Both EN & VN required
    if (!formData.name.en?.trim()) {
      newErrors["name-en"] = labels.en.requiredEn;
    }
    if (!formData.name.vn?.trim()) {
      newErrors["name-vn"] = labels.vn.requiredVn;
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = labels[activeLanguage].requiredSlug;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // ✅ Prepare FormData with dot notation keys
      const data = new FormData();
      data.append("slug", formData.slug);
      data.append("name.en", formData.name.en || "");
      data.append("name.vn", formData.name.vn || "");
      data.append("bgImage.alt", formData.bgImage.alt || "");
      if (formData.bgImage.file) {
        data.append("bgImageFile", formData.bgImage.file);
      }

      let savedMainCategory;
      if (isCreating) {
        const res = await createBlogMainCategory(data, true);
        savedMainCategory = res.data.data || res.data;
        CommonToaster(labels[activeLanguage].successCreate, "success");
      } else {
        const res = await updateBlogMainCategory(
          mainCategory._id || mainCategory.id,
          data,
          true
        );
        savedMainCategory = res.data.data || res.data;
        CommonToaster(labels[activeLanguage].successUpdate, "success");
      }
      if (onSave) onSave(savedMainCategory);
    } catch (error) {
      console.error("MainCategory save error:", error.response || error);
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

  const inputClasses =
    "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {mainCategory ? labels[activeLanguage].edit : labels[activeLanguage].create}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>
      <TranslationTabs
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Name EN */}
        <div>
          <label className={labelClasses}>{labels.en.name} (EN)</label>
          <input
            type="text"
            className={inputClasses}
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
          <label className={labelClasses}>{labels.vn.name} (VN)</label>
          <input
            type="text"
            className={inputClasses}
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
            className={inputClasses}
            value={formData.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Background Image Upload */}
        <div>
          <label className={labelClasses}>{labels[activeLanguage].bgImage}</label>
          <input
            type="file"
            accept="image/*"
            className={inputClasses}
            onChange={handleFileChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-32 w-auto rounded-md object-cover border"
            />
          )}
        </div>

        {/* Background Image Alt */}
        <div>
          <label className={labelClasses}>{labels[activeLanguage].bgAlt}</label>
          <input
            type="text"
            className={inputClasses}
            value={formData.bgImage?.alt || ""}
            onChange={(e) => handleAltChange(e.target.value)}
            placeholder="Background image description"
          />
        </div>

        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900 p-3 rounded text-red-600 dark:text-red-200 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-600 border rounded-md hover:bg-red-50 dark:hover:bg-red-500 text-red-600 dark:text-red-300"
          >
            {labels[activeLanguage].cancel}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70"
          >
            {isLoading
              ? labels[activeLanguage].saving
              : mainCategory
              ? labels[activeLanguage].update
              : labels[activeLanguage].save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainCategoryForm;
