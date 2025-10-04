import { useState } from "react";
import { createCategory } from "../../Api/api"; // ✅ from api.js
import { useNavigate } from "react-router-dom";
import { CommonToaster } from "../../Common/CommonToaster";

export default function CategoriesCreate() {
  const [formData, setFormData] = useState({
    name: { en: "", vn: "" },
    description: { en: "", vn: "" },
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, lang, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [lang]: e.target.value,
      },
    });

    if (errors[`${field}-${lang}`]) {
      setErrors({ ...errors, [`${field}-${lang}`]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.en) newErrors["name-en"] = "English name is required";
    if (!formData.name.vn) newErrors["name-vn"] = "Vietnamese name is required";
    if (!formData.description.en)
      newErrors["description-en"] = "English description is required";
    if (!formData.description.vn)
      newErrors["description-vn"] = "Vietnamese description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createCategory(formData);

      CommonToaster("Category created successfully!", "success");
      navigate("/categories");
    } catch (error) {
      console.error("Category create error:", error);
      setErrors({
        submit:
          error.response?.data?.error ||
          "Failed to create category. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Blog Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Category Name (English)
          </label>
          <input
            type="text"
            value={formData.name.en}
            onChange={(e) => handleChange(e, "en", "name")}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors["name-en"] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter category name in English"
          />
          {errors["name-en"] && (
            <p className="text-red-500 text-sm mt-1">{errors["name-en"]}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Category Name (Vietnamese)
          </label>
          <input
            type="text"
            value={formData.name.vn}
            onChange={(e) => handleChange(e, "vn", "name")}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors["name-vn"] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tên danh mục bằng tiếng Việt"
          />
          {errors["name-vn"] && (
            <p className="text-red-500 text-sm mt-1">{errors["name-vn"]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Description (English)
          </label>
          <textarea
            value={formData.description.en}
            onChange={(e) => handleChange(e, "en", "description")}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors["description-en"] ? "border-red-500" : "border-gray-300"
            }`}
            rows="3"
            placeholder="Enter description in English"
          />
          {errors["description-en"] && (
            <p className="text-red-500 text-sm mt-1">
              {errors["description-en"]}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Description (Vietnamese)
          </label>
          <textarea
            value={formData.description.vn}
            onChange={(e) => handleChange(e, "vn", "description")}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors["description-vn"] ? "border-red-500" : "border-gray-300"
            }`}
            rows="3"
            placeholder="Nhập mô tả bằng tiếng Việt"
          />
          {errors["description-vn"] && (
            <p className="text-red-500 text-sm mt-1">
              {errors["description-vn"]}
            </p>
          )}
        </div>

        {/* Error Submit */}
        {errors.submit && (
          <div className="bg-red-50 p-3 rounded text-red-600 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-gradient-to-r from-[rgb(0,114,147)] to-[rgb(0,76,112)] hover:from-[rgb(0,100,130)] hover:to-[rgb(0,60,95)] disabled:opacity-75"
        >
          {isLoading ? "Saving..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}
