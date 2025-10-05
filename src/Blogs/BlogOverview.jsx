import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogBySlug, getBlogs } from "../Api/api";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import BlogOverviewSkeleton from "../pages/BlogOverviewSkeleton";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function BlogOverview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [recommendedRaw, setRecommendedRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("en"); // "en" | "vn"
  const { mainCategorySlug } = useParams();

  // -- Helpers ---------------------------------------------------------------
  const mapPrefToLangKey = (pref) => (pref === "vi" ? "vn" : "en");
  const computeLangFromDOM = () => {
    if (typeof document === "undefined") return "en";
    return document.body.classList.contains("vi-mode") ? "vn" : "en";
  };

  // Detect language
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pref = window.localStorage.getItem("preferred_lang");
    if (pref === "vi" || pref === "en") {
      setActiveLang(mapPrefToLangKey(pref));
    } else {
      setActiveLang(computeLangFromDOM());
    }

    const observer = new MutationObserver(() => {
      setActiveLang(computeLangFromDOM());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const onStorage = (e) => {
      if (e.key === "preferred_lang") {
        const val = e.newValue === "vi" ? "vn" : "en";
        setActiveLang(val);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Fetch blog + recommended
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getBlogBySlug(slug);
        if (!mounted) return;
        setBlog(res.data?.data || res.data);

        const recRes = await getBlogs({ limit: 6, sort: "-createdAt" });
        if (!mounted) return;
        const list = recRes.data?.data || recRes.data || [];
        setRecommendedRaw(list.filter((b) => b.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [slug]);

  if (loading) return <BlogOverviewSkeleton />;
  if (!blog) return <p className="text-center text-red-500">Blog not found.</p>;

  // Derive fields
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vn ?? "";
  const title = pick(blog.title, activeLang) || "Untitled Blog";
  const coverImage = blog.coverImage?.url || "/img/blog/blog-img.png";
  const excerpt = pick(blog.excerpt, activeLang);
  const category = blog.category?.name?.[activeLang] || blog.category || "General";

  const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      <style>{`nav { background: #0A1C2E; }`}</style>
      <Header />

      <div className="max-w-6xl mx-auto py-10 mt-30 px-4">
        {/* 🔹 Breadcrumbs */}
        <div className="text-sm flex justify-between text-gray-500 mb-6">
          <ol className="list-reset flex flex-wrap gap-1">
            <li>
              <Link to="/" className="hover:text-[#1276BD]">Home</Link>
              <span className="mx-2">/</span>
            </li>
            
            {mainCategorySlug && (
              <li>
                <Link
                  to={`/resources/${mainCategorySlug}`}
                  className="hover:text-[#1276BD] capitalize"
                >
                  {mainCategorySlug}
                </Link>
                <span className="mx-2">/</span>
              </li>
            )}
            <li className="text-gray-700">{title}</li>
          </ol>

          <div className="flex justify-center mb-6">
            <span className="text-md font-medium px-4 py-1 rounded-full">
              Category: <span className="font-bold">{category}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">{title}</h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-lg text-gray-600 text-center mt-5 mb-14">{excerpt}</p>
        )}

        {/* Cover Image */}
        <img src={coverImage} alt={title} className="w-full rounded-xl shadow mb-10" />

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none space-y-8
            prose-p:text-[1.125rem] prose-p:leading-relaxed
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg"
        >
          {blog.blocks?.map((block, idx) => {
            if (block.type === "richtext") {
              const html = pick(block.content, activeLang) || "<p></p>";
              return <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
            }

            if (block.type === "image") {
              return (
                <div key={idx} className="my-8">
                  <img
                    src={block.content?.url}
                    alt={`blog-image-${idx}`}
                    className="w-full rounded-lg shadow"
                  />
                </div>
              );
            }

            if (block.type === "list") {
              const raw = pick(block.content, activeLang) || "";
              const items = raw.split("\n").map((line) => line.trim()).filter(Boolean);

              return (
                <ul key={idx} className="list-disc list-inside my-6 space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="text-lg text-gray-700 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            if (block.type === "quote") {
              const quote = pick(block.content, activeLang);
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6"
                >
                  {quote}
                </blockquote>
              );
            }

            if (block.type === "code") {
              const code = pick(block.content, activeLang);
              return (
                <pre
                  key={idx}
                  className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm"
                >
                  <code>{code}</code>
                </pre>
              );
            }

            if (block.type === "style") {
              return (
                <style
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: block.content?.css || "" }}
                />
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Recommended */}
      <div className="mx-auto py-10 pb-40 px-28">
        {recommendedRaw.length > 0 && (
          <div className="mt-1">
            <motion.h2
              className="text-7xl md:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Recommended Articles
            </motion.h2>

            <div className="grid gap-20 md:grid-cols-3">
              {recommendedRaw.map((rec, index) => {
                const recTitle = pick(rec.title, activeLang) || "Untitled Blog";
                const recExcerpt = pick(rec.excerpt, activeLang);
                const recImg = rec.coverImage?.url || "/img/blog/blog-img.png";

                return (
                  <motion.div
                    key={rec._id || rec.slug || index}
                    className="rounded-xl overflow-hidden transition cursor-pointer bg-white border border-none"
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <motion.img
                      src={recImg}
                      alt={recTitle}
                      className="w-full object-cover h-60"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="pt-5 px-1.5">
                      <h3 className="font-medium text-xl mb-2">{recTitle}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {recExcerpt ? recExcerpt.slice(0, 150) + "..." : "No description"}
                      </p>
                      <motion.a
                        onClick={() =>
                          navigate(`/blogs/${rec.category?.slug || "general"}/${rec.slug}`)
                        }
                        className="flex items-center gap-2 text-black font-medium cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <span className="bg-[#1276BD] text-white p-2 rounded-full text-xs flex items-center justify-center">
                          <FaArrowRight />
                        </span>
                        Learn More
                      </motion.a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
