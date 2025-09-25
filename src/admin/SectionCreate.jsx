import { useState } from "react";
import { createSection } from "../Api/api";
import { useNavigate } from "react-router-dom";
import { CommonToaster } from "../Common/CommonToaster";

export default function SectionCreate() {
  const [sectionType, setSectionType] = useState("");
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ key: "", type: "multilang" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddField = () => {
    if (!newField.key) return CommonToaster("Field key is required", "error");
    setFields([...fields, newField]);
    setNewField({ key: "", type: "multilang" });
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionType) return CommonToaster("Section type is required", "error");
    if (fields.length === 0) return CommonToaster("At least one field is required", "error");

    setIsLoading(true);
    try {
      await createSection({ type: sectionType, fields });
      CommonToaster("Section created successfully!", "success");
      navigate("/sections");
    } catch (err) {
      console.error("Section create error:", err);
      CommonToaster("Failed to create section", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Section</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Section Type</label>
          <input
            type="text"
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg border-gray-300"
            placeholder="e.g. hero, content, gallery"
          />
        </div>

        {/* Add Field */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Add Field</h3>
          <div className="flex space-x-3 mb-3">
            <input
              type="text"
              value={newField.key}
              onChange={(e) => setNewField({ ...newField, key: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg border-gray-300"
              placeholder="Field key (e.g. title, subtitle, image)"
            />
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
              className="px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="multilang">Multilang (EN/VN)</option>
              <option value="image">Image</option>
              <option value="string">String</option>
              <option value="array">Array</option>
            </select>
            <button
              type="button"
              onClick={handleAddField}
              className="px-4 py-2 bg-[rgb(0,114,147)] text-white rounded-lg hover:bg-[rgb(0,90,120)]"
            >
              Add
            </button>
          </div>

          {/* Field List */}
          {fields.length > 0 && (
            <ul className="space-y-2">
              {fields.map((f, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center px-3 py-2 border rounded-lg"
                >
                  <span>
                    <strong>{f.key}</strong> ({f.type})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(i)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-gradient-to-r from-[rgb(0,114,147)] to-[rgb(0,76,112)] hover:from-[rgb(0,100,130)] hover:to-[rgb(0,60,95)] disabled:opacity-75"
        >
          {isLoading ? "Saving..." : "Create Section"}
        </button>
      </form>
    </div>
  );
}
