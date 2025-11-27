import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Upload,
  Select,
  message,
  Card,
  Tabs,
  Collapse,
  Space,
  Steps,
  Modal,
} from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  FileAddOutlined,
  SettingOutlined,
  RightOutlined,
  LeftOutlined,
  CheckCircleOutlined,
  TableOutlined,
  PictureOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { ReloadOutlined } from "@ant-design/icons";
import { Trash2 } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { getMachineCategories, createMachinePage } from "../Api/api";
import RichTextEditor from "../components/RichTextEditor";
import { Row, Col } from "antd";
import "../assets/css/LanguageTabs.css";
import DeleteConfirm from "../components/DeleteConfirm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomStepper from "../components/CustomStepper";
// ===================== 🔧 FIXED QUILL REGISTRATION =====================
// ===================== 🔧 FIXED QUILL REGISTRATION =====================
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// ✅ Ensure Quill’s default formats and keyboard bindings are registered
const List = Quill.import("formats/list");
const Indent = Quill.import("formats/indent");
Quill.register(List, true);
Quill.register(Indent, true);

// ✅ Define shared modules and formats (no repetition)
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
  keyboard: {
    bindings: {
      handleEnter: {
        key: 13, // Enter key
        handler: function (range, context) {
          const quill = this.quill;
          if (context.format.list) {
            quill.format("list", context.format.list);
            quill.insertText(range.index, "\n");
            quill.setSelection(range.index + 1, 0);
          } else {
            quill.insertText(range.index, "\n");
            quill.setSelection(range.index + 1, 0);
          }
        },
      },
    },
  },
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
const { TextArea } = Input;
const { Step } = Steps;

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ---------- Translation Inputs ---------- */
const TranslationInput = ({
  value = { en: "", vi: "" },
  onChange,
  placeholder,
}) => (
  <Row gutter={12}>
    <Col span={12}>
      <h3 className="text-white mt-5 text-md">
        <span className="text-xs">English</span>
      </h3>
      <Input
        className="custom-dark-input"
        style={{
          backgroundColor: "#262626",
          border: "1px solid #2E2F2F",
          borderRadius: "8px",
          color: "#fff",
          padding: "10px 14px",
          fontSize: "14px",
          transition: "all 0.3s ease",
        }}
        placeholder={placeholder}
        value={value?.en}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
      />
    </Col>
    <Col span={12}>
      <h3 className="text-white mt-5 text-md">
        <span className="text-xs">tiếng việt</span>
      </h3>
      <Input
        className="custom-dark-input"
        style={{
          backgroundColor: "#262626",
          border: "1px solid #2E2F2F",
          borderRadius: "8px",
          color: "#fff",
          padding: "10px 14px",
          fontSize: "14px",
          transition: "all 0.3s ease",
        }}
        placeholder={placeholder}
        value={value?.vi}
        onChange={(e) => onChange({ ...value, vi: e.target.value })}
      />
    </Col>
  </Row>
);

const TranslationTextArea = ({
  value = { en: "", vi: "" },
  onChange,
  placeholder,
}) => (
  <Row gutter={12}>
    <Col span={12}>
      <h3 className="text-white mt-5 text-md">
        <span className="text-xs">English</span>
      </h3>
      <TextArea
        className="custom-dark-input"
        style={{
          backgroundColor: "#262626",
          border: "1px solid #2E2F2F",
          borderRadius: "8px",
          color: "#fff",
          padding: "10px 14px",
          fontSize: "14px",
          transition: "all 0.3s ease",
        }}
        placeholder={placeholder}
        value={value?.en}
        rows={3}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
      />
    </Col>
    <Col span={12}>
      <h3 className="text-white mt-5">
        <span className="text-xs">tiếng việt</span>
      </h3>
      <TextArea
        className="custom-dark-input"
        style={{
          backgroundColor: "#262626",
          border: "1px solid #2E2F2F",
          borderRadius: "8px",
          color: "#fff",
          padding: "10px 14px",
          fontSize: "14px",
          transition: "all 0.3s ease",
        }}
        placeholder={placeholder}
        value={value?.vi}
        rows={3}
        onChange={(e) => onChange({ ...value, vi: e.target.value })}
      />
    </Col>
  </Row>
);

/* ---------- Section Toolbar ---------- */
const SectionToolbar = ({ onAdd }) => (
  <Space wrap>
    <Button
      icon={<FileTextOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("text")}
    >
      Title & Description
    </Button>

    <Button
      icon={<FileAddOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("richtext")}
    >
      Rich Text
    </Button>

    <Button
      icon={<AppstoreOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("list")}
    >
      List
    </Button>

    {/* <Button
      icon={<PlusOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("blocks")}
    >
      Blocks
    </Button> */}

    <Button
      icon={<AppstoreOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("tabs")}
    >
      Tabs
    </Button>

    <Button
      icon={<TableOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("table")}
    >
      Table
    </Button>

    <Button
      icon={<PictureOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("imageLeft")}
    >
      Image Left
    </Button>

    <Button
      icon={<PictureOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("imageRight")}
    >
      Image Right
    </Button>

    <Button
      icon={<PictureOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("image")}
    >
      Image
    </Button>
    <Button
      icon={<PlusOutlined />}
      style={{
        backgroundColor: "#262626",
        borderColor: "#2E2F2F",
        borderRadius: "2rem",
        fontWeight: 600,
        color: "#fff",
        padding: "22px",
        transition: "all 0.3s ease",
      }}
      onClick={() => onAdd("button")}
    >
      Button
    </Button>
  </Space>
);

/* ---------- Helpers ---------- */
const newBlankSection = (type) => ({
  type,
  title: { en: "", vi: "" },
  description: { en: "", vi: "" },
  richtext: { en: "", vi: "" },
  listTitle: { en: "", vi: "" },
  listItems: [],
  blocks: [],
  tabs: [],
  table: { header: "", rows: [] },
  image: "",
  button: { name: { en: "", vi: "" }, link: "" },
});

/* ---------- Section Editor ---------- */
const SectionEditor = ({ basePath, section, control }) => {
  switch (section.type) {
    case "text":
      return (
        <>
          <Controller
            name={`${basePath}.title`}
            control={control}
            render={({ field }) => (
              <TranslationInput {...field} placeholder="Section Title" />
            )}
          />
          <Controller
            name={`${basePath}.description`}
            control={control}
            render={({ field }) => (
              <TranslationTextArea {...field} placeholder="Description" />
            )}
          />
        </>
      );

    case "richtext":
      return (
        <>
          <p className="font-medium mb-1 text-white">Rich Text EN</p>

          <Controller
            name={`${basePath}.richtext.en`}
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                modules={quillModules}
                formats={quillFormats}
              />
            )}
          />

          <p className="font-medium mt-3 mb-1 text-white">Rich Text VN</p>
          <Controller
            name={`${basePath}.richtext.vi`}
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                modules={quillModules}
                formats={quillFormats}
              />
            )}
          />
        </>
      );

    case "list":
      return (
        <>
          {/* List Title (EN + VN) */}
          <Controller
            name={`${basePath}.listTitle`}
            control={control}
            render={({ field }) => (
              <Card size="small" className=" text-white">
                <TranslationInput
                  value={field.value || { en: "", vi: "" }}
                  placeholder="List Title"
                  onChange={field.onChange}
                />
              </Card>
            )}
          />

          {/* List Items */}
          <Controller
            name={`${basePath}.listItems`}
            control={control}
            render={({ field }) => (
              <>
                <Button
                  onClick={() =>
                    field.onChange([...(field.value || []), { en: "", vi: "" }])
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#0284C7", // blue background
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "9999px", // pill shape
                    fontWeight: "500",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginTop: "20px",
                  }}
                >
                  <PlusOutlined /> Add List Item
                </Button>

                {(field.value || []).map((item, i) => (
                  <Card size="small" key={i} className="mt-2">
                    <TranslationInput
                      value={item}
                      placeholder={`List Item ${i + 1}`}
                      onChange={(val) => {
                        const list = [...(field.value || [])];
                        list[i] = val;
                        field.onChange(list);
                      }}
                    />
                  </Card>
                ))}
              </>
            )}
          />
        </>
      );

    case "blocks":
      return (
        <Controller
          name={`${basePath}.blocks`}
          control={control}
          render={({ field }) => (
            <>
              <Button
                onClick={() =>
                  field.onChange([
                    ...(field.value || []),
                    {
                      title: { en: "", vi: "" },
                      description: { en: "", vi: "" },
                      image: "",
                    },
                  ])
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#0284C7", // blue
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "9999px", // pill shape
                  fontWeight: "500",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <PlusOutlined /> Add Block
              </Button>

              {(field.value || []).map((block, bi) => (
                <Card size="small" key={bi} className="mt-2">
                  <TranslationInput
                    value={block.title}
                    placeholder="Block Title"
                    onChange={(val) => {
                      const blocks = [...(field.value || [])];
                      blocks[bi] = { ...blocks[bi], title: val };
                      field.onChange(blocks);
                    }}
                  />
                  <TranslationTextArea
                    value={block.description}
                    placeholder="Block Description"
                    onChange={(val) => {
                      const blocks = [...(field.value || [])];
                      blocks[bi] = { ...blocks[bi], description: val };
                      field.onChange(blocks);
                    }}
                  />
                  {/* ✅ Block Image Upload */}
                  <h3 className="mt-5 text-white mb-2">Upload Image</h3>
                  <Upload
                    beforeUpload={() => false}
                    listType="picture-card"
                    fileList={
                      block.image
                        ? [
                            {
                              uid: `block-${bi}`,
                              name: block.image.name || "image.png",
                              status: "done",
                              url:
                                typeof block.image === "string"
                                  ? block.image
                                  : undefined,
                              originFileObj:
                                block.image instanceof File
                                  ? block.image
                                  : block.image?.originFileObj,
                            },
                          ]
                        : []
                    }
                    onChange={({ fileList }) => {
                      const file = fileList[0];
                      const blocks = [...(field.value || [])];
                      blocks[bi] = {
                        ...blocks[bi],
                        image: file?.originFileObj || file?.url || "",
                      };
                      field.onChange(blocks);
                    }}
                  >
                    {!block.image && (
                      <div>
                        <PlusOutlined className="text-white" />
                        <div className="text-white">Upload</div>
                      </div>
                    )}
                  </Upload>
                </Card>
              ))}
            </>
          )}
        />
      );

    case "imageLeft":
    case "imageRight":
    case "image":
      return (
        <div className="space-y-4">
          {/* ✅ Title (EN + VN) */}
          <Controller
            name={`${basePath}.title`}
            control={control}
            render={({ field }) => (
              <TranslationInput
                value={field.value || { en: "", vi: "" }}
                placeholder="Image Title"
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name={`${basePath}.description.en`}
            control={control}
            render={({ field }) => (
              <>
                <p className="font-medium mb-1 text-white">Description (EN)</p>
                <ReactQuill
                  theme="snow"
                  value={field.value || ""}
                  onChange={field.onChange}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </>
            )}
          />

          <Controller
            name={`${basePath}.description.vi`}
            control={control}
            render={({ field }) => (
              <>
                <p className="font-medium mt-3 mb-1 text-white">
                  Sự miêu tả (VN)
                </p>
                <ReactQuill
                  theme="snow"
                  value={field.value || ""}
                  onChange={field.onChange}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </>
            )}
          />

          {/* ✅ Image Upload */}

          <h3 className="text-white mb-2 ">Upload Image</h3>
          <Controller
            name={`${basePath}.image`}
            control={control}
            render={({ field }) => (
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                fileList={
                  field.value
                    ? [
                        {
                          uid: "-1",
                          name: field.value.name || "image.png",
                          status: "done",
                          url:
                            typeof field.value === "string"
                              ? field.value
                              : undefined,
                          originFileObj:
                            field.value instanceof File
                              ? field.value
                              : field.value?.originFileObj,
                        },
                      ]
                    : []
                }
                onChange={({ fileList }) => {
                  const file = fileList[0];
                  field.onChange(file?.originFileObj || file?.url || "");
                }}
              >
                {!field.value && (
                  <div>
                    <PlusOutlined style={{ color: "#fff" }} />
                    <div className="text-white">Upload Image</div>
                  </div>
                )}
              </Upload>
            )}
          />
        </div>
      );

    case "tabs": {
      const {
        fields: tabFields,
        append: appendTab,
        remove: removeTab,
      } = useFieldArray({ control, name: `${basePath}.tabs` });

      return (
        <>
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              appendTab({ tabTitle: { en: "", vi: "" }, sections: [] })
            }
            style={{
              borderRadius: "999px",
              fontWeight: 500,
              color: "#fff",
              background: "#0288d1",
              border: "1px solid #0288d1",
              padding: "10px 24px",
              height: "auto",
              marginBottom: "20px",
            }}
          >
            Add New Tab
          </Button>

          <Tabs
            className="mt-6 pill-tabs"
            items={tabFields.map((tab, ti) => ({
              key: tab.id,
              label: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{tab.tabTitle?.en || `Tab ${ti + 1}`}</span>
                  <CloseOutlined
                    style={{
                      color: "red", // 🔴 red cross
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // don’t switch tab when clicking X
                      removeTab(ti); // remove tab
                    }}
                  />
                </div>
              ),
              children: (
                <>
                  <Controller
                    name={`${basePath}.tabs.${ti}.tabTitle`}
                    control={control}
                    render={({ field }) => (
                      <TranslationInput {...field} placeholder="Tab Title" />
                    )}
                  />
                  <div className="my-3">
                    <TabSectionsEditor
                      basePath={`${basePath}.tabs.${ti}.sections`}
                      control={control}
                    />
                  </div>
                </>
              ),
            }))}
          />
        </>
      );
    }

    case "table":
      return (
        <>
          {/* ✅ Table Header with EN/VN */}
          <Controller
            name={`${basePath}.table.header`}
            control={control}
            render={({ field }) => (
              <TranslationInput
                {...field}
                placeholder="Table Title (e.g., Specifications)"
              />
            )}
          />

          {/* ✅ Table Rows with EN/VN per cell */}
          <Controller
            name={`${basePath}.table.rows`}
            control={control}
            render={({ field }) => (
              <div className="mt-3">
                {(field.value || []).map((row, ri) => (
                  <Card size="small" key={ri} className="mt-2">
                    <div className="flex flex-col gap-3">
                      {/* Each Cell with Remove option */}
                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className="grid grid-cols-2 items-end gap-2"
                        >
                          <TranslationInput
                            value={cell}
                            placeholder={`Cell ${ci + 1}`}
                            onChange={(val) => {
                              const rows = [...field.value];
                              rows[ri][ci] = val;
                              field.onChange(rows);
                            }}
                          />

                          <Button
                            size="small"
                            icon={<Trash2 width={20} />}
                            style={{
                              borderRadius: "999px",
                              fontWeight: 500,
                              background: "#E50000", // red
                              color: "#fff",
                              border: "none",
                              padding: "10px 26px",
                              height: "auto",
                            }}
                            onClick={() => {
                              const rows = [...field.value];
                              rows[ri].splice(ci, 1); // remove that cell
                              field.onChange(rows);
                            }}
                          ></Button>
                        </div>
                      ))}

                      {/* Row-level actions */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="small"
                          icon={<PlusOutlined />}
                          style={{
                            borderRadius: "999px",
                            fontWeight: 500,
                            background: "#171717",
                            color: "#fff",
                            padding: "12px 20px",
                            height: "auto",
                            border: "1px solid #2E2F2F",
                          }}
                          onClick={() => {
                            const rows = [...field.value];
                            rows[ri].push({ en: "", vi: "" }); // add new EN+VN cell
                            field.onChange(rows);
                          }}
                        >
                          Add Cell
                        </Button>

                        <Button
                          size="small"
                          icon={<Trash2 class="w-14" />}
                          style={{
                            borderRadius: "999px",
                            fontWeight: 500,
                            background: "#E50000",
                            color: "#fff",
                            border: "none",
                            padding: "12px 20px",
                            height: "auto",
                          }}
                          onClick={() => {
                            const rows = [...field.value];
                            rows.splice(ri, 1); // remove whole row
                            field.onChange(rows);
                          }}
                        >
                          Remove Row
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Add new row button */}
                <Button
                  type="dashed"
                  block={false}
                  icon={<PlusOutlined />}
                  style={{
                    borderRadius: "999px",
                    background: "#0288d1",
                    border: "none",
                    color: "#fff",
                    fontWeight: 500,
                    padding: "10px 20px",
                    height: "auto",
                    marginTop: "20px",
                  }}
                  onClick={() =>
                    field.onChange([
                      ...(field.value || []),
                      [{ en: "", vi: "" }],
                    ])
                  }
                >
                  Add New Row
                </Button>
              </div>
            )}
          />
        </>
      );

    case "button":
      return (
        <div className="space-y-4">
          {/* ✅ Button Label (EN + VN) */}
          <Controller
            name={`${basePath}.button.name`}
            control={control}
            render={({ field }) => (
              <TranslationInput
                value={field.value || { en: "", vi: "" }}
                placeholder="Button Label"
                onChange={field.onChange}
              />
            )}
          />

          {/* ✅ Button Link */}
          <Controller
            name={`${basePath}.button.link`}
            control={control}
            render={({ field }) => (
              <Input
                className="custom-dark-input"
                style={{
                  backgroundColor: "#262626",
                  border: "1px solid #2E2F2F",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                {...field}
                placeholder="Enter button link (e.g. https://example.com/download)"
              />
            )}
          />

          {/* ✅ Optional Alignment Dropdown */}
          <Controller
            name={`${basePath}.button.align`}
            control={control}
            render={({ field }) => (
              <select
                style={{
                  color: "#fff",
                  marginTop: "10px",
                }}
                {...field}
                className="px-3 py-2  text-sm border border-[#2E2F2F] bg-[#1F1F1F] text-white rounded-lg outline-none cursor-pointer"
              >
                <option className="text-white" value="center">
                  Center
                </option>
                <option className="text-white" value="left">
                  Left
                </option>
                <option className="text-white" value="right">
                  Right
                </option>
              </select>
            )}
          />
        </div>
      );

    default:
      return <p>⚠ Unsupported section type: {section.type}</p>;
  }
};

/* ---------- Tab Sections Editor ---------- */
/* ---------- Tab Sections Editor ---------- */
const TabSectionsEditor = ({ basePath, control }) => {
  const { fields, append, remove } = useFieldArray({ name: basePath, control });

  return (
    <>
      {/* Toolbar for adding new sections inside a Tab */}
      <SectionToolbar onAdd={(type) => append(newBlankSection(type))} />

      {/* Collapsible child sections */}
      <Collapse
        accordion
        items={fields.map((s, i) => ({
          key: s.id,
          label: `Child Section (${s.type})`,
          extra: (
            // ✅ Use DeleteConfirm here instead of Trash2 directly
            <DeleteConfirm
              onConfirm={() => remove(i)} // handle confirmed delete
            />
          ),
          children: (
            <SectionEditor
              basePath={`${basePath}.${i}`}
              section={s}
              control={control}
            />
          ),
        }))}
      />
    </>
  );
};

/* ---------- Main Component ---------- */
const MachinePageCreate = ({
  onSuccess,
  initialData,
  isEdit = false,
  onSubmitUpdate,
}) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      categoryId: "",
      title: { en: "", vi: "" },
      description: { en: "", vi: "" },
      slug: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      sections: [],
    },
  });

  // ✅ Automatically generate slug from English title and make it readonly
  const title = watch("title");

  useEffect(() => {
    if (title?.en) {
      setValue("slug", slugify(title.en), { shouldValidate: true });
    } else {
      setValue("slug", "");
    }
  }, [title?.en]);

  const {
    fields: sections,
    append,
    remove,
  } = useFieldArray({ control, name: "sections" });

  // 🌐 Detect language from body class
  const [isVietnamese, setIsVietnamese] = useState(false);

  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // 🌐 Two-language steps list (auto updates)
  const stepsList = [
    { title: isVietnamese ? "Thông tin cơ bản" : "Basic Info" },
    { title: isVietnamese ? "Các phần" : "Sections" },
    { title: isVietnamese ? "SEO & Tạo" : "SEO & Create" },
  ];

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [bannerFile, setBannerFile] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMachineCategories();
        setCategories(res?.data?.data || []);
      } catch {
        message.error("Failed to load machine categories ❌");
      }
    })();
  }, []);

  useEffect(() => {
    if (initialData) {
      const API_BASE =
        import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
        " https://api.cotco-vn.com";

      // Normalize image URLs (banner, sections, blocks, tabs)
      const normalizedSections = (initialData.sections || []).map((s) => {
        const newSection = { ...s };

        // Section image
        if (newSection.image && !newSection.image.startsWith("http")) {
          newSection.image = `${API_BASE}${newSection.image}`;
        }

        // Blocks image
        if (Array.isArray(newSection.blocks)) {
          newSection.blocks = newSection.blocks.map((block) => ({
            ...block,
            image:
              block.image && !block.image.startsWith("http")
                ? `${API_BASE}${block.image}`
                : block.image,
          }));
        }

        // Tabs → Sections → image
        if (Array.isArray(newSection.tabs)) {
          newSection.tabs = newSection.tabs.map((tab) => ({
            ...tab,
            sections: Array.isArray(tab.sections)
              ? tab.sections.map((subSection) => ({
                  ...subSection,
                  image:
                    subSection.image && !subSection.image.startsWith("http")
                      ? `${API_BASE}${subSection.image}`
                      : subSection.image,
                }))
              : [],
          }));
        }

        return newSection;
      });

      // ✅ Reset all form fields
      reset({
        categoryId: initialData.categoryId || "",
        title: initialData.title || { en: "", vi: "" },
        description: initialData.description || { en: "", vi: "" },
        slug: initialData.slug || "",
        metaTitle: initialData.seo?.metaTitle || initialData.metaTitle || "",
        metaDescription:
          initialData.seo?.metaDescription || initialData.metaDescription || "",
        keywords: Array.isArray(initialData.seo?.keywords)
          ? initialData.seo.keywords.join(", ")
          : initialData.keywords || "",
        sections: normalizedSections,
      });

      // ✅ Banner image preview
      if (initialData.banner) {
        const imageUrl = initialData.banner.startsWith("http")
          ? initialData.banner
          : `${API_BASE}${initialData.banner}`;

        setBannerFile([
          {
            uid: "-1",
            name: "banner.png",
            status: "done",
            url: imageUrl,
          },
        ]);
      }
    }
  }, [initialData, reset]);

  useEffect(() => {
    return () => {
      // revoke blob URL when leaving the page to avoid memory leaks
      bannerFile.forEach((file) => {
        if (file?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [bannerFile]);

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("categoryId", values.categoryId);
      formData.append("title", JSON.stringify(values.title));
      formData.append(
        "description",
        JSON.stringify(values.description || { en: "", vi: "" })
      );
      formData.append("slug", values.slug);

      const seo = {
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        keywords: values.keywords
          ? values.keywords.split(",").map((k) => k.trim())
          : [],
      };
      formData.append("seo", JSON.stringify(seo));

      if (bannerFile.length > 0) {
        formData.append("banner", bannerFile[0].originFileObj);
      }

      // Handle sections + nested images
      const sections = values.sections.map((s, i) => {
        if (["image", "imageLeft", "imageRight"].includes(s.type) && s.image) {
          const fieldName = `sectionImage_${i}`;
          const file = s.image.originFileObj || s.image;
          if (file instanceof File) {
            formData.append(fieldName, file);
            return { ...s, image: fieldName };
          }
        }

        if (s.type === "blocks" && Array.isArray(s.blocks)) {
          const updatedBlocks = s.blocks.map((block, bi) => {
            if (block.image) {
              const blockKey = `section_${i}_block_${bi}`;
              const file = block.image.originFileObj || block.image;
              if (file instanceof File) {
                formData.append(blockKey, file);
                return { ...block, image: blockKey };
              }
            }
            return block;
          });
          return { ...s, blocks: updatedBlocks };
        }

        if (s.type === "tabs" && Array.isArray(s.tabs)) {
          const updatedTabs = s.tabs.map((tab, ti) => {
            const updatedSections = tab.sections.map((subSection, si) => {
              if (
                ["image", "imageLeft", "imageRight"].includes(
                  subSection.type
                ) &&
                subSection.image
              ) {
                const tabImgKey = `section_${i}_tab_${ti}_section_${si}`;
                const file = subSection.image.originFileObj || subSection.image;
                if (file instanceof File) {
                  formData.append(tabImgKey, file);
                  return { ...subSection, image: tabImgKey };
                }
              }
              return subSection;
            });
            return { ...tab, sections: updatedSections };
          });
          return { ...s, tabs: updatedTabs };
        }

        return s;
      });

      formData.append("sections", JSON.stringify(sections));

      // ✅ CREATE vs UPDATE
      if (isEdit) {
        await onSubmitUpdate(formData);
        toast.success("Page updated successfully ✅");
      } else {
        const res = await createMachinePage(formData);
        toast.success("Page created successfully 🎉");
        if (onSuccess) onSuccess(res?.data);
        reset(); // clear form after create
      }
    } catch (err) {
      console.error("Form submit error:", err);
      let userMessage = "Something went wrong. Please try again.";
      if (err?.response?.status === 400)
        userMessage = "Some fields are missing or invalid.";
      else if (err?.response?.status === 401)
        userMessage = "You are not authorized.";
      else if (err?.response?.status === 404)
        userMessage = "Requested resource not found.";
      else if (err?.response?.status === 500)
        userMessage = "Server error. Please try again later.";
      toast.error(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const watchTitleEn = watch("title.en");
  const watchSlug = watch("slug");

  useEffect(() => {
    if (!watchSlug || watchSlug.trim() === "") {
      if (watchTitleEn) {
        setValue("slug", slugify(watchTitleEn), { shouldValidate: true });
      }
    }
  }, [watchTitleEn]);

  return (
    <div className="p-6 min-h-screen edit-form">
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <Button
          icon={<LeftOutlined />}
          onClick={() => window.history.back()} // or use navigate(-1)
          style={{
            borderRadius: "2rem",
            fontWeight: 500,
            background: "#171717",
            color: "#fff",
            border: "1px solid #2d2d2d",
          }}
        >
          {isVietnamese ? "Quay lại" : "Back"}
        </Button>
      </div>
      <Card className="mb-6 shadow-md bg-[#171717] border border-[#2E2F2F]">
        <CustomStepper
          steps={stepsList}
          currentStep={step}
          onStepChange={setStep}
        />
      </Card>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-[#171717] rounded-2xl"
      >
        {step === 0 && (
          <Card
            title={isVietnamese ? "Thông tin cơ bản" : "Basic Information"}
            className="shadow-md"
          >
            {/* ✅ Category Dropdown */}
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => {
                const [showDropdown, setShowDropdown] = useState(false);
                return (
                  <div className="relative w-72">
                    <button
                      type="button"
                      onClick={() => setShowDropdown((p) => !p)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#272626] border border-[#3A3A3A] !text-gray-200 hover:border-gray-500 transition-all"
                    >
                      <span>
                        {categories.find((c) => c._id === field.value)?.name
                          ?.en || "Select category"}
                      </span>
                      <svg
                        className={`ml-2 w-4 h-4 transform transition-transform ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showDropdown && (
                      <div className="absolute w-full mt-2 bg-[#1F1F1F] border border-[#2E2F2F] rounded-xl z-20 shadow-lg max-h-60 overflow-y-auto">
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => {
                              field.onChange(cat._id);
                              setShowDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-md transition ${
                              field.value === cat._id
                                ? "bg-[#2E2F2F] !text-white"
                                : "!text-gray-300 hover:bg-[#2A2A2A]"
                            }`}
                          >
                            {cat.name?.en}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <br />

            {/* ✅ Title (EN + VN) */}
            <Controller
              name="title"
              control={control}
              defaultValue={{ en: "", vi: "" }} // ✅ Important!
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TranslationInput
                  value={field.value || { en: "", vi: "" }}
                  onChange={field.onChange}
                  placeholder="Page Title"
                />
              )}
            />
            <br />

            {/* ✅ Description (EN + VN) */}
            {/* <Controller
              name="description"
              control={control}
              defaultValue={{ en: "", vi: "" }} // ✅ Important!
              render={({ field }) => (
                <TranslationTextArea
                  value={field.value || { en: "", vi: "" }}
                  onChange={field.onChange}
                  placeholder="Page Description"
                />
              )}
            /> */}
            <br />

            {/* ✅ Slug */}
            <h3 className="text-white text-md">Slug</h3>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  readOnly
                  className="custom-dark-input"
                  style={{
                    backgroundColor: "#262626",
                    border: "1px solid #2E2F2F",
                    borderRadius: "8px",
                    color: "#aaa", // make it look slightly dimmed to indicate readonly
                    padding: "10px 14px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  placeholder="Slug will be generated automatically"
                />
              )}
            />

            {/* ✅ Fixed Banner Upload */}
            <div className="mt-4">
              <h3 className="mb-2 font-medium text-white">
                Meta Image / Banner
              </h3>

              <Controller
                name="banner"
                control={control}
                render={({ field }) => {
                  const file = field.value;
                  const fileUrl =
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : typeof file === "string"
                      ? file
                      : bannerFile[0]?.url || "";

                  return (
                    <>
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const newFile = e.target.files[0];
                          if (newFile) {
                            field.onChange(newFile); // save into form
                            const previewUrl = URL.createObjectURL(newFile);

                            // revoke old blob if needed
                            if (bannerFile[0]?.url?.startsWith("blob:")) {
                              URL.revokeObjectURL(bannerFile[0].url);
                            }

                            setBannerFile([
                              { originFileObj: newFile, url: previewUrl },
                            ]);
                          }
                        }}
                        style={{ display: "none" }}
                      />

                      {/* Upload / Preview */}
                      <div className="flex flex-wrap gap-4 mt-2">
                        {!file && bannerFile.length === 0 && (
                          <label
                            htmlFor="banner-upload"
                            className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg cursor-pointer transition-all duration-200 bg-[#1F1F1F] hover:bg-[#2A2A2A]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              className="w-8 h-8 text-gray-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span className="mt-2 text-sm text-gray-400">
                              Upload
                            </span>
                          </label>
                        )}

                        {(fileUrl || bannerFile[0]?.url) && (
                          <div className="relative w-40 h-40 group">
                            <img
                              src={fileUrl}
                              alt="Banner Preview"
                              className="w-full h-full object-cover rounded-lg border border-[#2E2F2F]"
                            />

                            {/* 👁 View full */}
                            <button
                              type="button"
                              onClick={() => setShowBannerModal(true)}
                              className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/80 !text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="View full image"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>

                            {/* 🔁 Replace */}
                            <label
                              htmlFor="banner-upload"
                              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="Replace image"
                            >
                              <ReloadOutlined />
                            </label>

                            {/* ❌ Remove */}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(null);
                                setBannerFile([]);
                              }}
                              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 !text-white p-1.5 rounded-full transition cursor-pointer"
                              title="Remove image"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Modal Preview */}
                      {showBannerModal && fileUrl && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                          <div className="relative max-w-4xl max-h-[90vh] w-auto">
                            <img
                              src={fileUrl}
                              alt="Full Preview"
                              className="max-h-[85vh] w-auto rounded-lg shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setShowBannerModal(false)}
                              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition cursor-pointer"
                              title="Close"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card title="Sections Builder" className="text-white">
            <div className="mb-4">
              <SectionToolbar onAdd={(type) => append(newBlankSection(type))} />
            </div>
            <Collapse
              accordion
              items={sections.map((s, i) => ({
                key: s.id,
                label: `Section (${s.type})`,
                // 👈 use it here
                extra: <DeleteConfirm onConfirm={() => remove(i)} />,
                children: (
                  <SectionEditor
                    basePath={`sections.${i}`}
                    section={s}
                    control={control}
                  />
                ),
              }))}
            />
          </Card>
        )}

        {step === 2 && (
          <Card title="SEO & Create" className="text-white">
            <div style={{ marginBottom: 16 }}>
              <Controller
                name="metaTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    className="custom-dark-input"
                    style={{
                      backgroundColor: "#262626",
                      border: "1px solid #2E2F2F",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "10px 14px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    {...field}
                    placeholder="Meta Title"
                  />
                )}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Controller
                name="metaDescription"
                control={control}
                render={({ field }) => (
                  <TextArea
                    className="custom-dark-input"
                    style={{
                      backgroundColor: "#262626",
                      border: "1px solid #2E2F2F",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "10px 14px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    {...field}
                    placeholder="Meta Description"
                    rows={2}
                  />
                )}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Controller
                name="keywords"
                control={control}
                render={({ field }) => (
                  <Input
                    className="custom-dark-input"
                    style={{
                      backgroundColor: "#262626",
                      border: "1px solid #2E2F2F",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "10px 14px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    {...field}
                    placeholder="Keywords (comma separated)"
                  />
                )}
              />
            </div>

            {/* ✅ Create Page Button now here */}
            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<CheckCircleOutlined />}
                style={{
                  borderRadius: "9999px", // pill shape for modern look
                  fontWeight: 600,
                  padding: "26px 36px",
                  background: "linear-gradient(135deg, #1677ff, #3b82f6)", // vibrant blue gradient
                  boxShadow: "0 6px 14px rgba(59,130,246,0.3)",
                  border: "none",
                  color: "#fff",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #0a66e5, #2563eb)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #1677ff, #3b82f6)")
                }
              >
                {isEdit ? "Update Page" : "Create Page"}
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card
            className="shadow-lg rounded-2xl border text-center bg-[#0A0A0A]"
            bodyStyle={{ padding: "40px" }}
          ></Card>
        )}

        <div className="flex items-center justify-between p-6">
          {step > 0 && (
            <Button
              onClick={() => setStep(step - 1)}
              size="large"
              icon={<LeftOutlined />}
              style={{
                borderRadius: "9999px", // pill shape
                fontWeight: 600,
                padding: "22px 36px",
                background: "#2E2F2F", // dark gray gradient
                color: "#fff",
                border: "none",
                transition: "all 0.3s ease",
              }}
            >
              Previous
            </Button>
          )}

          {step < 2 && ( // ✅ now only 3 steps total
            <Button
              type="primary"
              onClick={() => setStep(step + 1)}
              size="large"
              icon={<RightOutlined />}
              iconPosition="end"
              style={{
                borderRadius: "9999px", // pill shape
                fontWeight: 600,
                padding: "22px 36px",
                background: "#0085C8",
                border: "none",
                transition: "all 0.3s ease",
              }}
            >
              Next
            </Button>
          )}
        </div>
      </form>
      <style>
        {`
    .ql-editor {
      min-height: 250px;
      color: #000 !important;
    }

    .ql-container.ql-snow {
      border-radius: 0 0 0.5rem 0.5rem;
      background: #fff;
    }

    .ql-container.ql-snow {
      background: #ffffff;
      color: #fff;
    }

    .ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-header-text {
      color: white;
      font-weight: 600;
      font-size: 16px;
    }

    /* ✅ Sticky Quill toolbar */
    .ql-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      background: #fff;
      border-radius: 0.5rem 0.5rem 0 0;
      border-bottom: 1px solid #333;
    }

    .ql-container {
      max-height: 350px;
      overflow-y: auto;
    }

    label {
      color: #fff !important;
    }

    .ant-tabs-nav::before {
      border-bottom: 1px solid #2E2F2F !important;
    }

    .ant-collapse-header {
      padding: 20px 0 !important;
    }

    .ant-modal-close {
      background-color: red !important;
      border-radius: 50% !important;
      color: white !important;
    }
  `}
      </style>
    </div>
  );
};

export default MachinePageCreate;
