import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs, Divider } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getTermsPage, updateTermsPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css"

const { Panel } = Collapse;
const { TabPane } = Tabs;

const API_BASE = import.meta.env.VITE_API_URL;

// ✅ Validation helper
const isValidMultiLang = (obj) => {
  if (!obj) return false;
  return obj.en?.trim() !== "" && obj.vi?.trim() !== "";
};

// ✅ Translations
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

const TermsConditionsPage = () => {
  const [currentLang, setCurrentLang] = useState("en");

  const [termsBanner, setTermsBanner] = useState({
    termsBannerMedia: "",
    termsBannerTitle: { en: "", vi: "" },
    termsBannerMediaFile: null,
  });

  const [termsConditionsContent, setTermsConditionsContent] = useState({
    en: "",
    vi: "",
  });

  useEffect(() => {
    getTermsPage().then((res) => {
      const data = res.data?.terms || res.data; // ✅ fix: unwrap terms

      if (data?.termsBanner) {
        setTermsBanner({ ...data.termsBanner, termsBannerMediaFile: null });
      }
      if (data?.termsConditionsContent) {
        setTermsConditionsContent(data.termsConditionsContent);
      }
    });
  }, []);

  // ✅ Save Banner
  const handleSaveBanner = async () => {
    const bannerData = {
      termsBannerMedia: termsBanner.termsBannerMedia, // keep path if no new upload
      termsBannerTitle: termsBanner.termsBannerTitle,
    };

    const formData = new FormData();
    formData.append("termsBanner", JSON.stringify(bannerData)); // ✅ clean object

    if (termsBanner.termsBannerMediaFile) {
      formData.append("termsBannerMediaFile", termsBanner.termsBannerMediaFile);
    }

    const res = await updateTermsPage(formData);
    const data = res.data?.terms || res.data;

    if (data?.termsBanner) {
      setTermsBanner({ ...data.termsBanner, termsBannerMediaFile: null });
      CommonToaster("Banner saved successfully", "success");
    }
  };


  // ✅ Save Content
  const handleSaveContent = async () => {
    if (!isValidMultiLang(termsConditionsContent)) {
      return CommonToaster("Please fill BOTH EN & VI in Content", "error");
    }

    const formData = new FormData();
    formData.append(
      "termsConditionsContent",
      JSON.stringify(termsConditionsContent)
    );

    const res = await updateTermsPage(formData);
    const data = res.data?.terms || res.data;

    if (data?.termsConditionsContent) {
      setTermsConditionsContent(data.termsConditionsContent);
      CommonToaster("Content saved successfully", "success");
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

    setTermsBanner({ ...termsBanner, termsBannerMediaFile: file });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#0A0A0A]">

      <style>{`
  /* Quill editor wrapper */
  .ql-editor {
    min-height: 250px; /* ensure enough writing space */
  }

  /* Sticky toolbar */
  .ql-toolbar.ql-snow {
    position: sticky;
    top: 80px;
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
        Terms & Conditions Management
      </h2>

      <Collapse accordion bordered={false} defaultActiveKey="banner">
        {/* ================= Banner ================= */}
        <Panel header="Terms & Conditions Banner" key="banner">
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
                  value={termsBanner.termsBannerTitle[lang]}
                  onChange={(e) =>
                    setTermsBanner({
                      ...termsBanner,
                      termsBannerTitle: {
                        ...termsBanner.termsBannerTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className="mt-5 mb-1 text-white font-bold block">{translations[currentLang].bannerMedia}</label>

          {termsBanner.termsBannerMediaFile ? (
            termsBanner.termsBannerMediaFile.type.startsWith("video/") ? (
              <video
                src={URL.createObjectURL(termsBanner.termsBannerMediaFile)}
                controls
                className="w-64 mb-4 rounded-lg"
              />
            ) : (
              <img
                src={URL.createObjectURL(termsBanner.termsBannerMediaFile)}
                alt="Banner"
                className="w-64 mb-4 rounded-lg"
              />
            )
          ) : termsBanner.termsBannerMedia ? (
            /\.(mp4|webm|ogg)$/i.test(termsBanner.termsBannerMedia) ? (
              <video
                src={`${API_BASE}${termsBanner.termsBannerMedia}`}
                controls
                className="w-64 mb-4 rounded-lg"
              />
            ) : (
              <img
                src={`${API_BASE}${termsBanner.termsBannerMedia}`}
                alt="Banner"
                className="w-64 mb-4 rounded-lg"
              />
            )
          ) : null}

          <div className="mb-3">
  {/* Hidden Input */}
  <input
    id="fileUpload"
    type="file"
    accept="image/*,video/*"
    style={{ display: "none" }}
    onChange={handleFileChange}
  />

  {/* Styled Label as Button */}
  <label
    htmlFor="fileUpload"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#0284C7", // blue
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "9999px", // pill shape
      fontWeight: "500",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
  >
    {/* Upload Icon */}
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
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
      />
    </svg>
    Upload File
  </label>
</div>


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

        {/* ================= Content ================= */}
        <Panel header="Terms & Conditions Content" key="content">
          <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <div className="mt-5">
                  <ReactQuill
                  value={termsConditionsContent?.[lang] || ""}
                  onChange={(value) =>
                    setTermsConditionsContent((prev) => ({
                      ...prev,
                      [lang]: value,
                    }))
                  }
                  style={{ minHeight: "300px", marginBottom: "20px" }}
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
    {/* Cancel Icon */}
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
    onClick={handleSaveContent}
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
      </Collapse>
    </div>
  );
};

export default TermsConditionsPage;
