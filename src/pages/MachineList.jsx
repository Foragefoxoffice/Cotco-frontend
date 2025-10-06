// pages/MachineList.jsx
import React, { useEffect, useState, useRef } from "react";
import { Spin, Row, Col, Card } from "antd";
import { Link, useParams } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import {
  getMachinePagesByCategorySlug,
  getMachineCategories,
} from "../Api/api";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MachineList = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Fetch category
        const catRes = await getMachineCategories();
        const cats = catRes.data.data || [];
        const foundCat = cats.find((c) => c.slug === categorySlug);
        setCategory(foundCat || null);

        // ✅ Fetch machine pages for this category
        const machineRes = await getMachinePagesByCategorySlug(categorySlug);
        setMachines(machineRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [categorySlug]);

  // Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Parallax setup
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 0]);

  if (loading) return <Spin />;

  // ✅ Dynamic banner from category
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const bannerUrl =
    category?.banner && category.banner.startsWith("/uploads")
      ? `${API_URL}${category.banner}`
      : category?.banner || "/img/default-banner.jpg";

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
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Breadcrumb + Title */}
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
            <span className="capitalize">
              {categorySlug.replace(/-/g, " ")}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider">
            {category?.name?.en || categorySlug.replace(/-/g, " ")}
          </h1>
        </motion.div>
      </motion.section>

      {/* ================= CATEGORY DESCRIPTION SECTION ================= */}
      <div className="page-width py-16">
        <Row gutter={[32, 32]} align="middle">
          {/* Left side - Description */}
          <Col xs={24} md={14}>
            <p className="text-gray-700 text-lg leading-relaxed">
              {category?.description?.en}
            </p>
          </Col>

          {/* Right side - Icon */}
          <Col xs={24} md={10} className="flex justify-center md:justify-end">
            {category?.icon && (
              <img
                src={
                  category.icon.startsWith("/uploads")
                    ? `${API_URL}${category.icon}`
                    : category.icon
                }
                alt={category?.name?.en}
                className="max-h-40 object-contain"
              />
            )}
          </Col>
        </Row>
      </div>

      {/* ================= MACHINE PAGES LIST ================= */}
      <div className="page-width py-12">
        <Row gutter={[24, 24]}>
          {machines.map((machine) => (
            <Col xs={24} sm={12} md={12} key={machine._id}>
              {/* ✅ Public detail page, not admin */}
              <Link to={`/machines/${categorySlug}/${machine.slug}`}>
                <div className="rounded-xl overflow-hidden transition duration-300">
                  {machine.banner && (
                    <img
                      alt={machine.title?.en}
                      src={
                        machine.banner.startsWith("/uploads")
                          ? `${API_URL}${machine.banner}`
                          : machine.banner
                      }
                      className="h-[300px] w-full object-cover rounded-xl"
                    />
                  )}

                  <div className="flex justify-between items-center bg-[#0D3B66] text-white px-5 py-8 mt-4 rounded-xl">
                    <h3 className="font-semibold uppercase tracking-wide text-sm md:text-base">
                      {machine.title?.en}
                    </h3>
                    <div className="w-9 h-9 flex items-center justify-center border border-white text-white rounded-full transition hover:bg-white hover:text-[#0D3B66]">
                      <FiArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default MachineList;
