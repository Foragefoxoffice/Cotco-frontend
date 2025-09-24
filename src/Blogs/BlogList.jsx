import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogLists() {
  const navigate = useNavigate();
  const blogs = [
    {
      id: 1,
      title: "Now the pain is very important, and the teaching is consistent.",
      desc: "Pellentesque at posuere tellus. Ut sed dui justo. Phasellus is scelerisque turpis curae, ut pulvinar lectus tristique non. Nam laoreet, risus vel laoreet laoreet, mauris.",
      img: "/img/blog/blog-img.png",
    },
    {
      id: 2,
      title: "Now the pain is very important, and the teaching is consistent.",
      desc: "Pellentesque at posuere tellus. Ut sed dui justo. Phasellus is scelerisque turpis curae, ut pulvinar lectus tristique non. Nam laoreet, risus vel laoreet laoreet, mauris.",
      img: "/img/blog/blog-img.png",
    },
    {
      id: 3,
      title: "Now the pain is very important, and the teaching is consistent.",
      desc: "Pellentesque at posuere tellus. Ut sed dui justo. Phasellus is scelerisque turpis curae, ut pulvinar lectus tristique non. Nam laoreet, risus vel laoreet laoreet, mauris.",
      img: "/img/blog/blog-img.png",
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

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
              className="w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="pt-5 px-1.5">
              <h3 className="font-medium text-xl mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{blog.desc}</p>
              <motion.a
                onClick={() => navigate("/")}
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
  );
}
