import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs, Divider } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getTermsPage, updateTermsPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";

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
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-white dark:bg-gray-800">

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
  }

  /* Dark mode */
  .dark .ql-toolbar.ql-snow {
    background: #1f2937 !important; /* gray-800 */
    color: #fff;
  }

  /* Content area */
  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
    background: #fff;
  }

  .dark .ql-container.ql-snow {
    background: #111827; /* gray-900 */
    color: #fff;
  }
`}</style>

      <h2 className="text-3xl font-bold mb-8 text-center">
        Terms & Conditions Management
      </h2>

      <Collapse accordion bordered={false} defaultActiveKey="banner">
        {/* ================= Banner ================= */}
        <Panel header="Terms & Conditions Banner" key="banner">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mb-2">
                  {translations[currentLang].bannerTitle}
                </label>
                <input
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

          <Divider>{translations[currentLang].bannerMedia}</Divider>

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

          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>
              {translations[currentLang].cancel}
            </Button>
            <Button type="primary" onClick={handleSaveBanner}>
              {translations[currentLang].save}
            </Button>
          </div>
        </Panel>

        {/* ================= Content ================= */}
        <Panel header="Terms & Conditions Content" key="content">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
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
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>
              {translations[currentLang].cancel}
            </Button>
            <Button type="primary" onClick={handleSaveContent}>
              {translations[currentLang].save}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default TermsConditionsPage;
