import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosts } from "../Api/action";
import {
  Typography,
  Image,
  Row,
  Col,
  Tag,
  Divider,
  Card,
  Space,
  Avatar,
} from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  ShareAltOutlined,
  HeartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import "../assets/css/blog-overview.css";

const { Title, Paragraph, Text } = Typography;

export default function BlogOverview() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await getPosts();
      const found = response.data.find((item) => item.id === parseInt(id));
      setBlog(found);
    };
    fetchBlog();
  }, [id]);

  if (!blog)
    return (
      <div className="premium-loading">
        <div className="loading-spinner"></div>
        <Paragraph style={{ textAlign: "center", marginTop: 20 }}>
          Loading premium content...
        </Paragraph>
      </div>
    );

  const renderLayout = () => {
    switch (blog.layout) {
      case "layout1":
        return (
          <Card
            className="premium-layout-1"
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 40 }}>
              <Space size="large" style={{ marginBottom: 24 }}>
                <Tag
                  style={{
                    background: "#004c70",
                    borderColor: "#004c70",
                    padding: "8px 16px",
                    borderRadius: 20,
                    fontWeight: 600,
                    fontSize: 12,
                    color: "#fff",
                  }}
                >
                  {blog.category}
                </Tag>
                <Space>
                  <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary" strong>
                    {blog.read_time}
                  </Text>
                </Space>
              </Space>

              <Title
                level={1}
                style={{
                  fontSize: "40px",
                  marginBottom: 32,
                  color: "#004c70",
                  fontWeight: 700,
                }}
              >
                {blog.blog_title}
              </Title>

              {blog.blog_image && (
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    marginBottom: 32,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                >
                  <Image
                    src={blog.blog_image}
                    alt={blog.blog_title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Space style={{ marginBottom: 20 }} size="middle">
                <Avatar icon={<UserOutlined />} />
                <Text strong>Author Name</Text>
              </Space>
              <Paragraph
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  color: "#4a5568",
                }}
              >
                {blog.blog_description}
              </Paragraph>
              {/* ✅ Rich Text */}
              {blog.blog_content && (
                <div
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    padding: 16,
                    fontSize: 17,
                    background: "rgb(250 250 250 / 56%)",
                    borderLeft: "4px solid #004c70",
                    borderRadius: 8,
                    lineHeight: 1.7,
                    color: "rgb(74, 85, 104)",
                  }}
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              )}
              <Divider className="premium-divider" />
              <div className="premium-metadata-item">
                <Text strong>Created At:</Text>
                <Text>
                  {new Date(blog.created_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
                <Text strong> | Updated At:</Text>
                <Text>
                  {new Date(blog.updated_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </div>
            </div>
          </Card>
        );

      case "layout2":
        return (
          <div
            style={{
              display: "flex",
              gap: "40px",
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              padding: 32,
            }}
          >
            {/* ✅ Sticky Image Column */}
            <div style={{ flex: "0 0 40%" }}>
              <div
                style={{
                  position: "sticky",
                  top: 100, // change based on your header
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                }}
              >
                {blog.blog_image && (
                  <Image
                    src={blog.blog_image}
                    alt={blog.blog_title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </div>
            </div>

            {/* ✅ Scrollable Text Column */}
            <div style={{ flex: "1" }}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Space size="middle">
                  <Tag
                    style={{
                      background:
                        "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                      color: "white",
                      border: "none",
                      padding: "6px 16px",
                      borderRadius: 12,
                      fontWeight: 600,
                    }}
                  >
                    {blog.category}
                  </Tag>
                  <Space>
                    <ClockCircleOutlined style={{ color: "#a0aec0" }} />
                    <Text type="secondary">{blog.read_time}</Text>
                  </Space>
                </Space>

                <Title
                  level={2}
                  style={{
                    fontSize: "40px",
                    lineHeight: 1.3,
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  {blog.blog_title}
                </Title>

                <Paragraph
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "#718096",
                  }}
                >
                  {blog.blog_description}
                </Paragraph>

                {/* ✅ Rich Text */}
                {blog.blog_content && (
                  <div
                    style={{
                      padding: 8,
                      lineHeight: 1.8,
                      borderRadius: 10,
                      color: "rgb(74, 85, 104)",
                      fontSize: 16,
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                  />
                )}

                <Divider className="premium-divider" />

                <Space size="middle">
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>Author Name</Text>
                </Space>

                <div className="premium-metadata-item">
                  <Text strong>Created At:</Text>
                  <Text>
                    {new Date(blog.created_at).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Text>
                  <Text strong> | Updated At:</Text>
                  <Text>
                    {new Date(blog.updated_at).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Text>
                </div>
              </Space>
            </div>
          </div>
        );

      case "layout3":
        return (
          <div
            className="premium-layout-3"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
            }}
          >
            {/* ✅ Text Column */}
            <div>
              <Title
                level={1}
                style={{
                  fontSize: "40px",
                  lineHeight: 1.2,
                  fontWeight: 700,
                }}
              >
                {blog.blog_title}
              </Title>

              <Space size="middle">
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                    color: "white",
                    border: "none",
                    padding: "6px 16px",
                    borderRadius: 12,
                    fontWeight: 600,
                  }}
                >
                  {blog.category}
                </Tag>
                <Space>
                  <ClockCircleOutlined style={{ color: "#a0aec0" }} />
                  <Text type="secondary">{blog.read_time}</Text>
                </Space>
                <Space size="middle">
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>Author Name</Text>
                </Space>
              </Space>

              <Divider style={{ borderColor: "#e2e8f0", margin: "12px 0" }} />

              <Paragraph
                style={{
                  fontSize: "16px",
                  lineHeight: 1.8,
                  color: "#4a5568",
                }}
              >
                {blog.blog_description}
              </Paragraph>

              {/* ✅ Rich Text */}
              {blog.blog_content && (
                <div
                  style={{
                    marginTop: 16,
                    background: "#fafafa",
                    color: "rgb(74, 85, 104)",
                    fontSize: 16,
                    lineHeight: 1.8,
                    padding: 8,
                    borderRadius: 8,
                  }}
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              )}

              <Divider className="premium-divider" />

              <div className="premium-metadata-item">
                <Text strong>Created At:</Text>
                <Text>
                  {new Date(blog.created_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
                <Text strong> | Updated At:</Text>
                <Text>
                  {new Date(blog.updated_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </div>
            </div>

            {/* ✅ Sticky Image Column */}
            <div>
              <div
                style={{
                  position: "sticky",
                  top: 80, // adjust if header is taller
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                }}
              >
                {blog.blog_image && (
                  <Image
                    src={blog.blog_image}
                    alt={blog.blog_title}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "layout4":
        return (
          <Card
            className="premium-layout-4"
            bordered={false}
            style={{
              background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: 28,
              overflow: "hidden",
              position: "relative",
            }}
            bodyStyle={{ padding: 0 }}
          >
            {blog.blog_image && (
              <div
                style={{
                  height: "700px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  src={blog.blog_image}
                  alt={blog.blog_title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ padding: 40 }}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Space size="large">
                  <div
                    style={{
                      background: "#fff7e6",
                      padding: "5px 20px",
                      borderRadius: 20,
                      backdropFilter: "blur(10px)",
                      color: "#d46b08",
                      border: "1px solid #ffd591",
                    }}
                  >
                    {blog.category}
                  </div>
                  <Text type="secondary" strong>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    {blog.read_time}
                  </Text>
                </Space>

                <Title
                  level={2}
                  style={{
                    margin: 0,
                    fontSize: "40px",
                    background:
                      "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                  }}
                >
                  {blog.blog_title}
                </Title>

                <Paragraph
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.7,
                    color: "#718096",
                    marginBottom: 0,
                  }}
                >
                  {blog.blog_description}
                </Paragraph>

                {/* ✅ Rich Text */}
                {blog.blog_content && (
                  <div
                    style={{
                      padding: 8,
                      lineHeight: 1.8,
                      borderRadius: 10,
                      color: "rgb(74, 85, 104)",
                      fontSize: 17,
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                  />
                )}

                <Divider style={{ margin: "14px 0" }} />

                <Space size="middle">
                  <Avatar size="large" icon={<UserOutlined />} />
                  <div>
                    <Text strong>Sarah Johnson</Text>
                    <br />
                    <Text type="secondary">Content Strategist</Text>
                  </div>
                </Space>
                <div className="premium-metadata-item">
                  <Text strong>Created At:</Text>
                  <Text>
                    {new Date(blog.created_at).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Text>
                  <Text strong> | Updated At:</Text>
                  <Text>
                    {new Date(blog.updated_at).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        );

      case "layout5":
        return (
          <div className="premium-layout-5" style={{ position: "relative" }}>
            {blog.blog_image && (
              <div
                style={{
                  height: 600,
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: 24,
                }}
              >
                <Image
                  src={blog.blog_image}
                  alt={blog.blog_title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.7)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 80,
                    left: 60,
                    color: "white",
                    maxWidth: "70%",
                  }}
                >
                  <Tag
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: 20,
                      marginBottom: 20,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {blog.category}
                  </Tag>

                  <Space size="small">
                    <ClockCircleOutlined />
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                      {blog.read_time}
                    </Text>
                  </Space>

                  <Title
                    level={1}
                    style={{
                      color: "white",
                      fontSize: "52px",
                      margin: "20px 0",
                      fontWeight: 700,
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    {blog.blog_title}
                  </Title>
                </div>
              </div>
            )}

            <Card
              style={{
                marginTop: -40,
                position: "relative",
                zIndex: 2,
                borderRadius: 20,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: "none",
              }}
            >
              <Paragraph
                style={{
                  fontSize: "17px",
                  lineHeight: 1.8,
                  color: "#4a5568",
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                {blog.blog_description}
              </Paragraph>

              {/* ✅ Rich Text */}
              {blog.blog_content && (
                <div
                  style={{
                    marginTop: 1,
                    padding: 8,
                    lineHeight: 1.8,
                    borderRadius: 10,
                    color: "rgb(74, 85, 104)",
                    fontSize: 17,
                  }}
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              )}
              <Divider className="premium-divider" />
              <div className="premium-metadata-item">
                <Text strong>Created At:</Text>
                <Text>
                  {new Date(blog.created_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
                <Text strong> | Updated At:</Text>
                <Text>
                  {new Date(blog.updated_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </div>
            </Card>
          </div>
        );

      case "layout6":
        return (
          <div className="premium-layout-6">
            <Row gutter={[60, 40]}>
              <Col xs={24} lg={11}>
                <div
                  style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    position: "sticky",
                    top: 60,
                  }}
                >
                  {blog.blog_image && (
                    <Image
                      src={blog.blog_image}
                      alt={blog.blog_title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 24,
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(45deg, rgba(101, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                    }}
                  ></div>
                </div>
              </Col>

              <Col xs={24} lg={13}>
                <div style={{ padding: "20px 0" }}>
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Tag
                        style={{
                          background:
                            "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: 12,
                          fontWeight: 600,
                          marginBottom: 16,
                        }}
                      >
                        {blog.category}
                      </Tag>
                      <Text
                        type="secondary"
                        strong
                        style={{ display: "block" }}
                      >
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        {blog.read_time}
                      </Text>
                    </div>

                    <Title
                      level={1}
                      style={{
                        fontSize: "40px",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {blog.blog_title}
                    </Title>

                    <Paragraph
                      style={{
                        fontSize: "17px",
                        lineHeight: 1.7,
                        color: "#718096",
                        marginBottom: 0,
                      }}
                    >
                      {blog.blog_description}
                    </Paragraph>
                    {/* ✅ Rich Text */}
                    {blog.blog_content && (
                      <div
                        style={{
                          padding: 8,
                          lineHeight: 1.8,
                          borderRadius: 10,
                          color: "rgb(74, 85, 104)",
                          fontSize: 17,
                        }}
                        dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                      />
                    )}

                    <Space size="large">
                      <button
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          color: "white",
                          padding: "12px 30px",
                          borderRadius: 25,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                      >
                        Read Full Article
                      </button>
                      <button
                        style={{
                          background: "transparent",
                          border: "2px solid #e2e8f0",
                          color: "#4a5568",
                          padding: "12px 30px",
                          borderRadius: 25,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        Save for Later
                      </button>
                    </Space>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        );

      default:
        return (
          <Card
            style={{
              background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
              borderRadius: 24,
              padding: 40,
            }}
            bordered={false}
          >
            <Title
              level={1}
              style={{
                fontSize: "3rem",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              {blog.blog_title}
            </Title>
            <Paragraph
              style={{
                fontSize: "1.2rem",
                lineHeight: 1.8,
                textAlign: "center",
                color: "#4a5568",
              }}
            >
              {blog.blog_description}
            </Paragraph>
          </Card>
        );
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "40px 80px",
        background: "#fafbfc",
      }}
    >
      {renderLayout()}
    </div>
  );
}
