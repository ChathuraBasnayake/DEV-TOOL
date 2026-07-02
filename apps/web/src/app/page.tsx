export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "24px",
      position: "relative",
    }}>
      <div className="glass-panel" style={{
        maxWidth: "640px",
        width: "100%",
        padding: "48px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(99, 102, 241, 0.1)",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#818cf8",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          ✨ Dynamic Cloud Modeler
        </div>

        <h1 style={{ margin: "8px 0" }}>
          CanvasCloud
        </h1>

        <p style={{ fontSize: "1.1rem" }}>
          An interactive, visual canvas editor for building, compiling, and securing your AWS Terraform infrastructure in real-time.
        </p>

        <div style={{
          display: "flex",
          gap: "16px",
          marginTop: "16px",
        }}>
          <button className="btn-primary" style={{
            fontSize: "1rem",
            padding: "12px 28px",
          }}>
            Open Designer
          </button>
        </div>
      </div>
    </main>
  );
}
