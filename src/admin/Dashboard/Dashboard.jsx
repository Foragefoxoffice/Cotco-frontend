import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Space,
  Avatar,
  Button,
  Badge,
  Typography,
  Divider,
  Switch,
  Card,
  Row,
  Col,
  Statistic,
  List,
  Tag,
} from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  BellOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  EyeOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  RiseOutlined,
  FallOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../assets/css/service.css";
import AddBlogs from "../Blog/AddBlogs";
import BlogLists from "../Blog/BlogLists";
import Users from "../Users/Users";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sideBar, setSideBar] = useState("dashboard");
  const [editablePost, setEditablePost] = useState(null);
  const navigate = useNavigate();

  // ✅ Get logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "";
  const userEmail = storedUser?.email || "No email";

  // ✅ Function to generate first letter safely
  const getInitials = (name) => {
    if (!name || name.trim() === "") return "U";
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      className: "menu-item-premium",
    },
    {
      key: "blog-section",
      icon: <AppstoreOutlined />,
      label: "Blog Section",
      className: "menu-item-premium",
      children: [
        {
          key: "Blogs",
          icon: <FileTextOutlined />,
          label: "Blogs",
        },
        {
          key: "Blog Lists",
          icon: <HomeOutlined />,
          label: "Blog Lists",
        },
      ],
    },
    {
      key: "users",
      icon: <UserAddOutlined />,
      label: "Users",
      className: "menu-item-premium",
    },
  ];

  // ✅ logout handler
  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const userMenuItems = [
    {
      key: "user-email",
      label: <strong>{userEmail}</strong>, // 👈 show email at top
      disabled: true, // not clickable
    },
    { key: "profile", icon: <ProfileOutlined />, label: "Profile" },
    { key: "billing", icon: <FileTextOutlined />, label: "Billing" },
    { key: "divider", type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  const statsData = [
    {
      title: "Total Visitors",
      value: 5423,
      precision: 0,
      valueStyle: { color: "#722ed1" },
      prefix: <EyeOutlined />,
      change: 12.3,
      isRise: true,
    },
    {
      title: "Total Orders",
      value: 1845,
      precision: 0,
      valueStyle: { color: "#52c41a" },
      prefix: <ShoppingOutlined />,
      change: 8.2,
      isRise: true,
    },
    {
      title: "Conversion Rate",
      value: 34.5,
      precision: 2,
      valueStyle: { color: "#1890ff" },
      suffix: "%",
      change: -2.1,
      isRise: false,
    },
    {
      title: "New Users",
      value: 924,
      precision: 0,
      valueStyle: { color: "#fa541c" },
      prefix: <UserAddOutlined />,
      change: 15.7,
      isRise: true,
    },
  ];

  const recentActivities = [
    {
      title: "New order received",
      description: "Order #3245 for $125.99",
      time: "2 minutes ago",
    },
    {
      title: "New user registered",
      description: "John Doe joined the platform",
      time: "15 minutes ago",
    },
    {
      title: "Payment completed",
      description: "Payment for invoice #4582",
      time: "35 minutes ago",
    },
    {
      title: "Server updated",
      description: "System maintenance completed",
      time: "2 hours ago",
    },
  ];

  useEffect(() => {
    window.setDashboardTab = (tab, post) => {
      setSideBar(tab);
      if (post) setEditablePost(post);
    };
  }, []);

  // render content for tabs
  const renderContent = () => {
    if (sideBar === "dashboard") {
      return (
        <Row gutter={[24, 24]}>
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                variant="outlined"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)",
                  border: "1px solid #eeeeee1a",
                  backdropFilter: "blur(10px)",
                  borderRadius: 16,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Statistic
                  title={
                    <Text style={{ color: darkMode ? "#fff" : "#1f2937" }}>
                      {stat.title}
                    </Text>
                  }
                  value={stat.value}
                  precision={stat.precision}
                  valueStyle={stat.valueStyle}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tag
                    color={stat.isRise ? "green" : "red"}
                    icon={stat.isRise ? <RiseOutlined /> : <FallOutlined />}
                    style={{
                      border: "none",
                      borderRadius: 12,
                      fontWeight: 500,
                    }}
                  >
                    {stat.change}%
                  </Tag>
                  <Text
                    style={{
                      fontSize: 12,
                      color: darkMode ? "rgba(255, 255, 255, 0.6)" : "#64748b",
                      marginLeft: 8,
                    }}
                  >
                    From last week
                  </Text>
                </div>
              </Card>
            </Col>
          ))}

          <Col span={24}>
            <Card
              variant="outlined"
              style={{
                background: darkMode ? "#15192d" : "#fff",
                border: "1px solid #eeeeee1a",
                borderRadius: 16,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                minHeight: 400,
              }}
            >
              <Title
                level={3}
                style={{
                  color: darkMode ? "#fff" : "#1f2937",
                  marginBottom: 24,
                }}
              >
                Welcome to Cotco CMS
              </Title>
              <Text
                style={{
                  color: darkMode ? "#94a3b8" : "#64748b",
                  fontSize: 16,
                }}
              >
                This is your premium dashboard. Start managing your content now.
              </Text>

              <Divider
                style={{
                  margin: "24px 0",
                  borderColor: darkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "#e5e7eb",
                }}
              />

              <Title
                level={4}
                style={{
                  color: darkMode ? "#fff" : "#1f2937",
                  marginBottom: 16,
                }}
              >
                Recent Activity
              </Title>

              <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Text style={{ color: darkMode ? "#fff" : "#1f2937" }}>
                          {item.title}
                        </Text>
                      }
                      description={
                        <div>
                          <Text
                            style={{
                              color: darkMode ? "#94a3b8" : "#64748b",
                            }}
                          >
                            {item.description}
                          </Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.time}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      );
    }
    if (sideBar === "Blogs") {
      return <AddBlogs editablePost={editablePost} />;
    }
    if (sideBar === "Blog Lists") {
      return <BlogLists />;
    }
    if (sideBar === "users") {
      return <Users />;
    }
    return (
      <Card variant="outlined" style={{ borderRadius: 16, minHeight: 300 }}>
        <Title level={3} style={{ color: darkMode ? "#fff" : "#1f2937" }}>
          {sideBar.charAt(0).toUpperCase() + sideBar.slice(1)}
        </Title>
        <Text style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
          Content for {sideBar} goes here.
        </Text>
      </Card>
    );
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f1116" : "#f5f7fa",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: darkMode
            ? "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, #0f172a 100%)"
            : "linear-gradient(to right, #007293, #004c70)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
          position: "fixed",
          left: 0,
          height: "100vh",
          zIndex: 10,
          overflow: "auto",
        }}
        className="premium-sidebar"
      >
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {!collapsed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="/img/home/footerLogo.png"
                alt="Logo"
                className="h-20 w-auto ml-3"
              />
            </div>
          ) : (
            <img
              src="/img/home/footerLogo-small.png"
              alt="Logo"
              className="h-10 w-auto ml-3"
            />
          )}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[sideBar]}
          onClick={(e) => setSideBar(e.key)}
          items={menuItems}
          style={{
            background: "transparent",
            borderRight: 0,
            marginTop: 24,
            padding: "0 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>
            Cotco CMS v1.0.0
          </Text>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: "margin-left 0.2s",
          background: darkMode
            ? "rgba(15, 23, 42, 0.8)"
            : "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Header
          style={{
            background: darkMode
              ? "rgba(15, 23, 42, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            padding: "0 24px",
            borderBottom: darkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 9,
            height: 80,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                background: darkMode ? "#fff" : "transparent",
              }}
            />
          </Space>

          <Space size="large">
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{ background: darkMode ? "#8b5cf6" : "#ccc" }}
            />
            <Badge count={5} size="small">
              <Button
                style={{ background: darkMode ? "#fff" : "#fff" }}
                type="text"
                icon={<BellOutlined />}
              />
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <Avatar
                size={36}
                style={{ backgroundColor: "#1677ff", fontWeight: "bold" }}
              >
                {getInitials(userName)}
              </Avatar>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: 24 }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
