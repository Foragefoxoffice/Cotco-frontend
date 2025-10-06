import React, { useState, useEffect } from "react";
import { Collapse, Button, Tabs } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { getPrivacyPage, updatePrivacyPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const translations = {
  en: {
    cancel: "Cancel",
    save: "Save",
    add: "Add New Policy",
    delete: "Delete",
  },
  vi: { cancel: "Hủy", save: "Lưu", add: "Thêm Chính Sách", delete: "Xóa" },
};

const API_BASE = import.meta.env.VITE_API_URL;

const PrivacyPage = () => {
  const [currentLang, setCurrentLang] = useState("en");
  const [privacyBanner, setPrivacyBanner] = useState({
    privacyBannerMedia: "",
    privacyBannerTitle: { en: "", vi: "" },
    privacyBannerMediaFile: null,
  });

  const [privacy, setPrivacy] = useState({ privacyPolicies: [] });

  useEffect(() => {
    getPrivacyPage().then((res) => {
      if (res.data?.privacyBanner) {
        setPrivacyBanner({
          ...res.data.privacyBanner,
          privacyBannerMediaFile: null,
        });
      }
      setPrivacy(res.data || { privacyPolicies: [] });
    });
  }, []);

  // ✅ Add new policy
  const addNewPolicy = () => {
    setPrivacy((prev) => ({
      ...prev,
      privacyPolicies: [
        ...(prev.privacyPolicies || []),
        { policyTitle: { en: "", vi: "" }, policyContent: { en: "", vi: "" } },
      ],
    }));
  };

  // ✅ Delete policy (Instantly deletes + updates DB)
  const deletePolicy = async (index) => {
    const updatedPolicies = privacy.privacyPolicies.filter(
      (_, i) => i !== index
    );
    setPrivacy({ ...privacy, privacyPolicies: updatedPolicies });

    try {
      const formData = new FormData();
      formData.append("privacyPolicies", JSON.stringify(updatedPolicies));
      const res = await updatePrivacyPage(formData);
      if (res.data?.privacy) {
        setPrivacy(res.data.privacy);
        CommonToaster("Policy deleted successfully", "success");
      }
    } catch (error) {
      CommonToaster("Error deleting policy", "error");
    }
  };

  // ✅ Save all policies
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

  // ✅ File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxVideoSize = 10 * 1024 * 1024;
    const maxImageSize = 2 * 1024 * 1024;

    if (file.type.startsWith("video/") && file.size > maxVideoSize) {
      return CommonToaster("Video must be under 10MB", "error");
    }
    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      return CommonToaster("Image must be under 2MB", "error");
    }

    setPrivacyBanner({ ...privacyBanner, privacyBannerMediaFile: file });
  };

  // ✅ Save banner
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

  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717] text-white">
      <style>{`
  .ql-editor {
    min-height: 250px;
  }

  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
    background: #fff;
  }

  .dark .ql-container.ql-snow {
    background: #171717;
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
    background: #171717;
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: 1px solid #333;
  }

  .ql-container {
    max-height: 350px;
    overflow-y: auto;
  }
`}</style>

      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Privacy Page Management
      </h2>

      <Collapse accordion bordered={false}>
        {/* ================= Banner ================= */}
        <Panel header="Privacy Banner" key="banner">
          <Tabs
            activeKey={currentLang}
            onChange={setCurrentLang}
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-2 text-white">
                  Banner Title ({lang.toUpperCase()})
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

          <label className="block mt-5 mb-1 text-white font-semibold">
            Banner Media (Image / Video)
          </label>

          {/* Preview */}
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
              backgroundColor: "#0284C7",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "9999px",
              cursor: "pointer",
            }}
          >
            Upload File
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              onClick={() => window.location.reload()}
              style={cancelBtnStyle}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBanner} style={saveBtnStyle}>
              Save
            </Button>
          </div>
        </Panel>

        {/* ================= Privacy Policies ================= */}
        <Panel header="Privacy Policies (Add Unlimited)" key="privacyPolicies">
          <Tabs
            activeKey={currentLang}
            onChange={setCurrentLang}
            className="pill-tabs"
          >
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                {privacy.privacyPolicies?.map((policy, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg p-4 mb-6 bg-[#1f1f1f]"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-white">
                        Policy #{index + 1} ({lang.toUpperCase()})
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
                        {/* 🗑️ Trash SVG Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          style={{ width: "16px", height: "16px" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7z"
                          />
                        </svg>
                        {translations[currentLang].delete}
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
              + {translations[currentLang].add}
            </button>

            <button
              onClick={handleSaveAllPolicies}
              className="transition-all duration-200 font-medium"
              style={{
                backgroundColor: "#059669",
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
              {translations[currentLang].save} All
            </button>
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
