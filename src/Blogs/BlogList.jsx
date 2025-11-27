import { useEffect, useState } from "react";
import { getBlogs, getCategories, getMainBlogCategories } from "../Api/api";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function BlogLists({ onLoaded }) {
  const navigate = useNavigate();
  const { mainCategorySlug } = useParams();

  const [language, setLanguage] = useState("en");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeCategoryName, setActiveCategoryName] = useState("All");
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");

  const location = useLocation();

  const isSearching = searchText.trim() !== "";

  useEffect(() => {
    if (!loading && onLoaded) onLoaded();
  }, [loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categorySlug = params.get("category");

    if (categorySlug && categories.length > 0) {
      const matched = categories.find(
        (c) =>
          c.slug === categorySlug ||
          c.name?.en?.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );

      if (matched) {
        setSelectedCategory(String(matched._id));
        setActiveCategoryName(
          matched.name?.[language] || matched.name?.en || matched.name
        );
      }
    }
  }, [location.search, categories, language]);

  // Detect language
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";
    setLanguage(detectLanguage());

    const observer = new MutationObserver(() => {
      setLanguage(detectLanguage());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch blogs for this main category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mainRes = await getMainBlogCategories();
        const mainCategory = mainRes.data.data.find(
          (mc) => mc.slug === mainCategorySlug
        );
        if (!mainCategory) return setLoading(false);

        const catRes = await getCategories();
        const blogRes = await getBlogs();
        const allBlogs = blogRes.data.data || [];

        const filteredBlogs = allBlogs.filter(
          (b) =>
            b.status === "published" && b.mainCategory?._id === mainCategory._id
        );

        const blogCategoryIds = new Set(
          filteredBlogs.map((b) => String(b.category?._id || b.category))
        );

        const matchedCategories = catRes.data.data.filter(
          (cat) =>
            cat.mainCategory?._id === mainCategory._id &&
            blogCategoryIds.has(String(cat._id))
        );

        const formatted = filteredBlogs.map((b) => ({
          id: b._id,
          title:
            b.title?.[language] ||
            b.title?.en ||
            b.title?.vi ||
            "Untitled Blog",
          desc:
            (
              b.excerpt?.[language] ||
              b.excerpt?.en ||
              b.description?.[language] ||
              b.description?.en ||
              ""
            ).slice(0, 250) + "...",
          img: b.coverImage?.url || "/img/blog/blog-img.png",
          slug: b.slug,
          publishedAt: b.publishedAt || b.createdAt,
          categoryId: String(b.category?._id || b.category),
          categoryName:
            b.category?.name?.[language] ||
            b.category?.name?.en ||
            b.category?.name?.vi ||
            "General",
        }));

        setBlogs(formatted);
        setCategories(matchedCategories);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainCategorySlug, language]);

  // Fetch recent blogs
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await getBlogs();
        const allBlogs = res.data.data || [];
        const published = allBlogs
          .filter((b) => b.status === "published")
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 6);

        const formattedRecent = published.map((b) => ({
          id: b._id,
          title:
            b.title?.[language] ||
            b.title?.en ||
            b.title?.vi ||
            "Untitled Blog",
          img: b.coverImage?.url || "/img/blog/blog-img.png",
          slug: b.slug,
          mainCategorySlug: b.mainCategory?.slug || "blog",
          publishedAt: b.publishedAt || b.createdAt,
        }));

        setRecentBlogs(formattedRecent);
      } catch (err) {
        console.error("Error fetching recent blogs:", err);
      }
    };

    fetchRecent();
  }, [language]);

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

  // ⭐ SEARCH + CATEGORY FILTER + TITLE PRIORITY ⭐
  // ⭐ SEARCH + TITLE PRIORITY + SEARCH IGNORES CATEGORY ⭐
  const filteredBlogs = blogs
    .filter((b) => {
      const search = searchText.trim().toLowerCase();

      // 🔥 When searching: ignore category completely
      if (search !== "") {
        return (
          b.title.toLowerCase().includes(search) ||
          b.desc.toLowerCase().includes(search)
        );
      }

      // 🔥 When NOT searching: apply normal category filter
      const matchesCategory =
        selectedCategory === "all" ||
        String(b.categoryId) === String(selectedCategory);

      return matchesCategory;
    })
    .sort((a, b) => {
      const search = searchText.trim().toLowerCase();
      if (!search) return 0;

      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aDesc = a.desc.toLowerCase();
      const bDesc = b.desc.toLowerCase();

      // ⭐ 1. TITLE STARTS WITH SEARCH → HIGHEST PRIORITY
      const aStarts = aTitle.startsWith(search);
      const bStarts = bTitle.startsWith(search);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // ⭐ 2. TITLE CONTAINS SEARCH → NEXT PRIORITY
      const aTitleHas = aTitle.includes(search);
      const bTitleHas = bTitle.includes(search);
      if (aTitleHas && !bTitleHas) return -1;
      if (!aTitleHas && bTitleHas) return 1;

      // ⭐ 3. DESCRIPTION CONTAINS SEARCH → LAST PRIORITY
      const aDescHas = aDesc.includes(search);
      const bDescHas = bDesc.includes(search);
      if (aDescHas && !bDescHas) return -1;
      if (!aDescHas && bDescHas) return 1;

      return 0;
    });

  // Normal mode layout logic
  const featuredBlog = filteredBlogs[0];
  const remainingBlogs = filteredBlogs.slice(1);
  const nextThree = remainingBlogs.slice(0, 3);
  const remaining = remainingBlogs.slice(3);

  return (
    <section className="max-w-[1300px] mx-auto px-4 md:px-6 py-10 text-[#1a1a1a]">
      <div className="lg:hidden flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 outline-none text-sm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#555"
                  strokeWidth="2"
                >
                  <circle cx="8" cy="8" r="6" />
                  <line x1="12" y1="12" x2="16" y2="16" />
                </svg>
              </div>
      {/* ---------- MOBILE CATEGORY BAR ---------- */}
      <div className="block lg:hidden sticky top-0 bg-white z-30 py-3 mb-8 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-4 space-x-3 w-max px-2">
          {/* ALL button */}
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

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                handleCategoryChange(
                  String(cat._id),
                  cat.name?.[language] || cat.name?.en || cat.name
                )
              }
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === String(cat._id)
                  ? "!bg-[#164B8B] !text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name?.[language] || cat.name?.en || cat.name}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-[#164B8B] text-xl md:text-2xl font-extrabold uppercase mb-6 tracking-wide">
        {activeCategoryName.toUpperCase()}
      </h1>

      <div className="grid lg:grid-cols-[3fr_1fr] gap-8">
        {/* LEFT SIDE */}
        <div>
          {isSearching ? (
            /* ⭐ SEARCH MODE → ALL BLOGS BIG LAYOUT ⭐ */
            filteredBlogs.length > 0 ? (
              filteredBlogs.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col md:flex-row gap-6 pb-6 mb-6 cursor-pointer"
                  onClick={() => navigate(`/${mainCategorySlug}/${b.slug}`)}
                >
                  <div className="md:w-2/3">
                    <img
                      src={b.img}
                      alt={b.title}
                      className="w-full h-[280px] md:h-[320px] object-cover rounded-lg transition hover:scale-105"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[20px] font-bold mb-2 hover:text-[#164B8B]">
                      {b.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {new Date(b.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm leading-6 mb-4">
                      {b.desc}
                    </p>
                    <button className="text-[#164B8B] font-semibold flex items-center gap-1 hover:underline">
                      Detail <FiChevronRight />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">
                No results found.
              </p>
            )
          ) : (
            <>
              {/* ⭐ NORMAL MODE ⭐ */}

              {/* Featured */}
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
                      className="w-full h-[280px] md:h-[320px] object-cover rounded-lg transition hover:scale-105"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[20px] font-bold mb-2 hover:text-[#164B8B]">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {new Date(featuredBlog.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm leading-6 mb-4">
                      {featuredBlog.desc}
                    </p>
                    <button className="text-[#164B8B] font-semibold flex items-center gap-1 hover:underline">
                      Detail <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}

              {/* Next 3 */}
              {nextThree.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-8 border-b border-gray-300">
                  {nextThree.map((b) => (
                    <motion.div
                      key={b.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                      onClick={() => navigate(`/${mainCategorySlug}/${b.slug}`)}
                    >
                      <img
                        src={b.img}
                        alt={b.title}
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-semibold text-[15px] hover:text-[#164B8B]">
                          {b.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(b.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Remaining */}
              {remaining.length > 0 && (
                <div className="space-y-8">
                  {remaining.map((b) => (
                    <div
                      key={b.id}
                      className="grid md:grid-cols-[260px_1fr] gap-6 border-b pb-6 cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/${mainCategorySlug}/${b.slug}`)}
                    >
                      <img
                        src={b.img}
                        alt={b.title}
                        className="w-full h-[160px] object-cover rounded-md"
                      />

                      <div>
                        <h3 className="font-bold text-lg hover:text-[#164B8B]">
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
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:block space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            {/* Search */}
            <div className="mb-5">
              <h4 className="text-[#1a1a1a] font-semibold text-lg mb-3">
                Search
              </h4>

              <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 outline-none text-sm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#555"
                  strokeWidth="2"
                >
                  <circle cx="8" cy="8" r="6" />
                  <line x1="12" y1="12" x2="16" y2="16" />
                </svg>
              </div>

              <div className="border-b border-gray-200 mt-5"></div>
            </div>

            {/* Categories */}
            <h4 className="text-[#1a1a1a] font-semibold text-lg mb-3">
              Categories
            </h4>

            <div className="flex flex-col gap-2">
              <div
                onClick={() => handleCategoryChange("all", "All")}
                className={`px-4 py-2 rounded-md border font-medium cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#164B8B] !text-white border-[#164B8B]"
                    : "text-gray-800 hover:bg-gray-100 border-gray-200"
                }`}
              >
                All
              </div>

              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() =>
                    handleCategoryChange(
                      String(cat._id),
                      cat.name?.[language] || cat.name?.en || cat.name
                    )
                  }
                  className={`px-4 py-2 rounded-md border font-medium cursor-pointer ${
                    selectedCategory === String(cat._id)
                      ? "bg-[#164B8B] !text-white border-[#164B8B]"
                      : "text-gray-800 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  {cat.name?.[language] || cat.name?.en || cat.name}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h4 className="text-[#164B8B] font-bold uppercase text-lg mb-3">
              Recent
            </h4>

            <div className="space-y-3">
              {recentBlogs.map((b) => (
                <div
                  key={b.id}
                  className="flex gap-3 cursor-pointer border-b border-black/10 pb-3"
                  onClick={() => navigate(`/${b.mainCategorySlug}/${b.slug}`)}
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
