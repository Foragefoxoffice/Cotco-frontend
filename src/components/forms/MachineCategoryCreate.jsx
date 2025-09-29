import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createMachineCategory, getMainCategories } from "../../Api/api";
import TranslationTabs from "../TranslationTabs";

const MachineCategoryCreate = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [iconList, setIconList] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);

  // ✅ Fetch main categories for dropdown
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const res = await getMainCategories();
        setMainCategories(res.data.data || []);
      } catch (err) {
        message.error("Failed to load main categories ❌");
      }
    };
    fetchMainCategories();
  }, []);

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
      formData.append("mainCategoryId", values.mainCategoryId);

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }
      if (iconList.length > 0) {
        formData.append("icon", iconList[0].originFileObj);
      }

      await createMachineCategory(formData);
      message.success("Machine Category created successfully ✅");

      if (onSuccess) onSuccess();
      form.resetFields();
      setFileList([]);
      setIconList([]);
    } catch (error) {
      message.error(error.response?.data?.error || "Something went wrong ❌");
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

        <Form.Item
          name="mainCategoryId"
          label="Main Category"
          rules={[{ required: true, message: "Please select main category" }]}
        >
          <Select placeholder="Select Main Category">
            {mainCategories.map((mc) => (
              <Select.Option key={mc._id} value={mc._id}>
                {mc.name?.en || mc.slug}
              </Select.Option>
            ))}
          </Select>
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
