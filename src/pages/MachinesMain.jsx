// src/pages/MachinesMain.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import { Link } from "react-router-dom";
import { getMachineCategories } from "../Api/api"; // ✅ use machine categories
import MachineBenifie from "../components/machines/MachinesBenifite";
import Machines from "../components/machines/Machines";
import Navbar from "../components/layout/Navbar";
import PartnerSection from "../components/coctoproducts/PartnerSection";
import Footer from "../components/layout/Footer";
import OurTeam from "../components/coctoproducts/OurTeam";

const MachinesMain = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMachineCategories();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spin />;

  return (
    <main>
      <Navbar />
      <Machines />
      <MachineBenifie />
      <div className="page-width py-3 ">
        <Row gutter={[16, 16]}>
          {categories.map((cat) => (
            <Col xs={24} md={12} lg={12} key={cat._id}>
              <Link to={`/machines/${cat.slug}`}>
                <div className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Background image */}
                  <img
                    src={`http://localhost:5000${cat.image}`}
                    alt={cat.name.en}
                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                  {/* Top-right icon */}
                  <div className="absolute top-3 right-3 text-white/80 group-hover:text-white transition border p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>

                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-3xl font-semibold">
                      {cat.name.en}
                    </h3>
                    <p className="text-white/80 text-md font-light">
                      {cat.description.en}
                    </p>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      <PartnerSection />
      <OurTeam />
      <Footer />
    </main>
  );
};

export default MachinesMain;
