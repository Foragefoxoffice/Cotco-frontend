//pages/EditMachinePage.jsx
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
        setInitialData(res.data.data); // 👈 set existing page data
      } catch (err) {
        message.error("❌ Failed to load machine page");
      }
    })();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateMachinePage(id, formData);
      message.success("✅ Page updated");
    } catch (err) {
      message.error("❌ Failed to update page");
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <MachinePageCreate
      isEdit
      initialData={initialData}
      onSubmitUpdate={handleUpdate}
    />
  );
};

export default EditMachinePage;
