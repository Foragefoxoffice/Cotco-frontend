// src/pages/MachineDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { getMachineCategories } from "../Api/api"; // ✅ use machine categories
import Partner from "../components/home/PartnerSection";

const MachineDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // ✅ fetch all categories, find by slug
        const res = await getMachineCategories();
        const cats = res.data.data || [];
        const found = cats.find((c) => c.slug === slug);
        setCategory(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <Spin />;
  if (!category)
    return <div className="p-8 text-center">Category not found</div>;

  return (
    <main>
      {/* Hero Section */}
      <div
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          background: category.image
            ? `url(${category.image}) center/cover no-repeat`
            : "#11456C",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold uppercase">
            {category.name.en}
          </h1>
          <p className="text-white/80 mt-2 max-w-2xl mx-auto">
            {category.description.en}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="page-width py-10">
        <h2 className="text-3xl font-bold">{category.name.en}</h2>
        <p className="text-gray-600">{category.description.en}</p>
      </div>

      <Partner />
    </main>
  );
};

export default MachineDetail;
