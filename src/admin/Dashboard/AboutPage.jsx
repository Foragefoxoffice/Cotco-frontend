import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import {
  FiTarget,
  FiUsers,
  FiTool,
  FiBriefcase,
  FiZap,
  FiStar,
} from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getAboutPage, updateAboutPage } from "../../Api/api";

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
  const { theme } = useTheme();

  const [currentLang, setCurrentLang] = useState("en");

  const translations = {
    en: {
      pageTitle: "About Page Management",

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
      add: "+ Add",
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
      addHistory: "+ Add History Item",
      saveHistory: "Save History",
      historyImage: "History Image",
      removeHistory: "Remove",

      // Team
      addMember: "+ Add Member",
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
      banner: "Banner",
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

  const [aboutTeam, setAboutTeam] = usePersistedState("aboutTeam", {
    cottonTeam: [],
    machineTeam: [],
    fiberTeam: [],
    marketingTeam: [],
    directorTeam: [],
  });

  const [aboutAlliances, setAboutAlliances] = usePersistedState(
    "aboutAlliances",
    {
      aboutAlliancesImg: [],
      aboutAlliancesFiles: [],
    }
  );

  // ---------------------- FETCH (only once to init) ---------------------- //
  useEffect(() => {
    getAboutPage().then((res) => {
      if (res.data?.aboutHero)
        setAboutHero((prev) => ({
          ...res.data.aboutHero,
          aboutBannerFile: prev.aboutBannerFile,
        }));

      if (res.data?.aboutOverview)
        setAboutOverview((prev) => ({
          ...res.data.aboutOverview,
          aboutOverviewFile: prev.aboutOverviewFile,
        }));

      if (res.data?.aboutFounder)
        setAboutFounder((prev) => ({
          ...res.data.aboutFounder,
          founderImg1File: prev.founderImg1File,
          founderImg2File: prev.founderImg2File,
          founderImg3File: prev.founderImg3File,
        }));

      if (res.data?.aboutMissionVission)
        setAboutMissionVission(res.data.aboutMissionVission);

      if (res.data?.aboutCore)
        setAboutCore((prev) => ({
          ...res.data.aboutCore,
          aboutCoreBg1File: prev.aboutCoreBg1File,
          aboutCoreBg2File: prev.aboutCoreBg2File,
          aboutCoreBg3File: prev.aboutCoreBg3File,
        }));

      if (res.data?.aboutHistory) setAboutHistory(res.data.aboutHistory);
      if (res.data?.aboutTeam) setAboutTeam(res.data.aboutTeam);
      if (res.data?.aboutAlliances)
        setAboutAlliances((prev) => ({
          ...res.data.aboutAlliances,
          aboutAlliancesFiles: prev.aboutAlliancesFiles,
        }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      files.forEach((fileKey) => {
        if (formState[fileKey]) {
          formData.append(fileKey, formState[fileKey]);
        }
      });

      const res = await updateAboutPage(formData);

      if (res.data?.about?.[sectionName]) {
        // ✅ Clear localStorage cache after successful save
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (error) {
      CommonToaster("error", error.message || "Something went wrong!");
    }
  };

  // ---------------------- UI ---------------------- //
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
        About Page Management
      </h2>

      <Collapse accordion bordered={false}>
        {/* HERO EXAMPLE (others follow same pattern) */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiTarget /> About Hero
            </span>
          }
          key="1"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].title}</label>
                <Input
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

          <Divider>{translations[currentLang].banner}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedSize} 1260×420px
          </p>

          {aboutHero.aboutBannerFile instanceof File ? (
            <img
              src={URL.createObjectURL(aboutHero.aboutBannerFile)}
              alt="Hero Banner Preview"
              className="w-48 mb-4 rounded"
            />
          ) : (
            aboutHero.aboutBanner && (
              <img
                src={getFullUrl(aboutHero.aboutBanner)}
                alt="Hero Banner"
                className="w-48 mb-4 rounded"
              />
            )
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (!validateFileSize(file)) return;
              setAboutHero({ ...aboutHero, aboutBannerFile: file });
            }}
          />


          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("aboutHero", aboutHero, ["aboutBannerFile"])
              }
            >
              {translations[currentLang].saveHero}
            </Button>
          </div>
        </Panel>

        {/* OVERVIEW */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiUsers /> About Overview
            </span>
          }
          key="2"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].title}</label>
                <Input
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

                <label className="block font-medium mt-3">{translations[currentLang].description}</label>
                <Input
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

          <Divider>{translations[currentLang].overviewImage}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedSize} 530×310px
          </p>

          {aboutOverview.aboutOverviewFile instanceof File ? (
            <img
              src={URL.createObjectURL(aboutOverview.aboutOverviewFile)}
              alt="Overview Preview"
              className="w-48 mb-4 rounded"
            />
          ) : (
            aboutOverview.aboutOverviewImg && (
              <img
                src={getFullUrl(aboutOverview.aboutOverviewImg)}
                alt="Overview"
                className="w-48 mb-4 rounded"
              />
            )
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (!validateFileSize(file)) return;
              setAboutOverview({ ...aboutOverview, aboutOverviewFile: file });
            }}
          />


          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("aboutOverview", aboutOverview, ["aboutOverviewFile"])
              }
            >
              {translations[currentLang].saveOverview}
            </Button>
          </div>
        </Panel>

        {/* FOUNDER */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiStar /> {translations[currentLang].founder}
            </span>
          }
          key="3"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].founderTitle}</label>
                <Input
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

                <label className="block font-medium mt-3">{translations[currentLang].founderName}</label>
                <Input
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

                <Divider>{translations[currentLang].founderDescription}</Divider>

                {aboutFounder.aboutFounderDes?.map((desc, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      value={desc[lang]}
                      onChange={(e) => {
                        const updated = [...aboutFounder.aboutFounderDes];
                        updated[idx] = { ...updated[idx], [lang]: e.target.value };
                        setAboutFounder({ ...aboutFounder, aboutFounderDes: updated });
                      }}
                    />
                    <Button
                      danger
                      onClick={async () => {
                        try {
                          // 1️⃣ Remove locally
                          const updated = aboutFounder.aboutFounderDes.filter((_, i) => i !== idx);
                          const newFounder = { ...aboutFounder, aboutFounderDes: updated };
                          setAboutFounder(newFounder);

                          // 2️⃣ Send update immediately
                          const formData = new FormData();
                          formData.append("aboutFounder", JSON.stringify(newFounder));

                          const res = await updateAboutPage(formData);

                          if (res.data?.about?.aboutFounder) {
                            setAboutFounder(res.data.about.aboutFounder);
                            localStorage.removeItem("aboutFounder");
                            CommonToaster("Description removed successfully!", "success");
                          } else {
                            CommonToaster("Failed to remove description", "error");
                          }
                        } catch (err) {
                          CommonToaster("Error", err.message || "Something went wrong!");
                        }
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() =>
                    setAboutFounder({
                      ...aboutFounder,
                      aboutFounderDes: [...aboutFounder.aboutFounderDes, { en: "", vi: "" }],
                    })
                  }
                >
                  {translations[currentLang].add}
                </Button>
              </TabPane>
            ))}
          </Tabs>

          <Divider>{translations[currentLang].founderImages}</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedSize} 350×550px
          </p>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              {aboutFounder[`founderImg${i}File`] instanceof File ? (
                <img
                  src={URL.createObjectURL(aboutFounder[`founderImg${i}File`])}
                  alt={`Founder ${i} Preview`}
                  className="w-32 mb-2 rounded"
                />
              ) : (
                aboutFounder[`founderImg${i}`] && (
                  <img
                    src={getFullUrl(aboutFounder[`founderImg${i}`])}
                    alt={`Founder ${i}`}
                    className="w-32 mb-2 rounded"
                  />
                )
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setAboutFounder, `founderImg${i}`)}
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>
              {translations[currentLang].cancel}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("aboutFounder", aboutFounder, [
                  "founderImg1File",
                  "founderImg2File",
                  "founderImg3File",
                ])
              }
            >
              {translations[currentLang].saveFounder}
            </Button>
          </div>
        </Panel>


        {/* MISSION & VISION */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiZap /> Mission & Vision
            </span>
          }
          key="4"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].mainTitle}</label>
                <Input
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
                  <div
                    key={i}
                    className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <h4 className="font-semibold mb-2">{translations[currentLang].block} {i}</h4>

                    <label className="block font-medium">{translations[currentLang].subhead} {i}</label>
                    <Input
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

                    <label className="block font-medium mt-2">
                      {translations[currentLang].description} {i}
                    </label>
                    <Input
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
                      {translations[currentLang].boxCount} {i}
                    </label>
                    <Input
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

                    <label className="block font-medium mt-2">
                      {translations[currentLang].boxDescription} {i}
                    </label>
                    <Input
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
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("aboutMissionVission", aboutMissionVission)
              }
            >
              {translations[currentLang].saveMissionVision}
            </Button>
          </div>
        </Panel>

        {/* CORE VALUES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiTool /> Core Values
            </span>
          }
          key="5"
        >
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-6">
                    <label className="block font-medium">{translations[currentLang].title} {i}</label>
                    <Input
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

                    <label className="block font-medium mt-2">
                      {translations[currentLang].description} {i}
                    </label>
                    <Input
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
            {translations[currentLang].recommendedSize} 620×510px
          </p>
          <Divider>{translations[currentLang].coreImages}</Divider>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6">
              {aboutCore[`aboutCoreBg${i}File`] instanceof File ? (
                <img
                  src={URL.createObjectURL(aboutCore[`aboutCoreBg${i}File`])}
                  alt={`Core ${i} Preview`}
                  className="w-32 mb-2 rounded"
                />
              ) : (
                aboutCore[`aboutCoreBg${i}`] && (
                  <img
                    src={getFullUrl(aboutCore[`aboutCoreBg${i}`])}
                    alt={`Core ${i}`}
                    className="w-32 mb-2 rounded"
                  />
                )
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setAboutCore, `aboutCoreBg${i}`)}
              />
            </div>
          ))}


          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("aboutCore", aboutCore, [
                  "aboutCoreBg1File",
                  "aboutCoreBg2File",
                  "aboutCoreBg3File",
                ])
              }
            >
              {translations[currentLang].saveCore}
            </Button>
          </div>
        </Panel>

        {/* HISTORY */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiBriefcase /> Company History
            </span>
          }
          key="6"
        >
          {aboutHistory.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-6 shadow-sm bg-gray-50 dark:bg-gray-700"
            >
              <label className="block font-medium">{translations[currentLang].year}</label>
              <Input
                value={item.year}
                onChange={(e) => {
                  const newHistory = [...aboutHistory];
                  newHistory[index].year = e.target.value;
                  setAboutHistory(newHistory);
                }}
              />

              <Tabs activeKey={currentLang} onChange={setCurrentLang} className="mt-3">
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <label className="block font-medium">
                      {translations[currentLang].content} ({lang})
                    </label>
                    <Input.TextArea
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

              <Divider>{translations[currentLang].historyImage}</Divider>
              <p className="text-sm text-slate-500 mb-2">
                {translations[currentLang].recommendedSize} 720×920px
              </p>
              {item.imageFile instanceof File ? (
                <img
                  src={URL.createObjectURL(item.imageFile)}
                  alt="History Preview"
                  className="w-32 mb-2 rounded"
                />
              ) : (
                item.image && (
                  <img
                    src={getFullUrl(item.image)}
                    alt="History"
                    className="w-32 mb-2 rounded"
                  />
                )
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!validateFileSize(file)) return; // ✅ enforce max 2MB

                  const newHistory = [...aboutHistory];
                  newHistory[index].imageFile = file;
                  newHistory[index].image = "";
                  setAboutHistory(newHistory);
                }}
              />


              <div className="flex justify-end mt-3">
                <Button
                  danger
                  onClick={async () => {
                    try {
                      // 1️⃣ Remove from local state
                      const newHistory = aboutHistory.filter((_, i) => i !== index);
                      setAboutHistory(newHistory);

                      // 2️⃣ Prepare FormData with updated history
                      const formData = new FormData();
                      formData.append("aboutHistory", JSON.stringify(newHistory));

                      // ✅ Send files if any remain
                      newHistory.forEach((item, i) => {
                        if (item.imageFile instanceof File) {
                          formData.append(`historyImage${i}`, item.imageFile);
                        }
                      });

                      // 3️⃣ Update backend immediately
                      const res = await updateAboutPage(formData);

                      // 4️⃣ Sync state with DB response
                      if (res.data?.about?.aboutHistory) {
                        setAboutHistory(res.data.about.aboutHistory);
                        localStorage.removeItem("aboutHistory");
                        CommonToaster("History item removed successfully!", "success");
                      } else {
                        CommonToaster("Failed to remove history item", "error");
                      }
                    } catch (err) {
                      CommonToaster("Error", err.message || "Something went wrong!");
                    }
                  }}
                >
                  {translations[currentLang].removeHistory}
                </Button>

              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
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
            >
              {translations[currentLang].addHistory}
            </Button>

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
                  CommonToaster("History saved successfully!", "success");
                } else {
                  CommonToaster("Failed to save history", "error");
                }
              }}
            >
              {translations[currentLang].saveHistory}
            </Button>
          </div>
        </Panel>

        {/* TEAM */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiUsers /> About Team
            </span>
          }
          key="7"
        >
          <Tabs defaultActiveKey="cottonTeam">
            {Object.keys(aboutTeam).map((teamKey) => (
              <TabPane tab={teamKey.replace("Team", " Team")} key={teamKey}>
                {aboutTeam[teamKey].map((member, idx) => (
                  <div
                    key={idx}
                    className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <Tabs activeKey={currentLang} onChange={setCurrentLang}>
                      {["en", "vi"].map((lang) => (
                        <TabPane tab={lang.toUpperCase()} key={lang}>
                          <label className="block font-medium">{translations[currentLang].name}</label>
                          <Input
                            value={member.teamName?.[lang] || ""}
                            onChange={(e) => {
                              const updated = [...aboutTeam[teamKey]];
                              updated[idx] = {
                                ...member,
                                teamName: {
                                  ...member.teamName,
                                  [lang]: e.target.value,
                                },
                              };
                              setAboutTeam({
                                ...aboutTeam,
                                [teamKey]: updated,
                              });
                            }}
                          />

                          <label className="block font-medium mt-2">
                            {translations[currentLang].designation}
                          </label>
                          <Input
                            value={member.teamDesgn?.[lang] || ""}
                            onChange={(e) => {
                              const updated = [...aboutTeam[teamKey]];
                              updated[idx] = {
                                ...member,
                                teamDesgn: {
                                  ...member.teamDesgn,
                                  [lang]: e.target.value,
                                },
                              };
                              setAboutTeam({
                                ...aboutTeam,
                                [teamKey]: updated,
                              });
                            }}
                          />
                        </TabPane>
                      ))}
                    </Tabs>

                    <label className="block font-medium mt-2">{translations[currentLang].email}</label>
                    <Input
                      value={member.teamEmail || ""}
                      onChange={(e) => {
                        const updated = [...aboutTeam[teamKey]];
                        updated[idx] = { ...member, teamEmail: e.target.value };
                        setAboutTeam({ ...aboutTeam, [teamKey]: updated });
                      }}
                    />

                    <Button
                      danger
                      className="mt-3"
                      onClick={async () => {
                        try {
                          // 1️⃣ Update local state
                          const updatedTeam = {
                            ...aboutTeam,
                            [teamKey]: aboutTeam[teamKey].filter(
                              (_, i) => i !== idx
                            ),
                          };
                          setAboutTeam(updatedTeam);

                          // 2️⃣ Prepare form data for backend
                          const formData = new FormData();
                          formData.append(
                            "aboutTeam",
                            JSON.stringify(updatedTeam)
                          );

                          // 3️⃣ Call API
                          const res = await updateAboutPage(formData);

                          // 4️⃣ Sync back if success
                          if (res.data?.about?.aboutTeam) {
                            setAboutTeam(res.data.about.aboutTeam);
                            localStorage.removeItem("aboutTeam");
                            CommonToaster(
                              "Team member removed successfully!",
                              "success"
                            );
                          } else {
                            CommonToaster(
                              "Failed to remove team member",
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
                      {translations[currentLang].removeMember}
                    </Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  className="w-full"
                  onClick={() => {
                    setAboutTeam({
                      ...aboutTeam,
                      [teamKey]: [
                        ...aboutTeam[teamKey],
                        {
                          teamName: { en: "", vi: "" },
                          teamDesgn: { en: "", vi: "" },
                          teamEmail: "",
                        },
                      ],
                    });
                  }}
                >
                  {translations[currentLang].addMember}
                </Button>
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button
              type="primary"
              onClick={() => handleSave("aboutTeam", aboutTeam)}
            >
              {translations[currentLang].saveTeam}
            </Button>
          </div>
        </Panel>

        {/* ALLIANCES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiTool /> Alliances
            </span>
          }
          key="8"
        >
          <Divider>Alliance Logos</Divider>
          <p className="text-sm text-slate-500 mb-2">
            {translations[currentLang].recommendedSize} 180×180px
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Saved from DB */}
            {(aboutAlliances.aboutAlliancesImg || []).map((url, idx) => (
              <div key={`saved-${idx}`} className="relative rounded-lg p-2">
                <img
                  src={getFullUrl(url)}
                  alt={`Alliance ${idx + 1}`}
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={async () => {
                    const updated = aboutAlliances.aboutAlliancesImg.filter(
                      (_, i) => i !== idx
                    );
                    const formData = new FormData();
                    formData.append(
                      "aboutAlliances",
                      JSON.stringify({ aboutAlliancesImg: updated })
                    );
                    const res = await updateAboutPage(formData);
                    if (res.data?.about?.aboutAlliances) {
                      setAboutAlliances({
                        ...res.data.about.aboutAlliances,
                        aboutAlliancesFiles: aboutAlliances.aboutAlliancesFiles,
                      });
                      localStorage.removeItem("aboutAlliances");
                      CommonToaster("Alliance removed successfully!", "success");
                    }
                  }}
                >
                  X
                </Button>
              </div>
            ))}

            {/* Unsaved local files */}
            {(aboutAlliances.aboutAlliancesFiles || []).map((file, idx) => (
              <div key={`new-${idx}`} className="relative rounded-lg p-2">
                {file instanceof File ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Alliance new ${idx + 1}`}
                    className="w-full h-24 object-contain"
                  />
                ) : (
                  <p className="text-xs text-red-500">Invalid file</p>
                )}
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={() =>
                    setAboutAlliances({
                      ...aboutAlliances,
                      aboutAlliancesFiles: aboutAlliances.aboutAlliancesFiles.filter(
                        (_, i) => i !== idx
                      ),
                    })
                  }
                >
                  X
                </Button>
              </div>
            ))}

          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const validFiles = Array.from(e.target.files).filter(validateFileSize);
              if (validFiles.length !== e.target.files.length) {
                CommonToaster("Some files were too large (max 2MB) and skipped.", "error");
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


          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
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
                  CommonToaster("Alliances saved successfully!", "success");
                }
              }}
            >
              Save Alliances
            </Button>
          </div>

        </Panel>

        {/* 🔥 Repeat same pattern for Overview, Founder, Mission, Core, History, Team, Alliances */}
      </Collapse>
    </div>
  );
};

export default AboutPage;
