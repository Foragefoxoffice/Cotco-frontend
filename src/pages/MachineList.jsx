// pages/MachineList.jsx
import React, { useEffect, useState } from "react";
import { Spin, Tabs } from "antd";
import { Link, useParams } from "react-router-dom";
import {
  getMachinePagesByCategorySlug,
  getMachineCategoriesByMainCategorySlug,
} from "../Api/api";
import { motion } from "framer-motion";

const MachineList = () => {
  const { mainSlug, categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Fetch category details
        const catRes = await getMachineCategoriesByMainCategorySlug(mainSlug);
        const cats = catRes.data.data || [];
        const foundCat = cats.find((c) => c.slug === categorySlug);
        setCategory(foundCat || null);

        // ✅ Fetch machine pages with sections
        const machineRes = await getMachinePagesByCategorySlug(categorySlug);
        setMachines(machineRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [mainSlug, categorySlug]);

  if (loading) return <Spin />;

  // ✅ Hero animation variants
  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // ✅ Render section dynamically
  const renderSection = (section, index) => {
    switch (section.type) {
      case "text":
        return (
          <div key={index} className="my-6">
            <h2 className="text-2xl font-bold">{section.title?.en}</h2>
            <p className="text-gray-700 mt-2">{section.description?.en}</p>
          </div>
        );

      case "richtext":
        return (
          <div
            key={index}
            className="prose max-w-none my-6"
            dangerouslySetInnerHTML={{ __html: section.richtext?.en }}
          />
        );

      case "list":
        return (
          <ul key={index} className="list-disc pl-6 my-6">
            {section.listItems?.map((item, i) => (
              <li key={i}>{item?.en}</li>
            ))}
          </ul>
        );

      case "table":
        return (
          <div key={index} className="overflow-x-auto my-10">
            {section.table.header && (
              <h3 className="text-2xl font-bold mb-4">
                {section.table.header}
              </h3>
            )}
            <table className="table-auto border-collapse w-full text-sm">
              <thead>
                <tr className="bg-[#11456C] text-white">
                  {section.table.rows?.[0]?.map((_, ci) => (
                    <th
                      key={ci}
                      className="border border-gray-300 px-4 py-2 text-left font-semibold"
                    >
                      {/* If header provided inside first row */}
                      {section.table.rows[0][ci] || ""}
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
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "imageLeft":
      case "imageRight":
        return (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-10 ${
              section.type === "imageRight" ? "md:flex-row-reverse" : ""
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
                      ? `http://localhost:5000${section.image}`
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
              className="custom-tabs"
              items={section.tabs?.map((tab, ti) => ({
                key: String(ti),
                label: tab.tabTitle?.en || `Tab ${ti + 1}`,
                children: (
                  <div className="mt-4">
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
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-b from-sky-400 to-blue-700 hero md:pt-0 overflow-hidden rounded-xl mb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="w-full flex flex-col justify-center relative h-[300px] md:h-[400px] px-6 md:px-16"
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-sm mb-4 opacity-90 text-white"
          >
            <Link to="/machines" className="hover:underline">
              Machines
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/machines/${mainSlug}`}
              className="hover:underline capitalize"
            >
              {mainSlug.replace(/-/g, " ")}
            </Link>{" "}
            &gt;{" "}
            <span className="capitalize">
              {categorySlug.replace(/-/g, " ")}
            </span>
          </motion.div>

          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold uppercase text-white"
          >
            {category?.name?.en || categorySlug.replace(/-/g, " ")}
          </motion.h1>
        </motion.div>
      </section>

      {/* ================= RENDER MACHINE SECTIONS ================= */}
      <div className="page-width py-10">
        {machines.map((machine) => (
          <div key={machine._id}>
            <h2 className="text-2xl font-bold mb-4">{machine.title?.en}</h2>
            <p className="text-gray-600 mb-6">{machine.description?.en}</p>

            {machine.sections?.map((section, i) => renderSection(section, i))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineList;
