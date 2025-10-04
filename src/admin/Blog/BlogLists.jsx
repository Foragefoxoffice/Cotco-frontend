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
import { getPages, deletePage } from "../../Api/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../../assets/css/blog-list.css";

dayjs.extend(relativeTime);
const { Title, Text } = Typography;
const { Search } = Input;

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const searchInput = useRef(null);

  const canDelete = true; // Replace with role check later

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchText]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPages(); // ✅ fetch from backend
      const blogData = response.data.data || [];

      // Map blogs into table rows
      const formatted = blogData.map((page) => ({
        id: page._id,
        title: page.title.en,
        category: page.category?.name?.en || "Uncategorized",
        status: "published", // you can extend schema to include status
        updatedAt: page.updatedAt,
        slug: page.slug,
      }));

      setBlogs(formatted);
      setPagination((prev) => ({
        ...prev,
        total: formatted.length,
      }));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    if (!searchText) {
      setFilteredBlogs(blogs);
      return;
    }
    const filtered = blogs.filter((blog) =>
      blog.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deletePage(id);
      message.success("Blog deleted successfully");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Failed to delete blog");
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedRowKeys) {
        await deletePage(id);
      }
      message.success(`Deleted ${selectedRowKeys.length} blogs successfully`);
      setBlogs((prev) => prev.filter((b) => !selectedRowKeys.includes(b.id)));
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("Bulk delete error:", err);
      message.error("Failed to delete blogs");
    }
  };

  const handleEdit = (blog) => {
    // Example: redirect to edit page
    window.location.href = `/admin/blogs/edit/${blog.id}`;
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const getStatusTag = (status) => {
    const colorMap = {
      published: "green",
      draft: "orange",
      archived: "red",
      scheduled: "blue",
    };
    return <Tag color={colorMap[status] || "default"}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (title) => (
        <Space>
          <Text strong>{title}</Text>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (date) => (
        <Tooltip title={dayjs(date).format("YYYY-MM-DD HH:mm")}>
          <Text type="secondary">{dayjs(date).fromNow()}</Text>
        </Tooltip>
      ),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, blog) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              style={{ backgroundColor: "#004c70", border: "none" }}
              onClick={() => handleEdit(blog)}
            />
          </Tooltip>

          {canDelete && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this blog?"
                onConfirm={() => handleDelete(blog.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger size="small" icon={<DeleteOutlined />} />
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
    <div style={{ padding: 14, minHeight: "100vh" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div
          style={{
            padding: 24,
            background: "linear-gradient(to right, rgb(0, 114, 147), rgb(0, 76, 112))",
            color: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Title level={2} style={{ color: "white", margin: 0 }}>
                Blog Management
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                Manage your blog posts efficiently
              </Text>
            </div>
            <Badge count={blogs.length} showZero>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontWeight: 600,
                }}
                onClick={() => (window.location.href = "/admin/blogs/create")}
              >
                New Post
              </Button>
            </Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ padding: 24, borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Search
              placeholder="Search blogs..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 400 }}
              ref={searchInput}
            />
            <Space>
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button icon={<ReloadOutlined />} onClick={fetchBlogs} loading={loading}>
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
              }}
            >
              <Text strong>{selectedRowKeys.length} blog(s) selected</Text>
              <Space>
                <Button type="link" onClick={() => setSelectedRowKeys([])}>
                  Clear Selection
                </Button>
                <Popconfirm
                  title={`Delete ${selectedRowKeys.length} selected blogs?`}
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

        {/* Table */}
        <div style={{ padding: 24 }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredBlogs}
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
