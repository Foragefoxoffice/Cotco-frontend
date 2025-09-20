import React, { useState } from "react";
import { Card, Typography, Input, Upload, Button, Collapse, Image, Row, Col, Divider, Space, Tag, Tooltip, Progress } from "antd";
import { UploadOutlined, PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, CrownFilled, ThunderboltFilled, CheckCircleFilled } from "@ant-design/icons";
import "../../assets/css/blogs.css";
const { Text, Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

export default function BlogWidget() {
    const allFields = ["blog_title", "blog_description", "blog_image", "created_at", "updated_at"];

    const [blog, setBlog] = useState({
        id: 1,
        blog_title: "",
        blog_description: "",
        blog_image: "",
        created_at: "2025-09-20 10:30:00",
        updated_at: "2025-09-20 11:00:00",
    });

    const [selectedFields, setSelectedFields] = useState([]);
    const [activePanel, setActivePanel] = useState(["1"]);

    const handleAddField = (field) => {
        if (!selectedFields.includes(field)) {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleRemoveField = (field) => {
        setSelectedFields(selectedFields.filter(f => f !== field));
    };

    const handleChange = (field, value) => {
        setBlog({ ...blog, [field]: value, updated_at: new Date().toLocaleString() });
    };

    return (
        <div className="premium-container">
            <div className="premium-header">
                <div className="premium-badge">
                    <EditOutlined /> EDITOR
                </div>
                <div className="premium-stats">
                    <div className="stat-item">
                        <span className="stat-label">Fields Used</span>
                        <span className="stat-value">{selectedFields.length}/5</span>
                    </div>
                    <Progress
                        percent={(selectedFields.length / 5) * 100}
                        showInfo={false}
                        strokeColor={{
                            '0%': '#4b6cb7',
                            '100%': '#182848',
                        }}
                        className="progress-bar"
                    />
                </div>
            </div>

            <Row gutter={24}>
                <Col xs={24} md={10}>
                    <Card
                        className="premium-card editor-panel"
                        title={
                            <div className="card-header">
                                <EditOutlined className="header-icon" />
                                <span>Content Editor</span>
                            </div>
                        }
                        extra={<Tag color="blue">Cotco</Tag>}
                    >
                        <Collapse
                            accordion
                            activeKey={activePanel}
                            onChange={key => setActivePanel(key)}
                            className="premium-collapse"
                            expandIconPosition="end"
                        >
                            <Panel
                                header={
                                    <div className="panel-header">
                                        <div className="panel-title">
                                            <span className="panel-icon">📝</span>
                                            <span>Blog Title</span>
                                        </div>
                                        <Button
                                            size="small"
                                            type="primary"
                                            className="add-button"
                                            icon={<PlusOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddField("blog_title");
                                            }}
                                        >
                                            Add to Preview
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
                                    prefix={<span style={{ color: '#bfbfbf' }}>✨</span>}
                                />
                                <div className="panel-footer">
                                    <Text type="secondary">Character count: {blog.blog_title.length}</Text>
                                    {blog.blog_title.length > 0 && (
                                        <Tooltip title="Optimal length for SEO">
                                            <Progress
                                                percent={Math.min(100, blog.blog_title.length)}
                                                size="small"
                                                status={blog.blog_title.length >= 50 ? "success" : "active"}
                                                showInfo={false}
                                                style={{ width: 100 }}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </Panel>

                            <Panel
                                header={
                                    <div className="panel-header">
                                        <div className="panel-title">
                                            <span className="panel-icon">🖼️</span>
                                            <span>Blog Image</span>
                                        </div>
                                        <Button
                                            size="small"
                                            type="primary"
                                            className="add-button"
                                            icon={<PlusOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddField("blog_image");
                                            }}
                                        >
                                            Add to Preview
                                        </Button>
                                    </div>
                                }
                                key="3"
                            >
                                <div className="image-upload-section">
                                    <div className="image-preview-container">
                                        <Image
                                            src={blog.blog_image}
                                            alt="Blog"
                                            fallback="https://placehold.co/600x300?text=Upload+Image"
                                            className="preview-image"
                                        />
                                        {!blog.blog_image && (
                                            <div className="upload-placeholder">
                                                <UploadOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
                                                <Text type="secondary">No image uploaded</Text>
                                            </div>
                                        )}
                                    </div>
                                    <Upload
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            const url = URL.createObjectURL(file);
                                            handleChange("blog_image", url);
                                            return false;
                                        }}
                                        className="upload-button-container"
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            type="primary"
                                            block
                                            className="upload-button"
                                        >
                                            Upload New Image
                                        </Button>
                                    </Upload>
                                </div>
                            </Panel>

                            <Panel
                                header={
                                    <div className="panel-header">
                                        <div className="panel-title">
                                            <span className="panel-icon">📄</span>
                                            <span>Blog Description</span>
                                        </div>
                                        <Button
                                            size="small"
                                            type="primary"
                                            className="add-button"
                                            icon={<PlusOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddField("blog_description");
                                            }}
                                        >
                                            Add to Preview
                                        </Button>
                                    </div>
                                }
                                key="2"
                            >
                                <TextArea
                                    value={blog.blog_description}
                                    onChange={(e) => handleChange("blog_description", e.target.value)}
                                    placeholder="Write your engaging blog content here..."
                                    autoSize={{ minRows: 4 }}
                                    className="premium-textarea"
                                />
                                <div className="panel-footer">
                                    <Text type="secondary">Character count: {blog.blog_description.length}</Text>
                                    {blog.blog_description.length > 0 && (
                                        <Tooltip title="Optimal length for engagement">
                                            <Progress
                                                percent={Math.min(100, blog.blog_description.length / 500 * 100)}
                                                size="small"
                                                status={blog.blog_description.length >= 300 ? "success" : "active"}
                                                showInfo={false}
                                                style={{ width: 100 }}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </Panel>

                            <Panel
                                header={
                                    <div className="panel-header">
                                        <div className="panel-title">
                                            <span className="panel-icon">📊</span>
                                            <span>Metadata</span>
                                        </div>
                                        <Space>
                                            <Button
                                                size="small"
                                                type="primary"
                                                className="add-button"
                                                icon={<PlusOutlined />}
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
                                                className="add-button"
                                                icon={<PlusOutlined />}
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
                                <div className="metadata-section">
                                    <div className="metadata-item">
                                        <Text strong>Created At:</Text>
                                        <Tag color="blue">{blog.created_at}</Tag>
                                    </div>
                                    <Divider className="premium-divider" />
                                    <div className="metadata-item">
                                        <Text strong>Updated At:</Text>
                                        <Tag color="green">{blog.updated_at}</Tag>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </Card>
                </Col>

                <Col xs={24} md={14}>
                    <Card
                        className="premium-card preview-panel"
                        title={
                            <div className="card-header">
                                <EyeOutlined className="header-icon" />
                                <span>Live Preview</span>
                                <Tag icon={<CheckCircleFilled />} color="green">REAL-TIME</Tag>
                            </div>
                        }
                        extra={
                            <Tooltip title="Clear all fields">
                                <Button
                                    size="small"
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => setSelectedFields([])}
                                    danger
                                    className="clear-all-btn"
                                >
                                    Clear All
                                </Button>
                            </Tooltip>
                        }
                    >
                        <div className="preview-content">
                            {selectedFields.length === 0 ? (
                                <div className="empty-preview">
                                    <div className="empty-icon">👁️</div>
                                    <Title level={4} type="secondary">No fields selected for preview</Title>
                                    <Text type="secondary">Click "Add to Preview" buttons in the editor to get started</Text>
                                </div>
                            ) : (
                                <>
                                    {selectedFields.includes("blog_title") && (
                                        <Title level={2} className="preview-title">
                                            {blog.blog_title || "Your Blog Title Will Appear Here"}
                                            <Tooltip title="Remove title from preview">
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    onClick={() => handleRemoveField("blog_title")}
                                                    className="field-remove-btn"
                                                    danger
                                                />
                                            </Tooltip>
                                        </Title>
                                    )}

                                    {selectedFields.includes("blog_image") && (
                                        <div className="preview-image-container">
                                            <Image
                                                src={blog.blog_image}
                                                alt="Preview"
                                                fallback="https://placehold.co/600x300?text=Upload+an+Image"
                                                className="preview-image"
                                            />
                                            <Tooltip title="Remove image from preview">
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    onClick={() => handleRemoveField("blog_image")}
                                                    className="field-remove-btn image-remove-btn"
                                                    danger
                                                />
                                            </Tooltip>
                                        </div>
                                    )}

                                    {selectedFields.includes("blog_description") && (
                                        <div className="preview-description">
                                            <Text>{blog.blog_description || "Your blog content will appear here once you add it"}</Text>
                                            <Tooltip title="Remove description from preview">
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    onClick={() => handleRemoveField("blog_description")}
                                                    className="field-remove-btn"
                                                    danger
                                                />
                                            </Tooltip>
                                        </div>
                                    )}

                                    <div className="preview-metadata">
                                        {selectedFields.includes("created_at") && (
                                            <div className="metadata-preview">
                                                <Text type="secondary">Created: {blog.created_at}</Text>
                                                <Tooltip title="Remove creation date from preview">
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        size="small"
                                                        onClick={() => handleRemoveField("created_at")}
                                                        className="field-remove-btn"
                                                        danger
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                        {selectedFields.includes("updated_at") && (
                                            <div className="metadata-preview">
                                                <Text type="secondary">Updated: {blog.updated_at}</Text>
                                                <Tooltip title="Remove update date from preview">
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        size="small"
                                                        onClick={() => handleRemoveField("updated_at")}
                                                        className="field-remove-btn"
                                                        danger
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}