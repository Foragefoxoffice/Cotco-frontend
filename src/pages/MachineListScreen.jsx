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
  const [sortOption, setSortOption] = useState("oldest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
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

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ Translations
  const t = {
    title: isVietnamese ? "Danh sách máy móc" : "Machine List",
    subtitle: isVietnamese
      ? "Quản lý và chỉnh sửa tất cả các trang máy dưới đây"
      : "Manage and edit all machine list below",
    create: isVietnamese ? "Thêm máy móc" : "Add Machine",
    searchPlaceholder: isVietnamese
      ? "Tìm kiếm theo tiêu đề..."
      : "Search by title...",
    newest: isVietnamese ? "Mới nhất" : "Newest",
    oldest: isVietnamese ? "Cũ nhất" : "Oldest",
    az: "A → Z",
    za: "Z → A",
    headers: isVietnamese
      ? ["STT", "Tiêu đề", "Danh mục", "Hành động"]
      : ["S.No", "Title", "Category", "Actions"],
    loading: isVietnamese ? "Đang tải trang..." : "Loading pages...",
    noData: isVietnamese
      ? "Không tìm thấy trang máy nào."
      : "No machine list found.",
    prev: isVietnamese ? "Trước" : "Prev",
    next: isVietnamese ? "Tiếp" : "Next",
    pageText: isVietnamese ? "Trang" : "Page",
    sortBy: isVietnamese ? "Sắp xếp theo" : "Sort by",
    rowsPerPage: isVietnamese ? "Hàng mỗi trang" : "Rows per page",
    of: isVietnamese ? "của" : "of",
  };

  // ✅ Fetch machine pages
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMachinePages();
        setPages(res.data.data || []);
      } catch {
        message.error("❌ Failed to load machine list");
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
      return title.includes(query);
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
      <style>{`
        /* Dropdown animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>

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
            className="w-full pl-10 pr-3 py-4 bg-[#1F1F1F] border border-[#2E2F2F] rounded-full text-sm !text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0085C8] outline-none"
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
        <div className="relative dropdown-container w-full sm:w-auto">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center justify-between w-full sm:w-52 px-5 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] !text-white hover:border-gray-500 transition-all cursor-pointer"
          >
            {sortOption === "newest"
              ? t.newest
              : sortOption === "oldest"
                ? t.oldest
                : sortOption === "az"
                  ? t.az
                  : t.za}
            <svg
              className={`ml-2 w-4 h-4 transform transition-transform ${showDropdown ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-full sm:w-52 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-10 animate-fadeIn">
              <p className="px-4 py-2 !text-gray-400 text-xs">{t.sortBy}</p>
              {[
                { value: "oldest", label: t.oldest },
                { value: "newest", label: t.newest },
                { value: "az", label: t.az },
                { value: "za", label: t.za },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setShowDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${sortOption === option.value
                    ? "bg-[#2E2F2F] !text-white rounded-xl"
                    : "!text-gray-300 hover:bg-[#2E2F2F] hover:text-white rounded-xl"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-[#171717] rounded-tl-lg rounded-tr-lg shadow-xl border border-[#2E2F2F] overflow-hidden">
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
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    {t.loading}
                  </td>
                </tr>
              ) : currentPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                currentPages.map((page, index) => (
                  <tr
                    key={page._id}
                    className="border-b border-[#2E2F2F] hover:bg-[#222] transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400">
                      {(indexOfFirst + index + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4 text-gray-200">
                      {isVietnamese
                        ? page.title?.vi || page.title?.en
                        : page.title?.en}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {isVietnamese
                        ? page.category?.name?.vi || page.category?.name?.en
                        : page.category?.name?.en}
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
      {!loading && filteredPages.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-end w-full bg-[#171717] items-center gap-4 py-2 px-4 rounded-br-lg rounded-bl-lg">
          {/* Rows per page dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">{t.rowsPerPage}:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-[#1F1F1F] border border-[#2E2F2F] rounded-lg !text-white text-sm focus:ring-2 focus:ring-[#0085C8] outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          {/* Page info and navigation */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {indexOfFirst + 1}-{Math.min(indexOfLast, filteredPages.length)} {t.of}{" "}
              {filteredPages.length}
            </span>

            <div className="flex items-center gap-2">
              {/* First page */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="First page"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                </svg>
              </button>

              {/* Previous page */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Previous page"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Next page */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Next page"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Last page */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Last page"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachinePagesList;
