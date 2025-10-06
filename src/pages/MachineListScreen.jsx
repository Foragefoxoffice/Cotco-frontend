import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { message } from "antd";
import { getMachinePages, deleteMachinePage } from "../Api/api";
import DeleteConfirm from "../components/DeleteConfirm";

const MachinePagesList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // ✅ Fetch all machine pages
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMachinePages();
        setPages(res.data.data || []);
      } catch (err) {
        message.error("❌ Failed to load machine pages");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = () => navigate("/admin/machines/new");

  const handleDelete = async (id) => {
    try {
      await deleteMachinePage(id);
      setPages((prev) => prev.filter((p) => p._id !== id));
      message.success("✅ Page deleted");
    } catch (err) {
      message.error("❌ Failed to delete page");
    }
  };

  // ✅ Filter & Sort
  const filteredPages = pages
    .filter((p) => {
      const query = searchQuery.toLowerCase();
      return (
        p.title?.en?.toLowerCase().includes(query) ||
        p.slug?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortOption === "az")
        return a.title?.en?.localeCompare(b.title?.en || "");
      if (sortOption === "za")
        return b.title?.en?.localeCompare(a.title?.en || "");
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  // ✅ Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPages = filteredPages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 bg-[#0A0A0A] min-h-screen text-white">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Machine Pages</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and edit all machine pages below
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-4 rounded-full font-semibold shadow-md transition-all duration-300 bg-[#0085C8] hover:bg-[#009FE3] text-white"
        >
          <Plus size={18} />
          Create Page
        </button>
      </div>

      {/* ---------- SEARCH & SORT ---------- */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-4  text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-4 bg-[#1F1F1F] border border-[#2E2F2F] rounded-full text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0085C8] outline-none"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 text-sm border border-[#2E2F2F] bg-[#1F1F1F] text-white rounded-full focus:ring-2 focus:ring-[#0085C8] outline-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-[#171717] rounded-lg shadow-xl border border-[#2E2F2F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1F1F1F] border-b border-[#2E2F2F]">
              <tr>
                {["Title", "Slug", "Category", "SEO Title", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    Loading pages...
                  </td>
                </tr>
              )}

              {!loading && currentPages.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    No machine pages found.
                  </td>
                </tr>
              )}

              {currentPages.map((page) => (
                <tr
                  key={page._id}
                  className="border-b border-[#2E2F2F] hover:bg-[#222] transition-colors"
                >
                  <td className="px-6 py-4 text-gray-200">
                    {page.title?.en || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{page.slug}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {page.category?.name?.en || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {page.seo?.metaTitle || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Edit */}
                      <Link
                        to={`/admin/machines/pages/${page._id}/edit`}
                        className="flex items-center justify-center p-2 bg-[#0085C8]/20 hover:bg-[#0085C8]/40 rounded-md transition"
                      >
                        <Pencil size={16} className="text-white" />
                      </Link>

                      {/* Delete */}
                      <DeleteConfirm onConfirm={() => handleDelete(page._id)}>
                        <div className="flex items-center justify-center p-2 bg-red-500/20 hover:bg-red-500/40 rounded-md cursor-pointer transition">
                          <Trash2 size={16} className="text-red-400" />
                        </div>
                      </DeleteConfirm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- PAGINATION ---------- */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={handlePrev}
          className="px-4 py-1.5 rounded-lg border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-400 text-sm">
          Page {currentPage} / {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={handleNext}
          className="px-4 py-1.5 rounded-lg border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MachinePagesList;
