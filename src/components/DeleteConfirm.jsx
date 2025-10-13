import React, { useState } from "react";
import { Modal, Button } from "antd";
import { Trash2 } from "lucide-react";

const DeleteConfirm = ({ onConfirm }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Delete Icon */}
      <Trash2
        size={16}
        style={{ color: "red", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation(); // prevent collapse toggle
          setOpen(true); // open modal
        }}
      />

      {/* Controlled Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={() => setOpen(false)}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 18px",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="continue"
            type="primary"
            danger
            style={{
              backgroundColor: "#E50000", // red
              border: "none",
              borderRadius: "6px",
              padding: "6px 18px",
              fontWeight: 600,
            }}
            onClick={() => {
              onConfirm(); // run delete
              setOpen(false);
            }}
          >
            Continue
          </Button>,
        ]}
        bodyStyle={{
          backgroundColor: "#171717", 
          color: "#fff", // white text
          borderRadius: "8px",
          padding: "0px",
        }}
      >
        <h3 style={{ color: "#fff", fontSize: "18px", marginBottom: "8px" }}>
          Are you sure absolutely sure?
        </h3>
        <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6" }}>
          This action cannot be undone. This will permanently delete your
          section and remove its data.
        </p>
      </Modal>
    </>
  );
};

export default DeleteConfirm;
