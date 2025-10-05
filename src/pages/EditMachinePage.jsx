// pages/EditMachinePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { getMachinePageById, updateMachinePage } from "../Api/api";
import MachinePageCreate from "../pages/MachineEditScreen";

const EditMachinePage = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMachinePageById(id);
        const page = res.data.data;

        if (!page) {
          message.error("❌ Page not found");
          return;
        }

        // ✅ Transform backend data into form structure
        const formattedData = {
          categoryId: page.category?._id || "",
          title: page.title || { en: "", vn: "" },
          description: page.description || { en: "", vn: "" },
          slug: page.slug || "",
          metaTitle: page.seo?.metaTitle || "",
          metaDescription: page.seo?.metaDescription || "",
          keywords: page.seo?.keywords?.join(", ") || "",
          sections: page.sections || [],
          banner: page.banner || "",
        };

        setInitialData(formattedData);
      } catch (err) {
        console.error(err);
        message.error("❌ Failed to load machine page");
      }
    })();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateMachinePage(id, formData);
      message.success("✅ Page updated successfully");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to update page");
    }
  };

  if (!initialData) return <p className="text-white p-6">Loading...</p>;

  return (
    <MachinePageCreate
      isEdit
      initialData={initialData}
      onSubmitUpdate={handleUpdate}
    />
  );
};

export default EditMachinePage;
