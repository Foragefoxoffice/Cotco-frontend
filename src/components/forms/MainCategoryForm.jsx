import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import { slugify } from "../../utils/helpers";
import { createBlogMainCategory, updateBlogMainCategory } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";
const BASE_URL = import.meta.env.VITE_API_URL || "";

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
    requiredVi: "Vietnamese name is required",
    requiredSlug: "Slug is required",
    successCreate: "Main Category created successfully!",
    successUpdate: "Main Category updated successfully!",
    fail: "Failed to save main category. Try again later.",
    viewFull: "View full image",
    changeImage: "Change Image",
  },
  vi: {
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
    requiredVi: "Tên tiếng Việt là bắt buộc",
    requiredSlug: "Đường dẫn là bắt buộc",
    successCreate: "Tạo danh mục chính thành công!",
    successUpdate: "Cập nhật danh mục chính thành công!",
    fail: "Lưu danh mục chính thất bại. Vui lòng thử lại sau.",
    viewFull: "Xem toàn ảnh",
    changeImage: "Đổi ảnh",
  },
};

const MainCategoryForm = ({ mainCategory, onClose, onSave }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");

  const [formData, setFormData] = useState({
    name: mainCategory?.name || { en: "", vi: "" },
    slug: mainCategory?.slug || "",
    bgImage: mainCategory?.bgImage || { url: "", alt: "" },
  });

  const [preview, setPreview] = useState(
    mainCategory?.bgImage?.url
      ? mainCategory.bgImage.url.startsWith("http")
        ? mainCategory.bgImage.url
        : `${BASE_URL}${mainCategory.bgImage.url}`
      : ""
  );

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !mainCategory;

  // ✅ Auto-generate slug when creating
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          bgImage: { ...prev.bgImage, file, url: reader.result },
        }));
      };
      reader.readAsDataURL(file);
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
    if (!formData.name.en?.trim()) newErrors["name-en"] = labels.en.requiredEn;
    if (!formData.name.vi?.trim()) newErrors["name-vi"] = labels.en.requiredVi;
    if (!formData.slug?.trim())
      newErrors.slug = labels[activeLanguage].requiredSlug;
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

      // Only append what’s needed — no nested object conflicts
      data.append("slug", formData.slug || "");
      data.append("name.en", formData.name.en || "");
      data.append("name.vi", formData.name.vi || "");

      // Append background image fields individually
      if (formData.bgImage?.alt) {
        data.append("bgImageAlt", formData.bgImage.alt);
      }
      if (formData.bgImage?.url && !formData.bgImage?.file) {
        // Optional: Send the current image URL only if no new file is chosen
        data.append("bgImageUrl", formData.bgImage.url);
      }
      if (formData.bgImage?.file) {
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
      console.error("MainCategory save error:", error);
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
        <h6 className="text-3xl font-semibold text-white">
          {mainCategory
            ? labels[activeLanguage].edit
            : labels[activeLanguage].create}
        </h6>
        <button
          onClick={onClose}
          className="text-gray-400 bg-red-600 hover:text-gray-200 transition p-1 rounded-full cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <TranslationTabs
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* English Name */}
        {activeLanguage === "en" && (
          <div>
            <label className={labelClasses}>
              {labels.en.name}
              <span className="text-red-500 text-lg">*</span>
            </label>
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
          </div>
        )}

        {/* Vietnamese Name */}
        {activeLanguage === "vi" && (
          <div>
            <label className={labelClasses}>
              {labels.vi.name}
              <span className="text-red-500 text-lg">*</span>
            </label>
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
          </div>
        )}

        {/* Slug */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].slug}
            <span className="text-red-500 text-lg">*</span>
          </label>
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

        {/* 🖼️ Background Image */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].bgImage}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {!preview && (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="mt-2 text-sm text-gray-400">Upload Image</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            )}

            {preview && (
              <div className="relative w-32 h-32 group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title={labels[activeLanguage].viewFull}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                {/* 🔁 Change Image */}
                <label
                  htmlFor="change-upload"
                  className="absolute bottom-1 right-1 bg-blue-600/70 hover:bg-blue-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={labels[activeLanguage].changeImage}
                >
                  <input
                    id="change-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.001 8.001 0 0115.357 2"
                    />
                  </svg>
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      bgImage: { url: "", alt: "", file: null },
                    }));
                    setPreview("");
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error messages */}
        <div className="pt-6 border-t border-[#2E2F2F]">
          {errors["name-en"] && (
            <p className="text-red-500 text-sm mt-1">{errors["name-en"]}</p>
          )}
          {errors["name-vi"] && (
            <p className="text-red-500 text-sm mt-1">{errors["name-vi"]}</p>
          )}
          {errors.submit && (
            <div className="bg-red-900/80 text-red-100 text-sm p-3 rounded-lg mb-4 border border-red-800">
              {errors.submit}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#1F1F1F] text-white font-medium border border-[#2E2F2F] hover:bg-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer"
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
                : mainCategory
                ? labels[activeLanguage].update
                : labels[activeLanguage].save}
            </button>
          </div>
        </div>
      </form>

      {/* 🪟 Fullscreen Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-4xl w-[90%] rounded-xl "
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview}
              alt="Full view"
              className="w-full h-auto object-contain rounded-xl"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 z-100 text-gray-300 h-8 w-8 cursor-pointer rounded-full bg-red-600 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCategoryForm;
