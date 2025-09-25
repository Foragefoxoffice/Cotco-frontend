import React, { useState, useEffect } from "react";
import { Plus, Calendar, User, Tag, Edit, Trash2 } from "lucide-react";
import NewsArticleForm from "../components/forms/NewsArticleForm";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

const NewsScreen = () => {
  const [view, setView] = useState("grid");
  const [newsArticles, setNewsArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setNewsArticles(res.data.data); // ✅ your backend sends blogs inside data.data
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

  if (loading) return <p className="p-6">Loading blogs...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all blog posts</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus size={18} className="mr-1" /> Create Blog
        </button>
      </div>

      {/* Blog Cards / Table */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <div
              key={article._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.coverImage?.url || article.thumbnail}
                  alt={article.title.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 h-14">
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
                  <span className="flex items-center text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    <Tag size={14} className="mr-1" />
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 p-1"
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
        // ✅ Table view (like your current code) can stay
        <p>Table view here...</p>
      )}

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
