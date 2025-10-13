import React, { useState, useEffect } from "react";
import {
  Collapse,
  Input,
  Select,
  Button,
  Tabs,
  Divider,
  Modal,
  theme as antdTheme,
} from "antd";
import { Plus, Minus, RotateCw, X } from "lucide-react";
import { getHomepage, updateHomepage } from "../../Api/api";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";

const { Panel } = Collapse;
const { TabPane } = Tabs;

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

const HomePage = () => {
  // const { theme } = useTheme();
  const { useToken } = antdTheme;
  const { token } = useToken();

  const API_BASE = import.meta.env.VITE_API_URL;

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };
  const [currentLang, setCurrentLang] = useState("en");

  const [isVietnamese, setIsVietnamese] = useState(false);

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

  // ---------------------- LANGUAGES ---------------------- //
  const translations = {
    en: {
      heroSectionHeader: "Hero / Banner Section",
      whoSectionHeader: "Who We Are Section",
      whatSectionHeader: "What We Do Section",
      logosSectionHeader: "Company Logos Section",
      definesSectionHeader: "What Defines Us Section",
      coreSectionHeader: "Core Values Section",
      blogHeaderSection: "Blog Section",

      heroTitle: "Hero Title",
      heroDescription: "Hero Description",
      buttonText: "Button Text",
      buttonLink: "Button Link",
      background: "Background",
      recommendedHero: "Recommended: 1260×660px (Image) | Max Video Size: 10MB",
      cancel: "Cancel",
      saveHero: "Save Hero",

      whoHeading: "Heading",
      whoDescription: "Description",
      whoButtonText: "Button Text",
      whoButtonLink: "Button Link",
      bannerImage: "Banner Image",
      recommendedWho: "Recommended: 630×360px",
      saveWho: "Save Who We Are",

      whatTitle: "Section Title",
      whatDesc: "Section Description",
      title: "Title",
      desc: "Description",
      icon: "Icon",
      recommendedIcon: "Recommended: 64×64px (rounded)",
      image: "Image",
      recommendedImage: "Recommended: 350×325px",
      saveWhat: "Save What We Do",

      logosHeading: "Section Heading",
      partnerLogos: "Partner Logos",
      recommendedLogos: "Recommended: 250×250px",
      addLogo: "Add Partner Logo",
      saveLogos: "Save Company Logos",
      removeLogo: "Remove Logo",

      definesHeading: "Section Heading",
      saveDefines: "Save Defined Us",

      coreTitle: "Section Title",
      coreTitleN: "Core Title",
      coreDescN: "Core Description",
      saveCore: "Save Core Values",

      blogHeaderSection: "Blog Section",
      blogTitle: "Blog Title",
      blogDescription: "Blog Description",
      blogImage: "Blog Image",
      saveBlog: "Save Blog",
      cancel: "Cancel",

      bannerHeaderSection: "Banner Section",
      bannerTitle1: "Main Title",
      bannerTitle2: "Sub Title",
      bannerButtonText: "Button Text",
      bannerButtonLink: "Button Link",
      bannerBackgroundImage: "Background Image",
      saveBanner: "Save Banner",
      cancel: "Cancel",
    },
    vi: {
      heroSectionHeader: "Phần Banner / Trang chủ",
      whoSectionHeader: "Phần Giới thiệu",
      whatSectionHeader: "Phần Chúng tôi làm gì",
      logosSectionHeader: "Phần Logo đối tác",
      definesSectionHeader: "Phần Giá trị định nghĩa",
      coreSectionHeader: "Phần Giá trị cốt lõi",
      blogHeaderSection: "Phần Blog",

      heroTitle: "Tiêu đề chính",
      heroDescription: "Mô tả",
      buttonText: "Nút văn bản",
      buttonLink: "Liên kết nút",
      background: "Nền",
      recommendedHero:
        "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",
      cancel: "Hủy",
      saveHero: "Lưu Banner",

      whoHeading: "Tiêu đề",
      whoDescription: "Mô tả",
      whoButtonText: "Nút văn bản",
      whoButtonLink: "Liên kết nút",
      bannerImage: "Ảnh banner",
      recommendedWho: "Khuyến nghị: 630×360px",
      saveWho: "Lưu Giới thiệu",

      whatTitle: "Tiêu đề mục",
      whatDesc: "Mô tả mục",
      title: "Tiêu đề",
      desc: "Mô tả",
      icon: "Biểu tượng",
      recommendedIcon: "Khuyến nghị: 64×64px (bo tròn)",
      image: "Hình ảnh",
      recommendedImage: "Khuyến nghị: 350×325px",
      saveWhat: "Lưu Chúng tôi làm gì",

      logosHeading: "Tiêu đề mục",
      partnerLogos: "Logo đối tác",
      recommendedLogos: "Khuyến nghị: 250×250px",
      addLogo: "+ Thêm Logo đối tác",
      saveLogos: "Lưu Logo đối tác",
      removeLogo: "Xóa biểu tượng",

      definesHeading: "Tiêu đề mục",
      saveDefines: "Lưu Giá trị định nghĩa",

      coreTitle: "Tiêu đề mục",
      coreTitleN: "Tiêu đề giá trị",
      coreDescN: "Mô tả giá trị",
      saveCore: "Lưu Giá trị cốt lõi",

      blogHeaderSection: "Mục Blog",
      blogTitle: "Tiêu đề Blog",
      blogDescription: "Mô tả Blog",
      blogImage: "Hình ảnh Blog",
      saveBlog: "Lưu Blog",
      cancel: "Hủy",

      bannerHeaderSection: "Phần Banner",
      bannerTitle1: "Tiêu đề chính",
      bannerTitle2: "Tiêu đề phụ",
      bannerButtonText: "Văn bản nút",
      bannerButtonLink: "Liên kết nút",
      bannerBackgroundImage: "Hình nền",
      saveBanner: "Lưu Banner",
      cancel: "Hủy",
    },
  };

  // ---------------------- STATES ---------------------- //
  const [heroForm, setHeroForm] = useState({
    bgType: "image",
    bgUrl: "",
    heroTitle: { en: "", vi: "" },
    heroDescription: { en: "", vi: "" },
    heroButtonText: { en: "", vi: "" },
    heroButtonLink: { en: "", vi: "" },
    bgFile: null,
  });

  const [whoWeAreForm, setWhoWeAreForm] = useState({
    whoWeAreheading: { en: "", vi: "" },
    whoWeAredescription: { en: "", vi: "" },
    whoWeArebannerImage: "",
    whoWeArebuttonText: { en: "", vi: "" },
    whoWeArebuttonLink: { en: "", vi: "" },
    whoWeAreFile: null,
  });

  const [whatWeDoForm, setWhatWeDoForm] = useState({
    whatWeDoTitle: { en: "", vi: "" },
    whatWeDoDec: { en: "", vi: "" },
    whatWeDoTitle1: { en: "", vi: "" },
    whatWeDoDes1: { en: "", vi: "" },
    whatWeDoTitle2: { en: "", vi: "" },
    whatWeDoDes2: { en: "", vi: "" },
    whatWeDoTitle3: { en: "", vi: "" },
    whatWeDoDes3: { en: "", vi: "" },

    whatWeDoIcon1: "", // string URL from DB
    whatWeDoIcon1File: null, // file input
    whatWeDoIcon2: "",
    whatWeDoIcon2File: null,
    whatWeDoIcon3: "",
    whatWeDoIcon3File: null,

    whatWeDoImg1: "",
    whatWeDoImg1File: null,
    whatWeDoImg2: "",
    whatWeDoImg2File: null,
    whatWeDoImg3: "",
    whatWeDoImg3File: null,
  });

  // COMPANY LOGOS (Partners)
  const [companyLogosForm, setCompanyLogosForm] = useState({
    companyLogosHeading: { en: "", vi: "" },
    logos: [], // ✅ instead of companyLogo1..6
  });

  // DEFINED US
  const [definedUsForm, setDefinedUsForm] = useState({
    definedUsHeading: { en: "", vi: "" },
    definedUsTitle1: { en: "", vi: "" },
    definedUsDes1: { en: "", vi: "" },
    definedUsLogo1: "",
    definedUsLogo1File: null,
    definedUsTitle2: { en: "", vi: "" },
    definedUsDes2: { en: "", vi: "" },
    definedUsLogo2: "",
    definedUsLogo2File: null,
    definedUsTitle3: { en: "", vi: "" },
    definedUsDes3: { en: "", vi: "" },
    definedUsLogo3: "",
    definedUsLogo3File: null,
    definedUsTitle4: { en: "", vi: "" },
    definedUsDes4: { en: "", vi: "" },
    definedUsLogo4: "",
    definedUsLogo4File: null,
    definedUsTitle5: { en: "", vi: "" },
    definedUsDes5: { en: "", vi: "" },
    definedUsLogo5: "",
    definedUsLogo5File: null,
    definedUsTitle6: { en: "", vi: "" },
    definedUsDes6: { en: "", vi: "" },
    definedUsLogo6: "",
    definedUsLogo6File: null,
  });

  // CORE VALUES
  const [coreValuesForm, setCoreValuesForm] = useState({
    coreTitle: { en: "", vi: "" },
    coreTitle1: { en: "", vi: "" },
    coreDes1: { en: "", vi: "" },
    coreTitle2: { en: "", vi: "" },
    coreDes2: { en: "", vi: "" },
    coreTitle3: { en: "", vi: "" },
    coreDes3: { en: "", vi: "" },
    coreTitle4: { en: "", vi: "" },
    coreDes4: { en: "", vi: "" },
    coreImage: "",
    coreImageFile: null,
  });

  const [blogForm, setBlogForm] = useState({
    blogTitle: { en: "", vi: "" },
    blogDescription: { en: "", vi: "" },
  });

  const [bannerForm, setBannerForm] = useState({
    bannerTitle1: { en: "", vi: "" },
    bannerTitle2: { en: "", vi: "" },
    bannerButtonText: { en: "", vi: "" },
    bannerButtonLink: "",
    bannerBackgroundImage: null,
  });

  const [metaForm, setMetaForm] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });

  const [showBackgroundImageModal, setShowBackgroundImageModal] =
    useState(false);
  // ---------------------- FETCH DATA ---------------------- //
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const res = await getHomepage();
        const data = res.data || {};

        // ✅ HERO SECTION
        if (data.heroSection) {
          setHeroForm({
            ...data.heroSection,
            bgFile: null,
          });
        }

        // ✅ WHO WE ARE
        if (data.whoWeAreSection) {
          setWhoWeAreForm({
            ...data.whoWeAreSection,
            whoWeAreFile: null,
          });
        }

        // ✅ WHAT WE DO
        if (data.whatWeDoSection) {
          setWhatWeDoForm({
            ...data.whatWeDoSection,
            whatWeDoIcon1File: null,
            whatWeDoIcon2File: null,
            whatWeDoIcon3File: null,
            whatWeDoImg1File: null,
            whatWeDoImg2File: null,
            whatWeDoImg3File: null,
          });
        }

        // ✅ COMPANY LOGOS
        if (data.companyLogosSection) {
          setCompanyLogosForm({
            ...data.companyLogosSection,
            logos: data.companyLogosSection.logos || [],
          });
        }

        // ✅ DEFINED US
        if (data.definedUsSection) {
          setDefinedUsForm({
            ...data.definedUsSection,
            definedUsLogo1File: null,
            definedUsLogo2File: null,
            definedUsLogo3File: null,
            definedUsLogo4File: null,
            definedUsLogo5File: null,
            definedUsLogo6File: null,
          });
        }

        // ✅ CORE VALUES
        if (data.coreValuesSection) {
          setCoreValuesForm({
            ...data.coreValuesSection,
            coreImageFile: null,
          });
        }

        // ✅ BLOG SECTION
        if (data.blogSection) {
          setBlogForm({
            ...data.blogSection,
            blogImageFile: null,
          });
        }

        // ✅ BANNER SECTION
        if (data.bannerSection) {
          setBannerForm({
            ...data.bannerSection,
            bannerBackgroundImageFile: null,
          });
        }

        // ✅ SEO META SECTION
        if (data.seoMeta) {
          setMetaForm({
            metaTitle: data.seoMeta.metaTitle || { en: "", vi: "" },
            metaDescription: data.seoMeta.metaDescription || { en: "", vi: "" },
            metaKeywords: data.seoMeta.metaKeywords || { en: "", vi: "" },
          });
        } else {
          // If SEO data missing, initialize cleanly
          setMetaForm({
            metaTitle: { en: "", vi: "" },
            metaDescription: { en: "", vi: "" },
            metaKeywords: { en: "", vi: "" },
          });
        }
      } catch (error) {
        console.error("Failed to fetch homepage:", error);
      }
    };

    fetchHomepageData();
  }, []);

  // Size validate ////

  const validateFileSize = (file) => {
    if (!file) return true;

    // ✅ Video max 10MB
    if (file.type.startsWith("video/") && file.size > 10 * 1024 * 1024) {
      CommonToaster("Video size must be below 10MB!", "error");
      return false;
    }

    // ✅ Image max 2MB
    if (file.type.startsWith("image/") && file.size > 2 * 1024 * 1024) {
      CommonToaster("Image size must be below 2MB!", "error");
      return false;
    }

    return true;
  };

const handleSave = async (sectionName, formState, files = []) => {
  try {
    const formData = new FormData();

    /* ====================== 🧱 SPECIAL HANDLING ====================== */
    if (sectionName === "companyLogosSection") {
      // 🧩 Clean up logo array
      const cleanLogos = formState.logos.map((logo) => ({
        url: logo.url || "",
      }));

      formData.append(
        sectionName,
        JSON.stringify({
          ...formState,
          logos: cleanLogos,
        })
      );

      // 🖼️ Upload partner logos
      formState.logos.forEach((logo, i) => {
        if (logo.file instanceof File) {
          formData.append(`partnerLogo${i}`, logo.file);
        }
      });
    } 
    
    else if (sectionName === "seoMeta") {
      formData.append(sectionName, JSON.stringify(formState));
    } 
    
    else {
      // ✅ Normal sections
      formData.append(sectionName, JSON.stringify(formState));

      // ✅ Correct file key handling for all sections
      files.forEach((fileKey) => {
        const fileValue = formState[fileKey];
        if (fileValue instanceof File) {
          let uploadKey = `${sectionName}${fileKey}File`; // default pattern

          // ✅ Special case for banner section (backend expects different key)
          if (sectionName === "bannerSection" && fileKey === "bannerBackgroundImage") {
            uploadKey = "bannerBackgroundImageFile";
          }

          formData.append(uploadKey, fileValue);
        }
      });
    }

    /* ====================== 🚀 API CALL ====================== */
    const res = await updateHomepage(formData);
    const updatedData = res.data?.homepage;

    if (updatedData && updatedData[sectionName]) {
      const updatedSection = updatedData[sectionName];

      switch (sectionName) {
        case "companyLogosSection":
          setCompanyLogosForm({
            ...updatedSection,
            logos: updatedSection.logos.map((logo) => ({
              ...logo,
              file: null,
            })),
          });
          break;

        case "heroSection":
          setHeroForm({ ...updatedSection, bgFile: null });
          break;

        case "whoWeAreSection":
          setWhoWeAreForm({ ...updatedSection, whoWeAreFile: null });
          break;

        case "whatWeDoSection":
          setWhatWeDoForm({
            ...updatedSection,
            whatWeDoIcon1File: null,
            whatWeDoIcon2File: null,
            whatWeDoIcon3File: null,
            whatWeDoImg1File: null,
            whatWeDoImg2File: null,
            whatWeDoImg3File: null,
          });
          break;

        case "definedUsSection":
          setDefinedUsForm({
            ...updatedSection,
            definedUsLogo1File: null,
            definedUsLogo2File: null,
            definedUsLogo3File: null,
            definedUsLogo4File: null,
            definedUsLogo5File: null,
            definedUsLogo6File: null,
          });
          break;

        case "coreValuesSection":
          setCoreValuesForm({ ...updatedSection, coreImageFile: null });
          break;

        case "bannerSection":
          setBannerForm({
            ...updatedSection,
            bannerBackgroundImagePreview: getFullUrl(updatedSection.bannerBackgroundImage),
          });
          break;

        default:
          break;
      }

      CommonToaster(`${sectionName} saved successfully!`, "success");
    } else {
      CommonToaster(`Failed to save ${sectionName}.`, "error");
    }
  } catch (error) {
    console.error("❌ Save failed:", error);
    CommonToaster("Error", error.message || "Something went wrong!");
  }
};



  const [showWhoImageModal, setShowWhoImageModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(null);
  const [showImageModal, setShowImageModal] = useState(null);
  const [showLogoModal, setShowLogoModal] = useState(null);

  // ---------------------- UI ---------------------- //
  return (
    <div className="max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl transition-all duration-300 dypages bg-[#171717]">
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
      `}</style>
      <h2 className="text-4xl font-extrabold mb-10 text-center tracking-wide text-white">
        {isVietnamese ? "Trang chủ" : "Home Page"}
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
        {/* HERO */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2 text-white">
              {isVietnamese
                ? translations.vi.heroSectionHeader
                : translations.en.heroSectionHeader}
            </span>
          }
          key="1"
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].heroTitle}
                </label>
                <Input
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={heroForm.heroTitle[lang]}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      heroTitle: {
                        ...heroForm.heroTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].heroDescription}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={heroForm.heroDescription[lang]}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      heroDescription: {
                        ...heroForm.heroDescription,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].buttonText}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={heroForm.heroButtonText[lang]}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      heroButtonText: {
                        ...heroForm.heroButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].buttonLink}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={heroForm.heroButtonLink[lang]}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      heroButtonLink: {
                        ...heroForm.heroButtonLink,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <h5 className="block font-medium !mt-5 text-white">
            {translations[currentLang].background}
          </h5>
          <p className="text-sm text-gray-400 mt-5 mb-3">
            {translations[currentLang].recommendedHero}
          </p>

          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-2">
              {isVietnamese
                ? "Hình nền Hero / Video"
                : "Hero Background Image / Video"}
              <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- Upload Box (if no file uploaded) --- */}
              {!heroForm.bgFile && !heroForm.bgUrl ? (
                <label
                  htmlFor="fileUpload"
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
                    id="fileUpload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setHeroForm({ ...heroForm, bgFile: file, bgUrl: "" });
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                // --- Preview Box (when uploaded or existing) ---
                <div className="relative w-32 h-32 group">
                  {heroForm.bgFile ? (
                    heroForm.bgFile.type.startsWith("video/") ? (
                      <video
                        src={URL.createObjectURL(heroForm.bgFile)}
                        className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                        muted
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(heroForm.bgFile)}
                        alt="Hero Preview"
                        className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                      />
                    )
                  ) : heroForm.bgUrl && heroForm.bgType === "video" ? (
                    <video
                      src={getFullUrl(heroForm.bgUrl)}
                      className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                      muted
                    />
                  ) : (
                    <img
                      src={getFullUrl(heroForm.bgUrl)}
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
                    htmlFor="changeHeroUpload"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi" : "Change File"}
                  >
                    <input
                      id="changeHeroUpload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setHeroForm({ ...heroForm, bgFile: file, bgUrl: "" });
                      }}
                      style={{ display: "none" }}
                    />
                    <RotateCw className="w-4 h-4" />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      setHeroForm({ ...heroForm, bgFile: null, bgUrl: "" })
                    }
                    className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                    title={isVietnamese ? "Xóa" : "Remove File"}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* 🖼 Modal (Full Preview) */}
            <Modal
              open={showHeroModal}
              footer={null}
              onCancel={() => setShowHeroModal(false)}
              centered
              width={500}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {heroForm.bgFile ? (
                heroForm.bgFile.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(heroForm.bgFile)}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(heroForm.bgFile)}
                    alt="Full Hero Preview"
                    className="w-full h-auto rounded-lg"
                  />
                )
              ) : heroForm.bgType === "video" ? (
                <video
                  src={getFullUrl(heroForm.bgUrl)}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  src={getFullUrl(heroForm.bgUrl)}
                  alt="Full Hero Background"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </Modal>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <div className="flex justify-end gap-4 mt-6">
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
                }}
              >
                {translations[currentLang].cancel}
              </Button>

              {/* Save Button (Blue) */}
              <Button
                onClick={() => handleSave("heroSection", heroForm, ["bgFile"])}
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
                }}
              >
                {translations[currentLang].saveHero}
              </Button>
            </div>
          </div>
        </Panel>

        {/* WHO WE ARE */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.whoSectionHeader
                : translations.en.whoSectionHeader}
            </span>
          }
          key="2"
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whoHeading}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={whoWeAreForm.whoWeAreheading[lang]}
                  onChange={(e) =>
                    setWhoWeAreForm({
                      ...whoWeAreForm,
                      whoWeAreheading: {
                        ...whoWeAreForm.whoWeAreheading,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whoDescription}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={whoWeAreForm.whoWeAredescription[lang]}
                  onChange={(e) =>
                    setWhoWeAreForm({
                      ...whoWeAreForm,
                      whoWeAredescription: {
                        ...whoWeAreForm.whoWeAredescription,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whoButtonText}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={whoWeAreForm.whoWeArebuttonText[lang]}
                  onChange={(e) =>
                    setWhoWeAreForm({
                      ...whoWeAreForm,
                      whoWeArebuttonText: {
                        ...whoWeAreForm.whoWeArebuttonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whoButtonLink}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={whoWeAreForm.whoWeArebuttonLink[lang]}
                  onChange={(e) =>
                    setWhoWeAreForm({
                      ...whoWeAreForm,
                      whoWeArebuttonLink: {
                        ...whoWeAreForm.whoWeArebuttonLink,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className="block font-medium mt-5 mb-3">
            {translations[currentLang].bannerImage}
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedWho}
          </p>

          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-2">
              {isVietnamese ? "Ảnh Banner" : "Banner Image"}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- Upload Box (if no image) --- */}
              {!whoWeAreForm.whoWeAreFile &&
              !whoWeAreForm.whoWeArebannerImage ? (
                <label
                  htmlFor="whoWeAreUpload"
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
                  <span className="mt-2 text-sm text-gray-400">
                    {isVietnamese ? "Tải ảnh lên" : "Upload Image"}
                  </span>
                  <input
                    id="whoWeAreUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setWhoWeAreForm({ ...whoWeAreForm, whoWeAreFile: file });
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                // --- Preview Image Box (when uploaded) ---
                <div className="relative w-32 h-32 group">
                  <img
                    src={
                      whoWeAreForm.whoWeAreFile
                        ? URL.createObjectURL(whoWeAreForm.whoWeAreFile)
                        : getFullUrl(whoWeAreForm.whoWeArebannerImage)
                    }
                    alt="Who We Are Banner"
                    className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                  />

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowWhoImageModal(true)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={isVietnamese ? "Xem ảnh đầy đủ" : "View Full"}
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
                    htmlFor="changeWhoWeAreImage"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi ảnh" : "Change Image"}
                  >
                    <input
                      id="changeWhoWeAreImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setWhoWeAreForm({
                          ...whoWeAreForm,
                          whoWeAreFile: file,
                        });
                      }}
                      style={{ display: "none" }}
                    />
                    <RotateCw className="w-4 h-4" />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      setWhoWeAreForm({
                        ...whoWeAreForm,
                        whoWeAreFile: null,
                        whoWeArebannerImage: "",
                      })
                    }
                    className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                    title={isVietnamese ? "Xóa ảnh" : "Remove Image"}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* 🖼 Modal (Full View) */}
            <Modal
              open={showWhoImageModal}
              footer={null}
              onCancel={() => setShowWhoImageModal(false)}
              centered
              width={400}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              <img
                src={
                  whoWeAreForm.whoWeAreFile
                    ? URL.createObjectURL(whoWeAreForm.whoWeAreFile)
                    : getFullUrl(whoWeAreForm.whoWeArebannerImage)
                }
                alt="Full Preview"
                className="w-full h-auto rounded-lg"
              />
            </Modal>
          </div>

          <div className="flex justify-end gap-4 mt-6">
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
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("whoWeAreSection", whoWeAreForm, ["whoWeAreFile"])
              }
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
              }}
            >
              {translations[currentLang].saveWho}
            </Button>
          </div>
        </Panel>

        {/* WHAT WE DO */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.whatSectionHeader
                : translations.en.whatSectionHeader}
            </span>
          }
          key="3"
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whatTitle}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={whatWeDoForm.whatWeDoTitle[lang]}
                  onChange={(e) =>
                    setWhatWeDoForm({
                      ...whatWeDoForm,
                      whatWeDoTitle: {
                        ...whatWeDoForm.whatWeDoTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whatDesc}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={whatWeDoForm.whatWeDoDec[lang]}
                  onChange={(e) =>
                    setWhatWeDoForm({
                      ...whatWeDoForm,
                      whatWeDoDec: {
                        ...whatWeDoForm.whatWeDoDec,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {[1, 2, 3].map((i) => (
                  <div key={i} className=" rounded mt-4">
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].title} {i}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#2E2F2F",
                        border: "1px solid #262626",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        margin: "8px 0 18px",
                      }}
                      value={whatWeDoForm[`whatWeDoTitle${i}`][lang]}
                      onChange={(e) =>
                        setWhatWeDoForm({
                          ...whatWeDoForm,
                          [`whatWeDoTitle${i}`]: {
                            ...whatWeDoForm[`whatWeDoTitle${i}`],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].desc} {i}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#2E2F2F",
                        border: "1px solid #262626",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        margin: "8px 0 18px",
                      }}
                      value={whatWeDoForm[`whatWeDoDes${i}`][lang]}
                      onChange={(e) =>
                        setWhatWeDoForm({
                          ...whatWeDoForm,
                          [`whatWeDoDes${i}`]: {
                            ...whatWeDoForm[`whatWeDoDes${i}`],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].icon} {i}
                    </label>
                    <p className="text-xs text-slate-500 mb-1">
                      {translations[currentLang].recommendedIcon}
                    </p>

                    <div className="mb-6">
                      <label className="block text-white text-lg font-semibold mb-2">
                        {isVietnamese ? `Biểu tượng ${i}` : `Icon ${i}`}{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="flex flex-wrap gap-4 mt-2">
                        {/* --- Upload Box (Empty State) --- */}
                        {!whatWeDoForm[`whatWeDoIcon${i}File`] &&
                        !whatWeDoForm[`whatWeDoIcon${i}`] ? (
                          <label
                            htmlFor={`whatWeDoIcon${i}Upload`}
                            className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                            <span className="mt-2 text-sm text-gray-400">
                              {isVietnamese
                                ? "Tải lên biểu tượng"
                                : "Upload Icon"}
                            </span>
                            <input
                              id={`whatWeDoIcon${i}Upload`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (!validateFileSize(file)) return;
                                setWhatWeDoForm({
                                  ...whatWeDoForm,
                                  [`whatWeDoIcon${i}File`]: file,
                                });
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        ) : (
                          // --- Preview Box (When Uploaded) ---
                          <div className="relative w-28 h-28 group">
                            <img
                              src={
                                whatWeDoForm[`whatWeDoIcon${i}File`]
                                  ? URL.createObjectURL(
                                      whatWeDoForm[`whatWeDoIcon${i}File`]
                                    )
                                  : getFullUrl(whatWeDoForm[`whatWeDoIcon${i}`])
                              }
                              alt={`Icon ${i}`}
                              className="w-full h-full object-contain rounded-lg border border-[#2E2F2F] bg-[#141414]"
                            />

                            {/* 👁 View Full */}
                            <button
                              type="button"
                              onClick={() => setShowIconModal(i)}
                              className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title={
                                isVietnamese ? "Xem biểu tượng" : "View Full"
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
                              htmlFor={`changeWhatWeDoIcon${i}`}
                              className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                              title={isVietnamese ? "Thay đổi" : "Change Icon"}
                            >
                              <input
                                id={`changeWhatWeDoIcon${i}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  if (!validateFileSize(file)) return;
                                  setWhatWeDoForm({
                                    ...whatWeDoForm,
                                    [`whatWeDoIcon${i}File`]: file,
                                  });
                                }}
                                style={{ display: "none" }}
                              />
                              <RotateCw className="w-4 h-4" />
                            </label>

                            {/* ❌ Remove */}
                            <button
                              type="button"
                              onClick={() => {
                                setWhatWeDoForm({
                                  ...whatWeDoForm,
                                  [`whatWeDoIcon${i}File`]: null,
                                  [`whatWeDoIcon${i}`]: "",
                                });
                              }}
                              className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                              title={
                                isVietnamese ? "Xóa biểu tượng" : "Remove Icon"
                              }
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 🖼 Modal (Full Preview for Each Icon) */}
                      <Modal
                        open={showIconModal === i}
                        footer={null}
                        onCancel={() => setShowIconModal(null)}
                        centered
                        width={400}
                        bodyStyle={{ background: "#000", padding: "0" }}
                      >
                        <img
                          src={
                            whatWeDoForm[`whatWeDoIcon${i}File`]
                              ? URL.createObjectURL(
                                  whatWeDoForm[`whatWeDoIcon${i}File`]
                                )
                              : getFullUrl(whatWeDoForm[`whatWeDoIcon${i}`])
                          }
                          alt={`Full Icon ${i}`}
                          className="w-full h-auto rounded-lg"
                        />
                      </Modal>
                    </div>

                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].image} image{i}
                    </label>
                    <p className="text-xs text-slate-500 mb-1">
                      {translations[currentLang].recommendedImage}
                    </p>
                    <div className="mb-6">
                      <label className="block text-white text-lg font-semibold mb-2">
                        {isVietnamese ? `Hình ảnh ${i}` : `Image ${i}`}{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="flex flex-wrap gap-4 mt-2">
                        {/* --- Upload Box (if empty) --- */}
                        {!whatWeDoForm[`whatWeDoImg${i}File`] &&
                        !whatWeDoForm[`whatWeDoImg${i}`] ? (
                          <label
                            htmlFor={`whatWeDoImg${i}Upload`}
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
                            <span className="mt-2 text-sm text-gray-400">
                              {isVietnamese
                                ? "Tải lên hình ảnh"
                                : "Upload Image"}
                            </span>
                            <input
                              id={`whatWeDoImg${i}Upload`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (!validateFileSize(file)) return;
                                setWhatWeDoForm({
                                  ...whatWeDoForm,
                                  [`whatWeDoImg${i}File`]: file,
                                });
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        ) : (
                          // --- Preview (when uploaded or from DB) ---
                          <div className="relative w-32 h-32 group">
                            <img
                              src={
                                whatWeDoForm[`whatWeDoImg${i}File`]
                                  ? URL.createObjectURL(
                                      whatWeDoForm[`whatWeDoImg${i}File`]
                                    )
                                  : getFullUrl(whatWeDoForm[`whatWeDoImg${i}`])
                              }
                              alt={`Image ${i}`}
                              className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                            />

                            {/* 👁 View Full */}
                            <button
                              type="button"
                              onClick={() => setShowImageModal(i)}
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
                              htmlFor={`changeWhatWeDoImg${i}`}
                              className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                              title={
                                isVietnamese ? "Thay đổi hình" : "Change Image"
                              }
                            >
                              <input
                                id={`changeWhatWeDoImg${i}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  if (!validateFileSize(file)) return;
                                  setWhatWeDoForm({
                                    ...whatWeDoForm,
                                    [`whatWeDoImg${i}File`]: file,
                                  });
                                }}
                                style={{ display: "none" }}
                              />
                              <RotateCw className="w-4 h-4" />
                            </label>

                            {/* ❌ Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                setWhatWeDoForm({
                                  ...whatWeDoForm,
                                  [`whatWeDoImg${i}File`]: null,
                                  [`whatWeDoImg${i}`]: "",
                                })
                              }
                              className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                              title={isVietnamese ? "Xóa hình" : "Remove Image"}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 🖼 Modal (Full Image View) */}
                      <Modal
                        open={showImageModal === i}
                        footer={null}
                        onCancel={() => setShowImageModal(null)}
                        centered
                        width={400}
                        bodyStyle={{ background: "#000", padding: "0" }}
                      >
                        <img
                          src={
                            whatWeDoForm[`whatWeDoImg${i}File`]
                              ? URL.createObjectURL(
                                  whatWeDoForm[`whatWeDoImg${i}File`]
                                )
                              : getFullUrl(whatWeDoForm[`whatWeDoImg${i}`])
                          }
                          alt={`Full Image ${i}`}
                          className="w-full h-auto rounded-lg"
                        />
                      </Modal>
                    </div>
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>
          <div className="flex justify-end gap-4 mt-6">
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
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("whatWeDoSection", whatWeDoForm, [
                  "whatWeDoIcon1File",
                  "whatWeDoIcon2File",
                  "whatWeDoIcon3File",
                  "whatWeDoImg1File",
                  "whatWeDoImg2File",
                  "whatWeDoImg3File",
                ])
              }
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
              }}
            >
              {translations[currentLang].saveWhat}
            </Button>
          </div>
        </Panel>

        {/* COMPANY LOGOS */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.logosSectionHeader
                : translations.en.logosSectionHeader}
            </span>
          }
          key="4"
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].logosHeading}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  value={companyLogosForm.companyLogosHeading[lang]}
                  onChange={(e) =>
                    setCompanyLogosForm({
                      ...companyLogosForm,
                      companyLogosHeading: {
                        ...companyLogosForm.companyLogosHeading,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <h3 className="text-white !mt-5">
            {translations[currentLang].partnerLogos}
          </h3>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedLogos}
          </p>
          {companyLogosForm.logos.map((logo, index) => (
            <div key={index} className="mb-4">
              <label className="block text-white text-lg font-semibold mb-2">
                {isVietnamese
                  ? `Logo ${index + 1}`
                  : `Company Logo ${index + 1}`}
                <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap gap-4 mt-2 items-center">
                {/* --- Upload Box (Empty State) --- */}
                {!logo.file && !logo.url ? (
                  <label
                    htmlFor={`companyLogoUpload-${index}`}
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
                    <span className="mt-2 text-sm text-gray-400">
                      {isVietnamese ? "Tải lên logo" : "Upload Logo"}
                    </span>
                    <input
                      id={`companyLogoUpload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        const updated = [...companyLogosForm.logos];
                        updated[index].file = file;
                        setCompanyLogosForm({
                          ...companyLogosForm,
                          logos: updated,
                        });
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                ) : (
                  // --- Preview Box (with hover icons) ---
                  <div className="relative w-32 h-32 group">
                    <img
                      src={
                        logo.file
                          ? URL.createObjectURL(logo.file)
                          : getFullUrl(logo.url)
                      }
                      alt="Company Logo"
                      className="w-full h-full object-contain rounded-lg border border-[#2E2F2F] bg-[#141414]"
                    />

                    {/* 👁 View Full */}
                    <button
                      type="button"
                      onClick={() => setShowLogoModal(index)}
                      className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title={isVietnamese ? "Xem logo" : "View Full"}
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
                      htmlFor={`changeCompanyLogo-${index}`}
                      className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                      title={isVietnamese ? "Thay đổi logo" : "Change Logo"}
                    >
                      <input
                        id={`changeCompanyLogo-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!validateFileSize(file)) return;
                          const updated = [...companyLogosForm.logos];
                          updated[index].file = file;
                          setCompanyLogosForm({
                            ...companyLogosForm,
                            logos: updated,
                          });
                        }}
                        style={{ display: "none" }}
                      />
                      <RotateCw className="w-4 h-4" />
                    </label>

                    {/* ❌ Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...companyLogosForm.logos];
                        updated.splice(index, 1);
                        setCompanyLogosForm({
                          ...companyLogosForm,
                          logos: updated,
                        });
                      }}
                      className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                      title={isVietnamese ? "Xóa logo" : "Remove Logo"}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* 🖼 Modal (Full Preview) */}
              <Modal
                open={showLogoModal === index}
                footer={null}
                onCancel={() => setShowLogoModal(null)}
                centered
                width={400}
                bodyStyle={{ background: "#000", padding: "0" }}
              >
                <img
                  src={
                    logo.file
                      ? URL.createObjectURL(logo.file)
                      : getFullUrl(logo.url)
                  }
                  alt="Full Logo Preview"
                  className="w-full h-auto rounded-lg"
                />
              </Modal>
            </div>
          ))}

          <Button
            onClick={() =>
              setCompanyLogosForm({
                ...companyLogosForm,
                logos: [...companyLogosForm.logos, { url: "", file: null }],
              })
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#0085C8", // white button
              color: "#fff", // dark text
              border: "1px solid #0085C8",
              padding: "22px",
              borderRadius: "9999px", // pill shape
              fontWeight: "500",
              marginTop: "12px",
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

            {translations[currentLang].addLogo}
          </Button>

          <div className="flex justify-end gap-4 mt-6">
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
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave(
                  "companyLogosSection",
                  companyLogosForm,
                  companyLogosForm.logos.map((_, i) => `partnerLogo${i}`)
                )
              }
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
              }}
            >
              {translations[currentLang].saveLogos}
            </Button>
          </div>
        </Panel>

        {/* DEFINED US */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.definesSectionHeader
                : translations.en.definesSectionHeader}
            </span>
          }
          key="5"
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].definesHeading}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    margin: "1px 0 18px",
                  }}
                  value={definedUsForm.definedUsHeading[lang]}
                  onChange={(e) =>
                    setDefinedUsForm({
                      ...definedUsForm,
                      definedUsHeading: {
                        ...definedUsForm.definedUsHeading,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className=" rounded mb-4">
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].title} {i}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#2E2F2F",
                        border: "1px solid #262626",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        margin: "8px 0 8px",
                      }}
                      value={definedUsForm[`definedUsTitle${i}`][lang]}
                      onChange={(e) =>
                        setDefinedUsForm({
                          ...definedUsForm,
                          [`definedUsTitle${i}`]: {
                            ...definedUsForm[`definedUsTitle${i}`],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].desc} {i}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#2E2F2F",
                        border: "1px solid #262626",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        margin: "8px 0 18px",
                      }}
                      value={definedUsForm[`definedUsDes${i}`][lang]}
                      onChange={(e) =>
                        setDefinedUsForm({
                          ...definedUsForm,
                          [`definedUsDes${i}`]: {
                            ...definedUsForm[`definedUsDes${i}`],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
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
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() => handleSave("definedUsSection", definedUsForm)}
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
              }}
            >
              {translations[currentLang].saveDefines}
            </Button>
          </div>
        </Panel>

        {/* CORE VALUES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.coreSectionHeader
                : translations.en.coreSectionHeader}
            </span>
          }
          key="6"
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].coreTitle}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    margin: "1px 0 8px",
                  }}
                  value={coreValuesForm.coreTitle[lang]}
                  onChange={(e) =>
                    setCoreValuesForm({
                      ...coreValuesForm,
                      coreTitle: {
                        ...coreValuesForm.coreTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                {[1, 2, 3].map((i) => (
                  <div key={i} className=" rounded mt-4">
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].coreTitleN} {i}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#2E2F2F",
                        border: "1px solid #262626",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        margin: "8px 0 18px",
                      }}
                      value={coreValuesForm[`coreTitle${i}`][lang]}
                      onChange={(e) =>
                        setCoreValuesForm({
                          ...coreValuesForm,
                          [`coreTitle${i}`]: {
                            ...coreValuesForm[`coreTitle${i}`],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].coreDescN} {i}
                    </label>
                    <Input
                      style={{
                        backgroundColor: "#2E2F2F",
                        border: "1px solid #262626",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        margin: "8px 0 18px",
                      }}
                      value={coreValuesForm[`coreDes${i}`][lang]}
                      onChange={(e) =>
                        setCoreValuesForm({
                          ...coreValuesForm,
                          [`coreDes${i}`]: {
                            ...coreValuesForm[`coreDes${i}`],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>
          <div className="flex justify-end gap-4 mt-6">
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
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("coreValuesSection", coreValuesForm, ["coreImage"])
              }
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
              }}
            >
              {translations[currentLang].saveCore}
            </Button>
          </div>
        </Panel>

        {/* Blog */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.blogHeaderSection
                : translations.en.blogHeaderSection}
            </span>
          }
          key="7"
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
                {/* Blog Title */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].blogTitle || "Blog Title"}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    margin: "1px 0 8px",
                  }}
                  value={blogForm.blogTitle?.[lang] || ""}
                  onChange={(e) =>
                    setBlogForm({
                      ...blogForm,
                      blogTitle: {
                        ...blogForm.blogTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* Blog Description */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].blogDescription ||
                    "Blog Description"}
                </label>
                <Input.TextArea
                  rows={4}
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    margin: "8px 0 18px",
                  }}
                  value={blogForm.blogDescription?.[lang] || ""}
                  onChange={(e) =>
                    setBlogForm({
                      ...blogForm,
                      blogDescription: {
                        ...blogForm.blogDescription,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
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
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSave("blogSection", blogForm, ["blogImage"])}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "none",
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              {translations[currentLang].saveBlog || "Save Blog"}
            </Button>
          </div>
        </Panel>

        {/* Banner Section */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese
                ? translations.vi.bannerHeaderSection
                : translations.en.bannerHeaderSection}
            </span>
          }
          key="8"
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
                {/* Title 1 */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].bannerTitle1}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                  value={bannerForm.bannerTitle1?.[lang] || ""}
                  onChange={(e) =>
                    setBannerForm({
                      ...bannerForm,
                      bannerTitle1: {
                        ...bannerForm.bannerTitle1,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* Title 2 */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].bannerTitle2}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                  value={bannerForm.bannerTitle2?.[lang] || ""}
                  onChange={(e) =>
                    setBannerForm({
                      ...bannerForm,
                      bannerTitle2: {
                        ...bannerForm.bannerTitle2,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* Button Text */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].bannerButtonText}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                  value={bannerForm.bannerButtonText?.[lang] || ""}
                  onChange={(e) =>
                    setBannerForm({
                      ...bannerForm,
                      bannerButtonText: {
                        ...bannerForm.bannerButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* Button Link (URL - same for all languages) */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].bannerButtonLink}
                </label>
                <Input
                  style={{
                    backgroundColor: "#2E2F2F",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                  value={bannerForm.bannerButtonLink || ""}
                  onChange={(e) =>
                    setBannerForm({
                      ...bannerForm,
                      bannerButtonLink: e.target.value,
                    })
                  }
                />

                {/* Background Image Upload */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {translations[currentLang].bannerBackgroundImage}
                </label>

                <div className="flex flex-wrap gap-4 mt-2">
                  {!bannerForm.bannerBackgroundImage &&
                  !bannerForm.bannerBackgroundImagePreview ? (
                    // 📁 Upload Placeholder
                    <label
                      htmlFor="bannerBackgroundImageUpload"
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
                        {currentLang === "vi"
                          ? "Tải lên hình nền"
                          : "Upload Background Image"}
                      </span>
                      <input
                        id="bannerBackgroundImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const previewUrl = URL.createObjectURL(file);
                          setBannerForm((prev) => ({
                            ...prev,
                            bannerBackgroundImage: file,
                            bannerBackgroundImagePreview: previewUrl,
                          }));
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                  ) : (
                    // ✅ Uploaded Image Preview
                    <div className="relative group w-40 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                      <img
                        src={
                          bannerForm.bannerBackgroundImagePreview
                            ? bannerForm.bannerBackgroundImagePreview
                            : getFullUrl(bannerForm.bannerBackgroundImage)
                        }
                        alt="Background"
                        className="w-full h-full object-cover"
                      />

                      {/* 👁 View Full */}
                      <button
                        type="button"
                        onClick={() => setShowBackgroundImageModal(true)}
                        className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title={
                          currentLang === "vi"
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
                        htmlFor="bannerBackgroundImageUploadChange"
                        className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                        title={
                          currentLang === "vi" ? "Thay đổi" : "Change File"
                        }
                      >
                        <input
                          id="bannerBackgroundImageUploadChange"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const previewUrl = URL.createObjectURL(file);
                            setBannerForm((prev) => ({
                              ...prev,
                              bannerBackgroundImage: file,
                              bannerBackgroundImagePreview: previewUrl,
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
                          setBannerForm((prev) => ({
                            ...prev,
                            bannerBackgroundImage: "",
                            bannerBackgroundImagePreview: "",
                          }))
                        }
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                        title={currentLang === "vi" ? "Xóa" : "Remove"}
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

                {/* 🪟 Full Preview Modal */}
                {showBackgroundImageModal && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative w-[90vw] max-w-4xl">
                      <button
                        type="button"
                        onClick={() => setShowBackgroundImageModal(false)}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 !text-white p-2 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <img
                        src={
                          bannerForm.bannerBackgroundImagePreview
                            ? bannerForm.bannerBackgroundImagePreview
                            : getFullUrl(bannerForm.bannerBackgroundImage)
                        }
                        alt="Full Background"
                        className="w-full rounded-lg"
                      />
                    </div>
                  </div>
                )}
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
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() =>
                handleSave("bannerSection", bannerForm, [
                  "bannerBackgroundImage",
                ])
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7",
                color: "#fff",
                border: "none",
                padding: "22px",
                borderRadius: "9999px",
                fontWeight: "500",
              }}
            >
              {translations[currentLang].saveBanner}
            </Button>
          </div>
        </Panel>
        {/* SEO META SECTION */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
            </span>
          }
          key="9"
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
                <Input
                  className="!placeholder-gray-400"
                  placeholder={
                    lang === "vi"
                      ? "Nhập tiêu đề Meta..."
                      : "Enter Meta Title..."
                  }
                  style={inputStyle}
                  value={metaForm.metaTitle?.[lang] || ""}
                  onChange={(e) =>
                    setMetaForm({
                      ...metaForm,
                      metaTitle: {
                        ...metaForm.metaTitle,
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
                  placeholder={
                    lang === "vi"
                      ? "Nhập mô tả Meta (dưới 160 ký tự)..."
                      : "Enter Meta Description (under 160 chars)..."
                  }
                  rows={3}
                  style={inputStyle}
                  value={metaForm.metaDescription?.[lang] || ""}
                  onChange={(e) =>
                    setMetaForm({
                      ...metaForm,
                      metaDescription: {
                        ...metaForm.metaDescription,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* ✅ Meta Keywords Tag Input (Styled like your previous design) */}
                <div className="mt-6">
                  <label className="block font-medium mb-3 text-white">
                    {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                    <span className="text-red-500 text-lg ml-1">*</span>
                  </label>

                  {/* Tags container */}
                  <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#1C1C1C] border border-[#2E2F2F] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all">
                    {metaForm.metaKeywords?.[lang]
                      ?.split(",")
                      .map((kw) => kw.trim())
                      .filter((kw) => kw)
                      .map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-sm flex items-center gap-2 text-gray-200 shadow-sm"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => {
                              const existing =
                                metaForm.metaKeywords?.[lang]
                                  ?.split(",")
                                  .map((k) => k.trim()) || [];
                              const updated = existing.filter((k) => k !== kw);
                              setMetaForm({
                                ...metaForm,
                                metaKeywords: {
                                  ...metaForm.metaKeywords,
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

                    {/* Input field for adding new keywords */}
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
                            metaForm.metaKeywords?.[lang]
                              ?.split(",")
                              .map((k) => k.trim()) || [];
                          const updated = [
                            ...new Set([...existing, newKeyword]),
                          ]; // no duplicates
                          setMetaForm({
                            ...metaForm,
                            metaKeywords: {
                              ...metaForm.metaKeywords,
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

          <div className="flex justify-end gap-4 mt-8">
            {/* Cancel Button */}
            <Button
              onClick={() => window.location.reload()}
              style={cancelButtonStyle}
            >
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSave("seoMeta", metaForm)}
              style={saveButtonStyle}
            >
              {currentLang === "vi" ? "Lưu SEO Meta" : "Save SEO Meta"}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default HomePage;

const inputStyle = {
  backgroundColor: "#2E2F2F",
  border: "1px solid #262626",
  borderRadius: "8px",
  color: "#fff",
  padding: "10px 14px",
  fontSize: "14px",
  marginBottom: "12px",
  "::placeholder": { color: "#888" },
};

const cancelButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "transparent",
  color: "#fff",
  border: "1px solid #333",
  padding: "22px",
  borderRadius: "9999px",
  fontWeight: "500",
};

const saveButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#0284C7",
  color: "#fff",
  border: "none",
  padding: "22px",
  borderRadius: "9999px",
  fontWeight: "500",
};
