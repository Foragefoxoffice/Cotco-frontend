import React, { useState } from "react";
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
    Alert
} from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    CheckCircleFilled,
    DownloadOutlined,
    ShareAltOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import "../../assets/css/blog-widgets.css";
import { CommonToaster } from "../../Common/CommonToaster";
import { addPost } from "../../Api/action";

const { Text, Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

export default function AddBlogs() {
    const [blog, setBlog] = useState({
        id: 1,
        blog_title: "",
        blog_description: "",
        blog_image: "",
        created_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
        category: "Technology",
        read_time: "2 mins read"
    });

    const [selectedFields, setSelectedFields] = useState([]);
    const [activePanel, setActivePanel] = useState(["1"]);
    const [selectedLayout, setSelectedLayout] = useState("layout1");
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);

    const layouts = [
        { id: "layout1", name: "Classic", icon: "📰" },
        { id: "layout2", name: "Image Left", icon: "⬅️" },
        { id: "layout3", name: "Two Column", icon: "📊" },
        { id: "layout4", name: "Card", icon: "🃏" },
        { id: "layout5", name: "Banner", icon: "🏞️" },
        { id: "layout6", name: "Split Overlay", icon: "🎬" }
    ];

    const categories = [
        "Technology",
        "Design",
        "Business",
        "Lifestyle",
        "Health",
        "Travel"
    ];
    const [tempImage, setTempImage] = useState("");

    const handleAddField = (field) => {
        let value = blog[field];

        if (field === "blog_image") {
            value = blog.blog_image || tempImage;
        }

        if (!value || value.trim() === "") {
            CommonToaster(`Please fill the ${field.replace("_", " ")} first`, "error");
            return;
        }

        if (!selectedFields.includes(field)) {
            setSelectedFields([...selectedFields, field]);
            CommonToaster("Added Successfully", "success");
        }
    };


    const handleChange = (field, value) => {
        setBlog({
            ...blog,
            [field]: value,
            updated_at: new Date().toLocaleString(),
        });
    };

    const handleExport = () => {
        setIsExportModalVisible(true);
    };

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
                            {selectedFields.includes("blog_title") ? blog.blog_title : "Blog Title Here"}
                        </Title>
                        <div className="premium-image-container">
                            <Image
                                src={blog.blog_image || "https://placehold.co/800x450?text=Blog+Image+Preview"}
                                fallback="https://placehold.co/800x450?text=Blog+Image+Preview"
                                preview={false}
                            />
                        </div>


                        <Text className="premium-description">
                            {selectedFields.includes("blog_description") ? blog.blog_description : "Blog description goes here"}
                        </Text>

                        <div className="premium-footer">
                            <Text type="secondary">
                                {selectedFields.includes("created_at") ? `Created: ${blog.created_at} ` : "Created at: "}
                            </Text>
                            <Text type="secondary">
                                {selectedFields.includes("updated_at") ? `| Updated: ${blog.updated_at}` : "| Update at:"}
                            </Text>
                        </div>
                    </div>
                );

            case "layout2":
                return (
                    <Row gutter={32} align="middle" className="premium-preview-container">
                        <Col span={10}>
                            <div className="premium-image-container">
                                <Image
                                    src={blog.blog_image}
                                    fallback="https://placehold.co/400x500?text=Premium+Blog+Image"
                                    className="premium-image"
                                    preview={false}
                                />
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className="premium-meta">
                                <Tag color="blue">{blog.category}</Tag>
                                <Text type="secondary">{blog.read_time}</Text>
                            </div>
                            <Title level={2} className="premium-title"> {selectedFields.includes("blog_title") ? blog.blog_title : "Blog Title Here"}</Title>
                            <Text className="premium-description">
                                {selectedFields.includes("blog_description") ? blog.blog_description : "Blog description goes here"}
                            </Text>
                            <div className="premium-footer">
                                <Text type="secondary">
                                    {selectedFields.includes("created_at") ? `Created: ${blog.created_at} ` : "Created at: "}
                                </Text>
                                <Text type="secondary">
                                    {selectedFields.includes("updated_at") ? `| Updated: ${blog.updated_at}` : "| Update at:"}
                                </Text>
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
                                <Title level={2} className="premium-title"> {selectedFields.includes("blog_title") ? blog.blog_title : "Blog Title Here"}</Title>
                                <Text className="premium-description">
                                    {selectedFields.includes("blog_description") ? blog.blog_description : "Blog description goes here"}
                                </Text>
                            </Col>
                            <Col span={12}>
                                <div className="premium-image-container">
                                    <Image
                                        src={blog.blog_image}
                                        fallback="https://placehold.co/500x400?text=Premium+Blog+Image"
                                        className="premium-image"
                                        preview={false}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <div className="premium-footer">
                            <Text type="secondary">
                                {selectedFields.includes("created_at") ? `Created: ${blog.created_at} ` : "Created at: "}
                            </Text>
                            <Text type="secondary">
                                {selectedFields.includes("updated_at") ? `| Updated: ${blog.updated_at}` : "| Update at:"}
                            </Text>
                        </div>
                    </div>
                );

            case "layout4":
                return (
                    <div className="premium-preview-container">
                        <Card bordered={false} className="premium-card-layout">
                            <div className="premium-image-container">
                                <Image
                                    src={blog.blog_image}
                                    fallback="https://placehold.co/600x400?text=Premium+Blog+Image"
                                    className="premium-image"
                                    preview={false}
                                />
                            </div>
                            <div className="premium-card-content">
                                <div className="premium-meta">
                                    <Tag color="blue">{blog.category}</Tag>
                                    <Text type="secondary">{blog.read_time}</Text>
                                </div>
                                <Title level={3} className="premium-title"> {selectedFields.includes("blog_title") ? blog.blog_title : "Blog Title Here"}</Title>
                                <Text className="premium-description">
                                    {selectedFields.includes("blog_description") ? blog.blog_description : "Blog description goes here"}
                                </Text>
                                <div className="premium-footer">
                                    <Text type="secondary">
                                        {selectedFields.includes("created_at") ? `Created: ${blog.created_at} ` : "Created at: "}
                                    </Text>
                                    <Text type="secondary">
                                        {selectedFields.includes("updated_at") ? `| Updated: ${blog.updated_at}` : "| Update at:"}
                                    </Text>
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
                                src={blog.blog_image}
                                fallback="https://placehold.co/1000x400?text=Premium+Banner+Image"
                                className="premium-banner-image"
                                preview={false}
                            />
                            <div className="premium-banner-overlay">
                                <div className="premium-meta">
                                    {selectedFields.includes("category") && (
                                        <Tag color="blue">{blog.category}</Tag>
                                    )}
                                    {selectedFields.includes("read_time") && (
                                        <Text type="secondary" style={{ color: 'rgba(255,255,255,0.8)' }}>{blog.read_time}</Text>
                                    )}
                                </div>
                                <Title level={1} className="premium-banner-title"> {selectedFields.includes("blog_title") ? blog.blog_title : "Blog Title Here"}</Title>
                            </div>
                        </div>
                        <div style={{ padding: '24px 0' }}>
                            <Text className="premium-description">
                                {selectedFields.includes("blog_description") ? blog.blog_description : "Blog description goes here"}
                            </Text>
                            <div className="premium-footer">
                                <Text type="secondary">
                                    {selectedFields.includes("created_at") ? `Created: ${blog.created_at} ` : "Created at: "}
                                </Text>
                                <Text type="secondary">
                                    {selectedFields.includes("updated_at") ? `| Updated: ${blog.updated_at}` : "| Update at:"}
                                </Text>
                            </div>
                        </div>
                    </div>
                );

            case "layout6":
                return (
                    <div className="premium-preview-container">
                        <div className="premium-split-overlay">
                            <div className="premium-split-image">
                                <Image
                                    src={blog.blog_image}
                                    fallback="https://placehold.co/600x600?text=Premium+Blog+Image"
                                    preview={false}
                                    className="premium-image"
                                />
                            </div>
                            <div className="premium-split-content">
                                <div className="premium-meta">
                                    <Tag color="blue">{blog.category}</Tag>
                                    <Text type="secondary">{blog.read_time}</Text>
                                </div>
                                <Title level={2} className="premium-title"> {selectedFields.includes("blog_title") ? blog.blog_title : "Blog Title Here"}</Title>
                                <Text className="premium-description">
                                    {selectedFields.includes("blog_description") ? blog.blog_description : "Blog description goes here"}
                                </Text>
                                <div className="premium-footer">
                                    <Text type="secondary">
                                        {selectedFields.includes("created_at") ? `Created: ${blog.created_at} ` : "Created at: "}
                                    </Text>
                                    <Text type="secondary">
                                        {selectedFields.includes("updated_at") ? `| Updated: ${blog.updated_at}` : "| Update at:"}
                                    </Text>
                                </div>
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
                        <Text type="secondary">Choose from our premium layouts to see your content come to life</Text>
                    </div>
                );
        }
    };


    const addBlogPost = async () => {
        try {
            const payload = {
                blog_title: selectedFields.includes("blog_title") ? blog.blog_title : "",
                blog_description: selectedFields.includes("blog_description") ? blog.blog_description : "",
                blog_image: selectedFields.includes("blog_image") ? blog.blog_image : "",
                category: blog.category,
                read_time: blog.read_time,
                layout: selectedLayout
            };

            const response = await addPost(payload);
            console.log("Blog added successfully:", response);
            CommonToaster("Blog published successfully ✅", "success");
        } catch (error) {
            console.error("Error adding blog:", error);
            CommonToaster("Failed to publish blog ❌", "error");
        }
    };



    return (
        <div className="premium-container">
            <div className="premium-header">
                <div className="premium-brand">
                    <div className="premium-badge">
                        <EditOutlined /> BLOG EDITOR
                    </div>
                    <Text className="premium-subtitle">Craft stunning blog content with our premium editor</Text>
                </div>
                <div className="premium-actions">
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                        Export
                    </Button>
                    <Button onClick={addBlogPost} icon={<ShareAltOutlined />} type="primary">
                        Publish
                    </Button>
                </div>
            </div>

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
                {/* -------- LEFT SIDE: EDITOR -------- */}
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
                                message="Click the 'Add' button to save the field to the preview. Fields are only stored when added."
                                type="warning"
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
                                <Panel
                                    header={
                                        <div className="premium-panel-header">
                                            <div className="premium-panel-title">
                                                <span className="premium-panel-icon">📝</span>
                                                <span>Blog Title</span>
                                                {selectedFields.includes("blog_title") && (
                                                    <CheckCircleFilled className="premium-field-added" />
                                                )}
                                            </div>
                                            <Button
                                                size="small"
                                                type="primary"
                                                className="premium-add-button"
                                                icon={<PlusOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddField("blog_title");
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    }
                                    key="1"
                                >
                                    <Input
                                        value={blog.blog_title}
                                        onChange={(e) => handleChange("blog_title", e.target.value)}
                                        placeholder="Enter an engaging blog title"
                                        className="premium-input"
                                    />
                                    <div className="premium-input-footer">
                                        <Text type="secondary">{blog.blog_title.length}/120 characters</Text>
                                    </div>
                                </Panel>

                                {/* Blog Image */}
                                {/* Blog Image */}
                                <Panel
                                    header={
                                        <div className="premium-panel-header">
                                            <div className="premium-panel-title">
                                                <span className="premium-panel-icon">🖼️</span>
                                                <span>Blog Image</span>
                                                {selectedFields.includes("blog_image") && (
                                                    <CheckCircleFilled className="premium-field-added" />
                                                )}
                                            </div>
                                            {/* Add Button */}
                                            <Button
                                                size="small"
                                                type="primary"
                                                className="premium-add-button"
                                                icon={<PlusOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!tempImage) {
                                                        CommonToaster("Upload an image first", "error");
                                                        return;
                                                    }

                                                    // Check size again before adding
                                                    const imgFileSize = tempImage.length * (3 / 4) / 1024 / 1024; // Approximate MB
                                                    if (imgFileSize > 10) {
                                                        CommonToaster("Image exceeds 10MB limit!", "error");
                                                        return;
                                                    }

                                                    handleChange("blog_image", tempImage); // update blog
                                                    handleAddField("blog_image");          // add to selected fields
                                                    setTempImage("");                      // clear temp
                                                    CommonToaster("Image added to preview", "success");
                                                }}
                                            >
                                                Add
                                            </Button>

                                        </div>
                                    }
                                    key="3"
                                >
                                    <div className="premium-upload-section">
                                        {tempImage ? (
                                            <div className="premium-image-preview-container">
                                                <Image
                                                    src={tempImage}
                                                    className="premium-upload-preview"
                                                    preview={false} // Disable popup
                                                />
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    size="small"
                                                    className="premium-image-remove-btn"
                                                    onClick={() => setTempImage("")}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <Upload
                                                accept="image/*"
                                                showUploadList={false}
                                                beforeUpload={(file) => {
                                                    const isLt10M = file.size / 1024 / 1024 <= 10; // Check file size in MB
                                                    if (!isLt10M) {
                                                        CommonToaster("Image must be smaller than 10MB!", "error");
                                                        return Upload.LIST_IGNORE; // Prevent upload
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => {
                                                        setTempImage(e.target.result); // store in temp
                                                    };
                                                    reader.readAsDataURL(file);
                                                    return false; // prevent auto upload
                                                }}
                                                className="premium-upload"
                                            >
                                                <div className="premium-upload-placeholder">
                                                    <UploadOutlined style={{ fontSize: '24px', marginBottom: 8 }} />
                                                    <Text>Click or drag image to upload</Text>
                                                    <Text type="secondary">Recommended: 1200x630 pixels, max 10MB</Text>
                                                </div>
                                            </Upload>

                                        )}
                                    </div>
                                </Panel>


                                {/* Blog Description */}
                                <Panel
                                    header={
                                        <div className="premium-panel-header">
                                            <div className="premium-panel-title">
                                                <span className="premium-panel-icon">📄</span>
                                                <span>Blog Description</span>
                                                {selectedFields.includes("blog_description") && (
                                                    <CheckCircleFilled className="premium-field-added" />
                                                )}
                                            </div>
                                            <Button
                                                size="small"
                                                type="primary"
                                                className="premium-add-button"
                                                icon={<PlusOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddField("blog_description");
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <TextArea
                                        value={blog.blog_description}
                                        onChange={(e) =>
                                            handleChange("blog_description", e.target.value)
                                        }
                                        placeholder="Write blog content here..."
                                        autoSize={{ minRows: 4 }}
                                        className="premium-textarea"
                                    />
                                    <div className="premium-input-footer">
                                        <Text type="secondary">{blog.blog_description.length}/2000 characters</Text>
                                    </div>
                                </Panel>

                                {/* Metadata */}
                                <Panel
                                    header={
                                        <div className="premium-panel-header">
                                            <div className="premium-panel-title">
                                                <span className="premium-panel-icon">📊</span>
                                                <span>Metadata</span>
                                            </div>
                                            <Space>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    className="premium-add-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddField("created_at");
                                                    }}
                                                >
                                                    Add Created
                                                </Button>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    className="premium-add-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddField("updated_at");
                                                    }}
                                                >
                                                    Add Updated
                                                </Button>
                                            </Space>
                                        </div>
                                    }
                                    key="4"
                                >
                                    <div className="premium-metadata-section">
                                        <div className="premium-metadata-item">
                                            <Text strong>Category</Text>
                                            <Select
                                                value={blog.category}
                                                onChange={(value) => handleChange("category", value)}
                                                className="premium-metadata-select"
                                            >
                                                {categories.map(cat => (
                                                    <Option key={cat} value={cat}>{cat}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <Divider className="premium-divider" />
                                        <div className="premium-metadata-item">
                                            <Text strong>Read Time</Text>
                                            <Select
                                                value={blog.read_time}
                                                onChange={(value) => handleChange("read_time", value)}
                                                className="premium-metadata-select"
                                            >
                                                <Option value="2 min read">2 min read</Option>
                                                <Option value="5 min read">5 min read</Option>
                                                <Option value="10 min read">10 min read</Option>
                                                <Option value="15 min read">15 min read</Option>
                                            </Select>
                                        </div>
                                        <Divider className="premium-divider" />
                                        <div className="premium-metadata-item">
                                            <Text strong>Created At:</Text>
                                            <Text>{blog.created_at}</Text>
                                        </div>
                                        <Divider className="premium-divider" />
                                        <div className="premium-metadata-item">
                                            <Text strong>Updated At:</Text>
                                            <Text>{blog.updated_at}</Text>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                        </Card>
                    </div>
                </Col>

                {/* -------- RIGHT SIDE: PREVIEW -------- */}
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
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        setSelectedFields([]);
                                        setBlog({
                                            id: 1,
                                            blog_title: "",
                                            blog_description: "",
                                            blog_image: "",
                                            created_at: new Date().toLocaleString(),
                                            updated_at: new Date().toLocaleString(),
                                            category: "Technology",
                                            read_time: "5 min read"
                                        });
                                        CommonToaster("All fields are Cleared", "error");
                                    }}
                                    danger
                                >
                                    Clear All
                                </Button>

                            </Tooltip>
                        }
                    >
                        <div className="premium-preview-header">
                            <Text strong>Previewing: {layouts.find(l => l.id === selectedLayout)?.name} Layout</Text>
                            <Tooltip title="Layout information">
                                <Button type="text" icon={<InfoCircleOutlined />} size="small" />
                            </Tooltip>
                        </div>

                        {/* Render preview */}
                        <div className="premium-preview-content">
                            {renderPreview()}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Export Options"
                visible={isExportModalVisible}
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