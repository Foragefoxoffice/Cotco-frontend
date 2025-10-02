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
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";

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
  const { theme } = useTheme();
  const { useToken } = antdTheme;
  const { token } = useToken();

  const API_BASE = import.meta.env.VITE_API_URL; // e.g. http://localhost:5000

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path; // already full URL
    return `${API_BASE}${path}`;
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
    <div
      className={`max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl transition-all duration-300 dypages ${theme === "light"
        ? "bg-white text-white"
        : " dark:bg-gray-800 text-gray-100"
        }`}
    >
      <h2 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        Homepage Management
      </h2>

      <Collapse
        accordion
        bordered={false}
        className={`rounded-xl overflow-hidden  ${theme === "light" ? "bg-white" : "dark:bg-gray-800"
          }`}
      >
        {/* HERO */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiTarget /> Hero / Banner Section
            </span>
          }
          key="1"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium">Hero Title</label>
                <Input
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
                <label className="block font-medium mt-3">
                  Hero Description
                </label>
                <Input
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
                <label className="block font-medium mt-3">Button Text</label>
                <Input
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
                <label className="block font-medium mt-3">Button Link</label>
                <Input
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

          <Divider orientation="left">Background</Divider>

          {/* ✅ Preview uploaded file first */}
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
            // ✅ Fallback to saved DB value
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

          <input
            type="file"
            accept="image/*,video/*"
            className="block mb-6"
            onChange={(e) =>
              setHeroForm({ ...heroForm, bgFile: e.target.files[0], bgUrl: "" })
            }
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => handleSave("heroSection", heroForm, ["bgFile"])}
            >
              Save Hero
            </Button>
          </div>
        </Panel>

        {/* WHO WE ARE */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiUsers /> Who We Are Section
            </span>
          }
          key="2"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium">Heading</label>
                <Input
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
                <label className="block font-medium mt-3">Description</label>
                <Input
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
                <label className="block font-medium mt-3">Button Text</label>
                <Input
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
                <label className="block font-medium mt-3">Button Link</label>
                <Input
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
          <Divider orientation="left">Banner Image</Divider>

          {whoWeAreForm.whoWeArebannerImage && !whoWeAreForm.whoWeAreFile && (
            <img
              src={getFullUrl(whoWeAreForm.whoWeArebannerImage)}
              alt="Who We Are Banner"
              className="w-48 mb-4 rounded-lg"
            />
          )}

          {/* New preview from uploaded file */}
          {whoWeAreForm.whoWeAreFile && (
            <img
              src={URL.createObjectURL(whoWeAreForm.whoWeAreFile)}
              alt="Preview"
              className="w-48 mb-4 rounded-lg"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setWhoWeAreForm({
                ...whoWeAreForm,
                whoWeAreFile: e.target.files[0],
              })
            }
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("whoWeAreSection", whoWeAreForm, ["whoWeAreFile"])
              }
            >
              Save Who We Are
            </Button>
          </div>
        </Panel>

        {/* WHAT WE DO */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiTool /> What We Do Section
            </span>
          }
          key="3"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium">Section Title</label>
                <Input
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
                <label className="block font-medium mt-3">
                  Section Description
                </label>
                <Input
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
                  <div key={i} className="border rounded p-3 mt-4">
                    <label className="font-medium">Title {i}</label>
                    <Input
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
                    <label className="font-medium mt-3">Description {i}</label>
                    <Input
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
                    <label className="font-medium mt-3">Icon {i}</label>


                    {whatWeDoForm[`whatWeDoIcon${i}`] && !whatWeDoForm[`whatWeDoIcon${i}File`] && (
                      <img
                        src={getFullUrl(whatWeDoForm[`whatWeDoIcon${i}`])}
                        alt={`Icon ${i}`}
                        className="w-16 h-16 object-contain mb-2 rounded"
                      />
                    )}

                    {/* New file preview */}
                    {whatWeDoForm[`whatWeDoIcon${i}File`] && (
                      <img
                        src={URL.createObjectURL(whatWeDoForm[`whatWeDoIcon${i}File`])}
                        alt={`Icon ${i} Preview`}
                        className="w-16 h-16 object-contain mb-2 rounded"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setWhatWeDoForm({
                          ...whatWeDoForm,
                          [`whatWeDoIcon${i}File`]: e.target.files[0],
                        })
                      }
                    />

                    <label className="font-medium mt-3">Image {i}</label>

                    {/* Saved DB preview */}
                    {whatWeDoForm[`whatWeDoImg${i}`] && !whatWeDoForm[`whatWeDoImg${i}File`] && (
                      <img
                        src={getFullUrl(whatWeDoForm[`whatWeDoImg${i}`])}
                        alt={`Image ${i}`}
                        className="w-32 mb-2 rounded"
                      />
                    )}

                    {/* New file preview */}
                    {whatWeDoForm[`whatWeDoImg${i}File`] && (
                      <img
                        src={URL.createObjectURL(whatWeDoForm[`whatWeDoImg${i}File`])}
                        alt={`Image ${i} Preview`}
                        className="w-32 mb-2 rounded border"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setWhatWeDoForm({
                          ...whatWeDoForm,
                          [`whatWeDoImg${i}File`]: e.target.files[0],
                        })
                      }
                    />

                  </div>
                ))}
              </TabPane>
            ))}
          </Tabs>
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
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
            >
              Save What We Do
            </Button>
          </div>
        </Panel>

        {/* COMPANY LOGOS */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiBriefcase /> Company Logos Section
            </span>
          }
          key="4"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium">Section Heading</label>
                <Input
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

          <Divider>Partner Logos</Divider>

          {companyLogosForm.logos.map((logo, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              {logo.url && (
                <img
                  src={getFullUrl(logo.url)}
                  alt="Partner Logo"
                  className="w-20 h-20 object-contain"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const updated = [...companyLogosForm.logos];
                  updated[index].file = e.target.files[0];
                  setCompanyLogosForm({ ...companyLogosForm, logos: updated });
                }}
              />
              <Button
                danger
                onClick={() => {
                  const updated = companyLogosForm.logos.filter(
                    (_, i) => i !== index
                  );
                  setCompanyLogosForm({ ...companyLogosForm, logos: updated });
                }}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="dashed"
            className="w-full mt-3"
            onClick={() =>
              setCompanyLogosForm({
                ...companyLogosForm,
                logos: [...companyLogosForm.logos, { url: "", file: null }],
              })
            }
          >
            + Add Partner Logo
          </Button>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave(
                  "companyLogosSection",
                  companyLogosForm,
                  companyLogosForm.logos.map((_, i) => `partnerLogo${i}`)
                )
              }
            >
              Save Company Logos
            </Button>
          </div>
        </Panel>

        {/* DEFINED US */}
        {/* DEFINED US */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiStar /> What Defines Us Section
            </span>
          }
          key="5"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium">Section Heading</label>
                <Input
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
                  <div key={i} className="border rounded p-3 mb-4">
                    <label className="font-medium">Title {i}</label>
                    <Input
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

                    <label className="font-medium mt-3">Description {i}</label>
                    <Input
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
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => handleSave("definedUsSection", definedUsForm)}
            >
              Save Defined Us
            </Button>
          </div>
        </Panel>

        {/* CORE VALUES */}
        <Panel
          header={
            <span className="font-semibold text-lg flex items-center gap-2">
              <FiZap /> Core Values Section
            </span>
          }
          key="6"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <label className="block font-medium">Section Title</label>
                <Input
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
                  <div key={i} className="border rounded p-3 mt-4">
                    <label className="font-medium">Core Title {i}</label>
                    <Input
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
                    <label className="font-medium mt-3">
                      Core Description {i}
                    </label>
                    <Input
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
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("coreValuesSection", coreValuesForm, ["coreImage"])
              }
            >
              Save Core Values
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default HomePage;
