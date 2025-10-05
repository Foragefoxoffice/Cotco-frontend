import React, { useState, useEffect } from "react";
import { Button, Divider } from "antd";
import { getHeaderPage, updateHeaderPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";

const API_BASE = import.meta.env.VITE_API_URL;

const HeaderPage = () => {
  const [headerLogo, setHeaderLogo] = useState("");
  const [headerLogoFile, setHeaderLogoFile] = useState(null);

  useEffect(() => {
    getHeaderPage().then((res) => {
      const data = res.data?.header || res.data;
      if (data?.headerLogo) setHeaderLogo(data.headerLogo);
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxImageSize = 2 * 1024 * 1024; // 2MB
    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      return CommonToaster("Logo image must be less than 2MB", "error");
    }

    setHeaderLogoFile(file);
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (headerLogoFile) {
      formData.append("headerLogoFile", headerLogoFile);
    }

    const res = await updateHeaderPage(formData);
    const data = res.data?.header || res.data;
    if (data?.headerLogo) {
      setHeaderLogo(data.headerLogo);
      setHeaderLogoFile(null);
      CommonToaster("Header updated successfully", "success");
    }
  };

  return (
    <div className="mx-auto p-8 mt-8 rounded-xl bg-[#171717]">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Header Management</h2>

      <h3 className="text-white">Header Logo</h3>

      {headerLogoFile ? (
        <img
          src={URL.createObjectURL(headerLogoFile)}
          alt="Header Logo"
          className="w-32 mb-4 rounded-lg"
        />
      ) : headerLogo ? (
        <img
          src={`${API_BASE}${headerLogo}`}
          alt="Header Logo"
          className="w-32 mb-4 rounded-lg"
        />
      ) : null}

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 20px",
          backgroundColor: "#0284C7", // blue pill
          color: "#fff",
          fontWeight: "600",
          borderRadius: "9999px", // pill shape
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
      >
        {/* SVG Upload Icon */}
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
          style={{ display: "none" }} // hides default input
        />
      </label>

      <div className="flex justify-end gap-4 mt-6">
        {/* Cancel → styled like dark pill */}
        <Button
          onClick={() => window.location.reload()}
          style={{
            borderRadius: "9999px", // pill shape
            padding: "22px 24px",
            backgroundColor: "#2d2d2d", // dark gray
            color: "#fff",
            fontWeight: "500",
            border: "none",
          }}
        >
          Cancel
        </Button>

        {/* Save → styled like blue pill */}
        <Button
          type="primary"
          onClick={handleSave}
          style={{
            borderRadius: "9999px", // pill shape
            padding: "22px 24px",
            backgroundColor: "#0284C7", // bright blue
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

export default HeaderPage;
