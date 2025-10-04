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
    <div className="max-w-3xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-white dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-center">Header Management</h2>

      <Divider>Header Logo</Divider>

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

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={() => window.location.reload()}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default HeaderPage;
