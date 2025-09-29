// pages/MachinePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Spin,
  Tabs,
  List,
  Table,
  Card,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import { getMachinePageBySlug } from "../Api/api";

const { Title, Paragraph } = Typography;

const MachinePage = () => {
  const { mainSlug, categorySlug, pageSlug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMachinePageBySlug(  pageSlug);
        setPage(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [mainSlug, categorySlug, pageSlug]);

  if (loading) return <Spin size="large" className="block mx-auto mt-20" />;
  if (!page) return <p>Not found</p>;

  /* ---------- Render Section ---------- */
  const renderSection = (section, idx) => {
    switch (section.type) {
      case "text":
        return (
          <div key={idx} style={{ margin: "40px 0" }}>
            <Title level={3}>{section.title?.en}</Title>
            <Paragraph>{section.description?.en}</Paragraph>
          </div>
        );

      case "richtext":
        return (
          <div
            key={idx}
            className="richtext"
            style={{ margin: "40px 0" }}
            dangerouslySetInnerHTML={{ __html: section.richtext?.en }}
          />
        );

      case "list":
        return (
          <div key={idx} style={{ margin: "40px 0" }}>
            <Title level={4}>{section.title?.en}</Title>
            <List
              bordered
              dataSource={section.listItems || []}
              renderItem={(item) => <List.Item>{item.en}</List.Item>}
            />
          </div>
        );

      case "blocks":
        return (
          <div key={idx} style={{ margin: "40px 0" }}>
            <Row gutter={[16, 16]}>
              {(section.blocks || []).map((b, i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <Card hoverable cover={b.image ? <img alt="" src={b.image} /> : null}>
                    <Card.Meta
                      title={b.title?.en}
                      description={b.description?.en}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );

      case "tabs":
        return (
          <div key={idx} style={{ margin: "40px 0" }}>
            <Tabs
              items={(section.tabs || []).map((t, i) => ({
                key: i,
                label: t.tabTitle?.en || `Tab ${i + 1}`,
                children: (t.sections || []).map((cs, j) => (
                  <div key={j}>{renderSection(cs, `${idx}-${i}-${j}`)}</div>
                )),
              }))}
            />
          </div>
        );

      case "table":
        return (
          <div key={idx} style={{ margin: "40px 0" }}>
            <Title level={4}>{section.title?.en}</Title>
            <Table
              bordered
              pagination={false}
              columns={(section.table?.header || "")
                .split(",")
                .filter(Boolean)
                .map((h, i) => ({
                  title: h.trim(),
                  dataIndex: `col${i}`,
                  key: `col${i}`,
                }))}
              dataSource={(section.table?.rows || []).map((row, ri) => {
                const rowObj = { key: ri };
                row.forEach((cell, ci) => {
                  rowObj[`col${ci}`] = cell;
                });
                return rowObj;
              })}
            />
          </div>
        );

      case "imageLeft":
      case "imageRight":
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: section.type === "imageLeft" ? "row" : "row-reverse",
              alignItems: "center",
              gap: "24px",
              margin: "40px 0",
              flexWrap: "wrap",
            }}
          >
            {section.image && (
              <img
                src={section.image}
                alt={section.title?.en}
                style={{ maxWidth: "400px", borderRadius: "8px" }}
              />
            )}
            <div style={{ flex: 1 }}>
              <Title level={3}>{section.title?.en}</Title>
              <Paragraph>{section.description?.en}</Paragraph>
            </div>
          </div>
        );

      default:
        return (
          <div key={idx}>
            ⚠ Unsupported section type: {section.type}
          </div>
        );
    }
  };

  return (
    <div className="machine-page" style={{ padding: "30px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title>{page.title?.en}</Title>
        <Paragraph>{page.description?.en}</Paragraph>
        {page.banner && (
          <img
            src={page.banner}
            alt={page.title?.en}
            style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "20px" }}
          />
        )}
      </div>

      <Divider />

      {page.sections?.map((s, i) => renderSection(s, i))}
    </div>
  );
};

export default MachinePage;
