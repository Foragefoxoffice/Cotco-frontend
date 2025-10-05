import React, { useEffect, useState } from "react";
import { Collapse, Spin } from "antd";
import {
  Shield,
  FileText,
  Globe,
  Cookie,
  Users,
  Smartphone,
  GitMerge,
  RefreshCw,
  Plus,
  Minus,
} from "lucide-react";
import { getPrivacyPage } from "../../Api/api";

const { Panel } = Collapse;

export default function PrivacyPolicyContent() {
  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    getPrivacyPage().then((res) => {
      if (res.data) {
        setPrivacy(res.data);
      }
      setLoading(false);
    });
  }, []);

  const sections = [
    { key: "generalInformation", title: "General information on data processing" },
    { key: "website", title: "Website" },
    { key: "cookies", title: "Cookies" },
    { key: "socialMedia", title: "Social Media" },
    { key: "app", title: "App" },
    { key: "integration", title: "Integration" },
    { key: "changesPrivacy", title: "Changes to Privacy Policy" },
  ];

  const handlePanelChange = (keys) => setActiveKeys(keys);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-10/12 mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Privacy Policy
        </h1>

        <Collapse
          accordion
          bordered={false}
          activeKey={activeKeys}
          onChange={handlePanelChange}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive ? "bg-gray-300 text-gray-700" : "bg-gray-100 text-black"
              }`}
            >
              {isActive ? <Minus size={20} /> : <Plus size={20} />}
            </div>
          )}
          className="privacy-collapse"
        >
          {sections.map((section, index) => (
            <Panel
              key={section.key}
              header={
                <div className="flex items-center justify-between w-full ">
                  <span className="text-gray-800 text-md font-medium">
                    {index + 1}. {section.title}
                  </span>
                </div>
              }
              className="privacy-panel"
            >
              <div className="py-4 px-1">
                <div
                  className="text-gray-700 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{
                    __html:
                      privacy[section.key]?.content?.en ||
                      "<p class='text-gray-500 italic'>No content available for this section.</p>",
                  }}
                />
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>

      <style jsx>{`
        .privacy-collapse .ant-collapse-item {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: white;
        }
        .privacy-collapse .ant-collapse-item:last-child {
          border-bottom: none !important;
        }
        .privacy-collapse .ant-collapse-header {
          padding: 50px 0 !important;
          font-size: 20px !important;
          font-weight: 500;
          color: #111827;
          background: white !important;
        }
        .privacy-collapse .ant-collapse-header:hover{
            margin-left:60px;
            opacity:0.9;
        }
        .privacy-collapse .ant-collapse-content {
          border: none !important;
          background: white;
        }
        .privacy-collapse .ant-collapse-content-box {
          padding: 0 0 20px 0 !important;
        }
        .privacy-collapse .ant-collapse-item-active .ant-collapse-header {
          padding:30px 0;
        }
        .privacy-collapse .ant-collapse-arrow {
          display: none;
        }
          .privacy-collapse .ant-collapse-expand-icon{
            color:black;
          }
      `}</style>
    </div>
  );
}
