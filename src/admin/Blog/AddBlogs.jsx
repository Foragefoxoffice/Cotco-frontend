import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  Upload,
  Button,
  Collapse,
  Image,
  Row,
  Col,
  Divider,
  Space,
  Tag,
  Tooltip,
  Select,
  Modal,
  Alert,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  ShareAltOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "../../assets/css/blog-widgets.css";
import { CommonToaster } from "../../Common/CommonToaster";
import { addPost, updatePost } from "../../Api/action";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

const { Text, Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

export default function AddBlogs({ editablePost }) {
  const [blog, setBlog] = useState({
    id: 1,
    blog_title: "",
    blog_description: "",
    blog_content: "",
    blog_image: "",
    created_at: new Date().toLocaleString(),
    updated_at: new Date().toLocaleString(),
    category: "Technology",
    read_time: "2 min read",
  });

  useEffect(() => {
    if (editablePost) {
      setBlog({
        ...editablePost,
        updated_at: new Date().toLocaleString(),
      });
    }
  }, [editablePost]);

  const [activePanel, setActivePanel] = useState(["1"]);
  const [selectedLayout, setSelectedLayout] = useState("layout1");
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState("");

  const layouts = [
    { id: "layout1", name: "Classic", icon: "📰" },
    { id: "layout2", name: "Image Left", icon: "⬅️" },
    { id: "layout3", name: "Two Column", icon: "📊" },
    { id: "layout4", name: "Card", icon: "🃏" },
    { id: "layout5", name: "Banner", icon: "🏞️" },
    { id: "layout6", name: "Split Overlay", icon: "🎬" },
  ];

  const categories = [
    "Technology",
    "Design",
    "Business",
    "Lifestyle",
    "Health",
    "Travel",
  ];

  const handleChange = (field, value) => {
    setBlog({
      ...blog,
      [field]: value,
      updated_at: new Date().toLocaleString(),
    });
  };

  const addBlogPost = async () => {
    try {
      const payload = {
        blog_title: blog.blog_title,
        blog_description: blog.blog_description,
        blog_image: blog.blog_image,
        blog_content: blog.blog_content,
        category: blog.category,
        read_time: blog.read_time,
        layout: selectedLayout,
      };

      let response;
      if (editablePost) {
        response = await updatePost(blog.id, payload);
        CommonToaster("Blog updated successfully ✅", "success");
      } else {
        response = await addPost(payload);
        CommonToaster("Blog published successfully ✅", "success");
      }

      console.log("Response:", response);
    } catch (error) {
      console.error("Error saving blog:", error);
      CommonToaster("Failed to save blog ❌", "error");
    }
  };

  // 🔥 Always show whatever is in blog (no selectedFields checks)
  const renderPreview = () => {
    switch (selectedLayout) {
      case "layout1":
        return (
          <div className="premium-preview-container">
            <div className="premium-meta">
              <Tag color="blue">{blog.category}</Tag>
              <Text type="secondary">{blog.read_time}</Text>
            </div>
            <Title level={2} className="premium-title">
              {blog.blog_title || "Blog Title Here"}
            </Title>
            <div className="premium-image-container">
              <Image
                src={
                  blog.blog_image ||
                  "https://placehold.co/800x450?text=Blog+Image+Preview"
                }
                preview={false}
              />
            </div>
            <Text className="premium-description">
              {blog.blog_description || "Blog description goes here"}
            </Text>
            {blog.blog_content && (
              <div
                className="premium-full-content layout1-content"
                dangerouslySetInnerHTML={{ __html: blog.blog_content }}
              />
            )}
            <div className="premium-footer">
              <Text type="secondary">Created: {blog.created_at}</Text>
              <Text type="secondary"> | Updated: {blog.updated_at}</Text>
            </div>
          </div>
        );

      case "layout2":
        return (
          <Row gutter={32} align="middle" className="premium-preview-container">
            <Col span={10}>
              <Image
                src={
                  blog.blog_image ||
                  "https://placehold.co/400x500?text=Premium+Blog+Image"
                }
                preview={false}
              />
            </Col>
            <Col span={14}>
              <div className="premium-meta">
                <Tag color="blue">{blog.category}</Tag>
                <Text type="secondary">{blog.read_time}</Text>
              </div>
              <Title level={2} className="premium-title">
                {blog.blog_title || "Blog Title Here"}
              </Title>
              <Text className="premium-description">
                {blog.blog_description || "Blog description goes here"}
              </Text>
              {blog.blog_content && (
                <div
                  className="premium-full-content layout2-content"
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              )}
              <div className="premium-footer">
                <Text type="secondary">Created: {blog.created_at}</Text>
                <Text type="secondary"> | Updated: {blog.updated_at}</Text>
              </div>
            </Col>
          </Row>
        );

      case "layout3":
        return (
          <div className="premium-preview-container">
            <div className="premium-meta">
              <Tag color="blue">{blog.category}</Tag>
              <Text type="secondary">{blog.read_time}</Text>
            </div>
            <Row gutter={32}>
              <Col span={12}>
                <Title level={2} className="premium-title">
                  {blog.blog_title || "Blog Title Here"}
                </Title>
                <Text className="premium-description">
                  {blog.blog_description || "Blog description goes here"}
                </Text>
                {blog.blog_content && (
                  <div
                    className="premium-full-content layout3-content"
                    dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                  />
                )}
              </Col>
              <Col span={12}>
                <Image
                  src={
                    blog.blog_image ||
                    "https://placehold.co/500x400?text=Premium+Blog+Image"
                  }
                  preview={false}
                />
              </Col>
            </Row>
            <div className="premium-footer">
              <Text type="secondary">Created: {blog.created_at}</Text>
              <Text type="secondary"> | Updated: {blog.updated_at}</Text>
            </div>
          </div>
        );

      case "layout4":
        return (
          <div className="premium-preview-container">
            <Card bordered={false} className="premium-card-layout">
              <Image
                src={
                  blog.blog_image ||
                  "https://placehold.co/600x400?text=Premium+Blog+Image"
                }
                preview={false}
              />
              <div className="premium-card-content">
                <div className="premium-meta">
                  <Tag color="blue">{blog.category}</Tag>
                  <Text type="secondary">{blog.read_time}</Text>
                </div>
                <Title level={3} className="premium-title">
                  {blog.blog_title || "Blog Title Here"}
                </Title>
                <Text className="premium-description">
                  {blog.blog_description || "Blog description goes here"}
                </Text>
                {blog.blog_content && (
                  <div
                    className="premium-full-content layout4-content"
                    dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                  />
                )}
                <div className="premium-footer">
                  <Text type="secondary">Created: {blog.created_at}</Text>
                  <Text type="secondary"> | Updated: {blog.updated_at}</Text>
                </div>
              </div>
            </Card>
          </div>
        );

      case "layout5":
        return (
          <div className="premium-preview-container">
            <div className="premium-banner-container">
              <Image
                src={
                  blog.blog_image ||
                  "https://placehold.co/1000x400?text=Premium+Banner+Image"
                }
                preview={false}
                className="premium-banner-image"
              />
              <div className="premium-banner-overlay">
                <Tag color="blue">{blog.category}</Tag>
                <Text style={{ color: "#fff" }}>{blog.read_time}</Text>
                <Title level={1} className="premium-banner-title">
                  {blog.blog_title || "Blog Title Here"}
                </Title>
              </div>
            </div>
            <div style={{ padding: "24px 0" }}>
              <Text className="premium-description">
                {blog.blog_description || "Blog description goes here"}
              </Text>
              {blog.blog_content && (
                <div
                  className="premium-full-content layout5-content"
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              )}
              <div className="premium-footer">
                <Text type="secondary">Created: {blog.created_at}</Text>
                <Text type="secondary"> | Updated: {blog.updated_at}</Text>
              </div>
            </div>
          </div>
        );

      case "layout6":
        return (
          <div className="premium-preview-container premium-split-overlay">
            <div className="premium-split-image">
              <Image
                src={
                  blog.blog_image ||
                  "https://placehold.co/600x600?text=Premium+Blog+Image"
                }
                preview={false}
              />
            </div>
            <div className="premium-split-content">
              <Tag color="blue">{blog.category}</Tag>
              <Text type="secondary">{blog.read_time}</Text>
              <Title level={2} className="premium-title">
                {blog.blog_title || "Blog Title Here"}
              </Title>
              <Text className="premium-description">
                {blog.blog_description || "Blog description goes here"}
              </Text>
              {blog.blog_content && (
                <div
                  className="premium-full-content layout6-content"
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              )}
              <div className="premium-footer">
                <Text type="secondary">Created: {blog.created_at}</Text>
                <Text type="secondary"> | Updated: {blog.updated_at}</Text>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="premium-empty-preview">
            <div className="premium-empty-icon">👁️</div>
            <Title level={4} type="secondary">
              Select a layout to begin preview
            </Title>
            <Text type="secondary">
              Choose from our premium layouts to see your content come to life
            </Text>
          </div>
        );
    }
  };

  return (
    <div className="premium-container">
      {/* HEADER */}
      <div className="premium-header">
        <div className="premium-brand">
          <div className="premium-badge">
            <EditOutlined /> BLOG EDITOR
          </div>
          <Text className="premium-subtitle">
            Craft stunning blog content with our premium editor
          </Text>
        </div>
        <div className="premium-actions">
          <Tooltip title="Publish your blog">
            <Button
              onClick={addBlogPost}
              icon={<ShareAltOutlined />}
              type="primary"
              className="premium-badge"
            >
              Publish
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* LAYOUT SELECTOR */}
      <div className="premium-stats-container">
        <div className="premium-layout-selector">
          <Text strong>Select Layout:</Text>
          <Select
            value={selectedLayout}
            onChange={setSelectedLayout}
            className="premium-layout-dropdown"
          >
            {layouts.map((l) => (
              <Option key={l.id} value={l.id}>
                <span style={{ marginRight: 8 }}>{l.icon}</span>
                {l.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Row gutter={32} className="premium-content-row">
        {/* LEFT EDITOR */}
        <Col xs={24} lg={10}>
          <div style={{ position: "sticky", top: 16 }}>
            <Card
              className="premium-card editor-panel"
              title={
                <div className="premium-card-header">
                  <EditOutlined className="premium-header-icon" />
                  <span>Content Editor</span>
                </div>
              }
              extra={<Tag color="purple">Cotco</Tag>}
            >
              <Alert
                className="alert-message"
                message="All changes are auto-synced. Just click Publish when ready."
                type="info"
                showIcon
                banner
              />

              <Collapse
                accordion
                activeKey={activePanel}
                onChange={(key) => setActivePanel(key)}
                className="premium-collapse"
                expandIconPosition="end"
              >
                {/* Blog Title */}
                <Panel key="1" header="📝 Blog Title">
                  <Input
                    value={blog.blog_title}
                    onChange={(e) => handleChange("blog_title", e.target.value)}
                    placeholder="Enter an engaging blog title"
                    className="premium-input"
                    maxLength={100} // optional, set max length if needed
                  />
                  <div
                    style={{ textAlign: "right", fontSize: 12, marginTop: 4 }}
                  >
                    {blog.blog_title.length} / 100
                  </div>
                </Panel>

                {/* Blog Image */}
                <Panel key="2" header="🖼️ Blog Image">
                  <div className="premium-upload-section">
                    {tempImage ? (
                      <div className="premium-image-preview-container">
                        <Image src={tempImage} preview={false} />
                        <Button
                          danger
                          size="small"
                          style={{ marginLeft: 8, padding: "18px 12px" }}
                          icon={<DeleteOutlined />}
                          onClick={() => setTempImage("")}
                        >
                          Remove
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          style={{ marginLeft: 8, padding: "18px 12px" }}
                          onClick={() => {
                            handleChange("blog_image", tempImage);
                            CommonToaster("Image set for blog", "success");
                            setTempImage("");
                          }}
                        >
                          Use Image
                        </Button>
                      </div>
                    ) : (
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          if (file.size / 1024 / 1024 > 10) {
                            CommonToaster(
                              "Image must be smaller than 10MB!",
                              "error"
                            );
                            return Upload.LIST_IGNORE;
                          }
                          const reader = new FileReader();
                          reader.onload = (e) => setTempImage(e.target.result);
                          reader.readAsDataURL(file);
                          return false;
                        }}
                      >
                        <div className="premium-upload-placeholder">
                          <UploadOutlined style={{ fontSize: 24 }} />
                          <Text>Click or drag image to upload</Text>
                          <Text type="secondary">
                            Recommended: 1200x630 pixels, max 10MB
                          </Text>
                        </div>
                      </Upload>
                    )}
                  </div>
                </Panel>

                {/* Blog Description */}
                <Panel key="3" header="📄 Blog Description">
                  <TextArea
                    value={blog.blog_description}
                    style={{ color: "#000" }}
                    onChange={(e) =>
                      handleChange("blog_description", e.target.value)
                    }
                    autoSize={{ minRows: 4 }}
                    placeholder="Enter a brief description or summary of the blog"
                    maxLength={300} // optional
                  />
                  <div
                    style={{ textAlign: "right", fontSize: 12, marginTop: 4 }}
                  >
                    {blog.blog_description.length} / 300
                  </div>
                </Panel>

                {/* Metadata */}
                <Panel key="4" header="📊 Metadata">
                  <div className="premium-metadata-item">
                    <Text strong>Category</Text>
                    <Select
                      value={blog.category}
                      onChange={(v) => handleChange("category", v)}
                      className="premium-metadata-select"
                    >
                      {categories.map((c) => (
                        <Option key={c} value={c}>
                          {c}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <Divider />
                  <div className="premium-metadata-item">
                    <Text strong>Read Time</Text>
                    <Select
                      value={blog.read_time}
                      onChange={(v) => handleChange("read_time", v)}
                      className="premium-metadata-select"
                    >
                      <Option value="2 min read">2 min read</Option>
                      <Option value="5 min read">5 min read</Option>
                      <Option value="10 min read">10 min read</Option>
                      <Option value="15 min read">15 min read</Option>
                    </Select>
                  </div>
                  <Divider />
                  <Text strong>Created At:</Text> <Text>{blog.created_at}</Text>
                  <Divider />
                  <Text strong>Updated At:</Text> <Text>{blog.updated_at}</Text>
                </Panel>

                {/* Blog Content */}
                <Panel key="5" header="✍️ Blog Content">
                  <ReactQuill
                    value={blog.blog_content}
                    onChange={(value) => handleChange("blog_content", value)}
                    theme="snow"
                    style={{ height: 200 }}
                  />
                </Panel>
              </Collapse>
            </Card>
          </div>
        </Col>

        {/* RIGHT PREVIEW */}
        <Col xs={24} lg={14}>
          <Card
            className="premium-card preview-panel"
            title={
              <div className="premium-card-header">
                <EyeOutlined className="premium-header-icon" />
                <span>Live Preview</span>
                <Tag icon={<CheckCircleFilled />} color="green">
                  REAL-TIME
                </Tag>
              </div>
            }
            extra={
              <Tooltip title="Clear all fields">
                <Button
                  size="small"
                  style={{ background: "#fff2f0", color: "#ff7875" }}
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    setBlog({
                      id: 1,
                      blog_title: "",
                      blog_description: "",
                      blog_content: "",
                      blog_image: "",
                      created_at: new Date().toLocaleString(),
                      updated_at: new Date().toLocaleString(),
                      category: "Technology",
                      read_time: "2 min read",
                    });
                    CommonToaster("All fields are cleared", "info");
                  }}
                >
                  Clear All
                </Button>
              </Tooltip>
            }
          >
            <div className="premium-preview-header">
              <Text strong>
                Previewing: {layouts.find((l) => l.id === selectedLayout)?.name}{" "}
                Layout
              </Text>
              <Tooltip title="Layout information">
                <Button
                  type="text"
                  icon={<InfoCircleOutlined />}
                  size="small"
                />
              </Tooltip>
            </div>
            <div className="premium-preview-content">{renderPreview()}</div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Export Options"
        open={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsExportModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="export" type="primary">
            Export
          </Button>,
        ]}
      >
        <Text>Choose your export format:</Text>
        <Space style={{ marginTop: 16 }}>
          <Button>HTML</Button>
          <Button>Markdown</Button>
          <Button>PDF</Button>
          <Button>JSON</Button>
        </Space>
      </Modal>
    </div>
  );
}
