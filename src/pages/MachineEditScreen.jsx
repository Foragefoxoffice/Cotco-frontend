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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  FileAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { getMachineCategories, createMachinePage } from "../Api/api";
import RichTextEditor from "../components/RichTextEditor";

const { TextArea } = Input;
const { Step } = Steps;

/* ---------- Translation Components ---------- */
const TranslationInput = ({
  value = { en: "", vn: "" },
  onChange,
  placeholder,
}) => (
  <Tabs
    size="small"
    defaultActiveKey="en"
    items={[
      {
        key: "en",
        label: "EN",
        children: (
          <Input
            placeholder={placeholder}
            value={value?.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
        ),
      },
      {
        key: "vn",
        label: "VN",
        children: (
          <Input
            placeholder={placeholder}
            value={value?.vn}
            onChange={(e) => onChange({ ...value, vn: e.target.value })}
          />
        ),
      },
    ]}
  />
);

const TranslationTextArea = ({
  value = { en: "", vn: "" },
  onChange,
  placeholder,
}) => (
  <Tabs
    size="small"
    defaultActiveKey="en"
    items={[
      {
        key: "en",
        label: "EN",
        children: (
          <TextArea
            placeholder={placeholder}
            value={value?.en}
            rows={3}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
        ),
      },
      {
        key: "vn",
        label: "VN",
        children: (
          <TextArea
            placeholder={placeholder}
            value={value?.vn}
            rows={3}
            onChange={(e) => onChange({ ...value, vn: e.target.value })}
          />
        ),
      },
    ]}
  />
);

/* ---------- Section Toolbar ---------- */
const SectionToolbar = ({ onAdd }) => (
  <Space wrap>
    <Button onClick={() => onAdd("text")}>+ Text</Button>
    <Button onClick={() => onAdd("richtext")}>+ Rich Text</Button>
    <Button onClick={() => onAdd("list")}>+ List</Button>
    <Button onClick={() => onAdd("blocks")}>+ Blocks</Button>
    <Button onClick={() => onAdd("tabs")}>+ Tabs</Button>
    <Button onClick={() => onAdd("table")}>+ Table</Button>
    <Button onClick={() => onAdd("imageLeft")}>+ Image Left</Button>
    <Button onClick={() => onAdd("imageRight")}>+ Image Right</Button>
  </Space>
);

/* ---------- Helpers ---------- */
const newBlankSection = (type) => ({
  type,
  title: { en: "", vn: "" },
  description: { en: "", vn: "" },
  richtext: { en: "", vn: "" },
  listItems: [],
  blocks: [],
  tabs: [],
  table: { header: "", rows: [] },
  image: "",
});

/* ---------- Tab Sections Editor ---------- */
const TabSectionsEditor = ({ basePath, control }) => {
  const { fields, append, remove } = useFieldArray({
    name: basePath,
    control,
  });

  return (
    <>
      <SectionToolbar onAdd={(type) => append(newBlankSection(type))} />

      <Collapse
        accordion
        items={fields.map((s, i) => ({
          key: s.id,
          label: `Child Section (${s.type})`,
          extra: (
            <DeleteOutlined
              onClick={(e) => {
                e.stopPropagation();
                remove(i);
              }}
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

/* ---------- Section Editor (recursive) ---------- */
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
          <p className="font-medium mb-1">Rich Text EN</p>
          <Controller
            name={`${basePath}.richtext.en`}
            control={control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          <p className="font-medium mt-3 mb-1">Rich Text VN</p>
          <Controller
            name={`${basePath}.richtext.vn`}
            control={control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </>
      );

    case "list":
      return (
        <Controller
          name={`${basePath}.listItems`}
          control={control}
          render={({ field }) => (
            <>
              <Button
                type="dashed"
                onClick={() =>
                  field.onChange([...(field.value || []), { en: "", vn: "" }])
                }
              >
                + Add List Item
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
      );

    case "blocks":
      return (
        <Controller
          name={`${basePath}.blocks`}
          control={control}
          render={({ field }) => (
            <>
              <Button
                type="dashed"
                onClick={() =>
                  field.onChange([
                    ...(field.value || []),
                    {
                      title: { en: "", vn: "" },
                      description: { en: "", vn: "" },
                      image: "",
                    },
                  ])
                }
              >
                + Add Block
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
                </Card>
              ))}
            </>
          )}
        />
      );

    /* ✅ FIXED: Table */
    case "table":
      return (
        <>
          {/* Table Title */}
          <Controller
            name={`${basePath}.table.header`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Table Title (e.g., Specifications)"
              />
            )}
          />

          {/* Rows */}
          <Controller
            name={`${basePath}.table.rows`}
            control={control}
            render={({ field }) => (
              <div className="mt-3">
                <Button
                  type="dashed"
                  onClick={() => field.onChange([...(field.value || []), [""]])}
                >
                  + Add Row
                </Button>

                {(field.value || []).map((row, ri) => (
                  <Card size="small" key={ri} className="mt-2">
                    <div className="flex flex-col gap-2">
                      {row.map((cell, ci) => (
                        <Input
                          key={ci}
                          placeholder={`Cell ${ci + 1}`}
                          value={cell}
                          onChange={(e) => {
                            const rows = [...field.value];
                            rows[ri][ci] = e.target.value;
                            field.onChange(rows);
                          }}
                        />
                      ))}

                      <div className="flex gap-2 mt-2">
                        <Button
                          size="small"
                          onClick={() => {
                            const rows = [...field.value];
                            rows[ri].push("");
                            field.onChange(rows);
                          }}
                        >
                          + Add Cell
                        </Button>

                        <Button
                          size="small"
                          danger
                          onClick={() => {
                            const rows = [...field.value];
                            rows.splice(ri, 1);
                            field.onChange(rows);
                          }}
                        >
                          Remove Row
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          />
        </>
      );

    /* ✅ FIXED: Image Left & Right */
    case "imageLeft":
    case "imageRight":
      return (
        <>
          <Controller
            name={`${basePath}.title`}
            control={control}
            render={({ field }) => (
              <TranslationInput {...field} placeholder="Title" />
            )}
          />
          <Controller
            name={`${basePath}.description`}
            control={control}
            render={({ field }) => (
              <TranslationTextArea {...field} placeholder="Description" />
            )}
          />
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
                          name: "image.png",
                          status: "done",
                          url:
                            typeof field.value === "string"
                              ? field.value
                              : undefined,
                          originFileObj:
                            field.value instanceof File
                              ? field.value
                              : undefined,
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
                    <PlusOutlined />
                    <div>Upload Image</div>
                  </div>
                )}
              </Upload>
            )}
          />
        </>
      );

    /* ✅ Tabs already fixed in last version */
    case "tabs": {
      const {
        fields: tabFields,
        append: appendTab,
        remove: removeTab,
      } = useFieldArray({
        control,
        name: `${basePath}.tabs`,
      });

      return (
        <>
          <Button
            type="dashed"
            onClick={() =>
              appendTab({ tabTitle: { en: "", vn: "" }, sections: [] })
            }
          >
            + Add Tab
          </Button>

          <Tabs
            className="mt-3"
            items={tabFields.map((tab, ti) => ({
              key: tab.id,
              label: tab.tabTitle?.en || `Tab ${ti + 1}`,
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

                  <Button danger onClick={() => removeTab(ti)}>
                    Remove Tab
                  </Button>
                </>
              ),
            }))}
          />
        </>
      );
    }

    default:
      return <p>⚠ Unsupported section type: {section.type}</p>;
  }
};

/* ---------- Main ---------- */
const MachinePageCreate = ({ onSuccess }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      categoryId: "",
      title: { en: "", vn: "" },
      description: { en: "", vn: "" },
      slug: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      sections: [],
    },
  });

  const {
    fields: sections,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [bannerFile, setBannerFile] = useState([]);

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

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("categoryId", values.categoryId);
      formData.append("title", JSON.stringify(values.title));
      formData.append("description", JSON.stringify(values.description));
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

      // ✅ Clone sections safely
      const sections = values.sections.map((s, i) => {
        if (
          (s.type === "imageLeft" || s.type === "imageRight") &&
          s.image instanceof File
        ) {
          // give unique key for each image
          const fieldName = `sectionImage_${i}`;
          formData.append(fieldName, s.image);
          return { ...s, image: fieldName }; // store placeholder name
        }
        return s;
      });

      formData.append("sections", JSON.stringify(sections));

      await createMachinePage(formData);
      message.success("✅ Machine Page created");
      onSuccess?.();
      reset();
    } catch (err) {
      message.error(err?.response?.data?.error || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-md">
        <Steps current={step} onChange={setStep} responsive>
          <Step title="Basic Info" icon={<FileTextOutlined />} />
          <Step title="Sections" icon={<AppstoreOutlined />} />
          <Step title="SEO & Banner" icon={<SettingOutlined />} />
          <Step title="Review" icon={<FileAddOutlined />} />
        </Steps>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <Card title="Basic Information" className="shadow-md">
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select {...field} placeholder="Select category">
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name?.en}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TranslationInput {...field} placeholder="Page Title" />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TranslationTextArea
                  {...field}
                  placeholder="Page Description"
                />
              )}
            />

            <Controller
              name="slug"
              control={control}
              rules={{ required: "Slug is required" }}
              render={({ field }) => <Input {...field} placeholder="slug" />}
            />
          </Card>
        )}

        {step === 1 && (
          <Card title="Sections Builder" className="shadow-md">
            <div className="mb-4">
              <SectionToolbar onAdd={(type) => append(newBlankSection(type))} />
            </div>

            <Collapse
              accordion
              items={sections.map((s, i) => ({
                key: s.id,
                label: `Section (${s.type})`,
                extra: (
                  <DeleteOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                  />
                ),
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
          <Card title="SEO & Banner" className="shadow-md">
            <Controller
              name="metaTitle"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Meta Title" />
              )}
            />
            <Controller
              name="metaDescription"
              control={control}
              render={({ field }) => (
                <TextArea {...field} placeholder="Meta Description" rows={2} />
              )}
            />
            <Controller
              name="keywords"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Keywords (comma separated)" />
              )}
            />

            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              fileList={bannerFile}
              onChange={({ fileList }) => setBannerFile(fileList)}
            >
              {bannerFile.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Card>
        )}

        {step === 3 && (
          <Card title="Review & Create" className="shadow-md">
            <p className="text-gray-600">
              ✅ All set! Click <b>Create</b> to save your page.
            </p>
          </Card>
        )}

        <div className="flex justify-between mt-6">
          {step > 0 && <Button onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 3 && (
            <Button type="primary" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Page
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MachinePageCreate;
