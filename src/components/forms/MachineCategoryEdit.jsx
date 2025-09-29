import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateMachineCategory } from "../../Api/api";
import TranslationTabs from "../TranslationTabs";
import { CommonToaster } from "../../Common/CommonToaster";

const MachineCategoryEdit = ({ category, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [iconList, setIconList] = useState([]);

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
          { uid: "-1", name: "image.png", status: "done", url: category.image },
        ]);
      }
      if (category.icon) {
        setIconList([
          { uid: "-2", name: "icon.png", status: "done", url: category.icon },
        ]);
      }
    }
  }, [category, form]);

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

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }
      if (iconList.length > 0 && iconList[0].originFileObj) {
        formData.append("icon", iconList[0].originFileObj);
      }

      await updateMachineCategory(category._id, formData);
      CommonToaster("Machine Category updated successfully ✅", "success");

      if (onSuccess) onSuccess();
    } catch (error) {
      CommonToaster(error.response?.data?.error || "Update failed ❌", "error");
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
        {/* English */}
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

        {/* Vietnamese */}
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

        {/* Common */}
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
            Update Machine Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MachineCategoryEdit;
