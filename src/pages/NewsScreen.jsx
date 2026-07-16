// src/pages/NewsScreen.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  User,
  Tag,
  Edit,
  Trash2,
  Eye,
  Search,
  Pencil,
} from "lucide-react";
import NewsArticleForm from "../components/forms/NewsArticleForm";
import { getBlogs, createBlog, updateBlog, deleteBlog, getCategories, getMainBlogCategories } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import BlogCardSkeleton from "./BlogCardSkeleton";

// ThemeContext removed on purpose — using dark styles everywhere

const NewsScreen = () => {
  const [view, setView] = useState("grid");
  const [newsArticles, setNewsArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);

  // 🔹 Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 🔹 Pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [articlesPerPage] = useState(10);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMainCatDropdown, setShowMainCatDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 🔹 Filters
  const [mainCategoryFilter, setMainCategoryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueMainCategories, setUniqueMainCategories] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    // Fetch categories for dropdowns
    const fetchCats = async () => {
      try {
        const [catsRes, mainCatsRes] = await Promise.all([
          getCategories(),
          getMainBlogCategories()
        ]);
        const catData = catsRes.data?.data || catsRes.data || [];
        const mainCatData = mainCatsRes.data?.data || mainCatsRes.data || [];

        setUniqueCategories(catData.map(c => ({
          id: c._id,
          name: c.name || { en: "Uncategorized", vi: "Chưa phân loại" },
          main: c.mainCategory?._id || c.mainCategory || "uncategorized-main"
        })));

        setUniqueMainCategories(mainCatData.map(mc => ({
          id: mc._id,
          name: mc.name || { en: "Uncategorized", vi: "Chưa phân loại" }
        })));
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCats();
  }, []);

  // ✅ Watch language (body class)
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(
        typeof document !== "undefined" &&
        document.body.classList.contains("vi-mode")
      );
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ dictionary
  const t = {
    title: isVietnamese ? "Tin tức & Sự kiện" : "Resources",
    subtitle: isVietnamese
      ? "Quản lý toàn bộ nội dung Tài nguyên"
      : "Manage all Resources content",
    create: isVietnamese ? "Tạo tin tức" : "Create Content",
    search: isVietnamese ? "Tìm kiếm..." : "Search...",
    sortBy: isVietnamese ? "Sắp xếp theo" : "Sort by",
    newest: isVietnamese ? "Mới nhất" : "Newest",
    oldest: isVietnamese ? "Cũ nhất" : "Oldest",
    published: isVietnamese ? "Đã xuất bản" : "Published",
    draft: isVietnamese ? "Bản nháp" : "Draft",
    titleSort: isVietnamese ? "Tiêu đề" : "Title",
    deleteConfirm: isVietnamese
      ? "Bạn có chắc muốn xóa bài viết này?"
      : "Are you sure you want to delete this blog?",
    deleteSuccess: isVietnamese
      ? "Xóa bài viết thành công"
      : "Blog deleted successfully",
    deleteFail: isVietnamese
      ? "Xóa bài viết thất bại"
      : "Failed to delete blog",
    loadFail: isVietnamese ? "Không thể tải tin tức" : "Failed to load blogs",
    saveFail: isVietnamese ? "Lưu bài viết thất bại" : "Failed to save blog",
    saveSuccess: isVietnamese
      ? "Lưu bài viết thành công"
      : "Blog created successfully",
    updateSuccess: isVietnamese
      ? "Cập nhật thành công"
      : "Blog updated successfully",
    filterMain: isVietnamese ? "Danh mục chính" : "Main Category",
    filterCategory: isVietnamese ? "Danh mục phụ" : "Category",
    all: isVietnamese ? "Tất cả" : "All",
  };

  // Normalize API blog object safely so UI never tries to render raw objects directly
  const normalizeBlog = (b) => {
    // Title: ensure en/vi keys
    const title = {
      en: b.title?.en || (typeof b.title === "string" ? b.title : "") || "",
      vi: b.title?.vi || (b.title && b.title.vi) || "",
    };

    // category/mainCategory names (could be object or string)
    const mainCategoryName = {
      en:
        b.mainCategory?.name?.en ||
        (typeof b.mainCategory?.name === "string" ? b.mainCategory.name : "") ||
        "",
      vi:
        b.mainCategory?.name?.vi ||
        (typeof b.mainCategory?.name === "string" ? b.mainCategory.name : "") ||
        "",
    };

    const categoryName = {
      en:
        b.category?.name?.en ||
        (typeof b.category?.name === "string" ? b.category.name : "") ||
        "",
      vi:
        b.category?.name?.vi ||
        (typeof b.category?.name === "string" ? b.category.name : "") ||
        "",
    };

    return {
      ...b,
      title,
      mainCategoryName,
      categoryName,
      mainCategoryId: b.mainCategory?._id || b.mainCategory || "",
      categoryId: b.category?._id || b.category || "",
      publishedAt: b.publishedAt || b.createdAt || new Date().toISOString(),
    };
  };

  // ✅ Fetch blogs with pagination and filters
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: articlesPerPage,
        sortOption: sortOption
      };
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (mainCategoryFilter !== "all") params.mainCategory = mainCategoryFilter;

      const res = await getBlogs(params);

      const raw = res.data?.data || res.data || [];
      const blogs = raw.map((b) => normalizeBlog(b));

      setNewsArticles(blogs);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      CommonToaster(t.loadFail, "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const closeAllDropdowns = () => {
    setShowSortDropdown(false);
    setShowStatusDropdown(false);
    setShowMainCatDropdown(false);
    setShowCategoryDropdown(false);
  };


  useEffect(() => {
    fetchBlogs();
  }, [currentPage, debouncedSearchQuery, sortOption, statusFilter, categoryFilter, mainCategoryFilter]);

  // ✅ Create/Edit/Delete Handlers
  const handleCreate = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleEdit = (article) => {
    // article might be normalized already; pass as-is
    setEditingArticle(article);
    setShowForm(true);
  };

  // 🔹 Open confirmation modal instead of window.confirm
  const handleDelete = (article) => {
    setDeleteTarget(article);
    setShowDeleteModal(true);
  };

  // 🔹 Confirm delete action
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlog(deleteTarget._id);
      setNewsArticles((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      CommonToaster(t.deleteSuccess, "success");
    } catch (err) {
      console.error("Delete error:", err);
      CommonToaster(t.deleteFail, "error");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleView = (slug) => {
    window.open(`/blogs/${slug}`, "_blank");
  };
  const safeText = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val.en || val.vi || JSON.stringify(val);
    }
    return String(val);
  };

  /**
   * Handle save (create or update).
   * - For create: insert new blog at the top and ensure sorting by publishedAt.
   * - For update: either refetch single item or update local list and keep sorting.
   */
  const handleSaveArticle = async (articleData) => {
    try {
      if (editingArticle) {
        // Update on server, then update local list
        const res = await updateBlog(editingArticle._id, articleData);
        const updatedRaw = res.data?.data || res.data;
        const updated = normalizeBlog(updatedRaw);

        setNewsArticles((prev) =>
          prev
            .map((p) =>
              p._id === updated._id
                ? {
                  ...updated,
                  publishedAt:
                    updated.publishedAt || updated.createdAt || p.publishedAt,
                }
                : p
            )
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        );

        CommonToaster(t.updateSuccess, "success");
      } else {
        // Create new blog
        const res = await createBlog(articleData);
        const newRaw = res.data?.data || res.data;
        const newBlog = normalizeBlog(newRaw);

        // Provide robust fallback timestamps
        const publishedAt =
          newBlog.publishedAt || newBlog.createdAt || new Date().toISOString();

        // Add to top of list
        setNewsArticles((prev) =>
          [{ ...newBlog, publishedAt }, ...prev].sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          )
        );

        CommonToaster(t.saveSuccess, "success");
      }
    } catch (err) {
      console.error("Save error:", err);
      // If server returned a message, you may show it
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        t.saveFail;
      CommonToaster(msg, "error");
    } finally {
      handleCloseForm();
    }
  };

  // We no longer need to derive uniqueCategories locally or filter/slice locally.
  const currentArticles = newsArticles;

  // Loading state (dark style)
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-[#171717]">
        {Array.from({ length: 6 }).map((_, idx) => (
          <BlogCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // Main render (dark-based styles)
  return (
    <div className="transition-colors pb-5 duration-300 rounded-2xl bg-[#171717] text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1 p-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4 rounded-full py-4 flex items-center cursor-pointer transition bg-[#0085C8] text-white"
        >
          <Plus size={18} className="mr-2" /> {t.create}
        </button>
      </div>

      <div className="px-6 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t.search}
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "2rem",
              color: "#fff",
              padding: "15px 14px 15px 38px",
              fontSize: "14px",
              width: "100%",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-6">
        {/* Sort Dropdown */}
        <div className="relative dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowSortDropdown(true);
            }}

            className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 focus:border-[#3A3A3A] transition-all cursor-pointer"
          >
            {sortOption === "oldest"
              ? t.oldest
              : sortOption === "newest"
                ? t.newest
                : t.titleSort}
            <svg
              className={`ml-2 w-4 h-4 transform transition-transform ${showSortDropdown ? "rotate-180" : ""
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

          {showSortDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-20 animate-fadeIn"
              style={{ animation: "fadeIn 0.15s ease-in-out" }}
            >
              <p className="px-4 pt-2 text-gray-400 text-xs">{t.sortBy}</p>
              {[
                { value: "newest", label: t.newest },
                { value: "oldest", label: t.oldest },
                { value: "title", label: t.titleSort },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setShowSortDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${sortOption === option.value
                    ? "bg-[#2E2F2F] text-white rounded-lg"
                    : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                    }`}
                >
                  {option.label}
                </button>
              ))}
              <div className="pb-2" />
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowStatusDropdown(true);
            }}


            className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 focus:border-[#3A3A3A] transition-all cursor-pointer"
          >
            {statusFilter === "published"
              ? t.published
              : statusFilter === "draft"
                ? t.draft
                : `${t.all} Status`}
            <svg
              className={`ml-2 w-4 h-4 transform transition-transform ${showStatusDropdown ? "rotate-180" : ""
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

          {showStatusDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-20 animate-fadeIn"
              style={{ animation: "fadeIn 0.15s ease-in-out" }}
            >
              <p className="px-4 pt-2 text-gray-400 text-xs">{t.sortBy}</p>
              {[
                { value: "all", label: `${t.all} Status` },
                { value: "published", label: t.published },
                { value: "draft", label: t.draft },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setShowStatusDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${statusFilter === option.value
                    ? "bg-[#2E2F2F] text-white rounded-lg"
                    : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                    }`}
                >
                  {option.label}
                </button>
              ))}
              <div className="pb-2" />
            </div>
          )}
        </div>

        {/* Main Category Filter */}
        <div className="relative dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowMainCatDropdown(true);
            }}


            className="flex items-center justify-between w-56 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 focus:border-[#3A3A3A] transition-all cursor-pointer"
          >
            {mainCategoryFilter === "all"
              ? `${t.all} ${t.filterMain}`
              : uniqueMainCategories.find((mc) => mc.id === mainCategoryFilter)
                ?.name[isVietnamese ? "vi" : "en"] ||
              uniqueMainCategories.find((mc) => mc.id === mainCategoryFilter)
                ?.name.en ||
              uniqueMainCategories.find((mc) => mc.id === mainCategoryFilter)
                ?.name ||
              `${t.all} ${t.filterMain}`}

            <svg
              className={`ml-2 w-4 h-4 transform transition-transform ${showMainCatDropdown ? "rotate-180" : ""
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

          {showMainCatDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-20 animate-fadeIn"
              style={{ animation: "fadeIn 0.15s ease-in-out" }}
            >
              <p className="px-4 pt-2 text-gray-400 text-xs">{t.filterMain}</p>

              <button
                onClick={() => {
                  setMainCategoryFilter("all");
                  setCategoryFilter("all");
                  setCurrentPage(1);
                  setShowMainCatDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${mainCategoryFilter === "all"
                  ? "bg-[#2E2F2F] text-white rounded-lg"
                  : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                  }`}
              >
                {`${t.all} ${t.filterMain}`}
              </button>

              {uniqueMainCategories.map((mc) => (
                <button
                  key={mc.id}
                  onClick={() => {
                    setMainCategoryFilter(mc.id);
                    setCategoryFilter("all");
                    setCurrentPage(1);
                    setShowMainCatDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${mainCategoryFilter === mc.id
                    ? "bg-[#2E2F2F] text-white rounded-lg"
                    : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                    }`}
                >
                  {mc.name[isVietnamese ? "vi" : "en"] || mc.name.en || mc.name}
                </button>
              ))}
              <div className="pb-2" />
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowCategoryDropdown(true);
            }}


            className="flex items-center justify-between w-56 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 focus:border-[#3A3A3A] transition-all cursor-pointer"
          >
            {categoryFilter === "all"
              ? `${t.all} ${t.filterCategory}`
              : uniqueCategories.find((c) => c.id === categoryFilter)?.name[
              isVietnamese ? "vi" : "en"
              ] ||
              uniqueCategories.find((c) => c.id === categoryFilter)?.name
                .en ||
              uniqueCategories.find((c) => c.id === categoryFilter)?.name ||
              `${t.all} ${t.filterCategory}`}

            <svg
              className={`ml-2 w-4 h-4 transform transition-transform ${showCategoryDropdown ? "rotate-180" : ""
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

          {showCategoryDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-20 animate-fadeIn"
              style={{ animation: "fadeIn 0.15s ease-in-out" }}
            >
              <p className="px-4 pt-2 text-gray-400 text-xs">
                {t.filterCategory}
              </p>

              {/* "All" Option */}
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setCurrentPage(1);
                  setShowCategoryDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${categoryFilter === "all"
                  ? "bg-[#2E2F2F] text-white rounded-lg"
                  : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                  }`}
              >
                {`${t.all} ${t.filterCategory}`}
              </button>

              {/* Filtered Categories */}
              {uniqueCategories
                .filter((c) =>
                  mainCategoryFilter === "all"
                    ? true
                    : c.main === mainCategoryFilter
                )
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategoryFilter(c.id);
                      setCurrentPage(1);
                      setShowCategoryDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${categoryFilter === c.id
                      ? "bg-[#2E2F2F] text-white rounded-lg"
                      : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                      }`}
                  >
                    {c.name[isVietnamese ? "vi" : "en"] || c.name.en || c.name}
                  </button>
                ))}

              <div className="pb-2" />
            </div>
          )}
        </div>
      </div>

      {/* Blog Cards */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {currentArticles.map((article) => (
            <div
              key={article._id}
              className="rounded-lg shadow-sm border border-[#2E2F2F] overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-[#262626]"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.coverImage?.url || article.thumbnail}
                  alt={
                    isVietnamese
                      ? article.title?.vi || article.title?.en
                      : article.title?.en
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow relative">
                <h3 className="text-lg font-medium mb-2 pt-2">
                  {isVietnamese
                    ? article.title?.vi || article.title?.en
                    : article.title?.en}
                </h3>
                <div className="flex items-center text-sm text-gray-400 mb-4 flex-wrap gap-x-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-gray-300">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span className="text-gray-300">{article.author}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-tl-lg rounded-bl-lg absolute top-[-8px] right-0 text-xs mt-2 font-medium ${article.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {article.status === "published" ? t.published : t.draft}
                  </span>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  <span className="flex items-center text-sm bg-gray-700 text-gray-200 px-2 py-1 rounded">
                    <Tag size={14} className="mr-1" />
                    {safeText(
                      article.categoryName?.[isVietnamese ? "vi" : "en"] ||
                      article.category?.name?.[isVietnamese ? "vi" : "en"] ||
                      article.category?.name ||
                      article.categoryName?.en ||
                      article.category
                    )}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(article.slug)}
                      className="text-green-400 hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-indigo-400 hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      style={{
                        color: "red",
                      }}
                      onClick={() => handleDelete(article)}
                      className="text-red-400 hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {currentArticles.length === 0 && (
            <p className="col-span-full text-center text-gray-400">
              {isVietnamese ? "Không tìm thấy kết quả" : "No results found"}
            </p>
          )}
        </div>
      ) : (
        <p className="p-6 text-gray-300">Table view here...</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 my-6">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`px-4 py-2 rounded-full border text-sm transition-all duration-200
      ${currentPage === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-[#2A2A2A] cursor-pointer"
            } text-gray-200`}
        >
          {isVietnamese ? "Trước" : "Prev"}
        </button>

        {/* Page Counter */}
        <span className="text-gray-200 font-medium">
          {isVietnamese ? "Trang" : "Page"} {currentPage} / {totalPages || 1}
        </span>

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`px-4 py-2 rounded-full border text-sm transition-all duration-200
      ${currentPage === totalPages || totalPages === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-[#2A2A2A] cursor-pointer"
            } text-gray-200`}
        >
          {isVietnamese ? "Tiếp" : "Next"}
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-60 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 scrollbar-hide">
            <NewsArticleForm
              article={editingArticle}
              onClose={handleCloseForm}
              onSave={handleSaveArticle}
            />
          </div>
        </div>
      )}

      {/* 🗑️ Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn">
          <div className="bg-[#1F1F1F] border border-[#333] rounded-2xl shadow-2xl p-6 w-[90%] max-w-md text-white relative">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              {isVietnamese ? "Xóa tài nguyên?" : "Delete Content?"}
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              {isVietnamese
                ? `Bạn có chắc muốn xóa “${deleteTarget?.title?.vi ||
                deleteTarget?.title?.en ||
                "bài viết này"
                }”? Hành động này không thể hoàn tác.`
                : `Are you sure you want to delete “${deleteTarget?.title?.en || "this blog"
                }”? This action cannot be undone.`}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
              >
                {isVietnamese ? "Hủy" : "Cancel"}
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition shadow-md"
              >
                {isVietnamese ? "Xóa" : "Delete"}
              </button>
            </div>

            {/* ✖ Close button */}
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
              }}
              className="absolute top-3 right-3 text-gray-400 !bg-red-600  rounded-full h-8 w-8 cursor-pointer transition"
              title={isVietnamese ? "Đóng" : "Close"}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsScreen;
