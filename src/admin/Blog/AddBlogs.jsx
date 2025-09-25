import { useEffect, useState } from "react";
import { getCategories, getSections, createPage } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import { CommonToaster } from "../../Common/CommonToaster";

export default function BlogCreate() {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    title: { en: "", vn: "" },
    slug: "",
    blocks: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories + sections on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        setCategories(catRes.data.data);

        const secRes = await getSections();
        setSections(secRes.data.data);
      } catch (err) {
        console.error("Error fetching:", err);
        CommonToaster("Failed to load categories/sections", "error");
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, lang, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [lang]: value,
      },
    });
  };

  const handleSlugChange = (e) => {
    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
  };

  // Add a new section block
  const addSection = (sectionType) => {
    const sectionDef = sections.find((s) => s.type === sectionType);
    if (!sectionDef) return;

    // Initialize values according to section fields
    const values = {};
    sectionDef.fields.forEach((field) => {
      if (field.type === "multilang") {
        values[field.key] = { en: "", vn: "" };
      } else if (field.type === "image") {
        values[field.key] = "";
      } else {
        values[field.key] = "";
      }
    });

    const newBlock = {
      sectionType: sectionType,
      values,
      position: formData.blocks.length + 1,
    };

    setFormData({ ...formData, blocks: [...formData.blocks, newBlock] });
  };

  // Handle value change inside blocks
  const handleBlockChange = (blockIndex, key, value, lang = null) => {
    const updatedBlocks = [...formData.blocks];
    if (lang) {
      updatedBlocks[blockIndex].values[key][lang] = value;
    } else {
      updatedBlocks[blockIndex].values[key] = value;
    }
    setFormData({ ...formData, blocks: updatedBlocks });
  };

  // Remove block
  const removeBlock = (index) => {
    const updatedBlocks = formData.blocks.filter((_, i) => i !== index);
    setFormData({ ...formData, blocks: updatedBlocks });
  };

  // Submit page
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createPage(formData);
      CommonToaster("Blog page created successfully!", "success");
      navigate("/blogs");
    } catch (err) {
      console.error("Create page error:", err);
      CommonToaster("Failed to create blog page", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Blog Page</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name.en} / {cat.name.vn}
              </option>
            ))}
          </select>
        </div>

        {/* Title EN/VN */}
        <div>
          <label className="block font-medium mb-2">Title (English)</label>
          <input
            type="text"
            value={formData.title.en}
            onChange={(e) => handleChange("title", "en", e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Title (Vietnamese)</label>
          <input
            type="text"
            value={formData.title.vn}
            onChange={(e) => handleChange("title", "vn", e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-medium mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="auto-generated-from-title"
          />
        </div>

        {/* Add Section */}
        <div>
          <label className="block font-medium mb-2">Add Section</label>
          <div className="flex space-x-4">
            {sections.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => addSection(s.type)}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                + {s.type}
              </button>
            ))}
          </div>
        </div>

        {/* Render Blocks */}
        {formData.blocks.map((block, index) => {
          const sectionDef = sections.find((s) => s.type === block.sectionType);
          return (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{block.sectionType.toUpperCase()}</h3>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              {sectionDef?.fields.map((field) => (
                <div key={field.key} className="mb-3">
                  {field.type === "multilang" ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.key} (EN)
                      </label>
                      <input
                        type="text"
                        value={block.values[field.key].en}
                        onChange={(e) =>
                          handleBlockChange(index, field.key, e.target.value, "en")
                        }
                        className="w-full border px-3 py-2 rounded-lg mb-2"
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        {field.key} (VN)
                      </label>
                      <input
                        type="text"
                        value={block.values[field.key].vn}
                        onChange={(e) =>
                          handleBlockChange(index, field.key, e.target.value, "vn")
                        }
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    </>
                  ) : field.type === "image" ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.key} (Image URL)
                      </label>
                      <input
                        type="text"
                        value={block.values[field.key]}
                        onChange={(e) =>
                          handleBlockChange(index, field.key, e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded-lg"
                        placeholder="/uploads/example.jpg"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.key}
                      </label>
                      <input
                        type="text"
                        value={block.values[field.key]}
                        onChange={(e) =>
                          handleBlockChange(index, field.key, e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-gradient-to-r from-[rgb(0,114,147)] to-[rgb(0,76,112)] hover:from-[rgb(0,100,130)] hover:to-[rgb(0,60,95)] disabled:opacity-75"
        >
          {isLoading ? "Saving..." : "Create Blog Page"}
        </button>
      </form>
    </div>
  );
}
