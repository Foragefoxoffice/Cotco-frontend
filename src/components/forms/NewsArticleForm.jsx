import React, { useState, useRef, useEffect } from "react";
import { X, Upload, PlusCircle, Trash2 } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import RichTextEditor from "../RichTextEditor"; // ✅ TipTap editor
import { slugify } from "../../utils/helpers";
import { getCategories, getMainBlogCategories } from "../../Api/api"; // ✅ fetch real categories + main categories

const labels = {
  en: {
    edit: "Edit Blog",
    create: "Create Resources",
    title: "Title",
    slug: "Slug",
    coverImage: "Cover Image",
    preview: "Preview",
    upload: "Upload",
    description: "Description",
    mainCategory: "Main Category",
    category: "Category",
    status: "Status",
    draft: "Draft",
    published: "Published",
    tags: "Tags",
    addTag: "Add tag and press Enter",
    seo: "SEO Settings",
    metaTitle: "Meta Title",
    metaDescription: "Meta Description",
    cancel: "Cancel",
    update: "Update Resources",
    save: "Create Resources",
    blockTypes: {
      richtext: "Description",
      image: "Image",
      list: "Bullet Points",
      quote: "Highlighted",
      code: "Code Snippet (For Developers)",
    },
  },
  vn: {
    edit: "Chỉnh sửa Bài viết",
    create: "Tạo Tin tức & Sự kiện",
    title: "Tiêu đề",
    slug: "Đường dẫn",
    coverImage: "Ảnh bìa",
    preview: "Xem trước",
    upload: "Tải lên",
    description: "Mô tả",
    mainCategory: "Danh mục chính",
    category: "Danh mục phụ",
    status: "Trạng thái",
    draft: "Bản nháp",
    published: "Đã xuất bản",
    tags: "Thẻ",
    addTag: "Thêm thẻ và nhấn Enter",
    seo: "Cài đặt SEO",
    metaTitle: "Tiêu đề SEO",
    metaDescription: "Mô tả SEO",
    cancel: "Hủy",
    update: "Cập nhật",
    save: "Tạo mới",
    blockTypes: {
      richtext: "Mô tả",
      image: "Hình ảnh",
      list: "Danh sách gạch đầu dòng",
      quote: "Trích dẫn",
      code: "Đoạn mã (cho lập trình viên)",
    },
  },
};

const NewsArticleForm = ({ article, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const fileInputRef = useRef(null);
  const [tagInput, setTagInput] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const isCreating = !article;

  // ✅ Categories state
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: { en: "", vn: "" },
    slug: "",
    excerpt: { en: "", vn: "" },
    coverImage: { url: "" },
    blocks: [],
    publishedAt: new Date().toISOString().split("T")[0],
    author: "Admin User",
    mainCategory: "",
    category: "",
    tags: [],
    status: "draft",
    seo: {
      title: { en: "", vn: "" },
      description: { en: "", vn: "" },
    },
  });

  // ✅ Fetch categories & main categories
  useEffect(() => {
    Promise.all([getMainBlogCategories(), getCategories()])
      .then(([mainRes, catRes]) => {
        const mains = mainRes.data.data || mainRes.data;
        const cats = catRes.data.data || catRes.data;

        setMainCategories(mains);
        setCategories(cats);

        setFormData((prev) => ({
          ...prev,
          mainCategory:
            prev.mainCategory || (mains.length > 0 ? mains[0]._id : ""),
          category: prev.category || (cats.length > 0 ? cats[0]._id : ""),
        }));
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // ✅ Load article if editing
  useEffect(() => {
    if (article) {
      setFormData(article);
    }
  }, [article]);

  // ✅ Auto-slug
  useEffect(() => {
    if (isCreating && formData.title.en) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title.en) }));
    }
  }, [formData.title.en, isCreating]);

  const inputClasses =
    "mt-1 block w-full border border-[#2E2F2F] rounded-lg shadow-sm py-2 px-3 bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0085C8] focus:border-[#0085C8] transition-all duration-200";

  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  // ✅ Change handlers
  const handleChange = (field, value, isTranslatable = false) => {
    if (isTranslatable) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [activeLanguage]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSEOChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: { ...prev.seo[field], [activeLanguage]: value },
      },
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          coverImage: { url: reader.result },
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // ✅ Tags
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // ✅ Blocks
  const addBlock = (type) => {
    const newBlock = {
      type,
      content: type === "image" ? { url: "" } : { en: "", vn: "" },
      position: formData.blocks.length,
    };
    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  };

  const updateBlock = (index, value) => {
    setFormData((prev) => {
      const blocks = [...prev.blocks];
      if (blocks[index].type === "image") {
        blocks[index].content = value;
      } else {
        blocks[index].content = {
          ...blocks[index].content,
          [activeLanguage]: value,
        };
      }
      return { ...prev, blocks };
    });
  };

  const removeBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = [];

    if (!formData.title.en.trim() || !formData.title.vn.trim()) {
      errors.push("Both EN and VN Title are required.");
    }

    if (!formData.excerpt.en.trim() || !formData.excerpt.vn.trim()) {
      errors.push("Both EN and VN Description are required.");
    }

    if (!formData.seo.title.en.trim() || !formData.seo.title.vn.trim()) {
      errors.push("Both EN and VN SEO Title are required.");
    }

    if (
      !formData.seo.description.en.trim() ||
      !formData.seo.description.vn.trim()
    ) {
      errors.push("Both EN and VN SEO Description are required.");
    }

    if (!formData.coverImage.url) {
      errors.push("Cover image is required.");
    }

    if (!formData.mainCategory) {
      errors.push("Main category is required.");
    }

    if (!formData.category) {
      errors.push("Category is required.");
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    onSave(formData);
  };

  return (
    <div className="p-6 bg-[#0A0A0A] text-white rounded-xl">
      <style>
        {`
          .richtext-editor {
            border: 1px solid #2E2F2F;
            background: transparent;
            bord
          }

          .richtext-editor:focus {
            outline: none;
          }
            .richtext-editor .toolbar{
              background:#2E2F2F;
              border:none;
              padding:5px 10px;
            }
              .richtext-editor .ProseMirror{
              padding:20px;
              }
              .ant-modal .ant-modal-close-x{
        color:#fff;
        }
        `}
      </style>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#2E2F2F] pb-3">
        <h2 className="text-xl font-bold text-white">
          {article
            ? labels[activeLanguage].edit
            : labels[activeLanguage].create}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>
      </div>

      <TranslationTabs
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].title}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClasses}
            value={formData.title[activeLanguage]}
            onChange={(e) => handleChange("title", e.target.value, true)}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].slug}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClasses}
            value={formData.slug}
            onChange={(e) =>
              handleChange(
                "slug",
                e.target.value.toLowerCase().replace(/\s+/g, "-")
              )
            }
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].coverImage}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-5 mt-4">
            {/* 🖼️ Preview Box */}
            <div className="relative w-28 h-28 border border-[#2E2F2F] rounded-xl overflow-hidden bg-[#141414] flex items-center justify-center shadow-inner">
              {formData.coverImage.url ? (
                <img
                  src={formData.coverImage.url}
                  alt="cover"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <span className="text-gray-500 text-xs tracking-wide">
                  {labels[activeLanguage].preview}
                </span>
              )}
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* 💠 Upload Button (Styled Like “Save and Submit”) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-8 py-3 
               bg-[#0085C8] text-white text-base font-medium 
               rounded-full transition-all duration-300 ease-in-out
               hover:bg-[#0098E0] focus:outline-none 
               focus:ring-2 focus:ring-[#33BFFF] focus:ring-offset-2 focus:ring-offset-[#171717]"
            >
              {/* SVG Upload Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              {labels[activeLanguage].upload}
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-1">
            (2MB maximum upload size)
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].description}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            className={inputClasses}
            rows={3}
            value={formData.excerpt[activeLanguage]}
            onChange={(e) => handleChange("excerpt", e.target.value, true)}
          />
        </div>

        {/* Content Blocks */}
        <div>
          <label className={labelClasses}>Content Blocks</label>

          {/* 🧱 Block Items */}
          <div className="space-y-4 mt-2">
            {formData.blocks.map((block, i) => (
              <div
                key={i}
                className="p-4 border border-[#2E2F2F] rounded-xl bg-[#141414] shadow-inner transition-all hover:border-[#3b3b3b]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-200 capitalize">
                    {labels[activeLanguage].blockTypes[block.type]}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBlock(i)}
                    className="flex items-center justify-center px-4 py-1.5 
                       bg-[#1E1E1E] text-white text-sm font-medium rounded-full
                       border border-[#2E2E2E] hover:bg-[#2A2A2A] 
                       transition-all duration-300"
                  >
                    <Trash2 size={14} className="mr-1 text-red-400" />
                    Remove
                  </button>
                </div>

                {/* 🧩 Conditional Block Types */}
                {block.type === "richtext" && (
                  <RichTextEditor
                    key={`${i}-${activeLanguage}`}
                    value={block.content[activeLanguage] || ""}
                    onChange={(content) => updateBlock(i, content)}
                  />
                )}

                {block.type === "image" && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-32 h-32 border border-[#2E2F2F] rounded-lg overflow-hidden bg-[#1F1F1F] flex items-center justify-center">
                      {block.content.url ? (
                        <img
                          src={block.content.url}
                          alt={`block-${i}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">
                          {labels[activeLanguage].preview}
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      id={`block-image-${i}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateBlock(i, { url: reader.result });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />

                    {/* 🔵 Upload Button (Dark-Pill Style) */}
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById(`block-image-${i}`).click()
                      }
                      className="flex items-center gap-2 px-6 py-4
                         bg-[#0085C8] text-white font-medium 
                         rounded-full shadow-md
                         hover:bg-[#0098E0] transition-all duration-300"
                    >
                      <Upload size={16} className="text-white" />
                      {labels[activeLanguage].upload}
                    </button>
                  </div>
                )}

                {block.type === "list" && (
                  <textarea
                    className={inputClasses}
                    rows={3}
                    placeholder="Enter list items separated by new lines"
                    value={block.content[activeLanguage] || ""}
                    onChange={(e) => updateBlock(i, e.target.value)}
                  />
                )}

                {block.type === "quote" && (
                  <textarea
                    className={inputClasses}
                    rows={2}
                    placeholder="Quote"
                    value={block.content[activeLanguage] || ""}
                    onChange={(e) => updateBlock(i, e.target.value)}
                  />
                )}

                {block.type === "code" && (
                  <textarea
                    className={`${inputClasses} font-mono`}
                    rows={4}
                    placeholder="Code snippet"
                    value={block.content[activeLanguage] || ""}
                    onChange={(e) => updateBlock(i, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ➕ Add Block Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(labels[activeLanguage].blockTypes).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => addBlock(value)}
                  className="flex items-center gap-2 px-5 py-4 
                   bg-[#1E1E1E] text-white text-sm font-medium rounded-full
                   border border-[#2E2E2E] hover:bg-[#2A2A2A]
                   transition-all duration-300"
                >
                  <PlusCircle size={14} className="text-[#00A8FF]" />
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Category Selectors */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].mainCategory}
          </label>
          <select
            className={inputClasses}
            value={formData.mainCategory}
            onChange={(e) => handleChange("mainCategory", e.target.value)}
            required
          >
            {mainCategories.map((mc) => (
              <option key={mc._id} value={mc._id}>
                {mc.name[activeLanguage] || mc.name.en}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].category}
          </label>
          <select
            className={inputClasses}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories
              .filter((c) => c.mainCategory?._id === formData.mainCategory)
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name[activeLanguage] || c.name.en}
                </option>
              ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].status}
          </label>
          <select
            className={inputClasses}
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="draft">{labels[activeLanguage].draft}</option>
            <option value="published">
              {labels[activeLanguage].published}
            </option>
          </select>
        </div>

        {/* SEO */}
        <div className="space-y-3 border-t border-[#2E2F2F] pt-4">
          <h3 className="font-semibold text-gray-200 text-lg">
            {labels[activeLanguage].seo}
          </h3>
          <div>
            <label className={labelClasses}>
              {labels[activeLanguage].metaTitle}
            </label>
            <input
              type="text"
              className={inputClasses}
              value={formData.seo.title[activeLanguage]}
              onChange={(e) => handleSEOChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClasses}>
              {labels[activeLanguage].metaDescription}
            </label>
            <textarea
              rows={2}
              className={inputClasses}
              value={formData.seo.description[activeLanguage]}
              onChange={(e) => handleSEOChange("description", e.target.value)}
            />
          </div>
        </div>

        {/* Error Messages */}
        {formErrors.length > 0 && (
          <div className="p-3 bg-red-500/20 text-red-300 rounded-md">
            <ul className="list-disc pl-5 space-y-1">
              {formErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-[#2E2F2F]">
          {/* Cancel Button (Dark Gray Pill) */}
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 rounded-full 
               bg-[#1F1F1F] text-white font-medium
               border border-[#2E2F2F]
               hover:bg-[#2A2A2A] hover:border-[#3A3A3A]
               transition-all duration-300"
          >
            {labels[activeLanguage].cancel}
          </button>

          {/* Save / Update Button (Bright Blue Pill) */}
          <button
            type="submit"
            className="px-8 py-4 rounded-full 
               bg-[#0085C8] text-white font-medium 
               hover:bg-[#009FE3]
               transition-all duration-300"
          >
            {article
              ? labels[activeLanguage].update
              : labels[activeLanguage].save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsArticleForm;
