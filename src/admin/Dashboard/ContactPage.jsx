import React, { useState, useEffect } from "react";
import { Collapse, Input, Button, Tabs, Divider, Modal } from "antd";
import { FiPhone, FiMapPin, FiClock, FiEdit } from "react-icons/fi";
import { getContactPage, updateContactPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import "../../assets/css/LanguageTabs.css";
import { Plus, Minus, RotateCw, X, Trash2 } from "lucide-react";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const ContactPage = () => {
  // ✅ Language detection (only affects title + panel headers)
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

  const [contactTeam, setContactTeam] = useState({
  teamIntro: {
    tag: { en: "", vi: "" },
    heading: { en: "", vi: "" },
    description: { en: "", vi: "" },
  },
  teamList: {},
});

const [addContactTeamModal, setAddContactTeamModal] = useState(false);
const [tempContactTeamTitle, setTempContactTeamTitle] = useState({ en: "", vi: "" });

  // ✅ Language switching for form text etc.
  const [currentLang, setCurrentLang] = useState("en");

  const translations = {
    en: {
      pageTitle: "Contact Page Management",

      cancel: "Cancel",
      save: "Save",
      remove: "Remove",
      add: "Add",
      recommendedHero: "Recommended: 1260×660px (Image) | Max Video Size: 10MB",
      recommended: "Recommended Size: ",

      banner: "Contact Banner",
      bannerTitle: "Title",
      bannerMedia: "Background (Image / Video)",
      saveBanner: "Save Banner",

      form: "Contact Form",
      formText: "Form Text",
      formImage: "Form Image",
      saveForm: "Save Form",

      location: "Location",
      locationTitle: "Title",
      locationDescription: "Description",
      locationButtonText: "Button Text",
      locationButtonLink: "Button Link",
      saveLocation: "Save Location",

      hours: "Contact Hours",
      sectionTitle: "Section Title",
      hoursList: "Hours List",
      addHours: "Add Hours",
      removeHours: "Remove",
      saveHours: "Save Hours",

      map: "Contact Map",
      mapTitle: "Map Title",
      mapIframe: "Map Iframe Link",
      saveMap: "Save Map",
    },

    vi: {
      pageTitle: "Quản lý Trang Liên hệ",

      cancel: "Hủy",
      save: "Lưu",
      remove: "Xóa",
      add: "+ Thêm",
      recommendedHero:
        "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",
      recommended: "Kích thước đề xuất: ",

      banner: "Biểu Ngữ Liên Hệ",
      bannerTitle: "Tiêu đề",
      bannerMedia: "Nền (Hình ảnh / Video)",
      saveBanner: "Lưu Banner",

      form: "Biểu mẫu Liên hệ",
      formText: "Nội dung biểu mẫu",
      formImage: "Hình ảnh biểu mẫu",
      saveForm: "Lưu Biểu mẫu",

      location: "Địa điểm",
      locationTitle: "Tiêu đề",
      locationDescription: "Mô tả",
      locationButtonText: "Nút",
      locationButtonLink: "Liên kết nút",
      saveLocation: "Lưu Địa điểm",

      hours: "Giờ làm việc",
      sectionTitle: "Tiêu đề phần",
      hoursList: "Danh sách giờ",
      addHours: "+ Thêm giờ",
      removeHours: "Xóa",
      saveHours: "Lưu Giờ làm việc",

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

  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
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

      // ✅ CONTACT TEAM SECTION
if (res.data?.contactTeam && typeof res.data.contactTeam === "object") {
  const teamData = res.data.contactTeam;

  // ✅ Normalize team list and members structure
  const normalizedTeamList = {};
  for (const [teamKey, teamVal] of Object.entries(teamData.teamList || {})) {
    const normalizedMembers = (teamVal.members || []).map((m) => ({
      teamName: m.teamName || m.name || { en: "", vi: "" },
      teamDesgn: m.teamDesgn || m.role || { en: "", vi: "" },
      teamEmail: m.teamEmail || m.email || "",
      teamPhone: m.teamPhone || m.phone || "",
    }));

    normalizedTeamList[teamKey] = {
      teamLabel: teamVal.teamLabel || { en: "", vi: "" },
      members: normalizedMembers,
    };
  }

  setContactTeam({
    teamIntro: {
      tag: teamData.teamIntro?.tag || { en: "", vi: "" },
      heading: teamData.teamIntro?.heading || { en: "", vi: "" },
      description: teamData.teamIntro?.description || { en: "", vi: "" },
    },
    teamList: normalizedTeamList,
  });
} else {
  // 🧩 Fallback when no team data exists yet
  setContactTeam({
    teamIntro: {
      tag: { en: "", vi: "" },
      heading: { en: "", vi: "" },
      description: { en: "", vi: "" },
    },
    teamList: {},
  });
}


      // ✅ NEW: load SEO Meta from DB
      if (res.data?.seoMeta) {
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

  // ✅ Validation: Check if multilingual object has both EN & VI
  const isValidMultiLang = (obj) => {
    if (!obj) return false;
    return obj.en?.trim() !== "" && obj.vi?.trim() !== "";
  };

  // ---------------------- SAVE ---------------------- //
  const handleSave = async (sectionName, formState, fileKeys = []) => {
    try {
      // ✅ Validation checks only for relevant sections
      if (
        sectionName === "contactBanner" &&
        !isValidMultiLang(formState.contactBannerTitle)
      )
        return CommonToaster(
          "Please fill both EN & VI in Banner Title",
          "error"
        );

      if (
        sectionName === "contactForm" &&
        !isValidMultiLang(formState.contactForm)
      )
        return CommonToaster(
          "Please fill both EN & VI in Contact Form text",
          "error"
        );

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
        if (!isValidMultiLang(formState.contactHoursTitle))
          return CommonToaster(
            "Please fill both EN & VI in Contact Hours Title",
            "error"
          );

        if (formState.contactHoursList.some((item) => !isValidMultiLang(item)))
          return CommonToaster(
            "Please fill both EN & VI in all Contact Hours list items",
            "error"
          );
      }

      if (sectionName === "contactMap") {
        if (!isValidMultiLang(formState.contactMapTitle))
          return CommonToaster(
            "Please fill both EN & VI in Map Title",
            "error"
          );
        if (!formState.contactMapMap?.trim())
          return CommonToaster(
            "Please provide an iframe link for the map",
            "error"
          );
      }

      // ✅ Build FormData
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(formState));

      // Append file fields if needed
      fileKeys.forEach((key) => {
        if (formState[key]) {
          formData.append(key, formState[key]);
        }
      });

      // Special handling for SEO Meta (if there’s OG image upload)
      if (
        sectionName === "contactSeoMeta" &&
        formState.ogImageFile instanceof File
      ) {
        formData.append("contactSeoOgImageFile", formState.ogImageFile);
      }

      // 🔹 Send request
      const res = await updateContactPage(formData);

      // ✅ Handle backend response correctly
      if (res.data?.contact) {
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
          case "contactSeoMeta":
            // ✅ Properly update SEO state after saving
            setSeoMeta(res.data.contact.seoMeta || formState);
            break;
            case "contactTeam":
  if (res.data.contact.contactTeam) {
    const teamData = res.data.contact.contactTeam;
    setContactTeam({
      teamIntro: {
        tag: teamData.teamIntro?.tag || { en: "", vi: "" },
        heading: teamData.teamIntro?.heading || { en: "", vi: "" },
        description: teamData.teamIntro?.description || { en: "", vi: "" },
      },
      teamList: teamData.teamList || {},
    });
  }
  break;

        }
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (err) {
      console.error("❌ Save Error:", err);
      CommonToaster("error", err.message || "Something went wrong");
    }
  };

  // ---------------------- MODAL STATES ---------------------- //
  const [showContactBannerModal, setShowContactBannerModal] = useState(false);
  const [showContactFormModal, setShowContactFormModal] = useState(false);

  // ---------------------- UI ---------------------- //
  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717]">
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
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        {isVietnamese ? translations.vi.pageTitle : translations.en.pageTitle}
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
        {/* Banner */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? translations.vi.banner : translations.en.banner}
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].bannerTitle}
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

          {/* 📸 Contact Banner Upload Section */}
          <div style={{ marginBottom: "25px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[currentLang].bannerMedia}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[currentLang].recommendedHero}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- If no media uploaded yet --- */}
              {!contactBanner.contactBannerBg &&
              !contactBanner.contactBannerBgFile ? (
                <label
                  htmlFor="contactBannerUpload"
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
                      ? "Tải lên hình ảnh hoặc video"
                      : "Upload Image or Video"}
                  </span>
                </label>
              ) : (
                /* --- Preview Box --- */
                <div className="relative group w-60 h-40 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                  {contactBanner.contactBannerBgFile ? (
                    contactBanner.contactBannerBgFile.type.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={URL.createObjectURL(
                          contactBanner.contactBannerBgFile
                        )}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(
                          contactBanner.contactBannerBgFile
                        )}
                        alt="Contact Banner"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : /\.(mp4|webm|ogg)$/i.test(
                      contactBanner.contactBannerBg
                    ) ? (
                    <video
                      src={getFullUrl(contactBanner.contactBannerBg)}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={getFullUrl(contactBanner.contactBannerBg)}
                      alt="Contact Banner"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowContactBannerModal(true)}
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
                    htmlFor="contactBannerUploadChange"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi" : "Change Media"}
                  >
                    <input
                      id="contactBannerUploadChange"
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setContactBanner({
                          ...contactBanner,
                          contactBannerBgFile: file,
                        });
                      }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      setContactBanner({
                        ...contactBanner,
                        contactBannerBg: "",
                        contactBannerBgFile: "",
                      })
                    }
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

            {/* Hidden File Input for Initial Upload */}
            <input
              id="contactBannerUpload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;
                setContactBanner({
                  ...contactBanner,
                  contactBannerBgFile: file,
                });
              }}
            />

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showContactBannerModal}
              footer={null}
              onCancel={() => setShowContactBannerModal(false)}
              centered
              width={700}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {contactBanner.contactBannerBgFile ? (
                contactBanner.contactBannerBgFile.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(contactBanner.contactBannerBgFile)}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(contactBanner.contactBannerBgFile)}
                    alt="Contact Banner Preview"
                    className="w-full h-auto rounded-lg"
                  />
                )
              ) : /\.(mp4|webm|ogg)$/i.test(contactBanner.contactBannerBg) ? (
                <video
                  src={getFullUrl(contactBanner.contactBannerBg)}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  src={getFullUrl(contactBanner.contactBannerBg)}
                  alt="Contact Banner Preview"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </Modal>
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].save}
            </Button>
          </div>
        </Panel>

        {/* Contact Form */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? translations.vi.form : translations.en.form}
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].formText}
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

          {/* 📩 Contact Form Image Upload Section */}
          <div style={{ marginBottom: "25px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {translations[currentLang].formImage}
            </label>
            <p className="text-sm text-slate-500 mb-3">
              {translations[currentLang].recommended} 630×760px
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- If no image uploaded yet --- */}
              {!contactForm.contactFormImg &&
              !contactForm.contactFormImgFile ? (
                <label
                  htmlFor="contactFormUpload"
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
                      ? "Tải lên hình ảnh biểu mẫu"
                      : "Upload Form Image"}
                  </span>
                </label>
              ) : (
                /* --- Preview Box --- */
                <div className="relative group w-48 h-48 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                  <img
                    src={
                      contactForm.contactFormImgFile
                        ? URL.createObjectURL(contactForm.contactFormImgFile)
                        : getFullUrl(contactForm.contactFormImg)
                    }
                    alt="Contact Form"
                    className="w-full h-full object-cover"
                  />

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowContactFormModal(true)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={isVietnamese ? "Xem hình đầy đủ" : "View Full"}
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
                    htmlFor="contactFormUploadChange"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={isVietnamese ? "Thay đổi" : "Change Image"}
                  >
                    <input
                      id="contactFormUploadChange"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setContactForm({
                          ...contactForm,
                          contactFormImgFile: file,
                        });
                      }}
                    />
                    <RotateCw size={14} />
                  </label>

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      setContactForm({
                        ...contactForm,
                        contactFormImg: "",
                        contactFormImgFile: "",
                      })
                    }
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

            {/* Hidden Input for Upload */}
            <input
              id="contactFormUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!validateFileSize(file)) return;
                setContactForm({ ...contactForm, contactFormImgFile: file });
              }}
            />

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showContactFormModal}
              footer={null}
              onCancel={() => setShowContactFormModal(false)}
              centered
              width={500}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              {contactForm.contactFormImgFile ? (
                <img
                  src={URL.createObjectURL(contactForm.contactFormImgFile)}
                  alt="Contact Form Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : contactForm.contactFormImg ? (
                <img
                  src={getFullUrl(contactForm.contactFormImg)}
                  alt="Contact Form Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400 py-10 text-base">
                  No image available
                </div>
              )}
            </Modal>
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].saveForm}
            </Button>
          </div>
        </Panel>

        {/* Location */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese
                ? translations.vi.location
                : translations.en.location}
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].locationTitle}
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
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
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
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
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
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].saveLocation}
            </Button>
          </div>
        </Panel>

        {/* Hours */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? translations.vi.hours : translations.en.hours}
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].sectionTitle}
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].hoursList}
                </label>
                {contactHours.contactHoursList.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
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
                          const updated = contactHours.contactHoursList.filter(
                            (_, idx) => idx !== i
                          );
                          setContactHours({
                            ...contactHours,
                            contactHoursList: updated,
                          });
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#E50000", // black
                          border: "1px solid #E50000",
                          color: "#fff",
                          padding: "22px",
                          borderRadius: "9999px", // pill shape
                          fontWeight: "500",
                          fontSize: "13px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Trash2 size={16} />
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
                      backgroundColor: "#262626",
                      color: "#fff",
                      border: "1px solid #2E2F2F",
                      padding: "22px",
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].saveHours}
            </Button>
          </div>
        </Panel>

        {/* Map */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? translations.vi.map : translations.en.map}
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
                <label className="block font-medium mt-5 mb-1">
                  {translations[currentLang].mapTitle}
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
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {translations[currentLang].saveMap}
            </Button>
          </div>
        </Panel>

<Panel
  header={
    <span className="font-semibold text-lg flex items-center text-white gap-2">
      {isVietnamese ? "Đội Liên Hệ" : "Contact Team"}
    </span>
  }
  key="6"
>
  {/* 🌐 Language Tabs */}
  <Tabs
    activeKey={currentLang}
    onChange={setCurrentLang}
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
            {lang === "en" ? "Team Section Intro" : "Phần Giới Thiệu Đội Liên Hệ"}
          </h3>

          {/* Tag */}
          <label className="block font-medium mb-2 text-white">
            {lang === "en" ? "Small Tag" : "Thẻ tiêu đề nhỏ"}
          </label>
          <Input
            value={contactTeam.teamIntro?.tag?.[lang] || ""}
            onChange={(e) =>
              setContactTeam((prev) => ({
                ...prev,
                teamIntro: {
                  ...prev.teamIntro,
                  tag: {
                    ...prev.teamIntro?.tag,
                    [lang]: e.target.value,
                  },
                },
              }))
            }
            placeholder={lang === "en" ? "Our People" : "Đội ngũ của chúng tôi"}
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
            value={contactTeam.teamIntro?.heading?.[lang] || ""}
            onChange={(e) =>
              setContactTeam((prev) => ({
                ...prev,
                teamIntro: {
                  ...prev.teamIntro,
                  heading: {
                    ...prev.teamIntro?.heading,
                    [lang]: e.target.value,
                  },
                },
              }))
            }
            placeholder={
              lang === "en" ? "Meet Our Team" : "Gặp gỡ đội ngũ của chúng tôi"
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
            value={contactTeam.teamIntro?.description?.[lang] || ""}
            onChange={(e) =>
              setContactTeam((prev) => ({
                ...prev,
                teamIntro: {
                  ...prev.teamIntro,
                  description: {
                    ...prev.teamIntro?.description,
                    [lang]: e.target.value,
                  },
                },
              }))
            }
            placeholder={
              lang === "en"
                ? "Our dedicated team provides excellent support..."
                : "Đội ngũ tận tâm của chúng tôi cung cấp hỗ trợ xuất sắc..."
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
            onClick={() => setAddContactTeamModal(true)}
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
          defaultActiveKey={Object.keys(contactTeam.teamList || {})[0]}
        >
          {Object.entries(contactTeam.teamList || {}).map(
            ([teamKey, teamData]) => (
              <TabPane
                key={teamKey}
                tab={
                  <div className="flex items-center gap-2">
                    <span>{teamData.teamLabel?.[lang] || "Untitled Team"}</span>
                    <Trash2
                      size={16}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedTeams = { ...contactTeam.teamList };
                        delete updatedTeams[teamKey];
                        setContactTeam({
                          ...contactTeam,
                          teamList: updatedTeams,
                        });
                      }}
                    />
                  </div>
                }
              >
                {(teamData.members || []).map((member, idx) => (
                  <div key={idx} className="mb-6 text-white border-b pb-4">
                    {/* Name */}
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
                        setContactTeam((prev) => ({
                          ...prev,
                          teamList: {
                            ...prev.teamList,
                            [teamKey]: { ...teamData, members: updated },
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

                    {/* Designation */}
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
                        setContactTeam((prev) => ({
                          ...prev,
                          teamList: {
                            ...prev.teamList,
                            [teamKey]: { ...teamData, members: updated },
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

                    {/* Email */}
                    <label className="block font-medium mt-5 mb-2">Email</label>
                    <Input
                      value={member.teamEmail || ""}
                      onChange={(e) => {
                        const updated = [...teamData.members];
                        updated[idx] = {
                          ...member,
                          teamEmail: e.target.value,
                        };
                        setContactTeam((prev) => ({
                          ...prev,
                          teamList: {
                            ...prev.teamList,
                            [teamKey]: { ...teamData, members: updated },
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

                    {/* Phone */}
                    <label className="block font-medium mt-5 mb-2">
                      {lang === "en" ? "Phone Number" : "Số điện thoại"}
                    </label>
                    <Input
                      value={member.teamPhone || ""}
                      onChange={(e) => {
                        const updated = [...teamData.members];
                        updated[idx] = {
                          ...member,
                          teamPhone: e.target.value.replace(/[^0-9+]/g, ""),
                        };
                        setContactTeam((prev) => ({
                          ...prev,
                          teamList: {
                            ...prev.teamList,
                            [teamKey]: { ...teamData, members: updated },
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
                        setContactTeam((prev) => ({
                          ...prev,
                          teamList: {
                            ...prev.teamList,
                            [teamKey]: { ...teamData, members: updated },
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
                      {lang === "en" ? "Remove Member" : "Xóa thành viên"}
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
                      teamPhone: "",
                    };
                    const updated = [...(teamData.members || []), newMember];
                    setContactTeam((prev) => ({
                      ...prev,
                      teamList: {
                        ...prev.teamList,
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
      onClick={() => handleSave("contactTeam", contactTeam)}
      style={{
        backgroundColor: "#0284C7",
        color: "#fff",
        border: "none",
        padding: "22px 30px",
        borderRadius: "9999px",
        fontWeight: "500",
      }}
    >
      {isVietnamese ? "Lưu Đội Liên Hệ" : "Save Team"}
    </Button>
  </div>

  {/* ➕ Add Team Modal */}
  <Modal
    open={addContactTeamModal}
    onCancel={() => setAddContactTeamModal(false)}
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
    <label className="block font-medium mb-2 text-white">Team Title (EN)</label>
    <Input
      value={tempContactTeamTitle?.en || ""}
      onChange={(e) =>
        setTempContactTeamTitle((prev) => ({ ...prev, en: e.target.value }))
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
    <label className="block font-medium mb-2 text-white">Team Title (VI)</label>
    <Input
      value={tempContactTeamTitle?.vi || ""}
      onChange={(e) =>
        setTempContactTeamTitle((prev) => ({ ...prev, vi: e.target.value }))
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
        onClick={() => setAddContactTeamModal(false)}
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
          if (!tempContactTeamTitle.en && !tempContactTeamTitle.vi) return;
          const newKey = `team_${Date.now()}`;
          setContactTeam((prev) => ({
            ...prev,
            teamList: {
              ...prev.teamList,
              [newKey]: {
                teamLabel: {
                  en: tempContactTeamTitle.en || "New Team",
                  vi: tempContactTeamTitle.vi || "Nhóm Mới",
                },
                members: [],
              },
            },
          }));
          setTempContactTeamTitle({ en: "", vi: "" });
          setAddContactTeamModal(false);
        }}
      >
        {isVietnamese ? "Thêm Nhóm" : "Add Team"}
      </Button>
    </div>
  </Modal>
</Panel>


        {/* SEO META SECTION */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
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

                {/* ✅ Meta Keywords */}
                <label className="block font-medium mt-5 mb-3 text-white">
                  {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                </label>

                <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#1C1C1C] border border-[#2E2F2F] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all">
                  {/* Show existing keywords as tags */}
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

                  {/* Keyword input */}
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
              {translations[currentLang].cancel}
            </Button>

            {/* Save Button */}
            <Button
              onClick={() => handleSave("contactSeoMeta", seoMeta)}
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
              {currentLang === "vi" ? "Lưu SEO Meta" : "Save SEO Meta"}
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ContactPage;
