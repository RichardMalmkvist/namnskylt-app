export default function TopBar({
  cartCount = 0,
  onCartClick,
  onLoginClick,
  onLogoClick,
}) {
  return (
    <div style={wrapperStyle}>
      <button
        type="button"
        onClick={onLogoClick}
        style={logoButtonStyle}
        aria-label="Gå till startsidan"
      >
        <img
          src="/jsf-logo.jpg"
          alt="JSF logga"
          style={logoImageStyle}
        />
      </button>

      <div style={actionsStyle}>
        {onLoginClick && (
          <button
            type="button"
            onClick={onLoginClick}
            style={secondaryButtonStyle}
          >
            Logga in
          </button>
        )}

        {onCartClick && (
          <button
            type="button"
            onClick={onCartClick}
            style={secondaryButtonStyle}
          >
            🛒 Kundkorg ({cartCount})
          </button>
        )}
      </div>
    </div>
  );
}

const wrapperStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
  background: "white",
  border: "1px solid #ddd",
  borderRadius: 16,
  padding: "20px 28px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const logoButtonStyle = {
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const logoImageStyle = {
  height: 56,
  width: "auto",
  display: "block",
  objectFit: "contain",
};

const actionsStyle = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "white",
  color: "black",
  cursor: "pointer",
  fontWeight: "bold",
};