import React, { useEffect } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import {
  FiImage,
  FiUsers,
  FiLayers,
  FiShield,
  FiStar,
  FiAward,
} from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getFiberPage, updateFiberPage } from "../../Api/api";

const { Panel } = Collapse;
const { TabPane } = Tabs;

// ✅ multilingual validator
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

export default function FiberPage() {
  const { theme } = useTheme();

  // ---------------- STATE ---------------- //
  const [fiberBanner, setFiberBanner] = usePersistedState("fiberBanner", {
    fiberBannerMedia: "",
    fiberBannerTitle: { en: "", vi: "" },
    fiberBannerDes: { en: "", vi: "" },
    fiberBannerContent: { en: "", vi: "" },
    fiberBannerSubTitle: { en: "", vi: "" },
    fiberBannerImg: "",
  });

  const [fiberSustainability, setFiberSustainability] = usePersistedState(
    "fiberSustainability",
    {
      fiberSustainabilityTitle: { en: "", vi: "" },
      fiberSustainabilitySubText: { en: "", vi: "" },
      fiberSustainabilityDes: { en: "", vi: "" },
      fiberSustainabilityImg: "",
      fiberSustainabilitySubTitle1: { en: "", vi: "" },
      fiberSustainabilitySubDes1: { en: "", vi: "" },
      fiberSustainabilitySubTitle2: { en: "", vi: "" },
      fiberSustainabilitySubDes2: { en: "", vi: "" },
      fiberSustainabilitySubTitle3: { en: "", vi: "" },
      fiberSustainabilitySubDes3: { en: "", vi: "" },
    }
  );

  const [fiberChooseUs, setFiberChooseUs] = usePersistedState("fiberChooseUs", {
    fiberChooseUsTitle: { en: "", vi: "" },
    fiberChooseUsDes: { en: "", vi: "" },
    fiberChooseUsBox: [],
  });

  const [fiberSupplier, setFiberSupplier] = usePersistedState("fiberSupplier", {
    fiberSupplierTitle: { en: "", vi: "" },
    fiberSupplierDes: [],
    fiberSupplierImg: [],
  });

  const [fiberProducts, setFiberProducts] = usePersistedState("fiberProducts", {
    fiberProduct: [],
    fiberProductBottomCon: { en: "", vi: "" },
    fiberProductButtonText: { en: "", vi: "" },
    fiberProductButtonLink: "",
  });

  const [fiberCertification, setFiberCertification] = usePersistedState(
    "fiberCertification",
    {
      fiberCertificationTitle: { en: "", vi: "" },
      fiberCertificationButtonText: { en: "", vi: "" },
      fiberCertificationButtonLink: "",
      fiberCertificationImg: [],
    }
  );

  // ---------------- FETCH ---------------- //
  useEffect(() => {
    getFiberPage().then((res) => {
      if (res.data?.fiberBanner) setFiberBanner(res.data.fiberBanner);
      if (res.data?.fiberSustainability)
        setFiberSustainability(res.data.fiberSustainability);
      if (res.data?.fiberChooseUs) setFiberChooseUs(res.data.fiberChooseUs);
      if (res.data?.fiberSupplier) setFiberSupplier(res.data.fiberSupplier);
      if (res.data?.fiberProducts) setFiberProducts(res.data.fiberProducts);
      if (res.data?.fiberCertification)
        setFiberCertification(res.data.fiberCertification);
    });
  }, []);

  // ---------------- SAVE ---------------- //
  const handleSave = async (sectionName, formState) => {
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

      const res = await updateFiberPage(formData);

      if (res.data?.fiber?.[sectionName]) {
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (err) {
      CommonToaster("Error", err.message || "Something went wrong!");
    }
  };

  // ---------------- UI ---------------- //
  return (
    <div
      className={`max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl ${
        theme === "light" ? "bg-white" : "dark:bg-gray-800 text-gray-100"
      }`}
    >
      <h2 className="text-4xl font-extrabold mb-10 text-center">
        Fiber Page Management
      </h2>

      <Collapse accordion bordered={false}>
        {/* 1. Banner */}
        <Panel
          header={
            <span>
              <FiImage /> Banner
            </span>
          }
          key="1"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>Title</label>
                <Input
                  value={fiberBanner.fiberBannerTitle[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerTitle: {
                        ...fiberBanner.fiberBannerTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Description</label>
                <Input
                  value={fiberBanner.fiberBannerDes[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerDes: {
                        ...fiberBanner.fiberBannerDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Content</label>
                <Input
                  value={fiberBanner.fiberBannerContent[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerContent: {
                        ...fiberBanner.fiberBannerContent,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Sub Title</label>
                <Input
                  value={fiberBanner.fiberBannerSubTitle[lang]}
                  onChange={(e) =>
                    setFiberBanner({
                      ...fiberBanner,
                      fiberBannerSubTitle: {
                        ...fiberBanner.fiberBannerSubTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          <Divider />
          <Input
            placeholder="Banner Media (image/video URL)"
            value={fiberBanner.fiberBannerMedia}
            onChange={(e) =>
              setFiberBanner({
                ...fiberBanner,
                fiberBannerMedia: e.target.value,
              })
            }
          />
          <Input
            placeholder="Banner Image URL"
            value={fiberBanner.fiberBannerImg}
            onChange={(e) =>
              setFiberBanner({ ...fiberBanner, fiberBannerImg: e.target.value })
            }
          />
          <Button
            type="primary"
            onClick={() => handleSave("fiberBanner", fiberBanner)}
          >
            Save Banner
          </Button>
        </Panel>

        {/* 2. Sustainability */}
        <Panel
          header={
            <span>
              <FiLayers /> Sustainability
            </span>
          }
          key="2"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>Title</label>
                <Input
                  value={fiberSustainability.fiberSustainabilityTitle[lang]}
                  onChange={(e) =>
                    setFiberSustainability({
                      ...fiberSustainability,
                      fiberSustainabilityTitle: {
                        ...fiberSustainability.fiberSustainabilityTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Sub Text</label>
                <Input
                  value={fiberSustainability.fiberSustainabilitySubText[lang]}
                  onChange={(e) =>
                    setFiberSustainability({
                      ...fiberSustainability,
                      fiberSustainabilitySubText: {
                        ...fiberSustainability.fiberSustainabilitySubText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Description</label>
                <Input
                  value={fiberSustainability.fiberSustainabilityDes[lang]}
                  onChange={(e) =>
                    setFiberSustainability({
                      ...fiberSustainability,
                      fiberSustainabilityDes: {
                        ...fiberSustainability.fiberSustainabilityDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          <Input
            placeholder="Image URL"
            value={fiberSustainability.fiberSustainabilityImg}
            onChange={(e) =>
              setFiberSustainability({
                ...fiberSustainability,
                fiberSustainabilityImg: e.target.value,
              })
            }
          />
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Tabs defaultActiveKey="en">
                {["en", "vi"].map((lang) => (
                  <TabPane tab={`SubTitle${i} ${lang}`} key={lang}>
                    <Input
                      placeholder={`Subtitle ${i}`}
                      value={
                        fiberSustainability[`fiberSustainabilitySubTitle${i}`][
                          lang
                        ]
                      }
                      onChange={(e) =>
                        setFiberSustainability({
                          ...fiberSustainability,
                          [`fiberSustainabilitySubTitle${i}`]: {
                            ...fiberSustainability[
                              `fiberSustainabilitySubTitle${i}`
                            ],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder={`SubDesc ${i}`}
                      value={
                        fiberSustainability[`fiberSustainabilitySubDes${i}`][
                          lang
                        ]
                      }
                      onChange={(e) =>
                        setFiberSustainability({
                          ...fiberSustainability,
                          [`fiberSustainabilitySubDes${i}`]: {
                            ...fiberSustainability[
                              `fiberSustainabilitySubDes${i}`
                            ],
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </TabPane>
                ))}
              </Tabs>
            </div>
          ))}
          <Button
            type="primary"
            onClick={() =>
              handleSave("fiberSustainability", fiberSustainability)
            }
          >
            Save Sustainability
          </Button>
        </Panel>

        {/* 3. Choose Us */}
        <Panel
          header={
            <span>
              <FiStar /> Choose Us
            </span>
          }
          key="3"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>Title</label>
                <Input
                  value={fiberChooseUs.fiberChooseUsTitle[lang]}
                  onChange={(e) =>
                    setFiberChooseUs({
                      ...fiberChooseUs,
                      fiberChooseUsTitle: {
                        ...fiberChooseUs.fiberChooseUsTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Description</label>
                <Input
                  value={fiberChooseUs.fiberChooseUsDes[lang]}
                  onChange={(e) =>
                    setFiberChooseUs({
                      ...fiberChooseUs,
                      fiberChooseUsDes: {
                        ...fiberChooseUs.fiberChooseUsDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          {fiberChooseUs.fiberChooseUsBox.map((box, idx) => (
            <div key={idx} className="border p-2 mb-2">
              <Input
                placeholder="Box Background URL"
                value={box.fiberChooseUsBoxBg}
                onChange={(e) => {
                  const arr = [...fiberChooseUs.fiberChooseUsBox];
                  arr[idx].fiberChooseUsBoxBg = e.target.value;
                  setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                }}
              />
              <Input
                placeholder="Icon (class or key)"
                value={box.fiberChooseUsIcon}
                onChange={(e) => {
                  const arr = [...fiberChooseUs.fiberChooseUsBox];
                  arr[idx].fiberChooseUsIcon = e.target.value;
                  setFiberChooseUs({ ...fiberChooseUs, fiberChooseUsBox: arr });
                }}
              />
              <Tabs defaultActiveKey="en">
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <Input
                      placeholder="Box Title"
                      value={box.fiberChooseUsBoxTitle[lang]}
                      onChange={(e) => {
                        const arr = [...fiberChooseUs.fiberChooseUsBox];
                        arr[idx].fiberChooseUsBoxTitle = {
                          ...arr[idx].fiberChooseUsBoxTitle,
                          [lang]: e.target.value,
                        };
                        setFiberChooseUs({
                          ...fiberChooseUs,
                          fiberChooseUsBox: arr,
                        });
                      }}
                    />
                    <Input
                      placeholder="Box Description"
                      value={box.fiberChooseUsDes[lang]}
                      onChange={(e) => {
                        const arr = [...fiberChooseUs.fiberChooseUsBox];
                        arr[idx].fiberChooseUsDes = {
                          ...arr[idx].fiberChooseUsDes,
                          [lang]: e.target.value,
                        };
                        setFiberChooseUs({
                          ...fiberChooseUs,
                          fiberChooseUsBox: arr,
                        });
                      }}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberChooseUs({
                ...fiberChooseUs,
                fiberChooseUsBox: [
                  ...fiberChooseUs.fiberChooseUsBox,
                  {
                    fiberChooseUsBoxBg: "",
                    fiberChooseUsIcon: "",
                    fiberChooseUsBoxTitle: { en: "", vi: "" },
                    fiberChooseUsDes: { en: "", vi: "" },
                  },
                ],
              })
            }
          >
            + Add Box
          </Button>
          <Button
            type="primary"
            onClick={() => handleSave("fiberChooseUs", fiberChooseUs)}
          >
            Save Choose Us
          </Button>
        </Panel>

        {/* 4. Supplier */}
        <Panel
          header={
            <span>
              <FiUsers /> Supplier
            </span>
          }
          key="4"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>Title</label>
                <Input
                  value={fiberSupplier.fiberSupplierTitle[lang]}
                  onChange={(e) =>
                    setFiberSupplier({
                      ...fiberSupplier,
                      fiberSupplierTitle: {
                        ...fiberSupplier.fiberSupplierTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          <Divider>Descriptions (list)</Divider>
          {fiberSupplier.fiberSupplierDes.map((d, idx) => (
            <Tabs defaultActiveKey="en" key={idx}>
              {["en", "vi"].map((lang) => (
                <TabPane tab={lang.toUpperCase()} key={lang}>
                  <Input
                    value={d[lang]}
                    onChange={(e) => {
                      const arr = [...fiberSupplier.fiberSupplierDes];
                      arr[idx] = { ...arr[idx], [lang]: e.target.value };
                      setFiberSupplier({
                        ...fiberSupplier,
                        fiberSupplierDes: arr,
                      });
                    }}
                  />
                </TabPane>
              ))}
            </Tabs>
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberSupplier({
                ...fiberSupplier,
                fiberSupplierDes: [
                  ...fiberSupplier.fiberSupplierDes,
                  { en: "", vi: "" },
                ],
              })
            }
          >
            + Add Description
          </Button>
          <Divider>Images</Divider>
          {fiberSupplier.fiberSupplierImg.map((img, idx) => (
            <Input
              key={idx}
              value={img}
              onChange={(e) => {
                const arr = [...fiberSupplier.fiberSupplierImg];
                arr[idx] = e.target.value;
                setFiberSupplier({ ...fiberSupplier, fiberSupplierImg: arr });
              }}
            />
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberSupplier({
                ...fiberSupplier,
                fiberSupplierImg: [...fiberSupplier.fiberSupplierImg, ""],
              })
            }
          >
            + Add Image
          </Button>
          <Button
            type="primary"
            onClick={() => handleSave("fiberSupplier", fiberSupplier)}
          >
            Save Supplier
          </Button>
        </Panel>

        {/* 5. Products */}
        <Panel
          header={
            <span>
              <FiImage /> Products
            </span>
          }
          key="5"
        >
          {fiberProducts.fiberProduct.map((p, idx) => (
            <div key={idx} className="border p-2 mb-2">
              <Tabs defaultActiveKey="en">
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <Input
                      placeholder="Product Title"
                      value={p.fiberProductTitle[lang]}
                      onChange={(e) => {
                        const arr = [...fiberProducts.fiberProduct];
                        arr[idx].fiberProductTitle = {
                          ...arr[idx].fiberProductTitle,
                          [lang]: e.target.value,
                        };
                        setFiberProducts({
                          ...fiberProducts,
                          fiberProduct: arr,
                        });
                      }}
                    />
                  </TabPane>
                ))}
              </Tabs>
              <Divider>Descriptions (list)</Divider>
              {p.fiberProductDes.map((d, dIdx) => (
                <Tabs defaultActiveKey="en" key={dIdx}>
                  {["en", "vi"].map((lang) => (
                    <TabPane tab={lang.toUpperCase()} key={lang}>
                      <Input
                        value={d[lang]}
                        onChange={(e) => {
                          const arr = [...fiberProducts.fiberProduct];
                          arr[idx].fiberProductDes[dIdx] = {
                            ...arr[idx].fiberProductDes[dIdx],
                            [lang]: e.target.value,
                          };
                          setFiberProducts({
                            ...fiberProducts,
                            fiberProduct: arr,
                          });
                        }}
                      />
                    </TabPane>
                  ))}
                </Tabs>
              ))}
              <Button
                type="dashed"
                onClick={() => {
                  const arr = [...fiberProducts.fiberProduct];
                  arr[idx].fiberProductDes.push({ en: "", vi: "" });
                  setFiberProducts({ ...fiberProducts, fiberProduct: arr });
                }}
              >
                + Add Description
              </Button>
              <Input
                placeholder="Product Image URL"
                value={p.fiberProductImg}
                onChange={(e) => {
                  const arr = [...fiberProducts.fiberProduct];
                  arr[idx].fiberProductImg = e.target.value;
                  setFiberProducts({ ...fiberProducts, fiberProduct: arr });
                }}
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberProducts({
                ...fiberProducts,
                fiberProduct: [
                  ...fiberProducts.fiberProduct,
                  {
                    fiberProductTitle: { en: "", vi: "" },
                    fiberProductDes: [],
                    fiberProductImg: "",
                  },
                ],
              })
            }
          >
            + Add Product
          </Button>
          <Divider />
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={`BottomCon ${lang}`} key={lang}>
                <Input
                  value={fiberProducts.fiberProductBottomCon[lang]}
                  onChange={(e) =>
                    setFiberProducts({
                      ...fiberProducts,
                      fiberProductBottomCon: {
                        ...fiberProducts.fiberProductBottomCon,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={`ButtonText ${lang}`} key={lang}>
                <Input
                  value={fiberProducts.fiberProductButtonText[lang]}
                  onChange={(e) =>
                    setFiberProducts({
                      ...fiberProducts,
                      fiberProductButtonText: {
                        ...fiberProducts.fiberProductButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          <Input
            placeholder="Button Link"
            value={fiberProducts.fiberProductButtonLink}
            onChange={(e) =>
              setFiberProducts({
                ...fiberProducts,
                fiberProductButtonLink: e.target.value,
              })
            }
          />
          <Button
            type="primary"
            onClick={() => handleSave("fiberProducts", fiberProducts)}
          >
            Save Products
          </Button>
        </Panel>

        {/* 6. Certification */}
        <Panel
          header={
            <span>
              <FiAward /> Certification
            </span>
          }
          key="6"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label>Title</label>
                <Input
                  value={fiberCertification.fiberCertificationTitle[lang]}
                  onChange={(e) =>
                    setFiberCertification({
                      ...fiberCertification,
                      fiberCertificationTitle: {
                        ...fiberCertification.fiberCertificationTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label>Button Text</label>
                <Input
                  value={fiberCertification.fiberCertificationButtonText[lang]}
                  onChange={(e) =>
                    setFiberCertification({
                      ...fiberCertification,
                      fiberCertificationButtonText: {
                        ...fiberCertification.fiberCertificationButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>
          <Input
            placeholder="Button Link"
            value={fiberCertification.fiberCertificationButtonLink}
            onChange={(e) =>
              setFiberCertification({
                ...fiberCertification,
                fiberCertificationButtonLink: e.target.value,
              })
            }
          />
          <Divider>Images</Divider>
          {fiberCertification.fiberCertificationImg.map((img, idx) => (
            <Input
              key={idx}
              value={img}
              onChange={(e) => {
                const arr = [...fiberCertification.fiberCertificationImg];
                arr[idx] = e.target.value;
                setFiberCertification({
                  ...fiberCertification,
                  fiberCertificationImg: arr,
                });
              }}
            />
          ))}
          <Button
            type="dashed"
            onClick={() =>
              setFiberCertification({
                ...fiberCertification,
                fiberCertificationImg: [
                  ...fiberCertification.fiberCertificationImg,
                  "",
                ],
              })
            }
          >
            + Add Image
          </Button>
          <Button
            type="primary"
            onClick={() => handleSave("fiberCertification", fiberCertification)}
          >
            Save Certification
          </Button>
        </Panel>
      </Collapse>
    </div>
  );
}
