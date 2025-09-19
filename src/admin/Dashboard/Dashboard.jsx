// Dashboard.jsx
import SideBar from "./SideBar";
import { Card, Col, Row, Statistic, Typography, List, Tag, Divider } from "antd";
import { EyeOutlined, ShoppingOutlined, UserAddOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Dashboard() {
    const statsData = [
        {
            title: "Total Visitors",
            value: 5423,
            valueStyle: { color: "#722ed1" },
            prefix: <EyeOutlined />,
            change: 12.3,
            isRise: true,
        },
        {
            title: "Total Orders",
            value: 1845,
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
            valueStyle: { color: "#fa541c" },
            prefix: <UserAddOutlined />,
            change: 15.7,
            isRise: true,
        },
    ];

    const recentActivities = [
        { title: "New order received", description: "Order #3245 for $125.99", time: "2 minutes ago" },
        { title: "New user registered", description: "John Doe joined the platform", time: "15 minutes ago" },
        { title: "Payment completed", description: "Payment for invoice #4582", time: "35 minutes ago" },
        { title: "Server updated", description: "System maintenance completed", time: "2 hours ago" },
    ];

    return (
        <SideBar>
            <Row gutter={[24, 24]}>
                {statsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card bordered={false} style={{ borderRadius: 16 }}>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                precision={stat.precision}
                                valueStyle={stat.valueStyle}
                                prefix={stat.prefix}
                                suffix={stat.suffix}
                            />
                            <div style={{ marginTop: 8, display: "flex", alignItems: "center" }}>
                                <Tag
                                    color={stat.isRise ? "green" : "red"}
                                    icon={stat.isRise ? <RiseOutlined /> : <FallOutlined />}
                                    style={{ borderRadius: 12 }}
                                >
                                    {stat.change}%
                                </Tag>
                                <Text style={{ fontSize: 12, marginLeft: 8 }}>From last week</Text>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col span={24}>
                    <Card bordered={false} style={{ borderRadius: 16 }}>
                        <Title level={3}>Welcome to Orchid CMS</Title>
                        <Text>This is your premium dashboard. Start managing your content now.</Text>

                        <Divider />

                        <Title level={4}>Recent Activity</Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={recentActivities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.title}
                                        description={
                                            <div>
                                                <Text>{item.description}</Text>
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
        </SideBar>
    );
}
