import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "../Api/api";
import SectionRenderer from "../components/sections/SectionRenderer";
import { Spin, Typography } from "antd";

const { Paragraph } = Typography;

export default function BlogOverview() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const lang = "en"; // ✅ can be "vn" based on user preference

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPageBySlug(slug);
        setPage(res.data.data);
      } catch (err) {
        console.error("Error fetching page:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spin size="large" />
        <Paragraph>Loading page...</Paragraph>
      </div>
    );
  }

  if (!page) {
    return <Paragraph className="text-center py-10">Page not found</Paragraph>;
  }

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-center mb-10">
        {page.title?.[lang]}
      </h1>
      {page.blocks.map((block) => (
        <SectionRenderer key={block._id} block={block} lang={lang} />
      ))}
    </div>
  );
}
