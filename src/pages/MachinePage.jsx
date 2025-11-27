// src/pages/MachinePageDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { Spin, Tabs } from "antd";
import { Link, useParams } from "react-router-dom";
import { getMachinePageBySlug } from "../Api/api";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "react-quill-new/dist/quill.snow.css";

const MachinePageDetail = () => {
  const { pageSlug, categorySlug } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState("en"); // ✅ Language state
  const containerRef = useRef(null);

  // ✅ Detect language change dynamically (from body class)
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const updateLang = () => setActiveLang(detectLang());
    updateLang();

    const observer = new MutationObserver(updateLang);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch single machine page
  useEffect(() => {
    (async () => {
      try {
        const res = await getMachinePageBySlug(pageSlug);
        setMachine(res.data.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [pageSlug]);

  // ✅ Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Parallax setup
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0B0B0B]">
        <Spin size="large" />
      </div>
    );

  if (!machine)
    return <div className="p-10 text-center">Machine not found</div>;

  // ✅ API Base
  const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "";

  // ✅ Banner URL
  const bannerUrl =
    machine.banner && machine.banner.startsWith("/uploads")
      ? `${API_URL}${machine.banner}`
      : machine.banner || "/img/default-banner.jpg";

  // ✅ Helper to pick correct language
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Render section dynamically (language-aware)
  const renderSection = (section, index) => {
    switch (section.type) {
      case "text":
        return (
          <div key={index} className="my-12 page-width grid grid-cols-1 md:grid-cols-2">
            <h2 className="text-2xl font-bold">{pick(section.title)}</h2>
            <p className="text-gray-700 mt-2">{pick(section.description)}</p>
          </div>
        );

      case "richtext":
  return (
    <div
      key={index}
      className="my-10 page-width max-w-none leading-relaxed quill-content"
      dangerouslySetInnerHTML={{
        __html: pick(section.richtext)
          ?.replace(/<ol>/g, "<ul>")
          ?.replace(/<\/ol>/g, "</ul>")
          ?.replace(/\n/g, "<br>")
          ?.trim() || "",
      }}
    />
  );



      case "list":
        return (
          <div key={index} className="my-10 page-width">
            <h2 className="text-2xl font-bold mb-6">{pick(section.listTitle)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.listItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-6xl font-bold text-gray-400 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-gray-800">{pick(item)}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "button":
        return (
          <div
            key={index}
            className={`my-12 page-width flex ${
              section.button?.align === "left"
                ? "justify-start"
                : section.button?.align === "right"
                ? "justify-end"
                : "justify-center"
            }`}
          >
            <button
              style={{ color: "white" }}
              onClick={() => {
                if (section.button?.link)
                  window.open(section.button.link, "_blank");
              }}
              className="px-6 py-3 bg-[#11456C] !text-white font-medium text-sm md:text-base rounded-full shadow-md hover:bg-[#0E3A5D] transition-all duration-300 hover:scale-105"
            >
              {pick(section.button?.name) || (activeLang === "vi" ? "Tìm hiểu thêm" : "Learn More")}
            </button>
          </div>
        );

      case "table":
        return (
          <div key={index} className="overflow-x-auto my-10 page-width">
            {section.table?.header && (
              <h3 className="text-2xl font-bold mb-4">
                {pick(section.table.header)}
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
                      {pick(cell)}
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
                        {pick(cell)}
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
    <div key={index} className="page-width my-10 flex flex-col items-center text-center">
      {/* ✅ Title (render HTML safely) */}
      {section.title && (
        <div
          className="text-2xl font-bold !text-black mb-3"
          dangerouslySetInnerHTML={{ __html: pick(section.title) }}
        />
      )}

      {/* ✅ Description (render HTML safely) */}
      {section.description && (
        <div
          className="text-black max-w-3xl mb-6 prose prose-invert leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: pick(section.description)
              ?.replace(/\n/g, "<br>")
              ?.trim() || "",
          }}
        />
      )}

      {/* ✅ Image */}
      {section.image && (
        <img
          className="rounded-2xl shadow-lg max-w-full"
          src={
            typeof section.image === "string"
              ? section.image.startsWith("/uploads")
                ? `${API_URL}${section.image}`
                : section.image
              : ""
          }
          alt={pick(section.title) || "section image"}
        />
      )}
    </div>
  );


      case "imageLeft":
case "imageRight":
  return (
    <div
      key={index}
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-14 page-width ${
        section.type === "imageRight" ? "md:[direction:rtl]" : ""
      }`}
    >
      {/* ✅ Text Side */}
      <div className="text-left space-y-4">
        {section.title && (
          <div
            className="text-2xl font-bold text-black"
            dangerouslySetInnerHTML={{ __html: pick(section.title) }}
          />
        )}
        {section.description && (
          <div
            className="text-baack prose prose-invert leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: pick(section.description)
                ?.replace(/\n/g, "<br>")
                ?.trim() || "",
            }}
          />
        )}
      </div>

      {/* ✅ Image Side */}
      <div className="flex justify-center">
        {section.image && (
          <img
            src={
              typeof section.image === "string"
                ? section.image.startsWith("/uploads")
                  ? `${API_URL}${section.image}`
                  : section.image
                : ""
            }
            alt={pick(section.title)}
            className="rounded-xl shadow-lg max-w-full"
          />
        )}
      </div>
    </div>
  );


      case "tabs":
  return (
    <div key={index} className="my-10">
      <style>
        {`
          /* Active tab color fix */
          :where(.css-dev-only-do-not-override-1odpy5d).ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #fff !important;
          }
            .custom-tabs .ant-tabs-nav-list {
              display: flex;
              justify-content:start !important;
              overflow-x: auto;
              scrollbar-width: thin;
              scrollbar-color: #aaa transparent;
              -webkit-overflow-scrolling: touch;
            }
          /* ✅ Make tab headers scrollable on mobile */
          @media (max-width: 768px) {
            

            .custom-tabs .ant-tabs-tab {
              flex-shrink: 0;
              white-space: nowrap;
              margin-right: 12px !important;
            }

            .custom-tabs .ant-tabs-nav {
              margin: 0 8px;
            }

            /* Hide scrollbar visually (optional) */
            .custom-tabs .ant-tabs-nav-list::-webkit-scrollbar {
              height: 4px;
            }
            .custom-tabs .ant-tabs-nav-list::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 2px;
            }
          }
        `}
      </style>

      <Tabs
        defaultActiveKey="0"
        className="custom-tabs"
        items={section.tabs?.map((tab, ti) => ({
          key: String(ti),
          label: pick(tab.tabTitle) || `Tab ${ti + 1}`,
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
        animate={scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative h-[70vh] md:min-h-[80vh] overflow-hidden hero transition-all duration-500 ease-out ${
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
              {activeLang === "vi" ? "Máy móc" : "Machines"}
            </Link>{" "}
            &gt;{" "}
            <Link to={`/machines/${categorySlug}`} className="hover:underline">
              {categorySlug}
            </Link>{" "}
            &gt; <span>{pick(machine.title)}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider">
            {pick(machine.title)}
          </h1>
        </motion.div>
      </motion.section>

      {/* ================= PAGE CONTENT ================= */}
      <div className="py-10">
        {machine.sections?.map((section, i) => renderSection(section, i))}
      </div>

      <Footer />


      <style>
  {`
    /* ✅ Pure Quill list styling (works without Tailwind prose) */
    .quill-content ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      padding-left: 1.5rem;
    }

    .quill-content ol {
      list-style-type: decimal;
      margin-left: 1.5rem;
      padding-left: 1.5rem;
    }

    .quill-content ul ul,
    .quill-content ol ul {
      list-style-type: circle;
    }

    .quill-content ol ol,
    .quill-content ul ol {
      list-style-type: lower-alpha;
    }

    .quill-content li {
      margin-bottom: 0.4rem;
      line-height: 1.6;
    }

    .quill-content ul li::marker,
    .quill-content ol li::marker {
      color: #555;
    }

    /* Optional: Quill paragraph spacing */
    .quill-content p {
      margin-bottom: 1rem;
      line-height: 1.7;
    }
    .quill-content ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
}

.quill-content ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
}
  `}
</style>



    </div>
  );
};

export default MachinePageDetail;
