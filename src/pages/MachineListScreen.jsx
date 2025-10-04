import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { message } from "antd";
import { getMachinePages, deleteMachinePage } from "../Api/api";

const MachinePagesList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMachinePages(); // fetch all pages
        setPages(res.data.data || []);
      } catch (err) {
        message.error("❌ Failed to load machine pages");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = () => {
    navigate("/admin/machines/new");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      await deleteMachinePage(id);
      setPages((prev) => prev.filter((p) => p._id !== id));
      message.success("✅ Page deleted");
    } catch (err) {
      message.error("❌ Failed to delete page");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Machine Pages
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Create Page
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SEO Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pages.map((page) => (
                <tr
                  key={page._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {page.title?.en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {page.category?.name?.en || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {page.seo?.metaTitle || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/machines/pages/${page._id}/edit`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(page._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    No machine pages found.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    Loading pages...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MachinePagesList;
