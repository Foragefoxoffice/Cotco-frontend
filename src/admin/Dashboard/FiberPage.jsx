import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import {
  FiImage,
  FiUsers,
  FiLayers,
  FiShield,
  FiStar,
  FiAward,
} from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getFiberPage, updateFiberPage } from "../../Api/api";
import * as FiIcons from "react-icons/fi";


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
  const { theme } = useTheme();
  const [currentLang, setCurrentLang] = useState("en");

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
      add: "+ Add",
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

      // Choose Us
      chooseUs: "Choose Us",
      boxBackgroundImage: "Box Background Image",
      chooseIcon: "Choose Icon",
      boxTitle: "Box Title",
      boxDescription: "Box Description",
      addBox: "+ Add Box",
      removeBox: "Remove Box",
      saveChooseUs: "Save Choose Us",

      // Supplier
      supplier: "Supplier",
      descriptions: "Descriptions (list)",
      addDescription: "+ Add Description",
      supplierImages: "Images",
      addImage: "+ Add Image",
      removeImage: "Remove Image",
      saveSupplier: "Save Supplier",

      // Products
      products: "Products",
      productTitle: "Product Title",
      productDescription: "Product Description",
      addProduct: "+ Add Product",
      addProductDescription: "+ Add Description",
      deleteProduct: "Delete Product",
      productBottomCon: "Bottom Content",
      saveProducts: "Save Products",

      // Certification
      certification: "Certification",
      certificationImages: "Images",
      addCertificationImage: "+ Add Image",
      saveCertification: "Save Certification",
    },

    vi: {
      pageTitle: "Quản lý Trang Sợi",

      // Common
      cancel: "Hủy",
      save: "Lưu",
      remove: "Xóa",
      add: "+ Thêm",
      title: "Tiêu đề",
      description: "Mô tả",
      content: "Nội dung",
      subTitle: "Tiêu đề phụ",
      subText: "Văn bản phụ",
      image: "Hình ảnh",
      buttonText: "Nút",
      buttonLink: "Liên kết nút",
      recommendedSize: "Kích thước đề xuất: ",
      recommendedHero: "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",


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

      // Choose Us
      chooseUs: "Vì sao chọn chúng tôi",
      boxBackgroundImage: "Hình nền hộp",
      chooseIcon: "Chọn biểu tượng",
      boxTitle: "Tiêu đề hộp",
      boxDescription: "Mô tả hộp",
      addBox: "+ Thêm Hộp",
      removeBox: "Xóa Hộp",
      saveChooseUs: "Lưu Vì sao chọn chúng tôi",

      // Supplier
      supplier: "Nhà cung cấp",
      descriptions: "Danh sách mô tả",
      addDescription: "+ Thêm Mô tả",
      supplierImages: "Hình ảnh",
      addImage: "+ Thêm Hình ảnh",
      removeImage: "Xóa Hình ảnh",
      saveSupplier: "Lưu Nhà cung cấp",

      // Products
      products: "Sản phẩm",
      productTitle: "Tiêu đề sản phẩm",
      productDescription: "Mô tả sản phẩm",
      addProduct: "+ Thêm Sản phẩm",
      addProductDescription: "+ Thêm Mô tả",
      deleteProduct: "Xóa Sản phẩm",
      productBottomCon: "Nội dung cuối",
      saveProducts: "Lưu Sản phẩm",

      // Certification
      certification: "Chứng nhận",
      certificationImages: "Hình ảnh",
      addCertificationImage: "+ Thêm Hình ảnh",
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

  // ---------------- FETCH ---------------- //
  useEffect(() => {
    getFiberPage().then((res) => {
      if (res.data?.fiberBanner) setFiberBanner(res.data.fiberBanner);
      if (res.data?.fiberSustainability)
        setFiberSustainability(res.data.fiberSustainability);
      if (res.data?.fiberChooseUs) setFiberChooseUs(res.data.fiberChooseUs);
      if (res.data?.fiberSupplier) setFiberSupplier(res.data.fiberSupplier);
      if (res.data?.fiberProducts) setFiberProducts(res.data.fiberProducts);
      if (res.data?.fiberCertification)
        setFiberCertification(res.data.fiberCertification);
    });
  }, []);


  const handleSave = async (sectionName, formState) => {
    try {
      if (!validateVietnamese(formState)) {
        CommonToaster("Please fill both English and Vietnamese fields.", "error");
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
            if (key === "fiberChooseUsBox" && item?.fiberChooseUsBoxBg?.file instanceof File) {
              formData.append(`fiberChooseUsBoxBgFile${idx}`, item.fiberChooseUsBoxBg.file);
            }
            // Products Images
            if (key === "fiberProduct" && item?.fiberProductImg?.file instanceof File) {
              formData.append(`fiberProductImgFile${idx}`, item.fiberProductImg.file);
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
                  if (item?.fiberChooseUsBoxBg?.file) return { ...item, fiberChooseUsBoxBg: "" };
                  if (item?.fiberProductImg?.file) return { ...item, fiberProductImg: "" };
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
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
        }
      }

      const res = await updateFiberPage(formData);

      if (res.data?.fiber?.[sectionName]) {
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (err) {
      CommonToaster("Error", err.message || "Something went wrong!");
    }
  };

  // ---------------- UI ---------------- //
  return (
    <div
      className={`max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl ${theme === "light" ? "bg-white" : "dark:bg-gray-800 text-gray-100"
        }`}
    >
      <style>{`
        label {
          color: #314158 !important;
        }
        .ant-divider-inner-text {
          color: #314158 !important;
        }
      `}</style>
      <h2 className="text-4xl font-extrabold mb-10 text-center">
        Fiber Page Management
      </h2>

      <Collapse accordion bordered={false}>
        {/* 1. Banner */}
        <Panel
          header={
            <span>
              <FiImage /> Banner
            </span>
          }
          key="1"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>{translations[currentLang].title}</label>
                <Input
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
                <label>{translations[currentLang].description}</label>
                <Input
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
                <label>{translations[currentLang].content}</label>
                <Input
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
                <label>{translations[currentLang].subTitle}</label>
                <Input
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
          <div style={{ marginBottom: "15px" }}>
            <label>{translations[currentLang].bannerMedia}</label>
            <p className="text-sm text-slate-500 mb-2">
              {translations[currentLang].recommendedHero}
            </p>
            <input
              type="file"
              accept="image/*,.mp4,.webm,.ogg,.mov,.avi,.mkv"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return; // ✅ validation added

                setFiberBanner({
                  ...fiberBanner,
                  fiberBannerMedia: file,
                  fiberBannerMediaPreview: URL.createObjectURL(file),
                });
              }}
            />

            {/* ✅ Show Preview (newly uploaded) */}
            {fiberBanner.fiberBannerMediaPreview ? (
              fiberBanner.fiberBannerMedia?.type?.startsWith("video") ? (
                <video
                  src={fiberBanner.fiberBannerMediaPreview}
                  controls
                  style={{
                    width: "250px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
              ) : (
                <img
                  src={fiberBanner.fiberBannerMediaPreview}
                  alt="Media Preview"
                  style={{
                    width: "250px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
              )
            ) : fiberBanner.fiberBannerMedia ? (
              /* ✅ Show Saved File (from DB) */
              fiberBanner.fiberBannerMedia.endsWith(".mp4") ||
                fiberBanner.fiberBannerMedia.endsWith(".webm") ||
                fiberBanner.fiberBannerMedia.endsWith(".ogg") ? (
                <video
                  src={getFullUrl(fiberBanner.fiberBannerMedia)}
                  controls
                  style={{
                    width: "250px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
              ) : (
                <img
                  src={fiberBanner.fiberBannerMedia}
                  alt="Saved Media"
                  style={{
                    width: "250px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
              )
            ) : null}
          </div>

          {/* Banner Image */}
          <div style={{ marginBottom: "15px" }}>
            <label>{translations[currentLang].bannerImage}</label>
            <p className="text-sm text-slate-500 mb-2">
              {translations[currentLang].recommendedSize} 560×670px
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return; // ✅ validation added

                setFiberBanner({
                  ...fiberBanner,
                  fiberBannerImg: file,
                  fiberBannerImgPreview: URL.createObjectURL(file),
                });
              }}
            />

            {fiberBanner.fiberBannerImgPreview ? (
              <img src={fiberBanner.fiberBannerImgPreview} alt="Banner Preview"
                style={{
                  width: "200px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }} />
            ) : fiberBanner.fiberBannerImg ? (
              <img src={getFullUrl(fiberBanner.fiberBannerImg)} alt="Banner Preview"
                style={{
                  width: "200px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }} />   // show existing saved img
            ) : null}

          </div>

          <Button
            type="primary"
            onClick={() => handleSave("fiberBanner", fiberBanner)}
          >
            {translations[currentLang].saveBanner}
          </Button>
        </Panel>

        {/* 2. Sustainability */}
        <Panel
          header={
            <span>
              <FiLayers /> Sustainability
            </span>
          }
          key="2"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label> {translations[currentLang].title}</label>
                <Input
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
                <label> {translations[currentLang].subText}</label>
                <Input
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
                <label> {translations[currentLang].description}</label>
                <Input
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
          <div style={{ marginBottom: "15px" }}>
            <label> {translations[currentLang].sustainabilityImage}</label>
            <p className="text-sm text-slate-500 mb-2">
              {translations[currentLang].recommendedSize} 900×500px
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return; // ✅ validation added

                setFiberSustainability({
                  ...fiberSustainability,
                  fiberSustainabilityImg: file,
                  fiberSustainabilityImgPreview: URL.createObjectURL(file),
                });
              }}
            />

            {/* Show preview (new or saved) */}
            {fiberSustainability.fiberSustainabilityImgPreview ? (
              <img
                src={fiberSustainability.fiberSustainabilityImgPreview}
                alt="Sustainability Preview"
                style={{
                  width: "200px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
            ) : fiberSustainability.fiberSustainabilityImg ? (
              <img
                src={getFullUrl(fiberSustainability.fiberSustainabilityImg)} // saved path from backend
                alt="Sustainability"
                style={{
                  width: "200px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
            ) : null}
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Tabs activeKey={currentLang} onChange={setCurrentLang}>
                {["en", "vi"].map((lang) => (
                  <TabPane tab={`SubTitle${i} ${lang}`} key={lang}>
                    <Input
                      placeholder={`Subtitle ${i}`}
                      value={
                        fiberSustainability[`fiberSustainabilitySubTitle${i}`][
                        lang
                        ]
                      }
                      onChange={(e) =>
                        setFiberSustainability({
                          ...fiberSustainability,
                          [`fiberSustainabilitySubTitle${i}`]: {
                            ...fiberSustainability[
                            `fiberSustainabilitySubTitle${i}`
                            ],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder={`SubDesc ${i}`}
                      value={
                        fiberSustainability[`fiberSustainabilitySubDes${i}`][
                        lang
                        ]
                      }
                      onChange={(e) =>
                        setFiberSustainability({
                          ...fiberSustainability,
                          [`fiberSustainabilitySubDes${i}`]: {
                            ...fiberSustainability[
                            `fiberSustainabilitySubDes${i}`
                            ],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </TabPane>
                ))}
              </Tabs>
            </div>
          ))}
          <Button
            type="primary"
            onClick={() =>
              handleSave("fiberSustainability", fiberSustainability)
            }
          >
            {translations[currentLang].saveSustainability}
          </Button>
        </Panel>

        {/* 3. Choose Us */}
        <Panel
          header={
            <span>
              <FiStar /> Choose Us
            </span>
          }
          key="3"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label> {translations[currentLang].title}</label>
                <Input
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
                <label> {translations[currentLang].description}</label>
                <Input
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
            <div key={idx} className="border p-2 mb-2">

              {/* Local Image Upload */}
              <div style={{ marginBottom: "10px" }}>
                <label> {translations[currentLang].boxBackgroundImage}</label>
                <p className="text-sm text-slate-500 mb-2">
                  {translations[currentLang].recommendedSize} 900×500px
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const arr = [...fiberChooseUs.fiberChooseUsBox];
                      arr[idx].fiberChooseUsBoxBg = { file, preview: URL.createObjectURL(file) };
                      setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                    }
                  }}
                />

                {box.fiberChooseUsBoxBg?.preview ? (
                  <img src={box.fiberChooseUsBoxBg.preview} alt="Preview" width="120" />
                ) : box.fiberChooseUsBoxBg ? (
                  <img src={getFullUrl(box.fiberChooseUsBoxBg)} alt="Saved" width="120" />
                ) : null}

              </div>

              {/* Icon Selector */}
              <div style={{ marginBottom: "10px" }}>
                <label> {translations[currentLang].chooseIcon}</label>
                <select
                  value={box.fiberChooseUsIcon}
                  onChange={(e) => {
                    const arr = [...fiberChooseUs.fiberChooseUsBox];
                    arr[idx].fiberChooseUsIcon = e.target.value;
                    setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                  }}
                >
                  <option value="">-- Select Icon --</option>
                  {Object.keys(FiIcons).map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>

                {/* Show the actual icon */}
                {box.fiberChooseUsIcon && (
                  <span style={{ marginLeft: "10px", fontSize: "20px" }}>
                    {React.createElement(FiIcons[box.fiberChooseUsIcon])}
                  </span>
                )}

              </div>

              {/* Multilingual Title & Description */}
              <Tabs activeKey={currentLang} onChange={setCurrentLang}>
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <label> {translations[currentLang].boxTitle}</label>
                    <Input
                      placeholder="Box Title"
                      value={box.fiberChooseUsBoxTitle[lang]}
                      onChange={(e) => {
                        const arr = [...fiberChooseUs.fiberChooseUsBox];
                        arr[idx].fiberChooseUsBoxTitle = {
                          ...arr[idx].fiberChooseUsBoxTitle,
                          [lang]: e.target.value,
                        };
                        setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                      }}
                    />
                    <label> {translations[currentLang].boxDescription}</label>
                    <Input
                      placeholder="Box Description"
                      value={box.fiberChooseUsDes[lang]}
                      onChange={(e) => {
                        const arr = [...fiberChooseUs.fiberChooseUsBox];
                        arr[idx].fiberChooseUsDes = {
                          ...arr[idx].fiberChooseUsDes,
                          [lang]: e.target.value,
                        };
                        setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                      }}
                    />
                  </TabPane>
                ))}
              </Tabs>
              <Button
                danger
                size="small"
                onClick={async () => {
                  const arr = [...fiberChooseUs.fiberChooseUsBox];
                  arr.splice(idx, 1);
                  setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });

                  // Immediate backend update
                  await handleSave("fiberChooseUs", { ...fiberChooseUs, fiberChooseUsBox: arr });
                }}
              >
                {translations[currentLang].removeBox}
              </Button>

            </div>
          ))}
          <Button
            type="dashed"
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
          >
            {translations[currentLang].addBox}
          </Button>
          <Button
            type="primary"
            onClick={() => handleSave("fiberChooseUs", fiberChooseUs)}
          >
            {translations[currentLang].saveChooseUs}
          </Button>
        </Panel>

        {/* 4. Supplier */}
        <Panel
          header={
            <span>
              <FiUsers /> Supplier
            </span>
          }
          key="4"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>  {translations[currentLang].title}</label>
                <Input
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

          <Divider>  {translations[currentLang].description} (list)</Divider>
          {fiberSupplier.fiberSupplierDes.map((d, idx) => (
            <Tabs activeKey={currentLang} onChange={setCurrentLang} key={idx}>
              {["en", "vi"].map((lang) => (
                <TabPane tab={lang.toUpperCase()} key={lang}>
                  <Input
                    value={d[lang]}
                    onChange={(e) => {
                      const arr = [...fiberSupplier.fiberSupplierDes];
                      arr[idx] = { ...arr[idx], [lang]: e.target.value };
                      setFiberSupplier({
                        ...fiberSupplier,
                        fiberSupplierDes: arr,
                      });
                    }}
                  />
                </TabPane>
              ))}
            </Tabs>
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberSupplier({
                ...fiberSupplier,
                fiberSupplierDes: [
                  ...fiberSupplier.fiberSupplierDes,
                  { en: "", vi: "" },
                ],
              })
            }
          >
            {translations[currentLang].addDescription}
          </Button>

          <Divider>  {translations[currentLang].image}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedSize} 200×200px
          </p>
          {fiberSupplier.fiberSupplierImg.map((img, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const arr = [...fiberSupplier.fiberSupplierImg];
                    if (!validateFileSize(file)) return;
                    arr[idx] = { file, preview: URL.createObjectURL(file) };
                    setFiberSupplier({ ...fiberSupplier, fiberSupplierImg: arr });
                  }
                }}
              />
              {img?.preview ? (
                <img src={img.preview} alt={`supplier-${idx}`} width="120" />
              ) : typeof img === "string" && img !== "" ? (
                <img src={getFullUrl(img)} alt={`supplier-${idx}`} width="120" />
              ) : null}
              <Button
                danger
                size="small"
                onClick={async () => {
                  const arr = [...fiberSupplier.fiberSupplierImg];
                  arr.splice(idx, 1);
                  setFiberSupplier({ ...fiberSupplier, fiberSupplierImg: arr });

                  // Immediate backend update
                  await handleSave("fiberSupplier", { ...fiberSupplier, fiberSupplierImg: arr });
                }}
              >
                {translations[currentLang].removeImage}
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberSupplier({
                ...fiberSupplier,
                fiberSupplierImg: [
                  ...fiberSupplier.fiberSupplierImg,
                  { file: null, preview: null },
                ],
              })
            }
          >
            {translations[currentLang].addImage}
          </Button>

          {/* ✅ Save Supplier */}
          <Button
            type="primary"
            style={{ marginTop: "15px" }}
            onClick={() => handleSave("fiberSupplier", fiberSupplier)}
          >
            {translations[currentLang].saveSupplier}
          </Button>
        </Panel>


        {/* 5. Products */}
        <Panel
          header={
            <span>
              <FiImage /> Products
            </span>
          }
          key="5"
        >
          {fiberProducts.fiberProduct.map((p, idx) => (
            <div key={idx} className="border p-2 mb-2 relative rounded-md">
              {/* ❌ Delete whole product */}
              <Button
                danger
                size="small"
                onClick={async () => {
                  const arr = [...fiberProducts.fiberProduct];
                  arr.splice(idx, 1);
                  setFiberProducts({ ...fiberProducts, fiberProduct: arr });

                  // Immediate backend update
                  await handleSave("fiberProducts", { ...fiberProducts, fiberProduct: arr });
                }}
              >
                {translations[currentLang].deleteProduct}
              </Button>


              <Tabs activeKey={currentLang} onChange={setCurrentLang}>
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <Input
                      placeholder="Product Title"
                      value={p.fiberProductTitle[lang]}
                      onChange={(e) => {
                        const arr = [...fiberProducts.fiberProduct];
                        arr[idx].fiberProductTitle = {
                          ...arr[idx].fiberProductTitle,
                          [lang]: e.target.value,
                        };
                        setFiberProducts({ ...fiberProducts, fiberProduct: arr });
                      }}
                    />
                  </TabPane>
                ))}
              </Tabs>

              <Divider>  {translations[currentLang].description} (list)</Divider>
              {p.fiberProductDes.map((d, dIdx) => (
                <Tabs activeKey={currentLang} onChange={setCurrentLang} key={dIdx}>
                  {["en", "vi"].map((lang) => (
                    <TabPane tab={lang.toUpperCase()} key={lang}>
                      <Input
                        value={d[lang]}
                        onChange={(e) => {
                          const arr = [...fiberProducts.fiberProduct];
                          arr[idx].fiberProductDes[dIdx] = {
                            ...arr[idx].fiberProductDes[dIdx],
                            [lang]: e.target.value,
                          };
                          setFiberProducts({ ...fiberProducts, fiberProduct: arr });
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
                {translations[currentLang].addDescription}
              </Button>

              {/* Product Image Upload */}
              <div style={{ marginTop: "10px" }}>
                <p className="text-sm text-slate-500 mb-2">
                  {translations[currentLang].recommendedSize} 200×200px
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateFileSize(file)) return; // ✅ Validation added

                    const arr = [...fiberProducts.fiberProduct];
                    arr[idx].fiberProductImg = { file, preview: URL.createObjectURL(file) };
                    setFiberProducts({ ...fiberProducts, fiberProduct: arr });
                  }}
                />

                {p.fiberProductImg && (
                  <img
                    src={p.fiberProductImg.preview || getFullUrl(p.fiberProductImg)}
                    alt={`product-${idx}`}
                    style={{ width: "120px", marginTop: "8px", borderRadius: "6px" }}
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
          >
            {translations[currentLang].addProduct}
          </Button>
          <Divider />
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={`BottomCon ${lang}`} key={lang}>
                <Input
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
              </TabPane>
            ))}
          </Tabs>
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={`ButtonText ${lang}`} key={lang}>
                <Input
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
          <Input
            placeholder="Button Link"
            value={fiberProducts.fiberProductButtonLink}
            onChange={(e) =>
              setFiberProducts({
                ...fiberProducts,
                fiberProductButtonLink: e.target.value,
              })
            }
          />
          <Button
            type="primary"
            onClick={() => handleSave("fiberProducts", fiberProducts)}
          >
            {translations[currentLang].saveProducts}
          </Button>
        </Panel>

        {/* 6. Certification */}
        <Panel
          header={
            <span>
              <FiAward /> Certification
            </span>
          }
          key="6"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>  {translations[currentLang].title}</label>
                <Input
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
                <label>  {translations[currentLang].buttonText}</label>
                <Input
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
          <label> {translations[currentLang].buttonLink}</label>
          <Input
            placeholder="Button Link"
            value={fiberCertification.fiberCertificationButtonLink}
            onChange={(e) =>
              setFiberCertification({
                ...fiberCertification,
                fiberCertificationButtonLink: e.target.value,
              })
            }
          />
          <Divider>{translations[currentLang].image}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedSize} 560×400px
          </p>
          {fiberCertification.fiberCertificationImg.map((img, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const arr = [...fiberCertification.fiberCertificationImg];
                    if (!validateFileSize(file)) return;
                    arr[idx] = { file, preview: URL.createObjectURL(file) };
                    setFiberCertification({ ...fiberCertification, fiberCertificationImg: arr });
                  }
                }}
              />

              {/* Preview */}
              {img?.preview ? (
                <img src={img.preview} alt={`cert-${idx}`} width="120" />
              ) : typeof img === "string" && img !== "" ? (
                <img src={getFullUrl(img)} alt={`cert-${idx}`} width="120" />
              ) : null}

              {/* ✅ Remove button */}
              <Button
                danger
                size="small"
                onClick={async () => {
                  const arr = [...fiberCertification.fiberCertificationImg];
                  arr.splice(idx, 1);
                  setFiberCertification({ ...fiberCertification, fiberCertificationImg: arr });

                  await handleSave("fiberCertification", { ...fiberCertification, fiberCertificationImg: arr });
                }}
              >
                {translations[currentLang].remove}
              </Button>

            </div>
          ))}

          <Button
            type="dashed"
            onClick={() =>
              setFiberCertification({
                ...fiberCertification,
                fiberCertificationImg: [
                  ...fiberCertification.fiberCertificationImg,
                  { file: null, preview: null },  // ✅ better placeholder
                ],
              })
            }
          >
            {translations[currentLang].addImage}
          </Button>

          <Button
            type="primary"
            onClick={() => handleSave("fiberCertification", fiberCertification)}
          >
            {translations[currentLang].saveCertification}
          </Button>
        </Panel>
      </Collapse>
    </div>
  );
}
