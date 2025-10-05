// src/pages/MachinePageDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { Spin, Tabs } from "antd";
import { Link, useParams } from "react-router-dom";
import { getMachinePageBySlug } from "../Api/api"; // ✅ single page
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MachinePageDetail = () => {
  const { pageSlug, categorySlug } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);
  console.log("categroies", categorySlug);
  useEffect(() => {
    (async () => {
      try {
        // ✅ Fetch single machine page
        const res = await getMachinePageBySlug(pageSlug);
        setMachine(res.data.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [pageSlug]);

  // Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Parallax setup
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);

  if (loading) return <Spin />;
  if (!machine)
    return <div className="p-10 text-center">Machine not found</div>;

  // ✅ Banner
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const bannerUrl =
    machine.banner && machine.banner.startsWith("/uploads")
      ? `${API_URL}${machine.banner}`
      : machine.banner || "/img/default-banner.jpg";

  // ✅ Render section dynamically
  const renderSection = (section, index) => {
    switch (section.type) {
      case "text":
        return (
          <div
            key={index}
            className="my-12 page-width grid grid-cols-1 md:grid-cols-2 "
          >
            <h2 className="text-2xl font-bold">{section.title?.en}</h2>
            <p className="text-gray-700 mt-2">{section.description?.en}</p>
          </div>
        );
      case "richtext":
        return (
          <div
            key={index}
            className="prose max-w-none my-6 page-width"
            dangerouslySetInnerHTML={{ __html: section.richtext?.en }}
          />
        );
      case "list":
        return (
          <div key={index} className="my-10 page-width">
            <h2 className="text-2xl font-bold mb-6">{section.title?.en}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.listItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-6xl font-bold text-gray-400 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-gray-700">{item?.en}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "table":
  return (
    <div key={index} className="overflow-x-auto my-10 page-width">
      {section.table?.header && (
        <h3 className="text-2xl font-bold mb-4">
          {section.table.header?.en || section.table.header?.vn || ""}
        </h3>
      )}
      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr className="bg-[#11456C] text-white">
            {section.table.rows?.[0]?.map((cell, ci) => (
              <th
                key={ci}
                className="border border-gray-300 px-4 py-2 text-left font-semibold"
              >
                {cell?.en || cell?.vn || ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.table.rows?.slice(1).map((row, ri) => (
            <tr key={ri} className="odd:bg-white even:bg-gray-50">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-gray-300 px-4 py-2 text-gray-800"
                >
                  {cell?.en || cell?.vn || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

      case "image":
        return (
          <div key={index} className="page-width my-10 flex justify-center">
            {section.image && (
              <img
                className="rounded-2xl"
                src={
                  typeof section.image === "string"
                    ? section.image.startsWith("/uploads")
                      ? `${API_URL}${section.image}`
                      : section.image
                    : ""
                }
                alt={section.title?.en || "section image"}
              />
            )}
          </div>
        );
      case "imageLeft":
      case "imageRight":
        return (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-10 page-width ${
              section.type === "imageRight" ? "md:[direction:rtl]" : ""
            }`}
          >
            <div>
              <h2 className="text-2xl font-bold">{section.title?.en}</h2>
              <p className="text-gray-700 mt-2">{section.description?.en}</p>
            </div>
            <div>
              {section.image && (
                <img
                  src={
                    typeof section.image === "string"
                      ? `${API_URL}${section.image}`
                      : ""
                  }
                  alt={section.title?.en}
                  className="rounded-lg shadow"
                />
              )}
            </div>
          </div>
        );
      case "tabs":
        return (
          <div key={index} className="my-10">
            <Tabs
              defaultActiveKey="0"
              className="custom-tabs "
              items={section.tabs?.map((tab, ti) => ({
                key: String(ti),
                label: tab.tabTitle?.en || `Tab ${ti + 1}`,
                children: (
                  <div className="mt-4 page-width">
                    {tab.sections?.map((childSection, ci) =>
                      renderSection(childSection, `${index}-${ci}`)
                    )}
                  </div>
                ),
              }))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <motion.section
        ref={containerRef}
        style={{
          background: `url('${bannerUrl}') center/cover no-repeat`,
          y: yImage,
        }}
        initial={{ scale: 1, opacity: 1 }}
        animate={
          scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative h-[70vh] md:min-h-[80vh] rounded-xl overflow-hidden hero transition-all duration-500 ease-out ${
          scrolled ? "rounded-2xl" : ""
        }`}
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-24 left-6 md:left-16 z-20 text-white"
        >
          <div className="text-sm opacity-90 mb-2">
            <Link to="/machines" className="hover:underline">
              Machines
            </Link>{" "}
            &gt;{" "}
            <Link to={`/machines/${categorySlug}`} className="hover:underline">
              {categorySlug}
            </Link>{" "}
            &gt; <span>{machine.title?.en}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider">
            {machine.title?.en}
          </h1>
        </motion.div>
      </motion.section>

      {/* ================= RENDER MACHINE PAGE ================= */}
      <div className="py-10">
        <div className="page-width">
          {/* <h2 className="text-2xl font-bold mb-4">{machine.title?.en}</h2>
          <p className="text-gray-600 mb-6">{machine.description?.en}</p> */}
        </div>

        {machine.sections?.map((section, i) => renderSection(section, i))}
      </div>

      <Footer />
    </div>
  );
};

export default MachinePageDetail;
