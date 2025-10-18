import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs, Modal } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getPrivacyPage, updatePrivacyPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";
import { Plus, Minus, RotateCw, Trash2, X } from "lucide-react";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const translations = {
  en: {
    cancel: "Cancel",
    save: "Save",
    add: "Add New Policy",
    delete: "Delete",
    bannerMedia: "Banner Media (Image / Video)",
    recommendedSize: "Recommended Size: 2000×1150px",
  },
  vi: {
    cancel: "Hủy",
    save: "Lưu",
    add: "Thêm Chính Sách",
    delete: "Xóa",
    bannerMedia: "Phương tiện Biểu ngữ (Hình ảnh / Video)",
    recommendedSize: "Kích thước khuyến nghị: 2000×1150px",
  },
};

const validateFileSize = (file) => {
  const maxVideoSize = 10 * 1024 * 1024;
  const maxImageSize = 2 * 1024 * 1024;

  if (file.type.startsWith("video/") && file.size > maxVideoSize) {
    CommonToaster("Video must be under 10MB", "error");
    return false;
  }
  if (file.type.startsWith("image/") && file.size > maxImageSize) {
    CommonToaster("Image must be under 2MB", "error");
    return false;
  }
  return true;
};

const API_BASE = import.meta.env.VITE_API_URL;

const PrivacyPage = () => {
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [activeTabLang, setActiveTabLang] = useState("en");

  useEffect(() => {
    const checkLang = () => {
      const viMode = document.body.classList.contains("vi-mode");
      setIsVietnamese(viMode);
      setCurrentLang(viMode ? "vi" : "en");
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const [privacyBanner, setPrivacyBanner] = useState({
    privacyBannerMedia: "",
    privacyBannerTitle: { en: "", vi: "" },
    privacyBannerMediaFile: "",
  });

  const [privacy, setPrivacy] = useState({ privacyPolicies: [] });

  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });

  const [showPrivacyBannerModal, setShowPrivacyBannerModal] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    getPrivacyPage().then((res) => {
      if (res.data?.privacyBanner) {
        setPrivacyBanner({
          ...res.data.privacyBanner,
          privacyBannerMediaFile: null,
        });
      }
      setPrivacy(res.data || { privacyPolicies: [] });
      if (res.data?.seoMeta) {
        setSeoMeta({
          metaTitle: res.data.seoMeta.metaTitle || { en: "", vi: "" },
          metaDescription:
            res.data.seoMeta.metaDescription || { en: "", vi: "" },
          metaKeywords: res.data.seoMeta.metaKeywords || { en: "", vi: "" },
        });
      }
    });
  }, []);

  // ✅ ADD POLICY
  const addNewPolicy = () => {
    setPrivacy((prev) => ({
      ...prev,
      privacyPolicies: [
        ...(prev.privacyPolicies || []),
        { policyTitle: { en: "", vi: "" }, policyContent: { en: "", vi: "" } },
      ],
    }));
  };

  // ✅ DELETE POLICY
  const deletePolicy = async (index) => {
    const updatedPolicies = privacy.privacyPolicies.filter((_, i) => i !== index);
    setPrivacy({ ...privacy, privacyPolicies: updatedPolicies });

    try {
      const formData = new FormData();
      formData.append("privacyPolicies", JSON.stringify(updatedPolicies));
      const res = await updatePrivacyPage(formData);
      if (res.data?.privacy) {
        setPrivacy(res.data.privacy);
        CommonToaster("Policy deleted successfully", "success");
      }
    } catch {
      CommonToaster("Error deleting policy", "error");
    }
  };

  // ✅ SAVE ALL POLICIES
  const handleSaveAllPolicies = async () => {
    const policies = privacy.privacyPolicies;
    if (!policies.length) return CommonToaster("No policies to save", "error");

    for (let i = 0; i < policies.length; i++) {
      const p = policies[i];
      if (
        !p.policyTitle.en.trim() ||
        !p.policyTitle.vi.trim() ||
        !p.policyContent.en.trim() ||
        !p.policyContent.vi.trim()
      ) {
        return CommonToaster(`Fill EN & VI for policy #${i + 1}`, "error");
      }
    }

    const formData = new FormData();
    formData.append("privacyPolicies", JSON.stringify(policies));
    const res = await updatePrivacyPage(formData);

    if (res.data?.privacy) {
      setPrivacy(res.data.privacy);
      CommonToaster("All privacy policies saved successfully", "success");
    }
  };

  // ✅ SAVE SEO META
  const handleSaveSeoMeta = async () => {
    try {
      if (
        !seoMeta.metaTitle.en.trim() ||
        !seoMeta.metaTitle.vi.trim() ||
        !seoMeta.metaDescription.en.trim() ||
        !seoMeta.metaDescription.vi.trim()
      ) {
        return CommonToaster("Please fill both EN & VI in SEO fields", "error");
      }

      const formData = new FormData();
      formData.append("privacySeoMeta", JSON.stringify(seoMeta));

      const res = await updatePrivacyPage(formData);
      if (res.data?.privacy) {
        setSeoMeta(res.data.privacy.seoMeta);
        CommonToaster("SEO Meta saved successfully!", "success");
      } else {
        CommonToaster("Failed to save SEO Meta", "error");
      }
    } catch (err) {
      console.error("❌ handleSaveSeoMeta error:", err);
      CommonToaster(err.message || "Something went wrong", "error");
    }
  };

  // ✅ SAVE BANNER
  const handleSaveBanner = async () => {
    if (
      !privacyBanner.privacyBannerTitle.en.trim() ||
      !privacyBanner.privacyBannerTitle.vi.trim()
    ) {
      return CommonToaster("Fill both EN & VI in Banner Title", "error");
    }

    const formData = new FormData();
    formData.append("privacyBanner", JSON.stringify(privacyBanner));
    if (privacyBanner.privacyBannerMediaFile) {
      formData.append("privacyBannerMediaFile", privacyBanner.privacyBannerMediaFile);
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
  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717] text-white">
      <style>{`
  .ql-editor {
    min-height: 250px;
    color:#000 !important;
  }

  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
    background: #fff;
  }

  .ql-container.ql-snow {
    background: #ffffff;
    color: #fff;
  }

  .ant-collapse>.ant-collapse-item>.ant-collapse-header .ant-collapse-header-text {
    color:white;
    font-weight:600;
    font-size:16px;
  }

  /* ✅ Sticky Quill toolbar */
  .ql-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: 1px solid #333;
  }

  .ql-container {
    max-height: 350px;
    overflow-y: auto;
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
        {isVietnamese ? "Trang Chính sách Bảo mật" : "Privacy Page"}
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
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese ? "Biểu ngữ Chính sách Bảo mật" : "Privacy Banner"}
            </span>
          }
          key="banner"
        >
          <Tabs
            activeKey={activeTabLang} // ✅ Independent from navbar toggle
            onChange={setActiveTabLang} // ✅ Updates only when user clicks tab
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-2 text-white">
                  {activeTabLang === "vi" ? "Tiêu đề Biểu ngữ" : "Banner Title"}
                </label>

                <input
                  type="text"
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
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    width: "100%",
                  }}
                />
              </TabPane>
            ))}
          </Tabs>

          {/* 🧱 Privacy Banner Upload Section */}
          <div style={{ marginBottom: "25px" }}>
            <label className="block text-white text-lg font-semibold mt-5 mb-2">
              {translations[activeTabLang]?.bannerMedia}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[activeTabLang]?.recommendedSize}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- If no media uploaded --- */}
              {!privacyBanner.privacyBannerMedia &&
              !privacyBanner.privacyBannerMediaPreview ? (
                <label
                  htmlFor="privacyBannerUpload"
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
                    {activeTabLang === "vi"
                      ? "Tải lên hình ảnh hoặc video"
                      : "Upload Image or Video"}
                  </span>
                </label>
              ) : (
                /* --- Preview Box --- */
                <div className="relative group w-60 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                  {privacyBanner.privacyBannerMediaPreview ? (
                    privacyBanner.privacyBannerMediaFile?.type?.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={privacyBanner.privacyBannerMediaPreview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={privacyBanner.privacyBannerMediaPreview}
                        alt="Privacy Banner"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : /\.(mp4|webm|ogg)$/i.test(
                      privacyBanner.privacyBannerMedia
                    ) ? (
                    <video
                      src={`${API_BASE}${privacyBanner.privacyBannerMedia}`}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={`${API_BASE}${privacyBanner.privacyBannerMedia}`}
                      alt="Privacy Banner"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyBannerModal(true)}
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
                    htmlFor="privacyBannerUploadChange"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi" : "Change Media"}
                  >
                    <input
                      id="privacyBannerUploadChange"
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;

                        const preview = URL.createObjectURL(file);

                        setPrivacyBanner((prev) => ({
                          ...prev,
                          privacyBannerMediaFile: file,
                          privacyBannerMediaPreview: preview,
                        }));
                      }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() => {
                      if (privacyBanner.privacyBannerMediaPreview)
                        URL.revokeObjectURL(
                          privacyBanner.privacyBannerMediaPreview
                        );
                      setPrivacyBanner({
                        ...privacyBanner,
                        privacyBannerMedia: "",
                        privacyBannerMediaFile: "",
                        privacyBannerMediaPreview: "",
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

            {/* Hidden Input for First Upload */}
            <input
              id="privacyBannerUpload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;

                const preview = URL.createObjectURL(file);

                setPrivacyBanner((prev) => ({
                  ...prev,
                  privacyBannerMediaFile: file,
                  privacyBannerMediaPreview: preview,
                }));
              }}
            />

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showPrivacyBannerModal}
              footer={null}
              onCancel={() => setShowPrivacyBannerModal(false)}
              centered
              width={700}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {privacyBanner.privacyBannerMediaPreview ? (
                privacyBanner.privacyBannerMediaFile?.type?.startsWith(
                  "video/"
                ) ? (
                  <video
                    src={privacyBanner.privacyBannerMediaPreview}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <img
                    src={privacyBanner.privacyBannerMediaPreview}
                    alt="Privacy Banner Preview"
                    className="w-full h-auto rounded-lg"
                  />
                )
              ) : /\.(mp4|webm|ogg)$/i.test(
                  privacyBanner.privacyBannerMedia
                ) ? (
                <video
                  src={`${API_BASE}${privacyBanner.privacyBannerMedia}`}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  src={`${API_BASE}${privacyBanner.privacyBannerMedia}`}
                  alt="Privacy Banner Preview"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </Modal>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              onClick={() => window.location.reload()}
              style={cancelBtnStyle}
            >
              {translations[activeTabLang]?.cancel || "Cancel"}
            </Button>

            <Button onClick={handleSaveBanner} style={saveBtnStyle}>
              {translations[activeTabLang]?.save || "Save"}
            </Button>
          </div>
        </Panel>

        {/* ================= Privacy Policies ================= */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese
                ? "Chính sách bảo mật (Thêm không giới hạn)"
                : "Privacy Policies (Add Unlimited)"}
            </span>
          }
          key="privacyPolicies"
        >
          <Tabs
            activeKey={activeTabLang} // ✅ Independent from navbar toggle
            onChange={setActiveTabLang} // ✅ Updates only when user clicks tab
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                key={lang}
              >
                {privacy.privacyPolicies?.map((policy, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg p-4 mb-6 bg-[#1f1f1f]"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-white">
                        {activeTabLang === "vi"
                          ? `Chính sách #${index + 1} (${lang.toUpperCase()})`
                          : `Policy #${index + 1} (${lang.toUpperCase()})`}
                      </h4>

                      <Button
                        danger
                        size="small"
                        onClick={() => deletePolicy(index)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          borderRadius: "9999px", // pill shape
                          fontWeight: "500",
                          background: "#E50000", // red
                          color: "#fff",
                          border: "none",
                          padding: "10px 20px",
                          height: "auto",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#b80000")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#E50000")
                        }
                      >
                        <Trash2 size={15} />
                        {translations[activeTabLang].delete}
                      </Button>
                    </div>

                    {/* Title */}
                    <input
                      type="text"
                      placeholder="Policy Title"
                      value={policy.policyTitle?.[lang] || ""}
                      onChange={(e) =>
                        setPrivacy((prev) => {
                          const updated = [...prev.privacyPolicies];
                          updated[index].policyTitle = {
                            ...updated[index].policyTitle,
                            [lang]: e.target.value,
                          };
                          return { ...prev, privacyPolicies: updated };
                        })
                      }
                      style={{
                        backgroundColor: "#262626",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    />

                    {/* Content */}
                    <ReactQuill
                      value={policy.policyContent?.[lang] || ""}
                      onChange={(value) =>
                        setPrivacy((prev) => {
                          const updated = [...prev.privacyPolicies];
                          updated[index].policyContent = {
                            ...updated[index].policyContent,
                            [lang]: value,
                          };
                          return { ...prev, privacyPolicies: updated };
                        })
                      }
                      theme="snow"
                    />
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>

          {/* Add and Save Buttons */}
          <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
            <button
              onClick={addNewPolicy}
              className="transition-all duration-200 font-medium"
              style={{
                backgroundColor: "#0284C7",
                color: "#fff",
                borderRadius: "9999px",
                padding: "12px 22px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0369A1")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#0284C7")
              }
            >
              + {translations[activeTabLang].add}
            </button>

            <button
              onClick={handleSaveAllPolicies}
              className="transition-all duration-200 font-medium"
              style={{
                backgroundColor: "#0284c7",
                color: "#fff",
                borderRadius: "9999px",
                padding: "12px 22px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#047857")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#059669")
              }
            >
              {translations[activeTabLang].save} All
            </button>
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
            activeKey={activeTabLang}
            onChange={setActiveTabLang}
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

<div
  className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#1C1C1C] border border-[#2E2F2F] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all"
>
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
          <X size={12} />
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
    className="flex-1 min-w-[140px] bg-transparent outline-none border-none text-gray-100 placeholder-gray-500 text-sm px-1"
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {/* Cancel Button */}
            <Button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                border: "1px solid #333",
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {translations[activeTabLang]?.cancel || "Cancel"}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSaveSeoMeta()}
              style={{
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "none",
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {activeTabLang === "vi" ? "Lưu SEO Meta" : "Save SEO Meta"}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

const cancelBtnStyle = {
  backgroundColor: "transparent",
  color: "#fff",
  border: "1px solid #333",
  padding: "22px",
  borderRadius: "9999px",
  fontWeight: "500",
  fontSize: "14px",
  cursor: "pointer",
};

const saveBtnStyle = {
  backgroundColor: "#0284C7",
  color: "#fff",
  border: "none",
  padding: "22px",
  borderRadius: "9999px",
  fontWeight: "500",
  fontSize: "14px",
  cursor: "pointer",
};

export default PrivacyPage;
