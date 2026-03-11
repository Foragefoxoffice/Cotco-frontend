export default function Maintenance() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        🚧 Site Under Maintenance
      </h1>
      <p style={{ fontSize: "20px", maxWidth: "600px" }}>
        We’re currently performing scheduled updates to improve your experience.
        Please check back shortly.
      </p>
    </div>
  );
}
