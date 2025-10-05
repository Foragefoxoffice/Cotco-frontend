import React, { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createMachineCategory } from "../../Api/api";
import TranslationTabs from "../TranslationTabs";
import { CommonToaster } from "../../Common/CommonToaster";

const MachineCategoryCreate = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [iconList, setIconList] = useState([]);

  const darkInputStyle = {
    backgroundColor: "#262626",
    border: "1px solid #2E2F2F",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  const labelStyle = {
    color: "#ccc",
    fontWeight: 500,
    fontSize: "14px",
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "name",
        JSON.stringify({ en: values.name_en || "", vn: values.name_vn || "" })
      );
      formData.append(
        "description",
        JSON.stringify({
          en: values.description_en || "",
          vn: values.description_vn || "",
        })
      );
      formData.append("slug", values.slug);

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }
      if (iconList.length > 0) {
        formData.append("icon", iconList[0].originFileObj);
      }

      await createMachineCategory(formData);
      CommonToaster("Machine Category created successfully ✅", "success");

      if (onSuccess) onSuccess();
      form.resetFields();
      setFileList([]);
      setIconList([]);
    } catch (error) {
      CommonToaster(
        error.response?.data?.error || "Something went wrong ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#171717] rounded-lg">
      <div className="mb-4">
        <TranslationTabs
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
        />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* English Fields */}
        <Form.Item
          name="name_en"
          label={<span style={labelStyle}>Name (English)</span>}
          rules={[{ required: true, message: "Please enter English name" }]}
          style={{ display: activeLanguage === "en" ? "block" : "none" }}
        >
          <Input
            placeholder="Enter category name (EN)"
            style={darkInputStyle}
          />
        </Form.Item>

        <Form.Item
          name="description_en"
          label={<span style={labelStyle}>Description (English)</span>}
          style={{ display: activeLanguage === "en" ? "block" : "none" }}
        >
          <Input.TextArea
            placeholder="Enter description (EN)"
            rows={3}
            style={darkInputStyle}
          />
        </Form.Item>

        {/* Vietnamese Fields */}
        <Form.Item
          name="name_vn"
          label={<span style={labelStyle}>Name (Vietnamese)</span>}
          style={{ display: activeLanguage === "vn" ? "block" : "none" }}
        >
          <Input
            placeholder="Enter category name (VN)"
            style={darkInputStyle}
          />
        </Form.Item>

        <Form.Item
          name="description_vn"
          label={<span style={labelStyle}>Description (Vietnamese)</span>}
          style={{ display: activeLanguage === "vn" ? "block" : "none" }}
        >
          <Input.TextArea
            placeholder="Enter description (VN)"
            rows={3}
            style={darkInputStyle}
          />
        </Form.Item>

        {/* Common Fields */}
        <Form.Item
          name="slug"
          label={<span style={labelStyle}>Slug</span>}
          rules={[{ required: true, message: "Please enter slug" }]}
        >
          <Input placeholder="Unique slug (e.g. weaving)" style={darkInputStyle} />
        </Form.Item>

        {/* Uploads */}
        <Form.Item name="image" label={<span style={labelStyle}>Upload Image</span>}>
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            style={{ backgroundColor: "#262626", borderRadius: "8px" }}
          >
            {fileList.length === 0 && (
              <div style={{ color: "#999" }}>
                <PlusOutlined />
                <div>Upload Image</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="icon" label={<span style={labelStyle}>Upload Icon</span>}>
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            fileList={iconList}
            onChange={({ fileList }) => setIconList(fileList)}
            style={{ backgroundColor: "#262626", borderRadius: "8px" }}
          >
            {iconList.length === 0 && (
              <div style={{ color: "#999" }}>
                <PlusOutlined />
                <div>Upload Icon</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            block
            style={{
              backgroundColor: "#0085C8",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "500",
              padding: "10px 16px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#009FE3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#0085C8")
            }
          >
            Create Machine Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineCategoryCreate;
