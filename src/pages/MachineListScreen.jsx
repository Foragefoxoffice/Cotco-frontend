import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import { message } from "antd";
import { getMachinePages, deleteMachinePage } from "../Api/api";
import DeleteConfirm from "../components/DeleteConfirm";

const MachinePagesList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // ✅ Language detection (no extra file)
  const [isVietnamese, setIsVietnamese] = useState(false);
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const itemsPerPage = 10;

  // ✅ Translations
  const t = {
    title: isVietnamese ? "Trang Máy Móc" : "Machine Pages",
    subtitle: isVietnamese
      ? "Quản lý và chỉnh sửa tất cả các trang máy dưới đây"
      : "Manage and edit all machine pages below",
    create: isVietnamese ? "Tạo Trang" : "Create Page",
    searchPlaceholder: isVietnamese
      ? "Tìm kiếm theo tiêu đề hoặc slug..."
      : "Search by title or slug...",
    newest: isVietnamese ? "Mới nhất" : "Newest",
    oldest: isVietnamese ? "Cũ nhất" : "Oldest",
    az: "A → Z",
    za: "Z → A",
    headers: isVietnamese
      ? ["Tiêu đề", "Slug", "Danh mục", "Tiêu đề SEO", "Hành động"]
      : ["Title", "Slug", "Category", "SEO Title", "Actions"],
    loading: isVietnamese ? "Đang tải trang..." : "Loading pages...",
    noData: isVietnamese
      ? "Không tìm thấy trang máy nào."
      : "No machine pages found.",
    prev: isVietnamese ? "Trước" : "Prev",
    next: isVietnamese ? "Tiếp" : "Next",
    pageText: isVietnamese ? "Trang" : "Page",
  };

  // ✅ Fetch machine pages
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMachinePages();
        setPages(res.data.data || []);
      } catch {
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
    } catch {
      message.error("❌ Failed to delete page");
    }
  };

  // ✅ Filter + Sort
  const filteredPages = pages
    .filter((p) => {
      const query = searchQuery.toLowerCase();
      const title =
        (isVietnamese ? p.title?.vi || p.title?.en : p.title?.en)?.toLowerCase() || "";
      return title.includes(query) || p.slug?.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      const titleA = isVietnamese ? a.title?.vi || a.title?.en : a.title?.en;
      const titleB = isVietnamese ? b.title?.vi || b.title?.en : b.title?.en;
      if (sortOption === "az") return titleA?.localeCompare(titleB);
      if (sortOption === "za") return titleB?.localeCompare(titleA);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // ✅ Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPages = filteredPages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);

  return (
    <div className="p-6 bg-[#0A0A0A] min-h-screen text-white">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-4 rounded-full font-semibold shadow-md transition-all duration-300 bg-[#0085C8] hover:bg-[#009FE3] text-white cursor-pointer"
        >
          <Plus size={18} />
          {t.create}
        </button>
      </div>

      {/* ---------- SEARCH & SORT ---------- */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-4 bg-[#1F1F1F] border border-[#2E2F2F] rounded-full text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0085C8] outline-none"
          />
          <svg
            className="absolute left-3 top-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width={18}
            height={18}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.2-5.4a7.05 7.05 0 11-14.1 0 7.05 7.05 0 0114.1 0z"
            />
          </svg>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none px-5 py-3 text-sm bg-[#1F1F1F] text-white border border-[#2E2F2F] rounded-full w-52 focus:ring-2 focus:ring-[#0085C8] focus:border-[#0085C8] transition-all duration-200 outline-none cursor-pointer hover:border-gray-500"
          >
            <option value="newest">{t.newest}</option>
            <option value="oldest">{t.oldest}</option>
            <option value="az">{t.az}</option>
            <option value="za">{t.za}</option>
          </select>

          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-[#171717] rounded-lg shadow-xl border border-[#2E2F2F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1F1F1F] border-b border-[#2E2F2F]">
              <tr>
                {t.headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    {t.loading}
                  </td>
                </tr>
              ) : currentPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                currentPages.map((page) => (
                  <tr
                    key={page._id}
                    className="border-b border-[#2E2F2F] hover:bg-[#222] transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-200">
                      {isVietnamese
                        ? page.title?.vi || page.title?.en
                        : page.title?.en}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{page.slug}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {isVietnamese
                        ? page.category?.name?.vi || page.category?.name?.en
                        : page.category?.name?.en}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {page.seo?.metaTitle || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/machines/pages/${page._id}/edit`}
                          className="p-2 bg-[#0085C8]/20 hover:bg-[#0085C8]/40 rounded-md transition"
                        >
                          <Pencil size={16} className="text-white" />
                        </Link>
                        <DeleteConfirm onConfirm={() => handleDelete(page._id)}>
                          <div className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-md cursor-pointer transition"></div>
                        </DeleteConfirm>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- PAGINATION ---------- */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-1.5 rounded-full border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-50 cursor-pointer"
        >
          {t.prev}
        </button>
        <span className="text-gray-400 text-sm">
          {t.pageText} {currentPage} / {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-1.5 rounded-full border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-50 cursor-pointer"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default MachinePagesList;
