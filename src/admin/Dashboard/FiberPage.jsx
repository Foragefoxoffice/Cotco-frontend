import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Divider, Modal } from "antd";
import { Plus, Minus, RotateCw, X, Trash2 } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getFiberPage, updateFiberPage } from "../../Api/api";
import * as FiIcons from "react-icons/fi";
import "../../assets/css/LanguageTabs.css";

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
      if (!validateVietnamese(formState)) {
        CommonToaster(
          "Please fill both English and Vietnamese fields.",
          "error"
        );
        return;
      }

      const formData = new FormData();

      // Always send the full section JSON for safeParse on backend
      formData.append(sectionName, JSON.stringify(formState));

      for (const key in formState) {
        const value = formState[key];

        // Handle arrays
        if (Array.isArray(value)) {
          value.forEach((item, idx) => {
            // Supplier Images
            if (key === "fiberSupplierImg" && item?.file instanceof File) {
              formData.append(`fiberSupplierImgFile${idx}`, item.file);
            }
            // Choose Us Box Backgrounds
            if (
              key === "fiberChooseUsBox" &&
              item?.fiberChooseUsBoxBg?.file instanceof File
            ) {
              formData.append(
                `fiberChooseUsBoxBgFile${idx}`,
                item.fiberChooseUsBoxBg.file
              );
            }
            // Products Images
            if (
              key === "fiberProduct" &&
              item?.fiberProductImg?.file instanceof File
            ) {
              formData.append(
                `fiberProductImgFile${idx}`,
                item.fiberProductImg.file
              );
            }
            // Certification Images
            if (key === "fiberCertificationImg" && item?.file instanceof File) {
              formData.append(`fiberCertificationImgFile${idx}`, item.file);
            }
          });

          // Send cleaned JSON array (no preview blobs)
          formData.append(
            key,
            JSON.stringify(
              value
                .filter((item) => item && item !== "" && item !== null)
                .map((item) => {
                  if (item?.file) return ""; // placeholder for new file
                  if (item?.preview) return ""; // preview only, ignore
                  if (item?.fiberChooseUsBoxBg?.file)
                    return { ...item, fiberChooseUsBoxBg: "" };
                  if (item?.fiberProductImg?.file)
                    return { ...item, fiberProductImg: "" };
                  return item; // already saved string path
                })
            )
          );
        }

        // Handle direct File (banner, sustainability, etc.)
        else if (value instanceof File) {
          formData.append(`${key}File`, value);
        }

        // Handle object { file, preview }
        else if (value?.file instanceof File) {
          formData.append(`${key}File`, value.file);
        }

        // Fallback for plain objects / strings
        else {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      }

      const res = await updateFiberPage(formData);

      if (res.data?.fiber) {
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (err) {
      CommonToaster("Error", err.message || "Something went wrong!");
    }
  };

  const [showFiberBannerModal, setShowFiberBannerModal] = useState(false);
  const [showFiberImageModal, setShowFiberImageModal] = useState(false);
  const [showSustainabilityModal, setShowSustainabilityModal] = useState(false);
  const [showChooseUsBgModal, setShowChooseUsBgModal] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(null);
  const [showCertModal, setShowCertModal] = useState(null);
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
          .ant-divider-inner-text {
          color: #314158 !important;
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

                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].content}
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
                  value={fiberBanner.fiberBannerContent[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerContent: {
                        ...fiberBanner.fiberBannerContent,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-bold mt-5 mb-1">
                  {translations[activeTabLang].subTitle}
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
                  value={fiberBanner.fiberBannerSubTitle[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerSubTitle: {
                        ...fiberBanner.fiberBannerSubTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <Divider />

          {/* Banner Media (image/video) */}
          <div style={{ marginBottom: "20px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[activeTabLang].bannerMedia}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[activeTabLang].recommendedHero}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {!fiberBanner.fiberBannerMedia &&
              !fiberBanner.fiberBannerMediaPreview ? (
                // 📁 Upload Placeholder
                <label
                  htmlFor="fiberBannerMediaUpload"
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
                    {translations[activeTabLang].uploadMedia ??
                      (activeTabLang === "vi"
                        ? "Tải lên hình ảnh hoặc video"
                        : "Upload Image or Video")}
                  </span>
                  <input
                    id="fiberBannerMediaUpload"
                    type="file"
                    accept="image/*,.mp4,.webm,.ogg,.mov,.avi,.mkv"
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
                // ✅ Uploaded Media Preview
                <div className="relative group w-40 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                  {fiberBanner.fiberBannerMediaPreview ? (
                    fiberBanner.fiberBannerMedia?.type?.startsWith("video") ? (
                      <video
                        src={fiberBanner.fiberBannerMediaPreview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={fiberBanner.fiberBannerMediaPreview}
                        alt="Banner Media"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : fiberBanner.fiberBannerMedia?.endsWith?.(".mp4") ||
                    fiberBanner.fiberBannerMedia?.endsWith?.(".webm") ||
                    fiberBanner.fiberBannerMedia?.endsWith?.(".ogg") ? (
                    <video
                      src={getFullUrl(fiberBanner.fiberBannerMedia)}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={getFullUrl(fiberBanner.fiberBannerMedia)}
                      alt="Banner Media"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowFiberBannerModal(true)}
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
                    htmlFor="fiberBannerMediaUploadChange"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={activeTabLang === "vi" ? "Thay đổi" : "Change File"}
                  >
                    <input
                      id="fiberBannerMediaUploadChange"
                      type="file"
                      accept="image/*,.mp4,.webm,.ogg,.mov,.avi,.mkv"
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
              )}
            </div>

            {/* 🪟 Modal Preview */}
            {showFiberBannerModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="relative w-[90vw] max-w-4xl">
                  <button
                    type="button"
                    onClick={() => setShowFiberBannerModal(false)}
                    className="absolute z-50 -top-2 -right-2 bg-red-600 !text-white p-2 rounded-full cursor-pointer"
                  >
                    <X size={20} />
                  </button>

                  {fiberBanner.fiberBannerMediaPreview ? (
                    fiberBanner.fiberBannerMedia?.type?.startsWith("video") ? (
                      <video
                        src={fiberBanner.fiberBannerMediaPreview}
                        controls
                        autoPlay
                        className="w-full rounded-lg"
                      />
                    ) : (
                      <img
                        src={fiberBanner.fiberBannerMediaPreview}
                        alt="Full Banner"
                        className="w-full rounded-lg"
                      />
                    )
                  ) : fiberBanner.fiberBannerMedia ? (
                    fiberBanner.fiberBannerMedia.endsWith(".mp4") ||
                    fiberBanner.fiberBannerMedia.endsWith(".webm") ||
                    fiberBanner.fiberBannerMedia.endsWith(".ogg") ? (
                      <video
                        src={getFullUrl(fiberBanner.fiberBannerMedia)}
                        controls
                        autoPlay
                        className="w-full rounded-lg"
                      />
                    ) : (
                      <img
                        src={getFullUrl(fiberBanner.fiberBannerMedia)}
                        alt="Full Banner"
                        className="w-full rounded-lg"
                      />
                    )
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() => handleSave("fiberBanner", fiberBanner)}
              style={{
                display: "flex",
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

          {/* 📝 Description Fields */}
          {fiberSupplier.fiberSupplierDes.map((d, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-white font-semibold mb-2">
                {isVietnamese === "vi"
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
                  marginTop: "10px",
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
              {/* Plus Icon */}
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

          {/* 🖼 Supplier Images Section */}
          <div style={{ marginBottom: "25px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[activeTabLang].image}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[activeTabLang].recommendedSize} 200×200px
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
              {/* --- Existing or Preview Images --- */}
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

                  {/* 👁 View Full */}
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
                    htmlFor={`fiberSupplierUpload-${idx}`}
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={activeTabLang === "vi" ? "Thay đổi" : "Change Image"}
                  >
                    <input
                      id={`fiberSupplierUpload-${idx}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
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
                    onClick={async () => {
                      const arr = [...fiberSupplier.fiberSupplierImg];
                      arr.splice(idx, 1);
                      setFiberSupplier({
                        ...fiberSupplier,
                        fiberSupplierImg: arr,
                      });

                      await handleSave("fiberSupplier", {
                        ...fiberSupplier,
                        fiberSupplierImg: arr,
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
              ))}

              {/* --- Upload New Box --- */}
              <label
                onClick={() =>
                  setFiberSupplier({
                    ...fiberSupplier,
                    fiberSupplierImg: [
                      ...fiberSupplier.fiberSupplierImg,
                      { file: null, preview: null },
                    ],
                  })
                }
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
            <span className="flex jus items-center gap-2 text-white text-lg">
              {isVietnamese ? "Sản Phẩm" : "Products"}
            </span>
          }
          key="5"
        >
          {fiberProducts.fiberProduct.map((p, idx) => (
            <div key={idx} className="p-2 mb-2 relative rounded-md">
              {/* ❌ Delete whole product */}
              <Button
                onClick={async () => {
                  const arr = [...fiberProducts.fiberProduct];
                  arr.splice(idx, 1);
                  setFiberProducts({ ...fiberProducts, fiberProduct: arr });

                  await handleSave("fiberProducts", {
                    ...fiberProducts,
                    fiberProduct: arr,
                  });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: "9999px",
                  fontWeight: "500",
                  fontSize: "13px",
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
                  style={{ width: "16px", height: "16px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>
                {translations[activeTabLang].deleteProduct}
              </Button>

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
                      placeholder="Product Title"
                      value={p.fiberProductTitle[lang]}
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
                  </TabPane>
                ))}
              </Tabs>

              <label className="block font-bold mt-5 mb-1">
                {translations[activeTabLang].description} (list)
              </label>

              {p.fiberProductDes.map((d, dIdx) => (
                <Tabs
                  activeKey={activeTabLang}
                  onChange={setActiveTabLang}
                  key={dIdx}
                  className="pill-tabs"
                >
                  {["en", "vi"].map((lang) => (
                    <TabPane
                      tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                      key={lang}
                    >
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
                          marginBottom: "10px",
                        }}
                        value={d[lang]}
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
                    </TabPane>
                  ))}
                </Tabs>
              ))}

              <Button
                type="dashed"
                onClick={() => {
                  const arr = [...fiberProducts.fiberProduct];
                  arr[idx].fiberProductDes.push({ en: "", vi: "" });
                  setFiberProducts({ ...fiberProducts, fiberProduct: arr });
                }}
              >
                {translations[activeTabLang].addDescription}
              </Button>

              {/* Product Image Upload */}
              <div style={{ marginTop: "10px" }}>
                <p className="text-sm text-slate-500 mb-2">
                  {translations[activeTabLang].recommendedSize} 200×200px
                </p>
                <div className="mb-3">
                  <input
                    id={`fiberProductUpload-${idx}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      const arr = [...fiberProducts.fiberProduct];
                      arr[idx].fiberProductImg = {
                        file,
                        preview: URL.createObjectURL(file),
                      };
                      setFiberProducts({ ...fiberProducts, fiberProduct: arr });
                    }}
                  />
                  <label
                    htmlFor={`fiberProductUpload-${idx}`}
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
                    {activeTabLang === "vi"
                      ? "Tải lên hình sản phẩm"
                      : "Upload Product Image"}
                  </label>
                </div>

                {p.fiberProductImg && (
                  <img
                    src={
                      p.fiberProductImg.preview || getFullUrl(p.fiberProductImg)
                    }
                    alt={`product-${idx}`}
                    style={{
                      width: "120px",
                      marginTop: "8px",
                      borderRadius: "6px",
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          <Button
            type="dashed"
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#0284C7",
              border: "none",
              color: "#fff",
              padding: "22px",
              borderRadius: "9999px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.4)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#0369A1")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#0284C7")
            }
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            {translations[activeTabLang].addProduct}
          </Button>

          <Divider />

          {/* 🌐 Single Language Tabs */}
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
                <label className="block text-white font-semibold mb-2 mt-3">
                  {isVietnamese ? "Nội dung dưới cùng" : "Bottom Content"}
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
                  value={fiberProducts.fiberProductBottomCon[lang]}
                  onChange={(e) =>
                    setFiberProducts({
                      ...fiberProducts,
                      fiberProductBottomCon: {
                        ...fiberProducts.fiberProductBottomCon,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block text-white font-semibold mb-2 mt-5">
                  {isVietnamese ? "Văn bản nút" : "Button Text"}
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
                  value={fiberProducts.fiberProductButtonText[lang]}
                  onChange={(e) =>
                    setFiberProducts({
                      ...fiberProducts,
                      fiberProductButtonText: {
                        ...fiberProducts.fiberProductButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* 🌍 Static Button Link */}
          <label className="block text-white font-semibold mb-2 mt-5">
            {isVietnamese ? "Liên kết nút" : "Button Link"}
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
              marginBottom: "20px",
            }}
            placeholder="Button Link"
            value={fiberProducts.fiberProductButtonLink}
            onChange={(e) =>
              setFiberProducts({
                ...fiberProducts,
                fiberProductButtonLink: e.target.value,
              })
            }
          />

          <div className="flex justify-end">
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

        {/* 7. SEO META SECTION */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
            </span>
          }
          key="7"
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
