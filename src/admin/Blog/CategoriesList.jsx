import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../Api/api";
import { useNavigate, Link } from "react-router-dom";
import { CommonToaster } from "../../Common/CommonToaster";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      CommonToaster("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      CommonToaster("Category deleted successfully", "success");
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
      CommonToaster("Failed to delete category", "error");
    }
  };

  if (loading) return <p className="p-6">Loading categories...</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={() => navigate("/categories/create")}
          className="px-4 py-2 bg-[rgb(0,114,147)] text-white rounded-lg hover:bg-[rgb(0,90,120)]"
        >
          + New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Name (EN)</th>
              <th className="p-3 border">Name (VN)</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat._id} className="hover:bg-gray-50">
                <td className="p-3 border">{i + 1}</td>
                <td className="p-3 border">{cat.name.en}</td>
                <td className="p-3 border">{cat.name.vn}</td>
                <td className="p-3 border space-x-3">
                  <Link
                    to={`/admin/blogs/categories/edit/${cat._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
