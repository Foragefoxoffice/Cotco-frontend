import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Divider, Modal } from "antd";
import { Plus, Minus, RotateCw, X, Trash2 } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getFiberPage, updateFiberPage } from "../../Api/api";
import * as FiIcons from "react-icons/fi";
import "../../assets/css/LanguageTabs.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const { Panel } = Collapse;
const { TabPane } = Tabs;

// ✅ multilingual validator
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

// ✅ API base
const API_BASE = import.meta.env.VITE_API_URL;
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

export default function FiberPage() {
  // const { theme } = useTheme();
  // 🔹 Navbar toggle language – used for titles and panel headers only
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  // 🔹 Editor tab language – used for all form fields, buttons, inputs, etc.
  const [activeTabLang, setActiveTabLang] = useState("en");

  // Watch the <body> class for .vi-mode like HomePage does
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

  const translations = {
    en: {
      pageTitle: "Fiber Page Management",

      // Common
      cancel: "Cancel",
      save: "Save",
      remove: "Remove",
      add: "Add",
      title: "Title",
      description: "Description",
      content: "Content",
      subTitle: "Sub Title",
      subText: "Sub Text",
      image: "Image",
      buttonText: "Button Text",
      buttonLink: "Button Link",
      recommendedSize: "Recommended Size: ",
      recommendedHero: "Recommended: 1260×660px (Image) | Max Video Size: 10MB",

      // Banner
      banner: "Banner",
      bannerMedia: "Banner Media",
      bannerImage: "Banner Image",
      saveBanner: "Save Banner",

      // Sustainability
      sustainability: "Sustainability",
      sustainabilityImage: "Sustainability Image",
      subTitleLabel: "Subtitle",
      subDescriptionLabel: "Sub Description",
      saveSustainability: "Save Sustainability",
      sustainabilityContent: "Sustainability Content",

      // Choose Us
      chooseUs: "Choose Us",
      boxBackgroundImage: "Box Background Image",
      chooseIcon: "Choose Icon",
      boxTitle: "Box Title",
      boxDescription: "Box Description",
      addBox: "Add Box",
      removeBox: "Remove Box",
      saveChooseUs: "Save Choose Us",

      // Supplier
      supplier: "Supplier",
      descriptions: "Descriptions (list)",
      addDescription: "Add Description",
      supplierImages: "Images",
      addImage: "Add Image",
      removeImage: "Remove Image",
      saveSupplier: "Save Supplier",

      // Products
      products: "Products",
      productTitle: "Product Title",
      productDescription: "Product Description",
      addProduct: "Add Product",
      addProductDescription: "Add Description",
      deleteProduct: "Delete Product",
      productBottomCon: "Bottom Content",
      saveProducts: "Save Products",

      // Certification
      certification: "Certification",
      certificationImages: "Images",
      addCertificationImage: "Add Image",
      saveCertification: "Save Certification",
    },

    vi: {
      pageTitle: "Quản lý Trang Sợi",

      // Common
      cancel: "Hủy",
      save: "Lưu",
      remove: "Xóa",
      add: "Thêm",
      title: "Tiêu đề",
      description: "Mô tả",
      content: "Nội dung",
      subTitle: "Tiêu đề phụ",
      subText: "Văn bản phụ",
      image: "Hình ảnh",
      buttonText: "Nút",
      buttonLink: "Liên kết nút",
      recommendedSize: "Kích thước đề xuất: ",
      recommendedHero:
        "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",

      // Banner
      banner: "Banner",
      bannerMedia: "Phương tiện Banner",
      bannerImage: "Hình ảnh Banner",
      saveBanner: "Lưu Banner",

      // Sustainability
      sustainability: "Bền vững",
      sustainabilityImage: "Hình ảnh Bền vững",
      subTitleLabel: "Tiêu đề phụ",
      subDescriptionLabel: "Mô tả phụ",
      saveSustainability: "Lưu Bền vững",
      sustainabilityContent: "Nội dung Bền vững",

      // Choose Us
      chooseUs: "Vì sao chọn chúng tôi",
      boxBackgroundImage: "Hình nền hộp",
      chooseIcon: "Chọn biểu tượng",
      boxTitle: "Tiêu đề hộp",
      boxDescription: "Mô tả hộp",
      addBox: "Thêm Hộp",
      removeBox: "Xóa Hộp",
      saveChooseUs: "Lưu Vì sao chọn chúng tôi",

      // Supplier
      supplier: "Nhà cung cấp",
      descriptions: "Danh sách mô tả",
      addDescription: " Thêm Mô tả",
      supplierImages: "Hình ảnh",
      addImage: "Thêm Hình ảnh",
      removeImage: "Xóa Hình ảnh",
      saveSupplier: "Lưu Nhà cung cấp",

      // Products
      products: "Sản phẩm",
      productTitle: "Tiêu đề sản phẩm",
      productDescription: "Mô tả sản phẩm",
      addProduct: "Thêm Sản phẩm",
      addProductDescription: "+ Thêm Mô tả",
      deleteProduct: "Xóa Sản phẩm",
      productBottomCon: "Nội dung cuối",
      saveProducts: "Lưu Sản phẩm",

      // Certification
      certification: "Chứng nhận",
      certificationImages: "Hình ảnh",
      addCertificationImage: "Thêm Hình ảnh",
      saveCertification: "Lưu Chứng nhận",
    },
  };

  const [addTeamModal, setAddTeamModal] = useState(false);
  const [tempTeamTitle, setTempTeamTitle] = useState({ en: "", vi: "" });

  // ---------------- STATE ---------------- //
  const [fiberBanner, setFiberBanner] = usePersistedState("fiberBanner", {
    fiberBannerMedia: "",
    fiberBannerTitle: { en: "", vi: "" },
    fiberBannerDes: { en: "", vi: "" },
    fiberBannerContent: { en: "", vi: "" },
    fiberBannerSubTitle: { en: "", vi: "" },
    fiberBannerImg: "",
  });

  const [fiberSustainability, setFiberSustainability] = usePersistedState(
    "fiberSustainability",
    {
      fiberSustainabilityTitle: { en: "", vi: "" },
      fiberSustainabilitySubText: { en: "", vi: "" },
      fiberSustainabilityDes: { en: "", vi: "" },
      fiberSustainabilityImg: "",
      fiberSustainabilitySubTitle1: { en: "", vi: "" },
      fiberSustainabilitySubDes1: { en: "", vi: "" },
      fiberSustainabilitySubTitle2: { en: "", vi: "" },
      fiberSustainabilitySubDes2: { en: "", vi: "" },
      fiberSustainabilitySubTitle3: { en: "", vi: "" },
      fiberSustainabilitySubDes3: { en: "", vi: "" },
    }
  );

  const [fiberChooseUs, setFiberChooseUs] = usePersistedState("fiberChooseUs", {
    fiberChooseUsTitle: { en: "", vi: "" },
    fiberChooseUsDes: { en: "", vi: "" },
    fiberChooseUsBox: [],
  });

  const [fiberSupplier, setFiberSupplier] = usePersistedState("fiberSupplier", {
    fiberSupplierTitle: { en: "", vi: "" },
    fiberSupplierDes: [],
    fiberSupplierImg: [],
  });

  const [fiberProducts, setFiberProducts] = usePersistedState("fiberProducts", {
    fiberProductSectionTitle: { en: "", vi: "" },
  fiberProductSectionSubtitle: { en: "", vi: "" },
    fiberProduct: [],
    fiberProductBottomCon: { en: "", vi: "" },
    fiberProductButtonText: { en: "", vi: "" },
    fiberProductButtonLink: "",
  });

  const [fiberCertification, setFiberCertification] = usePersistedState(
    "fiberCertification",
    {
      fiberCertificationTitle: { en: "", vi: "" },
      fiberCertificationButtonText: { en: "", vi: "" },
      fiberCertificationButtonLink: "",
      fiberCertificationImg: [],
    }
  );

  // 🧑‍🤝‍🧑 Fiber Team Section States
  const [fiberTeam, setFiberTeam] = useState({
    aboutTeamIntro: {
      tag: { en: "", vi: "" },
      heading: { en: "", vi: "" },
      description: { en: "", vi: "" },
    },
    aboutTeam: {}, // multiple teams will be stored here
  });

  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });

  // ---------------- FETCH ---------------- //
  useEffect(() => {
    getFiberPage().then((res) => {
      if (!res.data) return;

      // 🔹 Banner
      if (res.data.fiberBanner) setFiberBanner(res.data.fiberBanner);

      // 🔹 Sustainability
      if (res.data.fiberSustainability)
        setFiberSustainability(res.data.fiberSustainability);

      // 🔹 Choose Us
      if (res.data.fiberChooseUs) setFiberChooseUs(res.data.fiberChooseUs);

      // 🔹 Supplier
      if (res.data.fiberSupplier) setFiberSupplier(res.data.fiberSupplier);

      // 🔹 Products
      if (res.data.fiberProducts) setFiberProducts(res.data.fiberProducts);

      // 🔹 Certification
      if (res.data.fiberCertification)
        setFiberCertification(res.data.fiberCertification);

      // 🔹 ✅ Fiber Team (NEW)
      // 🧑‍🤝‍🧑 ✅ Fiber Team (handles intro + groups cleanly)
      if (res.data.fiberTeam && typeof res.data.fiberTeam === "object") {
        const teamData = res.data.fiberTeam;

        setFiberTeam({
          aboutTeamIntro: {
            tag: teamData.aboutTeamIntro?.tag || { en: "", vi: "" },
            heading: teamData.aboutTeamIntro?.heading || { en: "", vi: "" },
            description: teamData.aboutTeamIntro?.description || {
              en: "",
              vi: "",
            },
          },
          aboutTeam: teamData.aboutTeam || {},
        });
      } else {
        // if empty or missing
        setFiberTeam({
          aboutTeamIntro: {
            tag: { en: "", vi: "" },
            heading: { en: "", vi: "" },
            description: { en: "", vi: "" },
          },
          aboutTeam: {},
        });
      }

      // 🔹 ✅ SEO META
      if (res.data.seoMeta) {
        setSeoMeta({
          metaTitle: res.data.seoMeta.metaTitle || { en: "", vi: "" },
          metaDescription: res.data.seoMeta.metaDescription || {
            en: "",
            vi: "",
          },
          metaKeywords: res.data.seoMeta.metaKeywords || { en: "", vi: "" },
        });
      }
    });
  }, []);

  const handleSave = async (sectionName, formState) => {
    try {
      // 🧩 Validation (skip language check for fiberTeam, since it's complex structured)
      if (sectionName !== "fiberTeam" && !validateVietnamese(formState)) {
        CommonToaster(
          "Please fill both English and Vietnamese fields.",
          "error"
        );
        return;
      }

      const formData = new FormData();

      // Always send section as JSON
      formData.append(sectionName, JSON.stringify(formState));

      // 🧠 Loop through all keys in section
      for (const key in formState) {
        const value = formState[key];

        // ---------------- ARRAY FIELDS ----------------
        if (Array.isArray(value)) {
          value.forEach((item, idx) => {
            // 🏭 Supplier Images
            if (key === "fiberSupplierImg" && item?.file instanceof File) {
              formData.append(`fiberSupplierImgFile${idx}`, item.file);
            }

            // 📦 Product Images
            if (
              key === "fiberProduct" &&
              item?.fiberProductImg?.file instanceof File
            ) {
              formData.append(
                `fiberProductImgFile${idx}`,
                item.fiberProductImg.file
              );
            }

            // 🪪 Certification Images
            if (key === "fiberCertificationImg" && item?.file instanceof File) {
              formData.append(`fiberCertificationImgFile${idx}`, item.file);
            }
          });

          // ✅ Clean JSON array (strip out preview/file blobs)
          formData.append(
            key,
            JSON.stringify(
              value.map((item) => {
                if (!item) return "";
                if (item?.file || item?.preview) return "";
                if (item?.fiberProductImg?.file)
                  return { ...item, fiberProductImg: "" };
                return typeof item === "string" ? item : item;
              })
            )
          );
        }

        // ---------------- SINGLE FILE ----------------
        else if (value instanceof File) {
          formData.append(`${key}File`, value);
        }

        // ---------------- OBJECT WITH FILE ----------------
        else if (value?.file instanceof File) {
          formData.append(`${key}File`, value.file);
        }

        // ---------------- NORMAL FIELDS ----------------
        else {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      }

      // 🔄 API Call
      const res = await updateFiberPage(formData);

      // ✅ Handle Response
      if (res.data?.fiber) {
        CommonToaster(`${sectionName} saved successfully!`, "success");
        const fiberData = res.data.fiber;

        if (sectionName === "fiberSupplier" && fiberData.fiberSupplier)
          setFiberSupplier(fiberData.fiberSupplier);

        if (sectionName === "fiberBanner" && fiberData.fiberBanner)
          setFiberBanner(fiberData.fiberBanner);

        if (sectionName === "fiberProducts" && fiberData.fiberProducts)
          setFiberProducts(fiberData.fiberProducts);

        if (
          sectionName === "fiberCertification" &&
          fiberData.fiberCertification
        )
          setFiberCertification(fiberData.fiberCertification);

        if (sectionName === "fiberChooseUs" && fiberData.fiberChooseUs)
          setFiberChooseUs(fiberData.fiberChooseUs);

        if (
          sectionName === "fiberSustainability" &&
          fiberData.fiberSustainability
        )
          setFiberSustainability(fiberData.fiberSustainability);

        // 🧑‍🤝‍🧑 NEW: Fiber Team
        if (sectionName === "fiberTeam" && fiberData.fiberTeam) {
          const teamData = fiberData.fiberTeam;
          setFiberTeam({
            aboutTeamIntro: {
              tag: teamData.aboutTeamIntro?.tag || { en: "", vi: "" },
              heading: teamData.aboutTeamIntro?.heading || { en: "", vi: "" },
              description: teamData.aboutTeamIntro?.description || {
                en: "",
                vi: "",
              },
            },
            aboutTeam: teamData.aboutTeam || {},
          });
        }
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      CommonToaster("Error", err.message || "Something went wrong!");
    }
  };

  const [showFiberBannerModal, setShowFiberBannerModal] = useState(false);
  const [showFiberImageModal, setShowFiberImageModal] = useState(false);
  const [showSustainabilityModal, setShowSustainabilityModal] = useState(false);
  const [showChooseUsBgModal, setShowChooseUsBgModal] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(null);
  const [showCertModal, setShowCertModal] = useState(null);
  const [showFiberVideoModal, setShowFiberVideoModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(null);

  // ✅ Dynamic translations for UI texts based on currentLang
  const currentText = translations[currentLang];

  // ✅ Example: If you need dynamic UI labels like page title, buttons, etc.
  const [uiText, setUiText] = useState({
    pageTitle: currentText.pageTitle,
    cancel: currentText.cancel,
    save: currentText.save,
    banner: currentText.banner,
    bannerMedia: currentText.bannerMedia,
    sustainability: currentText.sustainability,
    chooseUs: currentText.chooseUs,
    supplier: currentText.supplier,
    products: currentText.products,
    certification: currentText.certification,
  });

  // ✅ When language changes, auto-update visible UI text
  useEffect(() => {
    setUiText({
      pageTitle: currentText.pageTitle,
      cancel: currentText.cancel,
      save: currentText.save,
      banner: currentText.banner,
      bannerMedia: currentText.bannerMedia,
      sustainability: currentText.sustainability,
      chooseUs: currentText.chooseUs,
      supplier: currentText.supplier,
      products: currentText.products,
      certification: currentText.certification,
    });
  }, [currentLang]);

  // ---------------- UI ---------------- //
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
      <h2 className="text-4xl font-extrabold mb-10 text-center">
        {uiText.pageTitle}
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
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Biểu ngữ" : "Banner"}
            </span>
          }
          key="1"
        >
          {/* Language Tabs */}
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
                {/* Title */}
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                  }}
                  value={fiberBanner.fiberBannerTitle[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerTitle: {
                        ...fiberBanner.fiberBannerTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* Description */}
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].description}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                  }}
                  value={fiberBanner.fiberBannerDes[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerDes: {
                        ...fiberBanner.fiberBannerDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <Divider />

          {/* --- 1️⃣ Background Video Upload --- */}
          <div style={{ marginBottom: "30px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {activeTabLang === "vi" ? "Video Nền" : "Background Video"}
            </label>

            {!fiberBanner.fiberBannerMedia &&
            !fiberBanner.fiberBannerMediaPreview ? (
              <label
                htmlFor="fiberBannerVideoUpload"
                className="flex flex-col items-center justify-center w-44 h-44 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer bg-[#1F1F1F] hover:bg-[#2A2A2A] transition-all duration-200"
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
                    ? "Tải lên video nền"
                    : "Upload Background Video"}
                </span>
                <input
                  id="fiberBannerVideoUpload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;
                    const previewUrl = URL.createObjectURL(file);
                    setFiberBanner((prev) => ({
                      ...prev,
                      fiberBannerMedia: file,
                      fiberBannerMediaPreview: previewUrl,
                    }));
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div className="relative group w-44 h-44 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                <video
                  src={
                    fiberBanner.fiberBannerMediaPreview
                      ? fiberBanner.fiberBannerMediaPreview
                      : getFullUrl(fiberBanner.fiberBannerMedia)
                  }
                  muted
                  loop
                  autoPlay
                  className="w-full h-full object-cover"
                />

                {/* 👁 Preview */}
                <button
                  type="button"
                  onClick={() => setShowFiberVideoModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
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
                  htmlFor="fiberBannerVideoChange"
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <input
                    id="fiberBannerVideoChange"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      const previewUrl = URL.createObjectURL(file);
                      setFiberBanner((prev) => ({
                        ...prev,
                        fiberBannerMedia: file,
                        fiberBannerMediaPreview: previewUrl,
                      }));
                    }}
                    style={{ display: "none" }}
                  />
                  <RotateCw size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerMedia: "",
                      fiberBannerMediaPreview: "",
                    })
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* --- 2️⃣ Home Image Upload --- */}
          <div style={{ marginBottom: "30px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {activeTabLang === "vi" ? "Hình Ảnh Trang Chủ" : "Home Image"}
            </label>

            {!fiberBanner.fiberBannerImg &&
            !fiberBanner.fiberBannerImgPreview ? (
              <label
                htmlFor="fiberBannerImgUpload"
                className="flex flex-col items-center justify-center w-44 h-44 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer bg-[#1F1F1F] hover:bg-[#2A2A2A] transition-all duration-200"
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
                    ? "Tải lên hình ảnh"
                    : "Upload Home Image"}
                </span>
                <input
                  id="fiberBannerImgUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;
                    const previewUrl = URL.createObjectURL(file);
                    setFiberBanner((prev) => ({
                      ...prev,
                      fiberBannerImg: file,
                      fiberBannerImgPreview: previewUrl,
                    }));
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div className="relative group w-44 h-44 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                <img
                  src={
                    fiberBanner.fiberBannerImgPreview
                      ? fiberBanner.fiberBannerImgPreview
                      : getFullUrl(fiberBanner.fiberBannerImg)
                  }
                  alt="Banner"
                  className="w-full h-full object-cover"
                />

                {/* 👁 Preview */}
                <button
                  type="button"
                  onClick={() => setShowFiberImageModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={
                    activeTabLang === "vi" ? "Xem toàn màn hình" : "View Full"
                  }
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
                  htmlFor="fiberBannerImgChange"
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  title={
                    activeTabLang === "vi"
                      ? "Thay đổi hình ảnh"
                      : "Change Image"
                  }
                >
                  <input
                    id="fiberBannerImgChange"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      const previewUrl = URL.createObjectURL(file);
                      setFiberBanner((prev) => ({
                        ...prev,
                        fiberBannerImg: file,
                        fiberBannerImgPreview: previewUrl,
                      }));
                    }}
                    style={{ display: "none" }}
                  />
                  <RotateCw size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerImg: "",
                      fiberBannerImgPreview: "",
                    })
                  }
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer"
                  title={activeTabLang === "vi" ? "Xóa hình ảnh" : "Remove"}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* --- 3️⃣ ReactQuill Editor --- */}
          <label className="block font-bold text-white mb-2">
            {activeTabLang === "vi" ? "Nội dung chi tiết" : "Detailed Content"}
          </label>
          <div className="bg-[#1F1F1F] border border-[#2E2F2F] rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={fiberBanner.fiberBannerContent?.[activeTabLang] || ""}
              onChange={(value) =>
                setFiberBanner({
                  ...fiberBanner,
                  fiberBannerContent: {
                    ...fiberBanner.fiberBannerContent,
                    [activeTabLang]: value,
                  },
                })
              }
              className="h-[220px] text-white quill-dark"
            />
          </div>

          {/* --- Popup Previews --- */}
          {showFiberVideoModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative w-[90vw] max-w-4xl">
                <button
                  type="button"
                  onClick={() => setShowFiberVideoModal(false)}
                  className="absolute z-50 -top-2 -right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer"
                >
                  <X size={20} />
                </button>
                <video
                  src={
                    fiberBanner.fiberBannerMediaPreview
                      ? fiberBanner.fiberBannerMediaPreview
                      : getFullUrl(fiberBanner.fiberBannerMedia)
                  }
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}

          {showFiberImageModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative w-[90vw] max-w-4xl">
                <button
                  type="button"
                  onClick={() => setShowFiberImageModal(false)}
                  className="absolute z-50 -top-2 -right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer"
                >
                  <X size={20} />
                </button>
                <img
                  src={
                    fiberBanner.fiberBannerImgPreview
                      ? fiberBanner.fiberBannerImgPreview
                      : getFullUrl(fiberBanner.fiberBannerImg)
                  }
                  alt="Full Banner"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() => handleSave("fiberBanner", fiberBanner)}
              style={{
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "none",
                padding: "22px 30px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              {translations[activeTabLang].saveBanner}
            </Button>
          </div>
        </Panel>

        {/* 2. Sustainability */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Bền vững" : "Sustainability"}
            </span>
          }
          key="2"
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
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].subText}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberSustainability.fiberSustainabilitySubText[lang]}
                  onChange={(e) =>
                    setFiberSustainability({
                      ...fiberSustainability,
                      fiberSustainabilitySubText: {
                        ...fiberSustainability.fiberSustainabilitySubText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberSustainability.fiberSustainabilityTitle[lang]}
                  onChange={(e) =>
                    setFiberSustainability({
                      ...fiberSustainability,
                      fiberSustainabilityTitle: {
                        ...fiberSustainability.fiberSustainabilityTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].description}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberSustainability.fiberSustainabilityDes[lang]}
                  onChange={(e) =>
                    setFiberSustainability({
                      ...fiberSustainability,
                      fiberSustainabilityDes: {
                        ...fiberSustainability.fiberSustainabilityDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* 🌿 Sustainability Image Upload */}
          <div style={{ marginBottom: "20px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[activeTabLang].sustainabilityImage}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[activeTabLang].recommendedSize} 900×500px
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {!fiberSustainability.fiberSustainabilityImg &&
              !fiberSustainability.fiberSustainabilityImgPreview ? (
                <label
                  htmlFor="fiberSustainabilityUpload"
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
                    {activeTabLang === "vi"
                      ? "Tải lên hình ảnh"
                      : "Upload Sustainability Image"}
                  </span>
                </label>
              ) : (
                <div className="relative group w-40 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                  <img
                    src={
                      fiberSustainability.fiberSustainabilityImgPreview
                        ? fiberSustainability.fiberSustainabilityImgPreview
                        : getFullUrl(fiberSustainability.fiberSustainabilityImg)
                    }
                    alt="Sustainability Preview"
                    className="w-full h-full object-cover"
                  />

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowSustainabilityModal(true)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={
                      activeTabLang === "vi" ? "Xem toàn màn hình" : "View Full"
                    }
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
                    htmlFor="fiberSustainabilityUploadChange"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={activeTabLang === "vi" ? "Thay đổi" : "Change Image"}
                  >
                    <input
                      id="fiberSustainabilityUploadChange"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setFiberSustainability({
                          ...fiberSustainability,
                          fiberSustainabilityImg: file,
                          fiberSustainabilityImgPreview:
                            URL.createObjectURL(file),
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
                      setFiberSustainability({
                        ...fiberSustainability,
                        fiberSustainabilityImg: "",
                        fiberSustainabilityImgPreview: "",
                      })
                    }
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer transition"
                    title={activeTabLang === "vi" ? "Xóa" : "Remove"}
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
              id="fiberSustainabilityUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;
                setFiberSustainability({
                  ...fiberSustainability,
                  fiberSustainabilityImg: file,
                  fiberSustainabilityImgPreview: URL.createObjectURL(file),
                });
              }}
            />

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showSustainabilityModal}
              footer={null}
              onCancel={() => setShowSustainabilityModal(false)}
              centered
              width={700}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {fiberSustainability.fiberSustainabilityImgPreview ? (
                <img
                  src={fiberSustainability.fiberSustainabilityImgPreview}
                  alt="Full Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : fiberSustainability.fiberSustainabilityImg ? (
                <img
                  src={getFullUrl(fiberSustainability.fiberSustainabilityImg)}
                  alt="Full Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400 py-10 text-base">
                  No image available
                </div>
              )}
            </Modal>
          </div>

          {/* 🌿 Sustainability Content Blocks */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#1F1F1F",
                border: "1px solid #2E2F2F",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <h3 className="text-white font-semibold text-base mb-3">
                {translations[activeTabLang].sustainabilityContent}
                {""}
                <span> {i}</span>
              </h3>

              {/* Subtitle Input */}
              <Input
                style={{
                  backgroundColor: "#262626",
                  border: "1px solid #2E2F2F",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  marginBottom: "10px",
                }}
                placeholder={`Subtitle ${i}`}
                value={
                  fiberSustainability[`fiberSustainabilitySubTitle${i}`]?.[
                    activeTabLang
                  ] || ""
                }
                onChange={(e) =>
                  setFiberSustainability({
                    ...fiberSustainability,
                    [`fiberSustainabilitySubTitle${i}`]: {
                      ...fiberSustainability[`fiberSustainabilitySubTitle${i}`],
                      [activeTabLang]: e.target.value,
                    },
                  })
                }
              />

              {/* Sub Description Input */}
              <Input
                style={{
                  backgroundColor: "#262626",
                  border: "1px solid #2E2F2F",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                placeholder={`SubDesc ${i}`}
                value={
                  fiberSustainability[`fiberSustainabilitySubDes${i}`]?.[
                    activeTabLang
                  ] || ""
                }
                onChange={(e) =>
                  setFiberSustainability({
                    ...fiberSustainability,
                    [`fiberSustainabilitySubDes${i}`]: {
                      ...fiberSustainability[`fiberSustainabilitySubDes${i}`],
                      [activeTabLang]: e.target.value,
                    },
                  })
                }
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() =>
                handleSave("fiberSustainability", fiberSustainability)
              }
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
              {translations[activeTabLang].saveSustainability}
            </Button>
          </div>
        </Panel>

        {/* 3. Choose Us */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Chọn Chúng Tôi" : "Choose Us"}
            </span>
          }
          key="3"
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
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberChooseUs.fiberChooseUsTitle[lang]}
                  onChange={(e) =>
                    setFiberChooseUs({
                      ...fiberChooseUs,
                      fiberChooseUsTitle: {
                        ...fiberChooseUs.fiberChooseUsTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].description}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberChooseUs.fiberChooseUsDes[lang]}
                  onChange={(e) =>
                    setFiberChooseUs({
                      ...fiberChooseUs,
                      fiberChooseUsDes: {
                        ...fiberChooseUs.fiberChooseUsDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {fiberChooseUs.fiberChooseUsBox.map((box, idx) => (
            <div key={idx} className="p-2 mb-2">
              {/* 🖼 Box Background Image Upload */}
              <div style={{ marginBottom: "20px" }}>
                <label className="block text-white text-lg font-semibold mb-2">
                  {translations[activeTabLang].boxBackgroundImage}
                </label>
                <p className="text-sm text-slate-500 mb-3">
                  {translations[activeTabLang].recommendedSize} 900×500px
                </p>

                <div className="flex flex-wrap gap-4 mt-2">
                  {!box.fiberChooseUsBoxBg &&
                  !box.fiberChooseUsBoxBg?.preview ? (
                    <label
                      htmlFor={`fiberChooseUsBgUpload-${idx}`}
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
                        {activeTabLang === "vi"
                          ? "Tải lên hình nền"
                          : "Upload Background Image"}
                      </span>
                    </label>
                  ) : (
                    <div className="relative group w-40 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                      <img
                        src={
                          box.fiberChooseUsBoxBg?.preview
                            ? box.fiberChooseUsBoxBg.preview
                            : getFullUrl(box.fiberChooseUsBoxBg)
                        }
                        alt="Background Preview"
                        className="w-full h-full object-cover"
                      />

                      {/* 👁 View Full */}
                      <button
                        type="button"
                        onClick={() => setShowChooseUsBgModal(idx)}
                        className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title={
                          activeTabLang === "vi"
                            ? "Xem toàn màn hình"
                            : "View Full"
                        }
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
                        htmlFor={`fiberChooseUsBgUploadChange-${idx}`}
                        className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                        title={
                          activeTabLang === "vi" ? "Thay đổi" : "Change Image"
                        }
                      >
                        <input
                          id={`fiberChooseUsBgUploadChange-${idx}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (!validateFileSize(file)) return;
                            const arr = [...fiberChooseUs.fiberChooseUsBox];
                            arr[idx].fiberChooseUsBoxBg = {
                              file,
                              preview: URL.createObjectURL(file),
                            };
                            setFiberChooseUs({
                              ...fiberChooseUs,
                              fiberChooseUsBox: arr,
                            });
                          }}
                          style={{ display: "none" }}
                        />
                        <RotateCw size={14} />
                      </label>

                      {/* ❌ Remove */}
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...fiberChooseUs.fiberChooseUsBox];
                          arr[idx].fiberChooseUsBoxBg = null;
                          setFiberChooseUs({
                            ...fiberChooseUs,
                            fiberChooseUsBox: arr,
                          });
                        }}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer transition"
                        title={activeTabLang === "vi" ? "Xóa" : "Remove"}
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
                  id={`fiberChooseUsBgUpload-${idx}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const arr = [...fiberChooseUs.fiberChooseUsBox];
                      arr[idx].fiberChooseUsBoxBg = {
                        file,
                        preview: URL.createObjectURL(file),
                      };
                      setFiberChooseUs({
                        ...fiberChooseUs,
                        fiberChooseUsBox: arr,
                      });
                    }
                  }}
                />

                {/* 🖼 Full Preview Modal */}
                <Modal
                  open={showChooseUsBgModal === idx}
                  footer={null}
                  onCancel={() => setShowChooseUsBgModal(null)}
                  centered
                  width={700}
                  bodyStyle={{ background: "#000", padding: "0" }}
                >
                  {box.fiberChooseUsBoxBg?.preview ? (
                    <img
                      src={box.fiberChooseUsBoxBg.preview}
                      alt="Full Preview"
                      className="w-full h-auto rounded-lg"
                    />
                  ) : box.fiberChooseUsBoxBg ? (
                    <img
                      src={getFullUrl(box.fiberChooseUsBoxBg)}
                      alt="Full Preview"
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400 py-10 text-base">
                      No image available
                    </div>
                  )}
                </Modal>
              </div>

              {/* Icon Selector */}
              <div style={{ marginBottom: "10px" }}>
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].chooseIcon}
                </label>
                <select
                  value={box.fiberChooseUsIcon}
                  onChange={(e) => {
                    const arr = [...fiberChooseUs.fiberChooseUsBox];
                    arr[idx].fiberChooseUsIcon = e.target.value;
                    setFiberChooseUs({
                      ...fiberChooseUs,
                      fiberChooseUsBox: arr,
                    });
                  }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "9999px",
                    border: "1px solid #2e2f2f",
                    backgroundColor: "#262626",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  <option value="">-- Select Icon --</option>
                  {Object.keys(FiIcons).map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>

                {box.fiberChooseUsIcon && (
                  <h3
                    style={{
                      marginLeft: "50px",
                      marginTop: "20px",
                      fontSize: "40px",
                      color: "#fff",
                    }}
                  >
                    {React.createElement(FiIcons[box.fiberChooseUsIcon])}
                  </h3>
                )}
              </div>

              {/* Multilingual Box Title */}
              <label className="block font-bold mt-5 mb-1">
                {translations[activeTabLang].boxTitle}
              </label>
              <Input
                style={{
                  backgroundColor: "#262626",
                  border: "1px solid #2E2F2F",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                value={box.fiberChooseUsBoxTitle?.[activeTabLang] || ""}
                onChange={(e) => {
                  const arr = [...fiberChooseUs.fiberChooseUsBox];
                  arr[idx].fiberChooseUsBoxTitle = {
                    ...arr[idx].fiberChooseUsBoxTitle,
                    [activeTabLang]: e.target.value,
                  };
                  setFiberChooseUs({
                    ...fiberChooseUs,
                    fiberChooseUsBox: arr,
                  });
                }}
              />

              {/* Multilingual Box Description */}
              <label className="block font-bold mt-5 mb-1">
                {translations[activeTabLang].boxDescription}
              </label>
              <Input
                style={{
                  backgroundColor: "#262626",
                  border: "1px solid #2E2F2F",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                value={box.fiberChooseUsDes?.[activeTabLang] || ""}
                onChange={(e) => {
                  const arr = [...fiberChooseUs.fiberChooseUsBox];
                  arr[idx].fiberChooseUsDes = {
                    ...arr[idx].fiberChooseUsDes,
                    [activeTabLang]: e.target.value,
                  };
                  setFiberChooseUs({
                    ...fiberChooseUs,
                    fiberChooseUsBox: arr,
                  });
                }}
              />

              <Button
                onClick={async () => {
                  const arr = [...fiberChooseUs.fiberChooseUsBox];
                  arr.splice(idx, 1);
                  setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                  await handleSave("fiberChooseUs", {
                    ...fiberChooseUs,
                    fiberChooseUsBox: arr,
                  });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#fb2c36",
                  border: "1px solid #E50000",
                  color: "#fff",
                  padding: "22px",
                  borderRadius: "9999px",
                  fontWeight: "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  marginTop: "10px",
                }}
              >
                <Trash2 size={16} />
                {translations[activeTabLang].removeBox}
              </Button>
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() =>
                setFiberChooseUs({
                  ...fiberChooseUs,
                  fiberChooseUsBox: [
                    ...fiberChooseUs.fiberChooseUsBox,
                    {
                      fiberChooseUsBoxBg: "",
                      fiberChooseUsIcon: "",
                      fiberChooseUsBoxTitle: { en: "", vi: "" },
                      fiberChooseUsDes: { en: "", vi: "" },
                    },
                  ],
                })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#262626",
                color: "#fff",
                border: "1px solid #2E2F2F",
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
                cursor: "pointer",
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {translations[activeTabLang].addBox}
            </Button>

            <Button
              onClick={() => handleSave("fiberChooseUs", fiberChooseUs)}
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
              }}
            >
              {translations[activeTabLang].saveChooseUs}
            </Button>
          </div>
        </Panel>

        {/* 4. Supplier */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Nhà Cung Cấp" : "Supplier"}
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
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    marginTop: "10px",
                  }}
                  value={fiberSupplier.fiberSupplierTitle[lang]}
                  onChange={(e) =>
                    setFiberSupplier({
                      ...fiberSupplier,
                      fiberSupplierTitle: {
                        ...fiberSupplier.fiberSupplierTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className="block font-bold mt-5 mb-1">
            {translations[activeTabLang].description} (list)
          </label>

          {/* ✅ Description Fields */}
          {fiberSupplier.fiberSupplierDes.map((d, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-white font-semibold mb-2">
                {isVietnamese
                  ? `Nội dung nhà cung cấp ${idx + 1}`
                  : `Supplier Description ${idx + 1}`}
              </label>
              <Input
                style={{
                  backgroundColor: "#262626",
                  border: "1px solid #2E2F2F",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  marginBottom: "10px",
                }}
                placeholder={
                  activeTabLang === "vi"
                    ? `Nhập nội dung mô tả ${idx + 1}`
                    : `Enter description ${idx + 1}`
                }
                value={d[activeTabLang] || ""}
                onChange={(e) => {
                  const arr = [...fiberSupplier.fiberSupplierDes];
                  arr[idx] = { ...arr[idx], [activeTabLang]: e.target.value };
                  setFiberSupplier({
                    ...fiberSupplier,
                    fiberSupplierDes: arr,
                  });
                }}
              />
            </div>
          ))}

          <div className="flex justify-start gap-4 mt-4">
            <Button
              onClick={() =>
                setFiberSupplier({
                  ...fiberSupplier,
                  fiberSupplierDes: [
                    ...fiberSupplier.fiberSupplierDes,
                    { en: "", vi: "" },
                  ],
                })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "1px solid #2E2F2F",
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {translations[activeTabLang].addDescription}
            </Button>
          </div>

          {/* 🖼 Supplier Images */}
          <div style={{ marginBottom: "25px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[activeTabLang].image}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[activeTabLang].recommendedSize} 200×200px
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
              {/* Existing Images */}
              {fiberSupplier.fiberSupplierImg.map((img, idx) => (
                <div
                  key={`supplier-img-${idx}`}
                  className="relative group w-32 h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
                >
                  <img
                    src={
                      img?.preview
                        ? img.preview
                        : typeof img === "string"
                        ? getFullUrl(img)
                        : ""
                    }
                    alt={`supplier-${idx}`}
                    className="w-full h-full object-cover"
                  />

                  {/* 👁 Preview */}
                  <button
                    type="button"
                    onClick={() => setShowSupplierModal(idx)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Xem hình" : "View Full"}
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
                    htmlFor={`fiberSupplierChange-${idx}`}
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Thay đổi" : "Change Image"}
                  >
                    <input
                      id={`fiberSupplierChange-${idx}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onClick={(e) => (e.target.value = null)} // reset on click
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        const arr = [...fiberSupplier.fiberSupplierImg];
                        arr[idx] = { file, preview: URL.createObjectURL(file) };
                        setFiberSupplier({
                          ...fiberSupplier,
                          fiberSupplierImg: arr,
                        });
                      }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...fiberSupplier.fiberSupplierImg];
                      arr.splice(idx, 1);
                      setFiberSupplier({
                        ...fiberSupplier,
                        fiberSupplierImg: arr,
                      });
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Xóa" : "Remove"}
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

              {/* Upload New Image */}
              <label
                htmlFor="fiberSupplierUploadNew"
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
                  {activeTabLang === "vi" ? "Thêm hình" : "Add Image"}
                </span>
              </label>

              <input
                id="fiberSupplierUploadNew"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onClick={(e) => (e.target.value = null)} // reset before every click
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!validateFileSize(file)) return;
                  const newImage = { file, preview: URL.createObjectURL(file) };
                  setFiberSupplier({
                    ...fiberSupplier,
                    fiberSupplierImg: [
                      ...fiberSupplier.fiberSupplierImg,
                      newImage,
                    ],
                  });
                }}
              />
            </div>

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showSupplierModal !== null}
              footer={null}
              onCancel={() => setShowSupplierModal(null)}
              centered
              width={500}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {showSupplierModal !== null &&
              fiberSupplier.fiberSupplierImg[showSupplierModal] ? (
                <img
                  src={
                    fiberSupplier.fiberSupplierImg[showSupplierModal]?.preview
                      ? fiberSupplier.fiberSupplierImg[showSupplierModal]
                          .preview
                      : getFullUrl(
                          fiberSupplier.fiberSupplierImg[showSupplierModal]
                        )
                  }
                  alt="Supplier Full Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400 py-10 text-base">
                  No image available
                </div>
              )}
            </Modal>
          </div>

          {/* ✅ Save Supplier */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() => handleSave("fiberSupplier", fiberSupplier)}
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
                marginTop: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[activeTabLang].saveSupplier}
            </Button>
          </div>
        </Panel>

        {/* 5. Products */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Sản Phẩm" : "Products"}
            </span>
          }
          key="5"
        >
          {/* 🌐 One Language Tab for All Fields */}
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
                {/* 🏷 PRODUCT SECTION MAIN TITLE */}
<label className="block text-white font-semibold mb-1">
  {activeTabLang === "vi" ? "Tiêu đề mục sản phẩm" : "Product Section Title"}
</label>

<Input
  style={{
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    marginBottom: "12px",
  }}
  placeholder={
    activeTabLang === "vi"
      ? "Nhập tiêu đề mục"
      : "Enter Section Title"
  }
  value={fiberProducts.fiberProductSectionTitle?.[activeTabLang] || ""}
  onChange={(e) =>
    setFiberProducts({
      ...fiberProducts,
      fiberProductSectionTitle: {
        ...fiberProducts.fiberProductSectionTitle,
        [activeTabLang]: e.target.value,
      },
    })
  }
/>

{/* 📝 PRODUCT SECTION SUBTITLE */}
<label className="block text-white font-semibold mb-1">
  {activeTabLang === "vi" ? "Tiêu đề phụ" : "Product Section Subtitle"}
</label>

<Input
  style={{
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    marginBottom: "20px",
  }}
  placeholder={
    activeTabLang === "vi"
      ? "Nhập tiêu đề phụ"
      : "Enter Subtitle"
  }
  value={fiberProducts.fiberProductSectionSubtitle?.[activeTabLang] || ""}
  onChange={(e) =>
    setFiberProducts({
      ...fiberProducts,
      fiberProductSectionSubtitle: {
        ...fiberProducts.fiberProductSectionSubtitle,
        [activeTabLang]: e.target.value,
      },
    })
  }
/>

                {fiberProducts.fiberProduct.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 mb-4 rounded-md border border-[#2E2F2F] bg-[#1F1F1F]"
                  >
                    {/* ❌ Delete Product */}
                    

                    {/* 🏷 Product Title */}
                    <label className="block text-white font-semibold mb-1">
                      {translations[activeTabLang].title}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#262626",
                        border: "1px solid #2E2F2F",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        marginBottom: "12px",
                      }}
                      placeholder={
                        activeTabLang === "vi"
                          ? "Nhập tiêu đề sản phẩm"
                          : "Enter Product Title"
                      }
                      className="!placeholder-gray-500"
                      value={p.fiberProductTitle?.[lang] || ""}
                      onChange={(e) => {
                        const arr = [...fiberProducts.fiberProduct];
                        arr[idx].fiberProductTitle = {
                          ...arr[idx].fiberProductTitle,
                          [lang]: e.target.value,
                        };
                        setFiberProducts({
                          ...fiberProducts,
                          fiberProduct: arr,
                        });
                      }}
                    />

                    {/* 📝 Product Descriptions */}
                    <label className="block text-white font-semibold mb-2">
                      {translations[activeTabLang].description} (list)
                    </label>
                    {p.fiberProductDes.map((desc, dIdx) => (
                      <div key={dIdx} className="mb-3 flex items-center gap-2">
                        <Input
                          style={{
                            backgroundColor: "#262626",
                            border: "1px solid #2E2F2F",
                            borderRadius: "8px",
                            color: "#fff",
                            padding: "10px 14px",
                            fontSize: "14px",
                            flex: 1,
                          }}
                          placeholder={
                            activeTabLang === "vi"
                              ? `Mô tả ${dIdx + 1}`
                              : `Description ${dIdx + 1}`
                          }
                          value={desc?.[lang] || ""}
                          onChange={(e) => {
                            const arr = [...fiberProducts.fiberProduct];
                            arr[idx].fiberProductDes[dIdx] = {
                              ...arr[idx].fiberProductDes[dIdx],
                              [lang]: e.target.value,
                            };
                            setFiberProducts({
                              ...fiberProducts,
                              fiberProduct: arr,
                            });
                          }}
                        />
                        <Button
                          onClick={() => {
                            const arr = [...fiberProducts.fiberProduct];
                            arr[idx].fiberProductDes.splice(dIdx, 1);
                            setFiberProducts({
                              ...fiberProducts,
                              fiberProduct: arr,
                            });
                          }}
                          className="!bg-red-600 !border-0 !px-6 !py-5  hover:bg-red-700 !text-white"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      onClick={() => {
                        const arr = [...fiberProducts.fiberProduct];
                        arr[idx].fiberProductDes.push({ en: "", vi: "" });
                        setFiberProducts({
                          ...fiberProducts,
                          fiberProduct: arr,
                        });
                      }}
                      className="mt-4 !bg-[#0284C7] hover:bg-blue-700 !border-0 !text-white !rounded-full !px-6 !py-6"
                    >
                      + {translations[activeTabLang].addDescription}
                    </Button>

                    {/* 🖼 Product Image Upload */}
                    <div style={{ marginBottom: "30px" }}>
                      <label className="block text-white text-lg font-semibold mb-2">
                        {activeTabLang === "vi"
                          ? "Hình Ảnh Sản Phẩm"
                          : "Product Image"}
                      </label>

                      {/* 🚫 If no image uploaded yet */}
                      {!p.fiberProductImg?.preview && !p.fiberProductImg ? (
                        <label
                          htmlFor={`fiberProductUpload-${idx}`}
                          className="flex flex-col items-center justify-center w-44 h-44 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer bg-[#1F1F1F] hover:bg-[#2A2A2A] transition-all duration-200"
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
                              ? "Tải lên hình sản phẩm"
                              : "Upload Product Image"}
                          </span>
                          <input
                            id={`fiberProductUpload-${idx}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!validateFileSize(file)) return;
                              const previewUrl = URL.createObjectURL(file);
                              const arr = [...fiberProducts.fiberProduct];
                              arr[idx].fiberProductImg = {
                                file,
                                preview: previewUrl,
                              };
                              setFiberProducts({
                                ...fiberProducts,
                                fiberProduct: arr,
                              });
                            }}
                            style={{ display: "none" }}
                          />
                        </label>
                      ) : (
                        /* ✅ When image exists — show preview box with hover actions */
                        <div className="relative group w-44 h-44 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                          <img
                            src={
                              p.fiberProductImg?.preview
                                ? p.fiberProductImg.preview
                                : getFullUrl(p.fiberProductImg)
                            }
                            alt={`product-${idx}`}
                            className="w-full h-full object-cover"
                          />

                          {/* 👁 View */}
                          <button
                            type="button"
                            onClick={() => setShowProductModal(idx)}
                            className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            title={
                              activeTabLang === "vi" ? "Xem hình" : "View Full"
                            }
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
                            htmlFor={`fiberProductChange-${idx}`}
                            className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                            title={
                              activeTabLang === "vi" ? "Thay đổi" : "Change"
                            }
                          >
                            <input
                              id={`fiberProductChange-${idx}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (!validateFileSize(file)) return;
                                const previewUrl = URL.createObjectURL(file);
                                const arr = [...fiberProducts.fiberProduct];
                                arr[idx].fiberProductImg = {
                                  file,
                                  preview: previewUrl,
                                };
                                setFiberProducts({
                                  ...fiberProducts,
                                  fiberProduct: arr,
                                });
                              }}
                              style={{ display: "none" }}
                            />
                            <RotateCw size={14} />
                          </label>

                          {/* ❌ Remove */}
                          <button
                            type="button"
                            onClick={() => {
                              const arr = [...fiberProducts.fiberProduct];
                              arr[idx].fiberProductImg = "";
                              setFiberProducts({
                                ...fiberProducts,
                                fiberProduct: arr,
                              });
                            }}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer"
                            title={
                              activeTabLang === "vi" ? "Xóa hình" : "Remove"
                            }
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={async () => {
                        const arr = [...fiberProducts.fiberProduct];
                        arr.splice(idx, 1);
                        const updated = { ...fiberProducts, fiberProduct: arr };
                        setFiberProducts(updated);
                        await handleSave("fiberProducts", updated);
                      }}
                      className="!mt-6 mb-3 !bg-red-600 !border-0 !px-6 !py-6 !rounded-full hover:bg-red-700 !text-white"
                    >
                      <Trash2 size={16} />
                      {translations[activeTabLang].deleteProduct}
                    </Button>
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>

          {/* ➕ Add New Product */}
          <Button
            onClick={() =>
              setFiberProducts({
                ...fiberProducts,
                fiberProduct: [
                  ...fiberProducts.fiberProduct,
                  {
                    fiberProductTitle: { en: "", vi: "" },
                    fiberProductDes: [],
                    fiberProductImg: "",
                  },
                ],
              })
            }
            className="mt-4 !bg-[#0284C7] hover:bg-blue-700 !border-0 !text-white !rounded-full !px-6 !py-6"
          >
            + {translations[activeTabLang].addProduct}
          </Button>

          {/* 🖼 Full Preview Modal */}
          <Modal
            open={showProductModal !== null}
            footer={null}
            onCancel={() => setShowProductModal(null)}
            centered
            width={500}
            bodyStyle={{ background: "#000", padding: "0" }}
          >
            {showProductModal !== null &&
            fiberProducts.fiberProduct[showProductModal]?.fiberProductImg ? (
              <img
                src={
                  fiberProducts.fiberProduct[showProductModal].fiberProductImg
                    ?.preview
                    ? fiberProducts.fiberProduct[showProductModal]
                        .fiberProductImg.preview
                    : getFullUrl(
                        fiberProducts.fiberProduct[showProductModal]
                          .fiberProductImg
                      )
                }
                alt="Product Full Preview"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-400 py-10 text-base">
                No image available
              </div>
            )}
          </Modal>

          {/* ✅ Save All Products */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() => handleSave("fiberProducts", fiberProducts)}
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
              {translations[activeTabLang].saveProducts}
            </Button>
          </div>
        </Panel>

        {/* 6. Certification */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Chứng Nhận" : "Certification"}
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
                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].title}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberCertification.fiberCertificationTitle[lang]}
                  onChange={(e) =>
                    setFiberCertification({
                      ...fiberCertification,
                      fiberCertificationTitle: {
                        ...fiberCertification.fiberCertificationTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].buttonText}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={fiberCertification.fiberCertificationButtonText[lang]}
                  onChange={(e) =>
                    setFiberCertification({
                      ...fiberCertification,
                      fiberCertificationButtonText: {
                        ...fiberCertification.fiberCertificationButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* 🧾 Fiber Certification Image Upload Section */}
          <div style={{ marginBottom: "25px", marginTop: "25px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[activeTabLang].image}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[activeTabLang].recommendedSize} 560×400px
            </p>

            {/* Grid layout for certification images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
              {fiberCertification.fiberCertificationImg.map((img, idx) => (
                <div
                  key={`cert-${idx}`}
                  className="relative group w-40 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
                >
                  {/* Preview */}
                  <img
                    src={
                      img?.preview
                        ? img.preview
                        : typeof img === "string"
                        ? getFullUrl(img)
                        : ""
                    }
                    alt={`cert-${idx}`}
                    className="w-full h-full object-cover"
                  />

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowCertModal(idx)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Xem hình" : "View Full"}
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
                    htmlFor={`fiberCertUpload-${idx}`}
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={activeTabLang === "vi" ? "Thay đổi" : "Change Image"}
                  >
                    <input
                      id={`fiberCertUpload-${idx}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;

                        const arr = [
                          ...fiberCertification.fiberCertificationImg,
                        ];
                        arr[idx] = { file, preview: URL.createObjectURL(file) };
                        setFiberCertification({
                          ...fiberCertification,
                          fiberCertificationImg: arr,
                        });
                      }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={async () => {
                      const arr = [...fiberCertification.fiberCertificationImg];
                      arr.splice(idx, 1);
                      setFiberCertification({
                        ...fiberCertification,
                        fiberCertificationImg: arr,
                      });
                      await handleSave("fiberCertification", {
                        ...fiberCertification,
                        fiberCertificationImg: arr,
                      });
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Xóa" : "Remove"}
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

              {/* ➕ Upload New Box */}
              <label
                className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
                onClick={() =>
                  document.getElementById("newFiberCertUpload").click()
                }
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
                  {activeTabLang === "vi" ? "Thêm hình" : "Add Image"}
                </span>
              </label>

              {/* Hidden Input for Add Image */}
              <input
                id="newFiberCertUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!validateFileSize(file)) return;

                  setFiberCertification({
                    ...fiberCertification,
                    fiberCertificationImg: [
                      ...fiberCertification.fiberCertificationImg,
                      { file, preview: URL.createObjectURL(file) },
                    ],
                  });
                }}
              />
            </div>

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showCertModal !== null}
              footer={null}
              onCancel={() => setShowCertModal(null)}
              centered
              width={500}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {showCertModal !== null &&
              fiberCertification.fiberCertificationImg[showCertModal] ? (
                <img
                  src={
                    fiberCertification.fiberCertificationImg[showCertModal]
                      ?.preview
                      ? fiberCertification.fiberCertificationImg[showCertModal]
                          .preview
                      : getFullUrl(
                          fiberCertification.fiberCertificationImg[
                            showCertModal
                          ]
                        )
                  }
                  alt="Certification Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400 py-10 text-base">
                  No image available
                </div>
              )}
            </Modal>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() =>
                handleSave("fiberCertification", fiberCertification)
              }
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
              {translations[activeTabLang].saveCertification}
            </Button>
          </div>
        </Panel>

        {/* 🧑‍🤝‍🧑 FIBER TEAM */}
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
                    value={fiberTeam.aboutTeamIntro?.tag?.[lang] || ""}
                    onChange={(e) =>
                      setFiberTeam((prev) => ({
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
                    value={fiberTeam.aboutTeamIntro?.heading?.[lang] || ""}
                    onChange={(e) =>
                      setFiberTeam((prev) => ({
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
                    value={fiberTeam.aboutTeamIntro?.description?.[lang] || ""}
                    onChange={(e) =>
                      setFiberTeam((prev) => ({
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

                {/* TEAM GROUPS */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    {lang === "en" ? "Team Groups" : "Nhóm Đội Ngũ"}
                  </h3>
                  <Button
                    type="primary"
                    onClick={() => setAddTeamModal(true)}
                    style={{
                      backgroundColor: "#0284C7",
                      borderRadius: "999px",
                      fontWeight: "500",
                      padding: "22px",
                    }}
                  >
                    {lang === "en" ? "Add Team" : "Thêm Nhóm"}
                  </Button>
                </div>

                <Tabs
                  className="mb-6 pill-tabs"
                  defaultActiveKey={Object.keys(fiberTeam.aboutTeam || {})[0]}
                >
                  {Object.entries(fiberTeam.aboutTeam || {}).map(
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
                                const updatedTeams = { ...fiberTeam.aboutTeam };
                                delete updatedTeams[teamKey];
                                setFiberTeam({
                                  ...fiberTeam,
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
                                setFiberTeam((prev) => ({
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
                                setFiberTeam((prev) => ({
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
                                setFiberTeam((prev) => ({
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
                                const value = e.target.value.replace(
                                  /[^0-9+]/g,
                                  ""
                                );
                                const updated = [...teamData.members];
                                updated[idx] = {
                                  ...member,
                                  teamPhone: e.target.value,
                                };
                                setFiberTeam((prev) => ({
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
                                setFiberTeam((prev) => ({
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
                                backgroundColor: "#FB2C36",
                                color: "#fff",
                                borderRadius: "9999px",
                                padding: "22px 30px",
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

                        {/* ➕ Add Member */}
                        <Button
                          type="dashed"
                          onClick={() => {
                            const newMember = {
                              teamName: { en: "", vi: "" },
                              teamDesgn: { en: "", vi: "" },
                              teamEmail: "",
                            };
                            const updated = [
                              ...(teamData.members || []),
                              newMember,
                            ];
                            setFiberTeam((prev) => ({
                              ...prev,
                              aboutTeam: {
                                ...prev.aboutTeam,
                                [teamKey]: { ...teamData, members: updated },
                              },
                            }));
                          }}
                          style={{
                            backgroundColor: "#0284C7",
                            color: "#fff",
                            borderRadius: "9999px",
                            padding: "22px 30px",
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
                formData.append("fiberTeam", JSON.stringify(fiberTeam));
                const res = await updateFiberPage(formData);
                if (res.data?.fiber) {
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

          {/* ➕ Add Team Modal */}
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

            {/* English */}
            <label className="block font-medium mb-2 text-white">
              Team Title (EN)
            </label>
            <Input
              value={tempTeamTitle?.en || ""}
              onChange={(e) =>
                setTempTeamTitle((prev) => ({ ...prev, en: e.target.value }))
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

            {/* Vietnamese */}
            <label className="block font-medium mb-2 text-white">
              Team Title (VI)
            </label>
            <Input
              value={tempTeamTitle?.vi || ""}
              onChange={(e) =>
                setTempTeamTitle((prev) => ({ ...prev, vi: e.target.value }))
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

            {/* Footer */}
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
                  setFiberTeam((prev) => ({
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

        {/* 7. SEO META SECTION */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
            </span>
          }
          key="8"
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
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
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
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
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

                {/* Meta Keywords */}
                {/* ✅ Meta Keywords (Tag Input Style) */}
                <div className="mt-6">
                  <label className="block font-medium mb-3 text-white">
                    {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                  </label>

                  <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#1C1C1C] border border-[#2E2F2F] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all">
                    {/* Display each keyword as a tag */}
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

                    {/* Input field to add new keyword */}
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
                              .map((k) => k.trim())
                              .filter(Boolean) || [];
                          const updated = [
                            ...new Set([...existing, newKeyword]),
                          ]; // avoid duplicates
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
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSave("fiberSeoMeta", seoMeta)}
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
              }}
            >
              {activeTabLang === "vi" ? "Lưu SEO Meta" : "Save SEO Meta"}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
}
