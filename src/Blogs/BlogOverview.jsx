import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogBySlug, getBlogs } from "../Api/api";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import BlogOverviewSkeleton from "../pages/BlogOverviewSkeleton";
import Header from "../components/Header";
import Footer from "../components/layout/Footer";

export default function BlogOverview() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        setBlog(res); // ✅ no .data.data

        // fetch latest blogs excluding current one
        const recRes = await getBlogs({
          limit: 4,
          sort: "-createdAt",
        });

        const formatted = recRes
          .filter((b) => b.slug !== slug)
          .slice(0, 3)
          .map((blog) => {
            const excerptEn =
              typeof blog.excerpt?.en === "string" ? blog.excerpt.en : "";
            const excerptVn =
              typeof blog.excerpt?.vn === "string" ? blog.excerpt.vn : "";

            return {
              id: blog._id,
              title: blog.title?.en || blog.title?.vn || "Untitled Blog",
              desc: excerptEn
                ? excerptEn.slice(0, 150) + "..."
                : excerptVn
                ? excerptVn.slice(0, 150) + "..."
                : "No description",
              img: blog.coverImage?.url || "/img/blog/blog-img.png",
              slug: blog.slug,
            };
          });

        setRecommended(formatted);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <BlogOverviewSkeleton />;

  if (!blog) return <p className="text-center text-red-500">Blog not found.</p>;

  const title = blog.title?.en || blog.title?.vn || "Untitled Blog";
  const coverImage = blog.coverImage?.url || "/img/blog/blog-img.png";
  const excerpt = blog.excerpt?.en || blog.excerpt?.vn || "";
  const category = blog.category || "General";

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* <Header /> */}
      <div className="max-w-6xl mx-auto py-10 mt-10 px-4">
        {/* Category badge */}
        <div className="flex justify-center mb-6">
          <span className="bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">{title}</h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-lg text-gray-600 text-center mt-5 mb-14">
            {excerpt}
          </p>
        )}

        {/* Cover Image */}
        <img
          src={coverImage}
          alt={title}
          className="w-full rounded-xl shadow mb-10"
        />

        {/* Blog Content */}
        <div
          className="
          prose prose-lg max-w-none space-y-8
          prose-p:text-[1.125rem] prose-p:leading-relaxed
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg
        "
        >
          {blog.blocks?.map((block, idx) => {
            if (block.type === "richtext") {
              const html = block.content?.en || block.content?.vn || "<p></p>";
              return (
                <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />
              );
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
            return null;
          })}
        </div>
      </div>
      <div className="mx-auto py-10 pb-40 px-28">
        {/* Recommended Articles (BlogLists UI) */}
        {recommended.length > 0 && (
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
              {recommended.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  className="rounded-xl overflow-hidden transition cursor-pointer bg-white border border-none"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <motion.img
                    src={rec.img}
                    alt={rec.title}
                    className="w-full object-cover h-60"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="pt-5 px-1.5">
                    <h3 className="font-medium text-xl mb-2">{rec.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {rec.desc}
                    </p>
                    <motion.a
                      onClick={() => navigate(`/blogs/${rec.slug}`)}
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
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
