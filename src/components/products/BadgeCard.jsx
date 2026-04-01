export default function BadgeCard({ badge, onSelect }) {
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
        src={badge.image}
        alt={badge.name}
        style={{
          width: "100%",
          height: 140,
          objectFit: "contain",
          background: "#f9f9f9",
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <div
        style={{
          fontWeight: "bold",
          fontSize: 22,
          marginBottom: 8,
        }}
      >
        {badge.name}
      </div>

      <div
        style={{
          color: "#555",
          marginBottom: 16,
          minHeight: 70,
          lineHeight: 1.4,
        }}
      >
        {badge.desc}
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
        Välj denna skylt
      </button>
    </div>
  );
}