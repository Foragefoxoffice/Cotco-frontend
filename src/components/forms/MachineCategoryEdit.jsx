import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateMachineCategory } from "../../Api/api";
import TranslationTabs from "../TranslationTabs";
import { CommonToaster } from "../../Common/CommonToaster";
import { ReloadOutlined } from "@ant-design/icons";

const MachineCategoryEdit = ({ category, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [fileList, setFileList] = useState([]);
  const [iconList, setIconList] = useState([]);
  const [showMainImageModal, setShowMainImageModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);

  const iconLabelClasses = "block text-gray-300 text-sm font-medium mb-2";

  const iconLabels = {
    en: { uploadIcon: "Upload Icon", upload: "Upload" },
    vi: { uploadIcon: "Tải Biểu Tượng Lên", upload: "Tải Lên" },
  };

  const labelClasses = "block text-gray-300 text-sm font-medium mb-2";
  const labels = {
    en: { uploadImage: "Upload Image", upload: "Upload" },
    vi: { uploadImage: "Tải Ảnh Lên", upload: "Tải Lên" },
  };

  // ✅ Preload form + image/icon when editing
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name_en: category.name?.en || "",
        name_vi: category.name?.vi || "",
        description_en: category.description?.en || "",
        description_vi: category.description?.vi || "",
        slug: category.slug || "",
      });

      if (category.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: `${category.image}`,
          },
        ]);
      }
      if (category.icon) {
        setIconList([
          {
            uid: "-2",
            name: "icon.png",
            status: "done",
            url: `${category.icon}`,
          },
        ]);
      }
    }
  }, [category, form]);

  // ✅ Handle update
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      const name = { en: values.name_en || "", vi: values.name_vi || "" };
      const description = {
        en: values.description_en || "",
        vi: values.description_vi || "",
      };

      formData.append("name", JSON.stringify(name));
      formData.append("description", JSON.stringify(description));
      formData.append("slug", values.slug);

      // ✅ Only append new uploads
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }
      if (iconList.length > 0 && iconList[0].originFileObj) {
        formData.append("icon", iconList[0].originFileObj);
      }

      await updateMachineCategory(category._id, formData);
      CommonToaster("Machine category updated successfully ✅", "success");

      if (onSuccess) onSuccess();
    } catch (error) {
      CommonToaster(error.response?.data?.error || "Update failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Styling
  const darkInputStyle = {
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  const labelStyle = { color: "#ccc", fontWeight: 500 };

  // Add this map near the top of your component (after useState declarations)
  const textMap = {
    en: {
      nameLabel: "Name (English)",
      namePlaceholder: "Enter category name",
      descLabel: "Description",
      descPlaceholder: "Enter description (EN)",
      slugLabel: "Slug",
      slugPlaceholder: "Unique slug (e.g. spinning)",
      uploadImage: "Upload Image",
      uploadIcon: "Upload Icon",
      submitText: "Update Machine Category",
    },
    vi: {
      nameLabel: "Tên (Tiếng Việt)",
      namePlaceholder: "Nhập tên danh mục (VN)",
      descLabel: "Mô tả (Tiếng Việt)",
      descPlaceholder: "Nhập mô tả (VN)",
      slugLabel: "Đường dẫn (Slug)",
      slugPlaceholder: "Slug duy nhất (ví dụ: spinning)",
      uploadImage: "Tải lên hình ảnh",
      uploadIcon: "Tải lên biểu tượng",
      submitText: "Cập nhật danh mục máy",
    },
  };

  return (
    <div
      style={{
        backgroundColor: "#171717",
        borderRadius: "12px",
        padding: "4px",
        color: "white",
      }}
    >
      <style>{`
        .ant-modal .ant-modal-close-x {
          color: #fff;
        }
         
          .ant-modal-close{
          background-color:red !important;
          border-radius:50% !important;
          color:white !important;
        }
      `}</style>

      {/* 🌐 Language Switch */}
      <div className="mt-4 mb-4">
        <TranslationTabs
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
        />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Name Field */}
        <Form.Item
          name={`name_${activeLanguage}`}
          label={
            <span style={labelStyle}>{textMap[activeLanguage].nameLabel}</span>
          }
          rules={[
            {
              required: true,
              message: `Please enter ${
                activeLanguage === "en" ? "English" : "Vietnamese"
              } name`,
            },
          ]}
        >
          <Input
            placeholder={textMap[activeLanguage].namePlaceholder}
            style={darkInputStyle}
            className="!placeholder-gray-400"
          />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          name={`description_${activeLanguage}`}
          label={
            <span style={labelStyle}>{textMap[activeLanguage].descLabel}</span>
          }
        >
          <Input.TextArea
            rows={3}
            placeholder={textMap[activeLanguage].descPlaceholder}
            style={{ ...darkInputStyle, resize: "none" }}
            className="!placeholder-gray-400"
          />
        </Form.Item>

        {/* Common Slug Field */}
        <Form.Item
          name="slug"
          label={
            <span style={labelStyle}>{textMap[activeLanguage].slugLabel}</span>
          }
          rules={[{ required: true, message: "Please enter slug" }]}
        >
          <Input
            placeholder={textMap[activeLanguage].slugPlaceholder}
            style={darkInputStyle}
            className="!placeholder-gray-400"
          />
        </Form.Item>

        {/* 🖼 Upload Image (with Preview + Replace/Delete/View) */}
        <div className="mb-5">
          <label className={labelClasses}>
            {labels[activeLanguage].uploadImage}
            <span className="text-red-500 text-lg">*</span>
          </label>

          {/* Hidden file input */}
          <input
            id="main-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setFileList([{ originFileObj: file, url }]);
              }
            }}
            style={{ display: "none" }}
          />

          <div className="flex flex-wrap gap-4 mt-2">
            {/* Upload Placeholder */}
            {fileList.length === 0 && (
              <label
                htmlFor="main-image-upload"
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
                <span className="mt-2 text-sm text-gray-400">
                  {labels[activeLanguage].upload}
                </span>
              </label>
            )}

            {/* Image Preview */}
            {fileList.length > 0 && fileList[0].url && (
              <div className="relative w-32 h-32 group">
                <img
                  src={fileList[0].url}
                  alt="Image Preview"
                  className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                />

                {/* View (Eye) Icon */}
                <button
                  type="button"
                  onClick={() => setShowMainImageModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title={
                    activeLanguage === "vi"
                      ? "Xem hình ảnh đầy đủ"
                      : "View full image"
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

                {/* Replace (Upload Again) Icon */}
                <label
                  htmlFor="main-image-upload"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={
                    activeLanguage === "vi" ? "Tải ảnh khác" : "Replace image"
                  }
                >
                  <ReloadOutlined size={10} />
                </label>

                {/* Delete (X) Icon */}
                <button
                  type="button"
                  onClick={() => setFileList([])}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition"
                  title={activeLanguage === "vi" ? "Xóa ảnh" : "Remove image"}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Preview Modal */}
          {showMainImageModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative max-w-3xl max-h-[90vh] w-auto">
                <img
                  src={fileList[0]?.url}
                  alt="Full Preview"
                  className="max-h-[85vh] w-auto rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowMainImageModal(false)}
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition"
                  title={activeLanguage === "vi" ? "Đóng" : "Close"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🧩 Upload Icon (with Preview + Replace/Delete/View) */}
        <div className="mb-5">
          <label className={iconLabelClasses}>
            {iconLabels[activeLanguage].uploadIcon}
            <span className="text-red-500 text-lg">*</span>
          </label>

          {/* Hidden file input */}
          <input
            id="icon-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setIconList([{ originFileObj: file, url }]);
              }
            }}
            style={{ display: "none" }}
          />

          <div className="flex flex-wrap gap-4 mt-2">
            {/* Upload Placeholder */}
            {iconList.length === 0 && (
              <label
                htmlFor="icon-upload"
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
                <span className="mt-2 text-sm text-gray-400">
                  {iconLabels[activeLanguage].upload}
                </span>
              </label>
            )}

            {/* Icon Preview */}
            {iconList.length > 0 && iconList[0].url && (
              <div className="relative w-28 h-28 group">
                <img
                  src={iconList[0].url}
                  alt="Icon Preview"
                  className="w-full h-full object-contain rounded-lg border border-[#2E2F2F] p-2 bg-[#1F1F1F]"
                />

                {/* View (Eye) Icon */}
                <button
                  type="button"
                  onClick={() => setShowIconModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title={
                    activeLanguage === "vi"
                      ? "Xem biểu tượng đầy đủ"
                      : "View full icon"
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

                {/* Replace (Upload Again) Icon */}
                <label
                  htmlFor="icon-upload"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={
                    activeLanguage === "vi"
                      ? "Tải biểu tượng khác"
                      : "Replace icon"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4 20v-5h.581m15.357-2a8.003 8.003 0 01-15.357 2"
                    />
                  </svg>
                </label>

                {/* Delete (X) Icon */}
                <button
                  type="button"
                  onClick={() => setIconList([])}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition"
                  title={
                    activeLanguage === "vi" ? "Xóa biểu tượng" : "Remove icon"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Preview Modal */}
          {showIconModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative max-w-md max-h-[80vh] w-auto">
                <img
                  src={iconList[0]?.url}
                  alt="Full Icon Preview"
                  className="max-h-[70vh] w-auto rounded-lg shadow-lg bg-[#1F1F1F] p-4"
                />
                <button
                  type="button"
                  onClick={() => setShowIconModal(false)}
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition"
                  title={activeLanguage === "vi" ? "Đóng" : "Close"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            block
            style={{
              backgroundColor: "#0085C8",
              border: "none",
              borderRadius: "2rem",
              color: "#fff",
              fontWeight: "500",
              padding: "22px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#009FE3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#0085C8")
            }
          >
            {textMap[activeLanguage].submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineCategoryEdit;
