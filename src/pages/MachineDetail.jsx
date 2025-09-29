// src/pages/MachineDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { getMainCategories } from "../Api/api";
import TextileMachines from "../components/textMachines/TextileMachines";
import Partner from "../components/home/PartnerSection";

const MachineDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMainCategories();
        const cats = res.data.data || [];
        const found = cats.find((c) => c.slug === slug);
        setCategory(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <Spin />;
  if (!category) return <div className="p-8 text-center">Category not found</div>;

  return (
    <main>
      {/* Hero Section */}
      <TextileMachines category={category} />

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
