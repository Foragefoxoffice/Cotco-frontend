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
} from "lucide-react";
import NewsArticleForm from "../components/forms/NewsArticleForm";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../Api/api";
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

  // 🔹 Pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Filters
  const [mainCategoryFilter, setMainCategoryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
      ? "Quản lý tất cả bài đăng tin tức và sự kiện"
      : "Manage all news and events posts",
    create: isVietnamese ? "Tạo tin tức" : "Create Resources",
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

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      const blogs = (res.data?.data || []).map((b) => ({
        ...b,
        mainCategoryId: b.mainCategory?._id || "",
        categoryId: b.category?._id || "",
        mainCategoryName: b.mainCategory?.name || {},
        categoryName: b.category?.name || {},
        // normalize publishedAt fallback
        publishedAt: b.publishedAt || b.createdAt || new Date().toISOString(),
      }));

      // Ensure newest first
      const sorted = blogs.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );

      setNewsArticles(sorted);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      CommonToaster(t.loadFail, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Create/Edit/Delete Handlers
  const handleCreate = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await deleteBlog(id);
        CommonToaster(t.deleteSuccess, "success");
        // remove locally for instant feedback
        setNewsArticles((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        CommonToaster(t.deleteFail, "error");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleView = (slug) => {
    window.open(`/${slug}`, "_blank");
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
        const updated = res.data?.data || res.data;

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
        const newBlog = res.data?.data || res.data;

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
      CommonToaster(t.saveFail, "error");
    } finally {
      handleCloseForm();
    }
  };

  // 🔹 Unique categories (derived from current list)
  const uniqueMainCategories = Array.from(
    new Map(
      newsArticles
        .filter((a) => a.mainCategoryId)
        .map((a) => [
          a.mainCategoryId,
          { id: a.mainCategoryId, name: a.mainCategoryName },
        ])
    ).values()
  );

  const uniqueCategories = Array.from(
    new Map(
      newsArticles
        .filter((a) => a.categoryId)
        .map((a) => [
          a.categoryId,
          {
            id: a.categoryId,
            name: a.categoryName,
            main: a.mainCategoryId,
          },
        ])
    ).values()
  );

  // 🔹 Sorted according to selected sort option
  const sortedArticles = [...newsArticles].sort((a, b) => {
    if (sortOption === "newest")
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (sortOption === "oldest")
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    if (sortOption === "title")
      return (a.title?.en || "").localeCompare(b.title?.en || "");
    return 0;
  });

  // 🔹 Filter by search, main category, category and status
  const filteredArticles = sortedArticles.filter((article) => {
    const title = isVietnamese
      ? article.title?.vn || article.title?.en
      : article.title?.en;
    const matchesSearch = title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesMain =
      mainCategoryFilter === "all" ||
      article.mainCategoryId === mainCategoryFilter;
    const matchesCat =
      categoryFilter === "all" || article.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;

    return matchesSearch && matchesMain && matchesCat && matchesStatus;
  });

  // 🔹 Pagination
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Loading state (dark style)
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900">
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-6">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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

        {/* Sort */}
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            backgroundColor: "#262626",
            border: "1px solid #2E2F2F",
            borderRadius: "2rem",
            color: "#fff",
            padding: "15px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          <option value="newest">{t.newest}</option>
          <option value="oldest">{t.oldest}</option>
          <option value="title">{t.titleSort}</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            backgroundColor: "#262626",
            border: "1px solid #2E2F2F",
            borderRadius: "2rem",
            color: "#fff",
            padding: "15px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          <option value="all">{t.all} Status</option>
          <option value="published">{t.published}</option>
          <option value="draft">{t.draft}</option>
        </select>

        {/* Main Category Filter */}
        <select
          value={mainCategoryFilter}
          onChange={(e) => {
            setMainCategoryFilter(e.target.value);
            setCategoryFilter("all");
            setCurrentPage(1);
          }}
          style={{
            backgroundColor: "#262626",
            border: "1px solid #2E2F2F",
            borderRadius: "2rem",
            color: "#fff",
            padding: "15px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          <option value="all">
            {t.all} {t.filterMain}
          </option>
          {uniqueMainCategories.map((mc) => (
            <option key={mc.id} value={mc.id}>
              {mc.name[isVietnamese ? "vn" : "en"] || mc.name.en || mc.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            backgroundColor: "#262626",
            border: "1px solid #2E2F2F",
            borderRadius: "2rem",
            color: "#fff",
            padding: "15px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          <option value="all">
            {t.all} {t.filterCategory}
          </option>
          {uniqueCategories
            .filter((c) =>
              mainCategoryFilter === "all"
                ? true
                : c.main === mainCategoryFilter
            )
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[isVietnamese ? "vn" : "en"] || c.name.en || c.name}
              </option>
            ))}
        </select>
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
                  alt={isVietnamese ? article.title?.vn : article.title?.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-medium mb-2">
                  {isVietnamese
                    ? article.title?.vn || article.title?.en
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
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      article.status === "published"
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
                    {article.categoryName?.[isVietnamese ? "vn" : "en"] ||
                      article.category?.en ||
                      article.category}
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
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
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
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 rounded border disabled:opacity-50 text-gray-200"
        >
          Prev
        </button>
        <span className="text-gray-200">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 rounded-full border disabled:opacity-50 text-gray-200"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-60 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800">
            <NewsArticleForm
              article={editingArticle}
              onClose={handleCloseForm}
              onSave={handleSaveArticle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsScreen;
