import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Home,
  Package,
  Newspaper,
  Phone,
  Settings,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const dashboardCards = [
    {
      title: "Pages",
      icon: <FileText size={26} />,
      description: "Manage static pages like About Us, Privacy Policy",
      path: "/admin/about",
      color: "from-blue-500 to-cyan-400",
      bgHover: "hover:bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Homepage",
      icon: <Home size={26} />,
      description: "Configure homepage sections and content",
      path: "/admin/home",
      color: "from-green-500 to-emerald-400",
      bgHover: "hover:bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Products",
      icon: <Package size={26} />,
      description: "Manage Cotton, Fiber, and Machine products",
      path: "/admin/cotton",
      color: "from-yellow-500 to-orange-400",
      bgHover: "hover:bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      title: "News & Events",
      icon: <Newspaper size={26} />,
      description: "Manage news articles and categories",
      path: "/admin/resources",
      color: "from-purple-500 to-pink-400",
      bgHover: "hover:bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Contact",
      icon: <Phone size={26} />,
      description: "Manage contact information and form submissions",
      path: "/admin/contact",
      color: "from-red-500 to-rose-400",
      bgHover: "hover:bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "Global Settings",
      icon: <Settings size={26} />,
      description: "Configure site-wide settings, footer, and header",
      path: "/admin/header",
      color: "from-indigo-500 to-violet-400",
      bgHover: "hover:bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="bg-[#0A0A0A] p-4 md:p-8 rounded-3xl min-h-full">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Welcome back to the COTCO CMS</p>
      </motion.div>

      {/* Quick Access Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100 mr-3">
            Quick Access
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {dashboardCards.map((card) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Link to={card.path} className="block group h-full">
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border ${card.borderColor} bg-[#111111] p-6 transition-all duration-300 ${card.bgHover} hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-gray-500/30`}
                >
                  {/* Subtle background glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        {card.icon}
                      </div>
                      <div className="p-2 rounded-full bg-gray-800/50 text-gray-400 group-hover:text-white group-hover:bg-gray-700 transition-colors duration-300">
                        <ArrowRight
                          size={20}
                          className="transform group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-white transition-colors duration-300">
                      {card.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {card.description}
                    </p>
                  </div>

                  {/* Decorative bottom line */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${card.color} transition-all duration-500 group-hover:w-full`}
                  ></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
