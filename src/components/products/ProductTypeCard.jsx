export default function ProductTypeCard({ type, onSelect }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <img
        src={type.image}
        alt={type.title}
        style={{
          width: "100%",
          height: 220,
          objectFit: "cover",
          borderRadius: 14,
          marginBottom: 16,
        }}
      />

      <div style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>
        {type.title}
      </div>

      <div style={{ color: "#555", lineHeight: 1.5, marginBottom: 18 }}>
        {type.text}
      </div>

      <button
        type="button"
        onClick={onSelect}
        style={{
          padding: "12px 18px",
          borderRadius: 8,
          border: "none",
          background: "black",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Välj {type.title}
      </button>
    </div>
  );
}