import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Home,
  Package,
  Newspaper,
  Phone,
  Settings,
  BarChart2,
  Users,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";

const Dashboard = () => {
  const [showStats, setShowStats] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const { theme } = useTheme();

  const statsData = [
    { name: "Pages", value: 5, change: 1, increasing: true },
    { name: "Products", value: 24, change: 3, increasing: true },
    { name: "News", value: 12, change: 2, increasing: true },
    { name: "Contacts", value: 8, change: 1, increasing: false },
  ];

  const activityData = [
    {
      id: 1,
      action: "New contact form submission",
      time: "10 minutes ago",
      user: "System",
    },
    {
      id: 2,
      action: 'Product "Cotton Yarn" updated',
      time: "2 hours ago",
      user: "Admin User",
    },
    {
      id: 3,
      action: "New news article published",
      time: "5 hours ago",
      user: "Admin User",
    },
    {
      id: 4,
      action: "Global settings updated",
      time: "1 day ago",
      user: "Admin User",
    },
  ];

  const visitData = [
    { name: "Mon", visits: 120 },
    { name: "Tue", visits: 150 },
    { name: "Wed", visits: 180 },
    { name: "Thu", visits: 190 },
    { name: "Fri", visits: 160 },
    { name: "Sat", visits: 100 },
    { name: "Sun", visits: 85 },
  ];

  const dashboardCards = [
    {
      title: "Pages",
      icon: <FileText size={24} />,
      description: "Manage static pages like About Us, Privacy Policy",
      count: 5,
      path: "/pages",
      color: "bg-blue-500",
    },
    {
      title: "Homepage",
      icon: <Home size={24} />,
      description: "Configure homepage sections and content",
      count: 7,
      path: "/pages/homepage",
      color: "bg-green-500",
    },
    {
      title: "Products",
      icon: <Package size={24} />,
      description: "Manage Cotton, Fiber, and Machine products",
      count: 24,
      path: "/products",
      color: "bg-yellow-500",
    },
    {
      title: "News",
      icon: <Newspaper size={24} />,
      description: "Manage news articles and categories",
      count: 12,
      path: "/news",
      color: "bg-purple-500",
    },
    {
      title: "Contact",
      icon: <Phone size={24} />,
      description: "Manage contact information and form submissions",
      count: 8,
      path: "/contact",
      color: "bg-red-500",
    },
    {
      title: "Global Settings",
      icon: <Settings size={24} />,
      description: "Configure site-wide settings, footer, and header",
      count: 1,
      path: "/settings",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold mb-1 
    ${theme === "light" ? "text-[#000]" : "text-gray-300"}`}
        >
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the COTCO CMS
        </p>
      </div>

      {/* Stats Section */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden mb-6
    ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-gray-800 border-gray-700"
    }`}
      >
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => setShowStats(!showStats)}
        >
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-md mr-3">
              <BarChart2 size={20} className="text-indigo-600" />
            </div>
            <h2
              className={`text-lg font-medium
            ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}
            >
              Statistics Overview
            </h2>
          </div>
          <button className="text-gray-500 dark:text-gray-400">
            {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {showStats && (
          <div className="p-6">
            {/* Stat Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 border 
    ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-gray-700/50 border-gray-600"
    }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.name}
                    </h3>
                    <span
                      className={`flex items-center text-xs font-semibold ${
                        stat.increasing
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {stat.increasing ? (
                        <ArrowUp size={12} className="mr-1" />
                      ) : (
                        <ArrowDown size={12} className="mr-1" />
                      )}
                      {stat.change}%
                    </span>
                  </div>
                  <h3
                    className={`text-sm font-medium 
    ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
                  >
                    {stat.value}
                  </h3>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="h-80 w-full">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Weekly Website Visits
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visitData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    tick={{ fill: theme === "dark" ? "#9ca3af" : "#6b7280" }}
                  />
                  <YAxis
                    stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    tick={{ fill: theme === "dark" ? "#9ca3af" : "#6b7280" }}
                  />
                  <Tooltip
                    cursor={{
                      fill:
                        theme === "dark"
                          ? "rgba(107,114,128,0.3)"
                          : "rgba(209,213,219,0.5)",
                    }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                      color: theme === "dark" ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Bar
                    dataKey="visits"
                    fill={theme === "dark" ? "#8B5CF6" : "#4F46E5"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Activity Section */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden mb-6
    ${
      theme === "light"
        ? "bg-white border-gray-200"
        : "bg-gray-800 border-gray-700"
    }`}
      >
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => setShowActivity(!showActivity)}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md mr-3">
              <Users size={20} className="text-green-600" />
            </div>
            <h2
              className={`text-lg font-medium
            ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}
            >
              Recent Activity
            </h2>
          </div>
          <button className="text-gray-500 dark:text-gray-400">
            {showActivity ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {showActivity && (
          <div className="p-4">
            <ul className="space-y-2">
              {activityData.map((activity) => (
                <li
                  key={activity.id}
                  className={`p-4 rounded-lg border transition 
    ${
      theme === "light"
        ? "bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
        : "bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-gray-100"
    }`}
                >
                  <p className="text-sm font-semibold">{activity.action}</p>
                  <div
                    className={`flex text-xs mt-1 ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <p>{activity.time}</p>
                    <span className="mx-1">•</span>
                    <p>{activity.user}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-center">
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                View All Activity
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access */}
      <h2
        className={`text-lg font-semibold mb-3
            ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}
      >
        Quick Access
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Link
            to={card.path}
            key={card.title}
            className={`rounded-lg shadow-sm border overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg duration-200
        ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700 dark:hover:shadow-indigo-500/10"
        }`}
          >
            <div className="p-5">
              {/* Icon + Count */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color} text-white`}>
                  {card.icon}
                </div>
                <span
                  className={`text-sm font-medium px-2.5 py-0.5 rounded
              ${
                theme === "light"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-700 text-gray-300"
              }`}
                >
                  {card.count}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-lg font-semibold mb-1
            ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className={`${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                } text-sm`}
              >
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
