import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogBySlug, getBlogs } from "../Api/api";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { FaShare } from "react-icons/fa6";
import { Title, Meta, Link as MetaLink } from "react-head";

export default function BlogOverview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("en");
  const [copyTooltip, setCopyTooltip] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareTitle = pick(blog?.title, activeLang) || pick(blog?.name, activeLang) || "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: url
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopyTooltip(true);
        setTimeout(() => setCopyTooltip(false), 1500);
      });
    }
  };

  // Helper: pick multilingual or fallback values
  const pick = (obj, key) => {
    // If obj is falsy, return empty string
    if (!obj) return "";
    // If key is provided (we expect obj to be a parent containing language keys)
    if (key && typeof obj === "object" && key in obj) {
      const val = obj[key];
      // If the value itself is object with language keys
      if (typeof val === "object" && val !== null) {
        return val[activeLang] ?? val.en ?? val.vi ?? "";
      }
      return val ?? "";
    }

    // If obj itself is a multilingual object { en, vi }
    if (typeof obj === "object" && obj !== null) {
      return obj[activeLang] ?? obj.en ?? obj.vi ?? "";
    }

    // Otherwise obj is likely a plain string
    return String(obj);
  };

  // Universal SEO extractor that handles multiple formats:
  // - seo: { title: { en: "...", vi: "..." } }
  // - seo: { title: "plain string" }
  // - seo: { title_en: "...", title_vi: "..." }
  // - seo: { keywords: ["a","b"] } or keywords: "a,b"
  // const getSEOValue = (seoObj, key, lang = "en") => {
  //   if (!seoObj) return "";

  //   // Direct multilingual nested object: seoObj[key] -> { en, vi }
  //   if (seoObj[key] && typeof seoObj[key] === "object" && !Array.isArray(seoObj[key])) {
  //     return seoObj[key][lang] ?? seoObj[key].en ?? seoObj[key].vi ?? "";
  //   }

  //   // Direct string: seoObj[key] is string
  //   if (typeof seoObj[key] === "string") return seoObj[key];

  //   // Flattened keys like title_en / title_vi
  //   const keyLang = `${key}_${lang}`;
  //   if (seoObj[keyLang]) return seoObj[keyLang];

  //   // If keywords can be an array
  //   if (key === "keywords") {
  //     const kw = seoObj[key];
  //     if (Array.isArray(kw)) return kw;
  //     if (typeof kw === "object" && kw !== null) {
  //       // maybe { en: [...], vi: [...] }
  //       if (Array.isArray(kw[lang])) return kw[lang];
  //       if (Array.isArray(kw.en)) return kw.en;
  //     }
  //     if (typeof kw === "string") return kw;
  //   }

  //   // Finally, sometimes seo values are stored as seo.title or seoTitle
  //   const altKey = `seo${key.charAt(0).toUpperCase() + key.slice(1)}`; // seoTitle
  //   if (seoObj[altKey]) return seoObj[altKey];

  //   return "";
  // };

  // Detect language mode (en / vi)
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";
    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch blog + recent blogs
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);

        const res = await getBlogBySlug(slug);
        // support both res.data.data (common) and res.data (sometimes)
        const blogData = res.data?.data ?? res.data ?? null;

        if (mounted) setBlog(blogData);

        // fetch recent blogs (global recent, exclude current slug)
        const recRes = await getBlogs({ limit: 6, sort: "-createdAt" });
        const allBlogs = recRes.data?.data ?? recRes.data ?? [];
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

  // Custom Loader with logo + spinning ring
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white relative">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Logo in center */}
          <img
            src="/logo/logo.png" // change to your actual logo path if needed
            alt="Loading..."
            className="w-20 h-20 object-contain z-10"
          />

          {/* Spinning ring */}
          <div className="absolute inset-0 border-[6px] border-[#e5e7eb] border-t-[#164B8B] rounded-full animate-spin"></div>
        </div>
      </div>
    );

  if (!blog)
    return <p className="text-center text-red-500 py-20">Blog not found.</p>;

  // helpers to extract text
  const title = pick(blog.title, activeLang) || pick(blog.name, activeLang) || "";
  const coverImage = blog.coverImage?.url || "/img/blog/blog-img.png";
  const rawDate = new Date(blog.publishedAt || blog.createdAt || Date.now());
  const publishedAt = rawDate.toLocaleDateString("en-GB");

  const mainCategory = blog.mainCategory;
  const category = blog.category;

  // ✅ SIMPLE + CORRECT SEO EXTRACTION (paste here)
  const seoTitle =
    blog.seo?.title?.[activeLang] ||
    blog.seo?.title?.en ||
    title;

  const seoDescription =
    blog.seo?.description?.[activeLang] ||
    blog.seo?.description?.en ||
    blog.excerpt?.[activeLang] ||
    "";

  let seoKeywords =
    blog.seo?.keywords?.[activeLang] ||
    blog.seo?.keywords?.en ||
    "";

  if (Array.isArray(seoKeywords)) {
    seoKeywords = seoKeywords.join(", ");
  }

  const ogImage = coverImage;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";


  return (
    <>
      {/* SEO + OG TAGS */}
      <>
        <Title>{seoTitle}</Title>
        <Meta name="description" content={seoDescription} />
        <Meta name="keywords" content={seoKeywords} />
        <Meta property="og:type" content="article" />
        <Meta property="og:title" content={seoTitle} />
        <Meta property="og:description" content={seoDescription} />
        <Meta property="og:image" content={ogImage} />
        <Meta property="og:url" content={currentUrl} />
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:title" content={seoTitle} />
        <Meta name="twitter:description" content={seoDescription} />
        <Meta name="twitter:image" content={ogImage} />
      </>


      <style>{`
        header, nav {
          background-color: #0A1C2E !important;
          box-shadow: none !important;
        }
      `}</style>

      <Header />

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 mt-24">
        {/* BREADCRUMB */}
        <div className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          <Link to="/" className="hover:text-[#1276BD]">
            Home
          </Link>
          <span>/</span>

          {mainCategory && (
            <>
              <Link
                to={`/${encodeURIComponent(
                  mainCategory.slug ||
                  mainCategory?.name?.en?.toLowerCase().replace(/\s+/g, "-")
                )}`}
                className="hover:text-[#1276BD] capitalize"
              >
                {mainCategory.name?.[activeLang] ||
                  mainCategory.name?.en ||
                  mainCategory.name?.vi ||
                  "Main Category"}
              </Link>
              <span>/</span>
            </>
          )}

          {category && (
            <>
              <Link
                to={`/${encodeURIComponent(
                  mainCategory?.slug ||
                  mainCategory?.name?.en?.toLowerCase().replace(/\s+/g, "-")
                )}?category=${encodeURIComponent(
                  category.slug ||
                  category?.name?.en?.toLowerCase().replace(/\s+/g, "-")
                )}`}
                className="hover:text-[#1276BD] capitalize"
              >
                {category.name?.[activeLang] ||
                  category.name?.en ||
                  category.name?.vi ||
                  "Category"}
              </Link>
              <span>/</span>
            </>
          )}

          <span className="text-gray-700 font-medium truncate max-w-[240px]">
            {title}
          </span>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          {/* LEFT: ARTICLE */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1C2E] mb-3 leading-tight">
              {title}
            </h1>
            {blog.excerpt?.[activeLang] && (
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                {blog.excerpt[activeLang]}
              </p>
            )}

            <img
              src={coverImage}
              alt={title}
              className="w-full rounded-lg mb-8 shadow-sm"
            />

            {/* Content Blocks */}
            <div
              className="prose prose-lg max-w-none text-gray-800
              prose-p:leading-relaxed prose-img:rounded-lg prose-img:shadow-sm
              prose-headings:text-[#0A1C2E] prose-h1:text-3xl prose-h2:text-2xl blog_description"
            >
              {blog.blocks?.map((block, idx) => {
                if (block.type === "richtext") {
                  const html = pick(block.content, activeLang);
                  return (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />
                  );
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
            <p className="text-gray-500 mb-6 text-sm">{publishedAt}</p>

            {/* SHARE BUTTON */}
            <div className="text-right">
              <div className="relative inline-block">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm hover:bg-gray-200 transition cursor-pointer"
                >
                  <FaShare />
                  <span className="font-medium text-gray-800">Share</span>
                </button>

                {/* Tooltip for fallback */}
                {copyTooltip && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-xs px-3 py-1 rounded-full whitespace-nowrap z-50">
                    Link copied!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: RECENT BLOGS */}
          <aside className="space-y-6 sticky top-32 self-start">
            <h3 className="text-[#164B8B] font-bold uppercase text-lg border-b border-gray-200 pb-2">
              Recent
            </h3>
            <div className="space-y-4">
              {recentBlogs.map((b) => (
                <div
                  key={b._id || b.id || b.slug}
                  className="flex gap-3 items-start cursor-pointer group"
                  onClick={() =>
                    navigate(`/${b.category?.slug || "general"}/${b.slug}`)
                  }
                >
                  <img
                    src={b.coverImage?.url || b.coverImage || "/img/blog/blog-img.png"}
                    alt={pick(b.title, activeLang)}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-[15px] font-semibold text-gray-800 group-hover:text-[#164B8B] transition">
                      {pick(b.title, activeLang)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(b.publishedAt || b.createdAt || Date.now()).toLocaleDateString()}
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
