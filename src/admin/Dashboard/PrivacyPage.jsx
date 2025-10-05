import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs, Divider } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getPrivacyPage, updatePrivacyPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css"

const { Panel } = Collapse;
const { TabPane } = Tabs;

// ✅ Normalize data so all sections always exist
const normalizePrivacy = (data) => {
  const sections = [
    "generalInformation",
    "website",
    "cookies",
    "socialMedia",
    "app",
    "integration",
    "changesPrivacy",
  ];

  const defaultSection = { content: { en: "", vi: "" } };

  const normalized = {};
  sections.forEach((key) => {
    normalized[key] = data?.[key] || { ...defaultSection };
    if (!normalized[key].content) {
      normalized[key].content = { en: "", vi: "" };
    }
  });

  return normalized;
};

// ✅ Validation helper
const isValidMultiLang = (obj) => {
  if (!obj) return false;
  return obj.en?.trim() !== "" && obj.vi?.trim() !== "";
};

// ✅ Translations for UI
const translations = {
  en: {
    cancel: "Cancel",
    save: "Save",
    bannerTitle: "Banner Title",
    bannerMedia: "Banner Media (Image / Video)",
  },
  vi: {
    cancel: "Hủy",
    save: "Lưu",
    bannerTitle: "Tiêu đề biểu ngữ",
    bannerMedia: "Banner Media (Hình ảnh / Video)",
  },
};

const API_BASE = import.meta.env.VITE_API_URL;

const PrivacyPage = () => {
  const [currentLang, setCurrentLang] = useState("en");

  const [privacyBanner, setPrivacyBanner] = useState({
    privacyBannerMedia: "",
    privacyBannerTitle: { en: "", vi: "" },
    privacyBannerMediaFile: null,
  });

  const [privacy, setPrivacy] = useState(normalizePrivacy({}));

  useEffect(() => {
    getPrivacyPage().then((res) => {
      if (res.data?.privacyBanner) {
        setPrivacyBanner({
          ...res.data.privacyBanner,
          privacyBannerMediaFile: null,
        });
      }
      if (res.data) {
        setPrivacy(normalizePrivacy(res.data));
      }
    });
  }, []);

  // Save Banner
  const handleSaveBanner = async () => {
    if (!isValidMultiLang(privacyBanner.privacyBannerTitle)) {
      return CommonToaster(
        "Please fill BOTH EN & VI in Banner Title",
        "error"
      );
    }

    const formData = new FormData();
    formData.append("privacyBanner", JSON.stringify(privacyBanner));
    if (privacyBanner.privacyBannerMediaFile) {
      formData.append(
        "privacyBannerMediaFile",
        privacyBanner.privacyBannerMediaFile
      );
    }

    const res = await updatePrivacyPage(formData);
    if (res.data?.privacy?.privacyBanner) {
      setPrivacyBanner({
        ...res.data.privacy.privacyBanner,
        privacyBannerMediaFile: null,
      });
      CommonToaster("Banner saved successfully", "success");
    }
  };

  // Save other sections
  const handleSave = async (sectionName) => {
    try {
      const sectionData = privacy[sectionName];

      // ✅ Validation: require both EN & VI
      if (!isValidMultiLang(sectionData.content)) {
        return CommonToaster(
          "Please fill BOTH EN & VI before saving this section",
          "error"
        );
      }

      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(sectionData));

      const res = await updatePrivacyPage(formData);
      if (res.data?.privacy) {
        setPrivacy(normalizePrivacy(res.data.privacy));
        CommonToaster(`${sectionName} saved successfully`, "success");
      }
    } catch (err) {
      CommonToaster(err.message || "Error saving section", "error");
    }
  };

  // ✅ Handle file upload with size validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxVideoSize = 10 * 1024 * 1024; // 10MB
    const maxImageSize = 2 * 1024 * 1024; // 2MB

    if (file.type.startsWith("video/") && file.size > maxVideoSize) {
      return CommonToaster("Video size must be less than 10MB", "error");
    }

    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      return CommonToaster("Image size must be less than 2MB", "error");
    }

    setPrivacyBanner({
      ...privacyBanner,
      privacyBannerMediaFile: file,
    });
  };

  // Render a Rich Text Section
  const renderSection = (key, title) => (
  <Panel header={title} key={key}>
    <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
      {["en", "vi"].map((lang) => (
        <TabPane tab={lang.toUpperCase()} key={lang}>
          <div className="mt-5" >
            <ReactQuill
              value={privacy[key]?.content?.[lang] || ""}
              onChange={(value) =>
                setPrivacy((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    content: {
                      ...(prev[key]?.content || { en: "", vi: "" }),
                      [lang]: value,
                    },
                  },
                }))
              }
              theme="snow"
            />
          </div>
        </TabPane>
      ))}
    </Tabs>

    <div className="flex justify-end gap-4 mt-4">
  {/* Cancel Button (Gray / Outline) */}
  <Button
    onClick={() => window.location.reload()}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "transparent",
      color: "#fff",
      border: "1px solid #333",
      padding: "22px",
      borderRadius: "9999px", // pill shape
      fontWeight: "500",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
  >
    {/* Cancel Icon (X) */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ width: "18px", height: "18px" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
    {translations[currentLang].cancel}
  </Button>

  {/* Save Button (Blue) */}
  <Button
    onClick={() => handleSave(key)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#0284C7", // blue
      color: "#fff",
      border: "none",
      padding: "22px",
      borderRadius: "9999px", // pill shape
      fontWeight: "500",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
  >
    {/* Save Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ width: "18px", height: "18px" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2zM7 3v5h10V3M9 21v-6h6v6"
      />
    </svg>
    {translations[currentLang].save}
  </Button>
</div>

  </Panel>
);


  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717]">
      <style>{`
  /* Quill editor wrapper */
  .ql-editor {
    min-height: 250px; /* ensure enough writing space */
  }

  /* Sticky toolbar */
  .ql-toolbar.ql-snow {
    position: sticky;
    top: 70px;
    z-index: 20;
    background: #fff !important;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    color:#fff !important;
  }

  /* Dark mode */
  .dark .ql-toolbar.ql-snow {
    background: #fff !important; /* gray-800 */
    color: #fff !important;

  }

  /* Content area */
  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
    background: #fff;
  }

  .dark .ql-container.ql-snow {
    background: #171717; /* gray-900 */
    color: #fff;
  }
    .ant-collapse>.ant-collapse-item >.ant-collapse-header .ant-collapse-header-text{
    color:white;
    font-weight:600;
    font-size:16px;
    }
`}</style>
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Privacy Page Management
      </h2>

      <Collapse accordion bordered={false} defaultActiveKey="banner">
        {/* ================= Banner ================= */}
        <Panel header="Privacy Banner" key="banner">
          <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-2">
                  {translations[currentLang].bannerTitle}
                </label>
                <input
                 style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  type="text"
                  className="w-full border p-2 rounded"
                  value={privacyBanner.privacyBannerTitle[lang]}
                  onChange={(e) =>
                    setPrivacyBanner({
                      ...privacyBanner,
                      privacyBannerTitle: {
                        ...privacyBanner.privacyBannerTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className='block mt-5 mb-1 text-white font-semibold'>{translations[currentLang].bannerMedia}</label>

          {privacyBanner.privacyBannerMediaFile ? (
            privacyBanner.privacyBannerMediaFile.type.startsWith("video/") ? (
              <video
                src={URL.createObjectURL(privacyBanner.privacyBannerMediaFile)}
                controls
                className="w-64 mb-4 rounded-lg"
              />
            ) : (
              <img
                src={URL.createObjectURL(privacyBanner.privacyBannerMediaFile)}
                alt="Banner"
                className="w-64 mb-4 rounded-lg"
              />
            )
          ) : privacyBanner.privacyBannerMedia ? (
            /\.(mp4|webm|ogg)$/i.test(privacyBanner.privacyBannerMedia) ? (
              <video
                src={`${API_BASE}${privacyBanner.privacyBannerMedia}`}
                controls
                className="w-64 mb-4 rounded-lg"
              />
            ) : (
              <img
                src={`${API_BASE}${privacyBanner.privacyBannerMedia}`}
                alt="Banner"
                className="w-64 mb-4 rounded-lg"
              />
            )
          ) : null}

         <label
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 22px",
    backgroundColor: "#0284C7", // blue
    color: "#fff",
    fontWeight: "600",
    borderRadius: "9999px", // pill shape
    cursor: "pointer",
    transition: "background 0.3s ease",
    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.4)",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0369A1")}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0284C7")}
>
  {/* Upload Icon (SVG) */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    style={{ width: "18px", height: "18px" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
    />
  </svg>

  Upload File

  {/* Hidden File Input */}
  <input
    type="file"
    accept="image/*,video/*"
    onChange={handleFileChange} // ✅ Keeps your original function
    style={{ display: "none" }}
  />
</label>


          <div className="flex justify-end gap-4 mt-4">
  {/* Cancel Button (Gray / Outline) */}
  <Button
    onClick={() => window.location.reload()}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "transparent",
      color: "#fff",
      border: "1px solid #333",
      padding: "22px",
      borderRadius: "9999px", // pill shape
      fontWeight: "500",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
  >
    {/* Cancel Icon (X) */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ width: "18px", height: "18px" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
    {translations[currentLang].cancel}
  </Button>

  {/* Save Button (Blue) */}
  <Button
    onClick={handleSaveBanner}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#0284C7", // blue
      color: "#fff",
      border: "none",
      padding: "22px",
      borderRadius: "9999px", // pill shape
      fontWeight: "500",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
  >
    {/* Save Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ width: "18px", height: "18px" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2zM7 3v5h10V3M9 21v-6h6v6"
      />
    </svg>
    {translations[currentLang].save}
  </Button>
</div>

        </Panel>

        {/* ================= Other Sections ================= */}
        {renderSection("generalInformation", "General Information")}
        {renderSection("website", "Website")}
        {renderSection("cookies", "Cookies")}
        {renderSection("socialMedia", "Social Media")}
        {renderSection("app", "App")}
        {renderSection("integration", "Integration")}
        {renderSection("changesPrivacy", "Changes to Privacy Policy")}
      </Collapse>
    </div>
  );
};

export default PrivacyPage;
