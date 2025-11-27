import React, { useEffect, useState } from "react";
import { Collapse, Spin } from "antd";
import { Plus, Minus } from "lucide-react";
import { getPrivacyPage } from "../../Api/api";

const { Panel } = Collapse;

export default function PrivacyPolicyContent() {
  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeKeys, setActiveKeys] = useState([]);
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Detect language
  useEffect(() => {
    const checkLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch privacy data
  useEffect(() => {
    getPrivacyPage().then((res) => {
      if (res.data) setPrivacy(res.data);
      setLoading(false);
    });
  }, []);

  const handlePanelChange = (keys) => setActiveKeys(keys);

  const t = (en, vi) => (isVietnamese ? vi || en : en);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!privacy || !privacy.privacyPolicies?.length) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white text-gray-600">
        <p>
          {t(
            "No Privacy Policies found.",
            "Không tìm thấy chính sách bảo mật nào."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== Banner Section ===== */}
      {/* {privacy.privacyBanner && (
        <div className="w-full relative overflow-hidden">
          {privacy.privacyBanner.privacyBannerMedia ? (
            /\.(mp4|webm|ogg)$/i.test(
              privacy.privacyBanner.privacyBannerMedia
            ) ? (
              <video
                src={`${import.meta.env.VITE_API_URL}${
                  privacy.privacyBanner.privacyBannerMedia
                }`}
                autoPlay
                loop
                muted
                className="w-full h-[350px] object-cover"
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_API_URL}${
                  privacy.privacyBanner.privacyBannerMedia
                }`}
                alt="Privacy Banner"
                className="w-full h-[350px] object-cover"
              />
            )
          ) : null}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center">
              {t(
                privacy.privacyBanner.privacyBannerTitle?.en ||
                  "Privacy Policy",
                privacy.privacyBanner.privacyBannerTitle?.vi ||
                  "Chính Sách Bảo Mật"
              )}
            </h1>
          </div>
        </div>
      )} */}

      {/* ===== Policies Section ===== */}
      <div className="w-10/12 mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          {t("Privacy Policy", "Chính Sách Bảo Mật")}
        </h2>

        <Collapse
          accordion
          bordered={false}
          activeKey={activeKeys}
          onChange={handlePanelChange}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-gray-300 text-gray-700"
                  : "bg-gray-100 text-black"
              }`}
            >
              {isActive ? <Minus size={18} /> : <Plus size={18} />}
            </div>
          )}
          className="privacy-collapse"
        >
          {privacy.privacyPolicies.map((policy, index) => (
            <Panel
              key={index}
              header={
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-800 text-md font-medium">
                    {index + 1}.{" "}
                    {t(
                      policy.policyTitle?.en || "Untitled Policy",
                      policy.policyTitle?.vi || "Chính sách chưa có tiêu đề"
                    )}
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
                      t(
                        policy.policyContent?.en ||
                          "<p class='text-gray-500 italic'>No content available.</p>",
                        policy.policyContent?.vi ||
                          "<p class='text-gray-500 italic'>Không có nội dung.</p>"
                      ),
                  }}
                />
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>

      {/* ===== CSS Styles ===== */}
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
          padding: 40px 0 !important;
          font-size: 18px !important;
          font-weight: 500;
          color: #111827;
          background: white !important;
          transition: all 0.3s ease;
        }
        .privacy-collapse .ant-collapse-header:hover {
          margin-left: 40px;
          opacity: 0.9;
        }
        .privacy-collapse .ant-collapse-content {
          border: none !important;
          background: white;
        }
        .privacy-collapse .ant-collapse-content-box {
          padding: 0 0 20px 0 !important;
        }
        .privacy-collapse .ant-collapse-item-active .ant-collapse-header {
          padding: 30px 0 !important;
        }
        .privacy-collapse .ant-collapse-arrow {
          display: none;
        }
        .privacy-collapse .ant-collapse-expand-icon {
          color: black !important;
        }

        .privacy-collapse ul {
    list-style-type: disc !important;
    padding-left: 1.5rem !important;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .privacy-collapse ol {
    list-style-type: decimal !important;
    padding-left: 1.5rem !important;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .privacy-collapse li {
    margin-bottom: 0.25rem;
  }
      `}</style>
    </div>
  );
}
