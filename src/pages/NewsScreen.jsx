import React, { useState, useEffect } from "react";
import { Plus, Calendar, User, Tag, Edit, Trash2, Eye } from "lucide-react";
import NewsArticleForm from "../components/forms/NewsArticleForm";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";
import BlogCardSkeleton from "./BlogCardSkeleton";
import { useTheme } from "../contexts/ThemeContext"; // ✅ import theme context

const NewsScreen = () => {
  const [view, setView] = useState("grid");
  const [newsArticles, setNewsArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme(); // ✅ get theme

  // Fetch blogs from API
  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const blogs = await getBlogs(); // ✅ blogs array directly
      setNewsArticles(blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      CommonToaster("Failed to load blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        CommonToaster("Blog deleted successfully", "success");
        fetchBlogs();
      } catch (err) {
        console.error("Delete error:", err);
        CommonToaster("Failed to delete blog", "error");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleView = (slug) => {
    window.open(`/blogs/${slug}`, "_blank"); // ✅ matches your NewsSection
  };

  const handleSaveArticle = async (articleData) => {
    try {
      if (editingArticle) {
        await updateBlog(editingArticle._id, articleData);
        CommonToaster("Blog updated successfully", "success");
      } else {
        await createBlog(articleData);
        CommonToaster("Blog created successfully", "success");
      }
      fetchBlogs();
    } catch (err) {
      console.error("Save error:", err);
      CommonToaster("Failed to save blog", "error");
    } finally {
      handleCloseForm();
    }
  };

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 
          ${theme === "light" ? "bg-gray-50" : "bg-gray-900"}`}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <BlogCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 
        ${
          theme === "light"
            ? "bg-gray-50 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
    >
      <div className="flex justify-between items-center mb-6 p-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all blog posts
          </p>
        </div>
        <button
          onClick={handleCreate}
          className={`px-4 py-2 rounded-md flex items-center cursor-pointer transition
            ${
              theme === "light"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-gray-900 hover:bg-indigo-400"
            }`}
        >
          <Plus size={18} className="mr-1" /> Create Blog
        </button>
      </div>

      {/* Blog Cards */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {newsArticles.map((article) => (
            <div
              key={article._id}
              className={`rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow flex flex-col 
                ${
                  theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-gray-800 border-gray-700"
                }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.coverImage?.url || article.thumbnail}
                  alt={article.title.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-medium mb-2 ">
                  {article.title.en}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar size={16} className="mr-1" />
                  <span className="mr-3">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <User size={16} className="mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <span
                    className="flex items-center text-sm 
                      bg-gray-100 text-gray-800 
                      dark:bg-gray-700 dark:text-gray-200 
                      px-2 py-1 rounded"
                  >
                    <Tag size={14} className="mr-1" />
                    {article.category}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(article.slug)}
                      className="text-green-600 dark:text-green-400 hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-indigo-600 dark:text-indigo-400 hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-red-600 dark:text-red-400 hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-6">Table view here...</p>
      )}

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={`rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition 
              ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
          >
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
