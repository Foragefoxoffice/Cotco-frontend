// frontend/pages/CottonPage.jsx
import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import { FiImage, FiUsers, FiLayers, FiShield, FiStar } from "react-icons/fi";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getCottonPage, updateCottonPage } from "../../Api/api";
import "../../assets/css/LanguageTabs.css";

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
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const CottonPage = () => {
  // const { theme } = useTheme();

  const [currentLang, setCurrentLang] = useState("en");

  const translations = {
    en: {
      pageTitle: "Cotton Page Management",

      // Common
      cancel: "Cancel",
      save: "Save",
      remove: "Remove",
      add: "+ Add",
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
      addSupplier: "+ Add Supplier",
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
      recommendedHero: "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",
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
    cottonBannerSlideImg: [],
    cottonBannerSlideImgFiles: [],
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
    cottonMemberButtonLink: "",
    cottonMemberImg: [],
    cottonMemberImgFiles: [],
  });

  // ---------------------- FETCH ---------------------- //
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonBanner)
        setCottonBanner((prev) => ({
          ...prev,
          ...res.data.cottonBanner,
          cottonBannerImgFile: prev.cottonBannerImgFile,
          cottonBannerSlideImg:
            res.data.cottonBanner.cottonBannerSlideImg || [],
          cottonBannerSlideImgFiles: prev.cottonBannerSlideImgFiles || [],
          cottonBannerOverview: res.data.cottonBanner.cottonBannerOverview || {
            en: "",
            vi: "",
          },
        }));

      if (res.data?.cottonSupplier)
        setCottonSupplier(res.data.cottonSupplier || []); // ✅ fallback

      if (res.data?.cottonTrust)
        setCottonTrust((prev) => ({
          ...prev,
          ...res.data.cottonTrust,
          cottonTrustLogo: res.data.cottonTrust.cottonTrustLogo || [],
          cottonTrustLogoFiles: prev.cottonTrustLogoFiles || [],
          cottonTrustImgFile: prev.cottonTrustImgFile,
        }));

      if (res.data?.cottonMember)
        setCottonMember((prev) => ({
          ...prev,
          ...res.data.cottonMember,
          cottonMemberImg: res.data.cottonMember.cottonMemberImg || [],
          cottonMemberImgFiles: prev.cottonMemberImgFiles || [],
        }));
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

      if (res.data?.cotton?.[sectionName]) {
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
    <div
      className="max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#0A0A0A] text-white"
    >
      <style>{`
        label {
          color: #fff !important;
        }
      `}</style>
      <h2 className="text-4xl font-extrabold mb-10 text-center">
        Cotton Page Management
      </h2>

      <Collapse accordion bordered={false}>
        {/* 1. Banner */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              <FiImage /> Banner
            </span>
          }
          key="1"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang} >
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].title}</label>
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
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].description}</label>
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

          <label className="block font-medium mt-5 mb-1">{translations[currentLang].bannerMedia}</label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedHero}
          </p>
          {/* Show existing media */}
          {cottonBanner.cottonBannerImg && (
            cottonBanner.cottonBannerImg.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={getFullUrl(cottonBanner.cottonBannerImg)}
                controls
                className="w-64 mb-3 rounded"
              />
            ) : (
              <img
                src={getFullUrl(cottonBanner.cottonBannerImg)}
                alt="Banner"
                className="w-64 mb-3 rounded"
              />
            )
          )}

          {/* Show preview if uploading new */}
          {cottonBanner.preview && (
            cottonBanner.cottonBannerImgFile?.type?.startsWith("video/") ? (
              <video
                src={cottonBanner.preview}
                controls
                className="w-64 mb-3 rounded"
              />
            ) : (
              <img
                src={cottonBanner.preview}
                alt="Preview"
                className="w-64 mb-3 rounded"
              />
            )
          )}

          {/* File uploader (accepts both image and video) */}
          <div className="mb-4">
            {/* Hidden Input */}
            <input
              id="cottonBannerUpload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e, setCottonBanner, "cottonBannerImg")}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="cottonBannerUpload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7", // blue button
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
              Upload Cotton Banner
            </label>
          </div>


          <label className="block font-medium mt-5 mb-1">{translations[currentLang].bannerSlides}</label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommended} 750×750px
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(cottonBanner.cottonBannerSlideImg || []).map((img, idx) => (
              <div key={`slide-${idx}`} className="relative">
                <img
                  src={getFullUrl(img)}
                  alt="slide"
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={async () => {
                    const newSlides = (
                      cottonBanner.cottonBannerSlideImg || []
                    ).filter((_, i) => i !== idx);
                    const updated = {
                      ...cottonBanner,
                      cottonBannerSlideImg: newSlides,
                    };
                    setCottonBanner(updated);
                    await instantSave("cottonBanner", updated, [
                      "cottonBannerSlideImgFiles",
                    ]);
                  }}
                >
                  X
                </Button>
              </div>
            ))}

            {(cottonBanner.cottonBannerSlideImgFiles || []).map((file, idx) => {
              if (!(file instanceof File)) return null;
              return (
                <div key={`new-slide-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-slide"
                    className="w-full h-24 object-contain"
                  />
                  <Button
                    danger
                    size="small"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setCottonBanner({
                        ...cottonBanner,
                        cottonBannerSlideImgFiles: (
                          cottonBanner.cottonBannerSlideImgFiles || []
                        ).filter((_, i) => i !== idx),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            {/* Hidden Input */}
            <input
              id="cottonBannerSlidesUpload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const validFiles = Array.from(e.target.files).filter(validateFileSize);
                if (validFiles.length !== e.target.files.length) {
                  CommonToaster("Some images were too large (max 2MB) and skipped.", "error");
                }
                setCottonBanner({
                  ...cottonBanner,
                  cottonBannerSlideImgFiles: [
                    ...cottonBanner.cottonBannerSlideImgFiles,
                    ...validFiles,
                  ],
                });
              }}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="cottonBannerSlidesUpload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7", // blue button
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginTop: "10px",
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
              Upload Slide Images
            </label>
          </div>


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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Cancel Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ width: "18px", height: "18px" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {translations[currentLang].cancel}
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Save Icon */}
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
              {translations[currentLang].saveBanner}
            </Button>
          </div>

        </Panel>

        {/* 3. Supplier */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              <FiUsers /> Suppliers
            </span>
          }
          key="3"
        >
          {cottonSupplier.map((s, idx) => (
            <div
              key={idx}
              className=" rounded mb-4 "
            >
              <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <label className="block font-medium mt-5 mb-1">{translations[currentLang].title}</label>
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
                    <label className="block font-medium mt-5 mb-3">{translations[currentLang].logoName}</label>
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
                    <label className="block font-medium mt-5 mb-1">{translations[currentLang].description}</label>
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
                            descArr[dIdx] = { ...descArr[dIdx], [lang]: e.target.value };
                            newArr[idx].cottonSupplierDes = descArr;
                            setCottonSupplier(newArr);
                          }}
                        />
                        <Button
                          onClick={async () => {
                            const newArr = [...cottonSupplier];
                            const descArr = newArr[idx].cottonSupplierDes.filter((_, i) => i !== dIdx);
                            newArr[idx].cottonSupplierDes = descArr;
                            setCottonSupplier(newArr);

                            await instantSave("cottonSupplier", newArr);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#000", // black background
                            border: "1px solid #333",
                            color: "#fff",
                            borderRadius: "9999px", // circular
                            width: "28px",
                            height: "28px",
                            padding: "0",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {/* X (close icon) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            style={{ width: "14px", height: "14px" }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>

                      </div>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierDes = [
                          ...(newArr[idx].cottonSupplierDes || []),
                          { en: "", vi: "" },
                        ];
                        setCottonSupplier(newArr);
                      }}
                    >
                      {translations[currentLang].add}
                    </Button>
                  </TabPane>
                ))}
              </Tabs>

              <label className="block font-bold mt-5 mb-1">{translations[currentLang].background}</label>
              <p className="text-sm text-slate-500 mb-2">
                {translations[currentLang].recommended} 2000×1150px
              </p>
              {/* Show saved background from DB */}
              {s.cottonSupplierBg && !s.previewBg && (
                <img src={getFullUrl(s.cottonSupplierBg)} alt="bg" className="w-48 mb-2" />
              )}

              {/* Show preview if uploading new */}
              {s.previewBg && (
                <img src={s.previewBg} alt="preview-bg" className="w-48 mb-2" />
              )}

              <div className="mb-4">
                {/* Hidden Input */}
                <input
                  id={`cottonSupplierBgUpload-${idx}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;

                    const newArr = [...cottonSupplier];
                    newArr[idx].cottonSupplierBgFile = file;
                    newArr[idx].previewBg = URL.createObjectURL(file);
                    setCottonSupplier(newArr);
                  }}
                />

                {/* Styled Label as Button */}
                <label
                  htmlFor={`cottonSupplierBgUpload-${idx}`}
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
                  Upload Supplier Background
                </label>
              </div>

              <label className="block font-bold mt-5 mb-1">{translations[currentLang].logo}</label>
              <p className="text-sm text-slate-500 mb-2">
                {translations[currentLang].recommended} 200×200px
              </p>
              {/* Show saved logo from DB */}
              {s.cottonSupplierLogo && !s.previewLogo && (
                <img
                  src={getFullUrl(s.cottonSupplierLogo)}
                  alt="logo"
                  className="w-32 mb-2"
                />
              )}

              {/* Show preview if uploading new */}
              {s.previewLogo && (
                <img src={s.previewLogo} alt="preview" className="w-32 mb-2" />
              )}

              <div className="mb-4">
                {/* Hidden Input */}
                <input
                  id={`cottonSupplierLogoUpload-${idx}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return;

                    const newArr = [...cottonSupplier];
                    newArr[idx].cottonSupplierLogoFile = file;
                    newArr[idx].previewLogo = URL.createObjectURL(file);
                    setCottonSupplier(newArr);
                  }}
                />

                {/* Styled Label as Button */}
                <label
                  htmlFor={`cottonSupplierLogoUpload-${idx}`}
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
                  Upload Supplier Logo
                </label>
              </div>

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
                  backgroundColor: "#000", // black
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
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

                {translations[currentLang].removeSupplier}
              </Button>

            </div>
          ))}

          <Button
            type="dashed"
            className="w-full"
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
          >
            {translations[currentLang].addSupplier}
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Cancel Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ width: "18px", height: "18px" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {translations[currentLang].cancel}
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Save Icon */}
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
              {translations[currentLang].saveSuppliers}
            </Button>
          </div>

        </Panel>

        {/* 4. Trust */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold text-lg text-white">
              <FiShield /> Trust
            </span>
          }
          key="4"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].title}</label>
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
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].description}</label>
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

          <Divider>{translations[currentLang].logo}</Divider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <p className="text-sm text-slate-500 mb-2">
              {translations[currentLang].recommended} 180×180px
            </p>
            {/* Already saved images */}
            {cottonTrust.cottonTrustLogo.map((logo, idx) => (
              <div key={`saved-${idx}`} className="relative">
                <img
                  src={getFullUrl(logo)}
                  alt="trust"
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={async () => {
                    const newLogos = cottonTrust.cottonTrustLogo.filter(
                      (_, i) => i !== idx
                    );
                    const updated = {
                      ...cottonTrust,
                      cottonTrustLogo: newLogos,
                    };
                    setCottonTrust(updated);
                    await instantSave("cottonTrust", updated); // instantly update DB
                  }}
                >
                  X
                </Button>
              </div>
            ))}

            {/* Newly uploaded files (preview) */}
            {cottonTrust.cottonTrustLogoFiles.map((file, idx) => {
              if (!(file instanceof File)) return null; // ✅ ignore non-file values

              return (
                <div key={`new-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-trust"
                    className="w-full h-24 object-contain"
                  />
                  <Button
                    danger
                    size="small"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setCottonTrust({
                        ...cottonTrust,
                        cottonTrustLogoFiles:
                          cottonTrust.cottonTrustLogoFiles.filter(
                            (_, i) => i !== idx
                          ),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            {/* Hidden Input */}
            <input
              id="cottonTrustLogosUpload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const validFiles = Array.from(e.target.files).filter(validateFileSize);
                if (validFiles.length !== e.target.files.length) {
                  CommonToaster("Some logos were too large (max 2MB) and skipped.", "error");
                }
                setCottonTrust({
                  ...cottonTrust,
                  cottonTrustLogoFiles: [...cottonTrust.cottonTrustLogoFiles, ...validFiles],
                });
              }}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="cottonTrustLogosUpload"
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
                marginTop: "10px",
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
              Upload Trust Logos
            </label>
          </div>


          <label className="font-bold block mt-5 mb-1">{translations[currentLang].trustImage}</label>
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
            {/* Hidden Input */}
            <input
              id="cottonTrustImgUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e, setCottonTrust, "cottonTrustImg")}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="cottonTrustImgUpload"
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
              Upload Trust Image
            </label>
          </div>


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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Cancel Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ width: "18px", height: "18px" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {translations[currentLang].cancel}
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Save Icon */}
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
              {translations[currentLang].saveTrust}
            </Button>
          </div>

        </Panel>

        {/* 5. Certification */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white font-semibold text-lg">
              <FiStar /> Certification
            </span>
          }
          key="5"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang} className="pill-tabs">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].title}</label>
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
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].buttonText}</label>
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

          <label className="block font-medium mt-5 mb-1">{translations[currentLang].buttonLink}</label>
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
          />

          <Divider>{translations[currentLang].memberImages}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommended} 560×400px
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Already saved images */}
            {cottonMember.cottonMemberImg.map((img, idx) => (
              <div key={`saved-${idx}`} className="relative">
                <img
                  src={getFullUrl(img)}
                  alt="member"
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
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
                >
                  X
                </Button>
              </div>
            ))}

            {/* New uploads */}
            {cottonMember.cottonMemberImgFiles.map((file, idx) => {
              if (!(file instanceof File)) return null;

              return (
                <div key={`new-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-member"
                    className="w-full h-24 object-contain"
                  />
                  <Button
                    danger
                    size="small"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setCottonMember({
                        ...cottonMember,
                        cottonMemberImgFiles:
                          cottonMember.cottonMemberImgFiles.filter(
                            (_, i) => i !== idx
                          ),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            {/* Hidden Input */}
            <input
              id="cottonMemberImgUpload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const validFiles = Array.from(e.target.files).filter(validateFileSize);
                if (validFiles.length !== e.target.files.length) {
                  CommonToaster("Some member images were too large (max 2MB) and skipped.", "error");
                }
                setCottonMember({
                  ...cottonMember,
                  cottonMemberImgFiles: [...cottonMember.cottonMemberImgFiles, ...validFiles],
                });
              }}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="cottonMemberImgUpload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#0284C7", // blue button
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginTop: "10px",
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
              Upload Member Images
            </label>
          </div>



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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Cancel Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ width: "18px", height: "18px" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("cottonMember", cottonMember, ["cottonMemberImgFiles"])
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
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Save Icon */}
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
              {translations[currentLang].saveMember}
            </Button>
          </div>

        </Panel>
      </Collapse>
    </div>
  );
};

export default CottonPage;
