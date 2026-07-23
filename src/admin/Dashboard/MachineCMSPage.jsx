import React, { useEffect, useState } from "react";
import { Input, Button, Collapse, Tabs, Divider, Modal } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getMachineCMSPage, updateMachineCMSPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import { X, RotateCw, Trash2 } from "lucide-react";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const API_BASE = import.meta.env.VITE_API_URL;

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};


const MachineCMSPage = () => {
  const [machine, setMachine] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [activeTabLang, setActiveTabLang] = useState("en");
  const [showHeroVideoModal, setShowHeroVideoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBenefitImageModal, setShowBenefitImageModal] = useState(false);
  const [addTeamModal, setAddTeamModal] = useState(false);
  const [tempBenefitFile, setTempBenefitFile] = useState(null);
  const [tempTeamTitle, setTempTeamTitle] = useState({ en: "", vi: "" });
  const [seoMeta, setSeoMeta] = useState({
    metaTitle: { en: "", vi: "" },
    metaDescription: { en: "", vi: "" },
    metaKeywords: { en: "", vi: "" },
  });

  // 🌐 Detect language
  useEffect(() => {
    const detectLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    detectLang();
    const observer = new MutationObserver(detectLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    getMachineCMSPage()
      .then((res) => {
        if (res.data?.machinePage) {
          setMachine(res.data.machinePage);
          if (res.data.machinePage.seoMeta) {
            setSeoMeta(res.data.machinePage.seoMeta);
          }
        } else {
          setMachine({
            heroSection: { heroVideo: "", heroTitle: { en: "", vi: "" } },
            introSection: { introDescription: { en: "", vi: "" } },
            benefitsSection: {
              benefitTitle: { en: "", vi: "" },
              benefitBullets: { en: [""], vi: [""] },
            },
          });
        }
      })
      .catch((err) => console.error("❌ Failed to fetch Machine Page:", err));
  }, []);

  const lang = isVietnamese ? "vi" : "en";

  // 🛠 Update nested object values
  const handleChange = (path, value) => {
    const updated = { ...machine };
    const keys = path.split(".");
    let temp = updated;
    keys.slice(0, -1).forEach((k) => {
      if (!temp[k]) temp[k] = {};
      temp = temp[k];
    });
    temp[keys[keys.length - 1]] = value;
    setMachine(updated);
  };

  // 💾 Save changes
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Include the full machine object & SEO data
      formData.append("machinePage", JSON.stringify({ ...machine, seoMeta }));

      // ✅ Attach benefit image if a new file was selected
      if (tempBenefitFile) {
        formData.append("benefitImage", tempBenefitFile);
      }

      // ✅ You can also attach other pending files if needed later (e.g., hero video)
      // if (tempHeroVideo) formData.append("heroVideo", tempHeroVideo);

      const res = await updateMachineCMSPage(formData);

      if (res.data?.success) {
        const updatedPage = res.data.machinePage;
        const API_BASE = import.meta.env.VITE_API_URL;

        // Normalize backend image URL (ensures correct display)
        if (
          updatedPage.benefitsSection?.benefitImage &&
          !updatedPage.benefitsSection.benefitImage.startsWith("http")
        ) {
          updatedPage.benefitsSection.benefitImage = `${API_BASE}/${updatedPage.benefitsSection.benefitImage.replace(
            /^\/+/,
            ""
          )}`;
        }

        setMachine(updatedPage);
        setTempBenefitFile(null); // ✅ clear after successful save

        CommonToaster("Machine page updated successfully", "success");
      } else {
        CommonToaster("Failed to update machine page", "error");
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      CommonToaster("Failed to update machine page", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!machine) return null;

  const t = {
    title: isVietnamese ? "Quản lý Trang Máy Móc" : "Manage Machines Page",
    hero: isVietnamese ? "Phần Giới Thiệu Video" : "Hero Section",
    intro: isVietnamese ? "Phần Giới Thiệu" : "Introduction Section",
    benefits: isVietnamese ? "Lợi Ích Khách Hàng" : "Customer Benefits",
    addBullet: isVietnamese ? "Thêm Gạch Đầu Dòng" : "Add Bullet Point",
    save: isVietnamese ? "Lưu" : "Save",
    cancel: isVietnamese ? "Hủy" : "Cancel",
  };

  return (
    <div className="mx-auto p-8 mt-8 rounded-xl bg-[#171717] text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">{t.title}</h2>

      <Collapse accordion bordered={false}>
        {/* 🔹 HERO SECTION */}
        <Panel
          header={
            <span className="text-lg font-semibold text-white ">{t.hero}</span>
          }
          key="1"
        >
          {/* 🌐 Language Tabs */}
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
                {/* 🏷 Hero Title */}
                <label className="block font-bold mt-5 mb-1 text-white">
                  {lang === "en" ? "Hero Title" : "Tiêu đề"}
                </label>
                <Input
                  placeholder={
                    lang === "en" ? "Enter hero title..." : "Nhập tiêu đề..."
                  }
                  className="!placeholder-gray-500"
                  value={machine.heroSection?.heroTitle?.[lang] || ""}
                  onChange={(e) =>
                    handleChange(
                      `heroSection.heroTitle.${lang}`,
                      e.target.value
                    )
                  }
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                  }}
                />
              </TabPane>
            ))}
          </Tabs>

          <Divider />

          {/* 🎬 Hero Video Upload */}
          <div style={{ marginBottom: "30px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {activeTabLang === "vi" ? "Video Giới Thiệu" : "Hero Video"}
            </label>

            {!machine.heroSection.heroVideo ? (
              <label
                htmlFor="heroVideoUpload"
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
                    ? "Tải lên video giới thiệu"
                    : "Upload Hero Video"}
                </span>
                <input
                  id="heroVideoUpload"
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // 🟢 Local preview before upload
                    const previewUrl = URL.createObjectURL(file);
                    handleChange("heroSection.heroVideo", previewUrl);

                    // 🟢 Upload to backend
                    const formData = new FormData();
                    formData.append("heroVideo", file);
                    formData.append("machinePage", JSON.stringify(machine));

                    try {
                      const res = await updateMachineCMSPage(formData);

                      if (res.data?.machinePage) {
                        // ✅ Update state with saved backend path
                        const updatedPage = res.data.machinePage;
                        const API_BASE = import.meta.env.VITE_API_URL;
                        const backendVideo =
                          updatedPage.heroSection?.heroVideo || "";

                        // If backend returns a relative path, fix it
                        const realUrl = backendVideo.startsWith("http")
                          ? backendVideo
                          : `${API_BASE}${backendVideo}`;

                        setMachine({
                          ...updatedPage,
                          heroSection: {
                            ...updatedPage.heroSection,
                            heroVideo: realUrl,
                          },
                        });

                        CommonToaster(
                          "Hero video uploaded & saved successfully!",
                          "success"
                        );
                      } else {
                        CommonToaster(
                          "Failed to save hero video path",
                          "error"
                        );
                      }
                    } catch (err) {
                      console.error("Video upload error:", err);
                      CommonToaster("Failed to upload hero video", "error");
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div className="relative group w-44 h-44 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                <video
                  src={getFullUrl(machine.heroSection.heroVideo)}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />

                {/* 👁 Preview */}
                <button
                  type="button"
                  onClick={() => setShowHeroVideoModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  👁
                </button>

                {/* 🔁 Change */}
                <label
                  htmlFor="heroVideoChange"
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <input
                    id="heroVideoChange"
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      // 🟢 Local preview before upload
                      const previewUrl = URL.createObjectURL(file);
                      handleChange("heroSection.heroVideo", previewUrl);

                      // 🟢 Upload to backend
                      const formData = new FormData();
                      formData.append("heroVideo", file);
                      formData.append("machinePage", JSON.stringify(machine));

                      try {
                        const res = await updateMachineCMSPage(formData);

                        if (res.data?.machinePage) {
                          // ✅ Update state with saved backend path
                          const updatedPage = res.data.machinePage;
                          const API_BASE = import.meta.env.VITE_API_URL;
                          const backendVideo =
                            updatedPage.heroSection?.heroVideo || "";

                          // If backend returns a relative path, fix it
                          const realUrl = backendVideo.startsWith("http")
                            ? backendVideo
                            : `${API_BASE}${backendVideo}`;

                          setMachine({
                            ...updatedPage,
                            heroSection: {
                              ...updatedPage.heroSection,
                              heroVideo: realUrl,
                            },
                          });

                          CommonToaster(
                            "Hero video uploaded & saved successfully!",
                            "success"
                          );
                        } else {
                          CommonToaster(
                            "Failed to save hero video path",
                            "error"
                          );
                        }
                      } catch (err) {
                        console.error("Video upload error:", err);
                        CommonToaster("Failed to upload hero video", "error");
                      }
                    }}
                    style={{ display: "none" }}
                  />
                  <ReloadOutlined w={4} h={4} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() => handleChange("heroSection.heroVideo", "")}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition"
                >
                  ✖
                </button>
              </div>
            )}
          </div>

          {/* 🪟 Video Preview Modal */}
          {showHeroVideoModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative w-[90vw] max-w-4xl">
                <button
                  type="button"
                  onClick={() => setShowHeroVideoModal(false)}
                  className="absolute z-50 -top-2 -right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer"
                >
                  <X size={20} />
                </button>
                <video
                  src={machine.heroSection.heroVideo}
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}
        </Panel>

        {/* 🔹 INTRO SECTION */}
        <Panel
          header={
            <span className="text-lg font-semibold text-white">{t.intro}</span>
          }
          key="2"
        >
          {/* 🌐 Language Tabs */}
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
                <label className="block font-bold mt-3 mb-1 text-white">
                  {lang === "en"
                    ? "Introduction Description"
                    : "Mô tả phần giới thiệu"}
                </label>

                <Input.TextArea
                  rows={6}
                  placeholder={
                    lang === "en"
                      ? "Enter introduction description..."
                      : "Nhập mô tả phần giới thiệu..."
                  }
                  className="!placeholder-gray-500"
                  value={machine.introSection?.introDescription?.[lang] || ""}
                  onChange={(e) =>
                    handleChange(
                      `introSection.introDescription.${lang}`,
                      e.target.value
                    )
                  }
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px 14px",
                    fontSize: "14px",
                  }}
                />
              </TabPane>
            ))}
          </Tabs>
        </Panel>

        {/* 🔹 BENEFITS SECTION */}
        <Panel
          header={
            <span className="text-lg font-semibold text-white">
              {t.benefits}
            </span>
          }
          key="3"
        >
          {/* 🌐 Language Tabs */}
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
                {/* 🏷 Section Title */}
                <label className="block font-bold mt-3 mb-1 text-white">
                  {lang === "en" ? "Section Title" : "Tiêu đề phần"}
                </label>
                <Input
                  placeholder={
                    lang === "en"
                      ? "Enter section title..."
                      : "Nhập tiêu đề phần..."
                  }
                  value={machine.benefitsSection?.benefitTitle?.[lang] || ""}
                  onChange={(e) =>
                    handleChange(
                      `benefitsSection.benefitTitle.${lang}`,
                      e.target.value
                    )
                  }
                  className="!placeholder-gray-500"
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#fff",
                    marginBottom: "14px",
                    padding: "10px 14px",
                  }}
                />

                {/* 📝 Bullet Points */}
                <label className="block font-bold mb-2 text-white">
                  {lang === "en"
                    ? "Benefit Bullet Points"
                    : "Các gạch đầu dòng lợi ích"}
                </label>

                {(machine.benefitsSection?.benefitBullets?.[lang] || []).map(
                  (item, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <Input
                        value={item}
                        placeholder={
                          lang === "en"
                            ? "Enter bullet point..."
                            : "Nhập gạch đầu dòng..."
                        }
                        onChange={(e) => {
                          const updated = [
                            ...machine.benefitsSection.benefitBullets[lang],
                          ];
                          updated[i] = e.target.value;
                          handleChange(
                            `benefitsSection.benefitBullets.${lang}`,
                            updated
                          );
                        }}
                        className="!placeholder-gray-500"
                        style={{
                          backgroundColor: "#262626",
                          border: "1px solid #2E2F2F",
                          padding: "14px 18px",
                          borderRadius: "8px",
                          color: "#fff",
                          flex: 1,
                        }}
                      />
                      {/* ❌ Remove Button */}
                      <Button
                        danger
                        onClick={() => {
                          const updated = [
                            ...machine.benefitsSection.benefitBullets[lang],
                          ];
                          updated.splice(i, 1);
                          handleChange(
                            `benefitsSection.benefitBullets.${lang}`,
                            updated
                          );
                        }}
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#B91C1C",
                          border: "none",
                          color: "#fff",
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )
                )}

                {/* ➕ Add Bullet Button */}
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const updated = [
                      ...(machine.benefitsSection?.benefitBullets?.[lang] ||
                        []),
                      "",
                    ];
                    handleChange(
                      `benefitsSection.benefitBullets.${lang}`,
                      updated
                    );
                  }}
                  style={{
                    backgroundColor: "#0284C7",
                    color: "#fff",
                    border: "none",
                    marginTop: "10px",
                    padding: "22px",
                    borderRadius: "999px",
                  }}
                >
                  {lang === "en" ? "Add Bullet Point" : "Thêm gạch đầu dòng"}
                </Button>
              </TabPane>
            ))}
          </Tabs>

          <Divider />

          {/* 🖼 Benefit Image Upload */}
          <div style={{ marginBottom: "30px" }}>
            <label className="block text-white text-lg font-semibold mb-2">
              {activeTabLang === "vi" ? "Hình ảnh lợi ích" : "Benefit Image"}
            </label>

            {!machine.benefitsSection.benefitImage ? (
              <label
                htmlFor="benefitImageUpload"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-2 text-sm text-gray-400 text-center px-2">
                  {activeTabLang === "vi"
                    ? "Tải lên hình ảnh lợi ích"
                    : "Upload Benefit Image"}
                </span>
                <input
                  id="benefitImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const previewUrl = URL.createObjectURL(file);
                    handleChange("benefitsSection.benefitImage", previewUrl);
                    setTempBenefitFile(file); // 🔹 keep file for later save
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div className="relative group w-44 h-44 rounded-lg overflow-hidden bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center">
                <img
                  src={getFullUrl(machine.benefitsSection.benefitImage)}
                  alt="Benefit Preview"
                  className="w-full h-full object-cover"
                />

                {/* 👁 Preview Button */}
                <button
                  type="button"
                  onClick={() => setShowBenefitImageModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  👁
                </button>

                {/* 🔁 Change */}
                <label
                  htmlFor="benefitImageChange"
                  className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                >
                  <input
                    id="benefitImageChange"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const previewUrl = URL.createObjectURL(file);
                      handleChange("benefitsSection.benefitImage", previewUrl);
                      setTempBenefitFile(file); // 🔹 store file to upload later
                    }}
                    style={{ display: "none" }}
                  />
                  <ReloadOutlined size={14} />
                </label>

                {/* ❌ Remove */}
                <button
                  type="button"
                  onClick={() => {
                    handleChange("benefitsSection.benefitImage", "");
                    setTempBenefitFile(null);
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition"
                >
                  ✖
                </button>
              </div>
            )}

            {/* 🪟 Popup Preview Modal */}
            {showBenefitImageModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="relative w-[90vw] max-w-4xl">
                  <button
                    type="button"
                    onClick={() => setShowBenefitImageModal(false)}
                    className="absolute z-50 -top-2 -right-2 bg-red-600 !text-white p-2 rounded-full cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                  <img
                    src={machine.benefitsSection.benefitImage}
                    alt="Benefit Full Preview"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

        </Panel>

        {/* 🔹 MACHINE TEAM SECTION */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center text-white gap-2">
              {isVietnamese ? "Về Đội Ngũ" : "About Team"}
            </span>
          }
          key="4"
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
                    value={
                      machine.machineTeamSection?.aboutTeamIntro?.tag?.[lang] ||
                      ""
                    }
                    onChange={(e) =>
                      handleChange(
                        `machineTeamSection.aboutTeamIntro.tag.${lang}`,
                        e.target.value
                      )
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
                    value={
                      machine.machineTeamSection?.aboutTeamIntro?.heading?.[
                      lang
                      ] || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        `machineTeamSection.aboutTeamIntro.heading.${lang}`,
                        e.target.value
                      )
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
                    value={
                      machine.machineTeamSection?.aboutTeamIntro?.description?.[
                      lang
                      ] || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        `machineTeamSection.aboutTeamIntro.description.${lang}`,
                        e.target.value
                      )
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
                  defaultActiveKey={
                    Object.keys(machine.machineTeamSection?.aboutTeam || {})[0]
                  }
                >
                  {Object.entries(
                    machine.machineTeamSection?.aboutTeam || {}
                  ).map(([teamKey, teamData]) => (
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
                              const updated = {
                                ...machine.machineTeamSection.aboutTeam,
                              };
                              delete updated[teamKey];
                              handleChange(
                                `machineTeamSection.aboutTeam`,
                                updated
                              );
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
                          {/* Member Name */}
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
                              const teams = {
                                ...machine.machineTeamSection.aboutTeam,
                              };
                              teams[teamKey].members = updated;
                              handleChange(
                                `machineTeamSection.aboutTeam`,
                                teams
                              );
                            }}
                            style={{
                              backgroundColor: "#262626",
                              border: "1px solid #2E2F2F",
                              borderRadius: "8px",
                              color: "#fff",
                              padding: "10px 14px",
                            }}
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
                              const teams = {
                                ...machine.machineTeamSection.aboutTeam,
                              };
                              teams[teamKey].members = updated;
                              handleChange(
                                `machineTeamSection.aboutTeam`,
                                teams
                              );
                            }}
                            style={{
                              backgroundColor: "#262626",
                              border: "1px solid #2E2F2F",
                              borderRadius: "8px",
                              color: "#fff",
                              padding: "10px 14px",
                            }}
                          />

                          {/* Email */}
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
                              const teams = {
                                ...machine.machineTeamSection.aboutTeam,
                              };
                              teams[teamKey].members = updated;
                              handleChange(
                                `machineTeamSection.aboutTeam`,
                                teams
                              );
                            }}
                            style={{
                              backgroundColor: "#262626",
                              border: "1px solid #2E2F2F",
                              borderRadius: "8px",
                              color: "#fff",
                              padding: "10px 14px",
                            }}
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
                                teamPhone: e.target.value.replace(
                                  /[^0-9+]/g,
                                  ""
                                ),
                              };
                              const teams = {
                                ...machine.machineTeamSection.aboutTeam,
                              };
                              teams[teamKey].members = updated;
                              handleChange(
                                `machineTeamSection.aboutTeam`,
                                teams
                              );
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
                          />

                          {/* 🗑 Remove Member */}
                          <Button
                            danger
                            size="small"
                            onClick={() => {
                              const updated = teamData.members.filter(
                                (_, i) => i !== idx
                              );
                              const teams = {
                                ...machine.machineTeamSection.aboutTeam,
                              };
                              teams[teamKey].members = updated;
                              handleChange(
                                `machineTeamSection.aboutTeam`,
                                teams
                              );
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
                          const updated = [
                            ...(teamData.members || []),
                            newMember,
                          ];
                          const teams = {
                            ...machine.machineTeamSection.aboutTeam,
                          };
                          teams[teamKey].members = updated;
                          handleChange(`machineTeamSection.aboutTeam`, teams);
                        }}
                        style={{
                          backgroundColor: "#0284C7",
                          color: "#fff",
                          border: "none",
                          borderRadius: "9999px",
                          padding: "22px 30px",
                          marginTop: "20px",
                        }}
                      >
                        <PlusOutlined />{" "}
                        {lang === "en" ? "Add Member" : "Thêm Thành Viên"}
                      </Button>
                    </TabPane>
                  ))}
                </Tabs>
              </TabPane>
            ))}
          </Tabs>
        </Panel>

        {/* 🔹 SEO META SECTION */}
        <Panel
          header={
            <span className="flex items-center gap-2 text-white text-lg">
              {isVietnamese ? "Phần SEO Meta" : "SEO Meta Section"}
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
                <div className="mt-6">
                  <label className="block font-medium mb-3 text-white">
                    {lang === "vi" ? "Từ khóa Meta" : "Meta Keywords"}
                  </label>

                  <div className="flex flex-wrap gap-2 mb-2">
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
                  </div>

                  {/* Input to add new keyword */}
                  <input
                    type="text"
                    placeholder={
                      lang === "vi"
                        ? "Nhập từ khóa và nhấn Enter"
                        : "Type keyword and press Enter"
                    }
                    className="w-full bg-[#262626] border border-[#2E2F2F] rounded-lg !text-white px-3 py-2 text-sm focus:outline-none focus:border-[#0284C7] transition-all placeholder-gray-400"
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
              </TabPane>
            ))}
          </Tabs>

          {/* Save / Cancel Buttons */}
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
              {isVietnamese ? "Hủy" : "Cancel"}
            </Button>

            <Button
              onClick={handleSave}
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

      {/* 🔹 ACTION BUTTONS */}
      <div className="flex justify-end gap-4 mt-10">
        <Button
          onClick={() => window.location.reload()}
          style={{
            borderRadius: "9999px",
            padding: "22px 30px",
            backgroundColor: "#2d2d2d",
            color: "#fff",
            fontWeight: "500",
            border: "none",
          }}
        >
          {t.cancel}
        </Button>

        <Button
          type="primary"
          loading={loading}
          onClick={handleSave}
          style={{
            borderRadius: "9999px",
            padding: "22px 30px",
            backgroundColor: "#0284C7",
            color: "#fff",
            fontWeight: "600",
            border: "none",
          }}
        >
          {t.save}
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
          value={tempTeamTitle.en}
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
          value={tempTeamTitle.vi}
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
              const aboutTeam = {
                ...(machine.machineTeamSection?.aboutTeam || {}),
                [newKey]: {
                  teamLabel: {
                    en: tempTeamTitle.en || "New Team",
                    vi: tempTeamTitle.vi || "Nhóm Mới",
                  },
                  members: [],
                },
              };
              handleChange("machineTeamSection.aboutTeam", aboutTeam);
              setTempTeamTitle({ en: "", vi: "" });
              setAddTeamModal(false);
            }}
          >
            {isVietnamese ? "Thêm Nhóm" : "Add Team"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MachineCMSPage;
