import { useEffect, useState, useRef } from "react";
import { getPosts } from "../Api/action";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Image,
  Tag,
  Skeleton,
  Button,
  Input,
  Select,
  Avatar,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  FilterOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/css/blogs.css";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

export default function PremiumBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const blogGridRef = useRef(null);

  useEffect(() => {
    getPostsData();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, selectedCategory, sortBy]);

  const getPostsData = async () => {
    try {
      const response = await getPosts();
      const posts = response?.data || [];
      setBlogs(posts);

      // Extract unique categories
      const uniqueCategories = [...new Set(posts.map((post) => post.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const filterAndSortBlogs = () => {
    let filtered = blogs.filter(
      (blog) =>
        blog.blog_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blog_description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    // Sort blogs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "trending":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    setFilteredBlogs(filtered);
  };

  const getTagColor = (category) => {
    const colorMap = {
      technology: "blue",
      design: "purple",
      business: "green",
      lifestyle: "orange",
      health: "red",
      education: "geekblue",
    };
    return colorMap[category?.toLowerCase()] || "default";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div className="premium-blog-container">
      {/* Enhanced Hero Section */}
      <div className="premium-hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={1} className="premium-hero-title">
              Our Insights
            </Title>
            <Paragraph className="premium-hero-subtitle">
              Dive deep into expert analysis, cutting-edge trends, and inspiring
              stories from thought leaders across industries
            </Paragraph>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="search-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Space size="middle" wrap className="filters-container">
              <Search
                placeholder="Search articles..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="premium-search"
                size="large"
              />
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                suffixIcon={<FilterOutlined />}
                className="category-filter"
                size="large"
              >
                <Option value="all">All Categories</Option>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="sort-filter"
                size="large"
              >
                <Option value="latest">Latest</Option>
                <Option value="popular">Most Popular</Option>
                <Option value="trending">Trending</Option>
              </Select>
            </Space>
          </motion.div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="premium-blog-grid-section" ref={blogGridRef}>
        <div className="section-header">
          <Title level={2} className="premium-section-title">
            Latest Articles
            <Text type="secondary" className="post-count">
              ({filteredBlogs.length} articles)
            </Text>
          </Title>
        </div>

        {loading ? (
          <Row gutter={[30, 30]}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Col key={item} xs={24} sm={12} lg={8}>
                <Card className="premium-blog-card" hoverable>
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <AnimatePresence>
            <Row gutter={[30, 30]}>
              {filteredBlogs.map((blog, index) => (
                <Col key={blog.id} xs={24} sm={12} lg={8}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className="premium-blog-card"
                      cover={
                        <div className="premium-image-container">
                          <Image
                            src={blog.blog_image}
                            alt={blog.blog_title}
                            preview={false}
                            className="premium-blog-image"
                          />
                          <Tag
                            color={getTagColor(blog.category)}
                            className="premium-category-tag"
                          >
                            {blog.category}
                          </Tag>
                          {index < 3 && (
                            <div className="trending-badge">
                              <StarFilled /> Trending
                            </div>
                          )}
                        </div>
                      }
                    >
                      <Meta
                        title={
                          <Text
                            strong
                            ellipsis={{ tooltip: blog.blog_title }}
                            className="premium-blog-title"
                          >
                            {blog.blog_title}
                          </Text>
                        }
                        description={
                          <Paragraph
                            ellipsis={{ rows: 3 }}
                            className="premium-blog-description"
                          >
                            {blog.blog_description}
                          </Paragraph>
                        }
                      />

                      <Divider className="premium-divider" />

                      <div className="premium-blog-footer">
                        <Space size="small" wrap>
                          <Avatar src={blog.author_avatar} size="small" />
                          <Text strong>{blog.author || "Admin"}</Text>
                        </Space>
                        <Space size="large" className="meta-info">
                          <Text type="secondary">
                            <CalendarOutlined />{" "}
                            {new Date(blog.created_at).toLocaleDateString()}
                          </Text>
                          <Text type="secondary">
                            <ClockCircleOutlined /> {blog.read_time} min
                          </Text>
                        </Space>
                      </div>

                      <Button
                        type="primary"
                        ghost
                        className="premium-read-more"
                        block
                        onClick={() => navigate(`/blogs/${blog.id}`)}
                      >
                        Continue Reading <ArrowRightOutlined />
                      </Button>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatePresence>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="no-results">
            <Title level={3}>No articles found</Title>
            <Paragraph>Try adjusting your search or filters</Paragraph>
          </div>
        )}
      </div>
    </div>
  );
}
