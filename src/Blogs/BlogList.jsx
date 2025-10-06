import { useEffect, useState } from "react";
import { getBlogs, getCategories, getMainBlogCategories } from "../Api/api";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

export default function BlogLists() {
  const navigate = useNavigate();
  const { mainCategorySlug } = useParams();

  const [language, setLanguage] = useState("en"); // ✅ inline language state
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeCategoryName, setActiveCategoryName] = useState("All");

  // ✅ detect language mode directly from body
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";
    setLanguage(detectLanguage());

    const observer = new MutationObserver(() => {
      setLanguage(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mainRes = await getMainBlogCategories();
        const mainCategory = mainRes.data.data.find(
          (mc) => mc.slug === mainCategorySlug
        );
        if (!mainCategory) return setLoading(false);

        const catRes = await getCategories();
        const matchedCategories = catRes.data.data.filter(
          (cat) => cat.mainCategory?._id === mainCategory._id
        );

        const blogRes = await getBlogs();
        const formatted = blogRes.data.data
          .filter((b) => b.status === "published")
          .map((b) => ({
            id: b._id,
            title: b.title?.[language] || b.title?.en || b.title?.vi || "Untitled Blog",
            desc:
              (b.excerpt?.[language] ||
                b.excerpt?.en ||
                b.description?.[language] ||
                b.description?.en ||
                "").slice(0, 250) + "...",
            img: b.coverImage?.url || "/img/blog/blog-img.png",
            slug: b.slug,
            publishedAt: b.publishedAt || b.createdAt,
            categoryId: b.category?._id || b.category,
            categoryName:
              b.category?.name?.[language] ||
              b.category?.name?.en ||
              b.category?.name?.vi ||
              "General",
          }));

        const sorted = formatted.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        setBlogs(sorted);
        setCategories(matchedCategories);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainCategorySlug, language]); // ✅ reload when language changes

  const handleCategoryChange = (catId, name) => {
    setSelectedCategory(catId);
    setActiveCategoryName(name);
  };

  if (loading)
    return (
      <p className="text-center py-20 text-gray-500 tracking-wide">
        Loading blog articles...
      </p>
    );

  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  const filteredBlogs =
    selectedCategory === "all"
      ? sortedBlogs
      : sortedBlogs.filter((b) => b.categoryId === selectedCategory);

  const featuredBlog = sortedBlogs[0];
  const remainingBlogs = filteredBlogs.filter((b) => b.id !== featuredBlog.id);
  const nextThree = remainingBlogs.slice(0, 3);
  const remaining = remainingBlogs.slice(3);

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 text-[#1a1a1a]">
      <h1 className="text-[#164B8B] text-xl md:text-2xl font-extrabold uppercase mb-6 tracking-wide">
        {activeCategoryName.toUpperCase()}
      </h1>

      {/* ---------- MOBILE CATEGORY BAR ---------- */}
      <div className="block lg:hidden sticky top-0 bg-white z-30 py-3 mb-8 border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-3 w-max px-2">
          <button
            onClick={() => handleCategoryChange("all", "All")}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === "all"
                ? "!bg-[#164B8B] !text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                handleCategoryChange(
                  cat._id,
                  cat.name?.[language] || cat.name?.en || cat.name
                )
              }
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat._id
                  ? "!bg-[#164B8B] !text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name?.[language] || cat.name?.en || cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MAIN GRID ---------- */}
      <div className="grid lg:grid-cols-[3fr_1fr] gap-8">
        {/* ---------- LEFT: ARTICLES ---------- */}
        <div>
          {featuredBlog && (
            <div
              className="flex flex-col md:flex-row gap-6 pb-6 mb-6 cursor-pointer"
              onClick={() =>
                navigate(`/${mainCategorySlug}/${featuredBlog.slug}`)
              }
            >
              <div className="md:w-2/3">
                <img
                  src={featuredBlog.img}
                  alt={featuredBlog.title}
                  className="w-full h-[280px] md:h-[320px] object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h2
                  style={{ fontSize: "18px" }}
                  className="text-lg font-bold mb-2 hover:text-[#164B8B] transition"
                >
                  {featuredBlog.title}
                </h2>
                <p className="text-gray-500 text-sm mb-3">
                  {new Date(featuredBlog.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm md:text-[15px] leading-6 mb-4">
                  {featuredBlog.desc}
                </p>
                <button
                  className="text-[#164B8B] font-semibold flex items-center gap-1 hover:underline"
                  onClick={() =>
                    navigate(`/${mainCategorySlug}/${featuredBlog.slug}`)
                  }
                >
                  Detail <FiChevronRight className="inline-block" />
                </button>
              </div>
            </div>
          )}

          {nextThree.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-8 border-b border-[#cecece]">
              {nextThree.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/${mainCategorySlug}/${b.slug}`)}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold text-[15px] hover:text-[#164B8B] mb-1">
                      {b.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {new Date(b.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {remaining.length > 0 && (
            <div className="space-y-8">
              {remaining.map((b) => (
                <div
                  key={b.id}
                  className="grid md:grid-cols-[260px_1fr] gap-6 border-b pb-6 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  onClick={() => navigate(`/${mainCategorySlug}/${b.slug}`)}
                >
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full h-[160px] object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg mb-1 hover:text-[#164B8B] transition">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(b.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-[15px] leading-6">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- RIGHT SIDEBAR ---------- */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-[#F9FAFB] rounded-lg border border-black/5 p-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCategoryChange("all", "All")}
                className={`relative text-left px-4 py-2 rounded-md border font-medium transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-[#164B8B] !text-white border-[#164B8B] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#164B8B] before:rounded-l-md"
                    : "text-gray-800 hover:bg-gray-100 border-gray-200"
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() =>
                    handleCategoryChange(
                      cat._id,
                      cat.name?.[language] || cat.name?.en || cat.name
                    )
                  }
                  className={`relative text-left px-4 py-2 rounded-md border font-medium transition-all duration-200 ${
                    selectedCategory === cat._id
                      ? "bg-[#164B8B] !text-white border-[#164B8B] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#164B8B] before:rounded-l-md"
                      : "text-gray-800 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  {cat.name?.[language] || cat.name?.en || cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#164B8B] font-bold uppercase text-lg mb-3">
              Recent
            </h4>
            <div className="space-y-3">
              {blogs.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="flex gap-3 cursor-pointer border-b border-black/10 pb-3"
                  onClick={() => navigate(`/${mainCategorySlug}/${b.slug}`)}
                >
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-[13px] font-medium leading-tight hover:text-[#164B8B]">
                      {b.title.slice(0, 60)}...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(b.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
