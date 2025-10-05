import React, { useState, useEffect } from "react";
import { Alert, Button, Divider, Input } from "antd";
import { getFooterPage, updateFooterPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import { DeleteOutlined } from "@ant-design/icons";

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
    const updated = footerSocials.filter((_, i) => i !== index);
    setFooterSocials(updated);

    try {
      const formData = new FormData();
      formData.append("footerSocials", JSON.stringify(updated));
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
    <div className="mx-auto p-8 mt-8 rounded-xl bg-[#171717]">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Footer Management
      </h2>

      <h3 className="text-white">Footer Logo</h3>

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

      {/* Styled Upload Button */}
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 20px",
          backgroundColor: "#0284C7",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "9999px",
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          style={{ width: "18px", height: "18px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      <Divider className="text-white">Social Icons</Divider>

      <Alert
        style={{ marginBottom: 20 }}
        type="info"
        showIcon
        banner
        closable
        message={
          <span className="text-white">
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
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 14px",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            placeholder="Lucide icon name (e.g. facebook, twitter, instagram)"
            value={social.icon}
            onChange={(e) => handleSocialChange(index, "icon", e.target.value)}
            className="custom-dark-input"
          />
          <Input
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 14px",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            placeholder="https://link-to-social"
            value={social.link}
            onChange={(e) => handleSocialChange(index, "link", e.target.value)}
            className="custom-dark-input"
          />
          <Button
            size="small"
            icon={<DeleteOutlined />}
            style={{
              borderRadius: "999px", // full pill
              fontWeight: 500,
              background: "#E50000", // red background
              color: "#fff", // white text
              border: "none",
              padding: "12px 20px",
              height: "auto",
            }}
            onClick={() => handleRemoveSocial(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        onClick={handleAddSocial}
        className="mb-4"
        style={{
          borderRadius: "9999px",
          padding: "22px",
          backgroundColor: "#0284C7",
          color: "#fff",
          fontWeight: "600",
          border: "none",
        }}
      >
        Add Social Icon
      </Button>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={() => window.location.reload()}
          style={{
            borderRadius: "9999px",
            padding: "22px 24px",
            backgroundColor: "#2d2d2d",
            color: "#fff",
            fontWeight: "500",
            border: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          style={{
            borderRadius: "9999px",
            padding: "22px 24px",
            backgroundColor: "#0284C7",
            color: "#fff",
            fontWeight: "600",
            border: "none",
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default FooterPage;
