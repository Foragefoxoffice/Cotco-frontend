// frontend/pages/CottonPage.jsx
import React, { useEffect } from "react";
import { Collapse, Input, Button, Tabs, Divider } from "antd";
import { FiImage, FiUsers, FiLayers, FiShield, FiStar } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { CommonToaster } from "../../Common/CommonToaster";
import usePersistedState from "../../hooks/usePersistedState";
import { getCottonPage, updateCottonPage } from "../../Api/api";

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

// ✅ File preview helper
const handleImageChange = (e, setter, key) => {
  const file = e.target.files[0];
  if (!file) return;

  setter((prev) => ({
    ...prev,
    [key + "File"]: file,
    preview: URL.createObjectURL(file),
  }));
};

// ✅ API base
const API_BASE = import.meta.env.VITE_API_URL;
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const CottonPage = () => {
  const { theme } = useTheme();

  // ---------------------- STATES ---------------------- //
  const [cottonBanner, setCottonBanner] = usePersistedState("cottonBanner", {
    cottonBannerImg: "",
    cottonBannerImgFile: null,
    cottonBannerTitle: { en: "", vi: "" },
    cottonBannerDes: { en: "", vi: "" },
    cottonBannerOverview: { en: "", vi: "" },
    cottonBannerSlideImg: [],
    cottonBannerSlideImgFiles: [],
  });

  const [cottonSupplier, setCottonSupplier] = usePersistedState(
    "cottonSupplier",
    []
  );

  const [cottonTrust, setCottonTrust] = usePersistedState("cottonTrust", {
    cottonTrustTitle: { en: "", vi: "" },
    cottonTrustDes: { en: "", vi: "" },
    cottonTrustLogo: [],
    cottonTrustLogoFiles: [],
    cottonTrustImg: "",
    cottonTrustImgFile: null,
  });

  const [cottonMember, setCottonMember] = usePersistedState("cottonMember", {
    cottonMemberTitle: { en: "", vi: "" },
    cottonMemberButtonText: { en: "", vi: "" },
    cottonMemberButtonLink: "",
    cottonMemberImg: [],
    cottonMemberImgFiles: [],
  });

  // ---------------------- FETCH ---------------------- //
  useEffect(() => {
    getCottonPage().then((res) => {
      if (res.data?.cottonBanner)
        setCottonBanner((prev) => ({
          ...prev,
          ...res.data.cottonBanner,
          cottonBannerImgFile: prev.cottonBannerImgFile,
          cottonBannerSlideImg:
            res.data.cottonBanner.cottonBannerSlideImg || [],
          cottonBannerSlideImgFiles: prev.cottonBannerSlideImgFiles || [],
          cottonBannerOverview: res.data.cottonBanner.cottonBannerOverview || {
            en: "",
            vi: "",
          },
        }));

      if (res.data?.cottonSupplier)
        setCottonSupplier(res.data.cottonSupplier || []); // ✅ fallback

      if (res.data?.cottonTrust)
        setCottonTrust((prev) => ({
          ...prev,
          ...res.data.cottonTrust,
          cottonTrustLogo: res.data.cottonTrust.cottonTrustLogo || [],
          cottonTrustLogoFiles: prev.cottonTrustLogoFiles || [],
          cottonTrustImgFile: prev.cottonTrustImgFile,
        }));

      if (res.data?.cottonMember)
        setCottonMember((prev) => ({
          ...prev,
          ...res.data.cottonMember,
          cottonMemberImg: res.data.cottonMember.cottonMemberImg || [],
          cottonMemberImgFiles: prev.cottonMemberImgFiles || [],
        }));
    });
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

      // Special case: suppliers (array with per-index files)
      if (sectionName === "cottonSupplier") {
        formState.forEach((s, i) => {
          if (s.cottonSupplierLogoFile instanceof File) {
            formData.append(
              `cottonSupplierLogoFile${i}`,
              s.cottonSupplierLogoFile
            );
          }
          if (s.cottonSupplierBgFile instanceof File) {
            formData.append(`cottonSupplierBgFile${i}`, s.cottonSupplierBgFile); // ✅ NEW
          }
        });
      } else {
        // normal flow for other sections
        files.forEach((fileKey) => {
          if (Array.isArray(formState[fileKey])) {
            formState[fileKey].forEach((file) => {
              if (file instanceof File) formData.append(fileKey, file);
            });
          } else if (formState[fileKey] instanceof File) {
            formData.append(fileKey, formState[fileKey]);
          }
        });
      }

      const res = await updateCottonPage(formData);

      if (res.data?.cotton?.[sectionName]) {
        localStorage.removeItem(sectionName);
        CommonToaster(`${sectionName} saved successfully!`, "success");
      } else {
        CommonToaster(`Failed to save ${sectionName}`, "error");
      }
    } catch (error) {
      CommonToaster("Error", error.message || "Something went wrong!");
    }
  };

  const instantSave = async (sectionName, formState, files = []) => {
    try {
      const formData = new FormData();
      formData.append(sectionName, JSON.stringify(formState));

      // append files if any
      files.forEach((fileKey) => {
        if (Array.isArray(formState[fileKey])) {
          formState[fileKey].forEach((file) => {
            if (file instanceof File) formData.append(fileKey, file);
          });
        } else if (formState[fileKey] instanceof File) {
          formData.append(fileKey, formState[fileKey]);
        }
      });

      const res = await updateCottonPage(formData);
      if (res.data?.cotton?.[sectionName]) {
        CommonToaster(`${sectionName} deleted successfully!`, "success");
      } else {
        CommonToaster(`Failed to update ${sectionName}`, "error");
      }
    } catch (err) {
      CommonToaster("Error", err.message || "Something went wrong!");
    }
  };

  // ---------------------- UI ---------------------- //
  return (
    <div
      className={`max-w-7xl mx-auto p-8 mt-8 rounded-xl shadow-xl ${theme === "light" ? "bg-white" : "dark:bg-gray-800 text-gray-100"
        }`}
    >
      <h2 className="text-4xl font-extrabold mb-10 text-center">
        Cotton Page Management
      </h2>

      <Collapse accordion bordered={false}>
        {/* 1. Banner */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold">
              <FiImage /> Banner
            </span>
          }
          key="1"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block">Title</label>
                <Input
                  value={cottonBanner.cottonBannerTitle[lang]}
                  onChange={(e) =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerTitle: {
                        ...cottonBanner.cottonBannerTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block mt-3">Description</label>
                <Input
                  value={cottonBanner.cottonBannerDes[lang]}
                  onChange={(e) =>
                    setCottonBanner({
                      ...cottonBanner,
                      cottonBannerDes: {
                        ...cottonBanner.cottonBannerDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <Divider>Banner Image</Divider>
          {cottonBanner.cottonBannerImg && (
            <img
              src={getFullUrl(cottonBanner.cottonBannerImg)}
              alt="Banner"
              className="w-48 mb-3"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setCottonBanner, "cottonBannerImg")
            }
          />

          <Divider>Banner Slide Images</Divider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(cottonBanner.cottonBannerSlideImg || []).map((img, idx) => (
              <div key={`slide-${idx}`} className="relative">
                <img
                  src={getFullUrl(img)}
                  alt="slide"
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={async () => {
                    const newSlides = (
                      cottonBanner.cottonBannerSlideImg || []
                    ).filter((_, i) => i !== idx);
                    const updated = {
                      ...cottonBanner,
                      cottonBannerSlideImg: newSlides,
                    };
                    setCottonBanner(updated);
                    await instantSave("cottonBanner", updated, [
                      "cottonBannerSlideImgFiles",
                    ]);
                  }}
                >
                  X
                </Button>
              </div>
            ))}

            {(cottonBanner.cottonBannerSlideImgFiles || []).map((file, idx) => {
              if (!(file instanceof File)) return null;
              return (
                <div key={`new-slide-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-slide"
                    className="w-full h-24 object-contain"
                  />
                  <Button
                    danger
                    size="small"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setCottonBanner({
                        ...cottonBanner,
                        cottonBannerSlideImgFiles: (
                          cottonBanner.cottonBannerSlideImgFiles || []
                        ).filter((_, i) => i !== idx),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setCottonBanner({
                ...cottonBanner,
                cottonBannerSlideImgFiles: [
                  ...cottonBanner.cottonBannerSlideImgFiles,
                  ...Array.from(e.target.files),
                ],
              })
            }
          />

          <div className="flex justify-end mt-6 gap-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("cottonBanner", cottonBanner, [
                  "cottonBannerImgFile",
                  "cottonBannerSlideImgFiles", // ✅ added
                ])
              }
            >
              Save Banner
            </Button>
          </div>
        </Panel>

        {/* 3. Supplier */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold">
              <FiUsers /> Suppliers
            </span>
          }
          key="3"
        >
          {cottonSupplier.map((s, idx) => (
            <div
              key={idx}
              className="border rounded p-4 mb-4 bg-gray-50 dark:bg-gray-700"
            >
              <Tabs defaultActiveKey="en">
                {["en", "vi"].map((lang) => (
                  <TabPane tab={lang.toUpperCase()} key={lang}>
                    <label className="block">Title</label>
                    <Input
                      value={s.cottonSupplierTitle?.[lang]}
                      onChange={(e) => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierTitle = {
                          ...s.cottonSupplierTitle,
                          [lang]: e.target.value,
                        };
                        setCottonSupplier(newArr);
                      }}
                    />
                    <label className="block mt-3">Logo Name</label>
                    <Input
                      value={s.cottonSupplierLogoName?.[lang]}
                      onChange={(e) => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierLogoName = {
                          ...s.cottonSupplierLogoName,
                          [lang]: e.target.value,
                        };
                        setCottonSupplier(newArr);
                      }}
                    />
                    <label className="block mt-3">Description</label>
                    <Input
                      value={s.cottonSupplierDes?.[lang]}
                      onChange={(e) => {
                        const newArr = [...cottonSupplier];
                        newArr[idx].cottonSupplierDes = {
                          ...s.cottonSupplierDes,
                          [lang]: e.target.value,
                        };
                        setCottonSupplier(newArr);
                      }}
                    />
                  </TabPane>
                ))}
              </Tabs>

              <Divider>Background</Divider>
              {/* Show saved background from DB */}
              {s.cottonSupplierBg && !s.previewBg && (
                <img src={getFullUrl(s.cottonSupplierBg)} alt="bg" className="w-48 mb-2" />
              )}

              {/* Show preview if uploading new */}
              {s.previewBg && (
                <img src={s.previewBg} alt="preview-bg" className="w-48 mb-2" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const newArr = [...cottonSupplier];
                  newArr[idx].cottonSupplierBgFile = file;

                  // Blob preview
                  newArr[idx].previewBg = URL.createObjectURL(file);

                  setCottonSupplier(newArr);
                }}
              />

              <Divider>Logo</Divider>
              {/* Show saved logo from DB */}
              {s.cottonSupplierLogo && !s.previewLogo && (
                <img
                  src={getFullUrl(s.cottonSupplierLogo)}
                  alt="logo"
                  className="w-32 mb-2"
                />
              )}

              {/* Show preview if uploading new */}
              {s.previewLogo && (
                <img src={s.previewLogo} alt="preview" className="w-32 mb-2" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const newArr = [...cottonSupplier];
                  newArr[idx].cottonSupplierLogoFile = file;

                  // Preview using blob, not base64
                  newArr[idx].previewLogo = URL.createObjectURL(file);

                  setCottonSupplier(newArr);
                }}
              />
              <Button
                danger
                className="mt-3"
                onClick={async () => {
                  const newArr = cottonSupplier.filter((_, i) => i !== idx);
                  setCottonSupplier(newArr);
                  await instantSave("cottonSupplier", newArr); // instantly update DB
                }}
              >
                Remove Supplier
              </Button>
            </div>
          ))}

          <Button
            type="dashed"
            className="w-full"
            onClick={() =>
              setCottonSupplier([
                ...cottonSupplier,
                {
                  cottonSupplierTitle: { en: "", vi: "" },
                  cottonSupplierLogoName: { en: "", vi: "" },
                  cottonSupplierDes: { en: "", vi: "" },
                  cottonSupplierLogo: "",
                  cottonSupplierLogoFile: null,
                },
              ])
            }
          >
            + Add Supplier
          </Button>

          <div className="flex justify-end mt-6 gap-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => handleSave("cottonSupplier", cottonSupplier)}
            >
              Save Suppliers
            </Button>
          </div>
        </Panel>

        {/* 4. Trust */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold">
              <FiShield /> Trust
            </span>
          }
          key="4"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block">Title</label>
                <Input
                  value={cottonTrust.cottonTrustTitle[lang]}
                  onChange={(e) =>
                    setCottonTrust({
                      ...cottonTrust,
                      cottonTrustTitle: {
                        ...cottonTrust.cottonTrustTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block mt-3">Description</label>
                <Input
                  value={cottonTrust.cottonTrustDes[lang]}
                  onChange={(e) =>
                    setCottonTrust({
                      ...cottonTrust,
                      cottonTrustDes: {
                        ...cottonTrust.cottonTrustDes,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <Divider>Logos</Divider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Already saved images */}
            {cottonTrust.cottonTrustLogo.map((logo, idx) => (
              <div key={`saved-${idx}`} className="relative">
                <img
                  src={getFullUrl(logo)}
                  alt="trust"
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={async () => {
                    const newLogos = cottonTrust.cottonTrustLogo.filter(
                      (_, i) => i !== idx
                    );
                    const updated = {
                      ...cottonTrust,
                      cottonTrustLogo: newLogos,
                    };
                    setCottonTrust(updated);
                    await instantSave("cottonTrust", updated); // instantly update DB
                  }}
                >
                  X
                </Button>
              </div>
            ))}

            {/* Newly uploaded files (preview) */}
            {cottonTrust.cottonTrustLogoFiles.map((file, idx) => {
              if (!(file instanceof File)) return null; // ✅ ignore non-file values

              return (
                <div key={`new-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-trust"
                    className="w-full h-24 object-contain"
                  />
                  <Button
                    danger
                    size="small"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setCottonTrust({
                        ...cottonTrust,
                        cottonTrustLogoFiles:
                          cottonTrust.cottonTrustLogoFiles.filter(
                            (_, i) => i !== idx
                          ),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setCottonTrust({
                ...cottonTrust,
                cottonTrustLogoFiles: [
                  ...cottonTrust.cottonTrustLogoFiles,
                  ...Array.from(e.target.files),
                ],
              })
            }
          />

          <Divider>Trust Image</Divider>
          {cottonTrust.preview ? (
            <img
              src={cottonTrust.preview}
              alt="trust-preview"
              className="w-48 mb-2"
            />
          ) : cottonTrust.cottonTrustImg ? (
            <img
              src={getFullUrl(cottonTrust.cottonTrustImg)}
              alt="trust"
              className="w-48 mb-2"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setCottonTrust, "cottonTrustImg")
            }
          />

          <div className="flex justify-end mt-6 gap-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("cottonTrust", cottonTrust, [
                  "cottonTrustImgFile",
                  "cottonTrustLogoFiles",
                ])
              }
            >
              Save Trust
            </Button>
          </div>
        </Panel>

        {/* 5. Member */}
        <Panel
          header={
            <span className="flex items-center gap-2 font-semibold">
              <FiStar /> Member
            </span>
          }
          key="5"
        >
          <Tabs defaultActiveKey="en">
            {["en", "vi"].map((lang) => (
              <TabPane tab={lang.toUpperCase()} key={lang}>
                <label className="block">Title</label>
                <Input
                  value={cottonMember.cottonMemberTitle[lang]}
                  onChange={(e) =>
                    setCottonMember({
                      ...cottonMember,
                      cottonMemberTitle: {
                        ...cottonMember.cottonMemberTitle,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
                <label className="block mt-3">Button Text</label>
                <Input
                  value={cottonMember.cottonMemberButtonText[lang]}
                  onChange={(e) =>
                    setCottonMember({
                      ...cottonMember,
                      cottonMemberButtonText: {
                        ...cottonMember.cottonMemberButtonText,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </TabPane>
            ))}
          </Tabs>

          <label className="block mt-3">Button Link</label>
          <Input
            value={cottonMember.cottonMemberButtonLink}
            onChange={(e) =>
              setCottonMember({
                ...cottonMember,
                cottonMemberButtonLink: e.target.value,
              })
            }
          />

          <Divider>Member Images</Divider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Already saved images */}
            {cottonMember.cottonMemberImg.map((img, idx) => (
              <div key={`saved-${idx}`} className="relative">
                <img
                  src={getFullUrl(img)}
                  alt="member"
                  className="w-full h-24 object-contain"
                />
                <Button
                  danger
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={async () => {
                    const newImgs = cottonMember.cottonMemberImg.filter(
                      (_, i) => i !== idx
                    );
                    const updated = {
                      ...cottonMember,
                      cottonMemberImg: newImgs,
                    };
                    setCottonMember(updated);
                    await instantSave("cottonMember", updated); // instantly update DB
                  }}
                >
                  X
                </Button>
              </div>
            ))}

            {/* New uploads */}
            {cottonMember.cottonMemberImgFiles.map((file, idx) => {
              if (!(file instanceof File)) return null; // ✅ skip non-file

              return (
                <div key={`new-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new-member"
                    className="w-full h-24 object-contain"
                  />
                  <Button
                    danger
                    size="small"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setCottonMember({
                        ...cottonMember,
                        cottonMemberImgFiles:
                          cottonMember.cottonMemberImgFiles.filter(
                            (_, i) => i !== idx
                          ),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setCottonMember({
                ...cottonMember,
                cottonMemberImgFiles: [
                  ...cottonMember.cottonMemberImgFiles,
                  ...Array.from(e.target.files),
                ],
              })
            }
          />

          <div className="flex justify-end mt-6 gap-4">
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() =>
                handleSave("cottonMember", cottonMember, [
                  "cottonMemberImgFiles",
                ])
              }
            >
              Save Member
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default CottonPage;
