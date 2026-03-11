import React, { useState, useEffect } from "react";
import { Collapse, Button, Modal, Input, Tabs, Spin } from "antd";
import { Plus, Minus, RotateCw, Trash2 } from "lucide-react";
import { getKnowledge, updateKnowledge } from "../../Api/api";
import { toast } from "react-toastify"; // ✅ Use your existing global toast setup

const { Panel } = Collapse;
const { TabPane } = Tabs;

const KnowledgeManagementPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState("en");

  // 🌐 Detect language from body class / localStorage
  useEffect(() => {
    const detectLang = () => {
      if (document.body.classList.contains("vi-mode")) {
        setLang("vi");
      } else {
        setLang(localStorage.getItem("lang") || "en");
      }
    };

    detectLang();

    const observer = new MutationObserver(detectLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("languageChange", detectLang);

    return () => {
      observer.disconnect();
      window.removeEventListener("languageChange", detectLang);
    };
  }, []);

  // 🧠 Translations
  const t = {
    en: {
      pageTitle: "Chatbot Knowledge Management",
      addTopic: "Add Topic",
      noTopics: "No topics yet. Click “Add Topic” to create one.",
      title: "Title",
      points: "Points",
      enterTitle: "Enter English Title",
      enterPoint: "Enter point...",
      addPoint: "Add Point",
      saveBoth: "Save Both Languages",
      saving: "Saving...",
      reset: "Reset",
      confirmReset: "Confirm Reset",
      resetMsg: "Are you sure you want to clear all topics?",
      yesReset: "Yes, Reset",
      cancel: "Cancel",
    },
    vi: {
      pageTitle: "Quản lý Kiến thức Chatbot",
      addTopic: "Thêm Chủ đề",
      noTopics: "Chưa có chủ đề nào. Nhấn “Thêm Chủ đề” để tạo mới.",
      title: "Tiêu đề",
      points: "Các gạch đầu dòng",
      enterTitle: "Nhập Tiêu đề Tiếng Việt",
      enterPoint: "Nhập nội dung...",
      addPoint: "Thêm gạch đầu dòng",
      saveBoth: "Lưu cả hai ngôn ngữ",
      saving: "Đang lưu...",
      reset: "Đặt lại",
      confirmReset: "Xác nhận đặt lại",
      resetMsg: "Bạn có chắc chắn muốn xóa tất cả các chủ đề không?",
      yesReset: "Có, Đặt lại",
      cancel: "Hủy",
    },
  };

  // 🟢 Fetch both EN & VI files
  const fetchContent = async () => {
    try {
      const [enRes, viRes] = await Promise.all([
        getKnowledge({ lang: "en" }),
        getKnowledge({ lang: "vi" }),
      ]);

      const enText = enRes.data.content || "";
      const viText = viRes.data.content || "";

      const enTopics = parseTextToTopics(enText);
      const viTopics = parseTextToTopics(viText);

      const merged = mergeLangTopics(enTopics, viTopics);
      setTopics(merged);
    } catch (err) {
      console.error("Error fetching knowledge:", err);
      toast.error("Failed to load knowledge files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // 🧩 Parse plain text → topics array
  const parseTextToTopics = (text) => {
    const lines = text.split(/\n+/);
    const topicsArr = [];
    let current = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect topic title
      if (/^[A-Z].*:$/i.test(trimmed)) {
        if (current) topicsArr.push(current);
        current = { title: trimmed.replace(":", "").trim(), content: [] };
      } else if (current) {
        // ✅ Remove any existing leading "-" or "–" with spaces
        const cleaned = trimmed.replace(/^[-–]+\s*/, "");
        current.content.push(cleaned);
      }
    }

    if (current) topicsArr.push(current);
    return topicsArr;
  };

  // 🧠 Merge EN + VI arrays
  const mergeLangTopics = (enArr, viArr) => {
    const maxLen = Math.max(enArr.length, viArr.length);
    const merged = [];

    for (let i = 0; i < maxLen; i++) {
      merged.push({
        title: {
          en: enArr[i]?.title || `Topic ${i + 1}`,
          vi: viArr[i]?.title || enArr[i]?.title || `Chủ đề ${i + 1}`,
        },
        content: {
          en: enArr[i]?.content || [],
          vi: viArr[i]?.content || [],
        },
      });
    }

    return merged;
  };

  // ➕ Add a new topic
  const addTopic = () => {
    const newTopic = {
      title: { en: `New Topic ${topics.length + 1}`, vi: `Chủ đề ${topics.length + 1}` },
      content: { en: [""], vi: [""] },
    };
    setTopics([...topics, newTopic]);
  };

  // 🗑 Delete topic
  const removeTopic = (index) => {
    const updated = [...topics];
    updated.splice(index, 1);
    setTopics(updated);
  };

  // ➕ Add new line
  const addLine = (index, lang) => {
    const updated = [...topics];
    updated[index].content[lang].push("");
    setTopics(updated);
  };

  // ❌ Remove specific line
  const removeLine = (topicIndex, lang, lineIndex) => {
    const updated = [...topics];
    updated[topicIndex].content[lang].splice(lineIndex, 1);
    setTopics(updated);
  };

  // 🧾 Compile to text format
  const compileText = (lang) =>
    topics
      .map(
        (t) =>
          `${t.title[lang]}:\n${t.content[lang]
            .map((c) => (c ? `- ${c}` : ""))
            .join("\n")}`
      )
      .join("\n\n")
      .trim();

  // 💾 Save both languages
  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving knowledge files...");

    try {
      const enText = compileText("en");
      const viText = compileText("vi");

      const [enRes, viRes] = await Promise.all([
        updateKnowledge({
          lang: "en",
          content: enText,
        }),
        updateKnowledge({
          lang: "vi",
          content: viText,
        }),
      ]);

      if (enRes.data.success && viRes.data.success) {
        toast.update(toastId, {
          render: "Knowledge files (EN + VI) saved successfully!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(toastId, {
          render: "Failed to update one or both files.",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    } catch (err) {
      console.error("Error saving files:", err);
      toast.update(toastId, {
        render: "Error saving knowledge content.",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    } finally {
      setSaving(false);
    }
  };

  // 🔁 Reset all
  const confirmReset = () => {
    setTopics([]);
    setShowResetModal(false);
    toast.info("All topics cleared!");
  };

  if (loading)
    return (
      <div className="flex justify-center py-40">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 rounded-xl shadow-xl bg-[#171717] text-white">
      <style>{`
        label {
          color: #fff !important;
        }
        .ant-tabs-nav::before{
          border-bottom:1px solid #2E2F2F !important;
        }
        .ant-collapse-header{
          padding:20px 0 !important;
        }
        .ant-modal-close{
          background-color:red !important;
          border-radius:50% !important;
          color:white !important;
        }
        :where(.css-dev-only-do-not-override-1odpy5d).ant-modal .ant-modal-header{
          background:transparent;
        }
        :where(.css-dev-only-do-not-override-1odpy5d).ant-modal .ant-modal-title{
          color:#fff !important;
        }
        :where(.css-dev-only-do-not-override-1odpy5d).ant-modal .ant-modal-body{
          color:#fff !important; 
        }
        :where(.css-dev-only-do-not-override-1odpy5d).ant-btn-variant-outlined, 
        :where(.css-dev-only-do-not-override-1odpy5d).ant-btn-variant-dashed{
          background-color:#171717;
          color:#fff;
          border:1px solid #a3a3a3;
          border-radius:999px;
          padding:22px;
        }
        :where(.css-dev-only-do-not-override-1odpy5d).ant-modal .ant-modal-footer >.ant-btn+.ant-btn{
          border-radius:999px;
          padding:22px;
        }
          :where(.css-dev-only-do-not-override-1odpy5d).ant-collapse>.ant-collapse-item >.ant-collapse-header{
           color:#fff;
          }
           :where(.css-dev-only-do-not-override-198drv2).ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
            color:#000;
           }
            :where(.css-dev-only-do-not-override-198drv2).ant-modal .ant-modal-header{
              background-color:transparent;
            }
            :where(.css-dev-only-do-not-override-198drv2).ant-modal .ant-modal-title{
              color:#fff !important;
            }
            :where(.css-dev-only-do-not-override-198drv2).ant-modal .ant-modal-body{
              color:#fff !important;
            }
      `}</style>

      <h2 className="text-3xl font-bold mb-8 text-center">{t[lang].pageTitle}</h2>

      <div className="flex justify-end mb-4">
        <Button
          onClick={addTopic}
          style={{
            backgroundColor: "#0284C7",
            color: "#fff",
            border: "none",
            padding: "22px",
            borderRadius: "9999px",
          }}
        >
          <Plus size={16} /> {t[lang].addTopic}
        </Button>
      </div>

      {topics.length === 0 ? (
        <p className="text-gray-400 text-center py-20">{t[lang].noTopics}</p>
      ) : (
        <Collapse
          accordion={false}
          bordered={false}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                backgroundColor: isActive ? "#0284C7" : "#2E2F2F",
                borderRadius: "50%",
                color: "#fff",
              }}
            >
              {isActive ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          )}
        >
          {topics.map((topic, index) => (
            <Panel
              header={
                <div className="flex items-center justify-between w-full">
                  <span className="text-white">{topic.title.en || topic.title.vi}</span>
                  <Button
                    danger
                    size="small"
                    onClick={() => removeTopic(index)}
                    style={{
                      background: "#b91c1c",
                      color: "#fff !important",
                      border: "none",
                      marginLeft: "10px",
                      padding: "15px 20px",
                      borderRadius: "10px",
                    }}
                    className="!text-white"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              }
              key={index}
            >
              <Tabs defaultActiveKey="en" className="pill-tabs">
                {["en", "vi"].map((lg) => (
                  <TabPane
                    tab={lg === "en" ? "English (EN)" : "Vietnamese (VI)"}
                    key={lg}
                  >
                    <label className="block text-sm mb-2 font-medium">
                      {lg === "en" ? t[lang].title : t[lang].title}
                    </label>
                    <Input
                      value={topic.title[lg]}
                      onChange={(e) => {
                        const updated = [...topics];
                        updated[index].title[lg] = e.target.value;
                        setTopics(updated);
                      }}
                      placeholder={lg === "en" ? t[lang].enterTitle : t[lang].enterTitle}
                      style={{
                        backgroundColor: "#1f1f1f",
                        color: "#fff",
                        border: "1px solid #333",
                        borderRadius: "6px",
                        marginBottom: "15px",
                      }}
                    />

                    <label className="block text-sm mb-3 font-medium">
                      {lg === "en" ? t[lang].points : t[lang].points}
                    </label>
                    {topic.content[lg].map((point, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <Input
                          value={point}
                          onChange={(e) => {
                            const updated = [...topics];
                            updated[index].content[lg][i] = e.target.value;
                            setTopics(updated);
                          }}
                          placeholder={lg === "en" ? t[lang].enterPoint : t[lang].enterPoint}
                          style={{
                            backgroundColor: "#1f1f1f",
                            color: "#fff",
                            border: "1px solid #333",
                            borderRadius: "6px",
                          }}
                        />
                        {topic.content[lg].length > 1 && (
                          <Button
                            size="small"
                            onClick={() => removeLine(index, lg, i)}
                            style={{
                              backgroundColor: "#ef4444",
                              border: "none",
                              color: "#fff",
                              borderRadius: "6px",
                              padding: "15px 20px",
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={() => addLine(index, lg)}
                      style={{
                        backgroundColor: "#0284C7",
                        border: "none",
                        color: "#fff",
                        borderRadius: "6px",
                        marginTop: "5px",
                        borderRadius: "999px",
                      }}
                    >
                      <Plus size={14} /> {t[lang].addPoint}
                    </Button>
                  </TabPane>
                ))}
              </Tabs>
            </Panel>
          ))}
        </Collapse>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          onClick={() => setShowResetModal(true)}
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            border: "1px solid #333",
            padding: "22px 30px",
            borderRadius: "9999px",
          }}
        >
          <RotateCw size={16} /> {t[lang].reset}
        </Button>

        <Button
          type="primary"
          onClick={handleSave}
          loading={saving}
          disabled={saving}
          style={{
            backgroundColor: "#0284C7",
            border: "none",
            padding: "22px 30px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {saving ? t[lang].saving : t[lang].saveBoth}
        </Button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        title={t[lang].confirmReset}
        open={showResetModal}
        onOk={confirmReset}
        onCancel={() => setShowResetModal(false)}
        okText={t[lang].yesReset}
        cancelText={t[lang].cancel}
      >
        {t[lang].resetMsg}
      </Modal>
    </div>
  );
};

export default KnowledgeManagementPage;
