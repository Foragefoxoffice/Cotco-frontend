import { useEffect, useState } from "react";
import { getBlogs, getCategories, getMainBlogCategories } from "../Api/api"; 
import { FaArrowRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function BlogLists() {
  const navigate = useNavigate();
  const { mainCategorySlug } = useParams(); // ✅ URL param: /blogs/:mainCategorySlug

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([{ name: "All", id: "all" }]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get all main categories
        const mainRes = await getMainBlogCategories();
        const mainCategory = mainRes.data.data.find(
          (mc) => mc.slug === mainCategorySlug
        );

        if (!mainCategory) {
          console.warn("No main category found for slug:", mainCategorySlug);
          setLoading(false);
          return;
        }

        // 2️⃣ Get all categories under this main category
        const catRes = await getCategories();
        const matchedCategories = catRes.data.data.filter(
          (cat) => cat.mainCategory?._id === mainCategory._id
        );

        // Format categories
        const categoryList = matchedCategories.map((cat) => ({
          name: cat.name?.en || cat.name?.vn || "Unnamed Category",
          id: cat._id,
        }));
        setCategories([{ name: "All", id: "all" }, ...categoryList]);

        // 3️⃣ Get all blogs
        const blogRes = await getBlogs();
        const formattedBlogs = blogRes.data.data
          .filter((blog) => blog.status === "published") // ✅ only published
          .map((blog) => ({
            id: blog._id,
            title: blog.title?.en || blog.title?.vn || "Untitled Blog",
            desc:
              (typeof blog.excerpt?.en === "string"
                ? blog.excerpt.en
                : blog.excerpt?.vn || ""
              ).slice(0, 150) + "...",
            img: blog.coverImage?.url || "/img/blog/blog-img.png",
            slug: blog.slug,

            // ✅ category + mainCategory
            categoryId: blog.category?._id || null,
            categoryName:
              blog.category?.name?.en ||
              blog.category?.name?.vn ||
              "General",

            mainCategoryId: blog.mainCategory?._id || null,
            mainCategorySlug: blog.mainCategory?.slug || null,
            mainCategoryName:
              blog.mainCategory?.name?.en ||
              blog.mainCategory?.name?.vn ||
              "Main",
          }));

        // 4️⃣ Filter blogs that belong to matched categories (by _id)
        const allowedCategoryIds = matchedCategories.map((c) =>
          c._id.toString()
        );
        const blogsInMainCategory = formattedBlogs.filter((b) =>
          allowedCategoryIds.includes(b.categoryId?.toString())
        );

        setBlogs(blogsInMainCategory);
        setFilteredBlogs(blogsInMainCategory);
      } catch (err) {
        console.error("❌ Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainCategorySlug]);

  // 🔹 Category filter
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (catId === "all") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((b) => b.categoryId === catId));
    }
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  if (loading) return <p className="text-center py-10">Loading blogs...</p>;

  return (
    <div className="max-w-7xl mx-auto px-1 py-12 pb-20">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat.id
                ? "bg-[#1276BD] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      {currentBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-20 md:grid-cols-3">
          {currentBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              onClick={() =>
                navigate(`/${mainCategorySlug}/${blog.slug}`) // ✅ includes mainCategorySlug
              }
              className="rounded-xl overflow-hidden transition cursor-pointer bg-white border border-none hover:shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <motion.img
                src={blog.img}
                alt={blog.title}
                className="w-full object-cover h-60"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="pt-5 px-1.5 pb-4">
                <h3 className="font-medium text-xl mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.desc}
                </p>
                <div className="flex items-center gap-2 text-black font-medium">
                  <span className="bg-[#1276BD] text-white p-2 rounded-full text-xs flex items-center justify-center">
                    <FaArrowRight />
                  </span>
                  Learn More
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 disabled:opacity-40"
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
                currentPage === i + 1
                  ? "bg-[#1276BD] text-white font-bold"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 disabled:opacity-40"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
