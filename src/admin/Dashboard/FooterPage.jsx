import React, { useState, useEffect } from "react";
import { Alert, Button, Divider, Input, Modal } from "antd"; // ✅ Added Modal import
import { getFooterPage, updateFooterPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import { DeleteOutlined } from "@ant-design/icons";
import { RotateCw, X, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

const FooterPage = () => {
  const [footerLogo, setFooterLogo] = useState("");
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerSocials, setFooterSocials] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false); // ✅ Added this
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Detect global language (using vi-mode class)
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
    title: isVietnamese ? "Quản lý Footer" : "Footer Management",
    footerLogo: isVietnamese ? "Logo Footer" : "Footer Logo",
    upload: isVietnamese ? "Tải hình ảnh" : "Upload Image",
    addSocial: isVietnamese ? "Thêm Mạng Xã Hội" : "Add Social Icon",
    remove: isVietnamese ? "Xóa" : "Remove",
    cancel: isVietnamese ? "Hủy" : "Cancel",
    save: isVietnamese ? "Lưu" : "Save",
    socialsTitle: isVietnamese ? "Biểu tượng Mạng Xã Hội" : "Social Icons",
    iconPlaceholder: isVietnamese
      ? "Tên biểu tượng Lucide (vd: facebook, twitter...)"
      : "Lucide icon name (e.g. facebook, twitter, instagram)",
    linkPlaceholder: isVietnamese
      ? "https://liên-kết-mạng-xã-hội"
      : "https://link-to-social",
    info: isVietnamese
      ? "Bạn có thể xem danh sách các biểu tượng có sẵn tại"
      : "You can refer to the list of available icons at",
    success: isVietnamese
      ? "Cập nhật Footer thành công"
      : "Footer updated successfully",
    removeSuccess: isVietnamese
      ? "Xóa biểu tượng mạng xã hội thành công"
      : "Social icon removed successfully",
    removeFail: isVietnamese
      ? "Không thể xóa biểu tượng mạng xã hội"
      : "Failed to remove social icon",
    fileError: isVietnamese
      ? "Ảnh logo phải nhỏ hơn 2MB"
      : "Logo image must be less than 2MB",
  };

  // ✅ Fetch footer data
  useEffect(() => {
    getFooterPage().then((res) => {
      const data = res.data?.footer || res.data;
      if (data?.footerLogo) setFooterLogo(data.footerLogo);
      if (data?.footerSocials) setFooterSocials(data.footerSocials);
    });
  }, []);

  // ✅ Handle logo file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxImageSize = 2 * 1024 * 1024; // 2MB
    if (file.type.startsWith("image/") && file.size > maxImageSize) {
      return CommonToaster(t.fileError, "error");
    }

    setFooterLogoFile(file);
  };

  // ✅ Handle social input change
  const handleSocialChange = (index, field, value) => {
    const updated = [...footerSocials];
    updated[index][field] = value;
    setFooterSocials(updated);
  };

  // ✅ Add new social item
  const handleAddSocial = () => {
    setFooterSocials([...footerSocials, { icon: "facebook", link: "" }]);
  };

  // ✅ Remove a social icon and update backend
  const handleRemoveSocial = async (index) => {
    const updated = footerSocials.filter((_, i) => i !== index);
    setFooterSocials(updated);

    try {
      const formData = new FormData();
      formData.append("footerSocials", JSON.stringify(updated));
      if (footerLogoFile) formData.append("footerLogoFile", footerLogoFile);

      const res = await updateFooterPage(formData);
      const data = res.data?.footer || res.data;
      if (data?.footerSocials) {
        setFooterSocials(data.footerSocials);
        CommonToaster(t.removeSuccess, "success");
      }
    } catch {
      CommonToaster(t.removeFail, "error");
    }
  };

  // ✅ Save changes
  const handleSave = async () => {
    const formData = new FormData();
    if (footerLogoFile) formData.append("footerLogoFile", footerLogoFile);
    formData.append("footerSocials", JSON.stringify(footerSocials));

    const res = await updateFooterPage(formData);
    const data = res.data?.footer || res.data;
    if (data?.footerLogo) {
      setFooterLogo(data.footerLogo);
      setFooterLogoFile(null);
      setFooterSocials(data.footerSocials);
      CommonToaster(t.success, "success");
    }
  };

  return (
    <div className="mx-auto p-8 mt-8 rounded-xl bg-[#171717] text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">{t.title}</h2>

      {/* 🖼️ Footer Logo Upload (Same as HeaderPage style) */}
      <div>
        <label className="block text-white text-lg font-semibold mb-2">
          {t.footerLogo} <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-4 mt-2">
          {!footerLogoFile && !footerLogo ? (
            <label
              htmlFor="footer-logo-upload"
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
              <span className="mt-2 text-sm text-gray-400">{t.upload}</span>
              <input
                id="footer-logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div className="relative w-32 h-32 group">
              <img
                src={
                  footerLogoFile
                    ? URL.createObjectURL(footerLogoFile)
                    : `${API_BASE}${footerLogo}`
                }
                alt="Footer Logo Preview"
                className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
              />

              {/* 👁 View Full */}
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title={
                  t.viewFull ||
                  (isVietnamese ? "Xem hình đầy đủ" : "View full image")
                }
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
                htmlFor="change-footer-logo"
                className="absolute bottom-1 right-1 bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110"
                title={
                  t.changeImage ||
                  (isVietnamese ? "Thay đổi hình" : "Change Image")
                }
              >
                <input
                  id="change-footer-logo"
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
                  setFooterLogoFile(null);
                  setFooterLogo("");
                }}
                className="absolute top-1 right-1 cursor-pointer bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                title={t.remove || (isVietnamese ? "Xóa hình" : "Remove Image")}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 🖼 Modal (Full View) */}
        <Modal
          open={showImageModal}
          footer={null}
          onCancel={() => setShowImageModal(false)}
          centered
          width={400}
          bodyStyle={{ background: "#000", padding: "0" }}
        >
          <img
            src={
              footerLogoFile
                ? URL.createObjectURL(footerLogoFile)
                : `${API_BASE}${footerLogo}`
            }
            alt="Full Footer Logo"
            className="w-full h-auto rounded-lg"
          />
        </Modal>
      </div>

      <h3 className="text-white !mt-12">{t.socialsTitle}</h3>

      <Alert
        style={{ marginBottom: 20 }}
        type="info"
        showIcon
        banner
        closable
        message={
          <span className="text-white">
            {t.info}{" "}
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
            }}
            placeholder={t.iconPlaceholder}
            value={social.icon}
            onChange={(e) => handleSocialChange(index, "icon", e.target.value)}
          />
          <Input
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 14px",
              fontSize: "14px",
            }}
            placeholder={t.linkPlaceholder}
            value={social.link}
            onChange={(e) => handleSocialChange(index, "link", e.target.value)}
          />
          <Button
            size="small"
            icon={
              <Trash2
                size={14} // 👈 smaller icon size
                strokeWidth={2} // slightly thinner for balance
                className="align-middle" // keeps it centered with text
              />
            }
            style={{
              borderRadius: "999px",
              fontWeight: 500,
              background: "#E50000",
              color: "#fff",
              border: "none",
              padding: "10px 18px", // 👈 slightly smaller padding to match icon
              height: "auto",
              display: "flex",
              alignItems: "center",
              gap: "6px", // 👈 small space between icon and text
            }}
            onClick={() => handleRemoveSocial(index)}
          >
            {t.remove}
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
        {t.addSocial}
      </Button>

      <div className="flex justify-end gap-4 mt-6">
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

export default FooterPage;
