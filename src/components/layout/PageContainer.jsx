export default function PageContainer({ children }) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "30px 20px 60px",
      }}
    >
      {children}
    </div>
  );
}