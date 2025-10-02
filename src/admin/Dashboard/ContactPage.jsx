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
      <h2 className="text-3xl font-bold mb-8 text-center">Contact Page Management</h2>

      <Collapse accordion bordered={false} defaultActiveKey="1">
        {/* Banner */}
        <Panel header={<span className="flex items-center gap-2"><FiEdit /> Contact Banner</span>} key="1">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">Title</label>
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

          <Divider>Background</Divider>
          {contactBanner.contactBannerBgFile ? (
            <img
              src={URL.createObjectURL(contactBanner.contactBannerBgFile)}
              alt="Banner"
              className="w-48 mb-4 rounded-lg"
            />
          ) : (
            contactBanner.contactBannerBg && (
              <img
                src={getFullUrl(contactBanner.contactBannerBg)}
                alt="Banner"
                className="w-48 mb-4 rounded-lg"
              />
            )
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setContactBanner({ ...contactBanner, contactBannerBgFile: e.target.files[0] })
            }
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button type="primary" onClick={() => handleSave("contactBanner", contactBanner, ["contactBannerBgFile"])}>Save</Button>
          </div>
        </Panel>

        {/* Contact Form */}
        <Panel header={<span className="flex items-center gap-2"><FiEdit /> Contact Form</span>} key="2">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">Form Text</label>
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

          <Divider>Form Image</Divider>
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
            onChange={(e) =>
              setContactForm({ ...contactForm, contactFormImgFile: e.target.files[0] })
            }
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button type="primary" onClick={() => handleSave("contactForm", contactForm, ["contactFormImgFile"])}>Save</Button>
          </div>
        </Panel>

        {/* Location */}
        <Panel header={<span className="flex items-center gap-2"><FiMapPin /> Location</span>} key="3">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">Title</label>
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
                <label className="block font-medium mt-3">Description</label>
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
                <label className="block font-medium mt-3">Button Text</label>
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

          <label className="block font-medium mt-3">Button Link</label>
          <Input
            value={contactLocation.contactLocationButtonLink}
            onChange={(e) =>
              setContactLocation({ ...contactLocation, contactLocationButtonLink: e.target.value })
            }
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button type="primary" onClick={() => handleSave("contactLocation", contactLocation)}>Save</Button>
          </div>
        </Panel>

        {/* Hours */}
        <Panel header={<span className="flex items-center gap-2"><FiClock /> Contact Hours</span>} key="4">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">Section Title</label>
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

                <Divider>Hours List</Divider>
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
                    + Add Hours
                  </Button>
                )}
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button type="primary" onClick={() => handleSave("contactHours", contactHours)}>Save</Button>
          </div>
        </Panel>

        {/* Map */}
        <Panel header={<span className="flex items-center gap-2"><FiMapPin /> Contact Map</span>} key="5">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block font-medium">Map Title</label>
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
          <label className="block font-medium mt-3">Map Iframe Link</label>
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
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button type="primary" onClick={() => handleSave("contactMap", contactMap)}>Save</Button>
          </div>
        </Panel>


      </Collapse>
    </div>
  );
};

export default ContactPage;
