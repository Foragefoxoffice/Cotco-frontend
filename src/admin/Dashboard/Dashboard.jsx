import React from "react";
import { Card, Col, Row, Statistic, Typography, Tag, List } from "antd";
import {
  EyeOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const darkMode = false; // 👈 you can later pass this from context or props

  // 📊 Example stats data
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

  // 🕒 Example activities
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

  return (
      <Row gutter={[24, 24]}>
        {/* 📊 Stats Cards */}
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              variant="outlined"
              style={{
                background: darkMode
                  ? "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 250, 250, 0.7) 100%)",
                border: "1px solid #eeeeee1a",
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

        {/* 🕒 Recent Activity */}
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
