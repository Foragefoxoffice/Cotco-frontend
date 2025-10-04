import React, { useState, useEffect } from "react";
import { Alert, Button, Divider, Input } from "antd";
import { getFooterPage, updateFooterPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";

const API_BASE = import.meta.env.VITE_API_URL;

const FooterPage = () => {
  const [footerLogo, setFooterLogo] = useState("");
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerSocials, setFooterSocials] = useState([]);

  useEffect(() => {
    getFooterPage().then((res) => {
      const data = res.data?.footer || res.data;
      if (data?.footerLogo) setFooterLogo(data.footerLogo);
      if (data?.footerSocials) setFooterSocials(data.footerSocials);
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxImageSize = 2 * 1024 * 1024; // 2MB
    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      return CommonToaster("Logo image must be less than 2MB", "error");
    }

    setFooterLogoFile(file);
  };

  const handleSocialChange = (index, field, value) => {
    const updated = [...footerSocials];
    updated[index][field] = value;
    setFooterSocials(updated);
  };

  const handleAddSocial = () => {
    setFooterSocials([...footerSocials, { icon: "facebook", link: "" }]);
  };

  const handleRemoveSocial = async (index) => {
    // 1. Update local state
    const updated = footerSocials.filter((_, i) => i !== index);
    setFooterSocials(updated);

    // 2. Save to DB immediately
    try {
      const formData = new FormData();
      formData.append("footerSocials", JSON.stringify(updated));

      // Keep logo path safe if no new file
      if (footerLogoFile) {
        formData.append("footerLogoFile", footerLogoFile);
      }

      const res = await updateFooterPage(formData);
      const data = res.data?.footer || res.data;

      if (data?.footerSocials) {
        setFooterSocials(data.footerSocials);
        CommonToaster("Social icon removed successfully", "success");
      }
    } catch (err) {
      CommonToaster("Failed to remove social icon", "error");
    }
  };


  const handleSave = async () => {
    const formData = new FormData();
    if (footerLogoFile) {
      formData.append("footerLogoFile", footerLogoFile);
    }
    formData.append("footerSocials", JSON.stringify(footerSocials));

    const res = await updateFooterPage(formData);
    const data = res.data?.footer || res.data;
    if (data?.footerLogo) {
      setFooterLogo(data.footerLogo);
      setFooterLogoFile(null);
      setFooterSocials(data.footerSocials);
      CommonToaster("Footer updated successfully", "success");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-white dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-center">Footer Management</h2>

      <Divider>Footer Logo</Divider>

      {footerLogoFile ? (
        <img
          src={URL.createObjectURL(footerLogoFile)}
          alt="Footer Logo"
          className="w-32 mb-4 rounded-lg"
        />
      ) : footerLogo ? (
        <img
          src={`${API_BASE}${footerLogo}`}
          alt="Footer Logo"
          className="w-32 mb-4 rounded-lg"
        />
      ) : null}

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <Divider>Social Icons</Divider>
      <Alert
        style={{ marginBottom: 20 }}
        type="info"
        showIcon
        banner
        closable
        message={
          <span>
            You can refer to the list of available icons at{" "}
            <a
              href="https://lucide.dev/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "500", textDecoration: "underline" }}
            >
              lucide.dev
            </a>
          </span>
        }
      />
      {footerSocials.map((social, index) => (
        <div key={index} className="flex gap-4 items-center mb-3">
          <Input
            placeholder="Lucide icon name (e.g. facebook, twitter, instagram)"
            value={social.icon}
            onChange={(e) =>
              handleSocialChange(index, "icon", e.target.value)
            }
          />
          <Input
            placeholder="https://link-to-social"
            value={social.link}
            onChange={(e) =>
              handleSocialChange(index, "link", e.target.value)
            }
          />
          <Button danger onClick={() => handleRemoveSocial(index)}>
            Remove
          </Button>
        </div>
      ))}

      <Button onClick={handleAddSocial} className="mb-4">
        Add Social Icon
      </Button>

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={() => window.location.reload()}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default FooterPage;
