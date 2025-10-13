import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Modal } from "antd";
import { Plus, Minus, RotateCw, X, Trash2 } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getAboutPage, updateAboutPage } from "../../Api/api";
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

// ✅ Validate file size
const validateFileSize = (file) => {
  if (!file) return true;

  // ✅ Image max 2MB
  if (file.type.startsWith("image/") && file.size > 2 * 1024 * 1024) {
    CommonToaster("Image size must be below 2MB!", "error");
    return false;
  }

  return true;
};

// ✅ Pure file-based handler
const handleImageChange = (e, setter, key) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!validateFileSize(file)) return;

  setter((prev) => ({
    ...prev,
    [key + "File"]: file,
    [key]: URL.createObjectURL(file),
  }));
};

const API_BASE = import.meta.env.VITE_API_URL;

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const AboutPage = () => {
  // const { theme } = useTheme();

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [activeFounderModal, setActiveFounderModal] = useState(null);
  const [activeHistoryModal, setActiveHistoryModal] = useState(null);
  const [activeCoreModal, setActiveCoreModal] = useState(null);
  // 🧠 State for controlling alliance modal
  const [activeAllianceModal, setActiveAllianceModal] = useState(null);

  const [activeTabLang, setActiveTabLang] = useState("en"); // controls inputs
  const [isVietnamese, setIsVietnamese] = useState(false); // controls headers
  const [currentLang, setCurrentLang] = useState("en"); // header language

  // ✅ Auto-sync with body .vi-mode (like FiberPage)
  useEffect(() => {
    const updateLang = () => {
      const viMode = document.body.classList.contains("vi-mode");
      setIsVietnamese(viMode);
      setCurrentLang(viMode ? "vi" : "en");
    };
    updateLang();
    const observer = new MutationObserver(updateLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const translations = {
    en: {
      pageTitle: "About",

      // Sections
      hero: "About Hero",
      overview: "About Overview",
      founder: "Founder",
      missionVision: "Mission & Vision",
      coreValues: "Core Values",
      history: "Company History",
      team: "About Team",
      alliances: "Alliances",

      // Common
      cancel: "Cancel",
      save: "Save",
      add: "Add",
      remove: "Remove",
      banner: "Banner",
      image: "Image",
      title: "Title",
      description: "Description",
      name: "Name",
      designation: "Designation",
      email: "Email",
      year: "Year",
      content: "Content",
      recommendedSize: "Recommended Size: ",

      // Hero
      saveHero: "Save Hero",

      // Overview
      overviewImage: "Overview Image",
      saveOverview: "Save Overview",

      // Founder
      founderTitle: "Founder Title",
      founderName: "Founder Name",
      founderDescription: "Founder Description",
      founderImages: "Founder Images",
      saveFounder: "Save Founder",

      // Mission & Vision
      mainTitle: "Main Title",
      subhead: "Subhead",
      block: "Block",
      boxCount: "Box Count",
      boxDescription: "Box Description",
      saveMissionVision: "Save Mission & Vision",

      // Core Values
      coreImages: "Core Images",
      saveCore: "Save Core Values",

      // History
      addHistory: "Add History Item",
      saveHistory: "Save History",
      historyImage: "History Image",
      removeHistory: "Remove",

      // Team
      addMember: "Add Member",
      removeMember: "Remove Member",
      saveTeam: "Save Team",
    },

    vi: {
      pageTitle: "Quản lý Trang Giới thiệu",

      // Sections
      hero: "Banner Giới thiệu",
      overview: "Tổng quan",
      founder: "Người sáng lập",
      missionVision: "Sứ mệnh & Tầm nhìn",
      coreValues: "Giá trị cốt lõi",
      history: "Lịch sử Công ty",
      team: "Đội ngũ",
      alliances: "Liên minh",

      // Common
      cancel: "Hủy",
      save: "Lưu",
      add: "+ Thêm",
      remove: "Xóa",
      banner: "biểu ngữ",
      image: "Hình ảnh",
      title: "Tiêu đề",
      description: "Mô tả",
      name: "Tên",
      designation: "Chức danh",
      email: "Email",
      year: "Năm",
      content: "Nội dung",
      recommendedSize: "Kích thước đề xuất: ",

      // Hero
      saveHero: "Lưu Banner",

      // Overview
      overviewImage: "Hình ảnh Tổng quan",
      saveOverview: "Lưu Tổng quan",

      // Founder
      founderTitle: "Tiêu đề Người sáng lập",
      founderName: "Tên Người sáng lập",
      founderDescription: "Mô tả Người sáng lập",
      founderImages: "Hình ảnh Người sáng lập",
      saveFounder: "Lưu Người sáng lập",

      // Mission & Vision
      mainTitle: "Tiêu đề chính",
      subhead: "Tiêu đề phụ",
      block: "Khối",
      boxCount: "Số lượng",
      boxDescription: "Mô tả ô",
      saveMissionVision: "Lưu Sứ mệnh & Tầm nhìn",

      // Core Values
      coreImages: "Hình ảnh Giá trị cốt lõi",
      saveCore: "Lưu Giá trị cốt lõi",

      // History
      addHistory: "+ Thêm Mốc Lịch sử",
      saveHistory: "Lưu Lịch sử",
      historyImage: "Hình ảnh Lịch sử",
      removeHistory: "Xóa",

      // Team
      addMember: "+ Thêm Thành viên",
      removeMember: "Xóa Thành viên",
      saveTeam: "Lưu Đội ngũ",
    },
  };

  // ---------------------- STATES (persistent) ---------------------- //
  const [aboutHero, setAboutHero] = usePersistedState("aboutHero", {
    aboutTitle: { en: "", vi: "" },
    aboutBanner: "",
    aboutBannerFile: null,
  });

  const [aboutOverview, setAboutOverview] = usePersistedState("aboutOverview", {
    aboutOverviewTitle: { en: "", vi: "" },
    aboutOverviewDes: { en: "", vi: "" },
    aboutOverviewImg: "",
    aboutOverviewFile: null,
  });

  const [aboutFounder, setAboutFounder] = usePersistedState("aboutFounder", {
    aboutFounderTitle: { en: "", vi: "" },
    aboutFounderName: { en: "", vi: "" },
    aboutFounderDes: [{ en: "", vi: "" }],
    founderImg1: "",
    founderImg1File: null,
    founderImg2: "",
    founderImg2File: null,
    founderImg3: "",
    founderImg3File: null,
  });

  const [aboutMissionVission, setAboutMissionVission] = usePersistedState(
    "aboutMissionVission",
    {
      aboutMissionVissionTitle: { en: "", vi: "" },
      aboutMissionVissionSubhead1: { en: "", vi: "" },
      aboutMissionVissionDes1: { en: "", vi: "" },
      aboutMissionVissionSubhead2: { en: "", vi: "" },
      aboutMissionVissionDes2: { en: "", vi: "" },
      aboutMissionVissionSubhead3: { en: "", vi: "" },
      aboutMissionVissionDes3: { en: "", vi: "" },
      aboutMissionVissionBoxCount1: 0,
      aboutMissionBoxDes1: { en: "", vi: "" },
      aboutMissionVissionBoxCount2: 0,
      aboutMissionBoxDes2: { en: "", vi: "" },
      aboutMissionVissionBoxCount3: 0,
      aboutMissionBoxDes3: { en: "", vi: "" },
    }
  );

  const [aboutCore, setAboutCore] = usePersistedState("aboutCore", {
    aboutCoreBg1: "",
    aboutCoreBg1File: null,
    aboutCoreTitle1: { en: "", vi: "" },
    aboutCoreDes1: { en: "", vi: "" },
    aboutCoreBg2: "",
    aboutCoreBg2File: null,
    aboutCoreTitle2: { en: "", vi: "" },
    aboutCoreDes2: { en: "", vi: "" },
    aboutCoreBg3: "",
    aboutCoreBg3File: null,
    aboutCoreTitle3: { en: "", vi: "" },
    aboutCoreDes3: { en: "", vi: "" },
  });

  const [aboutHistory, setAboutHistory] = usePersistedState("aboutHistory", []);
  const [aboutTeam, setAboutTeam] = usePersistedState("aboutTeam", {});
  const [isAddTeamModalVisible, setIsAddTeamModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState({ en: "", vi: "" });


  // const [aboutTeam, setAboutTeam] = usePersistedState("aboutTeam", {
  //   cottonTeam: [],
  //   machineTeam: [],
  //   fiberTeam: [],
  //   marketingTeam: [],
  //   directorTeam: [],
  // });

const handleAddTeam = async () => {
  const trimmedEN = newTeamName.en?.trim();
  const trimmedVI = newTeamName.vi?.trim();

  if (!trimmedEN || !trimmedVI) {
    CommonToaster("Please fill both English and Vietnamese names!", "error");
    return;
  }

  const safeKey = trimmedEN.replace(/\s+/g, "_").toLowerCase();

  const currentTeams = aboutTeam?.dynamicTeams || aboutTeam || {};

  if (currentTeams[safeKey]) {
    CommonToaster("This team already exists!", "error");
    return;
  }

  // ✅ Add bilingual team name
  const newTeam = {
    teamLabel: { en: trimmedEN, vi: trimmedVI },
    members: [], // each team will have its own member list
  };

  const updatedTeams = {
    ...currentTeams,
    [safeKey]: newTeam,
  };

  const newAboutTeam = aboutTeam?.dynamicTeams
    ? { dynamicTeams: updatedTeams }
    : updatedTeams;

  setAboutTeam(newAboutTeam);
  setIsAddTeamModalVisible(false);
  setNewTeamName({ en: "", vi: "" });

  // ✅ Persist
  try {
    const formData = new FormData();
    formData.append("aboutTeam", JSON.stringify(newAboutTeam));
    await updateAboutPage(formData);
    CommonToaster(
      isVietnamese ? "Thêm nhóm thành công!" : "Team added successfully!",
      "success"
    );
  } catch (err) {
    console.error(err);
  }
};


// Remove team completely (fixes your issue)
const handleRemoveTeam = async (teamKey) => {
  try {
    const currentTeams = aboutTeam?.dynamicTeams || aboutTeam || {};
    const updatedTeams = Object.fromEntries(
      Object.entries(currentTeams).filter(([key]) => key !== teamKey)
    );

    const newAboutTeam = aboutTeam?.dynamicTeams
      ? { dynamicTeams: updatedTeams }
      : updatedTeams;

    setAboutTeam(newAboutTeam);

    const formData = new FormData();
    formData.append("aboutTeam", JSON.stringify(newAboutTeam));

    await updateAboutPage(formData);

    CommonToaster(
      isVietnamese ? "Xóa nhóm thành công!" : "Team removed successfully!",
      "success"
    );
  } catch (err) {
    CommonToaster(
      "Error",
      err.message || "Something went wrong while removing team!"
    );
  }
};


  const [aboutAlliances, setAboutAlliances] = usePersistedState(
    "aboutAlliances",
    {
      aboutAlliancesImg: [],
      aboutAlliancesFiles: [],
    }
  );

  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });
  // ---------------------- FETCH (only once to init) ---------------------- //
  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const res = await getAboutPage();
        const data = res.data || {};

        // ✅ ABOUT HERO SECTION
        if (data.aboutHero) {
          setAboutHero((prev) => ({
            ...data.aboutHero,
            aboutBannerFile: prev.aboutBannerFile || null,
          }));
        } else {
          setAboutHero({
            aboutTitle: { en: "", vi: "" },
            aboutBanner: "",
            aboutBannerFile: null,
          });
        }

        // ✅ OVERVIEW SECTION
        if (data.aboutOverview) {
          setAboutOverview((prev) => ({
            ...data.aboutOverview,
            aboutOverviewFile: prev.aboutOverviewFile || null,
          }));
        } else {
          setAboutOverview({
            aboutOverviewImg: "",
            aboutOverviewTitle: { en: "", vi: "" },
            aboutOverviewDes: { en: "", vi: "" },
            aboutOverviewFile: null,
          });
        }

        // ✅ FOUNDER SECTION
        if (data.aboutFounder) {
          setAboutFounder((prev) => ({
            ...data.aboutFounder,
            founderImg1File: prev.founderImg1File || null,
            founderImg2File: prev.founderImg2File || null,
            founderImg3File: prev.founderImg3File || null,
          }));
        } else {
          setAboutFounder({
            aboutFounderTitle: { en: "", vi: "" },
            aboutFounderName: { en: "", vi: "" },
            aboutFounderDes: [{ en: "", vi: "" }],
            founderImg1: "",
            founderImg2: "",
            founderImg3: "",
            founderImg1File: null,
            founderImg2File: null,
            founderImg3File: null,
          });
        }

        // ✅ MISSION & VISION SECTION
        if (data.aboutMissionVission) {
          setAboutMissionVission(data.aboutMissionVission);
        } else {
          setAboutMissionVission({
            aboutMissionVissionTitle: { en: "", vi: "" },
            aboutMissionVissionSubhead1: { en: "", vi: "" },
            aboutMissionVissionDes1: { en: "", vi: "" },
            aboutMissionVissionSubhead2: { en: "", vi: "" },
            aboutMissionVissionDes2: { en: "", vi: "" },
            aboutMissionVissionSubhead3: { en: "", vi: "" },
            aboutMissionVissionDes3: { en: "", vi: "" },
            aboutMissionVissionBoxCount1: 0,
            aboutMissionBoxDes1: { en: "", vi: "" },
            aboutMissionVissionBoxCount2: 0,
            aboutMissionBoxDes2: { en: "", vi: "" },
            aboutMissionVissionBoxCount3: 0,
            aboutMissionBoxDes3: { en: "", vi: "" },
          });
        }

        // ✅ CORE VALUES SECTION
        if (data.aboutCore) {
          setAboutCore((prev) => ({
            ...data.aboutCore,
            aboutCoreBg1File: prev.aboutCoreBg1File || null,
            aboutCoreBg2File: prev.aboutCoreBg2File || null,
            aboutCoreBg3File: prev.aboutCoreBg3File || null,
          }));
        } else {
          setAboutCore({
            aboutCoreBg1: "",
            aboutCoreTitle1: { en: "", vi: "" },
            aboutCoreDes1: { en: "", vi: "" },
            aboutCoreBg2: "",
            aboutCoreTitle2: { en: "", vi: "" },
            aboutCoreDes2: { en: "", vi: "" },
            aboutCoreBg3: "",
            aboutCoreTitle3: { en: "", vi: "" },
            aboutCoreDes3: { en: "", vi: "" },
            aboutCoreBg1File: null,
            aboutCoreBg2File: null,
            aboutCoreBg3File: null,
          });
        }

        // ✅ HISTORY SECTION
        if (Array.isArray(data.aboutHistory)) {
          setAboutHistory(data.aboutHistory);
        } else {
          setAboutHistory([]);
        }

        // ✅ TEAM SECTION
        if (data.aboutTeam && typeof data.aboutTeam === "object") {
        setAboutTeam(data.aboutTeam);
      } else {
        // fallback — start empty if no teams exist yet
        setAboutTeam({});
      }

        // ✅ ALLIANCES SECTION
        if (data.aboutAlliances) {
          setAboutAlliances((prev) => ({
            ...data.aboutAlliances,
            aboutAlliancesFiles: prev.aboutAlliancesFiles || [],
          }));
        } else {
          setAboutAlliances({
            aboutAlliancesImg: [],
            aboutAlliancesFiles: [],
          });
        }

        // ✅ SEO META SECTION
        if (data.seoMeta) {
          setSeoMeta({
            metaTitle: data.seoMeta.metaTitle || { en: "", vi: "" },
            metaDescription: data.seoMeta.metaDescription || { en: "", vi: "" },
            metaKeywords: data.seoMeta.metaKeywords || { en: "", vi: "" },
          });
        } else {
          setSeoMeta({
            metaTitle: { en: "", vi: "" },
            metaDescription: { en: "", vi: "" },
            metaKeywords: { en: "", vi: "" },
          });
        }
      } catch (error) {
        console.error("Failed to fetch About Page:", error);
      }
    };

    fetchAboutPage();
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

      // ✅ Convert JSON object to string safely
      formData.append(sectionName, JSON.stringify(formState));

      // ✅ Append only actual file keys if needed
      files.forEach((fileKey) => {
        if (formState[fileKey] instanceof File) {
          formData.append(fileKey, formState[fileKey]);
        }
      });

      // ✅ Important: Add sectionName explicitly to let backend detect which section this belongs to
      formData.append("section", sectionName);

      const res = await updateAboutPage(formData);

      if (res.data?.about) {
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      CommonToaster("error", error.message || "Something went wrong!");
    }
  };

  // ---------------------- UI ---------------------- //
  return (
    <div className="max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717]">
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
          .ant-modal-header{
            background-color:transparent !important;
          }
            .ant-modal-title{
              color:#fff !important;
              font-size:24px !important;
            }
               .custom-input::placeholder {
        color: #9CA3AF !important; /* Tailwind's gray-400 */
        opacity: 1;
      }
      `}</style>
      <h2 className="text-5xl font-extrabold mb-10 text-center text-white">
        {isVietnamese ? "Trang Giới thiệu" : "About Page"}
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
        {/* HERO EXAMPLE (others follow same pattern) */}
        <Panel
          header={
            <span className="font-semibold text-lg text-white flex items-center gap-2">
              {isVietnamese ? "Banner Giới thiệu" : "About Hero"}
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
                <label className="block font-medium mt-5 mb-3">
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
                  value={aboutHero.aboutTitle[lang]}
                  onChange={(e) =>
                    setAboutHero({
                      ...aboutHero,
                      aboutTitle: {
                        ...aboutHero.aboutTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* --- Banner Upload Section --- */}
          <label className="block font-bold mt-5 mb-3">
            {translations[activeTabLang].banner}
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommendedSize} 1260×420px
          </p>

          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-2">
              {activeTabLang === "vi" ? "Tải lên banner" : "Upload Banner"}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- Upload Box (Empty) --- */}
              {!aboutHero.aboutBannerFile && !aboutHero.aboutBanner ? (
                <label
                  htmlFor="aboutHeroUpload"
                  className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                  <span className="mt-2 text-sm text-gray-400">
                    {activeTabLang === "vi"
                      ? "Tải lên banner"
                      : "Upload Banner"}
                  </span>
                  <input
                    id="aboutHeroUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setAboutHero({
                        ...aboutHero,
                        aboutBannerFile: file,
                      });
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                // --- Preview Box (Uploaded or DB) ---
                <div className="relative w-48 h-48 group">
                  <img
                    src={
                      aboutHero.aboutBannerFile
                        ? URL.createObjectURL(aboutHero.aboutBannerFile)
                        : getFullUrl(aboutHero.aboutBanner)
                    }
                    alt="Hero Banner"
                    className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                  />

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowBannerModal(true)}
                    className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Xem banner" : "View Full"}
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
                    htmlFor="changeAboutHero"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={
                      activeTabLang === "vi"
                        ? "Thay đổi banner"
                        : "Change Banner"
                    }
                  >
                    <input
                      id="changeAboutHero"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setAboutHero({
                          ...aboutHero,
                          aboutBannerFile: file,
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
                      setAboutHero({
                        ...aboutHero,
                        aboutBanner: null,
                        aboutBannerFile: null,
                      })
                    }
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                    title={
                      activeTabLang === "vi" ? "Xóa banner" : "Remove Banner"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* 🖼 Full Preview Modal */}
            <Modal
              open={showBannerModal}
              footer={null}
              onCancel={() => setShowBannerModal(false)}
              centered
              width={600}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              <img
                src={
                  aboutHero.aboutBannerFile
                    ? URL.createObjectURL(aboutHero.aboutBannerFile)
                    : getFullUrl(aboutHero.aboutBanner)
                }
                alt="Full Banner Preview"
                className="w-full h-auto rounded-lg"
              />
            </Modal>
          </div>

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
              onClick={() =>
                handleSave("aboutHero", aboutHero, ["aboutBannerFile"])
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
              }}
            >
              {translations[activeTabLang].saveHero}
            </Button>
          </div>
        </Panel>

        {/* OVERVIEW */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Tổng quan" : "About Overview"}
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
                <label className="block font-medium mt-5 mb-3">
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
                  value={aboutOverview.aboutOverviewTitle[lang]}
                  onChange={(e) =>
                    setAboutOverview({
                      ...aboutOverview,
                      aboutOverviewTitle: {
                        ...aboutOverview.aboutOverviewTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-medium mt-3">
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
                  value={aboutOverview.aboutOverviewDes[lang]}
                  onChange={(e) =>
                    setAboutOverview({
                      ...aboutOverview,
                      aboutOverviewDes: {
                        ...aboutOverview.aboutOverviewDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          {/* --- Overview Image Upload --- */}
          <label className="block text-white text-lg font-semibold  !mt-5">
            {activeTabLang === "vi" ? "Hình ảnh Tổng quan" : "Overview Image"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommendedSize} 530×310px
          </p>

          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mt-2">
              {/* --- Upload Box (Empty) --- */}
              {!aboutOverview.aboutOverviewFile &&
              !aboutOverview.aboutOverviewImg ? (
                <label
                  htmlFor="aboutOverviewUpload"
                  className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                  <span className="mt-2 text-sm text-gray-400">
                    {activeTabLang === "vi"
                      ? "Tải lên hình ảnh"
                      : "Upload Image"}
                  </span>
                  <input
                    id="aboutOverviewUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (!validateFileSize(file)) return;
                      setAboutOverview({
                        ...aboutOverview,
                        aboutOverviewFile: file,
                      });
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                // --- Preview Box (Uploaded or from DB) ---
                <div className="relative w-48 h-48 group">
                  <img
                    src={
                      aboutOverview.aboutOverviewFile
                        ? URL.createObjectURL(aboutOverview.aboutOverviewFile)
                        : getFullUrl(aboutOverview.aboutOverviewImg)
                    }
                    alt="Overview Image"
                    className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                  />

                  {/* 👁 View Full */}
                  <button
                    type="button"
                    onClick={() => setShowOverviewModal(true)}
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
                    htmlFor="changeOverviewUpload"
                    className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                    title={
                      activeTabLang === "vi" ? "Thay đổi hình" : "Change Image"
                    }
                  >
                    <input
                      id="changeOverviewUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        setAboutOverview({
                          ...aboutOverview,
                          aboutOverviewFile: file,
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
                      setAboutOverview({
                        ...aboutOverview,
                        aboutOverviewFile: null,
                        aboutOverviewImg: "",
                      })
                    }
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                    title={activeTabLang === "vi" ? "Xóa hình" : "Remove Image"}
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

            {/* 🖼 Full Image Modal */}
            <Modal
              open={showOverviewModal}
              footer={null}
              onCancel={() => setShowOverviewModal(false)}
              centered
              width={600}
              bodyStyle={{ background: "#000", padding: "0" }}
            >
              <img
                src={
                  aboutOverview.aboutOverviewFile
                    ? URL.createObjectURL(aboutOverview.aboutOverviewFile)
                    : getFullUrl(aboutOverview.aboutOverviewImg)
                }
                alt="Full Overview Preview"
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("aboutOverview", aboutOverview, [
                  "aboutOverviewFile",
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
              }}
            >
              {translations[activeTabLang].saveOverview}
            </Button>
          </div>
        </Panel>

        {/* FOUNDER */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {translations[currentLang].founder}
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[activeTabLang].founderTitle}
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
                  value={aboutFounder.aboutFounderTitle[lang]}
                  onChange={(e) =>
                    setAboutFounder({
                      ...aboutFounder,
                      aboutFounderTitle: {
                        ...aboutFounder.aboutFounderTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-medium mt-5 mb-3">
                  {translations[activeTabLang].founderName}
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
                  value={aboutFounder.aboutFounderName[lang]}
                  onChange={(e) =>
                    setAboutFounder({
                      ...aboutFounder,
                      aboutFounderName: {
                        ...aboutFounder.aboutFounderName,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                <label className="block font-medium mt-5 mb-3">
                  {translations[activeTabLang].founderDescription}
                </label>

                {aboutFounder.aboutFounderDes?.map((desc, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
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
                      value={desc[lang]}
                      onChange={(e) => {
                        const updated = [...aboutFounder.aboutFounderDes];
                        updated[idx] = {
                          ...updated[idx],
                          [lang]: e.target.value,
                        };
                        setAboutFounder({
                          ...aboutFounder,
                          aboutFounderDes: updated,
                        });
                      }}
                    />
                    <Button
                      className="!bg-red-600 !border-0 !text-white"
                      onClick={async () => {
                        try {
                          // 1️⃣ Remove locally
                          const updated = aboutFounder.aboutFounderDes.filter(
                            (_, i) => i !== idx
                          );
                          const newFounder = {
                            ...aboutFounder,
                            aboutFounderDes: updated,
                          };
                          setAboutFounder(newFounder);

                          // 2️⃣ Send update immediately
                          const formData = new FormData();
                          formData.append(
                            "aboutFounder",
                            JSON.stringify(newFounder)
                          );

                          const res = await updateAboutPage(formData);

                          if (res.data?.about?.aboutFounder) {
                            setAboutFounder(res.data.about.aboutFounder);
                            localStorage.removeItem("aboutFounder");
                            CommonToaster(
                              "Description removed successfully!",
                              "success"
                            );
                          } else {
                            CommonToaster(
                              "Failed to remove description",
                              "error"
                            );
                          }
                        } catch (err) {
                          CommonToaster(
                            "Error",
                            err.message || "Something went wrong!"
                          );
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() =>
                    setAboutFounder({
                      ...aboutFounder,
                      aboutFounderDes: [
                        ...aboutFounder.aboutFounderDes,
                        { en: "", vi: "" },
                      ],
                    })
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#262626", // white button
                    color: "#fff", // dark text
                    border: "1px solid #2E2F2F",
                    padding: "22px 30px",
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

          {/* Founder Images Upload Section */}
          <label className="block font-bold mt-5 mb-3">
            {translations[activeTabLang].founderImages}
          </label>
          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommendedSize} 350×550px
          </p>

          <div className="flex flex-wrap gap-6 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative group w-40 h-56">
                {/* --- Image Preview --- */}
                {aboutFounder[`founderImg${i}File`] ||
                aboutFounder[`founderImg${i}`] ? (
                  <>
                    <img
                      src={
                        aboutFounder[`founderImg${i}File`]
                          ? URL.createObjectURL(
                              aboutFounder[`founderImg${i}File`]
                            )
                          : getFullUrl(aboutFounder[`founderImg${i}`])
                      }
                      alt={`Founder ${i}`}
                      className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                    />

                    {/* 👁 View Full */}
                    <button
                      type="button"
                      onClick={() => setActiveFounderModal(i)}
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
                      htmlFor={`changeFounderUpload-${i}`}
                      className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                      title={
                        activeTabLang === "vi"
                          ? "Thay đổi hình"
                          : "Change Image"
                      }
                    >
                      <input
                        id={`changeFounderUpload-${i}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setAboutFounder,
                            `founderImg${i}`
                          )
                        }
                        style={{ display: "none" }}
                      />
                      <RotateCw className="w-4 h-4" />
                    </label>

                    {/* ❌ Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        setAboutFounder({
                          ...aboutFounder,
                          [`founderImg${i}`]: "",
                          [`founderImg${i}File`]: null,
                        })
                      }
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer opacity-0 group-hover:opacity-100"
                      title={
                        activeTabLang === "vi" ? "Xóa hình" : "Remove Image"
                      }
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
                  </>
                ) : (
                  /* --- Empty Upload Box --- */
                  <label
                    htmlFor={`founderUpload-${i}`}
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                    <span className="mt-2 text-sm text-gray-400">
                      {activeTabLang === "vi"
                        ? `Tải lên hình ${i}`
                        : `Upload Image ${i}`}
                    </span>
                    <input
                      id={`founderUpload-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(e, setAboutFounder, `founderImg${i}`)
                      }
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* 🖼 Founder Image Modal Preview */}
          <Modal
            open={activeFounderModal !== null}
            footer={null}
            onCancel={() => setActiveFounderModal(null)}
            centered
            width={600}
            bodyStyle={{ background: "#000", padding: "0" }}
          >
            {activeFounderModal && (
              <img
                src={
                  aboutFounder[`founderImg${activeFounderModal}File`]
                    ? URL.createObjectURL(
                        aboutFounder[`founderImg${activeFounderModal}File`]
                      )
                    : getFullUrl(
                        aboutFounder[`founderImg${activeFounderModal}`]
                      )
                }
                alt={`Founder ${activeFounderModal} Full`}
                className="w-full h-auto rounded-lg"
              />
            )}
          </Modal>

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
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("aboutFounder", aboutFounder, [
                  "founderImg1File",
                  "founderImg2File",
                  "founderImg3File",
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
              }}
            >
              {translations[activeTabLang].saveFounder}
            </Button>
          </div>
        </Panel>

        {/* MISSION & VISION */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Sứ mệnh & Tầm nhìn" : "Mission & Vision"}
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
                <label className="block font-medium mt-5 mb-3">
                  {translations[activeTabLang].mainTitle}
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
                  value={aboutMissionVission.aboutMissionVissionTitle[lang]}
                  onChange={(e) =>
                    setAboutMissionVission({
                      ...aboutMissionVission,
                      aboutMissionVissionTitle: {
                        ...aboutMissionVission.aboutMissionVissionTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />

                {/* 3 Sub-sections */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mt-6 text-white">
                    <h4 className="font-semibold mb-2 text-xl mt-12">
                      {translations[activeTabLang].block} {i}
                    </h4>

                    <label className="block font-medium mt-5 mb-3">
                      {translations[activeTabLang].subhead} {i}
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
                      value={
                        aboutMissionVission[`aboutMissionVissionSubhead${i}`][
                          lang
                        ]
                      }
                      onChange={(e) =>
                        setAboutMissionVission({
                          ...aboutMissionVission,
                          [`aboutMissionVissionSubhead${i}`]: {
                            ...aboutMissionVission[
                              `aboutMissionVissionSubhead${i}`
                            ],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="block font-medium mt-5 mb-3">
                      {translations[activeTabLang].description} {i}
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
                      value={
                        aboutMissionVission[`aboutMissionVissionDes${i}`][lang]
                      }
                      onChange={(e) =>
                        setAboutMissionVission({
                          ...aboutMissionVission,
                          [`aboutMissionVissionDes${i}`]: {
                            ...aboutMissionVission[
                              `aboutMissionVissionDes${i}`
                            ],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="block font-medium mt-2">
                      {translations[activeTabLang].boxCount} {i}
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
                      type="number"
                      value={
                        aboutMissionVission[`aboutMissionVissionBoxCount${i}`]
                      }
                      onChange={(e) =>
                        setAboutMissionVission({
                          ...aboutMissionVission,
                          [`aboutMissionVissionBoxCount${i}`]: Number(
                            e.target.value
                          ),
                        })
                      }
                    />

                    <label className="block font-medium mt-5 mb-3">
                      {translations[activeTabLang].boxDescription} {i}
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
                      value={
                        aboutMissionVission[`aboutMissionBoxDes${i}`][lang]
                      }
                      onChange={(e) =>
                        setAboutMissionVission({
                          ...aboutMissionVission,
                          [`aboutMissionBoxDes${i}`]: {
                            ...aboutMissionVission[`aboutMissionBoxDes${i}`],
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
                padding: "22px 30px",
                borderRadius: "9999px", // pill shape
                fontWeight: "500",
              }}
            >
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("aboutMissionVission", aboutMissionVission)
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
              }}
            >
              {translations[activeTabLang].saveMissionVision}
            </Button>
          </div>
        </Panel>

        {/* CORE VALUES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Giá trị cốt lõi" : "Core Values"}
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
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-6">
                    <label className="block font-medium mt-5 mb-3">
                      {translations[activeTabLang].title} {i}
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
                      value={aboutCore[`aboutCoreTitle${i}`][lang]}
                      onChange={(e) =>
                        setAboutCore((prev) => ({
                          ...prev,
                          [`aboutCoreTitle${i}`]: {
                            ...prev[`aboutCoreTitle${i}`],
                            [lang]: e.target.value,
                          },
                        }))
                      }
                    />

                    <label className="block font-medium mt-5 mb-3">
                      {translations[activeTabLang].description} {i}
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
                      value={aboutCore[`aboutCoreDes${i}`][lang]}
                      onChange={(e) =>
                        setAboutCore((prev) => ({
                          ...prev,
                          [`aboutCoreDes${i}`]: {
                            ...prev[`aboutCoreDes${i}`],
                            [lang]: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>

          <p className="text-sm text-slate-500 mb-2">
            {translations[activeTabLang].recommendedSize} 620×510px
          </p>
          <label className="block font-bold mt-5 mb-3">
            {translations[activeTabLang].coreImages}
          </label>

          <div className="flex flex-wrap gap-6 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative group w-48 h-48">
                {/* --- Image Preview --- */}
                {aboutCore[`aboutCoreBg${i}File`] ||
                aboutCore[`aboutCoreBg${i}`] ? (
                  <>
                    <img
                      src={
                        aboutCore[`aboutCoreBg${i}File`]
                          ? URL.createObjectURL(
                              aboutCore[`aboutCoreBg${i}File`]
                            )
                          : getFullUrl(aboutCore[`aboutCoreBg${i}`])
                      }
                      alt={`Core ${i}`}
                      className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                    />

                    {/* 👁 View Full */}
                    <button
                      type="button"
                      onClick={() => setActiveCoreModal(i)}
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
                      htmlFor={`changeCoreUpload-${i}`}
                      className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 !text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                      title={
                        activeTabLang === "vi"
                          ? "Thay đổi hình"
                          : "Change Image"
                      }
                    >
                      <input
                        id={`changeCoreUpload-${i}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e, setAboutCore, `aboutCoreBg${i}`)
                        }
                        style={{ display: "none" }}
                      />
                      <RotateCw className="w-4 h-4" />
                    </label>

                    {/* ❌ Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        setAboutCore({
                          ...aboutCore,
                          [`aboutCoreBg${i}`]: "",
                          [`aboutCoreBg${i}File`]: null,
                        })
                      }
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer opacity-0 group-hover:opacity-100"
                      title={
                        activeTabLang === "vi" ? "Xóa hình" : "Remove Image"
                      }
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
                  </>
                ) : (
                  /* --- Empty Upload Box --- */
                  <label
                    htmlFor={`aboutCoreUpload-${i}`}
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                    <span className="mt-2 text-sm text-gray-400">
                      {activeTabLang === "vi"
                        ? `Tải lên hình ${i}`
                        : `Upload Core Image ${i}`}
                    </span>
                    <input
                      id={`aboutCoreUpload-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(e, setAboutCore, `aboutCoreBg${i}`)
                      }
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* 🖼 Modal Preview */}
          <Modal
            open={!!activeCoreModal}
            footer={null}
            onCancel={() => setActiveCoreModal(null)}
            centered
            width={600}
            bodyStyle={{ background: "#000", padding: "0" }}
          >
            {activeCoreModal && (
              <img
                src={
                  aboutCore[`aboutCoreBg${activeCoreModal}File`]
                    ? URL.createObjectURL(
                        aboutCore[`aboutCoreBg${activeCoreModal}File`]
                      )
                    : getFullUrl(aboutCore[`aboutCoreBg${activeCoreModal}`])
                }
                alt={`Core ${activeCoreModal} Full`}
                className="w-full h-auto rounded-lg"
              />
            )}
          </Modal>

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
              {translations[activeTabLang].cancel}
            </Button>

            {/* Save Button (Blue) */}
            <Button
              onClick={() =>
                handleSave("aboutCore", aboutCore, [
                  "aboutCoreBg1File",
                  "aboutCoreBg2File",
                  "aboutCoreBg3File",
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
              }}
            >
              {translations[activeTabLang].saveCore}
            </Button>
          </div>
        </Panel>

        {/* HISTORY */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Lịch sử công ty" : "Company History"}
            </span>
          }
          key="6"
        >
          {aboutHistory.map((item, index) => (
            <div key={index} className="mb-6 shadow-sm text-white">
              {/* 📅 Year */}
              <label className="block font-medium mt-5 mb-3">
                {translations[activeTabLang].year}
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
                  marginBottom: "12px",
                }}
                value={item.year}
                onChange={(e) => {
                  const newHistory = [...aboutHistory];
                  newHistory[index].year = e.target.value;
                  setAboutHistory(newHistory);
                }}
              />

              {/* 🌐 Language Tabs */}
              <Tabs
                activeKey={activeTabLang}
                onChange={setActiveTabLang}
                className="mt-12 pill-tabs"
              >
                {["en", "vi"].map((lang) => (
                  <TabPane
                    tab={lang === "en" ? "English (EN)" : "Tiếng Việt (VN)"}
                    key={lang}
                  >
                    <label className="block font-medium">
                      {translations[activeTabLang].content} ({lang})
                    </label>
                    <Input.TextArea
                      style={{
                        backgroundColor: "#262626",
                        border: "1px solid #2E2F2F",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px 14px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      rows={3}
                      value={item.content?.[lang]}
                      onChange={(e) => {
                        const newHistory = [...aboutHistory];
                        newHistory[index].content = {
                          ...newHistory[index].content,
                          [lang]: e.target.value,
                        };
                        setAboutHistory(newHistory);
                      }}
                    />
                  </TabPane>
                ))}
              </Tabs>

              {/* 🖼 History Image Upload */}
              <label className="block font-bold mt-5 mb-3">
                {translations[activeTabLang].historyImage}
              </label>
              <p className="text-sm text-slate-500 mb-2">
                {translations[activeTabLang].recommendedSize} 720×920px
              </p>

              <div className="relative group w-48 h-64">
                {item.imageFile || item.image ? (
                  <>
                    <img
                      src={
                        item.imageFile
                          ? URL.createObjectURL(item.imageFile)
                          : getFullUrl(item.image)
                      }
                      alt={`History ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                    />

                    {/* 👁 View Full */}
                    <button
                      type="button"
                      onClick={() => setActiveHistoryModal(index)}
                      className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
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
                      htmlFor={`changeHistoryUpload-${index}`}
                      className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                      title={
                        activeTabLang === "vi"
                          ? "Thay đổi hình"
                          : "Change Image"
                      }
                    >
                      <input
                        id={`changeHistoryUpload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!validateFileSize(file)) return;
                          const newHistory = [...aboutHistory];
                          newHistory[index].imageFile = file;
                          newHistory[index].image = "";
                          setAboutHistory(newHistory);
                        }}
                        style={{ display: "none" }}
                      />
                      <RotateCw className="w-4 h-4" />
                    </label>

                    {/* ❌ Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        const newHistory = [...aboutHistory];
                        newHistory[index].imageFile = null;
                        newHistory[index].image = "";
                        setAboutHistory(newHistory);
                      }}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition cursor-pointer opacity-0 group-hover:opacity-100"
                      title={
                        activeTabLang === "vi" ? "Xóa hình" : "Remove Image"
                      }
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
                  </>
                ) : (
                  <label
                    htmlFor={`aboutHistoryUpload-${index}`}
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                    <span className="mt-2 text-sm text-gray-400">
                      {activeTabLang === "vi"
                        ? `Tải lên hình ${index + 1}`
                        : `Upload Image ${index + 1}`}
                    </span>
                    <input
                      id={`aboutHistoryUpload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!validateFileSize(file)) return;
                        const newHistory = [...aboutHistory];
                        newHistory[index].imageFile = file;
                        newHistory[index].image = "";
                        setAboutHistory(newHistory);
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              {/* 🖼 Modal Preview */}
              <Modal
                open={activeHistoryModal === index}
                footer={null}
                onCancel={() => setActiveHistoryModal(null)}
                centered
                width={600}
                bodyStyle={{ background: "#000", padding: "0" }}
              >
                {activeHistoryModal === index && (
                  <img
                    src={
                      item.imageFile
                        ? URL.createObjectURL(item.imageFile)
                        : getFullUrl(item.image)
                    }
                    alt={`History ${index + 1} Full`}
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </Modal>

              {/* 🗑 Remove Button */}
              <div className="flex justify-end mt-3">
                <Button
                  danger
                  onClick={async () => {
                    try {
                      const newHistory = aboutHistory.filter(
                        (_, i) => i !== index
                      );
                      setAboutHistory(newHistory);

                      const formData = new FormData();
                      formData.append(
                        "aboutHistory",
                        JSON.stringify(newHistory)
                      );

                      newHistory.forEach((item, i) => {
                        if (item.imageFile instanceof File) {
                          formData.append(`historyImage${i}`, item.imageFile);
                        }
                      });

                      const res = await updateAboutPage(formData);
                      if (res.data?.about?.aboutHistory) {
                        setAboutHistory(res.data.about.aboutHistory);
                        localStorage.removeItem("aboutHistory");
                        CommonToaster(
                          activeTabLang === "vi"
                            ? "Xóa lịch sử thành công!"
                            : "History item removed successfully!",
                          "success"
                        );
                      } else {
                        CommonToaster(
                          activeTabLang === "vi"
                            ? "Xóa lịch sử thất bại!"
                            : "Failed to remove history item",
                          "error"
                        );
                      }
                    } catch (err) {
                      CommonToaster(
                        "Error",
                        err.message || "Something went wrong!"
                      );
                    }
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#E50000",
                    color: "#fff",
                    border: "none",
                    padding: "22px 30px",
                    borderRadius: "9999px",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Trash2 size={15} />
                  {translations[activeTabLang].removeHistory}
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            {/* ➕ Add History */}
            <Button
              onClick={() =>
                setAboutHistory([
                  ...aboutHistory,
                  {
                    year: "",
                    content: { en: "", vi: "" },
                    image: "",
                    imageFile: null,
                  },
                ])
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
                fontWeight: "600",
                fontSize: "14px",
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
              {translations[activeTabLang].addHistory}
            </Button>

            {/* 💾 Save History */}
            <Button
              type="primary"
              onClick={async () => {
                const formData = new FormData();
                formData.append("aboutHistory", JSON.stringify(aboutHistory));

                aboutHistory.forEach((item, i) => {
                  if (item.imageFile) {
                    formData.append(`historyImage${i}`, item.imageFile);
                  }
                });

                const res = await updateAboutPage(formData);
                if (res.data?.about?.aboutHistory) {
                  setAboutHistory(res.data.about.aboutHistory);
                  localStorage.removeItem("aboutHistory");
                  CommonToaster(
                    activeTabLang === "vi"
                      ? "Lưu lịch sử thành công!"
                      : "History saved successfully!",
                    "success"
                  );
                } else {
                  CommonToaster(
                    activeTabLang === "vi"
                      ? "Không thể lưu lịch sử!"
                      : "Failed to save history",
                    "error"
                  );
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#10B981",
                color: "#fff",
                border: "none",
                padding: "22px 30px",
                borderRadius: "9999px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {translations[activeTabLang].saveHistory}
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
  <Tabs activeKey={activeTabLang} onChange={setActiveTabLang} className="pill-tabs mb-6">
    <TabPane tab="English (EN)" key="en" />
    <TabPane tab="Tiếng Việt (VN)" key="vi" />
  </Tabs>

  {/* Add New Team Button */}
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-white text-base font-semibold">
      {activeTabLang === "vi" ? "Nhóm" : "Teams"}
    </h3>
    <Button
      onClick={() => setIsAddTeamModalVisible(true)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: "#262626",
        color: "#fff",
        border: "1px solid #2E2F2F",
        padding: "22px 30px",
        borderRadius: "9999px",
        fontWeight: "500",
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop:"20px"
      }}
    >
      <Plus size={16} />
      {activeTabLang === "vi" ? "Thêm Nhóm Mới" : "Add New Team"}
    </Button>
  </div>

  {/* Tabs for Each Team */}
  <Tabs
    defaultActiveKey={Object.keys(aboutTeam?.dynamicTeams || aboutTeam || {})[0]}
    className="mb-6 pill-tabs"
  >
    {Object.entries(aboutTeam?.dynamicTeams || aboutTeam || {}).map(([teamKey, teamData]) => {
      const teamMembers = Array.isArray(teamData?.members)
        ? teamData.members
        : Array.isArray(teamData)
        ? teamData
        : [];

      const teamLabel =
        teamData?.teamLabel?.[activeTabLang] ||
        teamData?.teamLabel?.en ||
        teamKey.replace(/_/g, " ");

      return (
        <TabPane
          tab={
            <div className="flex items-center gap-2">
              <span>{teamLabel}</span>
              <Trash2
                size={16}
                className="cursor-pointer text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTeam(teamKey);
                }}
              />
            </div>
          }
          key={teamKey}
          className="mt-4"
        >
          {teamMembers.map((member, idx) => (
            <div key={idx} className="mb-6 rounded-lg text-white">
              {/* 🧍 Name */}
              <label className="block font-medium mt-5 mb-3">
                {translations[activeTabLang].name}
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
                value={member.teamName?.[activeTabLang] || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx] = {
                    ...member,
                    teamName: {
                      ...member.teamName,
                      [activeTabLang]: e.target.value,
                    },
                  };

                  const newTeams = {
                    ...(aboutTeam?.dynamicTeams || aboutTeam),
                    [teamKey]: { ...teamData, members: updated },
                  };

                  setAboutTeam(
                    aboutTeam?.dynamicTeams
                      ? { dynamicTeams: newTeams }
                      : newTeams
                  );
                }}
              />

              {/* 💼 Designation */}
              <label className="block font-medium mt-5 mb-3">
                {translations[activeTabLang].designation}
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
                value={member.teamDesgn?.[activeTabLang] || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx] = {
                    ...member,
                    teamDesgn: {
                      ...member.teamDesgn,
                      [activeTabLang]: e.target.value,
                    },
                  };

                  const newTeams = {
                    ...(aboutTeam?.dynamicTeams || aboutTeam),
                    [teamKey]: { ...teamData, members: updated },
                  };

                  setAboutTeam(
                    aboutTeam?.dynamicTeams
                      ? { dynamicTeams: newTeams }
                      : newTeams
                  );
                }}
              />

              {/* 📧 Email */}
              <label className="block font-medium mt-5 mb-3">
                {translations[activeTabLang].email}
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
                value={member.teamEmail || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx] = { ...member, teamEmail: e.target.value };

                  const newTeams = {
                    ...(aboutTeam?.dynamicTeams || aboutTeam),
                    [teamKey]: { ...teamData, members: updated },
                  };

                  setAboutTeam(
                    aboutTeam?.dynamicTeams
                      ? { dynamicTeams: newTeams }
                      : newTeams
                  );
                }}
              />

              {/* 🗑 Remove Member */}
              <Button
                onClick={async () => {
                  try {
                    const updatedList = teamMembers.filter((_, i) => i !== idx);
                    const newTeams = {
                      ...(aboutTeam?.dynamicTeams || aboutTeam),
                      [teamKey]: { ...teamData, members: updatedList },
                    };

                    setAboutTeam(
                      aboutTeam?.dynamicTeams
                        ? { dynamicTeams: newTeams }
                        : newTeams
                    );

                    const formData = new FormData();
                    formData.append(
                      "aboutTeam",
                      JSON.stringify(
                        aboutTeam?.dynamicTeams
                          ? { dynamicTeams: newTeams }
                          : newTeams
                      )
                    );

                    await updateAboutPage(formData);

                    CommonToaster(
                      activeTabLang === "vi"
                        ? "Xóa thành viên thành công!"
                        : "Team member removed successfully!",
                      "success"
                    );
                  } catch (err) {
                    CommonToaster("Error", err.message || "Something went wrong!");
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#E50000",
                  border: "1px solid #E50000",
                  color: "#fff",
                  padding: "22px 30px",
                  borderRadius: "9999px",
                  fontWeight: "500",
                  marginTop: "12px",
                }}
              >
                <Trash2 size={16} />
                {translations[activeTabLang].removeMember}
              </Button>
            </div>
          ))}

          {/* ➕ Add Member */}
          <Button
            onClick={() => {
              const newMember = {
                teamName: { en: "", vi: "" },
                teamDesgn: { en: "", vi: "" },
                teamEmail: "",
              };
              const updatedList = [...teamMembers, newMember];
              const newTeams = {
                ...(aboutTeam?.dynamicTeams || aboutTeam),
                [teamKey]: { ...teamData, members: updatedList },
              };
              setAboutTeam(
                aboutTeam?.dynamicTeams
                  ? { dynamicTeams: newTeams }
                  : newTeams
              );
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#262626",
              color: "#fff",
              border: "1px solid #2E2F2F",
              padding: "22px 30px",
              borderRadius: "9999px",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            <Plus size={16} />
            {translations[activeTabLang].addMember}
          </Button>
        </TabPane>
      );
    })}
  </Tabs>

  {/* ➕ Add New Team Modal */}
  <Modal
    title={activeTabLang === "vi" ? "Thêm Nhóm Mới" : "Add New Team"}
    open={isAddTeamModalVisible}
    onCancel={() => setIsAddTeamModalVisible(false)}
    footer={[
      <Button
        key="cancel"
        onClick={() => setIsAddTeamModalVisible(false)}
        style={{
          border: "none",
          color: "#fff",
          borderRadius: "20px",
          padding: "18px 30px",
          fontSize: "18px",
          backgroundColor: "#262626",
        }}
      >
        {translations[activeTabLang].cancel}
      </Button>,
      <Button
        key="add"
        type="primary"
        onClick={handleAddTeam}
        style={{
          backgroundColor: "#0284C7",
          border: "none",
          color: "#fff",
          borderRadius: "20px",
          padding: "18px 30px",
          fontSize: "18px",
        }}
      >
        {translations[activeTabLang].add}
      </Button>,
    ]}
  >
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-2 text-white">
          English Team Name
        </label>
        <Input
          placeholder="Enter team name in English (e.g., Design Team)"
          value={newTeamName.en || ""}
          onChange={(e) =>
            setNewTeamName((prev) => ({ ...prev, en: e.target.value }))
          }
          style={{
            backgroundColor: "#262626",
            border: "1px solid #2E2F2F",
            borderRadius: "8px",
            color: "#fff",
            padding: "10px 14px",
          }}
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-white">
          Tên Nhóm (Tiếng Việt)
        </label>
        <Input
          placeholder="Nhập tên nhóm bằng Tiếng Việt (ví dụ: Đội Thiết Kế)"
          value={newTeamName.vi || ""}
          onChange={(e) =>
            setNewTeamName((prev) => ({ ...prev, vi: e.target.value }))
          }
          style={{
            backgroundColor: "#262626",
            border: "1px solid #2E2F2F",
            borderRadius: "8px",
            color: "#fff",
            padding: "10px 14px",
          }}
        />
      </div>
    </div>
  </Modal>

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
      {translations[activeTabLang].cancel}
    </Button>

    <Button
      onClick={() => handleSave("aboutTeam", aboutTeam)}
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
      {translations[activeTabLang].saveTeam}
    </Button>
  </div>
</Panel>



        {/* ALLIANCES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Liên minh" : "Alliances"}
            </span>
          }
          key="8"
        >
          {/* 🌐 Language Tabs (EN / VI) */}
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
                <label className="block font-bold mt-5 mb-3">
                  {lang === "vi" ? "Logo liên minh" : "Alliance Logos"}
                </label>
                <p className="text-sm text-slate-500 mb-2">
                  {translations[lang].recommendedSize} 180×180px
                </p>

                {/* --- Alliance Logos Grid --- */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {/* Saved from DB */}
                  {(aboutAlliances.aboutAlliancesImg || []).map((url, idx) => (
                    <div
                      key={`saved-${idx}`}
                      className="relative group w-full h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
                    >
                      <img
                        src={getFullUrl(url)}
                        alt={`Alliance ${idx + 1}`}
                        className="w-full h-full object-contain p-2"
                      />

                      {/* 👁 View */}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveAllianceModal({ type: "saved", index: idx })
                        }
                        className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title={lang === "vi" ? "Xem logo" : "View Full"}
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
                        htmlFor={`changeAllianceUpload-${idx}`}
                        className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                        title={lang === "vi" ? "Thay đổi logo" : "Change Logo"}
                      >
                        <input
                          id={`changeAllianceUpload-${idx}`}
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (!validateFileSize(file)) return;

                            const formData = new FormData();
                            formData.append("aboutAlliancesFiles", file);

                            const updated = [
                              ...aboutAlliances.aboutAlliancesImg,
                            ];
                            updated[idx] = "";

                            const res = await updateAboutPage(formData);
                            if (res.data?.uploadedFiles?.length) {
                              updated[idx] = res.data.uploadedFiles[0];
                              setAboutAlliances({
                                ...aboutAlliances,
                                aboutAlliancesImg: [...updated],
                              });
                              CommonToaster(
                                lang === "vi"
                                  ? "Đã thay đổi logo thành công!"
                                  : "Logo changed successfully!",
                                "success"
                              );
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <RotateCw size={15} />
                      </label>

                      {/* ❌ Remove */}
                      <button
                        type="button"
                        onClick={async () => {
                          const updatedList =
                            aboutAlliances.aboutAlliancesImg.filter(
                              (_, i) => i !== idx
                            );

                          const formData = new FormData();
                          formData.append(
                            "aboutAlliances",
                            JSON.stringify({ aboutAlliancesImg: updatedList })
                          );

                          const res = await updateAboutPage(formData);
                          if (res.data?.about?.aboutAlliances) {
                            setAboutAlliances((prev) => ({
                              ...prev,
                              aboutAlliancesImg: [...updatedList],
                            }));
                            localStorage.removeItem("aboutAlliances");
                            CommonToaster(
                              lang === "vi"
                                ? "Đã xóa liên minh thành công!"
                                : "Alliance removed successfully!",
                              "success"
                            );
                          }
                        }}
                        className="absolute top-1 right-1 bg-black/70 !text-white p-1 rounded-full cursor-pointer transition"
                        title={lang === "vi" ? "Xóa logo" : "Remove Logo"}
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

                  {/* Unsaved Local Files */}
                  {(aboutAlliances.aboutAlliancesFiles || []).map(
                    (file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative group w-full h-32 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center"
                      >
                        {file instanceof File ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Alliance new ${idx + 1}`}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <p className="text-xs text-red-500">Invalid file</p>
                        )}

                        {/* 👁 View */}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAllianceModal({ type: "new", index: idx })
                          }
                          className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title={lang === "vi" ? "Xem logo" : "View Full"}
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
                          onClick={() => {
                            const updatedFiles =
                              aboutAlliances.aboutAlliancesFiles.filter(
                                (_, i) => i !== idx
                              );
                            if (file instanceof File)
                              URL.revokeObjectURL(URL.createObjectURL(file));
                            setAboutAlliances((prev) => ({
                              ...prev,
                              aboutAlliancesFiles: [...updatedFiles],
                            }));
                          }}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          title={lang === "vi" ? "Xóa logo" : "Remove"}
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
                    )
                  )}

                  {/* Upload Box */}
                  <label
                    htmlFor="aboutAlliancesUpload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
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
                    <span className="mt-2 text-sm text-gray-400">
                      {lang === "vi" ? "Tải lên logo" : "Upload Logo"}
                    </span>
                  </label>

                  <input
                    id="aboutAlliancesUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const validFiles = Array.from(e.target.files).filter(
                        validateFileSize
                      );
                      if (validFiles.length !== e.target.files.length) {
                        CommonToaster(
                          lang === "vi"
                            ? "Một số tệp quá lớn (tối đa 2MB) đã bị bỏ qua."
                            : "Some files were too large (max 2MB) and skipped.",
                          "error"
                        );
                      }
                      setAboutAlliances({
                        ...aboutAlliances,
                        aboutAlliancesFiles: [
                          ...(aboutAlliances.aboutAlliancesFiles || []),
                          ...validFiles,
                        ],
                      });
                    }}
                  />
                </div>
                {/* 🖼 Full Preview Modal */}
                <Modal
                  open={!!activeAllianceModal}
                  footer={null}
                  onCancel={() => setActiveAllianceModal(null)}
                  centered
                  width={400}
                  bodyStyle={{ background: "#000", padding: "0" }}
                >
                  {activeAllianceModal && (
                    <img
                      src={
                        activeAllianceModal.type === "saved"
                          ? getFullUrl(
                              aboutAlliances.aboutAlliancesImg[
                                activeAllianceModal.index
                              ]
                            )
                          : URL.createObjectURL(
                              aboutAlliances.aboutAlliancesFiles[
                                activeAllianceModal.index
                              ]
                            )
                      }
                      alt="Alliance Preview"
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </Modal>
              </TabPane>
            ))}
          </Tabs>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
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

            <Button
              onClick={async () => {
                const formData = new FormData();
                formData.append(
                  "aboutAlliances",
                  JSON.stringify({
                    aboutAlliancesImg: aboutAlliances.aboutAlliancesImg,
                  })
                );
                (aboutAlliances.aboutAlliancesFiles || []).forEach((file) =>
                  formData.append("aboutAlliancesFiles", file)
                );
                const res = await updateAboutPage(formData);
                if (res.data?.about?.aboutAlliances) {
                  setAboutAlliances({
                    ...res.data.about.aboutAlliances,
                    aboutAlliancesFiles: [],
                  });
                  localStorage.removeItem("aboutAlliances");
                  CommonToaster(
                    activeTabLang === "vi"
                      ? "Đã lưu liên minh thành công!"
                      : "Alliances saved successfully!",
                    "success"
                  );
                }
              }}
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
              {activeTabLang === "vi"
                ? "Lưu Liên Minh"
                : translations[activeTabLang].saveAlliances || "Save Alliances"}
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

                {/* ✅ Meta Keywords */}
                <div className="mt-6">
                  <label className="block font-medium mb-3 text-white">
                    {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                  </label>

                  <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg bg-[#1C1C1C] border border-[#2E2F2F] min-h-[48px] focus-within:ring-1 focus-within:ring-[#0284C7] transition-all">
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
                          const updated = [
                            ...new Set([...existing, newKeyword]),
                          ];
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
              {translations[activeTabLang].cancel}
            </Button>

            <Button
              onClick={() => handleSave("aboutSeoMeta", seoMeta)}
              style={{
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

        {/* 🔥 Repeat same pattern for Overview, Founder, Mission, Core, History, Team, Alliances */}
      </Collapse>
    </div>
  );
};

export default AboutPage;
