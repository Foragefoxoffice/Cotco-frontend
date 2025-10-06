import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import { slugify } from "../../utils/helpers";
import { createBlogMainCategory, updateBlogMainCategory } from "../../Api/api";
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

  // ✅ Auto-generate slug on create
  useEffect(() => {
    if (isCreating && formData.name.en) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name.en) }));
    }
  }, [formData.name.en, isCreating]);

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
      console.error(
        "MainCategory save error:",
        error.response?.data || error.message || error
      );

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

  // ✅ Shared dark input styling
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
          {mainCategory
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
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Name EN */}
        <div>
          <label className={labelClasses}>{labels.en.name} (EN)</label>
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
          <label className={labelClasses}>{labels.vn.name} (VN)</label>
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
            onChange={(e) => handleSlugChange(e.target.value)}
            required
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Background Image */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].bgImage}
          </label>
          <input
            type="file"
            accept="image/*"
            style={{
              ...darkInputStyle,
              padding: "6px",
              cursor: "pointer",
            }}
            onChange={handleFileChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-32 w-auto rounded-md object-cover border border-[#2E2F2F]"
            />
          )}
        </div>

        {/* Background Image Alt */}
        <div>
          <label className={labelClasses}>{labels[activeLanguage].bgAlt}</label>
          <input
            type="text"
            style={darkInputStyle}
            value={formData.bgImage?.alt || ""}
            onChange={(e) => handleAltChange(e.target.value)}
            placeholder="Background image description"
          />
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-900 p-3 rounded text-red-200 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-[#2E2F2F]">
          {/* Cancel Button — Dark Pill */}
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-full 
               bg-[#1F1F1F] text-white font-medium 
               border border-[#2E2F2F]
               hover:bg-[#2A2A2A] hover:border-[#3A3A3A]
               transition-all duration-300 cursor-pointer"
          >
            {labels[activeLanguage].cancel}
          </button>

          {/* Save / Update Button — Bright Blue Pill */}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-full font-medium text-white transition-all duration-300 cursor-pointer
                ${
                  isLoading
                    ? "bg-[#0085C8]/70 cursor-not-allowed"
                    : "bg-[#0085C8] hover:bg-[#009FE3]"
                }`}
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
