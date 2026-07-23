import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useTheme } from "../contexts/ThemeContext";
import Loader from "../Common/Loader";

const { Content } = Layout;

const AdminLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 600); // 600ms loading state for smooth transition
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#0A0A0A]"

      style={{
        fontFamily: "Lexend"
      }}
    >
      <div className="flex-1 flex flex-acol overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Header />
          <Content style={{ paddingTop: 24, paddingBottom: 24, minHeight: "calc(100vh - 80px)" }}>
            {isNavigating && <Loader />}
            <div style={{ display: isNavigating ? "none" : "block" }}>
              <Outlet />
            </div>
          </Content>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
