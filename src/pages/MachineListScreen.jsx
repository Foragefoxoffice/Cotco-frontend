import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Pencil } from "lucide-react";
import { message } from "antd";
import { getMachinePages, deleteMachinePage } from "../Api/api";
import DeleteConfirm from "../components/DeleteConfirm"; // ✅ use your custom popup

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
        <h1 className="text-2xl font-bold text-white">Machine Pages</h1>
        <button
  onClick={handleCreate}
  className="flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-white shadow-md transition-all duration-300 cursor-pointer bg-[#0085C8]"
  style={{
    color:"#fff",
  }}
 
>
  <Plus size={18} className="mr-1" />
  Create Page
</button>

      </div>

      <div className="bg-[#0A0A0A] rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-[#2E2F2F]">
          <table className="min-w-full rounded-4xl ">
            <thead className="bg-[#171717]">
              <tr className="border border-b-[#2E2F2F]">
                <th className="px-6 py-4 text-left text-md font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-white uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-white uppercase tracking-wider">
                  SEO Title
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#171717]">
              {pages.map((page) => (
                <tr
                  key={page._id}
                  className="hover:bg-[#262626] border border-b-[#2E2F2F]"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {page.title?.en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {page.category?.name?.en || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {page.seo?.metaTitle || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex justify-start space-x-2">
                      <Link
                        to={`/admin/machines/pages/${page._id}/edit`}
                        className="text-white p-1"
                      >
                        <Pencil
                          size={18}
                          style={{
                            color: "white",
                          }}
                        />
                      </Link>

                      {/* ✅ DeleteConfirm instead of window.confirm */}
                      <DeleteConfirm onConfirm={() => handleDelete(page._id)}>
                        <Trash2
                          size={20}
                          className="text-red-500 cursor-pointer p-1"
                        />
                      </DeleteConfirm>
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
