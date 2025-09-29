// src/pages/MachineCategories.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import {
  getMachineCategoriesByMainCategorySlug,
  getMainCategories,
} from "../Api/api";
import TextileMachines from "../components/textMachines/TextileMachines"; // ✅ correct path
import Navbar from "../components/layout/Navbar";

const MachineCategories = () => {
  const { mainSlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1. Fetch all main categories to find current main
        const mainRes = await getMainCategories();
        const mains = mainRes.data.data || [];
        const foundMain = mains.find((m) => m.slug === mainSlug);
        setMainCategory(foundMain);

        // 2. Fetch child categories
        const res = await getMachineCategoriesByMainCategorySlug(mainSlug);
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [mainSlug]);

  if (loading) return <Spin />;

  return (
    <main>
      <Navbar />

      {/* ✅ Show main category hero */}
      <TextileMachines category={mainCategory} />
      <h2 className="text-center font-bold mb-4">MAIN MACHINES FROM LMW</h2>
      <div className="py-6 page-width">
        <Row gutter={[16, 16]}>
          {categories.map((cat) => (
            <Col xs={24} md={12} lg={12} key={cat._id}>
              <Link to={`/machines/${mainSlug}/${cat.slug}`}>
                <div className="group rounded-2xl overflow-hidden transition-all duration-300">
                  {/* Image */}
                  <div className="h-[350px] w-full">
                    <img
                      alt={cat.name.en}
                      src={`http://localhost:5000${cat.image}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                    />
                  </div>

                  {/* Bottom section */}
                  <div className="bg-[#11456C] flex items-center justify-between mt-5 p-4 rounded-2xl">
                    <h3 className="text-white font-semibold uppercase tracking-wide">
                      {cat.name.en}
                    </h3>

                    {/* Right icon */}
                    <div className="text-white bg-white/20 rounded-full p-2 group-hover:bg-white transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 28 20"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 5h6m0 0v6m0-6L10 14"
                          className="group-hover:stroke-[#11456C]"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </main>
  );
};

export default MachineCategories;
