export default function TopBar({ cartCount, onCartClick }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 18,
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginBottom: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/jsf-logo.jpg"
            alt="JSF logga"
            style={{
              height: 56,
              width: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </div>

        <button
          type="button"
          onClick={onCartClick}
          style={secondaryButtonStyle}
        >
          🛒 Kundkorg ({cartCount})
        </button>
      </div>
    </div>
  );
}

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "white",
  color: "black",
  cursor: "pointer",
  fontWeight: "bold",
};