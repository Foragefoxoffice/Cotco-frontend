// frontend/pages/CottonPage.jsx
import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Divider, Modal } from "antd";
import { Plus, Minus, RotateCw, X, Trash2 } from "lucide-react";
import { FiImage, FiUsers, FiLayers, FiShield, FiStar } from "react-icons/fi";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getCottonPage, updateCottonPage } from "../../Api/api";
import "../../assets/css/LanguageTabs.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const { Panel } = Collapse;
const { TabPane } = Tabs;

// ✅ Validation helper
const validateVietnamese = (formState) => {
  const checkObject = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if ("vi" in obj && "en" in obj) {
        return obj.vi?.trim() !== "" && obj.en?.trim() !== "";
      }
      return Object.values(obj).every((val) => checkObject(val));
    }
    return true;
  };
  return checkObject(formState);
};

// ✅ Validate file size (Image ≤ 2MB, Video ≤ 10MB)
const validateFileSize = (file) => {
  if (!file) return true;

  if (file.type.startsWith("image/") && file.size > 2 * 1024 * 1024) {
    CommonToaster("Image size must be below 2MB!", "error");
    return false;
  }

  if (file.type.startsWith("video/") && file.size > 10 * 1024 * 1024) {
    CommonToaster("Video size must be below 10MB!", "error");
    return false;
  }

  return true;
};

// ✅ File preview helper with validation
const handleImageChange = (e, setter, key) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!validateFileSize(file)) return; // ✅ run validation

  setter((prev) => ({
    ...prev,
    [key + "File"]: file,
    preview: URL.createObjectURL(file), // works for both img & video
  }));
};

// ✅ API base
const API_BASE = import.meta.env.VITE_API_URL;
const getFullUrl = (path) => {
  if (!path) return "";

  // ✅ If it's an array, use the first item
  if (Array.isArray(path)) {
    path = path[0];
  }

  // ✅ If it's an object with a url or src property
  if (typeof path === "object" && path !== null) {
    path = path.url || path.src || "";
  }

  // ✅ Ensure it’s a string before using startsWith
  if (typeof path !== "string") return "";

  // ✅ Trim in case the backend returns spaces
  path = path.trim();

  // ✅ Handle external and relative URLs
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  return `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;
};

const CottonPage = () => {
  // const { theme } = useTheme();
  // 🔹 Track current site language (used only for titles & headers)
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  // 🔹 Form editing tab language (independent)
  const [activeTabLang, setActiveTabLang] = useState("en");

  // Watch body class (.vi-mode) to update only UI labels
  useEffect(() => {
    const updateLang = () => {
      const viMode = document.body.classList.contains("vi-mode");
      setIsVietnamese(viMode);
      setCurrentLang(viMode ? "vi" : "en"); // UI text updates
    };

    updateLang();
    const observer = new MutationObserver(updateLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const [showHeroModal, setShowHeroModal] = useState(false);
  const [activeSlideModal, setActiveSlideModal] = useState(null);
  const [supplierBgModal, setSupplierBgModal] = useState(null);
  const [supplierLogoModal, setSupplierLogoModal] = useState(null);
  const [trustLogoModal, setTrustLogoModal] = useState(null);
  const [memberImgModal, setMemberImgModal] = useState(null);
  const [addTeamModal, setAddTeamModal] = useState(false);
  const [tempTeamTitle, setTempTeamTitle] = useState({ en: "", vi: "" });

  const translations = {
    en: {
      pageTitle: "Cotton Page Management",

      // Common
      cancel: "Cancel",
      save: "Save",
      remove: "Remove",
      add: "Add",
      title: "Title",
      description: "Description",
      buttonText: "Button Text",
      buttonLink: "Button Link",
      recommendedHero: "Recommended: 1260×660px (Image) | Max Video Size: 10MB",
      recommended: "Recommended Size: ",

      // Banner
      banner: "Banner",
      bannerMedia: "Banner Media (Image or Video)",
      bannerSlides: "Banner Slide Images",
      saveBanner: "Save Banner",

      // Suppliers
      suppliers: "Suppliers",
      logoName: "Logo Name",
      background: "Background",
      logo: "Logo",
      removeSupplier: "Remove Supplier",
      addSupplier: "Add Supplier",
      saveSuppliers: "Save Suppliers",

      // Trust
      trust: "Trust",
      logos: "Logos",
      trustImage: "Trust Image",
      saveTrust: "Save Trust",

      // Member
      member: "Member",
      memberImages: "Member Images",
      saveMember: "Save Member",
    },

    vi: {
      pageTitle: "Quản lý Trang Bông",

      // Common
      cancel: "Hủy",
      save: "Lưu",
      remove: "Xóa",
      add: "+ Thêm",
      title: "Tiêu đề",
      description: "Mô tả",
      buttonText: "Nút",
      buttonLink: "Liên kết nút",
      recommendedHero:
        "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",
      recommended: "Kích thước đề xuất: ",
      // Banner
      banner: "Banner",
      bannerMedia: "Banner (Hình ảnh hoặc Video)",
      bannerSlides: "Hình ảnh Slide Banner",
      saveBanner: "Lưu Banner",

      // Suppliers
      suppliers: "Nhà cung cấp",
      logoName: "Tên Logo",
      background: "Nền",
      logo: "Logo",
      removeSupplier: "Xóa Nhà cung cấp",
      addSupplier: "+ Thêm Nhà cung cấp",
      saveSuppliers: "Lưu Nhà cung cấp",

      // Trust
      trust: "Tin cậy",
      logos: "Logo",
      trustImage: "Hình ảnh Tin cậy",
      saveTrust: "Lưu Tin cậy",

      // Member
      member: "Thành viên",
      memberImages: "Hình ảnh Thành viên",
      saveMember: "Lưu Thành viên",
    },
  };

  // ---------------------- STATES ---------------------- //
  const [cottonBanner, setCottonBanner] = usePersistedState("cottonBanner", {
    cottonBannerImg: "",
    cottonBannerImgFile: null,
    cottonBannerTitle: { en: "", vi: "" },
    cottonBannerDes: { en: "", vi: "" },
    cottonBannerOverview: { en: "", vi: "" },
    cottonBannerSlideImg: "",
    cottonBannerSlideImgFile: null,
  });

  const [cottonSupplier, setCottonSupplier] = usePersistedState(
    "cottonSupplier",
    []
  );

  const [cottonTrust, setCottonTrust] = usePersistedState("cottonTrust", {
    cottonTrustTitle: { en: "", vi: "" },
    cottonTrustDes: { en: "", vi: "" },
    cottonTrustLogo: [],
    cottonTrustLogoFiles: [],
    cottonTrustImg: "",
    cottonTrustImgFile: null,
  });

  const [cottonMember, setCottonMember] = usePersistedState("cottonMember", {
    cottonMemberTitle: { en: "", vi: "" },
    cottonMemberButtonText: { en: "", vi: "" },
    // cottonMemberButtonLink: "",
    cottonMemberImg: [],
    cottonMemberImgFiles: [],
  });

  const [cottonTeam, setCottonTeam] = usePersistedState("cottonTeam", {
    aboutTeamIntro: {
      tag: { en: "", vi: "" },
      heading: { en: "", vi: "" },
      description: { en: "", vi: "" },
    },
    aboutTeam: {},
  });

  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });

  // ---------------------- FETCH ---------------------- //
  useEffect(() => {
    getCottonPage()
      .then((res) => {
        const data = res.data || {};

        // ✅ SEO META
        if (data.seoMeta) {
          setSeoMeta(data.seoMeta);
        }

        // ✅ BANNER SECTION
        if (data.cottonBanner) {
          const banner = data.cottonBanner;

          setCottonBanner((prev) => ({
            ...prev,

            cottonBannerTitle: {
              en:
                typeof banner?.cottonBannerTitle === "object"
                  ? banner.cottonBannerTitle.en || ""
                  : banner?.cottonBannerTitle || "",
              vi:
                typeof banner?.cottonBannerTitle === "object"
                  ? banner.cottonBannerTitle.vi || ""
                  : banner?.cottonBannerTitle || "",
            },

            cottonBannerDes: {
              en:
                typeof banner?.cottonBannerDes === "object"
                  ? banner.cottonBannerDes.en || ""
                  : banner?.cottonBannerDes || "",
              vi:
                typeof banner?.cottonBannerDes === "object"
                  ? banner.cottonBannerDes.vi || ""
                  : banner?.cottonBannerDes || "",
            },

            cottonBannerOverview: {
              en:
                typeof banner?.cottonBannerOverview === "object"
                  ? banner.cottonBannerOverview.en || ""
                  : banner?.cottonBannerOverview || "",
              vi:
                typeof banner?.cottonBannerOverview === "object"
                  ? banner.cottonBannerOverview.vi || ""
                  : banner?.cottonBannerOverview || "",
            },

            cottonBannerImg:
              typeof banner?.cottonBannerImg === "string"
                ? banner.cottonBannerImg
                : banner?.cottonBannerImg?.url || "",

            cottonBannerSlideImg: Array.isArray(banner?.cottonBannerSlideImg)
              ? banner.cottonBannerSlideImg
              : banner?.cottonBannerSlideImg
              ? [banner.cottonBannerSlideImg]
              : [],

            cottonBannerImgFile: prev.cottonBannerImgFile || null,
            cottonBannerSlideImgFiles: prev.cottonBannerSlideImgFiles || [],
          }));
        }

        // ✅ SUPPLIER SECTION
        if (data.cottonSupplier) {
          setCottonSupplier(data.cottonSupplier || []);
        }

        // ✅ TRUST SECTION
        if (data.cottonTrust) {
          const trust = data.cottonTrust;
          setCottonTrust((prev) => ({
            ...prev,
            ...trust,
            cottonTrustLogo: trust.cottonTrustLogo || [],
            cottonTrustLogoFiles: prev.cottonTrustLogoFiles || [],
            cottonTrustImgFile: prev.cottonTrustImgFile || null,
          }));
        }

        // ✅ MEMBER SECTION
        if (data.cottonMember) {
          const member = data.cottonMember;
          setCottonMember((prev) => ({
            ...prev,
            ...member,
            cottonMemberImg: member.cottonMemberImg || [],
            cottonMemberImgFiles: prev.cottonMemberImgFiles || [],
          }));
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch cotton page:", err);
      });
  }, []);

  // ---------------------- SAVE HANDLER ---------------------- //
  const handleSave = async (sectionName, formState, files = []) => {
    try {
      if (!validateVietnamese(formState)) {
        CommonToaster(
          "Please fill both English and Vietnamese fields.",
          "error"
        );
        return;
      }

      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(formState));

      // Special case: suppliers (array with per-index files)
      if (sectionName === "cottonSupplier") {
        formState.forEach((s, i) => {
          if (s.cottonSupplierLogoFile instanceof File) {
            formData.append(
              `cottonSupplierLogoFile${i}`,
              s.cottonSupplierLogoFile
            );
          }
          if (s.cottonSupplierBgFile instanceof File) {
            formData.append(`cottonSupplierBgFile${i}`, s.cottonSupplierBgFile); // ✅ NEW
          }
        });
      } else {
        // normal flow for other sections
        files.forEach((fileKey) => {
          if (Array.isArray(formState[fileKey])) {
            formState[fileKey].forEach((file) => {
              if (file instanceof File) formData.append(fileKey, file);
            });
          } else if (formState[fileKey] instanceof File) {
            formData.append(fileKey, formState[fileKey]);
          }
        });
      }

      const res = await updateCottonPage(formData);

      if (res.data?.cotton) {
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (error) {
      CommonToaster("Error", error.message || "Something went wrong!");
    }
  };

  const instantSave = async (sectionName, formState, files = []) => {
    try {
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(formState));

      // append files if any
      files.forEach((fileKey) => {
        if (Array.isArray(formState[fileKey])) {
          formState[fileKey].forEach((file) => {
            if (file instanceof File) formData.append(fileKey, file);
          });
        } else if (formState[fileKey] instanceof File) {
          formData.append(fileKey, formState[fileKey]);
        }
      });

      const res = await updateCottonPage(formData);
      if (res.data?.cotton?.[sectionName]) {
        CommonToaster(`${sectionName} deleted successfully!`, "success");
      } else {
        CommonToaster(`Failed to update ${sectionName}`, "error");
      }
    } catch (err) {
      CommonToaster("Error", err.message || "Something went wrong!");
    }
  };

  // ---------------------- UI ---------------------- //
  return (
    <div className="max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717] text-white">
      <style>{`
  .ql-editor {
    min-height: 250px;
  }

  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .ql-container.ql-snow {
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
      <h2 className="text-4xl font-extrabold mb-10 text-center text-white">
        {isVietnamese ? "Trang Bông" : "Cotton Page"}
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
        {/* 1. Banner */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese ? "Biểu ngữ" : "Banner"}
            </span>
          }
          key="1"
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[lang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={cottonBanner.cottonBannerTitle[lang]}
                  onChange={(e) =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerTitle: {
                        ...cottonBanner.cottonBannerTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-1">
                  {translations[lang].description}
                </label>
                <Input
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={cottonBanner.cottonBannerDes[lang]}
                  onChange={(e) =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerDes: {
                        ...cottonBanner.cottonBannerDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* 🖼 Hero Background Upload */}
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mt-5 mb-2">
              {activeTabLang === "vi"
                ? "Hình nền Hero / Video"
                : "Hero Background Image / Video"}
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="flex flex-wrap gap-4 mt-2">
              {!cottonBanner.cottonBannerImgFile &&
              !cottonBanner.cottonBannerImg ? (
                <label
                  htmlFor="cottonBannerUpload"
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-center text-gray-400">
                    {isVietnamese
                      ? "Tải lên hình hoặc video"
                      : "Upload Image or Video"}
                  </span>
                  <input
                    id="cottonBannerUpload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setCottonBanner({
                        ...cottonBanner,
                        cottonBannerImgFile: file,
                        cottonBannerImg: "",
                        preview: URL.createObjectURL(file),
                        type: file.type.startsWith("video/")
                          ? "video"
                          : "image",
                      });
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                <div className="relative w-32 h-32 group">
                  {cottonBanner.cottonBannerImgFile ? (
                    cottonBanner.cottonBannerImgFile.type.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={URL.createObjectURL(
                          cottonBanner.cottonBannerImgFile
                        )}
                        className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                        muted
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(
                          cottonBanner.cottonBannerImgFile
                        )}
                        alt="Hero Preview"
                        className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                      />
                    )
                  ) : cottonBanner.cottonBannerImg?.match(
                      /\.(mp4|webm|ogg)$/i
                    ) ? (
                    <video
                      src={getFullUrl(cottonBanner.cottonBannerImg)}
                      className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                      muted
                    />
                  ) : (
                    <img
                      src={getFullUrl(cottonBanner.cottonBannerImg)}
                      alt="Hero Background"
                      className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                    />
                  )}

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowHeroModal(true)}
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
                    htmlFor="changeCottonUpload"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi" : "Change File"}
                  >
                    <input
                      id="changeCottonUpload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setCottonBanner({
                          ...cottonBanner,
                          cottonBannerImgFile: file,
                          cottonBannerImg: "",
                          preview: URL.createObjectURL(file),
                          type: file.type.startsWith("video/")
                            ? "video"
                            : "image",
                        });
                      }}
                      style={{ display: "none" }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      setCottonBanner({
                        ...cottonBanner,
                        cottonBannerImg: "",
                        cottonBannerImgFile: null,
                        preview: "",
                        type: "",
                      })
                    }
                    className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                    title={isVietnamese ? "Xóa" : "Remove File"}
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

            {/* 🖼 Modal for Full Preview */}
            <Modal
              open={showHeroModal}
              footer={null}
              onCancel={() => setShowHeroModal(false)}
              centered
              width={700}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {cottonBanner.cottonBannerImgFile ? (
                cottonBanner.cottonBannerImgFile.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(cottonBanner.cottonBannerImgFile)}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(cottonBanner.cottonBannerImgFile)}
                    alt="Full Banner Preview"
                    className="w-full h-auto rounded-lg"
                  />
                )
              ) : cottonBanner.cottonBannerImg?.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={getFullUrl(cottonBanner.cottonBannerImg)}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  src={getFullUrl(cottonBanner.cottonBannerImg)}
                  alt="Full Banner"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </Modal>
          </div>

          {/* ================= Banner Slide (Single Image + Preview Modal) ================= */}
          <label className="block font-medium mt-5 mb-1">
            {translations[activeTabLang].bannerSlides}
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommended} 750×750px
          </p>

          <div className="flex flex-wrap gap-4 mt-3">
            {cottonBanner.cottonBannerSlideImgFiles?.length > 0 ? (
              // 🔹 Show new unsaved slide file
              <div className="relative group w-32 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                <img
                  src={URL.createObjectURL(
                    cottonBanner.cottonBannerSlideImgFiles[0]
                  )}
                  alt="Banner Slide"
                  className="w-full h-full object-contain p-2"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() => setActiveSlideModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Xem toàn màn hình" : "View Full"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
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
                  htmlFor="cottonBannerSlideUpload"
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Thay đổi" : "Change"}
                >
                  <input
                    id="cottonBannerSlideUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setCottonBanner({
                        ...cottonBanner,
                        cottonBannerSlideImgFiles: [file], // ✅ replace
                        cottonBannerSlideImg: [], // clear old
                      });
                    }}
                  />
                  <RotateCw size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerSlideImgFiles: [],
                      cottonBannerSlideImg: [],
                    })
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white py-0 px-1 rounded-full transition cursor-pointer"
                  title={isVietnamese ? "Xóa" : "Remove"}
                >
                  ✕
                </button>
              </div>
            ) : cottonBanner.cottonBannerSlideImg?.length > 0 ? (
              // 🔹 Show saved image from DB
              <div className="relative group w-32 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                <img
                  src={getFullUrl(cottonBanner.cottonBannerSlideImg[0])}
                  alt="Banner Slide"
                  className="w-full h-full object-contain p-2"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() => setActiveSlideModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title={isVietnamese ? "Xem toàn màn hình" : "View Full"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
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
                  htmlFor="cottonBannerSlideUpload"
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Thay đổi" : "Change"}
                >
                  <input
                    id="cottonBannerSlideUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setCottonBanner({
                        ...cottonBanner,
                        cottonBannerSlideImgFiles: [file],
                        cottonBannerSlideImg: [],
                      });
                    }}
                  />
                  <RotateCw size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerSlideImgFiles: [],
                      cottonBannerSlideImg: [],
                    })
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                  title={isVietnamese ? "Xóa" : "Remove"}
                >
                  ✕
                </button>
              </div>
            ) : (
              // 🔹 Empty Upload Box
              <label
                htmlFor="cottonBannerSlideUpload"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                  {isVietnamese ? "Thêm hình slide" : "Add Slide Image"}
                </span>
                <input
                  id="cottonBannerSlideUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerSlideImgFiles: [file],
                      cottonBannerSlideImg: [],
                    });
                  }}
                />
              </label>
            )}
          </div>

          {/* 🖼 Full Preview Modal */}
          <Modal
            open={!!activeSlideModal}
            footer={null}
            onCancel={() => setActiveSlideModal(false)}
            centered
            width={500}
            bodyStyle={{ background: "#000", padding: "0" }}
          >
            {cottonBanner.cottonBannerSlideImgFiles?.length > 0 ? (
              <img
                src={URL.createObjectURL(
                  cottonBanner.cottonBannerSlideImgFiles[0]
                )}
                alt="Slide Preview"
                className="w-full h-auto rounded-lg"
              />
            ) : cottonBanner.cottonBannerSlideImg?.length > 0 ? (
              <img
                src={getFullUrl(cottonBanner.cottonBannerSlideImg[0])}
                alt="Slide Preview"
                className="w-full h-auto rounded-lg"
              />
            ) : null}
          </Modal>

          {/* 📝 Banner Overview (ReactQuill) */}
          <label className="block font-medium mt-8 mb-2">
            {isVietnamese ? "Tổng quan Biểu ngữ" : "Banner Overview"}
          </label>

          {/* Language Tabs for Overview Editor */}
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
                <ReactQuill
                  theme="snow"
                  value={cottonBanner.cottonBannerOverview?.[lang] || ""}
                  onChange={(value) =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerOverview: {
                        ...cottonBanner.cottonBannerOverview,
                        [lang]: value,
                      },
                    })
                  }
                  placeholder={
                    lang === "en"
                      ? "Write banner overview here..."
                      : "Viết mô tả tổng quan về biểu ngữ..."
                  }
                  style={{
                    backgroundColor: "#171717",
                    color: "#fff",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "clean"],
                    ],
                  }}
                />
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end mt-6 gap-4">
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("cottonBanner", cottonBanner, [
                  "cottonBannerImgFile",
                  "cottonBannerSlideImgFiles",
                ])
              }
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].saveBanner}
            </Button>
          </div>
        </Panel>

        {/* 3. Supplier */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese ? "Nhà cung cấp" : "Suppliers"}
            </span>
          }
          key="3"
        >
          {cottonSupplier.map((s, idx) => (
            <div key={idx} className=" rounded mb-4 ">
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
                    <label className="block font-medium mt-5 mb-1">
                      {translations[activeTabLang].title}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#171717",
                        border: "1px solid #2d2d2d",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      value={s.cottonSupplierTitle?.[lang]}
                      onChange={(e) => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierTitle = {
                          ...s.cottonSupplierTitle,
                          [lang]: e.target.value,
                        };
                        setCottonSupplier(newArr);
                      }}
                    />
                    <label className="block font-medium mt-5 mb-3">
                      {translations[activeTabLang].logoName}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#171717",
                        border: "1px solid #2d2d2d",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      value={s.cottonSupplierLogoName?.[lang]}
                      onChange={(e) => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierLogoName = {
                          ...s.cottonSupplierLogoName,
                          [lang]: e.target.value,
                        };
                        setCottonSupplier(newArr);
                      }}
                    />
                    <label className="block font-medium mt-5 mb-1">
                      {translations[activeTabLang].description}
                    </label>
                    {(s.cottonSupplierDes || []).map((desc, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 mb-2">
                        <Input
                          style={{
                            backgroundColor: "#171717",
                            border: "1px solid #2d2d2d",
                            borderRadius: "8px",
                            color: "#fff",
                            padding: "10px 14px",
                            fontSize: "14px",
                            transition: "all 0.3s ease",
                          }}
                          value={desc[lang]}
                          onChange={(e) => {
                            const newArr = [...cottonSupplier];
                            const descArr = [...(s.cottonSupplierDes || [])];
                            descArr[dIdx] = {
                              ...descArr[dIdx],
                              [lang]: e.target.value,
                            };
                            newArr[idx].cottonSupplierDes = descArr;
                            setCottonSupplier(newArr);
                          }}
                        />
                        <Button
                          onClick={async () => {
                            const newArr = [...cottonSupplier];
                            const descArr = newArr[
                              idx
                            ].cottonSupplierDes.filter((_, i) => i !== dIdx);
                            newArr[idx].cottonSupplierDes = descArr;
                            setCottonSupplier(newArr);

                            await instantSave("cottonSupplier", newArr);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#FB2C36",
                            border: "1px solid #333",
                            color: "#fff",
                            borderRadius: "10px",
                            padding: "0",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            width: "40px",
                          }}
                        >
                          <Trash2 color="white" size={14} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      onClick={() => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierDes = [
                          ...(newArr[idx].cottonSupplierDes || []),
                          { en: "", vi: "" },
                        ];
                        setCottonSupplier(newArr);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        backgroundColor: "#0284C7", // blue
                        color: "#fff",
                        border: "none",
                        padding: "22px 30px",
                        borderRadius: "9999px", // pill shape
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* ➕ Icon (Optional) */}
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {translations[activeTabLang].add}
                    </Button>
                  </TabPane>
                ))}
              </Tabs>

              {/* ================= Supplier Background (Single Image Upload) ================= */}
              <label className="block font-bold mt-5 mb-1">
                {translations[activeTabLang].background}
              </label>
              <p className="text-sm text-slate-500 mb-2">
                {translations[activeTabLang].recommended} 2000×1150px
              </p>

              <div className="flex flex-wrap gap-4 mt-3">
                {/* --- If an image exists (from DB or local) --- */}
                {s.cottonSupplierBgFile instanceof File ||
                s.cottonSupplierBg ? (
                  <div className="relative group w-40 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                    <img
                      src={
                        s.cottonSupplierBgFile
                          ? URL.createObjectURL(s.cottonSupplierBgFile)
                          : getFullUrl(s.cottonSupplierBg)
                      }
                      alt="Supplier Background"
                      className="w-full h-full object-cover rounded-lg"
                    />

                    {/* 👁 View Full */}
                    <button
                      type="button"
                      onClick={() => setSupplierBgModal(idx)}
                      className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title={isVietnamese ? "Xem hình" : "View Full"}
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
                      htmlFor={`changeSupplierBg-${idx}`}
                      className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                      title={isVietnamese ? "Thay đổi" : "Change Image"}
                    >
                      <input
                        id={`changeSupplierBg-${idx}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!validateFileSize(file)) return;
                          const newArr = [...cottonSupplier];
                          newArr[idx].cottonSupplierBgFile = file;
                          newArr[idx].cottonSupplierBg = "";
                          setCottonSupplier(newArr);
                        }}
                        style={{ display: "none" }}
                      />
                      <RotateCw size={14} />
                    </label>

                    {/* ❌ Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierBg = "";
                        newArr[idx].cottonSupplierBgFile = null;
                        setCottonSupplier(newArr);
                      }}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full  transition cursor-pointer"
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
                ) : (
                  // --- Upload Box (Empty) ---
                  <label
                    htmlFor={`supplierBgUpload-${idx}`}
                    className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                        ? "Thêm hình nền"
                        : "Add Supplier Background"}
                    </span>
                  </label>
                )}

                <input
                  id={`supplierBgUpload-${idx}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;
                    const newArr = [...cottonSupplier];
                    newArr[idx].cottonSupplierBgFile = file;
                    newArr[idx].cottonSupplierBg = "";
                    setCottonSupplier(newArr);
                  }}
                />
              </div>

              {/* 🖼 Full Preview Modal (Dedicated) */}
              <Modal
                open={supplierBgModal === idx}
                footer={null}
                onCancel={() => setSupplierBgModal(null)}
                centered
                width={600}
                bodyStyle={{ background: "#000", padding: "0" }}
              >
                {s.cottonSupplierBgFile ? (
                  <img
                    src={URL.createObjectURL(s.cottonSupplierBgFile)}
                    alt="Supplier Background Preview"
                    className="w-full h-auto rounded-lg"
                  />
                ) : s.cottonSupplierBg ? (
                  <img
                    src={getFullUrl(s.cottonSupplierBg)}
                    alt="Supplier Background"
                    className="w-full h-auto rounded-lg"
                  />
                ) : null}
              </Modal>

              {/* ================= Supplier Logo (Single Image Upload) ================= */}
              <label className="block font-bold mt-5 mb-1">
                {translations[activeTabLang].logo}
              </label>
              <p className="text-sm text-slate-500 mb-2">
                {translations[activeTabLang].recommended} 200×200px
              </p>

              <div className="flex flex-wrap gap-4 mt-3">
                {/* --- If a logo exists (from DB or local) --- */}
                {s.cottonSupplierLogoFile instanceof File ||
                s.cottonSupplierLogo ? (
                  <div className="relative group w-32 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                    <img
                      src={
                        s.cottonSupplierLogoFile
                          ? URL.createObjectURL(s.cottonSupplierLogoFile)
                          : getFullUrl(s.cottonSupplierLogo)
                      }
                      alt="Supplier Logo"
                      className="w-full h-full object-contain p-2"
                    />

                    {/* 👁 View Full */}
                    <button
                      type="button"
                      onClick={() => setSupplierLogoModal(idx)}
                      className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title={isVietnamese ? "Xem hình" : "View Full"}
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
                      htmlFor={`changeSupplierLogo-${idx}`}
                      className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                      title={isVietnamese ? "Thay đổi" : "Change Logo"}
                    >
                      <input
                        id={`changeSupplierLogo-${idx}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!validateFileSize(file)) return;
                          const newArr = [...cottonSupplier];
                          newArr[idx].cottonSupplierLogoFile = file;
                          newArr[idx].cottonSupplierLogo = "";
                          setCottonSupplier(newArr);
                        }}
                        style={{ display: "none" }}
                      />
                      <RotateCw size={14} />
                    </label>

                    {/* ❌ Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierLogo = "";
                        newArr[idx].cottonSupplierLogoFile = null;
                        setCottonSupplier(newArr);
                      }}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
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
                ) : (
                  // --- Upload Box (Empty) ---
                  <label
                    htmlFor={`supplierLogoUpload-${idx}`}
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                      {isVietnamese ? "Thêm logo" : "Add Supplier Logo"}
                    </span>
                  </label>
                )}

                <input
                  id={`supplierLogoUpload-${idx}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;
                    const newArr = [...cottonSupplier];
                    newArr[idx].cottonSupplierLogoFile = file;
                    newArr[idx].cottonSupplierLogo = "";
                    setCottonSupplier(newArr);
                  }}
                />
              </div>

              {/* 🖼 Full Preview Modal (Dedicated) */}
              <Modal
                open={supplierLogoModal === idx}
                footer={null}
                onCancel={() => setSupplierLogoModal(null)}
                centered
                width={500}
                bodyStyle={{ background: "#000", padding: "0" }}
              >
                {s.cottonSupplierLogoFile ? (
                  <img
                    src={URL.createObjectURL(s.cottonSupplierLogoFile)}
                    alt="Supplier Logo Preview"
                    className="w-full h-auto rounded-lg"
                  />
                ) : s.cottonSupplierLogo ? (
                  <img
                    src={getFullUrl(s.cottonSupplierLogo)}
                    alt="Supplier Logo"
                    className="w-full h-auto rounded-lg"
                  />
                ) : null}
              </Modal>

              <Button
                onClick={async () => {
                  const newArr = cottonSupplier.filter((_, i) => i !== idx);
                  setCottonSupplier(newArr);
                  await instantSave("cottonSupplier", newArr); // instantly update DB
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#FB2C36", // black
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "22px 30px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  marginTop: "20px",
                }}
              >
                <Trash2 size={16} />

                {translations[activeTabLang].removeSupplier}
              </Button>
            </div>
          ))}

          <Button
            onClick={() =>
              setCottonSupplier([
                ...cottonSupplier,
                {
                  cottonSupplierTitle: { en: "", vi: "" },
                  cottonSupplierLogoName: { en: "", vi: "" },
                  cottonSupplierDes: [{ en: "", vi: "" }],
                  cottonSupplierLogo: "",
                  cottonSupplierLogoFile: null,
                },
              ])
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#0284C7", // same blue
              color: "#fff",
              border: "none",
              padding: "22px 30px",
              borderRadius: "9999px", // pill shape
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {/* ➕ Plus Icon */}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            {translations[activeTabLang].addSupplier}
          </Button>

          <div className="flex justify-end mt-6 gap-4">
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() => handleSave("cottonSupplier", cottonSupplier)}
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].saveSuppliers}
            </Button>
          </div>
        </Panel>

        {/* 4. Trust */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese ? "Tin cậy" : "Trust"}
            </span>
          }
          key="4"
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={cottonTrust.cottonTrustTitle[lang]}
                  onChange={(e) =>
                    setCottonTrust({
                      ...cottonTrust,
                      cottonTrustTitle: {
                        ...cottonTrust.cottonTrustTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-1">
                  {translations[activeTabLang].description}
                </label>
                <Input
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={cottonTrust.cottonTrustDes[lang]}
                  onChange={(e) =>
                    setCottonTrust({
                      ...cottonTrust,
                      cottonTrustDes: {
                        ...cottonTrust.cottonTrustDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <h3 className="text-white text-md !mt-5">
            {translations[activeTabLang].logo}
          </h3>
          {/* ================= TRUST LOGOS (Multiple Upload) ================= */}
          <label className="block font-bold mt-5 mb-1">
            {translations[activeTabLang].trustLogos}
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommended} 180×180px
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
            {/* --- Saved Logos from DB --- */}
            {(cottonTrust.cottonTrustLogo || []).map((logo, idx) => (
              <div
                key={`saved-${idx}`}
                className="relative group w-32 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
              >
                <img
                  src={getFullUrl(logo)}
                  alt={`Trust Logo ${idx + 1}`}
                  className="w-full h-full object-contain p-2"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() =>
                    setTrustLogoModal({ type: "saved", index: idx })
                  }
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Xem hình" : "View Full"}
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
                  htmlFor={`changeTrustLogo-${idx}`}
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  title={isVietnamese ? "Thay đổi" : "Change Logo"}
                >
                  <input
                    id={`changeTrustLogo-${idx}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      const updatedFiles = [
                        ...cottonTrust.cottonTrustLogoFiles,
                        file,
                      ];
                      setCottonTrust({
                        ...cottonTrust,
                        cottonTrustLogoFiles: updatedFiles,
                      });
                    }}
                    style={{ display: "none" }}
                  />
                  <RotateCw size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={async () => {
                    const newLogos = cottonTrust.cottonTrustLogo.filter(
                      (_, i) => i !== idx
                    );
                    const updated = {
                      ...cottonTrust,
                      cottonTrustLogo: newLogos,
                    };
                    setCottonTrust(updated);
                    await instantSave("cottonTrust", updated);
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full  transition cursor-pointer"
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
            ))}

            {/* --- New Uploads (Previews) --- */}
            {(cottonTrust.cottonTrustLogoFiles || []).map((file, idx) => (
              <div
                key={`new-${idx}`}
                className="relative group w-32 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New Trust Logo ${idx + 1}`}
                  className="w-full h-full object-contain p-2"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() => setTrustLogoModal({ type: "new", index: idx })}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Xem hình" : "View Full"}
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

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setCottonTrust({
                      ...cottonTrust,
                      cottonTrustLogoFiles:
                        cottonTrust.cottonTrustLogoFiles.filter(
                          (_, i) => i !== idx
                        ),
                    })
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
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
            ))}

            {/* --- Upload Box --- */}
            <label
              htmlFor="cottonTrustLogosUpload"
              className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                {activeTabLang === "vi" ? "Thêm logo" : "Add Logo"}
              </span>
            </label>

            {/* Hidden Input */}
            <input
              id="cottonTrustLogosUpload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const validFiles = Array.from(e.target.files).filter(
                  validateFileSize
                );
                if (validFiles.length !== e.target.files.length) {
                  CommonToaster(
                    "Some logos were too large (max 2MB) and skipped.",
                    "error"
                  );
                }
                setCottonTrust({
                  ...cottonTrust,
                  cottonTrustLogoFiles: [
                    ...(cottonTrust.cottonTrustLogoFiles || []),
                    ...validFiles,
                  ],
                });
              }}
            />
          </div>

          {/* 🖼 Full Preview Modal */}
          <Modal
            open={!!trustLogoModal}
            footer={null}
            onCancel={() => setTrustLogoModal(null)}
            centered
            width={500}
            bodyStyle={{ background: "#000", padding: "0" }}
          >
            {trustLogoModal && (
              <img
                src={
                  trustLogoModal.type === "saved"
                    ? getFullUrl(
                        cottonTrust.cottonTrustLogo[trustLogoModal.index]
                      )
                    : URL.createObjectURL(
                        cottonTrust.cottonTrustLogoFiles[trustLogoModal.index]
                      )
                }
                alt="Trust Logo Preview"
                className="w-full h-auto rounded-lg"
              />
            )}
          </Modal>

          {/* <label className="font-bold block mt-5 mb-1">
            {translations[currentLang].trustImage}
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommended} 430×430px
          </p>
          {cottonTrust.preview ? (
            <img
              src={cottonTrust.preview}
              alt="trust-preview"
              className="w-48 mb-2"
            />
          ) : cottonTrust.cottonTrustImg ? (
            <img
              src={getFullUrl(cottonTrust.cottonTrustImg)}
              alt="trust"
              className="w-48 mb-2"
            />
          ) : null}
          <div className="mb-4">
            <input
              id="cottonTrustImgUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                handleImageChange(e, setCottonTrust, "cottonTrustImg")
              }
            />

            <label
              htmlFor="cottonTrustImgUpload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7", 
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "9999px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              
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
              Upload Trust Image
            </label>
          </div> */}

          <div className="flex justify-end mt-6 gap-4">
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("cottonTrust", cottonTrust, [
                  "cottonTrustImgFile",
                  "cottonTrustLogoFiles",
                ])
              }
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].saveTrust}
            </Button>
          </div>
        </Panel>

        {/* 5. Certification */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white font-semibold text-lg">
              {isVietnamese ? "Chứng nhận" : "Certification"}
            </span>
          }
          key="5"
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={cottonMember.cottonMemberTitle[lang]}
                  onChange={(e) =>
                    setCottonMember({
                      ...cottonMember,
                      cottonMemberTitle: {
                        ...cottonMember.cottonMemberTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-1">
                  {translations[activeTabLang].buttonText}
                </label>
                <Input
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={cottonMember.cottonMemberButtonText[lang]}
                  onChange={(e) =>
                    setCottonMember({
                      ...cottonMember,
                      cottonMemberButtonText: {
                        ...cottonMember.cottonMemberButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* <label className="block font-medium mt-5 mb-1">
            {translations[activeTabLang].buttonLink}
          </label>
          <Input
            style={{
              backgroundColor: "#171717",
              border: "1px solid #2d2d2d",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 14px",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            value={cottonMember.cottonMemberButtonLink}
            onChange={(e) =>
              setCottonMember({
                ...cottonMember,
                cottonMemberButtonLink: e.target.value,
              })
            }
          /> */}

          {/* ================= MEMBER IMAGES (Multiple Upload) ================= */}
          <h3 className="text-white text-md font-semibold !mt-5">
            {translations[activeTabLang].memberImages}
          </h3>
          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommended} 560×400px
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
            {/* --- Saved Images from DB --- */}
            {(cottonMember.cottonMemberImg || []).map((img, idx) => (
              <div
                key={`saved-${idx}`}
                className="relative group w-40 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
              >
                <img
                  src={getFullUrl(img)}
                  alt={`Member ${idx + 1}`}
                  className="w-full h-full object-cover p-2 rounded-lg"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() =>
                    setMemberImgModal({ type: "saved", index: idx })
                  }
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Xem hình" : "View Full"}
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
                  htmlFor={`changeMemberImg-${idx}`}
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  title={isVietnamese ? "Thay đổi" : "Change Image"}
                >
                  <input
                    id={`changeMemberImg-${idx}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      const updatedFiles = [
                        ...cottonMember.cottonMemberImgFiles,
                        file,
                      ];
                      setCottonMember({
                        ...cottonMember,
                        cottonMemberImgFiles: updatedFiles,
                      });
                    }}
                    style={{ display: "none" }}
                  />
                  <RotateCw size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={async () => {
                    const newImgs = cottonMember.cottonMemberImg.filter(
                      (_, i) => i !== idx
                    );
                    const updated = {
                      ...cottonMember,
                      cottonMemberImg: newImgs,
                    };
                    setCottonMember(updated);
                    await instantSave("cottonMember", updated);
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full  transition"
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
            ))}

            {/* --- New Uploads (Previews) --- */}
            {(cottonMember.cottonMemberImgFiles || []).map((file, idx) => (
              <div
                key={`new-${idx}`}
                className="relative group w-40 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New Member ${idx + 1}`}
                  className="w-full h-full object-cover p-2 rounded-lg"
                />

                {/* 👁 View Full */}
                <button
                  type="button"
                  onClick={() => setMemberImgModal({ type: "new", index: idx })}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={isVietnamese ? "Xem hình" : "View Full"}
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

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setCottonMember({
                      ...cottonMember,
                      cottonMemberImgFiles:
                        cottonMember.cottonMemberImgFiles.filter(
                          (_, i) => i !== idx
                        ),
                    })
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
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
            ))}

            {/* --- Upload Box --- */}
            <label
              htmlFor="cottonMemberImgUpload"
              className="flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                  ? "Thêm hình thành viên"
                  : "Add Member Image"}
              </span>
            </label>

            {/* Hidden Input */}
            <input
              id="cottonMemberImgUpload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const validFiles = Array.from(e.target.files).filter(
                  validateFileSize
                );
                if (validFiles.length !== e.target.files.length) {
                  CommonToaster(
                    "Some member images were too large (max 2MB) and skipped.",
                    "error"
                  );
                }
                setCottonMember({
                  ...cottonMember,
                  cottonMemberImgFiles: [
                    ...(cottonMember.cottonMemberImgFiles || []),
                    ...validFiles,
                  ],
                });
              }}
            />
          </div>

          {/* 🖼 Full Preview Modal */}
          <Modal
            open={!!memberImgModal}
            footer={null}
            onCancel={() => setMemberImgModal(null)}
            centered
            width={600}
            bodyStyle={{ background: "#000", padding: "0" }}
          >
            {memberImgModal && (
              <img
                src={
                  memberImgModal.type === "saved"
                    ? getFullUrl(
                        cottonMember.cottonMemberImg[memberImgModal.index]
                      )
                    : URL.createObjectURL(
                        cottonMember.cottonMemberImgFiles[memberImgModal.index]
                      )
                }
                alt="Member Preview"
                className="w-full h-auto rounded-lg"
              />
            )}
          </Modal>

          <div className="flex justify-end mt-6 gap-4">
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("cottonMember", cottonMember, [
                  "cottonMemberImgFiles",
                ])
              }
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].saveMember}
            </Button>
          </div>
        </Panel>

        {/* 🧑‍🤝‍🧑 TEAM */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Về Đội Ngũ" : "About Team"}
            </span>
          }
          key="7"
        >
          {/* 🌐 Language Tabs */}
          <Tabs
            activeKey={activeTabLang}
            onChange={setActiveTabLang}
            className="pill-tabs mb-6"
          >
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                key={lang}
              >
                {/* TEAM INTRO */}
                <div className="mb-8">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    {lang === "en"
                      ? "Team Section Intro"
                      : "Phần Giới Thiệu Đội Ngũ"}
                  </h3>

                  {/* Tag */}
                  <label className="block font-medium mb-2 text-white">
                    {lang === "en" ? "Small Tag" : "Thẻ tiêu đề nhỏ"}
                  </label>
                  <Input
                    value={cottonTeam.aboutTeamIntro?.tag?.[lang] || ""}
                    onChange={(e) =>
                      setCottonTeam((prev) => ({
                        ...prev,
                        aboutTeamIntro: {
                          ...prev.aboutTeamIntro,
                          tag: {
                            ...prev.aboutTeamIntro?.tag,
                            [lang]: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder={
                      lang === "en" ? "Our People" : "Đội ngũ của chúng tôi"
                    }
                    style={{
                      backgroundColor: "#262626",
                      border: "1px solid #2E2F2F",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "10px 14px",
                    }}
                    className="!placeholder-gray-400"
                  />

                  {/* Heading */}
                  <label className="block font-medium mt-5 mb-2 text-white">
                    {lang === "en" ? "Main Heading" : "Tiêu đề chính"}
                  </label>
                  <Input
                    value={cottonTeam.aboutTeamIntro?.heading?.[lang] || ""}
                    onChange={(e) =>
                      setCottonTeam((prev) => ({
                        ...prev,
                        aboutTeamIntro: {
                          ...prev.aboutTeamIntro,
                          heading: {
                            ...prev.aboutTeamIntro?.heading,
                            [lang]: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder={
                      lang === "en"
                        ? "Meet Our Team"
                        : "Gặp gỡ đội ngũ của chúng tôi"
                    }
                    style={{
                      backgroundColor: "#262626",
                      border: "1px solid #2E2F2F",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "10px 14px",
                    }}
                    className="!placeholder-gray-400"
                  />

                  {/* Description */}
                  <label className="block font-medium mt-5 mb-2 text-white">
                    {lang === "en" ? "Description" : "Mô tả"}
                  </label>
                  <Input.TextArea
                    rows={4}
                    value={cottonTeam.aboutTeamIntro?.description?.[lang] || ""}
                    onChange={(e) =>
                      setCottonTeam((prev) => ({
                        ...prev,
                        aboutTeamIntro: {
                          ...prev.aboutTeamIntro,
                          description: {
                            ...prev.aboutTeamIntro?.description,
                            [lang]: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder={
                      lang === "en"
                        ? "Our experienced professionals combine deep textile knowledge..."
                        : "Các chuyên gia của chúng tôi kết hợp kiến thức sâu rộng..."
                    }
                    style={{
                      backgroundColor: "#262626",
                      border: "1px solid #2E2F2F",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "10px 14px",
                    }}
                    className="!placeholder-gray-400"
                  />
                </div>

                {/* TEAM LIST HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    {lang === "en" ? "Team Groups" : "Nhóm Đội Ngũ"}
                  </h3>
                  <Button
                    type="primary"
                    onClick={() => setAddTeamModal(true)}
                    style={{
                      backgroundColor: "#0284C7",
                      borderRadius: "6px",
                      fontWeight: "500",
                      padding: "22px",
                      borderRadius: "999px",
                    }}
                  >
                    {lang === "en" ? "Add Team" : "Thêm Nhóm"}
                  </Button>
                </div>

                <Tabs
                  className="mb-6 pill-tabs"
                  defaultActiveKey={Object.keys(cottonTeam.aboutTeam || {})[0]}
                >
                  {Object.entries(cottonTeam.aboutTeam || {}).map(
                    ([teamKey, teamData]) => (
                      <TabPane
                        key={teamKey}
                        tab={
                          <div className="flex items-center gap-2">
                            <span>
                              {teamData.teamLabel?.[lang] || "Untitled Team"}
                            </span>
                            <Trash2
                              size={16}
                              className="cursor-pointer text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedTeams = {
                                  ...cottonTeam.aboutTeam,
                                };
                                delete updatedTeams[teamKey];
                                setCottonTeam({
                                  ...cottonTeam,
                                  aboutTeam: updatedTeams,
                                });
                              }}
                            />
                          </div>
                        }
                      >
                        {(teamData.members || []).map((member, idx) => (
                          <div
                            key={idx}
                            className="mb-6 text-white border-b pb-4"
                          >
                            <label className="block font-medium mt-5 mb-2">
                              {lang === "en" ? "Name" : "Tên"}
                            </label>
                            <Input
                              value={member.teamName?.[lang] || ""}
                              onChange={(e) => {
                                const updated = [...teamData.members];
                                updated[idx] = {
                                  ...member,
                                  teamName: {
                                    ...member.teamName,
                                    [lang]: e.target.value,
                                  },
                                };
                                setCottonTeam((prev) => ({
                                  ...prev,
                                  aboutTeam: {
                                    ...prev.aboutTeam,
                                    [teamKey]: {
                                      ...teamData,
                                      members: updated,
                                    },
                                  },
                                }));
                              }}
                              style={{
                                backgroundColor: "#262626",
                                border: "1px solid #2E2F2F",
                                borderRadius: "8px",
                                color: "#fff",
                                padding: "10px 14px",
                              }}
                              className="!placeholder-gray-400"
                            />

                            <label className="block font-medium mt-5 mb-2">
                              {lang === "en" ? "Designation" : "Chức danh"}
                            </label>
                            <Input
                              value={member.teamDesgn?.[lang] || ""}
                              onChange={(e) => {
                                const updated = [...teamData.members];
                                updated[idx] = {
                                  ...member,
                                  teamDesgn: {
                                    ...member.teamDesgn,
                                    [lang]: e.target.value,
                                  },
                                };
                                setCottonTeam((prev) => ({
                                  ...prev,
                                  aboutTeam: {
                                    ...prev.aboutTeam,
                                    [teamKey]: {
                                      ...teamData,
                                      members: updated,
                                    },
                                  },
                                }));
                              }}
                              style={{
                                backgroundColor: "#262626",
                                border: "1px solid #2E2F2F",
                                borderRadius: "8px",
                                color: "#fff",
                                padding: "10px 14px",
                              }}
                              className="!placeholder-gray-400"
                            />

                            <label className="block font-medium mt-5 mb-2">
                              Email
                            </label>
                            <Input
                              value={member.teamEmail || ""}
                              onChange={(e) => {
                                const updated = [...teamData.members];
                                updated[idx] = {
                                  ...member,
                                  teamEmail: e.target.value,
                                };
                                setCottonTeam((prev) => ({
                                  ...prev,
                                  aboutTeam: {
                                    ...prev.aboutTeam,
                                    [teamKey]: {
                                      ...teamData,
                                      members: updated,
                                    },
                                  },
                                }));
                              }}
                              style={{
                                backgroundColor: "#262626",
                                border: "1px solid #2E2F2F",
                                borderRadius: "8px",
                                color: "#fff",
                                padding: "10px 14px",
                              }}
                              className="!placeholder-gray-400"
                            />
                            <label className="block font-medium mt-5 mb-2">
                              {lang === "en" ? "Phone Number" : "Số điện thoại"}
                            </label>
                            <Input
                              value={member.teamPhone || ""}
                              onChange={(e) => {
                                const updated = [...teamData.members];
                                updated[idx] = {
                                  ...member,
                                  teamPhone: e.target.value,
                                };
                                setCottonTeam((prev) => ({
                                  ...prev,
                                  aboutTeam: {
                                    ...prev.aboutTeam,
                                    [teamKey]: {
                                      ...teamData,
                                      members: updated,
                                    },
                                  },
                                }));
                              }}
                              placeholder={
                                lang === "en"
                                  ? "Enter phone number"
                                  : "Nhập số điện thoại"
                              }
                              style={{
                                backgroundColor: "#262626",
                                border: "1px solid #2E2F2F",
                                borderRadius: "8px",
                                color: "#fff",
                                padding: "10px 14px",
                              }}
                              className="!placeholder-gray-400"
                            />

                            {/* 🗑 Remove Member */}
                            <Button
                              danger
                              size="small"
                              onClick={() => {
                                const updated = teamData.members.filter(
                                  (_, i) => i !== idx
                                );
                                setCottonTeam((prev) => ({
                                  ...prev,
                                  aboutTeam: {
                                    ...prev.aboutTeam,
                                    [teamKey]: {
                                      ...teamData,
                                      members: updated,
                                    },
                                  },
                                }));
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                backgroundColor: "#FB2C36", // black
                                border: "1px solid #333",
                                color: "#fff",
                                padding: "22px 30px",
                                borderRadius: "9999px", // pill shape
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                marginTop: "20px",
                              }}
                            >
                              <Trash2 size={16} />
                              {lang === "en"
                                ? "Remove Member"
                                : "Xóa thành viên"}
                            </Button>
                          </div>
                        ))}

                        {/* ➕ Add Member Button */}
                        <Button
                          type="dashed"
                          onClick={() => {
                            const newMember = {
                              teamName: { en: "", vi: "" },
                              teamDesgn: { en: "", vi: "" },
                              teamEmail: "",
                              teamPhone: "", // ✅ added
                            };

                            const updated = [
                              ...(teamData.members || []),
                              newMember,
                            ];
                            setCottonTeam((prev) => ({
                              ...prev,
                              aboutTeam: {
                                ...prev.aboutTeam,
                                [teamKey]: { ...teamData, members: updated },
                              },
                            }));
                          }}
                          block
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#0284C7",
                            border: "1px solid #333",
                            color: "#fff",
                            padding: "22px 30px",
                            borderRadius: "9999px", // pill shape
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            marginTop: "20px",
                            width: "fit-content",
                          }}
                        >
                          <Plus />
                          {lang === "en" ? "Add Member" : "Thêm Thành Viên"}
                        </Button>
                      </TabPane>
                    )
                  )}
                </Tabs>
              </TabPane>
            ))}
          </Tabs>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                border: "1px solid #333",
                padding: "22px 30px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={async () => {
                const formData = new FormData();
                formData.append("cottonTeam", JSON.stringify(cottonTeam));
                const res = await updateCottonPage(formData);
                if (res.data?.cotton) {
                  CommonToaster("Team saved successfully!", "success");
                } else {
                  CommonToaster("Failed to save team", "error");
                }
              }}
              style={{
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "none",
                padding: "22px 30px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              Save Team
            </Button>
          </div>

          {/* ➕ Popup Modal for Adding Team Title */}
          <Modal
            open={addTeamModal}
            onCancel={() => setAddTeamModal(false)}
            footer={null}
            centered
            width={450}
            bodyStyle={{
              background: "#1a1a1a",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">
              {isVietnamese ? "Thêm Nhóm Mới" : "Add New Team"}
            </h3>

            {/* English Input */}
            <label className="block font-medium mb-2 text-white">
              Team Title (EN)
            </label>
            <Input
              value={tempTeamTitle?.en || ""}
              onChange={(e) =>
                setTempTeamTitle((prev) => ({
                  ...prev,
                  en: e.target.value,
                }))
              }
              placeholder="Enter English team title"
              style={{
                backgroundColor: "#262626",
                border: "1px solid #2E2F2F",
                borderRadius: "8px",
                color: "#fff",
                padding: "10px 14px",
                marginBottom: "16px",
              }}
              className="!placeholder-gray-400"
            />

            {/* Vietnamese Input */}
            <label className="block font-medium mb-2 text-white">
              Team Title (VI)
            </label>
            <Input
              value={tempTeamTitle?.vi || ""}
              onChange={(e) =>
                setTempTeamTitle((prev) => ({
                  ...prev,
                  vi: e.target.value,
                }))
              }
              placeholder="Nhập tên nhóm (Tiếng Việt)"
              style={{
                backgroundColor: "#262626",
                border: "1px solid #2E2F2F",
                borderRadius: "8px",
                color: "#fff",
                padding: "10px 14px",
              }}
              className="!placeholder-gray-400"
            />

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setAddTeamModal(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  border: "1px solid #333",
                  padding: "22px",
                  borderRadius: "999px",
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#0284C7",
                  border: "none",
                  color: "#fff",
                  padding: "22px",
                  borderRadius: "999px",
                }}
                onClick={() => {
                  if (!tempTeamTitle.en && !tempTeamTitle.vi) return;
                  const newKey = `team_${Date.now()}`;
                  setCottonTeam((prev) => ({
                    ...prev,
                    aboutTeam: {
                      ...prev.aboutTeam,
                      [newKey]: {
                        teamLabel: {
                          en: tempTeamTitle.en || "New Team",
                          vi: tempTeamTitle.vi || "Nhóm Mới",
                        },
                        members: [],
                      },
                    },
                  }));
                  setTempTeamTitle({ en: "", vi: "" });
                  setAddTeamModal(false);
                }}
              >
                {isVietnamese ? "Thêm Nhóm" : "Add Team"}
              </Button>
            </div>
          </Modal>
        </Panel>

        {/* 6. SEO META SECTION */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
            </span>
          }
          key="6"
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
                <Input
                  className="!placeholder-gray-400"
                  placeholder={
                    lang === "vi"
                      ? "Nhập tiêu đề Meta..."
                      : "Enter Meta Title..."
                  }
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
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
                />

                {/* Meta Description */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {lang === "vi" ? "Mô tả Meta" : "Meta Description"}
                </label>
                <Input.TextArea
                  className="!placeholder-gray-400"
                  rows={3}
                  placeholder={
                    lang === "vi"
                      ? "Nhập mô tả Meta (dưới 160 ký tự)..."
                      : "Enter Meta Description (under 160 chars)..."
                  }
                  style={{
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
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
                />

                {/* Meta Keywords (Tag Input) */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                </label>

                <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#171717] border border-[#2d2d2d] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all">
                  {seoMeta.metaKeywords?.[lang]
                    ?.split(",")
                    .map((kw) => kw.trim())
                    .filter(Boolean)
                    .map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-sm flex items-center gap-2 !text-gray-200 shadow-sm"
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

                  {/* Tag Input */}
                  <input
                    type="text"
                    placeholder={
                      lang === "vi"
                        ? "Nhập từ khóa và nhấn Enter"
                        : "Type keyword and press Enter"
                    }
                    className="flex-1 min-w-[140px] bg-transparent outline-none border-none !text-gray-100 placeholder-gray-500 text-sm px-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        e.preventDefault();
                        const newKeyword = e.target.value.trim();
                        const existing =
                          seoMeta.metaKeywords?.[lang]
                            ?.split(",")
                            .map((k) => k.trim()) || [];
                        const updated = [...new Set([...existing, newKeyword])];
                        setSeoMeta({
                          ...seoMeta,
                          metaKeywords: {
                            ...seoMeta.metaKeywords,
                            [lang]: updated.join(", "),
                          },
                        });
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSave("cottonSeoMeta", seoMeta)}
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
                cursor: "pointer",
                transition: "all 0.3s ease",
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

export default CottonPage;
