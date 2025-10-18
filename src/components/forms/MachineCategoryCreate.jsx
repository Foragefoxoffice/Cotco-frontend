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

  // Image states
  const [fileList, setFileList] = useState([]);
  const [iconList, setIconList] = useState([]);
  const [bgFileList, setBgFileList] = useState([]);

  // Modal states
  const [showMainImageModal, setShowMainImageModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showBgModal, setShowBgModal] = useState(false);

  // Translations
  const textMap = {
    en: {
      nameLabel: "Name (English)",
      descLabel: "Description (English)",
      slugLabel: "Slug",
      titleLabel: "Category Title (English)",
      desLabel: "Category Description (English)",
      descPlaceholder: "Enter description",
      uploadBg: "Upload Background Image",
      uploadImage: "Upload Main Image",
      uploadIcon: "Upload Icon",
      upload: "Upload",
      submitText: "Create Machine Category",
    },
    vi: {
      nameLabel: "Tên (Tiếng Việt)",
      descLabel: "Mô tả (Tiếng Việt)",
      slugLabel: "Đường dẫn (Slug)",
      titleLabel: "Tiêu đề danh mục (Tiếng Việt)",
      desLabel: "Mô tả danh mục (Tiếng Việt)",
      uploadBg: "Tải lên hình nền",
      uploadImage: "Tải lên hình ảnh chính",
      descPlaceholder: "Nhập mô tả",
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

  const generateSlug = (text) =>
    text
      .toString()
      .normalize("NFD") // handle Vietnamese & accents
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace spaces & symbols with "-"
      .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens


  // 🧩 Submit Handler (Fixed)
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      const name = {
        en: form.getFieldValue("name_en") || "",
        vi: form.getFieldValue("name_vi") || "",
      };
      const description = {
        en: form.getFieldValue("description_en") || "",
        vi: form.getFieldValue("description_vi") || "",
      };
      const createMachineCatTitle = {
        en: form.getFieldValue("createMachineCatTitle_en") || "",
        vi: form.getFieldValue("createMachineCatTitle_vi") || "",
      };
      const createMachineCatDes = {
        en: form.getFieldValue("createMachineCatDes_en") || "",
        vi: form.getFieldValue("createMachineCatDes_vi") || "",
      };

      formData.append("name", JSON.stringify(name));
      formData.append("description", JSON.stringify(description));
      formData.append("slug", values.slug);
      formData.append("createMachineCatTitle", JSON.stringify(createMachineCatTitle));
      formData.append("createMachineCatDes", JSON.stringify(createMachineCatDes));

      if (fileList[0]?.originFileObj)
        formData.append("image", fileList[0].originFileObj);

      if (iconList[0]?.originFileObj)
        formData.append("icon", iconList[0].originFileObj);

      if (bgFileList[0]?.originFileObj)
        formData.append("createMachineCatBgImage", bgFileList[0].originFileObj);

      // ✅ ACTUAL API CALL
      const res = await createMachineCategory(formData);
      console.log("Created category:", res.data.data);

      if (res.data.success) {
        CommonToaster("✅ Machine category created successfully", "success");
        form.resetFields();
        setFileList([]);
        setIconList([]);
        setBgFileList([]);
        if (onSuccess) onSuccess();
      } else {
        CommonToaster("❌ Failed to create category", "error");
      }
    } catch (error) {
      console.error("Create category error:", error);
      CommonToaster(
        error.response?.data?.error || "❌ Failed to create category",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  // 🖼️ Reusable Image Upload Block
  const ImageUpload = ({ label, state, setState, modalState, setModalState, inputId }) => (
    <div className="mb-5">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label} <span className="text-red-500 text-lg">*</span>
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setState([{ originFileObj: file, url }]);
          }
        }}
        style={{ display: "none" }}
      />

      <div className="flex flex-wrap gap-4 mt-2">
        {state.length === 0 ? (
          <label
            htmlFor={inputId}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="mt-2 text-sm text-gray-400">Upload</span>
          </label>
        ) : (
          <div className="relative w-32 h-32 group">
            <img
              src={state[0].url}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
            />

            <button
              type="button"
              onClick={() => setModalState(true)}
              className="absolute bottom-1 left-1 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <Eye size={15} />
            </button>

            <label
              htmlFor={inputId}
              className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <ReloadOutlined />
            </label>

            <button
              type="button"
              onClick={() => setState([])}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {modalState && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-3xl max-h-[90vh] w-auto">
            <img
              src={state[0]?.url}
              alt="Full Preview"
              className="max-h-[85vh] w-auto rounded-lg shadow-lg"
            />
            <button
              type="button"
              onClick={() => setModalState(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 !text-white rounded-full p-2 shadow-lg transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#171717",
        borderRadius: "12px",
        padding: "4px",
        color: "white",
      }}
    >
      <div className="mt-4 mb-4">
        <TranslationTabs
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changedValues) => {
          if (changedValues.name_en) {
            const newSlug = generateSlug(changedValues.name_en);
            form.setFieldsValue({ slug: newSlug });
          }
        }}
      >
        {/* Name */}
        <Form.Item
          name={`name_${activeLanguage}`}
          label={<span style={labelStyle}>{textMap[activeLanguage].nameLabel}</span>}
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input
            className="!placeholder-gray-400"
            placeholder={textMap[activeLanguage].nameLabel}
            style={darkInputStyle}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name={`description_${activeLanguage}`}
          label={<span style={labelStyle}>{textMap[activeLanguage].descLabel}</span>}
        >
          <Input.TextArea placeholder={textMap[activeLanguage].descPlaceholder} className="!placeholder-gray-400" rows={3} style={{ ...darkInputStyle, resize: "none" }} />
        </Form.Item>

        {/* Slug */}
        <Form.Item
          name="slug"
          label={<span style={labelStyle}>{textMap[activeLanguage].slugLabel}</span>}
          rules={[{ required: true, message: "Please enter slug" }]}
        >
          <Input
            className="!placeholder-gray-400"
            placeholder="Unique slug"
            style={darkInputStyle}
            readOnly // 🟢 prevents editing
          />
        </Form.Item>

        {/* Category Title */}
        <Form.Item
          name={`createMachineCatTitle_${activeLanguage}`}
          label={<span style={labelStyle}>{textMap[activeLanguage].titleLabel}</span>}
        >
          <Input className="!placeholder-gray-400" placeholder={textMap[activeLanguage].titleLabel} style={darkInputStyle} />
        </Form.Item>

        {/* Category Description */}
        <Form.Item
          name={`createMachineCatDes_${activeLanguage}`}
          label={<span style={labelStyle}>{textMap[activeLanguage].desLabel}</span>}
        >
          <Input.TextArea placeholder={textMap[activeLanguage].descPlaceholder} rows={3} style={{ ...darkInputStyle, resize: "none" }} className="!placeholder-gray-400" />
        </Form.Item>

        {/* Upload Background Image */}
        <ImageUpload
          label={textMap[activeLanguage].uploadBg}
          state={bgFileList}
          setState={setBgFileList}
          modalState={showBgModal}
          setModalState={setShowBgModal}
          inputId="bg-image-upload"
        />

        {/* Upload Main Image */}
        <ImageUpload
          label={textMap[activeLanguage].uploadImage}
          state={fileList}
          setState={setFileList}
          modalState={showMainImageModal}
          setModalState={setShowMainImageModal}
          inputId="main-image-upload"
        />

        {/* Upload Icon */}
        <ImageUpload
          label={textMap[activeLanguage].uploadIcon}
          state={iconList}
          setState={setIconList}
          modalState={showIconModal}
          setModalState={setShowIconModal}
          inputId="icon-upload"
        />

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
            }}
          >
            {textMap[activeLanguage].submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineCategoryCreate;
