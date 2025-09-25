import React, { useState, useRef, useEffect } from "react";
import { X, Upload, PlusCircle, Trash2 } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import WysiwygEditor from "../WysiwygEditor";
import { slugify } from "../../utils/helpers";
import { getCategories } from "../../Api/api"; // ✅ fetch real categories

const blockTypes = [
  { value: "richtext", label: "Rich Text" },
  { value: "image", label: "Image" },
  { value: "list", label: "List" },
  { value: "quote", label: "Quote" },
  { value: "code", label: "Code Snippet" },
];

const NewsArticleForm = ({ article, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const fileInputRef = useRef(null);
  const [tagInput, setTagInput] = useState("");
  const isCreating = !article;

  // ✅ Categories state
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: { en: "", vn: "" },
    slug: "",
    excerpt: { en: "", vn: "" },
    coverImage: { url: "" },
    blocks: [],
    publishedAt: new Date().toISOString().split("T")[0],
    author: "Admin User",
    category: "", // ✅ dynamically filled
    tags: [],
    status: "draft",
    seo: {
      title: { en: "", vn: "" },
      description: { en: "", vn: "" },
    },
  });

  // ✅ Fetch categories from backend
  useEffect(() => {
    getCategories()
      .then((res) => {
        const cats = res.data.data || res.data;
        setCategories(cats);

        // prefill category if empty
        if (!formData.category && cats.length > 0) {
          setFormData((prev) => ({ ...prev, category: cats[0].slug }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  // ✅ Load article if editing
  useEffect(() => {
    if (article) {
      setFormData(article);
    }
  }, [article]);

  // ✅ Auto-generate slug
  useEffect(() => {
    if (isCreating && formData.title.en) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title.en) }));
    }
  }, [formData.title.en, isCreating]);

  const inputClasses =
    "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  // ✅ General field change
  const handleChange = (field, value, isTranslatable = false) => {
    if (isTranslatable) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [activeLanguage]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // ✅ SEO change
  const handleSEOChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: {
          ...prev.seo[field],
          [activeLanguage]: value,
        },
      },
    }));
  };

  // ✅ Image upload
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
      blocks[index].content =
        typeof blocks[index].content === "object" &&
        blocks[index].type !== "image"
          ? { ...blocks[index].content, [activeLanguage]: value }
          : value;
      return { ...prev, blocks };
    });
  };

  const removeBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {article ? "Edit Blog" : "Create New Blog"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
          <label className={labelClasses}>Title</label>
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
          <label className={labelClasses}>Slug</label>
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
          <label className={labelClasses}>Cover Image</label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {formData.coverImage.url ? (
                <img
                  src={formData.coverImage.url}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">Preview</span>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md"
            >
              <Upload size={16} className="inline mr-2" />
              Upload
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelClasses}>Excerpt</label>
          <textarea
            className={inputClasses}
            rows={3}
            value={formData.excerpt[activeLanguage]}
            onChange={(e) => handleChange("excerpt", e.target.value, true)}
          />
        </div>

        {/* Dynamic Blocks */}
        <div>
          <label className={labelClasses}>Content Blocks</label>
          <div className="space-y-4 mt-2">
            {formData.blocks.map((block, i) => (
              <div
                key={i}
                className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700/30"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize">{block.type}</span>
                  <button
                    type="button"
                    onClick={() => removeBlock(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {block.type === "richtext" && (
                  <WysiwygEditor
                    value={block.content[activeLanguage] || ""}
                    onChange={(content) => updateBlock(i, content)}
                  />
                )}
                {block.type === "image" && (
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="Image URL"
                    value={block.content.url}
                    onChange={(e) => updateBlock(i, { url: e.target.value })}
                  />
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
          <div className="flex space-x-2 mt-3">
            {blockTypes.map((bt) => (
              <button
                key={bt.value}
                type="button"
                onClick={() => addBlock(bt.value)}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm flex items-center"
              >
                <PlusCircle size={14} className="mr-1" /> {bt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meta: Date, Author, Category, Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Published Date</label>
            <input
              type="date"
              className={inputClasses}
              value={formData.publishedAt}
              onChange={(e) => handleChange("publishedAt", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClasses}>Author</label>
            <input
              type="text"
              className={inputClasses}
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
            />
          </div>
        </div>

        {/* ✅ Category Select */}
        <div>
          <label className={labelClasses}>Category</label>
          <select
            className={inputClasses}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name[activeLanguage] || c.name.en}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Status</label>
          <select
            className={inputClasses}
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClasses}>Tags</label>
          <div className="flex mt-1 flex-wrap gap-2 p-2 border rounded-md bg-white dark:bg-gray-700">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tag and press Enter"
              className="flex-grow outline-none bg-transparent text-gray-800 dark:text-gray-100 p-1"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            SEO Settings
          </h3>
          <div>
            <label className={labelClasses}>Meta Title</label>
            <input
              type="text"
              className={inputClasses}
              value={formData.seo.title[activeLanguage]}
              onChange={(e) => handleSEOChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClasses}>Meta Description</label>
            <textarea
              rows={2}
              className={inputClasses}
              value={formData.seo.description[activeLanguage]}
              onChange={(e) => handleSEOChange("description", e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-600 border rounded-md cursor-pointer hover:bg-red-50 dark:hover:bg-red-500 text-red-600 dark:text-red-300 hover:text-white-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
          >
            {article ? "Update Blog" : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsArticleForm;
