import React, { useState, useEffect } from "react";
import { Collapse, Input, Select, Button, Tabs, Divider } from "antd";
import { getHomepage, updateHomepage } from "../../Api/api";
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const validateVietnamese = (formState) => {
  const checkObject = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      // If it's a multilingual field (EN + VI)
      if ("vi" in obj && "en" in obj) {
        return obj.vi?.trim() !== "" && obj.en?.trim() !== "";
      }
      // Otherwise keep checking nested objects
      return Object.values(obj).every((val) => checkObject(val));
    }
    return true; // ignore plain strings or files
  };

  return checkObject(formState);
};

const HomePage = () => {
  const { theme } = useTheme();

  // ---------------------- HERO ---------------------- //
  const [heroForm, setHeroForm] = useState({
    bgType: "image",
    bgUrl: "",
    heroTitle: { en: "", vi: "" },
    heroDescription: { en: "", vi: "" },
    heroButtonText: { en: "", vi: "" },
    heroButtonLink: { en: "", vi: "" },
    bgFile: null,
  });

  // ---------------------- WHO WE ARE ---------------------- //
  const [whoWeAreForm, setWhoWeAreForm] = useState({
    whoWeAreheading: { en: "", vi: "" }, // 👈 match schema
    whoWeAredescription: { en: "", vi: "" },
    whoWeArebannerImage: "",
    whoWeArebuttonText: { en: "", vi: "" },
    whoWeArebuttonLink: { en: "", vi: "" },
    whoWeAreFile: null,
  });

  // ---------------------- WHAT WE DO ---------------------- //
  const [whatWeDoForm, setWhatWeDoForm] = useState({
    whatWeDoTitle: { en: "", vi: "" },
    whatWeDoDec: { en: "", vi: "" },
    whatWeDoTitle1: { en: "", vi: "" },
    whatWeDoDes1: { en: "", vi: "" },
    whatWeDoTitle2: { en: "", vi: "" },
    whatWeDoDes2: { en: "", vi: "" },
    whatWeDoTitle3: { en: "", vi: "" },
    whatWeDoDes3: { en: "", vi: "" },
    whatWeDoIcon1: null,
    whatWeDoIcon2: null,
    whatWeDoIcon3: null,
    whatWeDoImg1: null,
    whatWeDoImg2: null,
    whatWeDoImg3: null,
  });

  // ---------------------- COMPANY LOGOS ---------------------- //
  const [companyLogosForm, setCompanyLogosForm] = useState({
    companyLogo1: "",
    companyLogo2: "",
    companyLogo3: "",
    companyLogo4: "",
    companyLogo5: "",
    companyLogo6: "",
    companyLogo1File: null,
    companyLogo2File: null,
    companyLogo3File: null,
    companyLogo4File: null,
    companyLogo5File: null,
    companyLogo6File: null,
  });

  // ---------------------- DEFINED US ---------------------- //
  const [definedUsForm, setDefinedUsForm] = useState({
    definedUsTitle1: { en: "", vi: "" },
    definedUsDes1: { en: "", vi: "" },
    definedUsTitle2: { en: "", vi: "" },
    definedUsDes2: { en: "", vi: "" },
    definedUsTitle3: { en: "", vi: "" },
    definedUsDes3: { en: "", vi: "" },
    definedUsTitle4: { en: "", vi: "" },
    definedUsDes4: { en: "", vi: "" },
    definedUsTitle5: { en: "", vi: "" },
    definedUsDes5: { en: "", vi: "" },
    definedUsTitle6: { en: "", vi: "" },
    definedUsDes6: { en: "", vi: "" },
    definedUsLogo1File: null,
    definedUsLogo2File: null,
    definedUsLogo3File: null,
    definedUsLogo4File: null,
    definedUsLogo5File: null,
    definedUsLogo6File: null,
  });

  // ---------------------- CORE VALUES ---------------------- //
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
    coreImageFile: null,
  });

  // ---------------------- FETCH ---------------------- //
  useEffect(() => {
    getHomepage().then((res) => {
      if (res.data?.heroSection)
        setHeroForm((p) => ({ ...p, ...res.data.heroSection }));
      if (res.data?.whoWeAreSection)
        setWhoWeAreForm((p) => ({ ...p, ...res.data.whoWeAreSection }));
      if (res.data?.whatWeDoSection)
        setWhatWeDoForm((p) => ({ ...p, ...res.data.whatWeDoSection }));
      if (res.data?.companyLogosSection)
        setCompanyLogosForm((p) => ({ ...p, ...res.data.companyLogosSection }));
      if (res.data?.definedUsSection)
        setDefinedUsForm((p) => ({ ...p, ...res.data.definedUsSection }));
      if (res.data?.coreValuesSection)
        setCoreValuesForm((p) => ({ ...p, ...res.data.coreValuesSection }));
    });
  }, []);

  // ---------------------- SAVE HANDLER ---------------------- //
  const handleSave = async (sectionName, formState, files = []) => {
    if (!validateVietnamese(formState)) {
      CommonToaster(
        "Please fill all Vietnamese (VN) fields before saving!",
        "error"
      );
      return;
    }
    const formData = new FormData();
    formData.append(sectionName, JSON.stringify(formState));
    files.forEach((file) => {
      if (formState[file]) formData.append(file, formState[file]);
    });
    await updateHomepage(formData);
    CommonToaster(`${sectionName} updated successfully!`, "success");
  };

  // ---------------------- RENDER ---------------------- //
  return (
    <div
      className={`max-w-7xl mx-auto p-6 rounded-lg shadow-md mt-6 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        🏠 Homepage Management
      </h2>

      <Collapse accordion bordered className="bg-transparent">
        {/* HERO */}
        <Panel header="🎯 Hero / Banner Section" key="1">
          <Divider orientation="left">Multilingual Content</Divider>
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <div className="space-y-3">
                  <label className="font-medium">Hero Title</label>
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
                  <label className="font-medium">Hero Description</label>
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
                  <label className="font-medium">Button Text</label>
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
                  <label className="font-medium">Button Link</label>
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
                </div>
              </TabPane>
            ))}
          </Tabs>
          <Divider orientation="left">Background</Divider>
          <Select
            value={heroForm.bgType}
            onChange={(val) => setHeroForm({ ...heroForm, bgType: val })}
            className="w-full mb-3"
            options={[
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
            ]}
          />
          <input
            type="file"
            accept="image/*,video/*"
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
              💾 Save Hero
            </Button>
          </div>
        </Panel>

        {/* WHO WE ARE */}
        <Panel header="👥 Who We Are Section" key="2">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <div className="space-y-3">
                  <label className="font-medium">Heading</label>
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
                  <label className="font-medium">Description</label>
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
                  <label className="font-medium">Button Text</label>
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
                  <label className="font-medium">Button Link</label>
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
                </div>
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
              💾 Save Who We Are
            </Button>
          </div>
        </Panel>

        {/* WHAT WE DO */}
        <Panel header="⚒️ What We Do Section" key="3">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <div className="space-y-3">
                  <label className="font-medium">Section Title</label>
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
                  <label className="font-medium">Section Description</label>
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
                    <div key={i} className="border p-3 rounded">
                      <label>Title {i}</label>
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
                        className="mb-2"
                      />
                      <label>Description {i}</label>
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
                        className="mb-2"
                      />
                      <label>Icon {i}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setWhatWeDoForm({
                            ...whatWeDoForm,
                            [`whatWeDoIcon${i}`]: e.target.files[0], // ✅ no "File"
                          })
                        }
                      />

                      <label>Image {i}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setWhatWeDoForm({
                            ...whatWeDoForm,
                            [`whatWeDoImg${i}`]: e.target.files[0], // ✅ no "File"
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </TabPane>
            ))}
          </Tabs>
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("whatWeDoSection", whatWeDoForm, [
                  "whatWeDoIcon1",
                  "whatWeDoIcon2",
                  "whatWeDoIcon3",
                  "whatWeDoImg1",
                  "whatWeDoImg2",
                  "whatWeDoImg3",
                ])
              }
            >
              💾 Save What We Do
            </Button>
          </div>
        </Panel>

        {/* COMPANY LOGOS */}
        <Panel header="🏢 Company Logos Section" key="4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-4">
              <label className="font-medium">Company Logo {i}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCompanyLogosForm({
                    ...companyLogosForm,
                    [`companyLogo${i}`]: e.target.files[0], // ✅ send file with correct key
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
                  "companyLogo1",
                  "companyLogo2",
                  "companyLogo3",
                  "companyLogo4",
                  "companyLogo5",
                  "companyLogo6",
                ])
              }
            >
              💾 Save Company Logos
            </Button>
          </div>
        </Panel>

        {/* DEFINED US */}
        <Panel header="🌟 What Defines Us Section" key="5">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border p-3 rounded mb-3">
                    <label>Title {i}</label>
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
                      className="mb-2"
                    />
                    <label>Description {i}</label>
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
                      className="mb-2"
                    />
                    <label>Logo {i}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setDefinedUsForm({
                          ...definedUsForm,
                          [`definedUsLogo${i}`]: e.target.files[0], // ✅ correct key
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
                handleSave("definedUsSection", definedUsForm, [
                  "definedUsLogo1",
                  "definedUsLogo2",
                  "definedUsLogo3",
                  "definedUsLogo4",
                  "definedUsLogo5",
                  "definedUsLogo6",
                ])
              }
            >
              💾 Save Defined Us
            </Button>
          </div>
        </Panel>

        {/* CORE VALUES */}
        <Panel header="💡 Core Values Section" key="6">
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane
                tab={lang === "en" ? "English (EN)" : "Vietnamese (VN)"}
                key={lang}
              >
                <div className="space-y-3">
                  <label className="font-medium">Section Title</label>
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
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border p-3 rounded">
                      <label>Core Title {i}</label>
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
                        className="mb-2"
                      />
                      <label>Core Description {i}</label>
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
                </div>
              </TabPane>
            ))}
          </Tabs>
          <Divider orientation="left">Background Image</Divider>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoreValuesForm({
                ...coreValuesForm,
                coreImage: e.target.files[0], // ✅ match backend
              })
            }
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("coreValuesSection", coreValuesForm, ["coreImage"])
              }
            >
              💾 Save Core Values
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default HomePage;
