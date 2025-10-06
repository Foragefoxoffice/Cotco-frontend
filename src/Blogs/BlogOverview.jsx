import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogBySlug, getBlogs } from "../Api/api";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import BlogOverviewSkeleton from "../pages/BlogOverviewSkeleton";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function BlogOverview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("en"); // ✅ Language state

  // ✅ Detect current language mode (en / vi) by body class
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    setActiveLang(detectLanguage());

    // watch for body class changes (for dynamic language toggle)
    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch blog data + recent blogs
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getBlogBySlug(slug);
        const blogData = res.data?.data || res.data;
        if (mounted) setBlog(blogData);

        const recRes = await getBlogs({ limit: 6, sort: "-createdAt" });
        const allBlogs = recRes.data?.data || recRes.data || [];
        const filtered = allBlogs.filter((b) => b.slug !== slug).slice(0, 5);
        if (mounted) setRecentBlogs(filtered);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [slug]);

  if (loading) return <BlogOverviewSkeleton />;
  if (!blog)
    return <p className="text-center text-red-500 py-20">Blog not found.</p>;

  // ✅ Safe helper for localized text
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  const title = pick(blog.title, activeLang);
  const coverImage = blog.coverImage?.url || "/img/blog/blog-img.png";
  const publishedAt = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString();
  const category = pick(blog.category?.name, activeLang) || "General";

  return (
    <>
      <style>{`
        header, nav {
          background-color: #0A1C2E !important;
          box-shadow: none !important;
        }
      `}</style>

      <Header />

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 mt-24">
        {/* ---------- Breadcrumb ---------- */}
        <div className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          <Link to="/" className="hover:text-[#1276BD]">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{category}</span>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[240px]">
            {title}
          </span>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          {/* ---------- LEFT: MAIN ARTICLE ---------- */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1C2E] mb-3 leading-tight">
              {title}
            </h1>

            <p className="text-gray-500 mb-6 text-sm">
              {publishedAt} • <span className="capitalize">{category}</span>
            </p>

            <img
              src={coverImage}
              alt={title}
              className="w-full rounded-lg mb-8 shadow-sm"
            />

            {/* ---------- Content Blocks ---------- */}
            <div
              className="prose prose-lg max-w-none text-gray-800
              prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-sm
              prose-headings:text-[#0A1C2E] prose-h1:text-3xl prose-h2:text-2xl"
            >
              {blog.blocks?.map((block, idx) => {
                if (block.type === "richtext") {
                  const html = pick(block.content, activeLang);
                  return <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
                }
                if (block.type === "image") {
                  return (
                    <div key={idx} className="my-6">
                      <img
                        src={block.content?.url}
                        alt=""
                        className="rounded-lg w-full"
                      />
                    </div>
                  );
                }
                if (block.type === "list") {
                  const content = pick(block.content, activeLang);
                  const items = content.split("\n").filter(Boolean);
                  return (
                    <ul
                      key={idx}
                      className="list-disc list-inside space-y-2 my-4"
                    >
                      {items.map((li, i) => (
                        <li key={i}>{li}</li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "quote") {
                  const quote = pick(block.content, activeLang);
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-4 border-[#1276BD] pl-4 italic text-gray-700 my-4"
                    >
                      {quote}
                    </blockquote>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* ---------- RIGHT: RECENT BLOGS ---------- */}
          <aside className="space-y-6">
            <h3 className="text-[#164B8B] font-bold uppercase text-lg border-b border-gray-200 pb-2">
              Recent
            </h3>
            <div className="space-y-4">
              {recentBlogs.map((b) => (
                <div
                  key={b._id}
                  className="flex gap-3 items-start cursor-pointer group"
                  onClick={() =>
                    navigate(`/${b.category?.slug || "general"}/${b.slug}`)
                  }
                >
                  <img
                    src={b.coverImage?.url || "/img/blog/blog-img.png"}
                    alt={pick(b.title, activeLang)}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-[15px] font-semibold text-gray-800 group-hover:text-[#164B8B] transition">
                      {pick(b.title, activeLang)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(
                        b.publishedAt || b.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
