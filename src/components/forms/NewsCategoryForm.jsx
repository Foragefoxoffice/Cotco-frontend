import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TranslationTabs from "../TranslationTabs";
import { slugify } from "../../utils/helpers";
import { createCategory, updateCategory } from "../../Api/api"; // ✅ import API
import { CommonToaster } from "../../Common/CommonToaster";

const NewsCategoryForm = ({ category, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: category?.name || { en: "", vn: "" },
    slug: category?.slug || "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isCreating = !category;

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

  const validateForm = () => {
    const newErrors = {};

    // Only validate the active language input
    if (!formData.name[activeLanguage]) {
      newErrors[`name-${activeLanguage}`] = `${
        activeLanguage === "en" ? "English" : "Vietnamese"
      } name is required`;
    }

    if (!formData.slug) newErrors.slug = "Slug is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // 🚫 prevent double-submit

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let savedCategory;
      if (isCreating) {
        const res = await createCategory(formData);
        savedCategory = res.data.data || res.data;
        CommonToaster("Category created successfully!", "success");
        console.log("Submitting category...", formData);
      } else {
        const res = await updateCategory(category._id || category.id, formData);
        savedCategory = res.data.data || res.data;
        CommonToaster("Category updated successfully!", "success");
      }

      if (onSave) onSave(savedCategory);
      onClose();
    } catch (error) {
      console.error("Category save error:", error.response || error);
      setErrors({
        submit:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save category. Try again later.",
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
          {category ? "Edit Category" : "Create New Category"}
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
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault(); // 🚫 block accidental Enter submit
        }}
        className="mt-6 space-y-6"
      >
        <div>
          <label htmlFor="name" className={labelClasses}>
            Category Name
          </label>
          <input
            type="text"
            id="name"
            className={inputClasses}
            value={formData.name[activeLanguage]}
            onChange={(e) => handleChange(e.target.value)}
            required
          />
          {errors[`name-${activeLanguage}`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`name-${activeLanguage}`]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="slug" className={labelClasses}>
            Slug
          </label>
          <input
            type="text"
            id="slug"
            className={inputClasses}
            value={formData.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900 p-3 rounded text-red-600 dark:text-red-200 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit" // ✅ only submit via form
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70"
          >
            {isLoading
              ? "Saving..."
              : category
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsCategoryForm;
