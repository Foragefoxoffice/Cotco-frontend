import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs, Modal } from "antd";
import { RotateCw, Plus, Minus } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getTermsPage, updateTermsPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";

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
    heading: "Terms & Conditions Management",
  },
  vi: {
    cancel: "Hủy",
    save: "Lưu",
    bannerTitle: "Tiêu đề biểu ngữ",
    bannerMedia: "Biểu ngữ (Hình ảnh / Video)",
    heading: "Quản Lý Điều Khoản & Điều Kiện",
  },
};

const TermsConditionsPage = () => {
  const [currentLang, setCurrentLang] = useState("en");
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Detect Navbar language change (via body class)
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleLangChange = () => {
      setCurrentLang(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const [termsBanner, setTermsBanner] = useState({
    termsBannerMedia: "",
    termsBannerTitle: { en: "", vi: "" },
    termsBannerMediaFile: null,
  });

  const [termsConditionsContent, setTermsConditionsContent] = useState({
    en: "",
    vi: "",
  });

  const [showTermsBannerModal, setShowTermsBannerModal] = useState(false);

  // ✅ Fetch data
  useEffect(() => {
    getTermsPage().then((res) => {
      const data = res.data?.terms || res.data;
      if (data?.termsBanner) {
        setTermsBanner({ ...data.termsBanner, termsBannerMediaFile: null });
      }
      if (data?.termsConditionsContent) {
        setTermsConditionsContent(data.termsConditionsContent);
      }
      if (data?.seoMeta) {
        setSeoMeta(data.seoMeta);
      }
    });
  }, []);

  // ✅ Save Banner
  const handleSaveBanner = async () => {
    const bannerData = {
      termsBannerMedia: termsBanner.termsBannerMedia,
      termsBannerTitle: termsBanner.termsBannerTitle,
    };

    const formData = new FormData();
    formData.append("termsBanner", JSON.stringify(bannerData));

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

  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });

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

  const handleSaveSeoMeta = async () => {
    if (
      !seoMeta.metaTitle.en.trim() ||
      !seoMeta.metaTitle.vi.trim() ||
      !seoMeta.metaDescription.en.trim() ||
      !seoMeta.metaDescription.vi.trim()
    ) {
      return CommonToaster("Please fill both EN & VI in SEO fields", "error");
    }

    try {
      const formData = new FormData();
      formData.append("termsSeoMeta", JSON.stringify(seoMeta));

      // Optional OG image support
      if (seoMeta.ogImageFile instanceof File) {
        formData.append("termsSeoOgImageFile", seoMeta.ogImageFile);
      }

      const res = await updateTermsPage(formData);
      const data = res.data?.terms || res.data;

      if (data?.seoMeta) {
        setSeoMeta(data.seoMeta);
        CommonToaster("SEO Meta saved successfully", "success");
      } else {
        CommonToaster("Failed to save SEO Meta", "error");
      }
    } catch (error) {
      console.error("❌ Error saving SEO Meta:", error);
      CommonToaster("Error saving SEO Meta", "error");
    }
  };

  // ✅ Validate file size
  const validateFileSize = (file) => {
    const maxImageSize = 2 * 1024 * 1024; // 2MB
    const maxVideoSize = 10 * 1024 * 1024; // 10MB

    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      alert("❌ Image must be under 2MB");
      return false;
    }

    if (file.type.startsWith("video/") && file.size > maxVideoSize) {
      alert("❌ Video must be under 10MB");
      return false;
    }

    return true;
  };

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
    label {
          color: #fff !important;
        }
        .ant-tabs-nav::before{
          border-bottom:1px solid #2E2F2F !important;
        }
        .ant-collapse-header{
          padding:20px 0 !important;
        }
        .ant-modal-close{
          background-color:red !important;
          border-radius:50% !important;
          color:white !important;
        }
`}</style>

      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        {isVietnamese
          ? "Quản Lý Điều Khoản & Điều Kiện"
          : "Terms & Conditions Management"}
      </h2>

      <Collapse
        accordion
        bordered={false}
        className="text-white"
        defaultActiveKey={["1"]}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              backgroundColor: isActive ? "#0284C7" : "#2E2F2F",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              color: "#fff",
            }}
          >
            {isActive ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        )}
      >
        {/* ================= Banner ================= */}
        <Panel
          header={
            isVietnamese
              ? "Biểu Ngữ Điều Khoản & Điều Kiện"
              : "Terms & Conditions Banner"
          }
          key="banner"
        >
          <Tabs
            activeKey={currentLang}
            onChange={setCurrentLang}
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                key={lang}
              >
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

          <div style={{ marginBottom: "25px" }}>
            <label className="block text-white text-lg font-semibold mt-5 mb-2">
              {translations[currentLang].bannerMedia}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {isVietnamese
                ? "Kích thước khuyến nghị: 2000×1150px"
                : "Recommended Size: 2000×1150px"}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- If no media uploaded --- */}
              {!termsBanner.termsBannerMedia &&
              !termsBanner.termsBannerMediaFile ? (
                <label
                  htmlFor="termsBannerUpload"
                  className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-400 text-center px-2">
                    {isVietnamese
                      ? "Tải lên hình ảnh hoặc video"
                      : "Upload Image or Video"}
                  </span>
                </label>
              ) : (
                /* --- Preview Box --- */
                <div className="relative group w-60 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                  {termsBanner.termsBannerMediaFile ? (
                    termsBanner.termsBannerMediaFile.type.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={URL.createObjectURL(
                          termsBanner.termsBannerMediaFile
                        )}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(
                          termsBanner.termsBannerMediaFile
                        )}
                        alt="Terms Banner"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : /\.(mp4|webm|ogg)$/i.test(
                      termsBanner.termsBannerMedia
                    ) ? (
                    <video
                      src={`${API_BASE}${termsBanner.termsBannerMedia}`}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={`${API_BASE}${termsBanner.termsBannerMedia}`}
                      alt="Terms Banner"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowTermsBannerModal(true)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={isVietnamese ? "Xem toàn màn hình" : "View Full"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>

                  {/* 🔁 Change */}
                  <label
                    htmlFor="termsBannerUploadChange"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi" : "Change Media"}
                  >
                    <input
                      id="termsBannerUploadChange"
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;

                        const preview = URL.createObjectURL(file);
                        setTermsBanner((prev) => ({
                          ...prev,
                          termsBannerMediaFile: file,
                          termsBannerMediaPreview: preview,
                        }));
                      }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() => {
                      if (termsBanner.termsBannerMediaPreview)
                        URL.revokeObjectURL(
                          termsBanner.termsBannerMediaPreview
                        );
                      setTermsBanner({
                        ...termsBanner,
                        termsBannerMedia: "",
                        termsBannerMediaFile: "",
                        termsBannerMediaPreview: "",
                      });
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                    title={isVietnamese ? "Xóa" : "Remove"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Hidden Input for Upload */}
            <input
              id="termsBannerUpload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;

                const preview = URL.createObjectURL(file);
                setTermsBanner((prev) => ({
                  ...prev,
                  termsBannerMediaFile: file,
                  termsBannerMediaPreview: preview,
                }));
              }}
            />

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showTermsBannerModal}
              footer={null}
              onCancel={() => setShowTermsBannerModal(false)}
              centered
              width={700}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {termsBanner.termsBannerMediaPreview ? (
                termsBanner.termsBannerMediaFile?.type?.startsWith("video/") ? (
                  <video
                    src={termsBanner.termsBannerMediaPreview}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <img
                    src={termsBanner.termsBannerMediaPreview}
                    alt="Terms Banner Preview"
                    className="w-full h-auto rounded-lg"
                  />
                )
              ) : /\.(mp4|webm|ogg)$/i.test(termsBanner.termsBannerMedia) ? (
                <video
                  src={`${API_BASE}${termsBanner.termsBannerMedia}`}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  src={`${API_BASE}${termsBanner.termsBannerMedia}`}
                  alt="Terms Banner Preview"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </Modal>
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].save}
            </Button>
          </div>
        </Panel>

        {/* ================= Content ================= */}
        <Panel
          header={
            isVietnamese
              ? "Nội Dung Điều Khoản & Điều Kiện"
              : "Terms & Conditions Content"
          }
          key="content"
        >
          <Tabs
            activeKey={currentLang}
            onChange={setCurrentLang}
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                key={lang}
              >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].save}
            </Button>
          </div>
        </Panel>

        {/* ================= SEO META SECTION ================= */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
            </span>
          }
          key="seoMeta"
        >
          <Tabs
            activeKey={currentLang}
            onChange={setCurrentLang}
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                key={lang}
              >
                {/* Meta Title */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {lang === "vi" ? "Tiêu đề Meta" : "Meta Title"}
                </label>
                <input
                  type="text"
                  placeholder={
                    lang === "vi"
                      ? "Nhập tiêu đề Meta..."
                      : "Enter Meta Title..."
                  }
                  value={seoMeta.metaTitle?.[lang] || ""}
                  onChange={(e) =>
                    setSeoMeta({
                      ...seoMeta,
                      metaTitle: {
                        ...seoMeta.metaTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    width: "100%",
                    marginBottom: "12px",
                  }}
                />

                {/* Meta Description */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {lang === "vi" ? "Mô tả Meta" : "Meta Description"}
                </label>
                <textarea
                  placeholder={
                    lang === "vi"
                      ? "Nhập mô tả Meta (dưới 160 ký tự)..."
                      : "Enter Meta Description (under 160 chars)..."
                  }
                  rows={3}
                  value={seoMeta.metaDescription?.[lang] || ""}
                  onChange={(e) =>
                    setSeoMeta({
                      ...seoMeta,
                      metaDescription: {
                        ...seoMeta.metaDescription,
                        [lang]: e.target.value,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    width: "100%",
                    marginBottom: "12px",
                  }}
                />

                {/* ✅ Meta Keywords with Enter to Add */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                </label>

                <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#1C1C1C] border border-[#2E2F2F] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all">
                  {/* Existing tags */}
                  {seoMeta.metaKeywords?.[lang]
                    ?.split(",")
                    .map((kw) => kw.trim())
                    .filter(Boolean)
                    .map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-sm flex items-center gap-2 text-gray-200 shadow-sm"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = seoMeta.metaKeywords?.[lang]
                              ?.split(",")
                              .map((k) => k.trim())
                              .filter((k) => k && k !== kw);
                            setSeoMeta({
                              ...seoMeta,
                              metaKeywords: {
                                ...seoMeta.metaKeywords,
                                [lang]: updated.join(", "),
                              },
                            });
                          }}
                          className="text-gray-400 hover:text-red-400 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}

                  {/* Input field for new keyword */}
                  <input
                    type="text"
                    placeholder={
                      lang === "vi"
                        ? "Nhập từ khóa và nhấn Enter"
                        : "Type keyword and press Enter"
                    }
                    className="flex-1 min-w-[140px] bg-transparent outline-none border-none !text-gray-100 !placeholder-gray-500 text-sm px-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        e.preventDefault();
                        const newKeyword = e.target.value.trim();
                        const existing =
                          seoMeta.metaKeywords?.[lang]
                            ?.split(",")
                            .map((k) => k.trim())
                            .filter(Boolean) || [];
                        if (!existing.includes(newKeyword)) {
                          const updated = [...existing, newKeyword];
                          setSeoMeta({
                            ...seoMeta,
                            metaKeywords: {
                              ...seoMeta.metaKeywords,
                              [lang]: updated.join(", "),
                            },
                          });
                        }
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            {/* Cancel Button */}
            <Button
              onClick={() => window.location.reload()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "transparent",
                color: "#fff",
                border: "1px solid #333",
                padding: "22px 30px",
                borderRadius: "9999px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={handleSaveSeoMeta}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "none",
                padding: "22px 30px",
                borderRadius: "9999px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {currentLang === "vi" ? "Lưu SEO Meta" : "Save SEO Meta"}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default TermsConditionsPage;
