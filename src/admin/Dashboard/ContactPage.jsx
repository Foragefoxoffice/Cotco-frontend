import React, { useState, useEffect } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import { FiPhone, FiMapPin, FiClock, FiEdit } from "react-icons/fi";
import { getContactPage, updateContactPage } from "../../Api/api";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const ContactPage = () => {
  // const { theme } = useTheme();

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

  const [currentLang, setCurrentLang] = useState("en");

  const translations = {
    en: {
      pageTitle: "Contact Page Management",

      // Common
      cancel: "Cancel",
      save: "Save",
      remove: "Remove",
      add: "Add",
      recommendedHero: "Recommended: 1260×660px (Image) | Max Video Size: 10MB",
      recommended: "Recommended Size: ",

      // Banner
      banner: "Contact Banner",
      bannerTitle: "Title",
      bannerMedia: "Background (Image / Video)",
      saveBanner: "Save Banner",

      // Contact Form
      form: "Contact Form",
      formText: "Form Text",
      formImage: "Form Image",
      saveForm: "Save Form",

      // Location
      location: "Location",
      locationTitle: "Title",
      locationDescription: "Description",
      locationButtonText: "Button Text",
      locationButtonLink: "Button Link",
      saveLocation: "Save Location",

      // Hours
      hours: "Contact Hours",
      sectionTitle: "Section Title",
      hoursList: "Hours List",
      addHours: "Add Hours",
      removeHours: "Remove",
      saveHours: "Save Hours",

      // Map
      map: "Contact Map",
      mapTitle: "Map Title",
      mapIframe: "Map Iframe Link",
      saveMap: "Save Map",
    },

    vi: {
      pageTitle: "Quản lý Trang Liên hệ",

      // Common
      cancel: "Hủy",
      save: "Lưu",
      remove: "Xóa",
      add: "+ Thêm",
      recommendedHero:
        "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",
      recommended: "Kích thước đề xuất: ",

      // Banner
      banner: "Banner Liên hệ",
      bannerTitle: "Tiêu đề",
      bannerMedia: "Nền (Hình ảnh / Video)",
      saveBanner: "Lưu Banner",

      // Contact Form
      form: "Biểu mẫu Liên hệ",
      formText: "Nội dung biểu mẫu",
      formImage: "Hình ảnh biểu mẫu",
      saveForm: "Lưu Biểu mẫu",

      // Location
      location: "Địa điểm",
      locationTitle: "Tiêu đề",
      locationDescription: "Mô tả",
      locationButtonText: "Nút",
      locationButtonLink: "Liên kết nút",
      saveLocation: "Lưu Địa điểm",

      // Hours
      hours: "Giờ làm việc",
      sectionTitle: "Tiêu đề phần",
      hoursList: "Danh sách giờ",
      addHours: "+ Thêm giờ",
      removeHours: "Xóa",
      saveHours: "Lưu Giờ làm việc",

      // Map
      map: "Bản đồ Liên hệ",
      mapTitle: "Tiêu đề bản đồ",
      mapIframe: "Liên kết Iframe bản đồ",
      saveMap: "Lưu Bản đồ",
    },
  };

  const API_BASE = import.meta.env.VITE_API_URL;

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ---------------------- STATES ---------------------- //
  const [contactBanner, setContactBanner] = useState({
    contactBannerBg: "",
    contactBannerTitle: { en: "", vi: "" },
    contactBannerBgFile: null,
  });

  const [contactForm, setContactForm] = useState({
    contactFormImg: "",
    contactForm: { en: "", vi: "" },
    contactFormImgFile: null,
  });

  const [contactLocation, setContactLocation] = useState({
    contactLocationTitle: { en: "", vi: "" },
    contactLocationDes: { en: "", vi: "" },
    contactLocationButtonText: { en: "", vi: "" },
    contactLocationButtonLink: "",
  });

  const [contactHours, setContactHours] = useState({
    contactHoursTitle: { en: "", vi: "" },
    contactHoursList: [],
  });

  const [contactMap, setContactMap] = useState({
    contactMapTitle: { en: "", vi: "" },
    contactMapMap: "",
  });

  // ---------------------- FETCH ---------------------- //
  useEffect(() => {
    getContactPage().then((res) => {
      if (res.data?.contactBanner)
        setContactBanner({
          ...res.data.contactBanner,
          contactBannerBgFile: null,
        });
      if (res.data?.contactForm)
        setContactForm({ ...res.data.contactForm, contactFormImgFile: null });
      if (res.data?.contactLocation)
        setContactLocation(res.data.contactLocation);
      if (res.data?.contactHours) setContactHours(res.data.contactHours);
      if (res.data?.contactMap) setContactMap(res.data.contactMap);
    });
  }, []);

  // ✅ Validation: Check if multilingual object has both EN & VI
  const isValidMultiLang = (obj) => {
    if (!obj) return false;
    return obj.en?.trim() !== "" && obj.vi?.trim() !== "";
  };

  // ---------------------- SAVE ---------------------- //
  const handleSave = async (sectionName, formState, fileKeys = []) => {
    try {
      // ✅ Validation check
      if (
        sectionName === "contactBanner" &&
        !isValidMultiLang(formState.contactBannerTitle)
      ) {
        return CommonToaster(
          "Please fill both EN & VI in Banner Title",
          "error"
        );
      }
      if (
        sectionName === "contactForm" &&
        !isValidMultiLang(formState.contactForm)
      ) {
        return CommonToaster(
          "Please fill both EN & VI in Contact Form text",
          "error"
        );
      }
      if (sectionName === "contactLocation") {
        if (
          !isValidMultiLang(formState.contactLocationTitle) ||
          !isValidMultiLang(formState.contactLocationDes) ||
          !isValidMultiLang(formState.contactLocationButtonText)
        ) {
          return CommonToaster(
            "Please fill both EN & VI for Location fields",
            "error"
          );
        }
      }
      if (sectionName === "contactHours") {
        if (!isValidMultiLang(formState.contactHoursTitle)) {
          return CommonToaster(
            "Please fill both EN & VI in Contact Hours Title",
            "error"
          );
        }
        if (
          formState.contactHoursList.some((item) => !isValidMultiLang(item))
        ) {
          return CommonToaster(
            "Please fill both EN & VI in all Contact Hours list items",
            "error"
          );
        }
      }
      if (sectionName === "contactMap") {
        if (!isValidMultiLang(formState.contactMapTitle)) {
          return CommonToaster(
            "Please fill both EN & VI in Map Title",
            "error"
          );
        }
        if (!formState.contactMapMap?.trim()) {
          return CommonToaster(
            "Please provide an iframe link for the map",
            "error"
          );
        }
      }

      // ✅ Build FormData after validation
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(formState));

      fileKeys.forEach((key) => {
        if (formState[key]) {
          formData.append(key, formState[key]);
        }
      });

      const res = await updateContactPage(formData);

      if (res.data?.contact?.[sectionName]) {
        switch (sectionName) {
          case "contactBanner":
            setContactBanner({
              ...res.data.contact.contactBanner,
              contactBannerBgFile: null,
            });
            break;
          case "contactForm":
            setContactForm({
              ...res.data.contact.contactForm,
              contactFormImgFile: null,
            });
            break;
          case "contactLocation":
            setContactLocation(res.data.contact.contactLocation);
            break;
          case "contactHours":
            setContactHours(res.data.contact.contactHours);
            break;
          case "contactMap":
            setContactMap(res.data.contact.contactMap);
            break;
        }
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (err) {
      CommonToaster("error", err.message || "Something went wrong");
    }
  };

  // ---------------------- UI ---------------------- //
  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#0A0A0A]">
      <style>{`
        label {
          color: #fff !important;
        }
      `}</style>
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Contact Page Management
      </h2>

      <Collapse accordion bordered={false} defaultActiveKey="1">
        {/* Banner */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              <FiEdit /> Contact Banner
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
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].bannerTitle}
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
                  value={contactBanner.contactBannerTitle[lang]}
                  onChange={(e) =>
                    setContactBanner({
                      ...contactBanner,
                      contactBannerTitle: {
                        ...contactBanner.contactBannerTitle,
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
          {contactBanner.contactBannerBgFile ? (
            contactBanner.contactBannerBgFile.type.startsWith("video/") ? (
              <video
                src={URL.createObjectURL(contactBanner.contactBannerBgFile)}
                controls
                className="w-64 mb-4 rounded-lg"
              />
            ) : (
              <img
                src={URL.createObjectURL(contactBanner.contactBannerBgFile)}
                alt="Banner"
                className="w-64 mb-4 rounded-lg"
              />
            )
          ) : contactBanner.contactBannerBg ? (
            /\.(mp4|webm|ogg)$/i.test(contactBanner.contactBannerBg) ? (
              <video
                src={getFullUrl(contactBanner.contactBannerBg)}
                controls
                className="w-64 mb-4 rounded-lg"
              />
            ) : (
              <img
                src={getFullUrl(contactBanner.contactBannerBg)}
                alt="Banner"
                className="w-64 mb-4 rounded-lg"
              />
            )
          ) : null}

          <div className="mb-3">
            {/* Hidden Input */}
            <input
              id="contactBannerUpload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return; // ✅ size check

                setContactBanner({
                  ...contactBanner,
                  contactBannerBgFile: file,
                });
              }}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="contactBannerUpload"
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
              Upload Contact Banner
            </label>
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
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
                handleSave("contactBanner", contactBanner, [
                  "contactBannerBgFile",
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
                fontSize: "14px",
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
              {translations[currentLang].save}
            </Button>
          </div>
        </Panel>

        {/* Contact Form */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              <FiEdit /> Contact Form
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
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].formText}
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
                  value={contactForm.contactForm[lang]}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      contactForm: {
                        ...contactForm.contactForm,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className="block font-medium mt-5 mb-1">{translations[currentLang].formImage}</label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommended} 630×760px
          </p>
          {contactForm.contactFormImgFile ? (
            <img
              src={URL.createObjectURL(contactForm.contactFormImgFile)}
              alt="Form"
              className="w-48 mb-4 rounded-lg"
            />
          ) : (
            contactForm.contactFormImg && (
              <img
                src={getFullUrl(contactForm.contactFormImg)}
                alt="Form"
                className="w-48 mb-4 rounded-lg"
              />
            )
          )}
          <div className="mb-3">
            {/* Hidden Input */}
            <input
              id="contactFormUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return; // ✅ size check

                setContactForm({ ...contactForm, contactFormImgFile: file });
              }}
            />

            {/* Styled Label as Button */}
            <label
              htmlFor="contactFormUpload"
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
              Upload Contact Form Image
            </label>
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
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
                handleSave("contactForm", contactForm, ["contactFormImgFile"])
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
                fontSize: "14px",
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
              {translations[currentLang].saveForm}
            </Button>
          </div>
        </Panel>

        {/* Location */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              <FiMapPin /> Location
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
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].locationTitle}
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
                  value={contactLocation.contactLocationTitle[lang]}
                  onChange={(e) =>
                    setContactLocation({
                      ...contactLocation,
                      contactLocationTitle: {
                        ...contactLocation.contactLocationTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].locationDescription}
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
                  value={contactLocation.contactLocationDes[lang]}
                  onChange={(e) =>
                    setContactLocation({
                      ...contactLocation,
                      contactLocationDes: {
                        ...contactLocation.contactLocationDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].locationButtonText}
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
                  value={contactLocation.contactLocationButtonText[lang]}
                  onChange={(e) =>
                    setContactLocation({
                      ...contactLocation,
                      contactLocationButtonText: {
                        ...contactLocation.contactLocationButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className="block font-medium mt-5 mb-1">
            {translations[currentLang].locationButtonLink}
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
            value={contactLocation.contactLocationButtonLink}
            onChange={(e) =>
              setContactLocation({
                ...contactLocation,
                contactLocationButtonLink: e.target.value,
              })
            }
          />

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
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
              onClick={() => handleSave("contactLocation", contactLocation)}
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
                fontSize: "14px",
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
              {translations[currentLang].saveLocation}
            </Button>
          </div>
        </Panel>

        {/* Hours */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              <FiClock /> Contact Hours
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
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].sectionTitle}
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
                  value={contactHours.contactHoursTitle[lang]}
                  onChange={(e) =>
                    setContactHours({
                      ...contactHours,
                      contactHoursTitle: {
                        ...contactHours.contactHoursTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block font-medium mt-5 mb-1">{translations[currentLang].hoursList}</label>
                {contactHours.contactHoursList.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
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
                      placeholder={lang.toUpperCase()}
                      value={item[lang]}
                      onChange={(e) => {
                        const updated = [...contactHours.contactHoursList];
                        updated[i][lang] = e.target.value;
                        setContactHours({
                          ...contactHours,
                          contactHoursList: updated,
                        });
                      }}
                    />
                    {lang === "en" && ( // remove button only once
                      <Button
  onClick={() => {
    const updated = contactHours.contactHoursList.filter((_, idx) => idx !== i);
    setContactHours({
      ...contactHours,
      contactHoursList: updated,
    });
  }}
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#000", // black
    border: "1px solid #333",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "9999px", // pill shape
    fontWeight: "500",
    fontSize: "13px",
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
    style={{ width: "16px", height: "16px" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
    />
  </svg>
  Remove
</Button>

                    )}
                  </div>
                ))}

                {lang === "en" && (
                  <Button
  onClick={() =>
    setContactHours({
      ...contactHours,
      contactHoursList: [
        ...contactHours.contactHoursList,
        { en: "", vi: "" },
      ],
    })
  }
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #ddd",
    padding: "10px 18px",
    borderRadius: "9999px", // pill shape
    fontWeight: "500",
    fontSize: "14px",
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
    style={{ width: "16px", height: "16px" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
  {translations[currentLang].addHours}
</Button>

                )}
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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
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
              onClick={() => handleSave("contactHours", contactHours)}
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
                fontSize: "14px",
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
              {translations[currentLang].saveHours}
            </Button>
          </div>
        </Panel>

        {/* Map */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-lg text-white">
              <FiMapPin /> Contact Map
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
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].mapTitle}
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
                  value={contactMap.contactMapTitle[lang]}
                  onChange={(e) =>
                    setContactMap({
                      ...contactMap,
                      contactMapTitle: {
                        ...contactMap.contactMapTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* ✅ Single Iframe Field */}
          <label className="block font-medium mt-5 mb-1">
            {translations[currentLang].mapIframe}
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
            value={contactMap.contactMapMap}
            onChange={(e) =>
              setContactMap({ ...contactMap, contactMapMap: e.target.value })
            }
          />

          {contactMap.contactMapMap && (
            <div className="mt-4">
              <iframe
                src={contactMap.contactMapMap}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          )}

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
                padding: "10px 20px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
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
              onClick={() => handleSave("contactMap", contactMap)}
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
                fontSize: "14px",
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
              {translations[currentLang].saveMap}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ContactPage;
