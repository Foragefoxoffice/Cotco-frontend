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
    <div>
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
          label="Name (English)"
          rules={[{ required: true, message: "Please enter English name" }]}
          style={{ display: activeLanguage === "en" ? "block" : "none" }}
        >
          <Input placeholder="Enter category name (EN)" />
        </Form.Item>
        <Form.Item
          name="description_en"
          label="Description (English)"
          style={{ display: activeLanguage === "en" ? "block" : "none" }}
        >
          <Input.TextArea placeholder="Enter description (EN)" rows={3} />
        </Form.Item>

        {/* Vietnamese Fields */}
        <Form.Item
          name="name_vn"
          label="Name (Vietnamese)"
          style={{ display: activeLanguage === "vn" ? "block" : "none" }}
        >
          <Input placeholder="Enter category name (VN)" />
        </Form.Item>
        <Form.Item
          name="description_vn"
          label="Description (Vietnamese)"
          style={{ display: activeLanguage === "vn" ? "block" : "none" }}
        >
          <Input.TextArea placeholder="Enter description (VN)" rows={3} />
        </Form.Item>

        {/* Common Fields */}
        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Please enter slug" }]}
        >
          <Input placeholder="Unique slug (e.g. weaving)" />
        </Form.Item>

        {/* Uploads */}
        <Form.Item name="image" label="Upload Image">
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div>Upload Image</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="icon" label="Upload Icon">
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            fileList={iconList}
            onChange={({ fileList }) => setIconList(fileList)}
          >
            {iconList.length === 0 && (
              <div>
                <PlusOutlined />
                <div>Upload Icon</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Machine Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineCategoryCreate;
