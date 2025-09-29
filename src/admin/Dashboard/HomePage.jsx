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

  // COMPANY LOGOS
  const [companyLogosForm, setCompanyLogosForm] = useState({
    companyLogosHeading: { en: "", vi: "" },
    companyLogo1: "", // URL string saved in DB
    companyLogo1File: null, // File input only
    companyLogo2: "",
    companyLogo2File: null,
    companyLogo3: "",
    companyLogo3File: null,
    companyLogo4: "",
    companyLogo4File: null,
    companyLogo5: "",
    companyLogo5File: null,
    companyLogo6: "",
    companyLogo6File: null,
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
          companyLogo1File: null,
          companyLogo2File: null,
          companyLogo3File: null,
          companyLogo4File: null,
          companyLogo5File: null,
          companyLogo6File: null,
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
   // ---------------------- SAVE HANDLER ---------------------- //
  const handleSave = async (sectionName, formState, files = []) => {
    try {
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(formState));
      files.forEach((fileKey) => {
        if (formState[fileKey]) formData.append(fileKey, formState[fileKey]);
      });

      const res = await updateHomepage(formData);

      if (res.data?.homepage?.[sectionName]) {
        const updatedSection = res.data.homepage[sectionName];
        const resetFiles = Object.fromEntries(files.map((f) => [f, null]));

        switch (sectionName) {
          case "heroSection":
            setHeroForm({ ...updatedSection, ...resetFiles });
            break;
          case "whoWeAreSection":
            setWhoWeAreForm({ ...updatedSection, ...resetFiles });
            break;
          case "whatWeDoSection":
            setWhatWeDoForm({ ...updatedSection, ...resetFiles });
            break;
          case "companyLogosSection":
            setCompanyLogosForm({ ...updatedSection, ...resetFiles });
            break;
          case "definedUsSection":
            setDefinedUsForm({ ...updatedSection, ...resetFiles });
            break;
          case "coreValuesSection":
            setCoreValuesForm({ ...updatedSection, ...resetFiles });
            break;
        }

        // ✅ Success toaster
        CommonToaster( `${sectionName} saved successfully!`, "success");
      } else {
        // ❌ If no section was updated
        CommonToaster( `Failed to save ${sectionName}.`, "error");
      }
    } catch (error) {
      // ❌ Catch error toaster
      CommonToaster("error", error.message || "Something went wrong!");
    }
  };


  // ---------------------- UI ---------------------- //
  return (
    <div
      className={`max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl transition-all duration-300 dypages ${
        theme === "light"
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
        className={`rounded-xl overflow-hidden  ${
          theme === "light" ? "bg-white" : "dark:bg-gray-800"
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

          {heroForm.bgUrl &&
            (heroForm.bgType === "image" ? (
              <img
                src={heroForm.bgUrl}
                alt="Background"
                className="w-48 mb-4"
              />
            ) : (
              <video src={heroForm.bgUrl} controls className="w-48 mb-4" />
            ))}

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
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setWhoWeAreForm({
                ...whoWeAreForm,
                whoWeAreFile: e.target.files[0],
                whoWeArebannerImage: "",
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setWhatWeDoForm({
                          ...whatWeDoForm,
                          [`whatWeDoIcon${i}File`]: e.target.files[0], // ✅ not overwriting URL
                        })
                      }
                    />
                    <label className="font-medium mt-3">Image {i}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setWhatWeDoForm({
                          ...whatWeDoForm,
                          [`whatWeDoImg${i}File`]: e.target.files[0], // ✅ keep file separate
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

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-4">
              <label className="font-medium">Company Logo {i}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCompanyLogosForm({
                    ...companyLogosForm,
                    [`companyLogo${i}File`]: e.target.files[0], // ✅ keep file separate
                  })
                }
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("companyLogosSection", companyLogosForm, [
                  "companyLogo1File",
                  "companyLogo2File",
                  "companyLogo3File",
                  "companyLogo4File",
                  "companyLogo5File",
                  "companyLogo6File",
                ])
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
