import React, { useState, useEffect } from "react";
import {
  Collapse,
  Input,
  Select,
  Button,
  Tabs,
  Divider,
  theme as antdTheme,
} from "antd";
import {
  FiTarget,
  FiUsers,
  FiTool,
  FiBriefcase,
  FiStar,
  FiZap,
} from "react-icons/fi";
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

  // ---------------------- LANGUAGES ---------------------- //
  const translations = {
    en: {
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
      addLogo: "+ Add Partner Logo",
      saveLogos: "Save Company Logos",
      removeLogo: "Remove Logo",

      definesHeading: "Section Heading",
      saveDefines: "Save Defined Us",

      coreTitle: "Section Title",
      coreTitleN: "Core Title",
      coreDescN: "Core Description",
      saveCore: "Save Core Values",
    },
    vi: {
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

  // ---------------------- FETCH DATA ---------------------- //
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.heroSection)
        setHeroForm({ ...res.data.heroSection, bgFile: null });
      if (res.data?.whoWeAreSection)
        setWhoWeAreForm({ ...res.data.whoWeAreSection, whoWeAreFile: null });
      if (res.data?.whatWeDoSection)
        setWhatWeDoForm({
          ...res.data.whatWeDoSection,
          whatWeDoIcon1File: null,
          whatWeDoIcon2File: null,
          whatWeDoIcon3File: null,
          whatWeDoImg1File: null,
          whatWeDoImg2File: null,
          whatWeDoImg3File: null,
        });
      if (res.data?.companyLogosSection)
        setCompanyLogosForm({
          ...res.data.companyLogosSection,
          logos: res.data.companyLogosSection.logos || [],
        });
      if (res.data?.definedUsSection)
        setDefinedUsForm({
          ...res.data.definedUsSection,
          definedUsLogo1File: null,
          definedUsLogo2File: null,
          definedUsLogo3File: null,
          definedUsLogo4File: null,
          definedUsLogo5File: null,
          definedUsLogo6File: null,
        });
      if (res.data?.coreValuesSection)
        setCoreValuesForm({
          ...res.data.coreValuesSection,
          coreImageFile: null,
        });
    });
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

  // ---------------------- SAVE HANDLER ---------------------- //
  const handleSave = async (sectionName, formState, files = []) => {
    try {
      const formData = new FormData();

      if (sectionName === "companyLogosSection") {
        // 🔥 Clean logos array (remove .file so JSON is valid)
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

        // 🔥 Append files separately (partnerLogo0, partnerLogo1…)
        formState.logos.forEach((logo, i) => {
          if (logo.file) {
            formData.append(`partnerLogo${i}`, logo.file);
          }
        });
      } else {
        // Normal sections
        formData.append(sectionName, JSON.stringify(formState));
        files.forEach((fileKey) => {
          if (formState[fileKey]) {
            formData.append(fileKey, formState[fileKey]);
          }
        });
      }

      const res = await updateHomepage(formData);

      if (res.data?.homepage?.[sectionName]) {
        const updatedSection = res.data.homepage[sectionName];

        switch (sectionName) {
          case "companyLogosSection":
            setCompanyLogosForm({
              ...updatedSection,
              logos: updatedSection.logos.map((logo) => ({
                ...logo,
                file: null, // reset local file after save
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
        }

        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}.`, "error");
      }
    } catch (error) {
      CommonToaster("error", error.message || "Something went wrong!");
    }
  };

  // ---------------------- UI ---------------------- //
  return (
    <div className="max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl transition-all duration-300 dypages bg-[#0A0A0A]">
      <style>{`
        label {
          color: #fff !important;
        }
      `}</style>
      <h2 className="text-4xl font-extrabold mb-10 text-center tracking-wide text-white">
        Homepage Management
      </h2>

      <Collapse accordion bordered={false} className="text-white">
        {/* HERO */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2 text-white">
              <FiTarget /> Hero / Banner Section
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
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].heroTitle}
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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

          <h5 className="block font-medium mt-5 text-white">
            {translations[currentLang].background}
          </h5>
          <p className="text-sm text-gray-400 mt-5 mb-3">
            {translations[currentLang].recommendedHero}
          </p>

          {heroForm.bgFile ? (
            heroForm.bgFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(heroForm.bgFile)}
                alt="Hero Preview"
                className="w-48 mb-4 rounded-lg border"
              />
            ) : (
              <video
                src={URL.createObjectURL(heroForm.bgFile)}
                controls
                className="w-48 mb-4 rounded-lg border"
              />
            )
          ) : (
            heroForm.bgUrl &&
            (heroForm.bgType === "image" ? (
              <img
                src={getFullUrl(heroForm.bgUrl)}
                alt="Background"
                className="w-48 mb-4 rounded-lg"
              />
            ) : (
              <video
                src={getFullUrl(heroForm.bgUrl)}
                controls
                className="w-48 mb-4 rounded-lg"
              />
            ))
          )}

          <div className="mb-6">
            {/* Hidden input */}
            <input
              id="fileUpload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;
                setHeroForm({ ...heroForm, bgFile: file, bgUrl: "" });
              }}
            />

            {/* Styled label acts like button */}
            <label
              htmlFor="fileUpload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7", // blue
                color: "white",
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Upload icon */}
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
                  padding: "10px 20px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "500",
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

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
                  padding: "10px 20px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "500",
                }}
              >
                {/* Save Icon (Floppy Disk) */}
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

                {translations[currentLang].saveHero}
              </Button>
            </div>
          </div>
        </Panel>

        {/* WHO WE ARE */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              <FiUsers /> Who We Are Section
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
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whoHeading}
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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

          {whoWeAreForm.whoWeArebannerImage && !whoWeAreForm.whoWeAreFile && (
            <img
              src={getFullUrl(whoWeAreForm.whoWeArebannerImage)}
              alt="Who We Are Banner"
              className="w-48 mb-4 rounded-lg"
            />
          )}

          {whoWeAreForm.whoWeAreFile && (
            <img
              src={URL.createObjectURL(whoWeAreForm.whoWeAreFile)}
              alt="Preview"
              className="w-48 mb-4 rounded-lg"
            />
          )}

          <div className="mb-4">
            {/* Hidden input */}
            <input
              id="whoWeAreUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;
                setWhoWeAreForm({ ...whoWeAreForm, whoWeAreFile: file });
              }}
            />

            {/* Styled label as button */}
            <label
              htmlFor="whoWeAreUpload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7", // blue
                color: "white",
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
              Upload Image
            </label>
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {/* Save Icon (Floppy Disk) */}
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

              {translations[currentLang].saveWho}
            </Button>
          </div>
        </Panel>

        {/* WHAT WE DO */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              <FiTool /> What We Do Section
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
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].whatTitle}
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
                    backgroundColor: "#171717",
                    border: "1px solid #2d2d2d",
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
                  <div key={i} className="border rounded mt-4">
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].title} {i}
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
                        backgroundColor: "#171717",
                        border: "1px solid #2d2d2d",
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

                    {whatWeDoForm[`whatWeDoIcon${i}`] &&
                      !whatWeDoForm[`whatWeDoIcon${i}File`] && (
                        <img
                          src={getFullUrl(whatWeDoForm[`whatWeDoIcon${i}`])}
                          alt={`Icon ${i}`}
                          className="w-16 h-16 object-contain mb-2 rounded"
                        />
                      )}

                    {/* New file preview */}
                    {whatWeDoForm[`whatWeDoIcon${i}File`] && (
                      <img
                        src={URL.createObjectURL(
                          whatWeDoForm[`whatWeDoIcon${i}File`]
                        )}
                        alt={`Icon ${i} Preview`}
                        className="w-16 h-16 object-contain mb-2 rounded"
                      />
                    )}

                    <div className="mb-4">
                      {/* Hidden input */}
                      <input
                        id={`whatWeDoIcon${i}Upload`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!validateFileSize(file)) return;
                          setWhatWeDoForm({
                            ...whatWeDoForm,
                            [`whatWeDoIcon${i}File`]: file,
                          });
                        }}
                      />

                      {/* Styled label as button */}
                      <label
                        htmlFor={`whatWeDoIcon${i}Upload`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#0284C7", // blue
                          color: "white",
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
                        Upload Icon
                      </label>
                    </div>

                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].image} image{i}
                    </label>
                    <p className="text-xs text-slate-500 mb-1">
                      {translations[currentLang].recommendedImage}
                    </p>
                    {/* Saved DB preview */}
                    {whatWeDoForm[`whatWeDoImg${i}`] &&
                      !whatWeDoForm[`whatWeDoImg${i}File`] && (
                        <img
                          src={getFullUrl(whatWeDoForm[`whatWeDoImg${i}`])}
                          alt={`Image ${i}`}
                          className="w-32 mb-2 rounded"
                        />
                      )}

                    {/* New file preview */}
                    {whatWeDoForm[`whatWeDoImg${i}File`] && (
                      <img
                        src={URL.createObjectURL(
                          whatWeDoForm[`whatWeDoImg${i}File`]
                        )}
                        alt={`Image ${i} Preview`}
                        className="w-32 mb-2 rounded border"
                      />
                    )}

                    <div className="mb-4">
                      {/* Hidden input */}
                      <input
                        id={`whatWeDoImg${i}Upload`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!validateFileSize(file)) return;
                          setWhatWeDoForm({
                            ...whatWeDoForm,
                            [`whatWeDoImg${i}File`]: file,
                          });
                        }}
                      />

                      {/* Styled label as button */}
                      <label
                        htmlFor={`whatWeDoImg${i}Upload`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#0284C7", // blue
                          color: "white",
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
                        Upload Image
                      </label>
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {/* Edit/Cancel Icon */}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {/* Paper-plane Save Icon */}
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

              {translations[currentLang].saveWhat}
            </Button>
          </div>
        </Panel>

        {/* COMPANY LOGOS */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              <FiBriefcase /> Company Logos Section
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
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].logosHeading}
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

          <Divider>{translations[currentLang].partnerLogos}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedLogos}
          </p>
          {companyLogosForm.logos.map((logo, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              {logo.url && (
                <img
                  src={getFullUrl(logo.url)}
                  alt="Partner Logo"
                  className="w-20 h-20 object-contain"
                />
              )}
              <div className="">
                {/* Hidden Input */}
                <input
                  id={`companyLogoUpload-${index}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
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
                />

                {/* Styled Label as Button */}
                <label
                  htmlFor={`companyLogoUpload-${index}`}
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
                  Upload Logo
                </label>
              </div>

              <Button
                onClick={() => {
                  const updated = companyLogosForm.logos.filter(
                    (_, i) => i !== index
                  );
                  setCompanyLogosForm({ ...companyLogosForm, logos: updated });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "20px 20px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "500",
                }}
              >
                {/* Trash Icon */}
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>

                {translations[currentLang].removeLogo}
              </Button>
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
              backgroundColor: "#fff", // white button
              color: "#111827", // dark text
              border: "1px solid #ddd",
              padding: "10px 20px",
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {/* Save Icon (Floppy Disk) */}
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

              {translations[currentLang].saveLogos}
            </Button>
          </div>
        </Panel>

        {/* DEFINED US */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              <FiStar /> What Defines Us Section
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
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].definesHeading}
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
                  <div key={i} className="border rounded mb-4">
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].title} {i}
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
                        backgroundColor: "#171717",
                        border: "1px solid #2d2d2d",
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {/* Save Icon (Floppy Disk) */}
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

              {translations[currentLang].saveDefines}
            </Button>
          </div>
        </Panel>

        {/* CORE VALUES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              <FiZap /> Core Values Section
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
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium mt-5 mb-3">
                  {translations[currentLang].coreTitle}
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
                  <div key={i} className="border rounded mt-4">
                    <label className="font-medium mt-5 mb-3">
                      {translations[currentLang].coreTitleN} {i}
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
                        backgroundColor: "#171717",
                        border: "1px solid #2d2d2d",
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {/* Save Icon (Floppy Disk) */}
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

              {translations[currentLang].saveCore}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default HomePage;
