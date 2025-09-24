import { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Card,
  Tag,
  Input,
  Tooltip,
  Badge,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getPosts, removePost } from "../../Api/action";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../../assets/css/blog-list.css";

dayjs.extend(relativeTime);
const { Title, Text } = Typography;
const { Search } = Input;

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const searchInput = useRef(null);

  // Permission flag (replace with real role check)
  const canDelete = true; // e.g., user.role === "admin"

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchText]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      const postsData = response.data || [];
      setPosts(postsData);
      setPagination((prev) => ({
        ...prev,
        total: postsData.length,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (!searchText) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(
      (post) =>
        post.blog_title?.toLowerCase().includes(searchText.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await removePost(id);
      message.success("Post deleted successfully");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      message.error("Failed to delete post");
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedRowKeys) {
        await removePost(id);
      }
      message.success(`Deleted ${selectedRowKeys.length} posts successfully`);
      setPosts((prev) => prev.filter((p) => !selectedRowKeys.includes(p.id)));
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("Error deleting posts:", err);
      message.error("Failed to delete posts");
    }
  };

  const handleEdit = (post) => {
    if (window.setDashboardTab) {
      window.setDashboardTab("Blogs", post);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const getStatusTag = (post) => {
    const status = post.status || "published";
    const colorMap = {
      published: "green",
      draft: "orange",
      archived: "red",
      scheduled: "blue",
    };
    return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
  };

  const getCategoryTag = (category) => {
    const colors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return category ? <Tag color={color}>{category}</Tag> : null;
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "blog_title",
      key: "title",
      width: 300,
      render: (title) => (
        <Space>
          <div>
            <Text strong style={{ cursor: "pointer" }}>
              {title}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category) => getCategoryTag(category),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (_, record) => getStatusTag(record),
    },
    {
      title: "Last Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 150,
      render: (date) => (
        <Tooltip title={dayjs(date).format("YYYY-MM-DD HH:mm")}>
          <Text type="secondary">{dayjs(date).fromNow()}</Text>
        </Tooltip>
      ),
      sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, post) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              style={{
                backgroundColor: "#004c70",
                color: "#fff",
                border: "none",
              }}
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(post)}
            />
          </Tooltip>

          {canDelete && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this post?"
                onConfirm={() => handleDelete(post.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  type="primary"
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div
      style={{
        padding: 14,
        minHeight: "100vh",
      }}
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: 24,
            background:
              "linear-gradient(to right, rgb(0, 114, 147), rgb(0, 76, 112))",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={2} style={{ color: "white", margin: 0 }}>
                Blog Management
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                Manage your blog posts efficiently
              </Text>
            </div>
            <Badge count={posts.length} showZero>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontWeight: 600,
                }}
                onClick={() =>
                  window.setDashboardTab &&
                  window.setDashboardTab("Blogs", null)
                }
              >
                New Post
              </Button>
            </Badge>
          </div>
        </div>

        {/* Toolbar Section */}
        <div style={{ padding: 24, borderBottom: "1px solid #f0f0f0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Search
              placeholder="Search posts..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 400 }}
              ref={searchInput}
            />

            <Space>
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchPosts}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>

          {canDelete && selectedRowKeys.length > 0 && (
            <div
              style={{
                padding: 12,
                background: "#f0f8ff",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text strong>{selectedRowKeys.length} post(s) selected</Text>
              <Space>
                <Button type="link" onClick={() => setSelectedRowKeys([])}>
                  Clear Selection
                </Button>
                <Popconfirm
                  title={`Delete ${selectedRowKeys.length} selected posts?`}
                  onConfirm={handleBulkDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete Selected
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div style={{ padding: 24 }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredPosts}
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            scroll={{ x: 900 }}
            size="middle"
          />
        </div>
      </Card>
    </div>
  );
}
