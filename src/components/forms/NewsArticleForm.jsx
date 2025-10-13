import React, { useState, useRef, useEffect } from "react";
import { X, Upload, PlusCircle, Trash2 } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import RichTextEditor from "../RichTextEditor";
import { slugify } from "../../utils/helpers";
import { getCategories, getMainBlogCategories } from "../../Api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { CommonToaster } from "../../Common/CommonToaster";
import ReactQuill from "react-quill-new";
const labels = {
  en: {
    edit: "Edit Content",
    create: "Create Content",
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
    update: "Update Content",
    save: "Create Content",
    blockTypes: {
      richtext: "Description",
      image: "Image",
      list: "Bullet Points",
      quote: "Highlighted",
      code: "Code Snippet (For Developers)",
    },
  },
  vi: {
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
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImage2Modal, setShowImage2Modal] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");

  const [formData, setFormData] = useState({
    title: { en: "", vi: "" },
    slug: "",
    excerpt: { en: "", vi: "" },
    coverImage: { url: "" },
    mainCategory: "",
    category: "",
    tags: [],
    status: "draft",
    seo: {
      title: { en: "", vi: "" },
      description: { en: "", vi: "" },
      keywords: { en: "", vi: "" },
    },
    blocks: [],
  });

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const newKeyword = keywordInput.trim();

      setFormData((prev) => {
        const existing = prev.seo.keywords?.[activeLanguage]
          ? prev.seo.keywords[activeLanguage].split(",").map((k) => k.trim())
          : [];

        if (!existing.includes(newKeyword)) {
          const updated = [...existing, newKeyword];
          return {
            ...prev,
            seo: {
              ...prev.seo,
              keywords: {
                ...prev.seo.keywords,
                [activeLanguage]: updated.join(", "),
              },
            },
          };
        }
        return prev;
      });

      setKeywordInput("");
    }
  };

  // ✅ Auto-fill author from logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const name = user?.name || user?.username || user?.email || "";
        if (name) {
          setFormData((prev) => ({ ...prev, author: name }));
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const isCreating = !article;

  useEffect(() => {
    Promise.all([getMainBlogCategories(), getCategories()])
      .then(([mainRes, catRes]) => {
        const mains = mainRes.data.data || mainRes.data;
        const cats = catRes.data.data || catRes.data;
        setMainCategories(mains);
        setCategories(cats);
      })
      .catch((err) => console.error("Category fetch failed", err));
  }, []);

  useEffect(() => {
    if (article) setFormData(article);
  }, [article]);

  useEffect(() => {
    if (isCreating && formData.title.en) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title.en) }));
    }
  }, [formData.title.en, isCreating]);

  const inputClasses =
    "mt-1 block w-full border border-[#2E2F2F] rounded-lg shadow-sm py-2 px-3 bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0085C8] transition-all duration-200 scrollbar-hide";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1 ";

  const handleChange = (field, value, translatable = false) => {
    if (translatable) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [activeLanguage]: value },
      }));
    } else setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // ✅ Limit to 2 MB
      if (file.size > 2 * 1024 * 1024) {
        CommonToaster(
          activeLanguage === "vi"
            ? "Kích thước ảnh vượt quá giới hạn 2 MB. Vui lòng chọn ảnh nhỏ hơn."
            : "Image size exceeds 2 MB limit. Please choose a smaller file.",
          "error"
        );
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({
          ...prev,
          coverImage: { url: reader.result },
        }));
      reader.readAsDataURL(file);
    }
  };

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

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addBlock = (type) => {
    const newBlock = {
      type,
      content: type === "image" ? { url: "" } : { en: "", vi: "" },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.title.en || !formData.title.vi)
      errors.push("Title required in both languages.");
    if (!formData.slug.trim()) errors.push("Slug is required.");
    if (!formData.mainCategory) errors.push("Main category required.");
    if (!formData.coverImage.url) errors.push("Cover image required.");

    setFormErrors(errors);
    if (errors.length) return;

    let finalCategory = formData.category;

    // ✅ Auto-assign "Default" if no category chosen
    if (!finalCategory) {
      // Find "Default" or "Mặc định"
      const defaultCat = categories.find(
        (c) =>
          c.name?.en?.trim().toLowerCase() === "default" ||
          c.name?.vi?.trim().toLowerCase() === "mặc định"
      );

      if (defaultCat) {
        finalCategory = defaultCat._id;
      } else {
        // If Default doesn't exist, just send empty — backend will auto-create & assign
        console.warn("⚠️ Default category not found — backend will create it.");
        finalCategory = ""; // backend handles creation now
      }
    }

    const dataToSave = { ...formData, category: finalCategory };
    console.log("Submitting blog:", dataToSave);
    onSave(dataToSave);
  };

  return (
    <div className="p-6 bg-[#0A0A0A] text-white rounded-xl relative ">
      <style>
        {`
          @keyframes fadeIn {
            from {opacity:0;transform:translateY(-4px);}
            to {opacity:1;transform:translateY(0);}
          }
          .animate-fadeIn {animation: fadeIn 0.15s ease-in-out;}
          .toolbar{
          background-color:#fff;
          border:none;
          outline:none;
          }
          .richtext-editor{
            color:#000;
            background:transparent;
            border:1px solid #2E2F2F;
            outline:none;
            border:16px 16px 0 0;
          }
            .ProseMirror{
            border:none;
            outline:none;
            padding:10px 20px;
            color:#fff;}
            .react-datepicker {
    background-color: #1a1a1a;
    border: 1px solid #2E2F2F;
    color: #fff;
    font-family: inherit;
    border-radius: 8px;
  }

  .react-datepicker__header {
    background-color: #171717;
    border-bottom: 1px solid #2E2F2F;
  }

  .react-datepicker__day {
    color: #e5e5e5;
  }

  .react-datepicker__day-name{
          color:#959797;
  }
          .react-datepicker__day:hover{
          background-color:#2E2F2F !important;
          }
  .react-datepicker__day--selected {
    background-color: #0085C8;
    color: white;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #00A8FF;
    color: white;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    color: #fff;
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #ccc;
  }

  .react-datepicker__day:hover {
    background-color: #2A2A2A;
  }
    .react-datepicker-wrapper{
    width:100%;
    }

    .ant-message-notice-content {
  background-color: #1a1a1a !important;
  color: #fff !important;
  border: 1px solid #333 !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

 /* ✅ Sticky Quill toolbar */
  .ql-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: 1px solid #333;
  }

  .ql-container {
    max-height: 350px;
    overflow-y: auto;
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
          className="text-gray-400 !bg-red-600 transition rounded-full p-1 cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      {/* Language Tabs */}
      <TranslationTabs
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].title}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <input
            type="text"
            className={inputClasses}
            value={formData.title[activeLanguage]}
            onChange={(e) => handleChange("title", e.target.value, true)}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelClasses}>{labels[activeLanguage].slug}</label>
          <input
            type="text"
            className={inputClasses}
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              }))
            }
          />
        </div>

        {/* Cover Image Upload with Preview Modal */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].coverImage}
            <span className="text-red-500 text-lg">*</span>
          </label>

          {/* Hidden File Input */}
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <div className="flex flex-wrap gap-4 mt-2">
            {/* Upload Placeholder */}
            {!formData.coverImage?.url && (
              <label
                htmlFor="cover-upload"
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
                <span className="mt-2 text-sm text-gray-400">
                  {labels[activeLanguage].upload}
                </span>
              </label>
            )}

            {/* Image Preview (for both existing or newly uploaded images) */}
            {formData.coverImage?.url && (
              <div className="relative w-32 h-32 group">
                <img
                  src={
                    formData.coverImage.url.startsWith("data:image")
                      ? formData.coverImage.url
                      : formData.coverImage.url // handles both base64 and actual URLs
                  }
                  alt="Cover Preview"
                  className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                />

                {/* View (Eye) Icon */}
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title={
                    activeLanguage === "vi"
                      ? "Xem hình ảnh đầy đủ"
                      : "View full image"
                  }
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

                {/* Replace (Upload Again) Icon */}
                <label
                  htmlFor="cover-upload"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={
                    activeLanguage === "vi" ? "Tải ảnh khác" : "Replace image"
                  }
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4 20v-5h.581m15.357-2a8.003 8.003 0 01-15.357 2"
                    />
                  </svg>
                </label>

                {/* Delete (X) Icon */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: { url: "" },
                    }))
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                  title={activeLanguage === "vi" ? "Xóa ảnh" : "Remove image"}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Preview Modal */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative max-w-3xl max-h-[90vh] w-auto">
                <img
                  src={formData.coverImage.url}
                  alt="Full Preview"
                  className="max-h-[85vh] w-auto rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition"
                  title={activeLanguage === "vi" ? "Đóng" : "Close"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].description}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <textarea
            className={inputClasses}
            rows={3}
            value={formData.excerpt[activeLanguage]}
            onChange={(e) => handleChange("excerpt", e.target.value, true)}
          />
        </div>

        {/* Tags */}
        {/* <div>
          <label className={labelClasses}>{labels[activeLanguage].tags}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className={inputClasses}
            placeholder={labels[activeLanguage].addTag}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div> */}

        {/* Author and Publish Date */}

        {/* Content Blocks */}
        <div>
          <label className={labelClasses}>
            {activeLanguage === "vi" ? "Khối nội dung" : "Content Blocks"}
          </label>
          <div className="space-y-4 mt-2">
            {formData.blocks.map((block, i) => (
              <div
                key={i}
                className="p-4 border border-[#2E2F2F] rounded-xl bg-[#141414]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-200 capitalize">
                    {labels[activeLanguage].blockTypes[block.type]}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBlock(i)}
                    className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-md cursor-pointer"
                  >
                    <Trash2 size={14} className="text-white" />
                    Remove
                  </button>
                </div>
                {block.type === "richtext" && (
                  <ReactQuill
                    key={`${i}-${activeLanguage}`}
                    value={block.content?.[activeLanguage] || ""}
                    onChange={(value) => {
                      updateBlock(i, value, activeLanguage);
                    }}
                    theme="snow"
                  />
                )}

                {block.type === "image" && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="relative w-40 h-40 group border border-[#2E2F2F] rounded-lg overflow-hidden bg-[#1F1F1F] flex items-center justify-center">
                      {block.content?.url ? (
                        <>
                          {/* Image Preview */}
                          <img
                            src={block.content.url}
                            alt={`block-${i}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Eye (Preview) Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setShowImage2Modal({
                                index: i,
                                url: block.content.url,
                              })
                            }
                            className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                            title={
                              activeLanguage === "vi"
                                ? "Xem hình ảnh đầy đủ"
                                : "View full image"
                            }
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

                          {/* Replace (Upload Again) Button */}
                          <label
                            htmlFor={`block-img-${i}`}
                            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            title={
                              activeLanguage === "vi"
                                ? "Tải ảnh khác"
                                : "Replace image"
                            }
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4 20v-5h.581m15.357-2a8.003 8.003 0 01-15.357 2"
                              />
                            </svg>
                          </label>

                          {/* Delete (X) Button */}
                          <button
                            type="button"
                            onClick={() => updateBlock(i, { url: "" })}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            title={
                              activeLanguage === "vi"
                                ? "Xóa ảnh"
                                : "Remove image"
                            }
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </>
                      ) : (
                        // Upload placeholder
                        <label
                          htmlFor={`block-img-${i}`}
                          className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-[#2A2A2A] transition"
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
                          <span className="mt-1 text-xs text-gray-400">
                            {labels[activeLanguage].upload}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      id={`block-img-${i}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            CommonToaster(
                              activeLanguage === "vi"
                                ? "Kích thước ảnh vượt quá giới hạn 2 MB. Vui lòng chọn ảnh nhỏ hơn."
                                : "Image size exceeds 2 MB limit. Please choose a smaller file.",
                              "error"
                            );
                            e.target.value = "";
                            return;
                          }

                          const reader = new FileReader();
                          reader.onloadend = () =>
                            updateBlock(i, { url: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}

                {["list", "quote", "code"].includes(block.type) && (
                  <textarea
                    className={`${inputClasses} ${
                      block.type === "code" ? "font-mono" : ""
                    }`}
                    rows={block.type === "quote" ? 2 : 4}
                    placeholder={`Enter ${block.type}`}
                    value={block.content[activeLanguage] || ""}
                    onChange={(e) => updateBlock(i, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(labels[activeLanguage].blockTypes).map(
              ([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#1E1E1E] text-white rounded-full border border-[#2E2E2E] hover:bg-[#2A2A2A]"
                >
                  <PlusCircle size={16} className="text-[#00A8FF]" />
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Author Input */}
          {/* ✅ Author Input (auto-filled, not editable) */}
          <div>
            <label className={labelClasses}>
              {activeLanguage === "vi" ? "Tác giả" : "Author"}
            </label>
            <input
              type="text"
              className={`${inputClasses} opacity-70 cursor-not-allowed`}
              value={formData.author || ""}
              readOnly
              placeholder={
                activeLanguage === "vi"
                  ? "Tên tác giả (tự động)"
                  : "Author name (auto-filled)"
              }
            />
          </div>

          {/* Publish Date Input */}
          <div>
            <div className="relative">
              <label className={labelClasses}>
                {activeLanguage === "vi" ? "Ngày xuất bản" : "Publish Date"}
                <span className="text-red-500 text-lg">*</span>
              </label>
              <DatePicker
                selected={
                  formData.publishedAt ? new Date(formData.publishedAt) : null
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    publishedAt: date || null,
                  }))
                }
                placeholderText="Select a date"
                dateFormat="yyyy-MM-dd"
                className={`${inputClasses} bg-[#1F1F1F] text-white border-[#2E2F2F] focus:ring-[#0085C8]`}
                calendarClassName="bg-[#111] text-white border border-[#2E2F2F] rounded-lg shadow-lg"
                popperPlacement="bottom-start"
                showPopperArrow={false}
              />
            </div>
          </div>
        </div>

        {/* Main Category */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].mainCategory}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMainDropdown((p) => !p)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#3A3A3A] text-gray-200 hover:border-gray-500 transition-all"
            >
              {(() => {
                const mainCatId =
                  typeof formData.mainCategory === "object"
                    ? formData.mainCategory._id || formData.mainCategory.$oid
                    : formData.mainCategory;
                const selected = mainCategories.find(
                  (m) => m._id === mainCatId
                );
                return selected
                  ? selected.name[activeLanguage] || selected.name.en
                  : labels[activeLanguage].mainCategory;
              })()}
              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${
                  showMainDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMainDropdown && (
              <div className="absolute w-full mt-2 bg-[#1F1F1F] border border-[#2E2F2F] rounded-xl z-20 animate-fadeIn shadow-lg">
                {mainCategories.map((m) => (
                  <button
                    key={m._id}
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        mainCategory: m._id,
                        category: "", // reset subcategory
                      }));
                      setShowMainDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-md transition ${
                      (typeof formData.mainCategory === "object"
                        ? formData.mainCategory._id ||
                          formData.mainCategory.$oid
                        : formData.mainCategory) === m._id
                        ? "bg-[#2E2F2F] text-white"
                        : "text-gray-300 hover:bg-[#2A2A2A]"
                    }`}
                  >
                    {m.name[activeLanguage] || m.name.en}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category */}

        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].category}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {activeLanguage === "vi"
              ? "Nếu không chọn, danh mục phụ đầu tiên (Mặc định) sẽ được áp dụng tự động."
              : "If not selected, the first subcategory will be assigned automatically Default."}
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSubDropdown((p) => !p)}
              disabled={!formData.mainCategory}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border transition-all ${
                formData.mainCategory
                  ? "bg-[#171717] border-[#3A3A3A] text-gray-200 hover:border-gray-500"
                  : "bg-[#111] border-[#2E2F2F] text-gray-500 cursor-not-allowed"
              }`}
            >
              {(() => {
                const catId =
                  typeof formData.category === "object"
                    ? formData.category._id || formData.category.$oid
                    : formData.category;
                const selected = categories.find((c) => c._id === catId);
                return selected
                  ? selected.name[activeLanguage] || selected.name.en
                  : labels[activeLanguage].category;
              })()}
              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${
                  showSubDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSubDropdown && (
              <div className="absolute w-full mt-2 bg-[#1F1F1F] border border-[#2E2F2F] rounded-xl z-20 animate-fadeIn shadow-lg">
                {categories
                  .filter((c) => {
                    const mainCatId =
                      typeof formData.mainCategory === "object"
                        ? formData.mainCategory._id ||
                          formData.mainCategory.$oid
                        : formData.mainCategory;
                    return c.mainCategory?._id === mainCatId;
                  })
                  .map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        setFormData((p) => ({ ...p, category: c._id }));
                        setShowSubDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-md transition ${
                        (typeof formData.category === "object"
                          ? formData.category._id || formData.category.$oid
                          : formData.category) === c._id
                          ? "bg-[#2E2F2F] text-white"
                          : "text-gray-300 hover:bg-[#2A2A2A]"
                      }`}
                    >
                      {c.name[activeLanguage] || c.name.en}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={labelClasses}>
            {labels[activeLanguage].status}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusDropdown((p) => !p)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#3A3A3A] text-gray-200 hover:border-gray-500 transition-all"
            >
              {formData.status === "draft"
                ? labels[activeLanguage].draft
                : labels[activeLanguage].published}
              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showStatusDropdown && (
              <div className="absolute w-full mt-2 bg-[#1F1F1F] border border-[#2E2F2F] rounded-xl z-20 animate-fadeIn shadow-lg">
                {["draft", "published"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setFormData((p) => ({ ...p, status: s }));
                      setShowStatusDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-md transition ${
                      formData.status === s
                        ? "bg-[#2E2F2F] text-white"
                        : "text-gray-300 hover:bg-[#2A2A2A]"
                    }`}
                  >
                    {labels[activeLanguage][s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="border-t border-[#2E2F2F] pt-6">
          <h3 className="font-semibold text-gray-200 mb-2">
            {labels[activeLanguage].seo}
          </h3>

          {/* Meta Title */}
          <div>
            <label className={`${labelClasses} mt-8 mb-3`}>
              {labels[activeLanguage].metaTitle}
              <span className="text-red-500 text-lg">*</span>
            </label>
            <input
              type="text"
              className={inputClasses}
              value={formData.seo.title[activeLanguage]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: {
                    ...prev.seo,
                    title: {
                      ...prev.seo.title,
                      [activeLanguage]: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className={`${labelClasses} mt-8 mb-3`}>
              {labels[activeLanguage].metaDescription}
              <span className="text-red-500 text-lg">*</span>
            </label>
            <textarea
              rows={2}
              className={inputClasses}
              value={formData.seo.description[activeLanguage]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: {
                    ...prev.seo,
                    description: {
                      ...prev.seo.description,
                      [activeLanguage]: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>

          {/* ✅ Meta Keywords as Tag Input */}
          <div>
            <label className={`${labelClasses} mt-8 mb-3`}>
              {activeLanguage === "vi" ? "Từ khóa SEO" : "Meta Keywords"}
              <span className="text-red-500 text-lg">*</span>
            </label>

            {/* Display Added Keywords */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.seo.keywords?.[activeLanguage]
                ?.split(",")
                .map((kw) => kw.trim())
                .filter((kw) => kw)
                .map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-sm flex items-center gap-2"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const existing =
                            prev.seo.keywords?.[activeLanguage]
                              ?.split(",")
                              .map((k) => k.trim()) || [];
                          const updated = existing.filter((k) => k !== kw);
                          return {
                            ...prev,
                            seo: {
                              ...prev.seo,
                              keywords: {
                                ...prev.seo.keywords,
                                [activeLanguage]: updated.join(", "),
                              },
                            },
                          };
                        });
                      }}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
            </div>

            {/* Input field for new keyword */}
            <input
              type="text"
              className={inputClasses}
              placeholder={
                activeLanguage === "vi"
                  ? "Nhập từ khóa và nhấn Enter"
                  : "Type keyword and press Enter"
              }
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
            />
          </div>
        </div>

        {/* Errors */}
        {formErrors.length > 0 && (
          <div className="p-3 bg-red-900/40 border border-red-800 text-red-300 rounded-md">
            {formErrors.map((e, i) => (
              <p key={i}>• {e}</p>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-[#2E2F2F]">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-[#1F1F1F] border border-[#2E2F2F] hover:bg-[#2A2A2A] transition-all cursor-pointer"
          >
            {labels[activeLanguage].cancel}
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#0085C8] hover:bg-[#009FE3] text-white transition-all cursor-pointer"
          >
            {article
              ? labels[activeLanguage].update
              : labels[activeLanguage].save}
          </button>
        </div>
      </form>
      {/* Global Image Modal for Block Previews */}
      {showImage2Modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-3xl max-h-[90vh] w-auto">
            <img
              src={showImage2Modal.url}
              alt="Block Preview"
              className="max-h-[85vh] w-auto rounded-lg shadow-lg"
            />
            <button
              type="button"
              onClick={() => setShowImage2Modal(null)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition"
              title={activeLanguage === "vi" ? "Đóng" : "Close"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsArticleForm;
