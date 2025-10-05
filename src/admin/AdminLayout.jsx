import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useTheme } from "../contexts/ThemeContext";

const { Content } = Layout;

const AdminLayout = () => {
  const { theme } = useTheme();

  return (
     <div className="flex h-screen font-sans bg-[#0A0A0A] text-gray-900 dark:text-gray-100"
     
     
      >
       <div className="flex-1 flex flex-acol overflow-hidden">
      <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
        <Header />
        <Content style={{ padding: 24, minHeight: "calc(100vh - 80px)" }}>
          <Outlet />
        </Content>
        </main>
      </div>
 
    </div>
  );
};

export default AdminLayout;
