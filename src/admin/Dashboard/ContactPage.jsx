import React, { useState, useEffect } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import { FiPhone, FiMapPin, FiClock, FiEdit } from "react-icons/fi";
import { getContactPage, updateContactPage } from "../../Api/api";
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const ContactPage = () => {
  const { theme } = useTheme();

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
      add: "+ Add",
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
      addHours: "+ Add Hours",
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
      recommendedHero: "Khuyến nghị: 1260×660px (Hình ảnh) | Kích thước video tối đa: 10MB",
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
        setContactBanner({ ...res.data.contactBanner, contactBannerBgFile: null });
      if (res.data?.contactForm)
        setContactForm({ ...res.data.contactForm, contactFormImgFile: null });
      if (res.data?.contactLocation) setContactLocation(res.data.contactLocation);
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
      if (sectionName === "contactBanner" && !isValidMultiLang(formState.contactBannerTitle)) {
        return CommonToaster("Please fill both EN & VI in Banner Title", "error");
      }
      if (sectionName === "contactForm" && !isValidMultiLang(formState.contactForm)) {
        return CommonToaster("Please fill both EN & VI in Contact Form text", "error");
      }
      if (sectionName === "contactLocation") {
        if (
          !isValidMultiLang(formState.contactLocationTitle) ||
          !isValidMultiLang(formState.contactLocationDes) ||
          !isValidMultiLang(formState.contactLocationButtonText)
        ) {
          return CommonToaster("Please fill both EN & VI for Location fields", "error");
        }
      }
      if (sectionName === "contactHours") {
        if (!isValidMultiLang(formState.contactHoursTitle)) {
          return CommonToaster("Please fill both EN & VI in Contact Hours Title", "error");
        }
        if (formState.contactHoursList.some((item) => !isValidMultiLang(item))) {
          return CommonToaster("Please fill both EN & VI in all Contact Hours list items", "error");
        }
      }
      if (sectionName === "contactMap") {
        if (!isValidMultiLang(formState.contactMapTitle)) {
          return CommonToaster("Please fill both EN & VI in Map Title", "error");
        }
        if (!formState.contactMapMap?.trim()) {
          return CommonToaster("Please provide an iframe link for the map", "error");
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
            setContactBanner({ ...res.data.contact.contactBanner, contactBannerBgFile: null });
            break;
          case "contactForm":
            setContactForm({ ...res.data.contact.contactForm, contactFormImgFile: null });
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
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-white dark:bg-gray-800">
      <style>{`
        label {
          color: #314158 !important;
        }
      `}</style>
      <h2 className="text-3xl font-bold mb-8 text-center">Contact Page Management</h2>

      <Collapse accordion bordered={false} defaultActiveKey="1">
        {/* Banner */}
        <Panel header={<span className="flex items-center gap-2"><FiEdit /> Contact Banner</span>} key="1">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].bannerTitle}</label>
                <Input
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

          <Divider>{translations[currentLang].bannerMedia}</Divider>
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

          <input
            type="file"
            accept="image/*,video/*"
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

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button type="primary" onClick={() => handleSave("contactBanner", contactBanner, ["contactBannerBgFile"])}>{translations[currentLang].save}</Button>
          </div>
        </Panel>

        {/* Contact Form */}
        <Panel header={<span className="flex items-center gap-2"><FiEdit /> Contact Form</span>} key="2">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].formText}</label>
                <Input
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

          <Divider>{translations[currentLang].formImage}</Divider>
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (!validateFileSize(file)) return; // ✅ size check

              setContactForm({ ...contactForm, contactFormImgFile: file });
            }}
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button type="primary" onClick={() => handleSave("contactForm", contactForm, ["contactFormImgFile"])}>{translations[currentLang].saveForm}</Button>
          </div>
        </Panel>

        {/* Location */}
        <Panel header={<span className="flex items-center gap-2"><FiMapPin /> Location</span>} key="3">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].locationTitle}</label>
                <Input
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
                <label className="block font-medium mt-3">{translations[currentLang].locationDescription}</label>
                <Input
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
                <label className="block font-medium mt-3">{translations[currentLang].locationButtonText}</label>
                <Input
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

          <label className="block font-medium mt-3">{translations[currentLang].locationButtonLink}</label>
          <Input
            value={contactLocation.contactLocationButtonLink}
            onChange={(e) =>
              setContactLocation({ ...contactLocation, contactLocationButtonLink: e.target.value })
            }
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button type="primary" onClick={() => handleSave("contactLocation", contactLocation)}>{translations[currentLang].saveLocation}</Button>
          </div>
        </Panel>

        {/* Hours */}
        <Panel header={<span className="flex items-center gap-2"><FiClock /> Contact Hours</span>} key="4">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].sectionTitle}</label>
                <Input
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
                <Divider>{translations[currentLang].hoursList}</Divider>
                {contactHours.contactHoursList.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder={lang.toUpperCase()}
                      value={item[lang]}
                      onChange={(e) => {
                        const updated = [...contactHours.contactHoursList];
                        updated[i][lang] = e.target.value;
                        setContactHours({ ...contactHours, contactHoursList: updated });
                      }}
                    />
                    {lang === "en" && ( // remove button only once
                      <Button danger onClick={() => {
                        const updated = contactHours.contactHoursList.filter((_, idx) => idx !== i);
                        setContactHours({ ...contactHours, contactHoursList: updated });
                      }}>Remove</Button>
                    )}
                  </div>
                ))}

                {lang === "en" && (
                  <Button
                    type="dashed"
                    onClick={() =>
                      setContactHours({
                        ...contactHours,
                        contactHoursList: [...contactHours.contactHoursList, { en: "", vi: "" }],
                      })
                    }
                  >
                    {translations[currentLang].addHours}
                  </Button>
                )}
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button type="primary" onClick={() => handleSave("contactHours", contactHours)}>{translations[currentLang].saveHours}</Button>
          </div>
        </Panel>

        {/* Map */}
        <Panel header={<span className="flex items-center gap-2"><FiMapPin /> Contact Map</span>} key="5">
          <Tabs activeKey={currentLang} onChange={setCurrentLang}>
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">{translations[currentLang].mapTitle}</label>
                <Input
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
          <label className="block font-medium mt-3">{translations[currentLang].mapIframe}</label>
          <Input
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
            <Button onClick={() => window.location.reload()}>{translations[currentLang].cancel}</Button>
            <Button type="primary" onClick={() => handleSave("contactMap", contactMap)}>{translations[currentLang].saveMap}</Button>
          </div>
        </Panel>


      </Collapse>
    </div>
  );
};

export default ContactPage;
