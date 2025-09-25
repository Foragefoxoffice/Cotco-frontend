import { useEffect, useState } from "react";
import { getPages } from "../Api/api";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogLists() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getPages(); // GET /api/v1/pages
        // Format data for display (use EN version for now)
        const formatted = res.data.data.map((page) => ({
          id: page._id,
          title: page.title.en,
          desc:
            page.blocks.find((b) => b.sectionType === "content")?.values.body?.en ||
            "No description available",
          img:
            page.blocks.find((b) => b.sectionType === "hero")?.values.backgroundImage ||
            "/img/blog/blog-img.png",
          slug: page.slug,
        }));
        setBlogs(formatted);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <p className="text-center py-10">Loading blogs...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-1 py-12">
      {/* LATEST */}
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        LATEST
      </motion.h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-20 md:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              className="rounded-xl overflow-hidden transition cursor-pointer bg-white border border-none"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
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
              <div className="pt-5 px-1.5">
                <h3 className="font-medium text-xl mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.desc}</p>
                <motion.a
                  onClick={() => navigate(`/blogs/${blog.slug}`)} // ✅ navigate to blog detail
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
      )}
    </div>
  );
}
