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
import { getBlogs, deleteBlog } from "../../Api/api"; // ✅ main blogs API
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../../assets/css/blog-list.css";

dayjs.extend(relativeTime);
const { Title, Text } = Typography;
const { Search } = Input;

export default function BlogList() {
  const [resources, setResources] = useState([]); // ✅ only published
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const searchInput = useRef(null);

  const canDelete = true; // role check placeholder

  // ✅ Fetch only published blogs/resources
  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchText]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      const data = response.data?.data || [];

      // ✅ Only include published resources
      const publishedOnly = data.filter(
        (item) => item.status?.toLowerCase() === "published"
      );

      const formatted = publishedOnly
        .map((item) => ({
          id: item._id,
          title: item.title?.en || item.title?.vi || "Untitled",
          mainCategory:
            item.mainCategory?.name?.en ||
            item.mainCategory?.name?.vi ||
            "General",
          category:
            item.category?.name?.en ||
            item.category?.name?.vi ||
            "Uncategorized",
          status: item.status,
          slug: item.slug,
          updatedAt: item.updatedAt || item.createdAt,
          author: item.author || "Unknown",
        }))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

      setResources(formatted);
      setPagination((prev) => ({
        ...prev,
        total: formatted.length,
      }));
    } catch (err) {
      console.error("Error fetching blogs:", err);
      message.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    if (!searchText) {
      setFilteredResources(resources);
      return;
    }
    const filtered = resources.filter((r) =>
      r.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredResources(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      message.success("Deleted successfully");
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Failed to delete resource");
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedRowKeys) {
        await deleteBlog(id);
      }
      message.success(`Deleted ${selectedRowKeys.length} resources`);
      setResources((prev) => prev.filter((r) => !selectedRowKeys.includes(r.id)));
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("Bulk delete error:", err);
      message.error("Failed to delete resources");
    }
  };

  const handleEdit = (resource) => {
    window.location.href = `/admin/blogs/edit/${resource.id}`;
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const getStatusTag = (status) => (
    <Tag color="green">{status.toUpperCase()}</Tag>
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (title, record) => (
        <Space>
          <Text strong>{title}</Text>
          <a
            href={`/blogs/${record.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#1890ff" }}
          >
            View
          </a>
        </Space>
      ),
    },
    {
      title: "Main Category",
      dataIndex: "mainCategory",
      key: "mainCategory",
      width: 160,
      render: (mainCat) => <Tag color="cyan">{mainCat}</Tag>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 150,
      render: (author) => <Text>{author}</Text>,
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
      sorter: (a, b) =>
        dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, resource) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              style={{ backgroundColor: "#004c70", border: "none" }}
              onClick={() => handleEdit(resource)}
            />
          </Tooltip>

          {canDelete && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete this resource?"
                onConfirm={() => handleDelete(resource.id)}
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
                Published Resources
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                View and manage all published blog posts
              </Text>
            </div>
            <Badge count={resources.length} showZero>
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
                New Resource
              </Button>
            </Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ padding: 24, borderBottom: "1px solid #f0f0f0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Search
              placeholder="Search published resources..."
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
                onClick={fetchResources}
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
              }}
            >
              <Text strong>{selectedRowKeys.length} selected</Text>
              <Space>
                <Button type="link" onClick={() => setSelectedRowKeys([])}>
                  Clear
                </Button>
                <Popconfirm
                  title={`Delete ${selectedRowKeys.length} selected items?`}
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
            dataSource={filteredResources}
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
