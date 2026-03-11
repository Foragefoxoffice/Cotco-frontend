import React, { useState, useEffect } from "react";
import { Alert, Button, Divider, Input, Modal } from "antd"; // ✅ Added Modal import
import { getFooterPage, updateFooterPage } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import { DeleteOutlined } from "@ant-design/icons";
import { RotateCw, X, Trash2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";


const API_BASE = import.meta.env.VITE_API_URL;

const FooterPage = () => {
  const [footerLogo, setFooterLogo] = useState("");
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerSocials, setFooterSocials] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false); // ✅ Added this
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [copyrights, setCopyrights] = useState("");
  const [footerLogoTitle, setFooterLogoTitle] = useState({
    en: "",
    vi: ""
  });


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
      if (data?.footerLogoTitle) {
        setFooterLogoTitle({
          en: data.footerLogoTitle.en || "",
          vi: data.footerLogoTitle.vi || ""
        });
      }

      if (data?.footerSocials) setFooterSocials(data.footerSocials);
      if (data?.copyrights) setCopyrights(data.copyrights);

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
    setFooterSocials([
      ...footerSocials,
      { iconImage: "", iconFile: null, link: "" },
    ]);
  };

  const handleIconUpload = (index, file) => {
    const updated = [...footerSocials];
    updated[index].iconFile = file;
    updated[index].iconImage = URL.createObjectURL(file); // preview
    setFooterSocials(updated);
  };



  // ✅ Remove a social icon and update backend
  const handleRemoveSocial = async (index) => {
    const updated = footerSocials.filter((_, i) => i !== index);
    setFooterSocials(updated);

    try {
      const formData = new FormData();
      formData.append("footerSocials", JSON.stringify(updated));
      if (footerLogoFile) formData.append("footerLogoFile", footerLogoFile);
      formData.append("copyrights", copyrights);
      formData.append("footerLogoTitle", JSON.stringify(footerLogoTitle));

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

    if (footerLogoFile) {
      formData.append("footerLogoFile", footerLogoFile);
    }

    footerSocials.forEach((item, i) => {
      if (item.iconFile) {
        formData.append(`iconFile_${i}`, item.iconFile);
      }
    });

    formData.append(
      "footerSocials",
      JSON.stringify(
        footerSocials.map(item => ({
          link: item.link,
          iconImage: item.iconFile ? null : item.iconImage
        }))
      )
    );

    formData.append("copyrights", copyrights);

    // ✅ FIX — THIS WAS MISSING
    formData.append("footerLogoTitle", JSON.stringify(footerLogoTitle));

    const res = await updateFooterPage(formData);
    const data = res.data?.footer || res.data;

    if (data) {
      setFooterLogo(data.footerLogo || "");
      setFooterSocials(data.footerSocials || []);
      setFooterLogoFile(null);

      CommonToaster(t.success, "success");
    }
  };



  return (
    <div className="mx-auto p-8 mt-8 rounded-xl bg-[#171717] text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">{t.title}</h2>

      {/* 🔤 Footer Logo Title (EN + VI) */}
      <div className="mt-6">
        <label className="block text-white text-lg font-semibold mb-3">
          {isVietnamese ? "Tiêu đề Logo Footer" : "Footer Logo Title"}
        </label>

        {/* English Title */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">
            English Title
          </label>

          <Input
            value={footerLogoTitle.en}
            onChange={(e) =>
              setFooterLogoTitle({ ...footerLogoTitle, en: e.target.value })
            }
            placeholder="Enter footer logo title (EN)..."
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "12px 14px",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>

        {/* Vietnamese Title */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Tiêu đề Tiếng Việt
          </label>

          <Input
            value={footerLogoTitle.vi}
            onChange={(e) =>
              setFooterLogoTitle({ ...footerLogoTitle, vi: e.target.value })
            }
            placeholder="Nhập tiêu đề logo (VI)..."
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "12px 14px",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>
      </div>


      {/* 🖼️ Footer Logo Upload (Same as HeaderPage style) */}
      <div className="mt-12">
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

      {footerSocials.map((social, index) => (
        <div key={index} className="flex items-center gap-4 mb-6">

          {/* ICON UPLOAD BOX */}
          <label className="w-16 h-16 rounded-lg bg-[#1F1F1F] border border-[#2E2F2F] flex items-center justify-center cursor-pointer hover:bg-[#2A2A2A] transition">
            {social.iconImage ? (
              <img
                src={social.iconImage.startsWith("blob:")
                  ? social.iconImage
                  : `${API_BASE}${social.iconImage}`
                }
                alt="social icon"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">
                Upload Icon
              </span>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleIconUpload(index, e.target.files[0])}
              className="hidden"
            />
          </label>

          {/* LINK INPUT */}
          <Input
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 14px",
              fontSize: "14px",
              width: "280px",
            }}
            placeholder={t.linkPlaceholder}
            value={social.link}
            onChange={(e) => handleSocialChange(index, "link", e.target.value)}
          />

          {/* DELETE BUTTON */}
          <Button
            size="small"
            style={{
              borderRadius: "999px",
              fontWeight: 500,
              background: "#E50000",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
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


      {/* 📄 Copyrights Content — Rich Text with ONLY Link Option */}
      <div className="mt-10">
        <label className="block text-white text-lg font-semibold mb-2">
          {isVietnamese ? "Nội dung bản quyền" : "Copyrights Content"}
        </label>

        <div className="rounded-lg overflow-hidden bg-[#262626]">
          <ReactQuill
            theme="snow"
            value={copyrights}
            onChange={setCopyrights}
            modules={{
              toolbar: [
                ["link"], // 👉 ONLY LINK BUTTON
              ],
            }}
            formats={["link"]} // 👉 ONLY ALLOW LINKS
            style={{
              backgroundColor: "#262626",
              color: "#fff",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
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
      <style>
        {
          `
          /* Fix ReactQuill link input alignment */
            .ql-tooltip {
              left: 0 !important;
              transform: translateX(0) !important;
            }

            /* Make tooltip visible in dark mode */
            .ql-tooltip {
              background: #2e2e2e !important;
              border: 1px solid #444 !important;
              color: #fff !important;
            }

            .ql-tooltip input[type="text"] {
              background: #1f1f1f !important;
              border: 1px solid #555 !important;
              color: #fff !important;
              padding: 6px 10px !important;
              border-radius: 6px !important;
            }

            .ql-tooltip a {
              color: #0ea5e9 !important;
            }
            .ql-editor {
    min-height: 250px;
  }

  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .ql-container.ql-snow {
    color: #fff;
  }

  .ant-collapse>.ant-collapse-item>.ant-collapse-header .ant-collapse-header-text {
    color:white;
    font-weight:600;
    font-size:16px;
  }

  /* ✅ Sticky Quill toolbar */
  .ql-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: 1px solid #333;
  }

  .ql-container {
    max-height: 350px;
    overflow-y: auto;
  }
    label {
          color: #fff !important;
        }
        .ant-tabs-nav::before{
          border-bottom:1px solid #2E2F2F !important;
        }
        .ant-collapse-header{
          padding:20px 0 !important;
        }
        .ant-modal-close{
          background-color:red !important;
          border-radius:50% !important;
          color:white !important;
        }
          `
        }
      </style>
    </div>
  );
};

export default FooterPage;
