import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { createMachineCategory } from "../../Api/api";
import { CommonToaster } from "../../Common/CommonToaster";
import TranslationTabs from "../TranslationTabs";
import { ReloadOutlined } from "@ant-design/icons";
import { Eye, X } from "lucide-react";

const MachineCategoryCreate = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [fileList, setFileList] = useState([]);
  const [iconList, setIconList] = useState([]);
  const [showMainImageModal, setShowMainImageModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);

  // 🌍 Language map
  const textMap = {
    en: {
      nameLabel: "Name (English)",
      namePlaceholder: "Enter category name",
      descLabel: "Description (English)",
      descPlaceholder: "Enter description",
      slugLabel: "Slug",
      slugPlaceholder: "Unique slug (e.g. weaving)",
      uploadImage: "Upload Image",
      uploadIcon: "Upload Icon",
      upload: "Upload",
      submitText: "Create Machine Category",
    },
    vi: {
      nameLabel: "Tên (Tiếng Việt)",
      namePlaceholder: "Nhập tên danh mục",
      descLabel: "Mô tả (Tiếng Việt)",
      descPlaceholder: "Nhập mô tả",
      slugLabel: "Đường dẫn (Slug)",
      slugPlaceholder: "Slug duy nhất (ví dụ: weaving)",
      uploadImage: "Tải lên hình ảnh",
      uploadIcon: "Tải lên biểu tượng",
      upload: "Tải Lên",
      submitText: "Tạo Danh Mục Máy",
    },
  };

  const labelStyle = { color: "#ccc", fontWeight: 500 };
  const darkInputStyle = {
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
  };

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

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }
      if (iconList.length > 0 && iconList[0].originFileObj) {
        formData.append("icon", iconList[0].originFileObj);
      }

      await createMachineCategory(formData);
      CommonToaster("✅ Machine category created successfully", "success");
      form.resetFields();
      setFileList([]);
      setIconList([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      CommonToaster(
        error.response?.data?.error || "❌ Failed to create category",
        "error"
      );
    } finally {
      setLoading(false);
    }
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
      <style>
        {
          `
          .ant-modal-close{
          background-color:red !important;
          border-radius:50% !important;
          color:white !important;
        }
          `
        }
      </style>
      <div className="mt-4 mb-4">
        <TranslationTabs
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
        />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Name */}
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

        {/* Description */}
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

        {/* Slug */}
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

        {/* Upload Image */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {textMap[activeLanguage].uploadImage}
            <span className="text-red-500 text-lg">*</span>
          </label>

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
            {fileList.length === 0 ? (
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
                  {textMap[activeLanguage].upload}
                </span>
              </label>
            ) : (
              <div className="relative w-32 h-32 group">
                <img
                  src={fileList[0].url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                />

                <button
                  type="button"
                  onClick={() => setShowMainImageModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Eye size={15} />
                </button>

                <label
                  htmlFor="main-image-upload"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <ReloadOutlined />
                </label>

                <button
                  type="button"
                  onClick={() => setFileList([])}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                >
                  <X size={15}/>
                </button>
              </div>
            )}
          </div>

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
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 !text-white rounded-full p-2 shadow-lg transition cursor-pointer"
                >
                  <X size={15}/>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Icon */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {textMap[activeLanguage].uploadIcon}
            <span className="text-red-500 text-lg">*</span>
          </label>

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
            {iconList.length === 0 ? (
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
                  {textMap[activeLanguage].upload}
                </span>
              </label>
            ) : (
              <div className="relative w-32 h-32 group">
                <img
                  src={iconList[0].url}
                  alt="Icon Preview"
                  className="w-full h-full object-contain rounded-lg border border-[#2E2F2F] p-2 bg-[#1F1F1F]"
                />

                <button
                  type="button"
                  onClick={() => setShowIconModal(true)}
                  className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Eye size={15}/>
                </button>

                <label
                  htmlFor="icon-upload"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <ReloadOutlined size={15} />
                </label>

                <button
                  type="button"
                  onClick={() => setIconList([])}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
                >
                  <X size={15}/>
                </button>
              </div>
            )}
          </div>

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
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 !text-white rounded-full p-2 shadow-lg transition cursor-pointer"
                >
                  <X size={15}/>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
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

export default MachineCategoryCreate;
