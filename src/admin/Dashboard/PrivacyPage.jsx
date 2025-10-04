import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs, Divider } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getPrivacyPage, updatePrivacyPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";

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
      <Tabs activeKey={currentLang} onChange={setCurrentLang}>
        {["en", "vi"].map((lang) => (
          <TabPane tab={lang.toUpperCase()} key={lang}>
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
              style={{ minHeight: "200px", marginBottom: "20px" }}
            />
          </TabPane>
        ))}
      </Tabs>

      <div className="flex justify-end gap-4 mt-4">
        <Button onClick={() => window.location.reload()}>
          {translations[currentLang].cancel}
        </Button>
        <Button type="primary" onClick={() => handleSave(key)}>
          {translations[currentLang].save}
        </Button>
      </div>
    </Panel>
  );

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
        Privacy Page Management
      </h2>

      <Collapse accordion bordered={false} defaultActiveKey="banner">
        {/* ================= Banner ================= */}
        <Panel header="Privacy Banner" key="banner">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mb-2">
                  {translations[currentLang].bannerTitle}
                </label>
                <input
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

          <Divider>{translations[currentLang].bannerMedia}</Divider>

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

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange} // ✅ Now checks file size
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>
              {translations[currentLang].cancel}
            </Button>
            <Button type="primary" onClick={handleSaveBanner}>
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
