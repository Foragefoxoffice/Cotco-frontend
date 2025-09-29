import React, { useState } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createMainCategory } from "../../Api/api";
import TranslationTabs from "../TranslationTabs";

const MachineMainCategoryCreate = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // ✅ Guarantee nested objects (both EN & VN always exist)
      const name = {
        en: values.name_en || "",
        vn: values.name_vn || "",
      };

      const description = {
        en: values.description_en || "",
        vn: values.description_vn || "",
      };

      // ✅ Prepare FormData
      const formData = new FormData();
      formData.append("name", JSON.stringify(name));
      formData.append("description", JSON.stringify(description));
      formData.append("slug", values.slug);

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      await createMainCategory(formData);
      message.success("Machine Main Category created successfully ✅");

      if (onSuccess) onSuccess();
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error(error.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Language Tabs */}
      <div className="mb-4">
        <TranslationTabs
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
        />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* English Fields (always mounted, toggled by style) */}
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

        {/* Vietnamese Fields (always mounted, toggled by style) */}
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
          <Input placeholder="Unique slug (e.g. industrial-machines)" />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          name="image"
          label="Upload Image"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            beforeUpload={() => false} // prevent auto upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            onRemove={() => {
              setFileList([]);
              form.setFieldsValue({ image: "" });
            }}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Main Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineMainCategoryCreate;
