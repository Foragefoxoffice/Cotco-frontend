import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateMainCategory } from "../../Api/api";
import TranslationTabs from "../TranslationTabs";

const MachineMainCategoryEdit = ({ category, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // ✅ Pre-fill form with category data
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name_en: category.name?.en || "",
        name_vn: category.name?.vn || "",
        description_en: category.description?.en || "",
        description_vn: category.description?.vn || "",
        slug: category.slug || "",
      });

      if (category.image) {
  setFileList([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: `http://localhost:5000${category.image}`, // prepend API domain
    },
  ]);
}
else {
        setFileList([]);
      }
    }
  }, [category, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "name",
        JSON.stringify({
          en: values.name_en || "",
          vn: values.name_vn || "",
        })
      );
      formData.append(
        "description",
        JSON.stringify({
          en: values.description_en || "",
          vn: values.description_vn || "",
        })
      );
      formData.append("slug", values.slug);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await updateMainCategory(category._id, formData);
      message.success("Machine Main Category updated successfully ✅");

      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(error.response?.data?.error || "Update failed ❌");
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

        {/* Slug */}
        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Please enter slug" }]}
        >
          <Input placeholder="Unique slug (e.g. industrial-machines)" />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item name="image" label="Upload Image">
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
            Update Main Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineMainCategoryEdit;
