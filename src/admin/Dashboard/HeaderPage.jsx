import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { X } from "lucide-react";
import { getHeaderPage, updateHeaderPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import { RotateCw } from "lucide-react"; // 👈 Add this at top with other imports

const API_BASE = import.meta.env.VITE_API_URL;

const HeaderPage = () => {
  const [headerLogo, setHeaderLogo] = useState("");
  const [headerLogoFile, setHeaderLogoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Detect global language mode
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Translations
  const t = {
    title: isVietnamese ? "Quản lý Header" : "Header Management",
    logoLabel: isVietnamese ? "Logo Header" : "Header Logo",
    uploadText: isVietnamese ? "Tải lên hình ảnh" : "Upload Image",
    changeImage: isVietnamese ? "Thay đổi hình ảnh" : "Change Image",
    viewFull: isVietnamese ? "Xem toàn màn hình" : "View Full",
    remove: isVietnamese ? "Xóa ảnh" : "Remove Image",
    cancel: isVietnamese ? "Hủy" : "Cancel",
    save: isVietnamese ? "Lưu" : "Save",
    success: isVietnamese
      ? "Cập nhật Header thành công"
      : "Header updated successfully",
    fileSizeError: isVietnamese
      ? "Ảnh logo phải nhỏ hơn 2MB"
      : "Logo image must be less than 2MB",
  };

  // ✅ Fetch header data
  useEffect(() => {
    getHeaderPage().then((res) => {
      const data = res.data?.header || res.data;
      if (data?.headerLogo) {
        const imageUrl = `${API_BASE}${data.headerLogo}`;
        setHeaderLogo(imageUrl);
        setPreview(imageUrl);
      }
    });
  }, []);

  // ✅ Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxImageSize = 2 * 1024 * 1024; // 2MB
    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      return CommonToaster(t.fileSizeError, "error");
    }

    setHeaderLogoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Handle save
  const handleSave = async () => {
    const formData = new FormData();
    if (headerLogoFile) formData.append("headerLogoFile", headerLogoFile);

    const res = await updateHeaderPage(formData);
    const data = res.data?.header || res.data;
    if (data?.headerLogo) {
      const imageUrl = `${API_BASE}${data.headerLogo}`;
      setHeaderLogo(imageUrl);
      setPreview(imageUrl);
      setHeaderLogoFile(null);
      CommonToaster(t.success, "success");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#171717] rounded-2xl text-white">
      <style>
        {`
            .ant-modal-close{
              background-color:red !important;
              border-radius:50% !important;
              color:white !important;
            }
          `}
      </style>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-400">
            {isVietnamese
              ? "Quản lý logo của phần đầu trang web"
              : "Manage your website header logo"}
          </p>
        </div>
      </div>

      {/* 🖼️ Header Logo Upload Section */}
      <div>
        <label className="block text-white text-lg font-semibold mb-2">
          {t.logoLabel} <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-4 mt-2">
          {!preview && (
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="mt-2 text-sm text-gray-400">{t.uploadText}</span>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          )}

          {preview && (
            <div className="relative w-32 h-32 group">
              <img
                src={preview}
                alt="Header Logo Preview"
                className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
              />

              {/* 👁 View Full */}
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title={t.viewFull}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              {/* 🔁 Change Image */}
              <label
                htmlFor="change-logo-upload"
                className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                title={t.changeImage}
              >
                <input
                  id="change-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <RotateCw className="w-4 h-4" />
              </label>

              {/* ❌ Remove */}
              <button
                type="button"
                onClick={() => {
                  setHeaderLogoFile(null);
                  setPreview("");
                  setHeaderLogo("");
                }}
                className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                title={t.remove}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal (Full View) */}
      <Modal
        open={showImageModal}
        footer={null}
        onCancel={() => setShowImageModal(false)}
        centered
        width={400}
        bodyStyle={{ background: "#000", padding: "0" }}
      >
        <img
          src={preview}
          alt="Full Header Logo"
          className="w-full h-auto rounded-lg"
        />
      </Modal>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          onClick={() => window.location.reload()}
          style={{
            borderRadius: "9999px",
            padding: "22px 30px",
            backgroundColor: "#2d2d2d",
            color: "#fff",
            fontWeight: "500",
            border: "none",
          }}
        >
          {t.cancel}
        </Button>

        <Button
          type="primary"
          onClick={handleSave}
          style={{
            borderRadius: "9999px",
            padding: "22px 30px",
            backgroundColor: "#0284C7",
            color: "#fff",
            fontWeight: "600",
            border: "none",
          }}
        >
          {t.save}
        </Button>
      </div>
    </div>
  );
};

export default HeaderPage;
