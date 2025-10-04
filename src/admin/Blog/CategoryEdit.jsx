import { useEffect, useState } from "react";
import { getCategory, updateCategory } from "../../Api/api";
import { useNavigate, useParams } from "react-router-dom";
import { CommonToaster } from "../../Common/CommonToaster";

export default function CategoryEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: { en: "", vn: "" },
    description: { en: "", vn: "" },
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategory(id);
        setFormData(res.data.data);
      } catch (err) {
        console.error("Error fetching category:", err);
        CommonToaster("Failed to load category", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e, lang, field) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], [lang]: e.target.value },
    });
    if (errors[`${field}-${lang}`]) {
      setErrors({ ...errors, [`${field}-${lang}`]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(id, formData);
      CommonToaster("Category updated successfully!", "success");
      navigate("/categories");
    } catch (err) {
      console.error("Update error:", err);
      CommonToaster("Failed to update category", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Category</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name (EN) */}
        <div>
          <label className="block font-medium mb-2">Category Name (English)</label>
          <input
            type="text"
            value={formData.name.en}
            onChange={(e) => handleChange(e, "en", "name")}
            className="w-full px-4 py-2 border rounded-lg border-gray-300"
          />
        </div>

        {/* Name (VN) */}
        <div>
          <label className="block font-medium mb-2">Category Name (Vietnamese)</label>
          <input
            type="text"
            value={formData.name.vn}
            onChange={(e) => handleChange(e, "vn", "name")}
            className="w-full px-4 py-2 border rounded-lg border-gray-300"
          />
        </div>

        {/* Description (EN) */}
        <div>
          <label className="block font-medium mb-2">Description (English)</label>
          <textarea
            value={formData.description.en}
            onChange={(e) => handleChange(e, "en", "description")}
            className="w-full px-4 py-2 border rounded-lg border-gray-300"
            rows="3"
          />
        </div>

        {/* Description (VN) */}
        <div>
          <label className="block font-medium mb-2">Description (Vietnamese)</label>
          <textarea
            value={formData.description.vn}
            onChange={(e) => handleChange(e, "vn", "description")}
            className="w-full px-4 py-2 border rounded-lg border-gray-300"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-gradient-to-r from-[rgb(0,114,147)] to-[rgb(0,76,112)] hover:from-[rgb(0,100,130)] hover:to-[rgb(0,60,95)]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
